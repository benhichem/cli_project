import type { Bot } from 'grammy'
import { askWalkAdvisor } from '../llm/client'

export function registerWalkCommand(bot: Bot): void {
  console.log("Registering /walktoday command")
  bot.command("walktoday", async (ctx) => {
    console.log("Received /walktoday command")
    await ctx.replyWithChatAction("typing")
    try {
      const result = await askWalkAdvisor()
      return ctx.reply(result, { parse_mode: "HTML" })
    } catch (err) {
      console.error("[walktoday] error:", err)
      return ctx.reply("<i>Couldn't check the weather right now. Try again.</i>", { parse_mode: "HTML" })
    }
  })
}
