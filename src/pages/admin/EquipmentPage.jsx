import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEquipment } from '../../hooks/useEquipment'
import { useClients } from '../../hooks/useClients'
import { createEquipment } from '../../api/equipment'
import { createClient } from '../../api/clients'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import Spinner from '../../components/ui/Spinner'
import ClientGroupRow from '../../features/equipmentInventory/ClientGroupRow'
import EquipmentHistoryPanel from '../../features/equipmentInventory/EquipmentHistoryPanel'
import { CONDITION_STATUS, CONDITION_STATUS_LABELS, FUEL_TYPE, FUEL_TYPE_LABELS } from '../../lib/constants'

const EMPTY_CLIENT_FORM = { name: '', contact_name: '', contact_phone: '', address: '', city: '' }
const EMPTY_EQUIPMENT_FORM = {
  client_id: '',
  motor: '',
  generador: '',
  serial_number: '',
  power_kva: '',
  fuel_type: FUEL_TYPE.DIESEL,
  fuel_filter_spec: '',
  oil_filter_spec: '',
  air_filter_spec: '',
  coolant_capacity: '',
  fuel_capacity: '',
  oil_capacity: '',
  battery_quantity: '',
  battery_size: '',
  condition_status: CONDITION_STATUS.OPTIMO,
}

