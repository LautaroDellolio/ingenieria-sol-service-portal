import { useEffect, useState } from 'react'
import { listTechnicians } from '../api/profiles'

export function useTechnicians() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    listTechnicians()
      .then((data) => {
        if (isMounted) setTechnicians(data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { technicians, loading }
}
