import EquipmentRow from '../equipmentInventory/EquipmentRow'

export default function ClientCard({ client, equipmentList, expanded, onToggleExpanded, onOpenHistory }) {
  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full flex items-center gap-sm py-sm px-md bg-secondary hover:bg-secondary-container transition-colors text-left"
      >
        <span className="material-symbols-outlined text-[2rem] text-secondary-fixed-dim">
          {expanded ? 'expand_more' : 'chevron_right'}
        </span>
        <span className="flex-1 font-label-md text-label-md text-on-secondary">{client.name}</span>
        <span className="font-label-sm text-label-sm text-secondary-fixed-dim">{equipmentList.length} equipo(s)</span>
      </button>

      {expanded && (
        <div>
          <div className="bg-secondary-container grid grid-cols-2 md:grid-cols-4 gap-sm p-md">
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">CUIT</p>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{client.tax_id || '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">Contacto</p>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{client.contact_name || '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">Teléfono</p>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{client.contact_phone || '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">Email</p>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{client.contact_email || '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">Dirección</p>
              <p className="font-body-sm text-body-sm text-on-secondary-container">{client.address || '—'}</p>
            </div>
            {client.notes && (
              <div className="col-span-2 md:col-span-4">
                <p className="font-label-sm text-label-sm text-on-secondary-container/80 uppercase">Notas</p>
                <p className="font-body-sm text-body-sm text-on-secondary-container">{client.notes}</p>
              </div>
            )}
          </div>

          {equipmentList.length === 0 ? (
            <p className="p-md font-body-sm text-body-sm text-on-surface-variant">
              Este cliente todavía no tiene equipos cargados.
            </p>
          ) : (
            <div>
              {equipmentList.map((equipment, index) => (
                <EquipmentRow key={equipment.id} equipment={equipment} onOpenHistory={onOpenHistory} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
