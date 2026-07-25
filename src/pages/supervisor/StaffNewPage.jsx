import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStaffMember } from '../../api/staff'
import { ROLES, ROLE_LABELS } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import FormSection from '../../components/ui/FormSection'

const EMPTY_FORM = { username: '', fullName: '', role: ROLES.TECNICO, password: '' }

export default function StaffNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)
    try {
      await createStaffMember(form)
      navigate('/supervisor/personal', { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo crear el usuario.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Dar de Alta Personal</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
        Creá una cuenta nueva para un administrativo, técnico o supervisor.
      </p>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-xl">
        <form onSubmit={handleSubmit} className="space-y-xl">
          <FormSection title="Datos de la Cuenta">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field
                label="Usuario"
                value={form.username}
                onChange={(value) => setForm((f) => ({ ...f, username: value }))}
                required
              />
              <Field
                label="Nombre Completo"
                value={form.fullName}
                onChange={(value) => setForm((f) => ({ ...f, fullName: value }))}
                required
              />
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface block">Rol</label>
                <select
                  value={form.role}
                  onChange={(event) => setForm((f) => ({ ...f, role: event.target.value }))}
                  className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <Field
                label="Contraseña Temporal"
                type="password"
                value={form.password}
                onChange={(value) => setForm((f) => ({ ...f, password: value }))}
                required
              />
            </div>
          </FormSection>

          {errorMessage && (
            <p role="alert" className="font-body-sm text-body-sm text-error">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-sm">
            <Button type="button" variant="secondary-outline" onClick={() => navigate('/supervisor/personal')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creando…' : 'Crear Cuenta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
