import { Bot } from "grammy";
import { BotTrigger, BotContext } from "../../utils/types";
import { PollStatus } from "@xd/database";
import prisma from "../../utils/prisma";
import { getManagePollKeyboard } from "../../utils/keyboards";
import { getVoteCountsText } from "../../utils/reply";

abstract class ManagePollTrigger implements BotTrigger {
  abstract callback: string | RegExp;

  abstract description: string;

  abstract pollStatus: PollStatus;

  abstract successMessage: string;

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const pollId = ctx.callbackQuery?.data?.split("_")[1];
    // check if user has permissions to update poll
    if (!ctx.from?.username) {
      await ctx.answerCallbackQuery(
        "Command must be sent from a user with a username.",
      );
      return;
    }
    // check if poll is open and created by current user
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        createdBy: true,
        votes: true,
        proposal: true,
      },
    });
    if (!poll) {
      await ctx.answerCallbackQuery("No poll found.");
      return;
    }
    if (poll.pollStatus !== PollStatus.OPEN) {
      await ctx.answerCallbackQuery("Poll is not open, cannot update status");
      return;
    }
    if (poll.createdBy.telegramUsername !== ctx.from.username) {
      await ctx.answerCallbackQuery("You did not create this poll.");
      return;
    }
    console.log(
      `Setting poll status for poll ID ${poll.id} to ${this.pollStatus}...`,
    );
    const updatedPoll = await prisma.poll.update({
      where: {
        id: poll.id,
      },
      data: {
        pollStatus: this.pollStatus,
      },
    });
    console.log(`Poll status updated poll ID ${poll.id}!`);
    // mark inline messages with status
    const telegramMessages = await prisma.pollTelegramMessage.findMany({
      where: {
        pollId: pollId,
      },
    });
    const voteCountsText = getVoteCountsText(
      poll.votes,
      poll.proposal.ipId,
      poll.proposal.title,
    );

    for (const telegramMessage of telegramMessages) {
      if (!telegramMessage.chatId) {
        // edit voting poll message
        console.log(
          `Editing inline message ID ${telegramMessage.messageId}...`,
        );
        if (this.pollStatus === PollStatus.CLOSED) {
          await bot.api.editMessageTextInline(
            telegramMessage.messageId,
            `${voteCountsText}\n\n<b>This poll is now ${this.pollStatus}</b>`,
            {
              parse_mode: "HTML",
            },
          );
        } else if (this.pollStatus === PollStatus.CANCELED) {
          await bot.api.editMessageTextInline(
            telegramMessage.messageId,
            `Vote on <b>XIP ${poll.proposal.ipId} ${poll.proposal.title}</b>\n\n<b>This poll is now ${this.pollStatus}</b>`,
            {
              parse_mode: "HTML",
            },
          );
        }
        console.log(`Inline message ID ${telegramMessage.messageId} edited.`);
      } else {
        // edit management message
        console.log(
          `Editing message ID ${telegramMessage.messageId} in chat ID ${telegramMessage.chatId}...`,
        );
        await bot.api.editMessageText(
          Number(telegramMessage.chatId),
          Number(telegramMessage.messageId),
          voteCountsText,
          {
            parse_mode: "HTML",
            reply_markup: await getManagePollKeyboard(updatedPoll.id),
          },
        );
        console.log(
          `Message ID ${telegramMessage.messageId} in chat ID ${telegramMessage.chatId} edited.`,
        );
      }
    }
    await ctx.answerCallbackQuery({
      text: this.successMessage,
      show_alert: true,
    });
  };
}

export default ManagePollTrigger;
