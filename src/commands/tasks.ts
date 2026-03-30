import type { Bot } from 'grammy'
import { createTask, getTasks, completeTask } from '../db/index'

export function registerTaskCommands(bot: Bot): void {
  bot.command('todo', (ctx) => {
    const match = ctx.match.trim()

    if (match === 'add' || match.startsWith('add ')) {
      const text = match.slice(3).trim()
      if (!text) {
        return ctx.reply('Please provide a task description.')
      }
      const task = createTask(text)
      return ctx.reply(`Task #${task.id} added: ${task.text}`)
    }

    if (match === 'list') {
      const tasks = getTasks()
      if (tasks.length === 0) {
        return ctx.reply('No open tasks.')
      }
      const lines = tasks.map((t, i) => `${i + 1}. ${t.text}`)
      return ctx.reply(`Open tasks:\n${lines.join('\n')}`)
    }

    return ctx.reply('Usage: /todo add <text> or /todo list')
  })

  bot.command('done', (ctx) => {
    const id = parseInt(ctx.match.trim(), 10)
    if (isNaN(id)) {
      return ctx.reply('Please provide a task number.')
    }
    const ok = completeTask(id)
    if (!ok) {
      return ctx.reply('Task not found.')
    }
    return ctx.reply(`Task #${id} done.`)
  })
}
