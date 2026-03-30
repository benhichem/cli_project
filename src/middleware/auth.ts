import type { Context, MiddlewareFn } from "grammy";
import { config } from "../config.ts";

export function ownerOnly(): MiddlewareFn<Context> {
  return (ctx, next) => {
    if (ctx.from?.id !== config.ownerTelegramId) return;
    return next();
  };
}
