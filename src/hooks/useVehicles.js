import { useCallback, useEffect, useState } from 'react'
import { listVehicles, listAllVehicles } from '../api/vehicles'

export function useVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    listVehicles()
      .then((data) => {
        if (isMounted) setVehicles(data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { vehicles, loading }
}

export function useAllVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setVehicles(await listAllVehicles())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { vehicles, loading, reload }
}
