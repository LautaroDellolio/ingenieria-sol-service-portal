import { VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDateTime } from '../../lib/dateUtils'
import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'

export default function VisitReviewQueue({ visits, selectedId, onSelect }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pendientes</p>
        <p className="font-display-lg text-display-lg text-on-surface leading-none">{visits.length}</p>
      </div>
      <div className="overflow-y-auto max-h-[60rem]">
        {visits.length === 0 ? (
          <EmptyState icon="fact_check" title="No hay visitas pendientes" />
        ) : (
          <ul className="divide-y divide-outline-variant/50">
            {visits.map((visit) => (
              <li key={visit.id}>
                <button
                  type="button"
                  onClick={() => onSelect(visit.id)}
                  className={`w-full text-left p-md transition-colors hover:bg-surface-container-low ${
                    selectedId === visit.id ? 'bg-surface-container-low border-l-4 border-secondary' : ''
                  }`}
                >
                  <p className="font-label-md text-label-md text-on-surface">{visit.equipment?.motor}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{visit.equipment?.clients?.name}</p>
                  <div className="flex items-center justify-between mt-xs">
                    <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone="warning" variant="tag" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {formatDateTime(visit.submitted_at)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
