import { useState } from 'react'
import EquipmentRow from './EquipmentRow'

export default function ClientGroupRow({ client, equipmentList, alertsByEquipmentId, onOpenHistory }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-b border-outline-variant last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full flex items-center gap-sm py-sm px-sm hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined text-[2rem] text-on-surface-variant">
          {expanded ? 'expand_more' : 'chevron_right'}
        </span>
        <span className="font-label-md text-label-md text-on-surface">{client.name}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">({equipmentList.length})</span>
      </button>
      {expanded && (
        <div>
          {equipmentList.map((equipment) => (
            <EquipmentRow
              key={equipment.id}
              equipment={equipment}
              alert={alertsByEquipmentId.get(equipment.id)}
              onOpenHistory={onOpenHistory}
            />
          ))}
        </div>
      )}
    </div>
  )
}
