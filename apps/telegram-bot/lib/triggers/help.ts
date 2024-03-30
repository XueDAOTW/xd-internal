import { Bot } from "grammy";
import { BotTrigger, BotContext } from "../utils/types";
import createPollTrigger from "./createPoll";
import listPollsTrigger from "./listPolls";

class HelpTrigger implements BotTrigger {
  command = "help";

  description = "Get help";

  execute = async (bot: Bot<BotContext>, ctx: BotContext) => {
    const topCommands = [createPollTrigger, listPollsTrigger];
    let text = "Useful commands:\n\n";
    for (const command of topCommands) {
      text += `/${command.command} - ${command.description}\n`;
    }
    await ctx.reply(text);
  };
}

const helpTrigger = new HelpTrigger();

export default helpTrigger;
