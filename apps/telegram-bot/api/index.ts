import { webhookCallback } from "grammy";
import bot from "../lib/bot";

export default webhookCallback(bot, "http");
