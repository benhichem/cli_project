import { supabase } from './client.ts'

export interface Task {
  id: number
  text: string
  status: 'open' | 'done'
  created_at: string
  completed_at: string | null
}

export async function createTask(text: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ text, status: 'open', created_at: new Date().toISOString(), completed_at: null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'open')
  if (error) throw error
  return data ?? []
}

export async function completeTask(id: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: 'done', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  if (error) throw error
  return (data?.length ?? 0) > 0
}
