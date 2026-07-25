import { supabase } from '../lib/supabaseClient'

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function listTechnicians() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'tecnico')
    .eq('active', true)
    .order('full_name')
  if (error) throw error
  return data
}

export async function listStaff() {
  const { data, error } = await supabase.from('profiles').select('*').order('full_name')
  if (error) throw error
  return data
}

export async function setProfileActive(profileId, active) {
  const { error } = await supabase.from('profiles').update({ active }).eq('id', profileId)
  if (error) throw error
}
