import EmptyState from '../../components/ui/EmptyState'
import TaskCard from './TaskCard'

export default function UnassignedList({ routeSheets, onSelectRouteSheet, onOpenBulkAssign }) {
  return (
    <div className="h-full flex flex-col">
      <button
        type="button"
        onClick={onOpenBulkAssign}
        disabled={routeSheets.length === 0}
        className="list-title-bar shrink-0 text-left font-label-md text-label-md uppercase tracking-wider mb-sm px-md py-sm rounded shadow-elevation-1 hover:bg-secondary hover:shadow-elevation-2 transition-all disabled:hover:bg-secondary-container disabled:hover:shadow-elevation-1 disabled:cursor-not-allowed"
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
