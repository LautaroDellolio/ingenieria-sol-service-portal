import Modal from '../../components/ui/Modal'
import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useEquipmentHistory } from '../../hooks/useEquipment'
import { SERVICE_TYPE_LABELS, VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'

const STATUS_TONE = {
  [VISIT_STATUS.APROBADA]: 'success',
  [VISIT_STATUS.RECHAZADA]: 'error',
  [VISIT_STATUS.ENVIADA]: 'warning',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'warning',
}

export default function EquipmentHistoryPanel({ equipment, onClose }) {
  const { history, loading } = useEquipmentHistory(equipment?.id)

  return (
    <Modal open={Boolean(equipment)} title={`Historial de ${equipment?.internal_code ?? ''}`} onClose={onClose}>
      {loading && <Spinner label="Cargando historial…" />}
      {!loading && history.length === 0 && (
        <EmptyState icon="history" title="Sin visitas registradas" description="Este equipo todavía no tiene visitas en su historial." />
      )}
      {!loading && history.length > 0 && (
        <ul className="divide-y divide-outline-variant/50 max-h-[40rem] overflow-y-auto">
          {history.map((visit) => (
            <li key={visit.id} className="py-sm flex items-center justify-between gap-sm">
              <div>
                <p className="font-label-md text-label-md text-on-surface">{formatDate(visit.scheduled_date)}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {SERVICE_TYPE_LABELS[visit.service_type] ?? 'Sin tipo'} · {visit.profiles?.full_name ?? 'Sin asignar'}
                </p>
              </div>
              <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone={STATUS_TONE[visit.status] ?? 'neutral'} variant="tag" />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
