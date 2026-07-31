import {
  CHECKLIST_CATEGORY,
  CHECKLIST_CATEGORY_LABELS,
  CHECKLIST_ITEM_STATUS,
  CHECKLIST_ITEM_STATUS_LABELS,
  VISIT_CHECKLIST_ITEMS,
} from '../../lib/constants'

const CATEGORY_ICON = {
  [CHECKLIST_CATEGORY.EQUIPO_PARADO]: 'power_settings_new',
  [CHECKLIST_CATEGORY.EQUIPO_MARCHA]: 'bolt',
}

export default function VisitChecklistSection({ category, checklistData, onChangeItem }) {
  const items = VISIT_CHECKLIST_ITEMS.filter((item) => item.category === category)
  const hasMeasurementColumn = items.some((item) => item.measurement)

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="border-b border-outline-variant p-md bg-surface-container flex items-center gap-sm">
        <span className="material-symbols-outlined text-on-surface-variant">{CATEGORY_ICON[category]}</span>
        <h3 className="font-label-md text-label-md text-on-surface uppercase">{CHECKLIST_CATEGORY_LABELS[category]}</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container border-b border-outline-variant">
            <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium">Verificación</th>
            {hasMeasurementColumn && (
              <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-40">Medición</th>
            )}
            <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-32 text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="font-body-lg text-body-lg text-on-surface divide-y divide-outline-variant/50">
          {items.map((item) => {
            const currentStatus = checklistData[item.key] ?? CHECKLIST_ITEM_STATUS.OK
            const statusOptions = Object.entries(CHECKLIST_ITEM_STATUS_LABELS).filter(
              ([value]) => value !== CHECKLIST_ITEM_STATUS.NO_TIENE || item.allowNoTiene
            )
            return (
              <tr key={item.key}>
                <td className="p-sm">{item.label}</td>
                {hasMeasurementColumn && (
                  <td className="p-sm">
                    {item.measurement ? (
                      <div className="flex items-center gap-xs">
                        <input
                          type="number"
                          required={currentStatus === CHECKLIST_ITEM_STATUS.OK}
                          value={checklistData[item.measurement.key] ?? ''}
                          onChange={(event) => onChangeItem(item.measurement.key, event.target.value)}
                          className="w-full border border-outline-variant rounded-sm px-sm py-xs font-body-lg text-body-lg focus:border-primary"
                        />
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{item.measurement.unit}</span>
                      </div>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                )}
                <td className="p-sm text-center">
                  <select
                    required
                    value={currentStatus}
                    onChange={(event) => onChangeItem(item.key, event.target.value)}
                    className="w-full border border-outline-variant rounded-sm font-body-lg text-body-lg px-sm py-xs focus:border-primary"
                  >
                    {statusOptions.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
