export default function Spinner({ label = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-sm p-xl text-on-surface-variant">
      <span
        className="w-xl h-xl border-2 border-outline-variant border-t-secondary rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="font-body-sm text-body-sm">{label}</span>
    </div>
  )
}
