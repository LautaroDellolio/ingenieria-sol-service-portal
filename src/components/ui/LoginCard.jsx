export default function LoginCard({ children }) {
  return (
    <div className="animate-login-rise w-full max-w-[32rem] bg-surface-container-lowest border border-outline-variant shadow-elevation-2 rounded-lg overflow-hidden">
      <div className="m-[0.3rem] border border-outline-variant/60 rounded-[0.4rem] overflow-hidden flex flex-col">
        <div className="bg-primary-container p-xl flex flex-col items-center justify-center border-b border-outline-variant">
          <span className="w-[7.2rem] h-[7.2rem] mb-md rounded-full border-2 border-secondary-fixed-dim/30 flex items-center justify-center">
            <span className="w-[5.6rem] h-[5.6rem] rounded-full bg-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary text-[2.8rem]">wb_sunny</span>
            </span>
          </span>
          <h1 className="font-headline-md text-headline-md text-on-primary uppercase tracking-wide text-center">
            Ingeniería Sol
          </h1>
          <p className="font-label-sm text-label-sm text-primary-fixed-dim mt-sm uppercase tracking-[0.15em] text-center">
            Portal de Operaciones
          </p>
        </div>
        <div className="p-xl flex flex-col gap-lg">{children}</div>
        <div className="bg-surface-container-low p-md border-t border-outline-variant text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.1em]">
            Solo personal autorizado · Sistema monitoreado
          </p>
        </div>
      </div>
    </div>
  )
}
