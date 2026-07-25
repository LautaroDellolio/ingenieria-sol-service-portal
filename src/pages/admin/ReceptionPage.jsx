import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useVisitsPendingReview, useVisitParameters, useVisitEvents } from '../../hooks/useVisits'
import { markVisitReceived } from '../../api/visits'
import VisitReviewQueue from '../../features/visitReview/VisitReviewQueue'
import VisitDetailPanel from '../../features/visitReview/VisitDetailPanel'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

export default function ReceptionPage() {
  const { profile } = useAuth()
  const { data: visits, loading, reload } = useVisitsPendingReview()
  const [selectedId, setSelectedId] = useState(null)

  const selectedVisit = visits?.find((visit) => visit.id === selectedId) ?? null
  const { data: parameters } = useVisitParameters(selectedId)
  const { data: events } = useVisitEvents(selectedId)

  async function handleMarkReceived() {
    await markVisitReceived(selectedId, profile.id)
    setSelectedId(null)
    reload()
  }

  if (loading) return <Spinner label="Cargando visitas…" />

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Recepción de Visitas</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
        Visitas enviadas por los técnicos, a la espera de acuse de recibo administrativo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        <div className="lg:col-span-4">
          <VisitReviewQueue visits={visits ?? []} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="lg:col-span-8">
          {selectedVisit ? (
            <VisitDetailPanel
              visit={selectedVisit}
              parameters={parameters ?? []}
              events={events ?? []}
              actions={
                <Button
                  variant="primary"
                  icon="how_to_reg"
                  onClick={handleMarkReceived}
                  disabled={Boolean(selectedVisit.received_at)}
                >
                  {selectedVisit.received_at ? 'Ya Recibida' : 'Marcar como Recibida'}
                </Button>
              }
            />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg">
              <EmptyState icon="fact_check" title="Seleccioná una visita" description="Elegí una visita de la lista para ver su detalle." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
