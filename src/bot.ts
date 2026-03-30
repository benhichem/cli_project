import { Bot } from "grammy";
import { config } from "./config.ts";
import { ownerOnly } from "./middleware/auth.ts";
import { registerTaskCommands } from "./commands/tasks.ts";

export const bot = new Bot(config.telegramToken);

bot.use(ownerOnly());

bot.on('message', (ctx, next) => {
    console.log(ctx.message)
    return next()
})
bot.command("ping", (ctx) => ctx.reply("pong"));

registerTaskCommands(bot);
