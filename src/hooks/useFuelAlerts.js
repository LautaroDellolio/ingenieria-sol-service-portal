import { useMemo } from 'react'
import { FUEL_ALERT_THRESHOLD_PERCENTAGE } from '../lib/constants'

// Deriva, de la lista de equipo ya cargada, cuales tienen combustible bajo.
export function useFuelAlerts(equipmentList) {
  return useMemo(
    () =>
      equipmentList
        .filter((item) => item.fuel_percentage != null && item.fuel_percentage <= FUEL_ALERT_THRESHOLD_PERCENTAGE)
        .sort((a, b) => a.fuel_percentage - b.fuel_percentage),
    [equipmentList]
  )
}
