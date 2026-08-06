import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import StatusChip from '../../components/ui/StatusChip'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import { ROLE_LABELS } from '../../lib/constants'
import { formatDate } from '../../lib/dateUtils'
import { updateProfile } from '../../api/profiles'
import { renameStaffUsername } from '../../api/staff'

const ROLE_TONE = { administrativo: 'neutral', tecnico: 'success', supervisor: 'warning' }

function DetailField({ label, value }) {
  return (
    <div>
      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</p>
      <p className="font-body-md text-body-md text-on-surface">{value ?? '—'}</p>
    </div>
  )
}

function toFormValues(staff) {
  return {
    username: staff.username ?? '',
    full_name: staff.full_name ?? '',
    role: staff.role,
    phone: staff.phone ?? '',
    address: staff.address ?? '',
  }
}

export default function StaffDetailPanel({ staff, onClose, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState(null)

  function startEditing() {
    setForm(toFormValues(staff))
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
    const { username, ...profileFields } = form
    const normalizedUsername = username.trim().toLowerCase()
    if (normalizedUsername !== staff.username) {
      await renameStaffUsername(staff.id, normalizedUsername)
    }
    const updated = await updateProfile(staff.id, profileFields)
    stopEditing()
    onUpdated({ ...staff, ...updated })
  }

  const actions = isEditing
    ? [
        { label: 'Cancelar', variant: 'secondary-outline', onClick: stopEditing },
        { label: 'Guardar Cambios', variant: 'primary', type: 'submit', form: 'edit-staff-form' },
      ]
    : [
        { label: 'Cerrar', variant: 'secondary-outline', onClick: handleClose },
        { label: 'Editar', variant: 'primary', icon: 'edit', onClick: startEditing },
      ]

  return (
    <Modal open={Boolean(staff)} title={`Detalle de ${staff?.full_name ?? ''}`} onClose={handleClose} size="lg-auto" actions={actions}>
      {staff && isEditing && (
        <form id="edit-staff-form" onSubmit={handleSubmit} className="space-y-md">
          <FormSection title="Datos de la Persona">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Usuario" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} required />
              <Field label="Nombre Completo" value={form.full_name} onChange={(v) => setForm((f) => ({ ...f, full_name: v }))} required />
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface block">Rol</label>
                <select
                  value={form.role}
                  onChange={(event) => setForm((f) => ({ ...f, role: event.target.value }))}
                  className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface focus:border-secondary focus:border-2 focus:outline-none transition-all"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <Field label="Teléfono" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
              <Field label="Dirección" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
            </div>
          </FormSection>
        </form>
      )}

      {staff && !isEditing && (
        <section>
          <div className="list-title-bar flex items-center justify-between mb-md px-md py-sm rounded">
            <h3 className="font-label-md text-label-md uppercase tracking-wider">Datos de la Persona</h3>
            <div className="flex items-center gap-sm">
              <StatusChip label={ROLE_LABELS[staff.role]} tone={ROLE_TONE[staff.role]} variant="tag" />
              <StatusChip label={staff.active ? 'Activo' : 'Inactivo'} tone={staff.active ? 'success' : 'error'} variant="dot" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            <DetailField label="Usuario" value={`@${staff.username}`} />
            <DetailField label="Nombre Completo" value={staff.full_name} />
            <DetailField label="Teléfono" value={staff.phone} />
            <DetailField label="Dirección" value={staff.address} />
            <DetailField label="Fecha de Registro" value={staff.registered_at ? formatDate(staff.registered_at) : null} />
          </div>
        </section>
      )}
    </Modal>
  )
}
