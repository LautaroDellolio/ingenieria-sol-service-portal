import { supabase } from '../lib/supabaseClient'
import { normalizeVisit } from './visits'

export async function listEquipmentWithClients() {
  const { data, error } = await supabase
    .from('equipment')
    .select('*, clients(id, name)')
    .order('internal_code')
  if (error) throw error
  return data
}

export async function createEquipment(equipment) {
  const { data, error } = await supabase.from('equipment').insert(equipment).select().single()
  if (error) throw error
  return data
}

export async function updateEquipment(equipmentId, changes) {
  const { data, error } = await supabase
    .from('equipment')
    .update(changes)
    .eq('id', equipmentId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEquipmentVisitHistory(equipmentId) {
  const { data, error } = await supabase
    .from('visits')
    .select('*, route_sheets(id, vehicle_id, scheduled_time_start, vehicles(plate), route_sheet_technicians(profiles(id, full_name)))')
    .eq('equipment_id', equipmentId)
    .order('scheduled_date', { ascending: false })
  if (error) throw error
  return data.map(normalizeVisit)
}
