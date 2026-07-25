export default function KpiCard({ icon, label, value, sublabel, statusChip = null }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-sm p-md border-b border-outline-variant">
        <div className="flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[2rem]">{icon}</span>
          <span className="font-label-sm text-label-sm uppercase">{label}</span>
        </div>
        {statusChip}
      </div>
      <div className="p-md">
        <p className="font-display-lg text-display-lg text-on-surface leading-none">{value}</p>
        {sublabel && <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{sublabel}</p>}
      </div>
    </div>
  )
}
