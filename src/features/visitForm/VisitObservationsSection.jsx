import SignaturePad from './SignaturePad'

function SignatureBlock({ label, signature, onChangeSignature, signatureName, onChangeSignatureName }) {
  return (
    <div>
      <label className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm block">{label}</label>
      <SignaturePad value={signature} onChange={onChangeSignature} />
      <input
        type="text"
        value={signatureName}
        onChange={(event) => onChangeSignatureName(event.target.value)}
        placeholder="Aclaración"
        className="w-full mt-sm border-b border-outline-variant bg-transparent pb-xs font-body-md text-body-md text-on-surface text-center focus:outline-none focus:border-primary"
      />
    </div>
  )
}

export default function VisitObservationsSection({
  notes,
  onChangeNotes,
  faultReported,
  onToggleFaultReported,
  faultDescription,
  onChangeFaultDescription,
  technicianSignature,
  onChangeTechnicianSignature,
  technicianSignatureName,
  onChangeTechnicianSignatureName,
  clientSignature,
  onChangeClientSignature,
  clientSignatureName,
  onChangeClientSignatureName,
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-md">
      <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-md">
        <div className="flex flex-col flex-1">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Observaciones / Comentarios</label>
          <textarea
            value={notes}
            onChange={(event) => onChangeNotes(event.target.value)}
            placeholder="Ingrese notas adicionales de la visita…"
            className="w-full flex-1 border border-outline-variant rounded-sm p-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary min-h-[15rem] resize-none"
          />
        </div>

        <div className="border-t border-outline-variant pt-md">
          <label className="flex items-center gap-sm font-label-md text-label-md text-on-surface">
            <input
              type="checkbox"
              checked={faultReported}
              onChange={(event) => onToggleFaultReported(event.target.checked)}
              className="w-lg h-lg"
            />
            <span className="material-symbols-outlined text-secondary">warning</span>
            Se detectó una falla
          </label>
          {faultReported && (
            <textarea
              value={faultDescription}
              onChange={(event) => onChangeFaultDescription(event.target.value)}
              placeholder="Describí la falla detectada…"
              className="w-full mt-sm border border-outline-variant rounded-sm p-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary min-h-[8rem] resize-none"
            />
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md space-y-md">
        <SignatureBlock
          label="Firma Técnico Responsable"
          signature={technicianSignature}
          onChangeSignature={onChangeTechnicianSignature}
          signatureName={technicianSignatureName}
          onChangeSignatureName={onChangeTechnicianSignatureName}
        />
        <SignatureBlock
          label="Firma Conformidad Cliente"
          signature={clientSignature}
          onChangeSignature={onChangeClientSignature}
          signatureName={clientSignatureName}
          onChangeSignatureName={onChangeClientSignatureName}
        />
      </div>
    </section>
  )
}
