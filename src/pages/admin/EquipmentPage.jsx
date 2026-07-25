import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEquipment } from '../../hooks/useEquipment'
import { useClients } from '../../hooks/useClients'
import { useAnnualServiceAlerts } from '../../hooks/useAnnualServiceAlerts'
import { createEquipment } from '../../api/equipment'
import { supabase } from '../../lib/supabaseClient'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import Spinner from '../../components/ui/Spinner'
import ClientGroupRow from '../../features/equipmentInventory/ClientGroupRow'
import EquipmentHistoryPanel from '../../features/equipmentInventory/EquipmentHistoryPanel'
import { CONDITION_STATUS } from '../../lib/constants'

const EMPTY_CLIENT_FORM = { name: '', tax_id: '', address: '', contact_name: '', contact_phone: '', contact_email: '' }
const EMPTY_EQUIPMENT_FORM = {
  client_id: '',
  internal_code: '',
  brand: '',
  model: '',
  serial_number: '',
  power_kva: '',
  fuel_type: 'diesel',
  install_date: '',
  site_location: '',
  condition_status: CONDITION_STATUS.OPTIMO,
}

export default function EquipmentPage() {
  const { profile } = useAuth()
  const { equipment, loading, reload: reloadEquipment } = useEquipment()
  const { clients, loading: clientsLoading, reload: reloadClients } = useClients()
  const alerts = useAnnualServiceAlerts(equipment)
  const alertsByEquipmentId = useMemo(() => new Map(alerts.map((alert) => [alert.equipmentId, alert])), [alerts])

  const [historyEquipment, setHistoryEquipment] = useState(null)
  const [showNewClient, setShowNewClient] = useState(false)
  const [showNewEquipment, setShowNewEquipment] = useState(false)
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT_FORM)
  const [equipmentForm, setEquipmentForm] = useState(EMPTY_EQUIPMENT_FORM)

  const clientGroups = useMemo(() => {
    const groups = new Map()
    for (const item of equipment) {
      const client = item.clients
      if (!client) continue
      if (!groups.has(client.id)) groups.set(client.id, { client, equipmentList: [] })
      groups.get(client.id).equipmentList.push(item)
    }
    return Array.from(groups.values()).sort((a, b) => a.client.name.localeCompare(b.client.name))
  }, [equipment])

  async function handleCreateClient(event) {
    event.preventDefault()
    const { error } = await supabase.from('clients').insert({ ...clientForm, created_by: profile.id })
    if (error) return
    setClientForm(EMPTY_CLIENT_FORM)
    setShowNewClient(false)
    reloadClients()
  }

  async function handleCreateEquipment(event) {
    event.preventDefault()
    await createEquipment({
      ...equipmentForm,
      power_kva: equipmentForm.power_kva ? Number(equipmentForm.power_kva) : null,
      install_date: equipmentForm.install_date || null,
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
          <p className="font-body-md text-body-md text-on-surface-variant">Agrupados por cliente, con historial y alertas de service anual.</p>
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

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-sm px-sm py-xs bg-surface-container border-b border-outline-variant">
          <span className="col-span-4 font-label-sm text-label-sm text-on-surface-variant uppercase pl-xl">Cliente / Equipo</span>
          <span className="col-span-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Último Service</span>
          <span className="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase">Condición</span>
          <span className="col-span-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Próximo Anual</span>
        </div>
        {clientGroups.length === 0 ? (
          <p className="p-md font-body-sm text-body-sm text-on-surface-variant">Todavía no hay clientes ni equipos cargados.</p>
        ) : (
          clientGroups.map((group) => (
            <ClientGroupRow
              key={group.client.id}
              client={group.client}
              equipmentList={group.equipmentList}
              alertsByEquipmentId={alertsByEquipmentId}
              onOpenHistory={setHistoryEquipment}
            />
          ))
        )}
      </div>

      <EquipmentHistoryPanel equipment={historyEquipment} onClose={() => setHistoryEquipment(null)} />

      <Modal open={showNewClient} title="Nuevo Cliente" onClose={() => setShowNewClient(false)}>
        <form onSubmit={handleCreateClient} className="space-y-md">
          <FormSection title="Datos del Cliente">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Field label="Nombre" value={clientForm.name} onChange={(v) => setClientForm((f) => ({ ...f, name: v }))} required />
              <Field label="CUIT" value={clientForm.tax_id} onChange={(v) => setClientForm((f) => ({ ...f, tax_id: v }))} />
              <Field label="Dirección" value={clientForm.address} onChange={(v) => setClientForm((f) => ({ ...f, address: v }))} className="md:col-span-2" />
              <Field label="Contacto" value={clientForm.contact_name} onChange={(v) => setClientForm((f) => ({ ...f, contact_name: v }))} />
              <Field label="Teléfono" value={clientForm.contact_phone} onChange={(v) => setClientForm((f) => ({ ...f, contact_phone: v }))} />
              <Field label="Email" value={clientForm.contact_email} onChange={(v) => setClientForm((f) => ({ ...f, contact_email: v }))} className="md:col-span-2" />
            </div>
          </FormSection>
          <Button type="submit" variant="primary" fullWidth>
            Guardar Cliente
          </Button>
        </form>
      </Modal>

      <Modal open={showNewEquipment} title="Nuevo Equipo" onClose={() => setShowNewEquipment(false)}>
        <form onSubmit={handleCreateEquipment} className="space-y-md">
          <FormSection title="Ficha Técnica">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
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
              <Field label="Código Interno" value={equipmentForm.internal_code} onChange={(v) => setEquipmentForm((f) => ({ ...f, internal_code: v }))} required />
              <Field label="Marca" value={equipmentForm.brand} onChange={(v) => setEquipmentForm((f) => ({ ...f, brand: v }))} />
              <Field label="Modelo" value={equipmentForm.model} onChange={(v) => setEquipmentForm((f) => ({ ...f, model: v }))} />
              <Field label="N° de Serie" value={equipmentForm.serial_number} onChange={(v) => setEquipmentForm((f) => ({ ...f, serial_number: v }))} />
              <Field label="Potencia (kVA)" type="number" value={equipmentForm.power_kva} onChange={(v) => setEquipmentForm((f) => ({ ...f, power_kva: v }))} />
              <Field label="Fecha de Instalación" type="date" value={equipmentForm.install_date} onChange={(v) => setEquipmentForm((f) => ({ ...f, install_date: v }))} />
              <Field label="Ubicación" value={equipmentForm.site_location} onChange={(v) => setEquipmentForm((f) => ({ ...f, site_location: v }))} />
            </div>
          </FormSection>
          <Button type="submit" variant="primary" fullWidth>
            Guardar Equipo
          </Button>
        </form>
      </Modal>
    </div>
  )
}
