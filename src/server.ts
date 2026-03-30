import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";
import { config } from "./config.ts";

const handleUpdate = webhookCallback(bot, "bun");

export function startServer(): void {
  Bun.serve({
    port: config.port,
    fetch(req) {
      const url = new URL(req.url);
      if (req.method === "POST" && url.pathname === "/webhook") {
        return handleUpdate(req);
      }
      if (req.method === "GET" && url.pathname === "/health") {
        return Response.json({ ok: true });
      }
      return new Response("Not Found", { status: 404 });
    },
  });
  console.log(`Bot running on port ${config.port}`);
}
