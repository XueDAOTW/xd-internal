import { Bot } from "grammy";
import prisma from "../utils/prisma";
import { PollStatus } from "@xd/database";
import { Message } from "grammy/types";
import {
  cancelNewPollKeyboard,
  getNewPollCreatedKeyboard,
} from "../utils/keyboards";
import { BotContext, BotConversation } from "../utils/types";

const botUsername = process.env.BOT_USERNAME;

class NewProposalConversation {
  name = "newProposal";

  conversationFn = (bot: Bot<BotContext>) => {
    return async (conversation: BotConversation, ctx: BotContext) => {
      await ctx.reply("What is the proposal number/XIP #? (e.g. '9')", {
        reply_markup: cancelNewPollKeyboard,
      });
      const ipId = await conversation.form.number();

      const foundProposal = await prisma.proposal.findUnique({
        where: {
          ipId,
        },
        include: {
          polls: {
            include: {
              createdBy: {
                select: {
                  telegramUsername: true,
                },
              },
            },
          },
        },
      });

      let proposalId: string;
      let proposalName: string;

      let loadingMessage: Message.TextMessage;
      if (foundProposal) {
        proposalId = foundProposal.id;
        proposalName = foundProposal.title;
        // check if there are existing open polls for proposal
        const foundOpenPoll = foundProposal.polls.find(
          (poll) => poll.pollStatus === PollStatus.OPEN,
        );
        if (foundOpenPoll) {
          // if open poll is created by current user, give instructions to manage
          const createdByYou =
            foundOpenPoll.createdBy.telegramUsername === ctx.from?.username;
          let text = `There is already an open poll for XIP ${ipId}, opened by ${
            createdByYou
              ? "you"
              : "@" + foundOpenPoll.createdBy.telegramUsername
          }. Please cancel that poll first.`;
          if (createdByYou) {
            text += `\n\nUse /view_${foundOpenPoll.id} to manage.`;
          }

          await ctx.reply(text);
          return;
        }
        loadingMessage = await ctx.reply(
          `Creating poll for XIP ${ipId} ${proposalName}...`,
        );
      } else {
        await ctx.reply(
          "What is the name of the proposal? (e.g. 'Membership')",
          {
            reply_markup: cancelNewPollKeyboard,
          },
        );
        proposalName = await conversation.form.text();
        await ctx.reply(
          "What is the goal of the proposal? (e.g. 'Add a membership program to XD to build community.')",
          {
            reply_markup: cancelNewPollKeyboard,
          },
        );
        const description = await conversation.form.text();
        await ctx.reply("What is the link to the proposal?", {
          reply_markup: cancelNewPollKeyboard,
        });
        const link = await conversation.form.text();
        loadingMessage = await ctx.reply(
          `Creating proposal and poll for XIP ${ipId} ${proposalName}...`,
        );
        // for now create a new proposal until we have in-app proposal management
        const proposal = await prisma.proposal.create({
          data: {
            ipId,
            title: proposalName,
            link,
            description,
          },
        });
        proposalId = proposal.id;
      }
      console.log(`Creating poll for XIP ${ipId} ${proposalName}...`);
      // create a poll for the proposal
      const poll = await prisma.poll.create({
        data: {
          pollStatus: PollStatus.OPEN,
          createdBy: {
            connect: {
              telegramUsername: ctx.from?.username,
            },
          },
          proposal: {
            connect: {
              id: proposalId,
            },
          },
        },
      });
      await bot.api.deleteMessage(
        loadingMessage.chat.id,
        loadingMessage.message_id,
      );
      await ctx.reply(
        `✅ Poll for <b>XIP ${ipId} ${proposalName}</b> created.
    
👉 To view and manage the poll, click the "Manage Poll" button or use the /view_${
          poll.id
        } command.

👉 To share the poll with a group:
1. Click the Share Poll" button and select the group chat, or type "${
          botUsername || "@xue_dao_bot"
        } poll" in the other chat. 
2. Wait for your poll to show up, then select the poll to send it.`,
        {
          reply_markup: getNewPollCreatedKeyboard(poll.id),
          parse_mode: "HTML",
        },
      );
    };
  };
}

const newProposalConversation = new NewProposalConversation();

export default newProposalConversation;
