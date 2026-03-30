import { db } from './client'

export interface Task {
  id: number
  text: string
  status: 'open' | 'done'
  created_at: string
  completed_at: string | null
}

export function createTask(text: string): Task {
  const now = new Date().toISOString()
  const stmt = db.prepare(
    `INSERT INTO tasks (text, status, created_at, completed_at) VALUES (?, 'open', ?, NULL)`
  )
  const result = stmt.run(text, now)
  return {
    id: result.lastInsertRowid as number,
    text,
    status: 'open',
    created_at: now,
    completed_at: null,
  }
}

export function getTasks(): Task[] {
  return db.prepare(`SELECT * FROM tasks WHERE status = 'open'`).all() as Task[]
}

export function completeTask(id: number): boolean {
  const now = new Date().toISOString()
  const result = db
    .prepare(`UPDATE tasks SET status = 'done', completed_at = ? WHERE id = ?`)
    .run(now, id)
  return result.changes > 0
}
