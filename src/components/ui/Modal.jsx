import { useEffect } from 'react'
import Button from './Button'

// Ojo: nunca usar las clases max-w-sm/md/lg/xl de Tailwind aca — colisionan
// con los tokens de spacing custom del proyecto (ver tailwind.config.js) y
// resuelven a anchos rotos. Por eso este mapa usa valores arbitrarios [Nrem]
// o porcentuales, nunca los nombres cortos de la escala por defecto.
const SIZE_CLASSES = {
  md: 'w-full max-w-[28rem]',
  lg: 'w-[90%]',
}

// El sidebar fijo de los layouts internos mide 25.6rem (ver Sidebar.jsx /
// TopBar.jsx). Por defecto el modal deja esa franja libre para no taparlo;
// las pantallas sin sidebar (ej. Login) pasan fullViewport para ocupar todo.
export default function Modal({ open, title, children, onClose, actions = [], size = 'md', fullViewport = false }) {
  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 ${fullViewport ? '' : 'md:left-[25.6rem]'} z-50 flex items-center justify-center bg-on-surface/40 p-margin-mobile`}
      onClick={onClose}
    >
      <div
        className={`${SIZE_CLASSES[size]} bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-md border-b border-outline-variant">
          <h2 id="modal-title" className="font-headline-md text-headline-md text-on-surface">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-on-surface-variant hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-md">{children}</div>
        {actions.length > 0 && (
          <div className="flex flex-col-reverse md:flex-row justify-end gap-sm p-md border-t border-outline-variant">
            {actions.map(({ label, variant, onClick, ...buttonProps }) => (
              <Button key={label} variant={variant ?? 'secondary-outline'} onClick={onClick} {...buttonProps}>
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
