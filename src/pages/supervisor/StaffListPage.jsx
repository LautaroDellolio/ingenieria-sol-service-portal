import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listStaff, setProfileActive } from '../../api/profiles'
import { ROLE_LABELS } from '../../lib/constants'
import Button from '../../components/ui/Button'
import StatusChip from '../../components/ui/StatusChip'
import Spinner from '../../components/ui/Spinner'

const ROLE_TONE = { administrativo: 'neutral', tecnico: 'success', supervisor: 'warning' }

export default function StaffListPage() {
  const navigate = useNavigate()
  const [staff, setStaff] = useState(null)

  async function loadStaff() {
    setStaff(await listStaff())
  }

  useEffect(() => {
    loadStaff()
  }, [])

  async function handleToggleActive(profile) {
    await setProfileActive(profile.id, !profile.active)
    loadStaff()
  }

  if (!staff) return <Spinner label="Cargando personal…" />

  return (
    <div>
      <div className="flex items-center justify-between gap-sm mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Personal</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Gestioná las cuentas del equipo.</p>
        </div>
        <Button variant="primary" icon="person_add" onClick={() => navigate('/supervisor/personal/nuevo')}>
          Nuevo Personal
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
        <ul className="divide-y divide-outline-variant/50">
          {staff.map((person) => (
            <li key={person.id} className="flex items-center justify-between gap-sm p-md">
              <div>
                <p className="font-label-md text-label-md text-on-surface">{person.full_name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">@{person.username}</p>
              </div>
              <div className="flex items-center gap-md">
                <StatusChip label={ROLE_LABELS[person.role]} tone={ROLE_TONE[person.role]} variant="tag" />
                <Button
                  variant={person.active ? 'destructive-outline' : 'secondary-outline'}
                  onClick={() => handleToggleActive(person)}
                >
                  {person.active ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
