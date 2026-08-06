import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEquipment } from '../../hooks/useEquipment'
import { useClients } from '../../hooks/useClients'
import { createClient } from '../../api/clients'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import FormSection from '../../components/ui/FormSection'
import Field from '../../components/ui/Field'
import Spinner from '../../components/ui/Spinner'
import ClientCard from '../../features/clients/ClientCard'
import EquipmentHistoryPanel from '../../features/equipmentInventory/EquipmentHistoryPanel'

const EMPTY_CLIENT_FORM = { name: '', contact_name: '', contact_phone: '', address: '', city: '' }

export default function ClientsPage() {
  const { profile } = useAuth()
  const { equipment, loading: equipmentLoading, reload: reloadEquipment } = useEquipment()
  const { clients, loading: clientsLoading, reload: reloadClients } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedClientIds, setCollapsedClientIds] = useState(() => new Set())
  const [historyEquipment, setHistoryEquipment] = useState(null)
  const [showNewClient, setShowNewClient] = useState(false)
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT_FORM)
  const [savingClient, setSavingClient] = useState(false)
  const [clientError, setClientError] = useState('')
  const hasCollapsedByDefault = useRef(false)

  // Arranca con todos los clientes contraidos. Solo se aplica una vez, al
  // llegar el primer listado, para no volver a contraer todo si despues se
  // recarga el listado (ej. tras editar un equipo) y el usuario ya habia
  // expandido algo.
  useEffect(() => {
    if (hasCollapsedByDefault.current || clients.length === 0) return
    hasCollapsedByDefault.current = true
    setCollapsedClientIds(new Set(clients.map((client) => client.id)))
  }, [clients])

  const clientGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return clients
      .map((client) => ({
        client,
        equipmentList: equipment.filter((item) => item.client_id === client.id),
      }))
      .filter(({ client, equipmentList }) => {
        if (!term) return true
        const haystack = [client.name, ...equipmentList.map((item) => item.motor)].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(term)
      })
      .sort((a, b) => a.client.name.localeCompare(b.client.name))
  }, [clients, equipment, searchTerm])

  const allClientsCollapsed =
    clientGroups.length > 0 && clientGroups.every(({ client }) => collapsedClientIds.has(client.id))

  function toggleClientExpanded(clientId) {
    setCollapsedClientIds((prev) => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })
  }

  function toggleAllClientsCollapsed() {
    setCollapsedClientIds(allClientsCollapsed ? new Set() : new Set(clientGroups.map(({ client }) => client.id)))
  }

  async function handleCreateClient(event) {
    event.preventDefault()
    setSavingClient(true)
    setClientError('')
    try {
      await createClient({ ...clientForm, created_by: profile.id })
      setClientForm(EMPTY_CLIENT_FORM)
      setShowNewClient(false)
      reloadClients()
    } catch (error) {
      setClientError(error.message || 'No se pudo guardar el cliente.')
    } finally {
      setSavingClient(false)
    }
  }

  function closeNewClient() {
    setShowNewClient(false)
    setClientForm(EMPTY_CLIENT_FORM)
    setClientError('')
  }

  if (equipmentLoading || clientsLoading) return <Spinner label="Cargando clientes…" />

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm mb-xs">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Clientes</h1>
        <Button variant="primary" icon="person_add" onClick={() => setShowNewClient(true)}>
          Nuevo Cliente
        </Button>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Ficha y equipos instalados por cliente.</p>

      <Field label="Buscar por cliente o motor" value={searchTerm} onChange={setSearchTerm} className="max-w-[36rem] mb-md" />

      {clientGroups.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {searchTerm.trim() ? 'No se encontraron clientes para tu búsqueda.' : 'Todavía no hay clientes cargados.'}
        </p>
      ) : (
        <div className="space-y-sm">
          <button
            type="button"
            onClick={toggleAllClientsCollapsed}
            aria-label={allClientsCollapsed ? 'Expandir todos los clientes' : 'Contraer todos los clientes'}
            className="flex items-center gap-xs px-md font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[2rem]">
              {allClientsCollapsed ? 'unfold_more' : 'unfold_less'}
            </span>
            {allClientsCollapsed ? 'Expandir todos' : 'Contraer todos'}
          </button>
          {clientGroups.map(({ client, equipmentList }) => (
            <ClientCard
              key={client.id}
              client={client}
              equipmentList={equipmentList}
              expanded={!collapsedClientIds.has(client.id)}
              onToggleExpanded={() => toggleClientExpanded(client.id)}
              onOpenHistory={setHistoryEquipment}
            />
          ))}
        </div>
      )}

      <EquipmentHistoryPanel
        equipment={historyEquipment}
        onClose={() => setHistoryEquipment(null)}
        onUpdated={(updated) => {
          setHistoryEquipment(updated)
          reloadEquipment()
        }}
        onDeleted={reloadEquipment}
      />

      <Modal
        open={showNewClient}
        title="Nuevo Cliente"
        onClose={savingClient ? () => {} : closeNewClient}
        size="lg"
        actions={[
          { label: 'Cancelar', variant: 'secondary-outline', onClick: closeNewClient, disabled: savingClient },
          { label: savingClient ? 'Guardando…' : 'Guardar Cliente', variant: 'primary', type: 'submit', form: 'new-client-form', disabled: savingClient },
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
          {clientError && (
            <p role="alert" className="font-body-sm text-body-sm text-error">
              {clientError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  )
}
