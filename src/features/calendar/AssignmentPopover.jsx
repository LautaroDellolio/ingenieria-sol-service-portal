import { useEffect, useState } from 'react'
import Modal from '../../components/ui/Modal'
import { updateRouteSheetAssignment } from '../../api/routeSheets'

export default function AssignmentPopover({ routeSheet, technicians, vehicles, onClose, onSaved }) {
  const [technicianIds, setTechnicianIds] = useState(new Set())
  const [vehicleId, setVehicleId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')

  useEffect(() => {
    if (!routeSheet) return
    setTechnicianIds(new Set((routeSheet.technicians ?? []).map((technician) => technician.id)))
    setVehicleId(routeSheet.vehicle_id ?? '')
    setScheduledDate(routeSheet.scheduled_date ?? '')
    setScheduledTime(routeSheet.scheduled_time_start?.slice(0, 5) ?? '09:00')
  }, [routeSheet])

  function toggleTechnician(technicianId) {
    setTechnicianIds((current) => {
      const next = new Set(current)
      if (next.has(technicianId)) next.delete(technicianId)
      else next.add(technicianId)
      return next
    })
  }

  async function handleSave(event) {
    event.preventDefault()
    await updateRouteSheetAssignment(routeSheet.id, {
      technicianIds: Array.from(technicianIds),
      vehicleId: vehicleId || null,
      scheduledDate: scheduledDate || null,
      scheduledTimeStart: scheduledTime,
    })
    onSaved()
  }

  const equipmentCodes = (routeSheet?.visits ?? []).map((visit) => visit.equipment?.motor).filter(Boolean)

  return (
    <Modal
      open={Boolean(routeSheet)}
      title={`Asignar Hoja de Ruta · ${equipmentCodes.join(', ')}`}
      onClose={onClose}
      size="lg"
      actions={[
        { label: 'Cancelar', variant: 'secondary-outline', onClick: onClose },
        { label: 'Guardar Asignación', variant: 'primary', type: 'submit', form: 'assignment-form' },
      ]}
    >
      <form id="assignment-form" onSubmit={handleSave} className="space-y-md">
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface block">Técnicos</label>
          {technicians.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No hay técnicos disponibles.</p>
          ) : (
            <div className="border border-outline-variant rounded divide-y divide-outline-variant/50 max-h-[16rem] overflow-y-auto">
              {technicians.map((technician) => (
                <label key={technician.id} className="flex items-center gap-sm p-sm cursor-pointer hover:bg-surface-container-low">
                  <input
                    type="checkbox"
                    checked={technicianIds.has(technician.id)}
                    onChange={() => toggleTechnician(technician.id)}
                    className="w-[1.6rem] h-[1.6rem] rounded border-outline"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">{technician.full_name}</span>
                </label>
              ))}
            </div>
          )}
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
              <option key={vehicle.id} value={vehicle.id}>{vehicle.plate} — {vehicle.name}</option>
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
      </form>
    </Modal>
  )
}
