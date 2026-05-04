import type { Bot } from 'grammy'
import { parseReminderFull } from '../llm/client'
import { createReminder } from '../db/reminders'
import { escapeHtml } from '../utils/html'

function formatFireAt(isoString: string): string {
  const date = new Date(isoString)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayName = days[date.getDay()]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minuteStr = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`
  return `${dayName} ${month} ${day} at ${hour12}${minuteStr}${ampm}`
}

export function registerReminderCommands(bot: Bot): void {
  bot.command('remind', async (ctx) => {
    const fullText = ctx.message?.text ?? ''
    // Strip "/remind me " prefix
    const match = fullText.match(/^\/remind(?:@\S+)?\s+me\s*([\s\S]*)$/i)
    const input = match ? match[1]!.trim() : ''

    if (!input) {
      return ctx.reply('<i>Please tell me what to remind you about and when.</i>', { parse_mode: 'HTML' })
    }

    const result = await parseReminderFull(input, new Date().toISOString())
    if (!result) {
      return ctx.reply(
        "<i>Couldn't understand that time.</i>\n\nTry: <code>tomorrow 10am send invoice</code> or <code>in 2 hours call client</code>.",
        { parse_mode: 'HTML' }
      )
    }

    const fireAtDate = new Date(result.fireAt)
    if (fireAtDate <= new Date(Date.now() + 5 * 60 * 1000)) {
      return ctx.reply(
        '<i>That time seems to be in the past or too soon. Try a time at least 5 minutes from now.</i>',
        { parse_mode: 'HTML' }
      )
    }

    await createReminder(result.text, result.fireAt)
    const formatted = formatFireAt(result.fireAt)
    return ctx.reply(`🕐 Got it. Reminding you <b>${formatted}</b>\n${escapeHtml(result.text)}`, { parse_mode: 'HTML' })
  })
}
