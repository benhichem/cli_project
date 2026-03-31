import type { Bot } from "grammy";

const HELP_TEXT = `<b>Available commands</b>

<b>Writing</b>
/fix &lt;text&gt; — fix grammar and clarity
/friendly &lt;text&gt; — make it warmer
/professional &lt;text&gt; — make it formal
/shorter &lt;text&gt; — compress it

<b>Tasks</b>
/todo add &lt;text&gt; — add a task
/todo list — show open tasks
/done &lt;id&gt; — mark a task done

<b>Reminders</b>
/remind me &lt;time&gt; &lt;text&gt; — set a reminder

/help — show this message`;

export function registerHelpCommand(bot: Bot): void {
  bot.command("help", (ctx) => ctx.reply(HELP_TEXT, { parse_mode: "HTML" }));

  bot.on("message:text", (ctx) => {
    ctx.reply("I don't know that command. Try /help.", { parse_mode: "HTML" });
  });
}
