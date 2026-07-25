import { SERVICE_TYPE_LABELS } from '../../lib/constants'

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function TaskCard({ visit, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', visit.id)
        onDragStart?.()
      }}
      onClick={() => onClick(visit)}
      className="bg-surface-container-lowest border border-outline-variant rounded p-sm cursor-grab hover:border-secondary transition-colors"
    >
      <p className="font-label-md text-label-md text-on-surface">{visit.equipment?.internal_code}</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{visit.equipment?.clients?.name}</p>
      <div className="flex items-center justify-between mt-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {SERVICE_TYPE_LABELS[visit.service_type] ?? 'Sin tipo'}
        </span>
        {visit.profiles?.full_name ? (
          <span className="w-xl h-xl rounded-full bg-primary-fixed-dim flex items-center justify-center font-label-sm text-label-sm text-on-primary-fixed">
            {getInitials(visit.profiles.full_name)}
          </span>
        ) : (
          <span className="font-label-sm text-label-sm text-error">Sin técnico</span>
        )}
      </div>
    </div>
  )
}
