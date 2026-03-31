import type { Bot } from 'grammy'
import { getDueReminders, markReminderFired } from './db/reminders'
import { config } from './config'

async function fireReminders(bot: Bot): Promise<void> {
  const due = getDueReminders()
  for (const reminder of due) {
    try {
      await bot.api.sendMessage(config.ownerTelegramId, 'Reminder: ' + reminder.text)
    } catch (err) {
      console.error(`Failed to send reminder ${reminder.id}:`, err)
    }
    markReminderFired(reminder.id)
  }
}

export function startScheduler(bot: Bot): void {
  fireReminders(bot)
  setInterval(() => fireReminders(bot), 60_000)
}
