import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTechnicianVisits } from '../../hooks/useVisits'
import { SERVICE_TYPE_LABELS, VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatFullDate } from '../../lib/dateUtils'
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

function clientGroupKey(dateKey, clientId) {
  return `${dateKey}::${clientId}`
}

export default function MonthlyPlanPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { data: visits, loading } = useTechnicianVisits(profile?.id)
  // Vacio por defecto = todos los grupos de cliente arrancan contraidos.
  const [expandedGroupKeys, setExpandedGroupKeys] = useState(() => new Set())

  const visitsByDate = useMemo(() => {
    const dateGroups = new Map()
    for (const visit of visits ?? []) {
      const dateKey = visit.scheduled_date ?? 'sin-fecha'
      if (!dateGroups.has(dateKey)) dateGroups.set(dateKey, new Map())
      const clientGroups = dateGroups.get(dateKey)
      const clientId = visit.equipment?.client_id ?? 'sin-cliente'
      if (!clientGroups.has(clientId)) {
        clientGroups.set(clientId, { clientId, clientName: visit.equipment?.clients?.name ?? 'Sin cliente asignado', visits: [] })
      }
      clientGroups.get(clientId).visits.push(visit)
    }

    return Array.from(dateGroups.entries())
      .sort(([a], [b]) => {
        if (a === 'sin-fecha') return 1
        if (b === 'sin-fecha') return -1
        return a.localeCompare(b)
      })
      .map(([dateKey, clientGroups]) => ({
        dateKey,
        clientGroups: Array.from(clientGroups.values()).sort((a, b) => a.clientName.localeCompare(b.clientName)),
      }))
  }, [visits])

  function toggleGroupExpanded(key) {
    setExpandedGroupKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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
          {visitsByDate.map(({ dateKey, clientGroups }) => (
            <div key={dateKey}>
              <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wide mb-sm pb-xs border-b border-outline-variant">
                {dateKey === 'sin-fecha' ? 'Sin fecha asignada' : formatFullDate(dateKey)}
              </h2>
              <div className="space-y-sm">
                {clientGroups.map((group) => {
                  const key = clientGroupKey(dateKey, group.clientId)
                  const expanded = expandedGroupKeys.has(key)
                  return (
                    <div key={key} className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                      <button
                        type="button"
                        onClick={() => toggleGroupExpanded(key)}
                        className="w-full flex items-center gap-sm py-sm px-md bg-secondary hover:bg-secondary-container transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[2rem] text-secondary-fixed-dim">
                          {expanded ? 'expand_more' : 'chevron_right'}
                        </span>
                        <span className="flex-1 font-label-md text-label-md text-on-secondary">{group.clientName}</span>
                        <span className="font-label-sm text-label-sm text-secondary-fixed-dim">({group.visits.length})</span>
                      </button>
                      {expanded && (
                        <div className="p-sm space-y-sm">
                          {group.visits.map((visit) => (
                            <button
                              key={visit.id}
                              type="button"
                              onClick={() => navigate(`/tecnico/visita/${visit.id}`)}
                              className="w-full text-left border border-outline-variant rounded-lg p-md hover:border-secondary transition-colors flex items-center justify-between gap-sm"
                            >
                              <div>
                                <p className="font-label-md text-label-md text-on-surface">{visit.equipment?.motor}</p>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                  {SERVICE_TYPE_LABELS[visit.service_type] ?? 'Sin tipo'}
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
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
