import { useCallback, useEffect, useState } from 'react'
import {
  getVisitById,
  listAllSubmittedVisits,
  listUnassignedVisits,
  listVisitsForTechnician,
  listVisitsInRange,
  listVisitsPendingReview,
  listVisitsThisMonth,
} from '../api/visits'
import { listEventsForVisit } from '../api/visitEvents'
import { supabase } from '../lib/supabaseClient'

export function useAsync(loader, deps) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loader()
      setData(result)
    } catch (loadError) {
      setError(loadError)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload }
}

export function useVisitsPendingReview() {
  return useAsync(listVisitsPendingReview, [])
}

export function useAllSubmittedVisits() {
  return useAsync(listAllSubmittedVisits, [])
}

export function useTechnicianVisits(technicianId) {
  return useAsync(() => (technicianId ? listVisitsForTechnician(technicianId) : Promise.resolve([])), [technicianId])
}

export function useUnassignedVisits() {
  return useAsync(listUnassignedVisits, [])
}

export function useVisitsInRange(startDate, endDate) {
  return useAsync(() => listVisitsInRange(startDate, endDate), [startDate, endDate])
}

export function useVisitsThisMonth() {
  return useAsync(listVisitsThisMonth, [])
}

export function useVisitParameters(visitId) {
  return useAsync(async () => {
    if (!visitId) return []
    const { data, error } = await supabase.from('visit_parameters').select('*').eq('visit_id', visitId)
    if (error) throw error
    return data
  }, [visitId])
}

export function useVisitEvents(visitId) {
  return useAsync(() => (visitId ? listEventsForVisit(visitId) : Promise.resolve([])), [visitId])
}

export function useVisitDetail(visitId) {
  return useAsync(() => (visitId ? getVisitById(visitId) : Promise.resolve(null)), [visitId])
}
