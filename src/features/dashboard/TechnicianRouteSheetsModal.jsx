import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import RouteSheetSummaryRow from './RouteSheetSummaryRow'

export default function TechnicianRouteSheetsModal({ technician, routeSheets, onClose, onSelectRouteSheet }) {
  return (
    <Modal
      open={Boolean(technician)}
      title={`Hojas de Ruta de ${technician?.full_name ?? ''}`}
      onClose={onClose}
      size="lg-auto"
      actions={[{ label: 'Cerrar', variant: 'secondary-outline', onClick: onClose }]}
    >
      {routeSheets.length === 0 ? (
        <EmptyState icon="route" title="Sin hojas de ruta este mes" />
      ) : (
        <div className="flex flex-col gap-sm">
          {routeSheets.map((routeSheet) => (
            <RouteSheetSummaryRow key={routeSheet.id} routeSheet={routeSheet} onClick={onSelectRouteSheet} />
          ))}
        </div>
      )}
    </Modal>
  )
}
