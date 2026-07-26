import { useNavigate, useParams } from 'react-router-dom'
import { useVisitDetail, useVisitParameters, useVisitEvents } from '../../hooks/useVisits'
import VisitDetailPanel from '../../features/visitReview/VisitDetailPanel'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function VisitDetailPage() {
  const { visitId } = useParams()
  const navigate = useNavigate()
  const { data: visit, loading } = useVisitDetail(visitId)
  const { data: parameters } = useVisitParameters(visitId)
  const { data: events } = useVisitEvents(visitId)

  if (loading) return <Spinner label="Cargando visita…" />

  return (
    <div>
      <div className="flex items-center justify-between gap-sm mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Detalle de Visita</h1>
        <Button variant="secondary-outline" icon="arrow_back" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      {visit ? (
        <VisitDetailPanel visit={visit} parameters={parameters ?? []} events={events ?? []} />
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg">
          <EmptyState icon="fact_check" title="Visita no encontrada" description="No se pudo encontrar el detalle de esta visita." />
        </div>
      )}
    </div>
  )
}
