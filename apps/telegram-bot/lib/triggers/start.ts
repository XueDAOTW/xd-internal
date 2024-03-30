import { Bot } from "grammy";
import { BotTrigger, BotContext } from "../utils/types";
import createPollTrigger from "./createPoll";
import listPollsTrigger from "./listPolls";

class StartTrigger implements BotTrigger {
  command = "start";

  description = "Get started with this bot";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const topCommands = [createPollTrigger, listPollsTrigger];
    const url = "https://hackmd.io/@yhterrance/xuedaovotingbot";
    let text =
      "Welcome to the XueDAO Voting Bot! Here are some useful commands to get you started:\n\n";
    for (const command of topCommands) {
      text += `/${command.command} - ${command.description}\n`;
    }
    text += `\nYou can also visit ${url} for a guide on how to use this bot. Note: only members holding voting NFTs can submit polls.`;
    await ctx.reply(text);
  };
}

const startTrigger = new StartTrigger();

export default startTrigger;
