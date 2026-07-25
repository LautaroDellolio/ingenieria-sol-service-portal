import EmptyState from '../../components/ui/EmptyState'
import TaskCard from './TaskCard'

export default function UnassignedList({ visits, onSelectVisit }) {
  return (
    <div>
      <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Sin Asignar</h2>
      {visits.length === 0 ? (
        <EmptyState icon="task_alt" title="Todo planificado" />
      ) : (
        <div className="space-y-sm">
          {visits.map((visit) => (
            <TaskCard key={visit.id} visit={visit} onClick={onSelectVisit} />
          ))}
        </div>
      )}
    </div>
  )
}
