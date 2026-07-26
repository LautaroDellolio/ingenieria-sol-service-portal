import { supabase } from '../lib/supabaseClient'

export async function logVisitEvent(visitId, eventType, actorId, notes = null) {
  const { error } = await supabase
    .from('visit_events')
    .insert({ visit_id: visitId, event_type: eventType, actor_id: actorId, notes })
  if (error) throw error
}

export async function listEventsForVisit(visitId) {
  const { data, error } = await supabase
    .from('visit_events')
    .select('*, profiles(full_name)')
    .eq('visit_id', visitId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function listRecentEvents(limit = 10) {
  const { data, error } = await supabase
    .from('visit_events')
    .select('*, profiles(full_name), visits(equipment_id, equipment(motor, clients(name)))')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
