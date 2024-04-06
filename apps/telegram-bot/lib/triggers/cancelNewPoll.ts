import { Bot } from "grammy";
import { BotTrigger, BotContext } from "../utils/types";
import newProposalConversation from "../conversations/newProposal";

class CancelNewPollTrigger implements BotTrigger {
  callback = "cancelNewPoll";

  description = "Cancel poll creation conversation";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    console.log("Exiting conversation:", newProposalConversation.name);

    ctx.editMessageText("Cancelled new poll.");
    await ctx.conversation.exit(newProposalConversation.name);
    await ctx.answerCallbackQuery("Cancelled new poll");
  };
}

const cancelNewPollTrigger = new CancelNewPollTrigger();

export default cancelNewPollTrigger;
