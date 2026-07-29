import EmptyState from '../../components/ui/EmptyState'
import TaskCard from './TaskCard'

export default function UnassignedList({ routeSheets, onSelectRouteSheet }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="shrink-0 font-label-md text-label-md text-on-surface uppercase tracking-wider mb-sm pb-xs border-b border-outline-variant">
        Hojas de Ruta Sin Asignar{routeSheets.length > 0 ? ` (${routeSheets.length})` : ''}
      </h2>
      {routeSheets.length === 0 ? (
        <EmptyState icon="task_alt" title="Todo planificado" />
      ) : (
        <div className="space-y-sm flex-1 min-h-0 overflow-y-auto scrollbar-styled pr-xs">
          {routeSheets.map((routeSheet) => (
            <TaskCard key={routeSheet.id} routeSheet={routeSheet} onClick={onSelectRouteSheet} />
          ))}
        </div>
      )}
    </div>
  )
}
