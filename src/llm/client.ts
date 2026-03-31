import OpenAI from 'openai'
import { REWRITE_PROMPTS, PARSE_REMINDER_PROMPT } from './prompts'
import { config } from '../config.ts'

export type RewriteMode = 'fix' | 'friendly' | 'professional' | 'shorter'

const client = new OpenAI({
  apiKey: config.nvidia_api_key,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function rewriteText(mode: RewriteMode, text: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: REWRITE_PROMPTS[mode] },
        { role: 'user', content: text },
      ],
      max_tokens: 1024,
    })
    return response.choices[0]!.message.content!
  } catch (err: any) {
    throw new Error('LLM error: ' + (err?.message ?? String(err)))
  }
}

export async function parseReminderFull(
  input: string,
  now: string
): Promise<{ fireAt: string; text: string } | null> {
  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: PARSE_REMINDER_PROMPT },
        { role: 'user', content: `Current datetime: ${now}\n\n${input}` },
      ],
      temperature: 0,
      max_tokens: 256,
    })

    const raw = response.choices[0]!.message.content?.trim() ?? ''
    if (raw === 'null') return null

    const parsed = JSON.parse(raw)
    if (typeof parsed?.fireAt !== 'string' || typeof parsed?.text !== 'string') return null
    if (isNaN(new Date(parsed.fireAt).getTime())) return null

    return { fireAt: parsed.fireAt, text: parsed.text }
  } catch {
    return null
  }
}
