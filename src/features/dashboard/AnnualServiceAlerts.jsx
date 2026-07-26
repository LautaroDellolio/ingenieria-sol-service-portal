import StatusChip from '../../components/ui/StatusChip'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../lib/dateUtils'

const ALERT_TONE = { vencido: 'error', proximo: 'warning' }
const ALERT_LABEL = { vencido: 'Vencido', proximo: 'Próximo a Vencer' }

export default function AnnualServiceAlerts({ equipment, alerts }) {
  const alertsByEquipmentId = new Map(alerts.map((alert) => [alert.equipmentId, alert]))

  const items = equipment
    .map((item) => ({ item, alert: alertsByEquipmentId.get(item.id) }))
    .filter(({ alert }) => alert && (alert.alertLevel === 'vencido' || alert.alertLevel === 'proximo'))
    .sort((a, b) => a.alert.dueDate - b.alert.dueDate)

  if (items.length === 0) {
    return <EmptyState icon="task_alt" title="Sin alertas de service anual" description="Todos los equipos están al día." />
  }

  return (
    <ul className="divide-y divide-outline-variant/50">
      {items.map(({ item, alert }) => (
        <li key={item.id} className="flex items-center justify-between gap-sm p-md">
          <div>
            <p className="font-label-md text-label-md text-on-surface">{item.motor}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {item.clients?.name} · Vence {formatDate(alert.dueDate)}
            </p>
          </div>
          <StatusChip label={ALERT_LABEL[alert.alertLevel]} tone={ALERT_TONE[alert.alertLevel]} variant="tag" />
        </li>
      ))}
    </ul>
  )
}
