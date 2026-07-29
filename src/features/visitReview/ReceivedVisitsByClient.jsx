import { useMemo, useState } from 'react'
import EmptyState from '../../components/ui/EmptyState'
import StatusChip from '../../components/ui/StatusChip'
import { VISIT_STATUS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDateTime } from '../../lib/dateUtils'

const STATUS_TONE = {
  [VISIT_STATUS.APROBADA]: 'success',
  [VISIT_STATUS.RECHAZADA]: 'error',
  [VISIT_STATUS.ENVIADA]: 'warning',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'warning',
}

function ClientVisitGroup({ client, visits, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-b border-outline-variant last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full flex items-center gap-sm py-sm px-md hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined text-[2rem] text-on-surface-variant">
          {expanded ? 'expand_more' : 'chevron_right'}
        </span>
        <span className="font-label-md text-label-md text-on-surface">{client?.name ?? 'Sin cliente'}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">({visits.length})</span>
      </button>
      {expanded && (
        <ul className="divide-y divide-outline-variant/50">
          {visits.map((visit) => (
            <li key={visit.id}>
              <button
                type="button"
                onClick={() => onSelect(visit.id)}
                className={`w-full text-left py-sm px-lg transition-colors hover:bg-surface-container-low ${
                  selectedId === visit.id ? 'bg-surface-container-low border-l-4 border-secondary' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-sm">
                  <span className="font-label-md text-label-md text-on-surface">{visit.equipment?.motor}</span>
                  <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone={STATUS_TONE[visit.status] ?? 'neutral'} variant="tag" />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Recibida {formatDateTime(visit.received_at)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ReceivedVisitsByClient({ visits, selectedId, onSelect }) {
  const groups = useMemo(() => {
    const map = new Map()
    for (const visit of visits) {
      const key = visit.equipment?.client_id ?? 'sin-cliente'
      if (!map.has(key)) map.set(key, { client: visit.equipment?.clients, visits: [] })
      map.get(key).visits.push(visit)
    }
    return Array.from(map.values()).sort((a, b) => (a.client?.name ?? '').localeCompare(b.client?.name ?? ''))
  }, [visits])

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Todas</p>
        <p className="font-display-lg text-display-lg text-on-surface leading-none">{visits.length}</p>
      </div>
      <div className="overflow-y-auto max-h-[60rem]">
        {groups.length === 0 ? (
          <EmptyState icon="inventory" title="Sin visitas recibidas" />
        ) : (
          groups.map(({ client, visits: clientVisits }) => (
            <ClientVisitGroup key={client?.id ?? 'sin-cliente'} client={client} visits={clientVisits} selectedId={selectedId} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  )
}
