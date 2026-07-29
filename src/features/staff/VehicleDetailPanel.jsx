import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import StatusChip from '../../components/ui/StatusChip'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import { updateVehicle } from '../../api/vehicles'

function DetailField({ label, value }) {
  return (
    <div>
      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</p>
      <p className="font-body-md text-body-md text-on-surface">{value ?? '—'}</p>
    </div>
  )
}

function toFormValues(vehicle) {
  return {
    plate: vehicle.plate ?? '',
    name: vehicle.name ?? '',
  }
}

export default function VehicleDetailPanel({ vehicle, onClose, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(null)

  function startEditing() {
    setForm(toFormValues(vehicle))
    setIsEditing(true)
  }

  function stopEditing() {
    setIsEditing(false)
    setForm(null)
  }

  function handleClose() {
    stopEditing()
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const updated = await updateVehicle(vehicle.id, form)
    stopEditing()
    onUpdated({ ...vehicle, ...updated })
  }

  const actions = isEditing
    ? [
        { label: 'Cancelar', variant: 'secondary-outline', onClick: stopEditing },
        { label: 'Guardar Cambios', variant: 'primary', type: 'submit', form: 'edit-vehicle-form' },
      ]
    : [
        { label: 'Cerrar', variant: 'secondary-outline', onClick: handleClose },
        { label: 'Editar', variant: 'primary', icon: 'edit', onClick: startEditing },
      ]

  return (
    <Modal open={Boolean(vehicle)} title={`Detalle de ${vehicle?.name ?? ''}`} onClose={handleClose} size="lg-auto" actions={actions}>
      {vehicle && isEditing && (
        <form id="edit-vehicle-form" onSubmit={handleSubmit} className="space-y-md">
          <FormSection title="Datos del Vehículo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Patente" value={form.plate} onChange={(v) => setForm((f) => ({ ...f, plate: v }))} required />
              <Field label="Nombre" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            </div>
          </FormSection>
        </form>
      )}

      {vehicle && !isEditing && (
        <section>
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Datos del Vehículo</h3>
            <StatusChip label={vehicle.active ? 'Activo' : 'Inactivo'} tone={vehicle.active ? 'success' : 'error'} variant="dot" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <DetailField label="Patente" value={vehicle.plate} />
            <DetailField label="Nombre" value={vehicle.name} />
          </div>
        </section>
      )}
    </Modal>
  )
}
