import { useCallback, useEffect, useState } from 'react'
import { listEquipmentWithClients, getEquipmentVisitHistory } from '../api/equipment'

export function useEquipment() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setEquipment(await listEquipmentWithClients())
    } catch (loadError) {
      setError(loadError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { equipment, loading, error, reload }
}

export function useEquipmentHistory(equipmentId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!equipmentId) {
      setHistory([])
      return
    }
    let isMounted = true
    setLoading(true)
    getEquipmentVisitHistory(equipmentId)
      .then((data) => {
        if (isMounted) setHistory(data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [equipmentId])

  return { history, loading }
}
