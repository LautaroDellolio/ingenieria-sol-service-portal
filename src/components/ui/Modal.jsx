import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ open, title, children, onClose, actions = [] }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-margin-mobile"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[28rem] bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden"
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
            {actions.map((action) => (
              <Button key={action.label} variant={action.variant ?? 'secondary-outline'} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
