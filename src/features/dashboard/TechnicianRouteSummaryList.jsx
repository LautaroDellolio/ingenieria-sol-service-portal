import EmptyState from '../../components/ui/EmptyState'
import { getRouteSheetColor } from '../../lib/visitColor'

export default function TechnicianRouteSummaryList({ technicians, routeSheets, onSelectTechnician }) {
  if (technicians.length === 0) {
    return <EmptyState icon="group" title="Sin técnicos registrados" />
  }

  return (
    <ul className="divide-y divide-outline-variant/50">
      {technicians.map((technician) => {
        const assigned = routeSheets.filter((routeSheet) => routeSheet.technicians?.some((t) => t.id === technician.id))
        const completed = assigned.filter((routeSheet) => getRouteSheetColor(routeSheet) === 'verde').length

        return (
          <li key={technician.id}>
            <button
              type="button"
              onClick={() => onSelectTechnician(technician, assigned)}
              className="w-full flex items-center justify-between gap-sm p-md text-left hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-sm">
                <span className="w-xl h-xl rounded-full bg-primary-fixed-dim flex items-center justify-center font-label-sm text-label-sm text-on-primary-fixed">
                  {technician.full_name
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase())
                    .join('')}
                </span>
                <span className="font-label-md text-label-md text-on-surface">{technician.full_name}</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {completed}/{assigned.length} hojas de ruta
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
