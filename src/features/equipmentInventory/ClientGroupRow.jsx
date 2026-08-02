import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteClient } from '../../api/clients'
import Button from '../../components/ui/Button'
import ConfirmModal from '../../components/ui/ConfirmModal'
import EquipmentRow from './EquipmentRow'

export default function ClientGroupRow({ client, equipmentList, expanded, onToggleExpanded, onOpenHistory, onClientDeleted }) {
  const { profile } = useAuth()
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
      <div className="w-full flex items-center gap-sm py-sm px-sm bg-secondary hover:bg-secondary-container transition-colors">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex-1 flex items-center gap-sm text-left"
        >
          <span className="material-symbols-outlined text-[2rem] text-secondary-fixed-dim">
            {expanded ? 'expand_more' : 'chevron_right'}
          </span>
          <span className="font-label-md text-label-md text-on-secondary">{client.name}</span>
          <span className="font-label-sm text-label-sm text-secondary-fixed-dim">({equipmentList.length})</span>
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
