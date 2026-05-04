import type { Bot } from 'grammy'
import { createTask, getTasks, completeTask } from '../db/index'
import { escapeHtml } from '../utils/html'

export function registerTaskCommands(bot: Bot): void {
  bot.command('todo', async (ctx) => {
    const match = ctx.match.trim()

    if (match === 'add' || match.startsWith('add ')) {
      const text = match.slice(3).trim()
      if (!text) {
        return ctx.reply('<i>Please provide a task description.</i>', { parse_mode: 'HTML' })
      }
      const task = await createTask(text)
      return ctx.reply(`✅ Task <b>#${task.id}</b> added\n${escapeHtml(task.text)}`, { parse_mode: 'HTML' })
    }

    if (match === 'list') {
      const tasks = await getTasks()
      if (tasks.length === 0) {
        return ctx.reply('<i>No open tasks.</i>', { parse_mode: 'HTML' })
      }
      const lines = tasks.map((t, i) => `${i + 1}. [#${t.id}] ${escapeHtml(t.text)}`)
      return ctx.reply(`<b>Open tasks</b>\n\n${lines.join('\n')}`, { parse_mode: 'HTML' })
    }

    return ctx.reply('<i>Usage:</i> /todo add &lt;text&gt; or /todo list', { parse_mode: 'HTML' })
  })

  bot.command('done', async (ctx) => {
    const id = parseInt(ctx.match.trim(), 10)
    if (isNaN(id)) {
      return ctx.reply('<i>Please provide a task number.</i>', { parse_mode: 'HTML' })
    }
    const ok = await completeTask(id)
    if (!ok) {
      return ctx.reply('<i>Task not found.</i>', { parse_mode: 'HTML' })
    }
    return ctx.reply(`✅ Task <b>#${id}</b> marked done.`, { parse_mode: 'HTML' })
  })
}
