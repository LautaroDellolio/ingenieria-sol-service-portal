import { useRegisterSW } from 'virtual:pwa-register/react'
import Button from '../components/ui/Button'

// injectRegister: false en vite.config.js: este hook es lo unico que
// registra el service worker (sin el, nada de la app queda disponible
// offline). registerType: 'prompt' hace que una version nueva NO fuerce un
// reload solo: si el tecnico esta a mitad de un formulario, la actualizacion
// espera a que la confirme.
export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-[7.2rem] md:bottom-md inset-x-0 mx-auto w-fit z-50 flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-2 p-sm px-md">
      <span className="font-body-sm text-body-sm text-on-surface">Hay una nueva versión disponible.</span>
      <Button variant="primary" onClick={() => updateServiceWorker(true)}>
        Actualizar
      </Button>
    </div>
  )
}
