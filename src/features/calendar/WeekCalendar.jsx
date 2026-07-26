import { useState } from 'react'
import { addDays, toISODateString } from '../../lib/dateUtils'
import TaskCard from './TaskCard'

const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function WeekCalendar({ weekStart, routeSheets, onSelectRouteSheet, onDropRouteSheet }) {
  const [dragOverDate, setDragOverDate] = useState(null)
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const todayIso = toISODateString(new Date())

  function handleDrop(event, dateStr) {
    event.preventDefault()
    setDragOverDate(null)
    const routeSheetId = event.dataTransfer.getData('text/plain')
    if (routeSheetId) onDropRouteSheet(routeSheetId, dateStr)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-sm">
      {days.map((day) => {
        const dateStr = toISODateString(day)
        const dayRouteSheets = routeSheets
          .filter((routeSheet) => routeSheet.scheduled_date === dateStr)
          .sort((a, b) => (a.scheduled_time_start ?? '').localeCompare(b.scheduled_time_start ?? ''))

        return (
          <div
            key={dateStr}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOverDate(dateStr)
            }}
            onDragLeave={() => setDragOverDate((current) => (current === dateStr ? null : current))}
            onDrop={(event) => handleDrop(event, dateStr)}
            className={`min-h-[16rem] min-w-0 border border-outline-variant rounded p-xs flex flex-col gap-xs transition-colors ${
              dragOverDate === dateStr ? 'drop-target' : 'bg-surface-container-lowest'
            }`}
          >
            <div className={`text-center pb-xs border-b border-outline-variant ${dateStr === todayIso ? 'text-secondary' : 'text-on-surface-variant'}`}>
              <p className="font-label-sm text-label-sm uppercase">{DAY_LABELS[day.getDay() === 0 ? 6 : day.getDay() - 1]}</p>
              <p className="font-label-md text-label-md">{day.getDate()}</p>
            </div>
            <div className="flex-1 space-y-xs overflow-y-auto">
              {dayRouteSheets.map((routeSheet) => (
                <div key={routeSheet.id} className="relative">
                  {routeSheet.scheduled_time_start && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {routeSheet.scheduled_time_start.slice(0, 5)}
                    </span>
                  )}
                  <TaskCard routeSheet={routeSheet} onClick={onSelectRouteSheet} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
