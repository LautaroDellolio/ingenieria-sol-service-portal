export default function LoginCard({ children }) {
  return (
    <div className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant shadow-sm rounded-lg overflow-hidden flex flex-col">
      <div className="bg-primary-container p-xl flex flex-col items-center justify-center border-b border-outline-variant">
        <span className="w-[6.4rem] h-[6.4rem] mb-md rounded-full bg-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary text-[3.2rem]">wb_sunny</span>
        </span>
        <h1 className="font-headline-md text-headline-md font-bold text-on-primary">Ingenieria Sol</h1>
        <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-xs">Portal de Operaciones Empresariales</p>
      </div>
      <div className="p-xl flex flex-col gap-lg">{children}</div>
      <div className="bg-surface-container-low p-md border-t border-outline-variant text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Solo personal autorizado. Sistema monitoreado.
        </p>
      </div>
    </div>
  )
}
