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

export async function listAllVehicles() {
  const { data, error } = await supabase.from('vehicles').select('*').order('plate')
  if (error) throw error
  return data
}

export async function createVehicle({ plate, name }) {
  const { data, error } = await supabase.from('vehicles').insert({ plate, name }).select().single()
  if (error) throw error
  return data
}

export async function updateVehicle(vehicleId, changes) {
  const { data, error } = await supabase.from('vehicles').update(changes).eq('id', vehicleId).select().single()
  if (error) throw error
  return data
}

export async function setVehicleActive(vehicleId, active) {
  const { error } = await supabase.from('vehicles').update({ active }).eq('id', vehicleId)
  if (error) throw error
}

export async function deleteVehicle(vehicleId) {
  const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)
  if (error) throw error
}
