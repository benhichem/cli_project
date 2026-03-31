import { Bot } from "grammy";
import { config } from "./config.ts";
import { ownerOnly } from "./middleware/auth.ts";
import { registerTaskCommands } from "./commands/tasks.ts";
import { registerReminderCommands } from "./commands/reminders.ts";
import { registerRewriteCommands } from "./commands/rewrite.ts";
import { registerHelpCommand } from "./commands/help.ts";
import { registerErrorHandler } from "./middleware/errorHandler.ts";
import { startScheduler } from "./scheduler.ts";

export const bot = new Bot(config.telegramToken);

bot.use(ownerOnly());

bot.on('message', (ctx, next) => {
    console.log(ctx.message)
    return next()
})
bot.command("ping", (ctx) => ctx.reply("pong", { parse_mode: "HTML" }));

registerTaskCommands(bot);
registerReminderCommands(bot);
registerRewriteCommands(bot);
registerHelpCommand(bot);
registerErrorHandler(bot);
startScheduler(bot);
