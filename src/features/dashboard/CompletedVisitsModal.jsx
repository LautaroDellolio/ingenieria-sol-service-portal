import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import RouteSheetSummaryRow from './RouteSheetSummaryRow'
import { getRouteSheetColor } from '../../lib/visitColor'

export default function CompletedVisitsModal({ open, routeSheets, onClose, onSelectRouteSheet }) {
  const done = routeSheets.filter((routeSheet) => getRouteSheetColor(routeSheet) === 'verde')
  const pending = routeSheets.filter((routeSheet) => getRouteSheetColor(routeSheet) !== 'verde')

  return (
    <Modal
      open={open}
      title="Visitas Realizadas del Mes"
      onClose={onClose}
      size="lg"
      actions={[{ label: 'Cerrar', variant: 'secondary-outline', onClick: onClose }]}
    >
      <div className="space-y-lg">
        <section>
          <h3 className="list-title-bar font-label-md text-label-md uppercase tracking-wider mb-sm px-md py-sm rounded">
            Hojas de Ruta Realizadas ({done.length})
          </h3>
          {done.length === 0 ? (
            <EmptyState icon="task_alt" title="Todavía no hay hojas de ruta realizadas" />
          ) : (
            <div className="flex flex-col gap-sm">
              {done.map((routeSheet) => (
                <RouteSheetSummaryRow key={routeSheet.id} routeSheet={routeSheet} onClick={onSelectRouteSheet} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="list-title-bar font-label-md text-label-md uppercase tracking-wider mb-sm px-md py-sm rounded">
            Hojas de Ruta Por Realizar ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <EmptyState icon="event_available" title="No quedan hojas de ruta pendientes" />
          ) : (
            <div className="flex flex-col gap-sm">
              {pending.map((routeSheet) => (
                <RouteSheetSummaryRow key={routeSheet.id} routeSheet={routeSheet} onClick={onSelectRouteSheet} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}
