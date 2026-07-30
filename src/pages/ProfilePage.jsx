import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updatePassword } from '../api/auth'
import { ROLE_LABELS } from '../lib/constants'
import { formatDate } from '../lib/dateUtils'
import FormSection from '../components/ui/FormSection'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import StatusChip from '../components/ui/StatusChip'

const ROLE_TONE = { administrativo: 'neutral', tecnico: 'success', supervisor: 'warning' }

function DetailField({ label, value }) {
  return (
    <div>
      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</p>
      <p className="font-body-md text-body-md text-on-surface">{value ?? '—'}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { profile } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      await updatePassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMessage('Contraseña actualizada correctamente.')
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo actualizar la contraseña.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl space-y-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Mi Perfil</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Tus datos de cuenta y acceso.</p>
      </div>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-xl">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mis Datos</h3>
          <StatusChip label={ROLE_LABELS[profile.role]} tone={ROLE_TONE[profile.role]} variant="tag" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <DetailField label="Usuario" value={`@${profile.username}`} />
          <DetailField label="Nombre Completo" value={profile.full_name} />
          <DetailField label="Teléfono" value={profile.phone} />
          <DetailField label="Dirección" value={profile.address} />
          <DetailField label="Fecha de Registro" value={profile.registered_at ? formatDate(profile.registered_at) : null} />
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-md">
          Estos datos los administra un supervisor. Si necesitás corregir algo, pedile que lo actualice desde Personal.
        </p>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-xl">
        <form onSubmit={handleSubmit} className="space-y-md">
          <FormSection title="Cambiar Contraseña">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Nueva Contraseña" type="password" value={newPassword} onChange={setNewPassword} required />
              <Field label="Confirmar Contraseña" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
            </div>
          </FormSection>

          {errorMessage && <p role="alert" className="font-body-sm text-body-sm text-error">{errorMessage}</p>}
          {successMessage && <p className="font-body-sm text-body-sm text-tertiary-fixed-dim">{successMessage}</p>}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Actualizar Contraseña'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
