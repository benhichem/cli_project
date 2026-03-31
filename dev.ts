import { bot } from "./src/bot.ts";
import { initDb } from "./src/db/index.ts";
import { startScheduler } from './src/scheduler';

initDb()
bot.start();
startScheduler(bot);