import { SERVICE_TYPE_LABELS } from '../../lib/constants'
import { getRouteSheetColor, VISIT_COLOR_CLASSES } from '../../lib/visitColor'

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function TaskCard({ routeSheet, onClick, onDragStart }) {
  const color = getRouteSheetColor(routeSheet)
  const visits = routeSheet.visits ?? []
  const equipmentCodes = visits.map((visit) => visit.equipment?.motor).filter(Boolean)
  const clientNames = [...new Set(visits.map((visit) => visit.equipment?.clients?.name).filter(Boolean))]

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', routeSheet.id)
        onDragStart?.()
      }}
      onClick={() => onClick(routeSheet)}
      className={`border-2 rounded p-sm cursor-grab hover:border-secondary transition-colors ${VISIT_COLOR_CLASSES[color]}`}
    >
      <p className="font-label-md text-label-md text-on-surface truncate">
        {equipmentCodes.length > 0 ? equipmentCodes.join(', ') : 'Sin equipos'}
      </p>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
        {clientNames.join(', ') || 'Sin cliente'} · {visits.length} equipo{visits.length === 1 ? '' : 's'}
      </p>

      <div className="flex items-center justify-between mt-xs gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {SERVICE_TYPE_LABELS[routeSheet.service_type] ?? 'Sin tipo'}
        </span>
        {routeSheet.vehicles?.plate && (
          <span className="font-label-sm text-label-sm text-on-surface-variant">{routeSheet.vehicles.plate}</span>
        )}
      </div>

      <div className="mt-xs">
        {routeSheet.technicians?.length > 0 ? (
          <div className="flex -space-x-xs">
            {routeSheet.technicians.map((technician) => (
              <span
                key={technician.id}
                title={technician.full_name}
                className="w-xl h-xl rounded-full bg-primary-fixed-dim border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-label-sm text-on-primary-fixed"
              >
                {getInitials(technician.full_name)}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-label-sm text-label-sm text-error">Sin técnico</span>
        )}
      </div>
    </div>
  )
}
