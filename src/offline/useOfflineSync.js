import { useCallback, useEffect, useState } from 'react'
import { isOnline } from './network'
import { getPendingWrites, flushPendingWrites, syncQueueEvents } from './syncQueue'

// Fuente unica para el resto de los hooks: relee la cola completa al montar
// y cada vez que syncQueue emite 'change' (se encolo algo, se saco algo, o
// termino un flush).
function usePendingWriteEntries() {
  const [entries, setEntries] = useState([])

  const reload = useCallback(() => {
    getPendingWrites().then(setEntries)
  }, [])

  useEffect(() => {
    reload()
    syncQueueEvents.addEventListener('change', reload)
    return () => syncQueueEvents.removeEventListener('change', reload)
  }, [reload])

  return entries
}

export function useConnectivityStatus() {
  const [online, setOnline] = useState(isOnline())

  useEffect(() => {
    function handleOnline() {
      setOnline(true)
    }
    function handleOffline() {
      setOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return online
}

export function usePendingSyncCount() {
  return usePendingWriteEntries().length
}

// Set<visitId> con escritura pendiente, para marcar tarjetas individuales
// (ej. tag "Sin sincronizar" en Mi Plan Mensual).
export function usePendingVisitIds() {
  const entries = usePendingWriteEntries()
  return new Set(entries.map((entry) => entry.visitId))
}

export function useSyncController() {
  const online = useConnectivityStatus()
  const entries = usePendingWriteEntries()
  const [syncing, setSyncing] = useState(false)

  const syncNow = useCallback(async () => {
    if (!isOnline() || syncing) return null
    setSyncing(true)
    try {
      return await flushPendingWrites()
    } finally {
      setSyncing(false)
    }
  }, [syncing])

  // Al recuperar conexion, sincroniza sola sin que el tecnico tenga que
  // acordarse de tocar "Sincronizar ahora" (tambien corre al montar si ya
  // arranca online, para vaciar lo que haya quedado pendiente de una sesion
  // anterior).
  useEffect(() => {
    if (online) syncNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online])

  const conflicts = entries.filter((entry) => entry.lastError === 'conflict')

  return { online, pendingCount: entries.length, syncing, syncNow, conflicts }
}
