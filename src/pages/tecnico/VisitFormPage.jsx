import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useVisitDetail, useVisitParameters, useVisitEvents } from '../../hooks/useVisits'
import { saveVisitDraft, submitVisitForReview, saveVisitParameters } from '../../api/visits'
import { CHECKLIST_CATEGORY, SERVICE_TYPE, TECHNICIAN_EDITABLE_STATUSES } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import VisitDetailPanel from '../../features/visitReview/VisitDetailPanel'
import VisitMetadataCard from '../../features/visitForm/VisitMetadataCard'
import VisitChecklistSection from '../../features/visitForm/VisitChecklistSection'
import VisitParametersForm from '../../features/visitForm/VisitParametersForm'
import VisitObservationsSection from '../../features/visitForm/VisitObservationsSection'

export default function VisitFormPage() {
  const { visitId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const { data: visit, loading: visitLoading } = useVisitDetail(visitId)
  const { data: existingParameters } = useVisitParameters(visitId)
  const { data: events } = useVisitEvents(visitId)

  const [serviceType, setServiceType] = useState(SERVICE_TYPE.PREVENTIVO)
  const [checklistData, setChecklistData] = useState({})
  const [parameterValues, setParameterValues] = useState({})
  const [notes, setNotes] = useState('')
  const [faultReported, setFaultReported] = useState(false)
  const [faultDescription, setFaultDescription] = useState('')
  const [technicianSignature, setTechnicianSignature] = useState(null)
  const [technicianSignatureAt, setTechnicianSignatureAt] = useState(null)
  const [technicianSignatureName, setTechnicianSignatureName] = useState('')
  const [clientSignature, setClientSignature] = useState(null)
  const [clientSignatureAt, setClientSignatureAt] = useState(null)
  const [clientSignatureName, setClientSignatureName] = useState('')
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!visit || initialized) return
    setServiceType(visit.service_type ?? SERVICE_TYPE.PREVENTIVO)
    setChecklistData(visit.checklist_data ?? {})
    setNotes(visit.notes ?? '')
    setFaultReported(visit.fault_reported ?? false)
    setFaultDescription(visit.fault_description ?? '')
    setTechnicianSignature(visit.technician_signature ?? null)
    setTechnicianSignatureAt(visit.technician_signature_at ?? null)
    setTechnicianSignatureName(visit.technician_signature_name ?? '')
    setClientSignature(visit.client_signature ?? null)
    setClientSignatureAt(visit.client_signature_at ?? null)
    setClientSignatureName(visit.client_signature_name ?? '')
    setInitialized(true)
  }, [visit, initialized])

  function handleChangeTechnicianSignature(dataUrl) {
    setTechnicianSignature(dataUrl)
    setTechnicianSignatureAt(dataUrl ? new Date().toISOString() : null)
  }

  function handleChangeClientSignature(dataUrl) {
    setClientSignature(dataUrl)
    setClientSignatureAt(dataUrl ? new Date().toISOString() : null)
  }

  function handleChangeParameter(key, value) {
    setParameterValues((values) => {
      const next = { ...values, [key]: value }
      const tankSize = Number(visit?.equipment?.fuel_capacity)
      if (key === 'combustible_litros' && value !== '' && tankSize > 0) {
        next.nivel_combustible = String(Math.round((Number(value) / tankSize) * 100))
      }
      return next
    })
  }

  useEffect(() => {
    if (!existingParameters) return
    const values = {}
    for (const parameter of existingParameters) values[parameter.metric_key] = String(parameter.value)
    setParameterValues((current) => ({ ...values, ...current }))
  }, [existingParameters])

  if (visitLoading || !visit) return <Spinner label="Cargando visita…" />

  if (!TECHNICIAN_EDITABLE_STATUSES.includes(visit.status)) {
    return (
      <div>
        <div className="flex items-center justify-between gap-sm mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Detalle de Visita</h1>
          <Button variant="secondary-outline" icon="arrow_back" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
        <VisitDetailPanel visit={visit} parameters={existingParameters ?? []} events={events ?? []} />
      </div>
    )
  }

  const formSnapshot = {
    serviceType,
    checklistData,
    notes,
    faultReported,
    faultDescription,
    technicianSignature,
    technicianSignatureAt,
    technicianSignatureName,
    clientSignature,
    clientSignatureAt,
    clientSignatureName,
  }

  async function handleSaveDraft() {
    setSaving(true)
    try {
      await saveVisitParameters(visitId, parameterValues)
      await saveVisitDraft(visitId, formSnapshot, profile.id)
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await saveVisitParameters(visitId, parameterValues)
      await submitVisitForReview(visitId, formSnapshot, profile.id)
      navigate('/tecnico', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Informe de Visita de Servicio</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {visit.equipment?.motor} · {visit.equipment?.clients?.name}
          </p>
        </div>

        <VisitMetadataCard visit={visit} serviceType={serviceType} onChangeServiceType={setServiceType} />

        <VisitChecklistSection
          category={CHECKLIST_CATEGORY.EQUIPO_PARADO}
          checklistData={checklistData}
          onChangeItem={(key, value) => setChecklistData((data) => ({ ...data, [key]: value }))}
        />

        <VisitParametersForm parameterValues={parameterValues} onChangeParameter={handleChangeParameter} />

        <VisitChecklistSection
          category={CHECKLIST_CATEGORY.EQUIPO_MARCHA}
          checklistData={checklistData}
          onChangeItem={(key, value) => setChecklistData((data) => ({ ...data, [key]: value }))}
        />

        <VisitObservationsSection
          notes={notes}
          onChangeNotes={setNotes}
          faultReported={faultReported}
          onToggleFaultReported={setFaultReported}
          faultDescription={faultDescription}
          onChangeFaultDescription={setFaultDescription}
          technicianSignature={technicianSignature}
          onChangeTechnicianSignature={handleChangeTechnicianSignature}
          technicianSignatureName={technicianSignatureName}
          onChangeTechnicianSignatureName={setTechnicianSignatureName}
          clientSignature={clientSignature}
          onChangeClientSignature={handleChangeClientSignature}
          clientSignatureName={clientSignatureName}
          onChangeClientSignatureName={setClientSignatureName}
        />

        <div className="flex justify-end gap-sm">
          <Button type="button" variant="secondary-outline" disabled={saving} onClick={handleSaveDraft}>
            Guardar Borrador
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            Finalizar Reporte
          </Button>
        </div>
      </form>
    </div>
  )
}
