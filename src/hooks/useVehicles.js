import { useEffect, useState } from 'react'
import { listVehicles } from '../api/vehicles'

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
