import FormSection from '../../components/ui/FormSection'

export default function Step3Documentation({
  notes,
  onChangeNotes,
  faultReported,
  onToggleFaultReported,
  faultDescription,
  onChangeFaultDescription,
}) {
  return (
    <FormSection stepNumber={3} title="Documentación">
      <div className="space-y-xs">
        <label htmlFor="notes" className="font-label-sm text-label-sm text-on-surface block">Notas y Observaciones</label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Detallar cualquier anomalía, piezas reemplazadas o acción adicional requerida…"
          className="w-full bg-surface border border-outline text-on-surface text-body-md font-body-md rounded px-sm py-sm focus:outline-none focus:border-primary focus:ring-1 focus:border-2 transition-all resize-y"
        />
      </div>

      <div className="space-y-xs bg-surface-container-low p-md rounded border border-outline-variant">
        <label className="flex items-center gap-sm cursor-pointer">
          <input
            type="checkbox"
            checked={faultReported}
            onChange={(event) => onToggleFaultReported(event.target.checked)}
            className="w-[1.6rem] h-[1.6rem] rounded border-outline"
          />
          <span className="font-label-md text-label-md text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-[1.8rem] text-error">warning</span>
            Se detectó una falla
          </span>
        </label>
        {faultReported && (
          <textarea
            rows={3}
            value={faultDescription}
            onChange={(event) => onChangeFaultDescription(event.target.value)}
            placeholder="Describí la falla detectada…"
            className="w-full bg-surface border border-outline text-on-surface text-body-md font-body-md rounded px-sm py-sm focus:outline-none focus:border-primary focus:ring-1 focus:border-2 transition-all resize-y"
          />
        )}
      </div>
    </FormSection>
  )
}
