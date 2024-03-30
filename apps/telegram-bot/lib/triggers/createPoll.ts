import { Bot } from "grammy";
import prisma from "../utils/prisma";
import { BotTrigger, BotContext } from "../utils/types";
import { hasNFT } from "../utils/token";

class CreatePollTrigger implements BotTrigger {
  command = "create";

  callback = "createNewPoll";

  description = "Create a poll for proposal";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const message = await ctx.reply("Checking permissions...");
    const username = ctx.from?.username;

    if (!username) {
      await ctx.reply("Command must be sent from a user with a username.");
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        telegramUsername: username,
      },
    });

    if (!user) {
      await ctx.reply("You must be a registered member to submit a proposal.");
      return;
    }
    const hasAccess = await hasNFT(user.ethAddress);
    if (!hasAccess) {
      await ctx.reply("You must own a voting NFT to submit a proposal.");
      return;
    }
    await bot.api.deleteMessage(message.chat.id, message.message_id);
    await ctx.conversation.enter("newProposal");
  };
}

const createPollTrigger = new CreatePollTrigger();

export default createPollTrigger;
