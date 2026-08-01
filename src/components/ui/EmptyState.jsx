export default function EmptyState({ icon = 'inbox', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-sm text-center p-xl text-on-surface-variant">
      <span className="w-[5.6rem] h-[5.6rem] rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-[2.8rem]">{icon}</span>
      </span>
      <p className="font-label-md text-label-md text-on-surface">{title}</p>
      {description && <p className="font-body-sm text-body-sm max-w-[32rem]">{description}</p>}
    </div>
  )
}
