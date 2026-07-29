import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import TaskCard from './TaskCard'
import { formatDate } from '../../lib/dateUtils'

export default function DayDetailModal({ date, routeSheets, onClose, onSelectRouteSheet, onNewRouteSheet }) {
  return (
    <Modal
      open={Boolean(date)}
      title={date ? formatDate(date) : ''}
      onClose={onClose}
      size="lg-auto"
      actions={[{ label: 'Nueva Hoja de Ruta', variant: 'primary', icon: 'add', onClick: () => onNewRouteSheet(date) }]}
    >
      {routeSheets.length === 0 ? (
        <EmptyState icon="event_available" title="Sin hojas de ruta" description="Este día no tiene hojas de ruta programadas." />
      ) : (
        <div className="flex flex-col gap-sm">
          {routeSheets.map((routeSheet) => (
            <TaskCard key={routeSheet.id} routeSheet={routeSheet} onClick={onSelectRouteSheet} />
          ))}
        </div>
      )}
    </Modal>
  )
}
