import { supabase } from '../lib/supabaseClient'

export async function createStaffMember({ username, fullName, role, password }) {
  const { data, error } = await supabase.functions.invoke('create-staff', {
    body: { username, fullName, role, password },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}
