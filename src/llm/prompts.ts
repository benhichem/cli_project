import type { RewriteMode } from './client'

export const REWRITE_PROMPTS: Record<RewriteMode, string> = {
  fix: 'You are a professional editor. Fix the grammar, spelling, punctuation, and clarity of the following message. Return only the corrected text with no explanation.',
  friendly: 'You are a communication coach. Rewrite the following message to sound warmer, more friendly, and more human while keeping the core meaning. Return only the rewritten text with no explanation.',
  professional: 'You are a business writing expert. Rewrite the following message to sound professional, polished, and formal while keeping the core meaning. Return only the rewritten text with no explanation.',
  shorter: 'You are an editor specializing in concise writing. Rewrite the following message to be as short as possible without losing any important meaning. Return only the rewritten text with no explanation.',
}

export const PARSE_REMINDER_PROMPT =
  'You are a time and intent parser. Given a natural language reminder string and the current datetime, extract:\n' +
  '1. The target datetime as an ISO 8601 UTC string\n' +
  '2. The reminder text (what the user wants to be reminded about)\n\n' +
  'Return a JSON object with this exact shape: {"fireAt":"2026-03-31T10:00:00.000Z","text":"send invoice to Marcus"}\n\n' +
  'If the input does not contain a parseable future datetime, return the single word: null\n\n' +
  'Return only the JSON object or the word null — nothing else.'
