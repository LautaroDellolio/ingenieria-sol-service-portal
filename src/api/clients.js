import { supabase } from '../lib/supabaseClient'

export async function listClients() {
  const { data, error } = await supabase.from('clients').select('*').order('name')
  if (error) throw error
  return data
}

export async function createClient(client) {
  const { data, error } = await supabase.from('clients').insert(client).select().single()
  if (error) throw error
  return data
}
