import { useState } from 'react'
import { addDays, toISODateString } from '../../lib/dateUtils'
import TaskCard from './TaskCard'

const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function WeekCalendar({ weekStart, visits, onSelectVisit, onDropVisit }) {
  const [dragOverDate, setDragOverDate] = useState(null)
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const todayIso = toISODateString(new Date())

  function handleDrop(event, dateStr) {
    event.preventDefault()
    setDragOverDate(null)
    const visitId = event.dataTransfer.getData('text/plain')
    if (visitId) onDropVisit(visitId, dateStr)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-sm">
      {days.map((day) => {
        const dateStr = toISODateString(day)
        const dayVisits = visits
          .filter((visit) => visit.scheduled_date === dateStr)
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
            className={`min-h-[16rem] border border-outline-variant rounded p-xs flex flex-col gap-xs transition-colors ${
              dragOverDate === dateStr ? 'drop-target' : 'bg-surface-container-lowest'
            }`}
          >
            <div className={`text-center pb-xs border-b border-outline-variant ${dateStr === todayIso ? 'text-secondary' : 'text-on-surface-variant'}`}>
              <p className="font-label-sm text-label-sm uppercase">{DAY_LABELS[day.getDay() === 0 ? 6 : day.getDay() - 1]}</p>
              <p className="font-label-md text-label-md">{day.getDate()}</p>
            </div>
            <div className="flex-1 space-y-xs overflow-y-auto">
              {dayVisits.map((visit) => (
                <div key={visit.id} className="relative">
                  {visit.scheduled_time_start && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {visit.scheduled_time_start.slice(0, 5)}
                    </span>
                  )}
                  <TaskCard visit={visit} onClick={onSelectVisit} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
