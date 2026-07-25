import { useEffect, useState } from 'react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { updateVisitAssignment } from '../../api/visits'

export default function AssignmentPopover({ visit, technicians, vehicles, onClose, onSaved }) {
  const [technicianId, setTechnicianId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')

  useEffect(() => {
    if (!visit) return
    setTechnicianId(visit.technician_id ?? '')
    setVehicleId(visit.vehicle_id ?? '')
    setScheduledDate(visit.scheduled_date ?? '')
    setScheduledTime(visit.scheduled_time_start?.slice(0, 5) ?? '09:00')
  }, [visit])

  async function handleSave(event) {
    event.preventDefault()
    await updateVisitAssignment(visit.id, {
      technicianId: technicianId || null,
      vehicleId: vehicleId || null,
      scheduledDate: scheduledDate || null,
      scheduledTimeStart: scheduledTime,
    })
    onSaved()
  }

  return (
    <Modal open={Boolean(visit)} title={`Asignar visita · ${visit?.equipment?.internal_code ?? ''}`} onClose={onClose}>
      <form onSubmit={handleSave} className="space-y-md">
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface block">Técnico</label>
          <select
            value={technicianId}
            onChange={(event) => setTechnicianId(event.target.value)}
            className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
          >
            <option value="">Sin asignar</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>{technician.full_name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface block">Vehículo</label>
          <select
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
          >
            <option value="">Sin asignar</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.plate} — {vehicle.description}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface block">Fecha</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(event) => setScheduledDate(event.target.value)}
              className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
            />
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface block">Hora</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(event) => setScheduledTime(event.target.value)}
              className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth>
          Guardar Asignación
        </Button>
      </form>
    </Modal>
  )
}
