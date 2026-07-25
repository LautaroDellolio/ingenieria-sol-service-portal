export default function EmptyState({ icon = 'inbox', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-xs text-center p-xl text-on-surface-variant">
      <span className="material-symbols-outlined text-[3.2rem]">{icon}</span>
      <p className="font-label-md text-label-md text-on-surface">{title}</p>
      {description && <p className="font-body-sm text-body-sm">{description}</p>}
    </div>
  )
}
