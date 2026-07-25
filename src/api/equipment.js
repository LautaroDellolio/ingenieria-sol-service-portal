import { supabase } from '../lib/supabaseClient'

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
    .select('*, profiles!visits_technician_id_fkey(full_name)')
    .eq('equipment_id', equipmentId)
    .order('scheduled_date', { ascending: false })
  if (error) throw error
  return data
}
