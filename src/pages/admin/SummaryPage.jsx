import { useState } from 'react'
import { useEquipment } from '../../hooks/useEquipment'
import { useVisitsThisMonth } from '../../hooks/useVisits'
import { getNextAnnualServiceDue, daysBetween, formatDate } from '../../lib/dateUtils'
import { VISIT_STATUS } from '../../lib/constants'
import KpiCard from '../../components/ui/KpiCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import EquipmentHistoryPanel from '../../features/equipmentInventory/EquipmentHistoryPanel'

const FUTURE_WINDOW_DAYS = 90

export default function SummaryPage() {
  const { equipment, loading: equipmentLoading, reload: reloadEquipment } = useEquipment()
  const { data: visitsThisMonth, loading: visitsLoading } = useVisitsThisMonth()
  const [historyEquipment, setHistoryEquipment] = useState(null)

  if (equipmentLoading || visitsLoading) return <Spinner label="Cargando resumen…" />

  const completedVisits = visitsThisMonth.filter((visit) => visit.status === VISIT_STATUS.APROBADA).length
  const completionPercentage = visitsThisMonth.length > 0 ? Math.round((completedVisits / visitsThisMonth.length) * 100) : 0

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-md">
        <KpiCard icon="event" label="Visitas Planificadas" value={visitsThisMonth.length} sublabel="Este mes" />
        <KpiCard icon="fact_check" label="Visitas Realizadas (Mes)" value={`${completionPercentage}%`} sublabel={`${completedVisits}/${visitsThisMonth.length} visitas`} />
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

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
          Próximos Services Anuales
        </h2>
        {upcomingAnnualServices.length === 0 ? (
          <EmptyState icon="event_available" title="Sin vencimientos próximos" />
        ) : (
          <ul className="divide-y divide-outline-variant/50">
            {upcomingAnnualServices.map(({ item, dueDate }) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setHistoryEquipment(item)}
                  className="w-full flex items-center justify-between gap-sm p-md text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{item.motor}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.clients?.name}</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(dueDate)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <EquipmentHistoryPanel
        equipment={historyEquipment}
        onClose={() => setHistoryEquipment(null)}
        onUpdated={(updated) => {
          setHistoryEquipment(updated)
          reloadEquipment()
        }}
      />
    </div>
  )
}
