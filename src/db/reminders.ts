import { supabase } from './client.ts'

export interface Reminder {
  id: number
  text: string
  fire_at: string
  fired: boolean
  created_at: string
}

export async function createReminder(text: string, fireAt: string): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .insert({ text, fire_at: fireAt, fired: false, created_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getDueReminders(): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('fired', false)
    .lte('fire_at', new Date().toISOString())
  if (error) throw error
  return data ?? []
}

export async function markReminderFired(id: number): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .update({ fired: true })
    .eq('id', id)
  if (error) throw error
}
