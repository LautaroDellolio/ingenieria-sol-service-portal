import { ANNUAL_SERVICE_ALERT_WINDOW_DAYS } from './constants'

const MS_PER_DAY = 86400000

export function addYears(date, years) {
  return new Date(date.getFullYear() + years, date.getMonth(), date.getDate())
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY)
}

export function getNextAnnualServiceDue(equipment) {
  const base = equipment.last_annual_service_date ?? equipment.install_date
  return base ? addYears(new Date(base), 1) : null
}

// 'sin_datos' | 'vencido' | 'proximo' | 'al_dia'
export function getAlertLevel(dueDate, today = new Date()) {
  if (!dueDate) return 'sin_datos'
  const days = daysBetween(today, dueDate)
  if (days < 0) return 'vencido'
  if (days <= ANNUAL_SERVICE_ALERT_WINDOW_DAYS) return 'proximo'
  return 'al_dia'
}

export function formatDate(dateInput) {
  if (!dateInput) return '—'
  const date = new Date(dateInput)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—'
  const date = new Date(dateInput)
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function startOfWeek(date) {
  const result = startOfDay(date)
  const day = result.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diffToMonday)
  return result
}

export function addDays(date, days) {
  const result = startOfDay(date)
  result.setDate(result.getDate() + days)
  return result
}

export function toISODateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
