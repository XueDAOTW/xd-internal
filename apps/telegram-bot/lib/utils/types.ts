import { Bot } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";

export type BotContext = Context & ConversationFlavor;

export type BotConversation = Conversation<BotContext>;

export interface BotTrigger<T = BotContext> {
  command?: string;
  hears?: string | RegExp;
  callback?: string | RegExp;
  inlineQuery?: string | RegExp;
  description: string;
  execute: (bot: Bot<BotContext>, ctx: T) => Promise<void>;
}
