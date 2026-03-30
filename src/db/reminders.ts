import { db } from './client'

export interface Reminder {
  id: number
  text: string
  fire_at: string
  fired: number
  created_at: string
}

export function createReminder(text: string, fireAt: string): Reminder {
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO reminders (text, fire_at, fired, created_at) VALUES (?, ?, 0, ?)`
  )
  const result = stmt.run(text, fireAt, now)
  return {
    id: result.lastInsertRowid as number,
    text,
    fire_at: fireAt,
    fired: 0,
    created_at: now,
  }
}

export function getDueReminders(): Reminder[] {
  const now = new Date().toISOString()
  return db
    .prepare(`SELECT * FROM reminders WHERE fired = 0 AND fire_at <= ?`)
    .all(now) as Reminder[]
}

export function markReminderFired(id: number): void {
  db.prepare(`UPDATE reminders SET fired = 1 WHERE id = ?`).run(id)
}
