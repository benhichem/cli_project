import type { Bot } from 'grammy'
import { getDueReminders, markReminderFired } from './db/reminders'
import { config } from './config'
import { escapeHtml } from './utils/html'

async function fireReminders(bot: Bot): Promise<void> {
  const due = await getDueReminders()
  for (const reminder of due) {
    try {
      await bot.api.sendMessage(
        config.ownerTelegramId,
        `🔔 <b>Reminder</b>\n${escapeHtml(reminder.text)}`,
        { parse_mode: 'HTML' }
      )
    } catch (err) {
      console.error(`Failed to send reminder ${reminder.id}:`, err)
    }
    await markReminderFired(reminder.id)
  }
}

export function startScheduler(bot: Bot): void {
  fireReminders(bot)
  setInterval(() => fireReminders(bot), 60_000)
}
