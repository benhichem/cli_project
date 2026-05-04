import { initDb } from "./src/db/index"
import { bot } from "./src/bot"
import { startServer } from "./src/server"
import { startScheduler } from "./src/scheduler"
import { ownerOnly } from "./src/middleware/auth"
import { registerTaskCommands } from "./src/commands/tasks"
import { registerRewriteCommands } from "./src/commands/rewrite"
import { registerReminderCommands } from "./src/commands/reminders"
import { registerWalkCommand } from "./src/commands/walk"
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
registerWalkCommand(bot)

// 4. Register help + unknown-command fallback — AFTER other commands
registerHelpCommand(bot)

// 5. Register global error handler — LAST
registerErrorHandler(bot)

// 6. Start webhook server
startServer()

// 7. Start reminder scheduler
startScheduler(bot)

// 8. Keep-alive: ping own /health every 10 min to prevent Render free-tier spin-down
const SERVICE_URL = process.env.SERVICE_URL
if (SERVICE_URL) {
  setInterval(() => {
    fetch(`${SERVICE_URL}/health`).catch(() => {})
  }, 10 * 60 * 1000)
}
