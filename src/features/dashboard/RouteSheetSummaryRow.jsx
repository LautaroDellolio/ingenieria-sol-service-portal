import { SERVICE_TYPE_LABELS } from '../../lib/constants'
import { getRouteSheetColor, VISIT_COLOR_CLASSES } from '../../lib/visitColor'
import { formatDate } from '../../lib/dateUtils'

export default function RouteSheetSummaryRow({ routeSheet, onClick }) {
  const color = getRouteSheetColor(routeSheet)
  const visits = routeSheet.visits ?? []
  const equipmentCodes = visits.map((visit) => visit.equipment?.motor).filter(Boolean)
  const clientNames = [...new Set(visits.map((visit) => visit.equipment?.clients?.name).filter(Boolean))]

  return (
    <button
      type="button"
      onClick={() => onClick(routeSheet)}
      className={`w-full min-w-0 text-left border-2 rounded p-sm hover:border-secondary transition-colors ${VISIT_COLOR_CLASSES[color]}`}
    >
      <div className="flex items-center justify-between gap-sm">
        <p className="font-label-md text-label-md text-on-surface truncate">
          {equipmentCodes.length > 0 ? equipmentCodes.join(', ') : 'Sin equipos'}
        </p>
        <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
          {routeSheet.scheduled_date ? formatDate(routeSheet.scheduled_date) : 'Sin fecha'}
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
        {clientNames.join(', ') || 'Sin cliente'} · {SERVICE_TYPE_LABELS[routeSheet.service_type] ?? 'Sin tipo'}
      </p>
    </button>
  )
}
