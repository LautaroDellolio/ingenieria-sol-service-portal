import StatusChip from '../../components/ui/StatusChip'
import { CONDITION_STATUS, CONDITION_STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'

const CONDITION_TONE = {
  [CONDITION_STATUS.OPTIMO]: 'success',
  [CONDITION_STATUS.ATENCION]: 'warning',
  [CONDITION_STATUS.FUERA_SERVICIO]: 'error',
}

export default function EquipmentRow({ equipment, onOpenHistory }) {
  return (
    <button
      type="button"
      onClick={() => onOpenHistory(equipment)}
      className="w-full grid grid-cols-12 gap-sm items-center py-sm pl-xl pr-sm text-left hover:bg-surface-container-low transition-colors border-t border-outline-variant/50"
    >
      <span className="col-span-4 font-label-md text-label-md text-on-surface">{equipment.motor}</span>
      <span className="col-span-2 font-body-sm text-body-sm text-on-surface-variant">
        {equipment.fuel_percentage != null ? `${equipment.fuel_percentage}%` : '—'}
      </span>
      <span className="col-span-2 font-body-sm text-body-sm text-on-surface-variant">
        {equipment.hours_of_use != null ? `${equipment.hours_of_use} h` : '—'}
      </span>
      <span className="col-span-2 font-body-sm text-body-sm text-on-surface-variant">{formatDate(equipment.last_service_date)}</span>
      <span className="col-span-2">
        <StatusChip label={CONDITION_STATUS_LABELS[equipment.condition_status]} tone={CONDITION_TONE[equipment.condition_status]} variant="dot" />
      </span>
    </button>
  )
}
