import { VISIT_STATUS } from './constants'
import { daysBetween } from './dateUtils'

// Una visita ya tiene datos reales del tecnico (fue enviada o esta en un
// estado posterior a planificada/borrador) y por lo tanto no se puede
// quitar de su hoja de ruta ni la hoja de ruta se puede eliminar sin
// perder ese historial.
export function isVisitLocked(visit) {
  return Boolean(visit.submitted_at) || ![VISIT_STATUS.PLANIFICADA, VISIT_STATUS.BORRADOR].includes(visit.status)
}

export function hasLockedVisits(routeSheet) {
  return (routeSheet?.visits ?? []).some(isVisitLocked)
}

// Mismo esquema de 4 colores, pero agregado sobre las visitas (equipos)
// que agrupa una hoja de ruta: verde solo si todas estan aprobadas, rojo
// si alguna quedo vencida sin que el tecnico la enviara.
export function getRouteSheetColor(routeSheet, today = new Date()) {
  const visits = routeSheet.visits ?? []
  const hasTechnicians = (routeSheet.technicians?.length ?? 0) > 0

  if (visits.length > 0 && visits.every((visit) => visit.status === VISIT_STATUS.APROBADA)) return 'verde'

  const isOverdue =
    hasTechnicians && routeSheet.scheduled_date && daysBetween(today, new Date(routeSheet.scheduled_date)) < 0
  const hasUnsubmittedVisit = visits.some((visit) => !isVisitLocked(visit))
  if (isOverdue && hasUnsubmittedVisit) return 'rojo'

  if (hasTechnicians && routeSheet.vehicle_id) return 'amarillo'

  return 'blanco'
}

export const VISIT_COLOR_CLASSES = {
  blanco: 'bg-surface-container-lowest border-outline-variant',
  amarillo: 'bg-[#fff6da] border-[#e3b341]',
  verde: 'bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim',
  rojo: 'bg-error-container border-error',
}

export const VISIT_COLOR_LABELS = {
  blanco: 'Sin técnico asignado',
  amarillo: 'Técnico y vehículo asignados',
  verde: 'Visita realizada',
  rojo: 'Sin reporte del técnico',
}
