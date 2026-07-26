import { useAsync } from './useVisits'
import { listRouteSheetsInRange, listUnassignedRouteSheets } from '../api/routeSheets'

export function useRouteSheetsInRange(startDate, endDate) {
  return useAsync(() => listRouteSheetsInRange(startDate, endDate), [startDate, endDate])
}

export function useUnassignedRouteSheets() {
  return useAsync(listUnassignedRouteSheets, [])
}
