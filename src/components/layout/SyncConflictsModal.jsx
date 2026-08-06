import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import ConfirmModal from '../ui/ConfirmModal'
import Button from '../ui/Button'
import { removePendingWrite } from '../../offline/syncQueue'
import { getCachedVisit } from '../../offline/routeSheetCache'

const REASON_LABELS = {
  conflict: 'Esta visita cambió de estado en el servidor mientras estabas sin conexión. Tu cambio local no se pudo aplicar.',
}

export default function SyncConflictsModal({ open, conflicts, onClose }) {
  const navigate = useNavigate()
  const [discardTarget, setDiscardTarget] = useState(null)
  const [visitInfoById, setVisitInfoById] = useState({})

  useEffect(() => {
    if (!open || conflicts.length === 0) return undefined
    let cancelled = false
    Promise.all(conflicts.map((entry) => getCachedVisit(entry.visitId))).then((visits) => {
      if (cancelled) return
      const nextMap = {}
      conflicts.forEach((entry, index) => {
        nextMap[entry.visitId] = visits[index]
      })
      setVisitInfoById(nextMap)
    })
    return () => {
      cancelled = true
    }
  }, [open, conflicts])

  async function handleConfirmDiscard() {
    if (!discardTarget) return
    await removePendingWrite(discardTarget)
    setDiscardTarget(null)
  }

  function goToVisit(visitId) {
    onClose()
    navigate(`/tecnico/visita/${visitId}`)
  }

  return (
    <>
      <Modal open={open} title="Problemas al sincronizar" onClose={onClose}>
        {conflicts.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant">No hay conflictos pendientes.</p>
        ) : (
          <ul className="space-y-md">
            {conflicts.map((entry) => {
              const visitInfo = visitInfoById[entry.visitId]
              return (
                <li key={entry.visitId} className="border border-outline-variant rounded p-md">
                  <p className="font-label-md text-label-md text-on-surface mb-xs">
                    {visitInfo?.equipment?.motor ?? 'Visita'}
                    {visitInfo?.equipment?.clients?.name ? ` · ${visitInfo.equipment.clients.name}` : ''}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">
                    {REASON_LABELS[entry.lastError] ?? `No se pudo sincronizar: ${entry.lastError}`}
                  </p>
                  <div className="flex justify-end gap-sm">
                    <Button variant="destructive-outline" onClick={() => setDiscardTarget(entry.visitId)}>
                      Descartar cambio local
                    </Button>
                    <Button variant="secondary-outline" onClick={() => goToVisit(entry.visitId)}>
                      Ver visita
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Modal>

      <ConfirmModal
        open={discardTarget != null}
        title="Descartar cambio local"
        confirmLabel="Descartar"
        danger
        onConfirm={handleConfirmDiscard}
        onCancel={() => setDiscardTarget(null)}
      >
        Se va a perder el cambio guardado en este dispositivo para esta visita. Esta acción no se puede deshacer.
      </ConfirmModal>
    </>
  )
}
