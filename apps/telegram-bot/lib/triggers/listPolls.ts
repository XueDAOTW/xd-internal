import { Bot } from "grammy";
import prisma from "../utils/prisma";
import { BotTrigger, BotContext } from "../utils/types";
import { createNewPollKeyboard } from "../utils/keyboards";

class ListPollsTrigger implements BotTrigger {
  command = "polls";

  callback = "polls";

  description = "List your polls";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const loadingMessage = await ctx.reply("Getting your polls...");
    try {
      // query for polls created by user
      const polls = await prisma.poll.findMany({
        where: {
          createdBy: {
            telegramUsername: ctx.from?.username,
          },
        },
        include: {
          proposal: true,
          votes: true,
        },
        orderBy: {
          proposal: {
            ipId: "asc",
          },
        },
      });

      await bot.api.deleteMessage(
        loadingMessage.chat.id,
        loadingMessage.message_id,
      );

      const pollStrings: string[] = polls.map((poll) => {
        return `<b>XIP ${poll.proposal.ipId} ${poll.proposal.title}</b> (${poll.pollStatus})\n/view_${poll.id}`;
      });

      await ctx.reply(
        `🗳 <b>Your Proposal Polls</b>\n\n${pollStrings.join("\n\n")}`,
        {
          reply_markup: createNewPollKeyboard,
          parse_mode: "HTML",
        },
      );
    } catch (e) {
      console.error(e);
      await bot.api.deleteMessage(
        loadingMessage.chat.id,
        loadingMessage.message_id,
      );
      await ctx.reply("Error getting polls.");
    }
  };
}

const listPollsTrigger = new ListPollsTrigger();

export default listPollsTrigger;
