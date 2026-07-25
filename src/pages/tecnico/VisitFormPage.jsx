import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useVisitDetail, useVisitParameters } from '../../hooks/useVisits'
import { saveVisitDraft, submitVisitForReview, saveVisitParameters } from '../../api/visits'
import { SERVICE_TYPE } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import StepProgress from '../../components/ui/StepProgress'
import Step1Identification from '../../features/visitForm/Step1Identification'
import Step2Checklist from '../../features/visitForm/Step2Checklist'
import Step3Documentation from '../../features/visitForm/Step3Documentation'

const TOTAL_STEPS = 3

export default function VisitFormPage() {
  const { visitId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const { data: visit, loading: visitLoading } = useVisitDetail(visitId)
  const { data: existingParameters } = useVisitParameters(visitId)

  const [currentStep, setCurrentStep] = useState(1)
  const [serviceType, setServiceType] = useState(SERVICE_TYPE.PREVENTIVO)
  const [checklistData, setChecklistData] = useState({})
  const [parameterValues, setParameterValues] = useState({})
  const [notes, setNotes] = useState('')
  const [faultReported, setFaultReported] = useState(false)
  const [faultDescription, setFaultDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!visit || initialized) return
    setServiceType(visit.service_type ?? SERVICE_TYPE.PREVENTIVO)
    setChecklistData(visit.checklist_data ?? {})
    setNotes(visit.notes ?? '')
    setFaultReported(visit.fault_reported ?? false)
    setFaultDescription(visit.fault_description ?? '')
    setInitialized(true)
  }, [visit, initialized])

  useEffect(() => {
    if (!existingParameters) return
    const values = {}
    for (const parameter of existingParameters) values[parameter.metric_key] = String(parameter.value)
    setParameterValues((current) => ({ ...values, ...current }))
  }, [existingParameters])

  if (visitLoading || !visit) return <Spinner label="Cargando visita…" />

  const formSnapshot = { serviceType, checklistData, notes, faultReported, faultDescription }

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <div className="bg-surface-container p-md md:px-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary fill">assignment</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Entrada de Servicio</h2>
          </div>
          <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        <form onSubmit={handleSubmit} className="p-md md:p-xl space-y-xl">
          {currentStep === 1 && (
            <Step1Identification visit={visit} serviceType={serviceType} onChangeServiceType={setServiceType} />
          )}

          {currentStep === 2 && (
            <Step2Checklist
              checklistData={checklistData}
              onToggleChecklistItem={(key, checked) => setChecklistData((data) => ({ ...data, [key]: checked }))}
              parameterValues={parameterValues}
              onChangeParameter={(key, value) => setParameterValues((values) => ({ ...values, [key]: value }))}
            />
          )}

          {currentStep === 3 && (
            <Step3Documentation
              notes={notes}
              onChangeNotes={setNotes}
              faultReported={faultReported}
              onToggleFaultReported={setFaultReported}
              faultDescription={faultDescription}
              onChangeFaultDescription={setFaultDescription}
            />
          )}

          <div className="pt-lg border-t border-outline-variant flex flex-col-reverse md:flex-row justify-between gap-md">
            <div className="flex gap-sm">
              {currentStep > 1 && (
                <Button type="button" variant="secondary-outline" onClick={() => setCurrentStep((step) => step - 1)}>
                  Atrás
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-md">
              <Button type="button" variant="secondary-outline" disabled={saving} onClick={handleSaveDraft}>
                Guardar Borrador
              </Button>
              {currentStep < TOTAL_STEPS ? (
                <Button type="button" variant="primary" icon="arrow_forward" onClick={() => setCurrentStep((step) => step + 1)}>
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" variant="primary" icon="arrow_forward" disabled={saving}>
                  Proceder a Revisión
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
