import { Bot } from "grammy";
import prisma from "../utils/prisma";
import { getVoteCountsText } from "../utils/reply";
import { getManagePollKeyboard } from "../utils/keyboards";
import { BotTrigger, BotContext } from "../utils/types";

class ViewPollTrigger implements BotTrigger {
  hears = /\/view_c/;

  callback = /view_c/;

  description = "View and manage poll";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    // callback pollId
    let pollId: string;
    if (ctx.callbackQuery?.data) {
      pollId = ctx.callbackQuery.data.split("_")[1];
    } else if (ctx.message?.text) {
      pollId = ctx.message?.text?.split("_")[1];
    } else {
      await ctx.reply("No poll ID found.");
      return;
    }

    console.log(`Getting poll ID ${pollId}...`);
    const loadingMessage = await ctx.reply("Getting poll...");

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        votes: true,
        proposal: true,
      },
    });

    if (!poll) {
      await ctx.reply("Poll not found.");
      return;
    }

    await bot.api.deleteMessage(
      loadingMessage.chat.id,
      loadingMessage.message_id,
    );

    const text = getVoteCountsText(
      poll.votes,
      poll.proposal.ipId,
      poll.proposal.title,
    );

    const reply = await ctx.reply(text, {
      reply_markup: await getManagePollKeyboard(poll.id),
      parse_mode: "HTML",
    });
    await prisma.pollTelegramMessage.create({
      data: {
        pollId: poll.id,
        messageId: String(reply.message_id),
        chatId: String(reply.chat.id),
      },
    });
    console.log(
      `Saved poll message ID ${reply.message_id} and chat ID ${reply.chat.id} for poll ID ${poll.id} to database.`,
    );
  };
}

const viewPollTrigger = new ViewPollTrigger();

export default viewPollTrigger;
