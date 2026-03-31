import type { Bot } from "grammy";
import { BotError } from "grammy";

export function registerErrorHandler(bot: Bot): void {
  bot.catch(async (err: BotError) => {
    console.log(`[ERROR] ${new Date().toISOString()} ${err.error}`);
    try {
      await err.ctx.reply("Something went wrong. Please try again.", { parse_mode: "HTML" });
    } catch {
      // reply failed, swallow
    }
  });
}
