import { Bot } from "grammy";
import prisma from "../../utils/prisma";
import { PollStatus } from "@xd/database";
import { InlineQueryResult } from "grammy/types";
import { getVoteKeyboard } from "../../utils/keyboards";
import { BotTrigger, BotContext } from "../../utils/types";

class QueryPollsTrigger implements BotTrigger {
  inlineQuery = /poll/;

  description = "Query polls inline";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    console.log("Inline query received", ctx.inlineQuery?.query);
    if (!ctx.from?.username) {
      console.log("No username found for user");
      await ctx.answerInlineQuery([]);
      return;
    }
    if (!ctx.inlineQuery?.query) {
      console.log("No query provided");
      await ctx.answerInlineQuery([]);
      return;
    }
    // query for polls created by user and filter by Xip id if provided
    const args = ctx.inlineQuery.query.split(" ");
    const polls = await prisma.poll.findMany({
      where: {
        createdBy: {
          telegramUsername: ctx.from.username,
        },
        pollStatus: PollStatus.OPEN,
        ...(args.length > 1 && {
          id: args[1],
        }),
      },
      include: {
        proposal: true,
      },
    });

    console.log(
      `Found ${polls.length} open polls for user ${ctx.from.username}`,
    );
    const results: InlineQueryResult[] = polls.map((poll) => {
      return {
        input_message_content: {
          message_text: `Vote on <b>XIP ${poll.proposal.ipId} ${poll.proposal.title}</b>

👉 ${poll.proposal.description}
🔗 Link: ${poll.proposal.link}`,
          parse_mode: "HTML",
        },
        reply_markup: getVoteKeyboard(poll.id),
        type: "article",
        id: poll.id.toString(),
        title: `Vote on XIP ${poll.proposal.ipId} ${poll.proposal.title}`,
      };
    });

    await ctx.answerInlineQuery(
      results,
      { cache_time: results.length > 1 ? 30 : 300 }, // cache longer if single result
    );
  };
}

const queryPollsTrigger = new QueryPollsTrigger();

export default queryPollsTrigger;
