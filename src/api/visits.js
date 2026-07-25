import { supabase } from '../lib/supabaseClient'
import { VISIT_STATUS, VISIT_PARAMETER_DEFINITIONS } from '../lib/constants'
import { logVisitEvent } from './visitEvents'

const VISIT_SELECT = '*, equipment(internal_code, brand, model, client_id, clients(name)), profiles!visits_technician_id_fkey(full_name), vehicles(plate)'

export async function getVisitById(visitId) {
  const { data, error } = await supabase.from('visits').select(VISIT_SELECT).eq('id', visitId).single()
  if (error) throw error
  return data
}

export async function listVisitsForTechnician(technicianId) {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .eq('technician_id', technicianId)
    .order('scheduled_date', { ascending: true })
  if (error) throw error
  return data
}

export async function listVisitsInRange(startDate, endDate) {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_time_start', { ascending: true })
  if (error) throw error
  return data
}

export async function listUnassignedVisits() {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .is('scheduled_date', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function listVisitsPendingReview() {
  const { data, error } = await supabase
    .from('visits')
    .select(VISIT_SELECT)
    .eq('status', VISIT_STATUS.ENVIADA)
    .order('submitted_at', { ascending: true })
  if (error) throw error
  return data
}

export async function listVisitsThisMonth() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
  return listVisitsInRange(start, end)
}

export async function createVisit({ equipmentId, serviceType, isAnnualService, createdBy }) {
  const { data, error } = await supabase
    .from('visits')
    .insert({
      equipment_id: equipmentId,
      technician_id: null,
      service_type: serviceType,
      is_annual_service: isAnnualService ?? false,
      status: VISIT_STATUS.PLANIFICADA,
      created_by: createdBy,
    })
    .select()
    .single()
  if (error) throw error
  await logVisitEvent(data.id, 'creada', createdBy)
  return data
}

export async function updateVisitAssignment(visitId, { technicianId, vehicleId, scheduledDate, scheduledTimeStart }) {
  const { data, error } = await supabase
    .from('visits')
    .update({
      technician_id: technicianId,
      vehicle_id: vehicleId,
      scheduled_date: scheduledDate,
      scheduled_time_start: scheduledTimeStart,
    })
    .eq('id', visitId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function saveVisitDraft(visitId, { serviceType, checklistData, notes, faultReported, faultDescription }, actorId) {
  const { error } = await supabase
    .from('visits')
    .update({
      service_type: serviceType,
      checklist_data: checklistData,
      notes,
      fault_reported: faultReported,
      fault_description: faultDescription,
      status: VISIT_STATUS.BORRADOR,
      draft_saved_at: new Date().toISOString(),
    })
    .eq('id', visitId)
  if (error) throw error
  await logVisitEvent(visitId, 'borrador_guardado', actorId)
}

export async function submitVisitForReview(visitId, { serviceType, checklistData, notes, faultReported, faultDescription }, actorId) {
  const { error } = await supabase
    .from('visits')
    .update({
      service_type: serviceType,
      checklist_data: checklistData,
      notes,
      fault_reported: faultReported,
      fault_description: faultDescription,
      status: VISIT_STATUS.ENVIADA,
      submitted_at: new Date().toISOString(),
    })
    .eq('id', visitId)
  if (error) throw error
  await logVisitEvent(visitId, 'enviada', actorId)
}

export async function markVisitReceived(visitId, receivedBy) {
  const { error } = await supabase
    .from('visits')
    .update({ received_by: receivedBy, received_at: new Date().toISOString() })
    .eq('id', visitId)
  if (error) throw error
  await logVisitEvent(visitId, 'recibida', receivedBy)
}

export async function approveVisit(visitId, reviewedBy, reviewNotes, equipmentId, { isAnnualService } = {}) {
  const nowIso = new Date().toISOString()
  const { error } = await supabase
    .from('visits')
    .update({ status: VISIT_STATUS.APROBADA, reviewed_by: reviewedBy, reviewed_at: nowIso, review_notes: reviewNotes })
    .eq('id', visitId)
  if (error) throw error

  const today = nowIso.slice(0, 10)
  const equipmentChanges = { last_service_date: today }
  if (isAnnualService) equipmentChanges.last_annual_service_date = today

  const { error: equipmentError } = await supabase.from('equipment').update(equipmentChanges).eq('id', equipmentId)
  if (equipmentError) throw equipmentError

  await logVisitEvent(visitId, 'aprobada', reviewedBy, reviewNotes)
}

export async function rejectVisit(visitId, reviewedBy, reviewNotes) {
  const { error } = await supabase
    .from('visits')
    .update({ status: VISIT_STATUS.RECHAZADA, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(), review_notes: reviewNotes })
    .eq('id', visitId)
  if (error) throw error
  await logVisitEvent(visitId, 'rechazada', reviewedBy, reviewNotes)
}

export async function requestVisitRevision(visitId, reviewedBy, reviewNotes) {
  const { error } = await supabase
    .from('visits')
    .update({ status: VISIT_STATUS.REVISION_SOLICITADA, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(), review_notes: reviewNotes })
    .eq('id', visitId)
  if (error) throw error
  await logVisitEvent(visitId, 'revision_solicitada', reviewedBy, reviewNotes)
}

// Reemplaza los parametros cuantitativos de la visita por los valores actuales
// del formulario (el conjunto de metricas es fijo, ver VISIT_PARAMETER_DEFINITIONS).
export async function saveVisitParameters(visitId, parameterValues) {
  const { error: deleteError } = await supabase.from('visit_parameters').delete().eq('visit_id', visitId)
  if (deleteError) throw deleteError

  const rows = VISIT_PARAMETER_DEFINITIONS.filter((definition) => parameterValues[definition.key] !== '' && parameterValues[definition.key] != null).map(
    (definition) => ({
      visit_id: visitId,
      metric_key: definition.key,
      metric_label: definition.label,
      value: Number(parameterValues[definition.key]),
      unit: definition.unit,
      spec_min: definition.specMin ?? null,
      spec_max: definition.specMax ?? null,
    })
  )

  if (rows.length === 0) return
  const { error: insertError } = await supabase.from('visit_parameters').insert(rows)
  if (insertError) throw insertError
}
