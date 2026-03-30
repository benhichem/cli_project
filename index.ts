import { initDb } from "./src/db/index.ts";
import { startServer } from "./src/server.ts";

initDb()
startServer();
