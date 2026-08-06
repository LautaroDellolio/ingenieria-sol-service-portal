import Modal from '../../components/ui/Modal'
import StatusChip from '../../components/ui/StatusChip'
import { SERVICE_TYPE_LABELS, VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'

const STATUS_TONE = {
  [VISIT_STATUS.APROBADA]: 'success',
  [VISIT_STATUS.RECHAZADA]: 'error',
  [VISIT_STATUS.ENVIADA]: 'warning',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'warning',
}

export default function VisitSummaryModal({ routeSheet, onClose, onAssign = null, onEdit = null }) {
  const visits = routeSheet?.visits ?? []

  const actions = [
    { label: 'Cerrar', variant: 'secondary-outline', onClick: onClose },
    ...(onAssign ? [{ label: 'Asignar Técnico', variant: 'secondary-outline', icon: 'engineering', onClick: () => onAssign(routeSheet) }] : []),
    ...(onEdit ? [{ label: 'Editar', variant: 'primary', icon: 'edit', onClick: () => onEdit(routeSheet) }] : []),
  ]

  return (
    <Modal
      open={Boolean(routeSheet)}
      title="Resumen de la Hoja de Ruta"
      onClose={onClose}
      size="lg"
      actions={actions}
    >
      {routeSheet && (
        <>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
            {routeSheet.descripcion?.trim() && (
              <div className="col-span-2 md:col-span-4">
                <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Descripción</dt>
                <dd className="font-body-md text-body-md text-on-surface">{routeSheet.descripcion}</dd>
              </div>
            )}
            <div>
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Fecha</dt>
              <dd className="font-body-md text-body-md text-on-surface">
                {routeSheet.scheduled_date ? formatDate(routeSheet.scheduled_date) : 'Sin asignar'}
              </dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tipo de Servicio</dt>
              <dd className="font-body-md text-body-md text-on-surface">{SERVICE_TYPE_LABELS[routeSheet.service_type] ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Vehículo</dt>
              <dd className="font-body-md text-body-md text-on-surface">{routeSheet.vehicles?.plate ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm text-on-surface-variant uppercase">Técnico(s)</dt>
              <dd className="font-body-md text-body-md text-on-surface">
                {routeSheet.technicians?.length > 0 ? routeSheet.technicians.map((technician) => technician.full_name).join(', ') : '—'}
              </dd>
            </div>
          </dl>

          <h3 className="list-title-bar font-label-md text-label-md uppercase tracking-wider mt-md mb-sm px-md py-sm rounded">
            Equipos ({visits.length})
          </h3>
          <ul className="divide-y divide-outline-variant/50">
            {visits.map((visit) => (
              <li key={visit.id} className="py-sm flex items-center justify-between gap-sm">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">{visit.equipment?.motor}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{visit.equipment?.clients?.name}</p>
                </div>
                <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone={STATUS_TONE[visit.status] ?? 'neutral'} variant="tag" />
              </li>
            ))}
          </ul>
        </>
      )}
    </Modal>
  )
}
