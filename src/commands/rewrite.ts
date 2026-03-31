import type { Bot } from 'grammy'
import { rewriteText } from '../llm/client'
import { escapeHtml } from '../utils/html'

const MODES = {
  fix: 'fix',
  friendly: 'friendly',
  professional: 'professional',
  shorter: 'shorter',
} as const

export function registerRewriteCommands(bot: Bot): void {
  for (const [command, mode] of Object.entries(MODES) as [keyof typeof MODES, typeof MODES[keyof typeof MODES]][]) {
    bot.command(command, async (ctx) => {
      const text = ctx.match?.trim()
      if (!text) {
        return ctx.reply('<i>Please provide text after the command.</i>', { parse_mode: 'HTML' })
      }
      console.log(`[rewrite/${command}] input:`, JSON.stringify(text))
      try {
        const result = await rewriteText(mode, text)
        console.log(`[rewrite/${command}] output:`, JSON.stringify(result))
        return ctx.reply(`<blockquote>${escapeHtml(result)}</blockquote>`, { parse_mode: 'HTML' })
      } catch (err) {
        console.error(`[rewrite/${command}] error:`, err)
        return ctx.reply('<i>Something went wrong. Try again.</i>', { parse_mode: 'HTML' })
      }
    })
  }
}
