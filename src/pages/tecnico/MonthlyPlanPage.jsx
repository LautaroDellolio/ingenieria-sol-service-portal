import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTechnicianVisits } from '../../hooks/useVisits'
import { SERVICE_TYPE_LABELS, VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'
import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

const STATUS_TONE = {
  [VISIT_STATUS.APROBADA]: 'success',
  [VISIT_STATUS.RECHAZADA]: 'error',
  [VISIT_STATUS.ENVIADA]: 'warning',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'warning',
  [VISIT_STATUS.PLANIFICADA]: 'neutral',
  [VISIT_STATUS.BORRADOR]: 'neutral',
}

export default function MonthlyPlanPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { data: visits, loading } = useTechnicianVisits(profile?.id)

  const visitsByDate = useMemo(() => {
    const groups = new Map()
    for (const visit of visits ?? []) {
      const key = visit.scheduled_date ?? 'sin-fecha'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(visit)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [visits])

  if (loading) return <Spinner label="Cargando tu plan…" />

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Mi Plan Mensual</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Visitas asignadas por el administrativo.</p>

      {visitsByDate.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg">
          <EmptyState icon="event_busy" title="Sin visitas asignadas" description="Todavía no tenés visitas planificadas." />
        </div>
      ) : (
        <div className="space-y-lg">
          {visitsByDate.map(([date, dateVisits]) => (
            <div key={date}>
              <h2 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">
                {date === 'sin-fecha' ? 'Sin fecha asignada' : formatDate(date)}
              </h2>
              <div className="space-y-sm">
                {dateVisits.map((visit) => (
                  <button
                    key={visit.id}
                    type="button"
                    onClick={() => navigate(`/tecnico/visita/${visit.id}`)}
                    className="w-full text-left bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-secondary transition-colors flex items-center justify-between gap-sm"
                  >
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{visit.equipment?.internal_code}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {visit.equipment?.clients?.name} · {SERVICE_TYPE_LABELS[visit.service_type] ?? 'Sin tipo'}
                      </p>
                    </div>
                    <div className="flex items-center gap-sm">
                      {visit.scheduled_time_start && (
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {visit.scheduled_time_start.slice(0, 5)}
                        </span>
                      )}
                      <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone={STATUS_TONE[visit.status]} variant="tag" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
