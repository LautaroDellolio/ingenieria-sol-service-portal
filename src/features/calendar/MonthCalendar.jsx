import { toISODateString } from '../../lib/dateUtils'
import { getRouteSheetColor, VISIT_COLOR_CLASSES } from '../../lib/visitColor'

const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MAX_VISIBLE_ROUTE_SHEETS = 3

export default function MonthCalendar({ monthAnchor, weeks, routeSheets, onSelectDay }) {
  const todayIso = toISODateString(new Date())

  const routeSheetsByDate = new Map()
  for (const routeSheet of routeSheets) {
    if (!routeSheet.scheduled_date) continue
    if (!routeSheetsByDate.has(routeSheet.scheduled_date)) routeSheetsByDate.set(routeSheet.scheduled_date, [])
    routeSheetsByDate.get(routeSheet.scheduled_date).push(routeSheet)
  }

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-surface-container">
        {DAY_LABELS.map((label) => (
          <div key={label} className="py-xs text-center font-label-sm text-label-sm text-on-surface-variant uppercase">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-outline-variant">
        {weeks.flat().map((day) => {
          const dateStr = toISODateString(day)
          const dayRouteSheets = routeSheetsByDate.get(dateStr) ?? []
          const isCurrentMonth = day.getMonth() === monthAnchor.getMonth()
          const isToday = dateStr === todayIso

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`min-h-[11.2rem] min-w-0 p-xs text-left flex flex-col gap-xs transition-colors hover:bg-surface-container-low ${
                isCurrentMonth ? 'bg-surface-container-lowest' : 'bg-surface-container-low/50'
              }`}
            >
              <span
                className={`shrink-0 font-label-sm text-label-sm w-xl h-xl flex items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-secondary text-on-secondary'
                    : isCurrentMonth
                      ? 'text-on-surface'
                      : 'text-on-surface-variant/50'
                }`}
              >
                {day.getDate()}
              </span>

              {dayRouteSheets.length > 0 && (
                <div className="min-w-0 flex flex-col gap-[0.2rem]">
                  {dayRouteSheets.slice(0, MAX_VISIBLE_ROUTE_SHEETS).map((routeSheet) => {
                    const routeSheetVisits = routeSheet.visits ?? []
                    const label =
                      routeSheetVisits.length === 1
                        ? routeSheetVisits[0].equipment?.motor ?? '—'
                        : `${routeSheetVisits.length} equipos`
                    return (
                      <span
                        key={routeSheet.id}
                        className={`block w-full min-w-0 truncate rounded px-xs py-[0.1rem] font-label-sm text-label-sm text-on-surface border ${VISIT_COLOR_CLASSES[getRouteSheetColor(routeSheet)]}`}
                      >
                        {label}
                      </span>
                    )
                  })}
                  {dayRouteSheets.length > MAX_VISIBLE_ROUTE_SHEETS && (
                    <span className="px-xs font-label-sm text-label-sm text-on-surface-variant">
                      +{dayRouteSheets.length - MAX_VISIBLE_ROUTE_SHEETS} más
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
