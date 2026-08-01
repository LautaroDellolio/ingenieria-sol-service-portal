import { CHECKLIST_ITEM_STATUS, SERVICE_TYPE_LABELS, VISIT_CHECKLIST_ITEMS, VISIT_STATUS_LABELS } from '../../lib/constants'
import { formatDate, formatDateTime } from '../../lib/dateUtils'
import StatusChip from '../../components/ui/StatusChip'
import Timeline from '../../components/ui/Timeline'
import ParametersTable from './ParametersTable'

const CHECKLIST_STATUS_ICON = {
  [CHECKLIST_ITEM_STATUS.OK]: { icon: 'check_circle', className: 'text-tertiary-fixed-dim' },
  [CHECKLIST_ITEM_STATUS.A_REVISAR]: { icon: 'warning', className: 'text-warning' },
  [CHECKLIST_ITEM_STATUS.FALLA]: { icon: 'cancel', className: 'text-error' },
  [CHECKLIST_ITEM_STATUS.NO_TIENE]: { icon: 'block', className: 'text-on-surface-variant' },
}

function SignatureDisplay({ label, signature, signatureName, signatureAt }) {
  return (
    <div>
      <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">{label}</h4>
      {signature ? (
        <>
          <img src={signature} alt={label} className="w-full h-[15rem] object-contain border border-outline-variant rounded bg-white" />
          <p className="font-body-sm text-body-sm text-on-surface text-center mt-xs">{signatureName || 'Sin aclaración'}</p>
          {signatureAt && (
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center">{formatDateTime(signatureAt)}</p>
          )}
        </>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant">Sin firma registrada.</p>
      )}
    </div>
  )
}

export default function VisitDetailPanel({ visit, parameters, events, actions }) {
  const timelineEvents = events.map((event) => ({
    id: event.id,
    label: VISIT_STATUS_LABELS[event.event_type] ?? event.event_type,
    actor: event.profiles?.full_name ?? 'Sistema',
    timestamp: formatDateTime(event.created_at),
    notes: event.notes,
  }))

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="p-md border-b border-outline-variant flex items-center justify-between flex-wrap gap-sm">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">{visit.equipment?.motor}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{visit.equipment?.clients?.name}</p>
        </div>
        <StatusChip label={VISIT_STATUS_LABELS[visit.status]} tone="warning" />
      </div>

      {actions && <div className="p-md border-b border-outline-variant flex flex-wrap gap-sm">{actions}</div>}

      <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="border border-outline-variant rounded p-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Detalles del Equipo</h3>
          <dl className="grid grid-cols-2 gap-y-xs font-body-sm text-body-sm">
            <dt className="text-on-surface-variant">Motor / Generador</dt>
            <dd className="text-on-surface">{visit.equipment?.motor} {visit.equipment?.generador}</dd>
            <dt className="text-on-surface-variant">Tipo de servicio</dt>
            <dd className="text-on-surface">{SERVICE_TYPE_LABELS[visit.service_type] ?? '—'}</dd>
            <dt className="text-on-surface-variant">Técnico(s)</dt>
            <dd className="text-on-surface">
              {visit.technicians?.length > 0 ? visit.technicians.map((t) => t.full_name).join(', ') : '—'}
            </dd>
            <dt className="text-on-surface-variant">Vehículo</dt>
            <dd className="text-on-surface">{visit.vehicles?.plate ?? '—'}</dd>
            <dt className="text-on-surface-variant">Fecha</dt>
            <dd className="text-on-surface">{formatDate(visit.scheduled_date)}</dd>
          </dl>
        </div>

        <div className="border border-outline-variant rounded p-md">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Validación Técnica</h3>
          <ul className="space-y-xs">
            {VISIT_CHECKLIST_ITEMS.map((item) => {
              const status = visit.checklist_data?.[item.key]
              const display = CHECKLIST_STATUS_ICON[status]
              const measurementValue = item.measurement ? visit.checklist_data?.[item.measurement.key] : null
              return (
                <li key={item.key} className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface">
                  <span className={`material-symbols-outlined text-[1.6rem] ${display?.className ?? 'text-on-surface-variant'}`}>
                    {display?.icon ?? 'help'}
                  </span>
                  <span>{item.label}</span>
                  {measurementValue != null && measurementValue !== '' && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      ({measurementValue} {item.measurement.unit})
                    </span>
                  )}
                  {!display && <span className="font-label-sm text-label-sm text-on-surface-variant">(sin registrar)</span>}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border border-outline-variant rounded p-md md:col-span-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Parámetros Registrados</h3>
          <ParametersTable parameters={parameters} />
        </div>

        {visit.fault_reported && (
          <div className="border border-error rounded p-md md:col-span-2 bg-error-container/30">
            <h3 className="font-label-md text-label-md text-on-error-container uppercase mb-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[1.8rem]">warning</span>
              Falla Reportada
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface">{visit.fault_description}</p>
          </div>
        )}

        <div className="border border-outline-variant rounded p-md md:col-span-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Notas del Técnico</h3>
          <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-wrap">{visit.notes || 'Sin notas.'}</p>
        </div>

        <div className="border border-outline-variant rounded p-md md:col-span-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Firmas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <SignatureDisplay
              label="Firma Técnico Responsable"
              signature={visit.technician_signature}
              signatureName={visit.technician_signature_name}
              signatureAt={visit.technician_signature_at}
            />
            <SignatureDisplay
              label="Firma Conformidad Cliente"
              signature={visit.client_signature}
              signatureName={visit.client_signature_name}
              signatureAt={visit.client_signature_at}
            />
          </div>
        </div>

        <div className="border border-outline-variant rounded p-md md:col-span-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Historial</h3>
          <Timeline events={timelineEvents} />
        </div>
      </div>
    </div>
  )
}
