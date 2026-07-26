import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const YEAR_GRID_SIZE = 16

export default function MonthYearPicker({ monthAnchor, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('month') // 'month' | 'year'
  const [targetYear, setTargetYear] = useState(monthAnchor.getFullYear())
  const [yearGridStart, setYearGridStart] = useState(monthAnchor.getFullYear() - 7)

  useEffect(() => {
    if (!isOpen) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const activeMonthIndex = monthAnchor.getMonth()
  const activeYear = monthAnchor.getFullYear()
  const label = monthAnchor.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  function handleOpen() {
    setView('month')
    setTargetYear(activeYear)
    setYearGridStart(activeYear - 7)
    setIsOpen(true)
  }

  function handleSelectMonth(monthIndex) {
    onSelect(new Date(targetYear, monthIndex, 1))
    setIsOpen(false)
  }

  function handleOpenYearView() {
    setYearGridStart(targetYear - 7)
    setView('year')
  }

  function handleSelectYear(year) {
    setTargetYear(year)
    setView('month')
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        className="flex items-center gap-xs font-headline-md text-headline-md text-on-surface hover:text-secondary transition-colors capitalize"
      >
        {label}
        <span className="material-symbols-outlined text-[2rem]">arrow_drop_down</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 z-50 mt-sm w-[28rem] max-w-[90vw] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-lg">
            {view === 'month' ? (
              <>
                <div className="flex items-center justify-between mb-md">
                  <Button variant="secondary-outline" icon="chevron_left" onClick={() => setTargetYear((year) => year - 1)} className="rounded-full" />
                  <button
                    type="button"
                    onClick={handleOpenYearView}
                    className="px-md py-xs rounded-full font-label-md text-label-md text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors"
                  >
                    {targetYear}
                  </button>
                  <Button variant="secondary-outline" icon="chevron_right" onClick={() => setTargetYear((year) => year + 1)} className="rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-sm">
                  {MONTH_LABELS.map((monthLabel, index) => {
                    const isActive = targetYear === activeYear && index === activeMonthIndex
                    return (
                      <button
                        key={monthLabel}
                        type="button"
                        onClick={() => handleSelectMonth(index)}
                        className={`py-sm rounded-lg font-label-sm text-label-sm transition-colors ${
                          isActive ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        {monthLabel}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-md">
                  <Button
                    variant="secondary-outline"
                    icon="chevron_left"
                    onClick={() => setYearGridStart((year) => year - YEAR_GRID_SIZE)}
                    className="rounded-full"
                  />
                  <span className="font-label-md text-label-md text-on-surface">
                    {yearGridStart} – {yearGridStart + YEAR_GRID_SIZE - 1}
                  </span>
                  <Button
                    variant="secondary-outline"
                    icon="chevron_right"
                    onClick={() => setYearGridStart((year) => year + YEAR_GRID_SIZE)}
                    className="rounded-full"
                  />
                </div>
                <div className="grid grid-cols-4 gap-sm">
                  {Array.from({ length: YEAR_GRID_SIZE }, (_, index) => yearGridStart + index).map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      className={`py-sm rounded-lg font-label-sm text-label-sm transition-colors ${
                        year === activeYear ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
