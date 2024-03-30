import { Bot, Context, GrammyError, HttpError, session } from "grammy";
import * as dotenv from "dotenv";
import { conversations, createConversation } from "@grammyjs/conversations";
import prisma from "./utils/prisma";
import triggers from "./triggers";
import convos from "./conversations";
import { BotContext } from "./utils/types";

dotenv.config();

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new Error("BOT_TOKEN is required");
}

const bot = new Bot<BotContext>(botToken);

bot.use(
  session({
    getSessionKey: (ctx: Context): string | undefined => {
      return ctx.from?.id.toString();
    },
    initial: () => ({}),
  }),
);

bot.use(conversations());

/**
 * Setup bot conversations
 */
convos.forEach((convo) => {
  bot.use(createConversation(convo.conversationFn(bot), convo.name));
});

/**
 * Setup bot triggers
 */
triggers.forEach((trigger) => {
  if (trigger.command) {
    console.log(`Registering command ${trigger.command}`);
    bot.command(trigger.command, async (ctx) => {
      await trigger.execute(bot, ctx);
    });
  }
  if (trigger.callback) {
    console.log(`Registering callback query ${trigger.callback}`);
    bot.callbackQuery(trigger.callback, async (ctx) => {
      await trigger.execute(bot, ctx);
    });
  }
  if (trigger.hears) {
    console.log(`Registering listener ${trigger.hears}`);
    bot.hears(trigger.hears, async (ctx) => {
      await trigger.execute(bot, ctx);
    });
  }
  if (trigger.inlineQuery) {
    console.log(`Registering inline query ${trigger.inlineQuery}`);
    bot.inlineQuery(trigger.inlineQuery, async (ctx) => {
      await trigger.execute(bot, ctx);
    });
  }
});

/**
 * Setup event handlers last
 */
bot.on("chosen_inline_result", async (ctx) => {
  console.log("Chosen inline result", ctx.chosenInlineResult);
  const pollId = ctx.chosenInlineResult.result_id;
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
  });
  if (!poll) {
    console.log(`Poll with ID ${pollId} not found.`);
    return;
  }
  if (!ctx.chosenInlineResult.inline_message_id) {
    console.log("No inline message ID found.");
    return;
  }

  await prisma.pollTelegramMessage.create({
    data: {
      pollId: poll.id,
      messageId: ctx.chosenInlineResult.inline_message_id,
    },
  });
  console.log(
    `Saved poll message ID ${ctx.chosenInlineResult.inline_message_id} for poll ID ${poll.id} to database.`,
  );
});
bot.on("callback_query:data", async (ctx) => {
  console.log("Unknown button event with payload", ctx.callbackQuery.data);
  await ctx.answerCallbackQuery("Unknown event");
});
bot.on("inline_query", (ctx) => {
  ctx.answerInlineQuery([]);
});

/**
 * Error handling
 */
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
  // Provide error message to user
  if (ctx.callbackQuery) {
    ctx.answerCallbackQuery({
      text: "Unexpected error occurred! Please contact yhterrance on Telegram for help: https://t.me/yhterrance",
      show_alert: true,
    });
  } else if (ctx.message) {
    ctx.reply(
      "Unexpected error occurred! Please contact yhterrance on Telegram for help: https://t.me/yhterrance",
    );
  } else if (ctx.inlineQuery) {
    ctx.answerInlineQuery([]);
  } else {
    console.error("Unknown update type:", ctx.update);
  }
});

export default bot;
