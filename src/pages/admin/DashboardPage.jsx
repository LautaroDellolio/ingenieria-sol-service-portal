import { useEquipment } from '../../hooks/useEquipment'
import { useAnnualServiceAlerts } from '../../hooks/useAnnualServiceAlerts'
import { useVisitsThisMonth } from '../../hooks/useVisits'
import { useTechnicians } from '../../hooks/useTechnicians'
import { useEffect, useState } from 'react'
import { listRecentEvents } from '../../api/visitEvents'
import { CONDITION_STATUS, VISIT_STATUS } from '../../lib/constants'
import KpiCard from '../../components/ui/KpiCard'
import AnnualServiceAlerts from '../../features/dashboard/AnnualServiceAlerts'
import RecentActivityFeed from '../../features/dashboard/RecentActivityFeed'
import TechnicianRouteSummaryList from '../../features/dashboard/TechnicianRouteSummaryList'
import Spinner from '../../components/ui/Spinner'

export default function DashboardPage() {
  const { equipment, loading: equipmentLoading } = useEquipment()
  const alerts = useAnnualServiceAlerts(equipment)
  const { data: visitsThisMonth, loading: visitsLoading } = useVisitsThisMonth()
  const { technicians, loading: techniciansLoading } = useTechnicians()
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    listRecentEvents(8).then(setRecentEvents)
  }, [])

  if (equipmentLoading || visitsLoading || techniciansLoading) {
    return <Spinner label="Cargando panel…" />
  }

  const activeEquipmentCount = equipment.filter((item) => item.condition_status !== CONDITION_STATUS.FUERA_SERVICIO).length
  const completedVisits = visitsThisMonth.filter((visit) => visit.status === VISIT_STATUS.APROBADA).length
  const completionPercentage = visitsThisMonth.length > 0 ? Math.round((completedVisits / visitsThisMonth.length) * 100) : 0
  const alertCount = alerts.filter((alert) => alert.alertLevel === 'vencido' || alert.alertLevel === 'proximo').length

  const conditionCounts = {
    [CONDITION_STATUS.OPTIMO]: equipment.filter((item) => item.condition_status === CONDITION_STATUS.OPTIMO).length,
    [CONDITION_STATUS.ATENCION]: equipment.filter((item) => item.condition_status === CONDITION_STATUS.ATENCION).length,
    [CONDITION_STATUS.FUERA_SERVICIO]: equipment.filter((item) => item.condition_status === CONDITION_STATUS.FUERA_SERVICIO).length,
  }
  const maxConditionCount = Math.max(1, ...Object.values(conditionCounts))

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Resumen de Operaciones</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
        Estado general de los equipos y las visitas planificadas para este mes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-md">
        <KpiCard icon="precision_manufacturing" label="Grupos Activos" value={activeEquipmentCount} sublabel={`${equipment.length} equipos en total`} />
        <KpiCard icon="fact_check" label="Visitas Realizadas (Mes)" value={`${completionPercentage}%`} sublabel={`${completedVisits}/${visitsThisMonth.length} visitas`} />
        <KpiCard icon="warning" label="Alertas de Service Anual" value={alertCount} sublabel="Vencidas o próximas a vencer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase mb-md border-b border-outline-variant pb-xs">
            Distribución de Condición de Equipos
          </h2>
          <div className="flex items-end gap-md h-[16rem] px-sm">
            {Object.entries(conditionCounts).map(([status, count]) => (
              <div key={status} className="flex-1 flex flex-col items-center gap-xs">
                <div
                  className="w-full bg-primary-fixed rounded-t"
                  style={{ height: `${(count / maxConditionCount) * 100}%` }}
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant">{count}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-center">
                  {status === CONDITION_STATUS.OPTIMO && 'Óptimo'}
                  {status === CONDITION_STATUS.ATENCION && 'Atención'}
                  {status === CONDITION_STATUS.FUERA_SERVICIO && 'Fuera de Servicio'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Alertas de Service Anual
          </h2>
          <AnnualServiceAlerts equipment={equipment} alerts={alerts} />
        </div>

        <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Hojas de Ruta por Técnico
          </h2>
          <TechnicianRouteSummaryList technicians={technicians} visits={visitsThisMonth} />
        </div>

        <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase p-md border-b border-outline-variant">
            Actividad Reciente
          </h2>
          <RecentActivityFeed events={recentEvents} />
        </div>
      </div>
    </div>
  )
}
