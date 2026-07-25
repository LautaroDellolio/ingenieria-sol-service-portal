import { supabase } from '../lib/supabaseClient'

export async function listVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('active', true)
    .order('plate')
  if (error) throw error
  return data
}
