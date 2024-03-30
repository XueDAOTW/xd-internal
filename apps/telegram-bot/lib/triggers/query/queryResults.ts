import { Bot } from "grammy";
import prisma from "../../utils/prisma";
import { InlineQueryResult } from "grammy/types";
import { getVoteCountsText } from "../../utils/reply";
import { BotTrigger, BotContext } from "../../utils/types";

class QueryResultsTrigger implements BotTrigger {
  inlineQuery = /results/;

  description = "Query results inline";

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
    // check user is registered
    const user = await prisma.user.findUnique({
      where: {
        telegramUsername: ctx.from.username,
      },
    });
    if (!user) {
      console.log("User not found");
      await ctx.answerInlineQuery([]);
      return;
    }

    // query for polls created by user and filter by XIP id if provided
    const args = ctx.inlineQuery.query.split(" ");
    if (args.length < 2) {
      await ctx.answerInlineQuery([]);
      return;
    }
    const poll = await prisma.poll.findUnique({
      where: {
        id: args[1],
      },
      include: {
        proposal: true,
        votes: true,
      },
    });

    if (!poll) {
      await ctx.answerInlineQuery([]);
      return;
    }

    const text = getVoteCountsText(
      poll.votes,
      poll.proposal.ipId,
      poll.proposal.title,
    );

    const results: InlineQueryResult[] = [
      {
        input_message_content: {
          message_text: text,
          parse_mode: "HTML",
        },
        type: "article",
        id: poll.id.toString(),
        title: `Vote Results: XIP ${poll.proposal.ipId} ${poll.proposal.title}`,
      },
    ];

    await ctx.answerInlineQuery(results, { cache_time: 0 });
  };
}

const queryResultsTrigger = new QueryResultsTrigger();

export default queryResultsTrigger;
