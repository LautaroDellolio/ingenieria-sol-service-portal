import { useState } from 'react'
import { useSyncController } from '../../offline/useOfflineSync'
import Button from '../ui/Button'
import StatusChip from '../ui/StatusChip'
import SyncConflictsModal from './SyncConflictsModal'

export default function SyncStatusBar() {
  const { online, pendingCount, syncing, syncNow, conflicts } = useSyncController()
  const [conflictsOpen, setConflictsOpen] = useState(false)

  // Nada que mostrar: online y sin cambios pendientes de enviar.
  if (online && pendingCount === 0) return null

  return (
    <>
      <div className="flex flex-wrap items-center gap-sm mb-lg p-sm px-md rounded-lg border border-outline-variant bg-surface-container-lowest">
        <span className={`material-symbols-outlined text-[1.8rem] ${online ? 'text-on-surface-variant' : 'text-error'}`}>
          {online ? 'wifi' : 'wifi_off'}
        </span>
        <span className="font-label-md text-label-md text-on-surface">{online ? 'Conectado' : 'Sin conexión'}</span>

        {pendingCount > 0 && <StatusChip label={`${pendingCount} sin sincronizar`} tone="warning" variant="tag" />}

        {conflicts.length > 0 && (
          <button
            type="button"
            onClick={() => setConflictsOpen(true)}
            className="hover:opacity-80 transition-opacity focus-visible:outline-none"
          >
            <StatusChip label={`${conflicts.length} con problemas`} tone="error" variant="tag" />
          </button>
        )}

        <div className="flex-1" />

        <Button variant="secondary-outline" icon="sync" disabled={!online || syncing || pendingCount === 0} onClick={syncNow}>
          {syncing ? 'Sincronizando…' : 'Sincronizar ahora'}
        </Button>
      </div>

      <SyncConflictsModal open={conflictsOpen} conflicts={conflicts} onClose={() => setConflictsOpen(false)} />
    </>
  )
}
