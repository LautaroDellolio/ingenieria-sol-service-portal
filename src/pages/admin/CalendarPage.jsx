import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUnassignedVisits, useVisitsInRange } from '../../hooks/useVisits'
import { useTechnicians } from '../../hooks/useTechnicians'
import { useVehicles } from '../../hooks/useVehicles'
import { useEquipment } from '../../hooks/useEquipment'
import { createVisit, updateVisitAssignment } from '../../api/visits'
import { addDays, startOfWeek, toISODateString, formatDate } from '../../lib/dateUtils'
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import WeekCalendar from '../../features/calendar/WeekCalendar'
import UnassignedList from '../../features/calendar/UnassignedList'
import TechnicianAvailabilityList from '../../features/calendar/TechnicianAvailabilityList'
import AssignmentPopover from '../../features/calendar/AssignmentPopover'

export default function CalendarPage() {
  const { profile } = useAuth()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const weekEnd = addDays(weekStart, 6)

  const { data: unassignedVisits, loading: unassignedLoading, reload: reloadUnassigned } = useUnassignedVisits()
  const { data: weekVisits, loading: weekLoading, reload: reloadWeek } = useVisitsInRange(
    toISODateString(weekStart),
    toISODateString(weekEnd)
  )
  const { technicians } = useTechnicians()
  const { vehicles } = useVehicles()
  const { equipment } = useEquipment()

  const [selectedVisit, setSelectedVisit] = useState(null)
  const [showNewVisit, setShowNewVisit] = useState(false)
  const [newVisitForm, setNewVisitForm] = useState({ equipmentId: '', serviceType: SERVICE_TYPE.PREVENTIVO, isAnnualService: false })

  function reloadAll() {
    reloadUnassigned()
    reloadWeek()
  }

  async function handleDropVisit(visitId, dateStr) {
    const visit = [...(unassignedVisits ?? []), ...(weekVisits ?? [])].find((item) => item.id === visitId)
    await updateVisitAssignment(visitId, {
      technicianId: visit?.technician_id ?? null,
      vehicleId: visit?.vehicle_id ?? null,
      scheduledDate: dateStr,
      scheduledTimeStart: visit?.scheduled_time_start?.slice(0, 5) ?? '09:00',
    })
    reloadAll()
  }

  async function handleCreateVisit(event) {
    event.preventDefault()
    await createVisit({
      equipmentId: newVisitForm.equipmentId,
      serviceType: newVisitForm.serviceType,
      isAnnualService: newVisitForm.isAnnualService,
      createdBy: profile.id,
    })
    setNewVisitForm({ equipmentId: '', serviceType: SERVICE_TYPE.PREVENTIVO, isAnnualService: false })
    setShowNewVisit(false)
    reloadAll()
  }

  if (unassignedLoading || weekLoading) return <Spinner label="Cargando calendario…" />

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Planificación de Rutas</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {formatDate(weekStart)} – {formatDate(weekEnd)}
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary-outline" icon="chevron_left" onClick={() => setWeekStart(addDays(weekStart, -7))} />
          <Button variant="secondary-outline" onClick={() => setWeekStart(startOfWeek(new Date()))}>Hoy</Button>
          <Button variant="secondary-outline" icon="chevron_right" onClick={() => setWeekStart(addDays(weekStart, 7))} />
          <Button variant="primary" icon="add" onClick={() => setShowNewVisit(true)}>Nueva Visita</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-md">
        <aside className="lg:w-[28rem] space-y-lg shrink-0">
          <UnassignedList visits={unassignedVisits ?? []} onSelectVisit={setSelectedVisit} />
          <TechnicianAvailabilityList technicians={technicians} />
        </aside>

        <div className="flex-1">
          <WeekCalendar
            weekStart={weekStart}
            visits={weekVisits ?? []}
            onSelectVisit={setSelectedVisit}
            onDropVisit={handleDropVisit}
          />
        </div>
      </div>

      <AssignmentPopover
        visit={selectedVisit}
        technicians={technicians}
        vehicles={vehicles}
        onClose={() => setSelectedVisit(null)}
        onSaved={() => {
          setSelectedVisit(null)
          reloadAll()
        }}
      />

      <Modal open={showNewVisit} title="Nueva Visita" onClose={() => setShowNewVisit(false)}>
        <form onSubmit={handleCreateVisit} className="space-y-md">
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface block">Equipo</label>
            <select
              required
              value={newVisitForm.equipmentId}
              onChange={(event) => setNewVisitForm((f) => ({ ...f, equipmentId: event.target.value }))}
              className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
            >
              <option value="" disabled>Seleccionar equipo</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.internal_code} — {item.clients?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface block">Tipo de Servicio</label>
            <select
              value={newVisitForm.serviceType}
              onChange={(event) => setNewVisitForm((f) => ({ ...f, serviceType: event.target.value }))}
              className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
            >
              {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-sm">
            <input
              type="checkbox"
              checked={newVisitForm.isAnnualService}
              onChange={(event) => setNewVisitForm((f) => ({ ...f, isAnnualService: event.target.checked }))}
              className="w-[1.6rem] h-[1.6rem] rounded border-outline"
            />
            <span className="font-body-sm text-body-sm text-on-surface">Es un service anual</span>
          </label>
          <Button type="submit" variant="primary" fullWidth>
            Crear Visita
          </Button>
        </form>
      </Modal>
    </div>
  )
}
