import StatusChip from '../../components/ui/StatusChip'
import { CONDITION_STATUS, CONDITION_STATUS_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'

const CONDITION_TONE = {
  [CONDITION_STATUS.OPTIMO]: 'success',
  [CONDITION_STATUS.ATENCION]: 'warning',
  [CONDITION_STATUS.FUERA_SERVICIO]: 'error',
}

const ALERT_TONE = { vencido: 'error', proximo: 'warning', al_dia: 'success', sin_datos: 'neutral' }
const ALERT_LABEL = { vencido: 'Vencido', proximo: 'Próximo', al_dia: 'Al Día', sin_datos: 'Sin Datos' }

export default function EquipmentRow({ equipment, alert, onOpenHistory }) {
  return (
    <button
      type="button"
      onClick={() => onOpenHistory(equipment)}
      className="w-full grid grid-cols-12 gap-sm items-center py-sm pl-xl pr-sm text-left hover:bg-surface-container-low transition-colors border-t border-outline-variant/50"
    >
      <span className="col-span-4 font-label-md text-label-md text-on-surface">{equipment.internal_code}</span>
      <span className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">{formatDate(equipment.last_service_date)}</span>
      <span className="col-span-2">
        <StatusChip label={CONDITION_STATUS_LABELS[equipment.condition_status]} tone={CONDITION_TONE[equipment.condition_status]} variant="dot" />
      </span>
      <span className="col-span-3">
        {alert && (
          <StatusChip label={`${ALERT_LABEL[alert.alertLevel]}: ${formatDate(alert.dueDate)}`} tone={ALERT_TONE[alert.alertLevel]} variant="tag" />
        )}
      </span>
    </button>
  )
}
