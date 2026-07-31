import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteClient } from '../../api/clients'
import Button from '../../components/ui/Button'
import ConfirmModal from '../../components/ui/ConfirmModal'
import EquipmentRow from './EquipmentRow'

export default function ClientGroupRow({ client, equipmentList, onOpenHistory, onClientDeleted }) {
  const { profile } = useAuth()
  const [expanded, setExpanded] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleDelete() {
    setErrorMessage('')
    try {
      await deleteClient(client.id)
      setConfirmingDelete(false)
      onClientDeleted()
    } catch (error) {
      setErrorMessage(
        error.message?.includes('foreign key')
          ? 'No se puede eliminar: el cliente todavía tiene equipos asociados.'
          : error.message || 'No se pudo eliminar el cliente.'
      )
    }
  }

  return (
    <div className="border-b border-outline-variant last:border-b-0">
      <div className="w-full flex items-center gap-sm py-sm px-sm hover:bg-surface-container-low transition-colors">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex-1 flex items-center gap-sm text-left"
        >
          <span className="material-symbols-outlined text-[2rem] text-on-surface-variant">
            {expanded ? 'expand_more' : 'chevron_right'}
          </span>
          <span className="font-label-md text-label-md text-on-surface">{client.name}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">({equipmentList.length})</span>
        </button>
        {profile?.role === 'supervisor' && (
          <Button
            variant="destructive-outline"
            icon="delete"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-full"
          />
        )}
      </div>
      {expanded && (
        <div>
          {equipmentList.map((equipment) => (
            <EquipmentRow key={equipment.id} equipment={equipment} onOpenHistory={onOpenHistory} />
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmingDelete}
        title={`Eliminar ${client.name}`}
        confirmLabel="Eliminar"
        danger
        onCancel={() => {
          setConfirmingDelete(false)
          setErrorMessage('')
        }}
        onConfirm={handleDelete}
      >
        ¿Seguro que querés eliminar este cliente? Esta acción no se puede deshacer.
        {errorMessage && <span role="alert" className="block text-error mt-sm">{errorMessage}</span>}
      </ConfirmModal>
    </div>
  )
}
