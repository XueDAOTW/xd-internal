import { Bot } from "grammy";
import { PollStatus, VoteType } from "@xd/database";
import prisma from "../../utils/prisma";
import { getVoteCountsText } from "../../utils/reply";
import { getManagePollKeyboard } from "../../utils/keyboards";
import { BotTrigger, BotContext } from "../../utils/types";
import { hasNFT } from "../../utils/token";

abstract class VoteTrigger implements BotTrigger {
  abstract callback: string | RegExp;

  abstract description: string;

  abstract voteType: VoteType;

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const pollId = ctx.callbackQuery?.data?.split("_")[1];

    const username = ctx.from?.username;
    if (!username) {
      await ctx.answerCallbackQuery(
        "Command must be sent from a user with a username.",
      );
      return;
    }
    console.log(`User ${username} is voting on poll ID ${pollId}...`);
    const user = await prisma.user.findUnique({
      where: {
        telegramUsername: username,
      },
    });
    // check if user has permissions to vote
    if (!user) {
      console.log(`User ${username} not found in database.`);
      await ctx.answerCallbackQuery({
        text: "You must be a member to vote.",
        show_alert: true,
      });
      return;
    }

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });
    if (!poll) {
      console.log(`Poll ID ${pollId} not found in database.`);
      await ctx.answerCallbackQuery({
        text: "No poll found.",
        show_alert: true,
      });
      return;
    }
    if (poll.pollStatus !== PollStatus.OPEN) {
      console.log(`Poll ID ${pollId} is not open.`);
      await ctx.answerCallbackQuery({
        text: "Poll is not open, cannot vote",
        show_alert: true,
      });
      return;
    }

    // check if user has already voted
    const vote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        pollId: poll.id,
      },
    });
    const voteType = this.voteType;
    if (vote) {
      if (vote.voteType === voteType) {
        console.log(
          `User ${user.telegramUsername} has already voted ${voteType}.`,
        );
        await ctx.answerCallbackQuery({
          text: `You have already voted ${voteType}!`,
          show_alert: true,
        });
        return;
      } else {
        console.log(
          `User ${user.telegramUsername} has already voted, updating vote to ${voteType}...`,
        );
        await prisma.vote.update({
          where: {
            id: vote.id,
          },
          data: {
            voteType,
          },
        });
        await ctx.answerCallbackQuery({
          text: `Updated vote to ${voteType}!`,
          show_alert: true,
        });
      }
    } else {
      const hasAccess = await hasNFT(user.ethAddress);
      if (!hasAccess) {
        await ctx.answerCallbackQuery({
          text: "You must own a voting NFT to vote.",
          show_alert: true,
        });
        return;
      }
      await prisma.vote.create({
        data: {
          pollId: poll.id,
          userId: user.id,
          voteType,
        },
      });
      console.log(
        `User ${user.telegramUsername} voted ${voteType} on poll ID ${poll.id}!`,
      );
      await ctx.answerCallbackQuery({
        text: `You voted ${voteType}!`,
        show_alert: true,
      });
    }

    await this.updatePollMessageVoteCounts(bot, poll.id);
  };

  updatePollMessageVoteCounts = async (
    bot: Bot<BotContext>,
    pollId: string,
  ) => {
    const telegramMessages = await prisma.pollTelegramMessage.findMany({
      where: {
        pollId: pollId,
      },
    });

    if (telegramMessages.length === 0) {
      console.log(`No messages found for poll ID ${pollId}.`);
      return;
    }

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        proposal: true,
        votes: true,
      },
    });

    if (!poll) {
      console.log(`No poll found for poll ID ${pollId}.`);
      return;
    }
    const text = getVoteCountsText(
      poll.votes,
      poll.proposal.ipId,
      poll.proposal.title,
    );

    for (const telegramMessage of telegramMessages) {
      console.log(telegramMessage);
      if (!telegramMessage.chatId) {
        console.log(
          `No chat ID found for message ID ${telegramMessage.id}. Skipping vote counts message editing...`,
        );
      } else {
        console.log(
          `Editing message ID ${telegramMessage.messageId} in chat ${telegramMessage.chatId}...`,
        );
        await bot.api.editMessageText(
          Number(telegramMessage.chatId),
          Number(telegramMessage.messageId),
          text,
          {
            parse_mode: "HTML",
            reply_markup: await getManagePollKeyboard(poll.id),
          },
        );
      }
    }
  };
}

export default VoteTrigger;
