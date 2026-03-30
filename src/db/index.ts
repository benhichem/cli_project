import { db } from './client'
import { CREATE_TASKS, CREATE_REMINDERS } from './schema'

export function initDb(): void {
  db.exec('PRAGMA journal_mode=WAL')
  db.exec(CREATE_TASKS)
  db.exec(CREATE_REMINDERS)
}

export { createTask, getTasks, completeTask } from './tasks'
export { createReminder, getDueReminders, markReminderFired } from './reminders'
export type { Task } from './tasks'
export type { Reminder } from './reminders'
