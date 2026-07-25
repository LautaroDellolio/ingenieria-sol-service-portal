import { useEquipment } from '../../hooks/useEquipment'
import { useVisitsThisMonth } from '../../hooks/useVisits'
import { getNextAnnualServiceDue, daysBetween, formatDate } from '../../lib/dateUtils'
import { SERVICE_TYPE_LABELS, VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import KpiCard from '../../components/ui/KpiCard'
import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

const FUTURE_WINDOW_DAYS = 90

const STATUS_TONE = {
  [VISIT_STATUS.APROBADA]: 'success',
  [VISIT_STATUS.RECHAZADA]: 'error',
  [VISIT_STATUS.ENVIADA]: 'warning',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'warning',
  [VISIT_STATUS.PLANIFICADA]: 'neutral',
  [VISIT_STATUS.BORRADOR]: 'neutral',
}

export default function SummaryPage() {
  const { equipment, loading: equipmentLoading } = useEquipment()
  const { data: visitsThisMonth, loading: visitsLoading } = useVisitsThisMonth()

  if (equipmentLoading || visitsLoading) return <Spinner label="Cargando resumen…" />

  const statusCounts = Object.values(VISIT_STATUS).map((status) => ({
    status,
    count: visitsThisMonth.filter((visit) => visit.status === status).length,
  }))

  const serviceTypeCounts = Object.entries(SERVICE_TYPE_LABELS).map(([type, label]) => ({
    label,
    count: visitsThisMonth.filter((visit) => visit.service_type === type).length,
  }))

  const today = new Date()
  const upcomingAnnualServices = equipment
    .map((item) => ({ item, dueDate: getNextAnnualServiceDue(item) }))
    .filter(({ dueDate }) => dueDate && daysBetween(today, dueDate) <= FUTURE_WINDOW_DAYS)
    .sort((a, b) => a.dueDate - b.dueDate)

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Resumen del Mes</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
        Estado de las visitas del mes y próximos services anuales a {FUTURE_WINDOW_DAYS} días.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-md">
        <KpiCard icon="event" label="Visitas Planificadas" value={visitsThisMonth.length} sublabel="Este mes" />
        <KpiCard
          icon="check_circle"
          label="Aprobadas"
          value={visitsThisMonth.filter((v) => v.status === VISIT_STATUS.APROBADA).length}
          sublabel="Este mes"
        />
        <KpiCard
          icon="event_upcoming"
          label="Services Anuales Próximos"
          value={upcomingAnnualServices.length}
          sublabel={`Próximos ${FUTURE_WINDOW_DAYS} días`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Visitas por Estado
          </h2>
          <ul className="divide-y divide-outline-variant/50">
            {statusCounts.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between p-md">
                <StatusChip label={VISIT_STATUS_LABELS[status]} tone={STATUS_TONE[status]} variant="tag" />
                <span className="font-label-md text-label-md text-on-surface">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Visitas por Tipo de Servicio
          </h2>
          <ul className="divide-y divide-outline-variant/50">
            {serviceTypeCounts.map(({ label, count }) => (
              <li key={label} className="flex items-center justify-between p-md">
                <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
                <span className="font-label-md text-label-md text-on-surface">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden md:col-span-2">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Próximos Services Anuales
          </h2>
          {upcomingAnnualServices.length === 0 ? (
            <EmptyState icon="event_available" title="Sin vencimientos próximos" />
          ) : (
            <ul className="divide-y divide-outline-variant/50">
              {upcomingAnnualServices.map(({ item, dueDate }) => (
                <li key={item.id} className="flex items-center justify-between p-md">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{item.internal_code}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.clients?.name}</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
