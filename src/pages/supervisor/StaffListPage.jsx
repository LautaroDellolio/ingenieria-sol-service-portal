import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listStaff, setProfileActive } from '../../api/profiles'
import { createVehicle, setVehicleActive, deleteVehicle } from '../../api/vehicles'
import { useAllVehicles } from '../../hooks/useVehicles'
import { ROLE_LABELS } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import StatusChip from '../../components/ui/StatusChip'
import Spinner from '../../components/ui/Spinner'
import StaffDetailPanel from '../../features/staff/StaffDetailPanel'
import VehicleDetailPanel from '../../features/staff/VehicleDetailPanel'

const ROLE_TONE = { administrativo: 'neutral', tecnico: 'success', supervisor: 'warning' }
const EMPTY_VEHICLE_FORM = { plate: '', name: '' }

export default function StaffListPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  const [staff, setStaff] = useState(null)
  const [detailStaff, setDetailStaff] = useState(null)
  const { vehicles, loading: vehiclesLoading, reload: reloadVehicles } = useAllVehicles()
  const [detailVehicle, setDetailVehicle] = useState(null)
  const [showNewVehicle, setShowNewVehicle] = useState(false)
  const [vehicleForm, setVehicleForm] = useState(EMPTY_VEHICLE_FORM)
  const [savingVehicle, setSavingVehicle] = useState(false)
  const [vehicleError, setVehicleError] = useState('')
  const [deletingVehicle, setDeletingVehicle] = useState(null)
  const [deleteVehicleError, setDeleteVehicleError] = useState('')

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

  async function handleToggleVehicleActive(vehicle) {
    await setVehicleActive(vehicle.id, !vehicle.active)
    reloadVehicles()
  }

  async function handleCreateVehicle(event) {
    event.preventDefault()
    setSavingVehicle(true)
    setVehicleError('')
    try {
      await createVehicle(vehicleForm)
      setVehicleForm(EMPTY_VEHICLE_FORM)
      setShowNewVehicle(false)
      reloadVehicles()
    } catch (error) {
      setVehicleError(
        error.code === '23505' ? 'Ya existe un vehículo con esa patente.' : error.message || 'No se pudo guardar el vehículo.'
      )
    } finally {
      setSavingVehicle(false)
    }
  }

  function closeNewVehicle() {
    setShowNewVehicle(false)
    setVehicleForm(EMPTY_VEHICLE_FORM)
    setVehicleError('')
  }

  async function handleDeleteVehicle() {
    setDeleteVehicleError('')
    try {
      await deleteVehicle(deletingVehicle.id)
      setDeletingVehicle(null)
      reloadVehicles()
    } catch (error) {
      setDeleteVehicleError(
        error.message?.includes('foreign key') ? 'No se puede eliminar: el vehículo tiene hojas de ruta asociadas.' : error.message || 'No se pudo eliminar el vehículo.'
      )
    }
  }

  if (!staff) return <Spinner label="Cargando personal…" />

  return (
    <div>
      <div className="flex items-center justify-between gap-sm mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Personal</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Gestioná las cuentas del equipo y la flota de vehículos.</p>
        </div>
        {activeTab === 'personal' ? (
          <Button variant="primary" icon="person_add" onClick={() => navigate('/supervisor/personal/nuevo')}>
            Nuevo Personal
          </Button>
        ) : (
          <Button variant="primary" icon="add" onClick={() => setShowNewVehicle(true)}>
            Nuevo Vehículo
          </Button>
        )}
      </div>

      <div className="flex items-center gap-sm mb-lg">
        <Button variant={activeTab === 'personal' ? 'primary' : 'secondary-outline'} onClick={() => setActiveTab('personal')}>
          Personal
        </Button>
        <Button variant={activeTab === 'vehiculos' ? 'primary' : 'secondary-outline'} onClick={() => setActiveTab('vehiculos')}>
          Vehículos
        </Button>
      </div>

      {activeTab === 'personal' ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <ul className="divide-y divide-outline-variant/50">
            {staff.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  onClick={() => setDetailStaff(person)}
                  className="w-full flex items-center justify-between gap-sm p-md text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{person.full_name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">@{person.username}</p>
                  </div>
                  <div className="flex items-center gap-md">
                    <StatusChip label={ROLE_LABELS[person.role]} tone={ROLE_TONE[person.role]} variant="tag" />
                    <Button
                      variant={person.active ? 'destructive-outline' : 'secondary-outline'}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleToggleActive(person)
                      }}
                    >
                      {person.active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : vehiclesLoading ? (
        <Spinner label="Cargando vehículos…" />
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <ul className="divide-y divide-outline-variant/50">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <button
                  type="button"
                  onClick={() => setDetailVehicle(vehicle)}
                  className="w-full flex items-center justify-between gap-sm p-md text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{vehicle.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{vehicle.plate}</p>
                  </div>
                  <div className="flex items-center gap-md">
                    <Button
                      variant={vehicle.active ? 'destructive-outline' : 'secondary-outline'}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleToggleVehicleActive(vehicle)
                      }}
                    >
                      {vehicle.active ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      variant="destructive-outline"
                      icon="delete"
                      className="rounded-full"
                      onClick={(event) => {
                        event.stopPropagation()
                        setDeleteVehicleError('')
                        setDeletingVehicle(vehicle)
                      }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <StaffDetailPanel
        staff={detailStaff}
        onClose={() => setDetailStaff(null)}
        onUpdated={(updated) => {
          setDetailStaff(updated)
          loadStaff()
        }}
      />

      <VehicleDetailPanel
        vehicle={detailVehicle}
        onClose={() => setDetailVehicle(null)}
        onUpdated={(updated) => {
          setDetailVehicle(updated)
          reloadVehicles()
        }}
      />

      <Modal
        open={showNewVehicle}
        title="Nuevo Vehículo"
        onClose={savingVehicle ? () => {} : closeNewVehicle}
        size="md"
        actions={[
          { label: 'Cancelar', variant: 'secondary-outline', onClick: closeNewVehicle, disabled: savingVehicle },
          { label: savingVehicle ? 'Guardando…' : 'Guardar Vehículo', variant: 'primary', type: 'submit', form: 'new-vehicle-form', disabled: savingVehicle },
        ]}
      >
        <form id="new-vehicle-form" onSubmit={handleCreateVehicle} className="space-y-md">
          <FormSection title="Datos del Vehículo">
            <div className="space-y-md">
              <Field label="Patente" value={vehicleForm.plate} onChange={(v) => setVehicleForm((f) => ({ ...f, plate: v }))} required />
              <Field label="Nombre" value={vehicleForm.name} onChange={(v) => setVehicleForm((f) => ({ ...f, name: v }))} required />
            </div>
          </FormSection>
          {vehicleError && (
            <p role="alert" className="font-body-sm text-body-sm text-error">
              {vehicleError}
            </p>
          )}
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingVehicle)}
        title={`Eliminar ${deletingVehicle?.name ?? ''}`}
        confirmLabel="Eliminar"
        danger
        onCancel={() => {
          setDeletingVehicle(null)
          setDeleteVehicleError('')
        }}
        onConfirm={handleDeleteVehicle}
      >
        ¿Seguro que querés eliminar este vehículo? Esta acción no se puede deshacer.
        {deleteVehicleError && <span role="alert" className="block text-error mt-sm">{deleteVehicleError}</span>}
      </ConfirmModal>
    </div>
  )
}
