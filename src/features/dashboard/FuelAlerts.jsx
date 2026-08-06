import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'

export default function FuelAlerts({ equipment, onSelectEquipment }) {
  if (equipment.length === 0) {
    return (
      <EmptyState
        icon="local_gas_station"
        title="Sin alertas de combustible"
        description="Todos los equipos tienen más del 30% de combustible."
      />
    )
  }

  return (
    <ul className="divide-y divide-outline-variant/50">
      {equipment.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelectEquipment(item)}
            className="w-full flex items-center justify-between gap-sm p-md text-left hover:bg-surface-container-low transition-colors"
          >
            <div>
              <p className="font-label-md text-label-md text-on-surface">{item.motor}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{item.clients?.name}</p>
            </div>
            <StatusChip label={`${item.fuel_percentage}%`} tone="warning" variant="tag" />
          </button>
        </li>
      ))}
    </ul>
  )
}
