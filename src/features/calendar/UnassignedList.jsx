import EmptyState from '../../components/ui/EmptyState'
import TaskCard from './TaskCard'

export default function UnassignedList({ routeSheets, onSelectRouteSheet, onOpenBulkAssign }) {
  return (
    <div className="h-full flex flex-col">
      <button
        type="button"
        onClick={onOpenBulkAssign}
        disabled={routeSheets.length === 0}
        className="shrink-0 text-left font-label-md text-label-md text-on-surface uppercase tracking-wider mb-sm pb-xs px-xs -mx-xs border-b border-outline-variant rounded hover:bg-surface-container-low hover:text-secondary transition-colors disabled:hover:bg-transparent disabled:hover:text-on-surface disabled:cursor-not-allowed"
      >
        Hojas de Ruta Sin Asignar{routeSheets.length > 0 ? ` (${routeSheets.length})` : ''}
      </button>
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
