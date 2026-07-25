import { useMemo } from 'react'
import { getAlertLevel, getNextAnnualServiceDue } from '../lib/dateUtils'

// Deriva, para cada equipo, la fecha del proximo service anual y su nivel de alerta.
export function useAnnualServiceAlerts(equipmentList) {
  return useMemo(() => {
    const today = new Date()
    return equipmentList.map((item) => {
      const dueDate = getNextAnnualServiceDue(item)
      return { equipmentId: item.id, dueDate, alertLevel: getAlertLevel(dueDate, today) }
    })
  }, [equipmentList])
}
