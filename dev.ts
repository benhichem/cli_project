import { bot } from "./src/bot.ts";
import { initDb } from "./src/db/index.ts";

initDb()
bot.start();