export default function EquipmentPage() {
  const { profile } = useAuth()
  const { equipment, loading, reload: reloadEquipment } = useEquipment()
  const { clients, loading: clientsLoading, reload: reloadClients } = useClients()

  const [historyEquipment, setHistoryEquipment] = useState(null)
  const [showNewClient, setShowNewClient] = useState(false)
  const [showNewEquipment, setShowNewEquipment] = useState(false)
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT_FORM)
  const [equipmentForm, setEquipmentForm] = useState(EMPTY_EQUIPMENT_FORM)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEquipment = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return equipment
    return equipment.filter((item) => {
      const haystack = [item.motor, item.generador, item.clients?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [equipment, searchTerm])

  const clientGroups = useMemo(() => {
    const groups = new Map()
    for (const item of filteredEquipment) {
      const client = item.clients
      if (!client) continue
      if (!groups.has(client.id)) groups.set(client.id, { client, equipmentList: [] })
      groups.get(client.id).equipmentList.push(item)
    }
    return Array.from(groups.values()).sort((a, b) => a.client.name.localeCompare(b.client.name))
  }, [filteredEquipment])

  async function handleCreateClient(event) {
    event.preventDefault()
    await createClient({ ...clientForm, created_by: profile.id })
    setClientForm(EMPTY_CLIENT_FORM)
    setShowNewClient(false)
    reloadClients()
  }

  async function handleCreateEquipment(event) {
    event.preventDefault()
    await createEquipment({
      ...equipmentForm,
      power_kva: equipmentForm.power_kva ? Number(equipmentForm.power_kva) : null,
      created_by: profile.id,
    })
    setEquipmentForm(EMPTY_EQUIPMENT_FORM)
    setShowNewEquipment(false)
    reloadEquipment()
  }

  if (loading || clientsLoading) return <Spinner label="Cargando inventario…" />

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Inventario de Equipos</h1>
        </div>
        <div className="flex gap-sm">
          <Button variant="secondary-outline" icon="person_add" onClick={() => setShowNewClient(true)}>
            Nuevo Cliente
          </Button>
          <Button variant="primary" icon="add" onClick={() => setShowNewEquipment(true)}>
            Nuevo Equipo
          </Button>
        </div>
      </div>

      <Field
        label="Buscar por motor, generador o cliente"
        value={searchTerm}
        onChange={setSearchTerm}
        className="max-w-[36rem] mb-md"
      />

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-sm px-sm py-xs bg-surface-container border-b border-outline-variant">
          <span className="col-span-4 font-label-sm text-label-sm text-on-surface-variant uppercase pl-xl">Cliente / Equipo</span>
          <span className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase">% Combustible</span>
          <span className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase">Horas de Uso</span>
          <span className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase">Último Service</span>
          <span className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase">Condición</span>
        </div>
        {clientGroups.length === 0 ? (
          <p className="p-md font-body-sm text-body-sm text-on-surface-variant">
            {searchTerm.trim() ? 'No se encontraron equipos para tu búsqueda.' : 'Todavía no hay clientes ni equipos cargados.'}
          </p>
        ) : (
          clientGroups.map((group) => (
            <ClientGroupRow
              key={group.client.id}
              client={group.client}
              equipmentList={group.equipmentList}
              onOpenHistory={setHistoryEquipment}
              onClientDeleted={reloadClients}
            />
          ))
        )}
      </div>

      <EquipmentHistoryPanel
        equipment={historyEquipment}
        onClose={() => setHistoryEquipment(null)}
        onUpdated={(updated) => {
          setHistoryEquipment(updated)
          reloadEquipment()
        }}
      />

      <Modal
        open={showNewClient}
        title="Nuevo Cliente"
        onClose={() => setShowNewClient(false)}
        size="lg"
        actions={[
          { label: 'Cancelar', variant: 'secondary-outline', onClick: () => setShowNewClient(false) },
          { label: 'Guardar Cliente', variant: 'primary', type: 'submit', form: 'new-client-form' },
        ]}
      >
        <form id="new-client-form" onSubmit={handleCreateClient} className="space-y-md">
          <FormSection title="Datos del Cliente">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Cliente" value={clientForm.name} onChange={(v) => setClientForm((f) => ({ ...f, name: v }))} required className="md:col-span-2" />
              <Field label="Contacto" value={clientForm.contact_name} onChange={(v) => setClientForm((f) => ({ ...f, contact_name: v }))} />
              <Field label="Teléfono" value={clientForm.contact_phone} onChange={(v) => setClientForm((f) => ({ ...f, contact_phone: v }))} />
              <Field label="Dirección" value={clientForm.address} onChange={(v) => setClientForm((f) => ({ ...f, address: v }))} />
              <Field label="Ciudad" value={clientForm.city} onChange={(v) => setClientForm((f) => ({ ...f, city: v }))} />
            </div>
          </FormSection>
        </form>
      </Modal>

      <Modal
        open={showNewEquipment}
        title="Nuevo Equipo"
        onClose={() => setShowNewEquipment(false)}
        size="lg"
        actions={[
          { label: 'Cancelar', variant: 'secondary-outline', onClick: () => setShowNewEquipment(false) },
          { label: 'Guardar Equipo', variant: 'primary', type: 'submit', form: 'new-equipment-form' },
        ]}
      >
        <form id="new-equipment-form" onSubmit={handleCreateEquipment} className="space-y-md">
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface block">Cliente</label>
            <select
              required
              value={equipmentForm.client_id}
              onChange={(event) => setEquipmentForm((f) => ({ ...f, client_id: event.target.value }))}
              className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
            >
              <option value="" disabled>Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <FormSection title="Datos Principales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Motor" value={equipmentForm.motor} onChange={(v) => setEquipmentForm((f) => ({ ...f, motor: v }))} />
              <Field label="N° de Serie" value={equipmentForm.serial_number} onChange={(v) => setEquipmentForm((f) => ({ ...f, serial_number: v }))} />
              <Field label="Generador" value={equipmentForm.generador} onChange={(v) => setEquipmentForm((f) => ({ ...f, generador: v }))} />
              <Field label="Potencia (kVA)" type="number" value={equipmentForm.power_kva} onChange={(v) => setEquipmentForm((f) => ({ ...f, power_kva: v }))} />
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface block">Combustible</label>
                <select
                  value={equipmentForm.fuel_type}
                  onChange={(event) => setEquipmentForm((f) => ({ ...f, fuel_type: event.target.value }))}
                  className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
                >
                  {Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface block">Condición</label>
                <select
                  value={equipmentForm.condition_status}
                  onChange={(event) => setEquipmentForm((f) => ({ ...f, condition_status: event.target.value }))}
                  className="w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface"
                >
                  {Object.entries(CONDITION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection title="Datos Secundarios">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Filtro de Combustible" value={equipmentForm.fuel_filter_spec} onChange={(v) => setEquipmentForm((f) => ({ ...f, fuel_filter_spec: v }))} />
              <Field label="Filtro de Aceite" value={equipmentForm.oil_filter_spec} onChange={(v) => setEquipmentForm((f) => ({ ...f, oil_filter_spec: v }))} />
              <Field label="Filtro de Aire" value={equipmentForm.air_filter_spec} onChange={(v) => setEquipmentForm((f) => ({ ...f, air_filter_spec: v }))} />
              <Field label="Cantidad de Agua" value={equipmentForm.coolant_capacity} onChange={(v) => setEquipmentForm((f) => ({ ...f, coolant_capacity: v }))} />
              <Field label="Cantidad de Combustible" value={equipmentForm.fuel_capacity} onChange={(v) => setEquipmentForm((f) => ({ ...f, fuel_capacity: v }))} />
              <Field label="Cantidad de Aceite" value={equipmentForm.oil_capacity} onChange={(v) => setEquipmentForm((f) => ({ ...f, oil_capacity: v }))} />
              <Field label="Cantidad de Baterías" value={equipmentForm.battery_quantity} onChange={(v) => setEquipmentForm((f) => ({ ...f, battery_quantity: v }))} />
              <Field label="Medida de Batería" value={equipmentForm.battery_size} onChange={(v) => setEquipmentForm((f) => ({ ...f, battery_size: v }))} />
            </div>
          </FormSection>
        </form>
      </Modal>
    </div>
  )
}
