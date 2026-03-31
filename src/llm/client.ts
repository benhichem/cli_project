import { GoogleGenAI } from '@google/genai'
import { REWRITE_PROMPTS, PARSE_REMINDER_PROMPT } from './prompts'
import { config } from '../config.ts'

export type RewriteMode = 'fix' | 'friendly' | 'professional' | 'shorter'

const ai = new GoogleGenAI({ apiKey: config.gemini_api_key })

export async function rewriteText(mode: RewriteMode, text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: text,
      config: {
        systemInstruction: REWRITE_PROMPTS[mode],
        maxOutputTokens: 1024,
      },
    })
    return response.text!
  } catch (err: any) {
    throw new Error('LLM error: ' + (err?.message ?? String(err)))
  }
}

export async function parseReminderFull(
  input: string,
  now: string
): Promise<{ fireAt: string; text: string } | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Current datetime: ${now}\n\n${input}`,
      config: {
        systemInstruction: PARSE_REMINDER_PROMPT,
        temperature: 0,
        maxOutputTokens: 1024,
      },
    });
    console.log(response);
    Bun.write('output.json', JSON.stringify(response, null, 2))
    const raw = response.text?.trim() ?? ''
    if (raw === 'null') return null

    const parsed = JSON.parse(raw)
    if (typeof parsed?.fireAt !== 'string' || typeof parsed?.text !== 'string') return null
    if (isNaN(new Date(parsed.fireAt).getTime())) return null

    return { fireAt: parsed.fireAt, text: parsed.text }
  } catch {
    return null
  }
}


let d = await parseReminderFull('Tomorrow at 10am send invoice to client', new Date().toISOString());

