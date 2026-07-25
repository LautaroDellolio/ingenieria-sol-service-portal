export default function ActivityList({ items }) {
  if (items.length === 0) {
    return <p className="font-body-sm text-body-sm text-on-surface-variant p-md">Sin actividad reciente.</p>
  }

  return (
    <ul className="divide-y divide-outline-variant/50">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-sm p-md hover:bg-surface-container-low transition-colors">
          <span className={`material-symbols-outlined text-[2rem] ${item.iconTone ?? 'text-on-surface-variant'}`}>
            {item.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">{item.title}</p>
            {item.subtitle && (
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{item.subtitle}</p>
            )}
          </div>
          {item.timestamp && (
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {item.timestamp}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
