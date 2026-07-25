import { supabase } from '../lib/supabaseClient'

export async function listClients() {
  const { data, error } = await supabase.from('clients').select('*').order('name')
  if (error) throw error
  return data
}
