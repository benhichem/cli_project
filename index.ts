import { initDb } from "./src/db/index"
import { bot } from "./src/bot"
import { startServer } from "./src/server"
import { startScheduler } from "./src/scheduler"
import { ownerOnly } from "./src/middleware/auth"
import { registerTaskCommands } from "./src/commands/tasks"
import { registerRewriteCommands } from "./src/commands/rewrite"
import { registerReminderCommands } from "./src/commands/reminders"
import { registerHelpCommand } from "./src/commands/help"
import { registerErrorHandler } from "./src/middleware/errorHandler"

// 1. Init DB (creates tables if not exist)
initDb()

// 2. Apply auth middleware globally — must be first middleware
bot.use(ownerOnly())

// 3. Register command handlers
registerTaskCommands(bot)
registerRewriteCommands(bot)
registerReminderCommands(bot)

// 4. Register help + unknown-command fallback — AFTER other commands
registerHelpCommand(bot)

// 5. Register global error handler — LAST
registerErrorHandler(bot)

// 6. Start webhook server
startServer()

// 7. Start reminder scheduler
startScheduler(bot)
