import { supabase } from '../lib/supabaseClient'

export async function createStaffMember({ username, fullName, role, password, phone, address, registeredAt }) {
  const { data, error } = await supabase.functions.invoke('create-staff', {
    body: { username, fullName, role, password, phone, address, registeredAt },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export async function renameStaffUsername(profileId, newUsername) {
  const { data, error } = await supabase.functions.invoke('update-username', {
    body: { profileId, newUsername },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}
