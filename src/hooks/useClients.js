import { useEffect, useState } from 'react'
import { listClients } from '../api/clients'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    listClients()
      .then((data) => {
        if (isMounted) setClients(data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { clients, loading }
}
