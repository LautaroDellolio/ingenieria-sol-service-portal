import FormSection from '../../components/ui/FormSection'
import ChecklistItem from '../../components/ui/ChecklistItem'
import { VISIT_CHECKLIST_ITEMS, VISIT_PARAMETER_DEFINITIONS } from '../../lib/constants'

export default function Step2Checklist({ checklistData, onToggleChecklistItem, parameterValues, onChangeParameter }) {
  return (
    <FormSection stepNumber={2} title="Validación Técnica">
      <div className="space-y-sm bg-surface-container-low p-md rounded border border-outline-variant">
        {VISIT_CHECKLIST_ITEMS.map((item, index) => (
          <div key={item.key}>
            <ChecklistItem
              label={item.label}
              description={item.description}
              checked={Boolean(checklistData[item.key])}
              onChange={(checked) => onToggleChecklistItem(item.key, checked)}
            />
            {index < VISIT_CHECKLIST_ITEMS.length - 1 && <div className="h-px w-full bg-outline-variant/50" />}
          </div>
        ))}
      </div>

      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Parámetros Medidos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {VISIT_PARAMETER_DEFINITIONS.map((definition) => (
            <div key={definition.key} className="space-y-xs">
              <label htmlFor={definition.key} className="font-label-sm text-label-sm text-on-surface block">
                {definition.label} {definition.unit ? `(${definition.unit})` : ''}
              </label>
              <input
                id={definition.key}
                type="number"
                step="any"
                value={parameterValues[definition.key] ?? ''}
                onChange={(event) => onChangeParameter(definition.key, event.target.value)}
                placeholder={
                  definition.specMin != null && definition.specMax != null
                    ? `Rango: ${definition.specMin} – ${definition.specMax}`
                    : ''
                }
                className="w-full bg-surface border border-outline text-on-surface text-body-md font-body-md rounded px-sm py-sm focus:outline-none focus:border-primary focus:ring-1 focus:border-2 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
