import EmptyState from '../../components/ui/EmptyState'
import { VISIT_STATUS } from '../../lib/constants'

export default function TechnicianRouteSummaryList({ technicians, visits }) {
  if (technicians.length === 0) {
    return <EmptyState icon="group" title="Sin técnicos registrados" />
  }

  return (
    <ul className="divide-y divide-outline-variant/50">
      {technicians.map((technician) => {
        const assigned = visits.filter((visit) => visit.technician_id === technician.id)
        const completed = assigned.filter((visit) => visit.status === VISIT_STATUS.APROBADA).length

        return (
          <li key={technician.id} className="flex items-center justify-between gap-sm p-md">
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
              {completed}/{assigned.length} visitas
            </span>
          </li>
        )
      })}
    </ul>
  )
}
