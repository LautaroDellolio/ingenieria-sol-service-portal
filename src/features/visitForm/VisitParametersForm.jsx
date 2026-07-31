import { VISIT_PARAMETER_DEFINITIONS } from '../../lib/constants'

export default function VisitParametersForm({ parameterValues, onChangeParameter }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="border-b border-outline-variant p-md flex items-center gap-sm">
        <span className="material-symbols-outlined text-on-surface-variant">speed</span>
        <h3 className="font-label-md text-label-md text-on-surface uppercase">Verificación de Parámetros</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container border-b border-outline-variant">
            <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium">Parámetro</th>
            <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-48">Valor Medido</th>
            <th className="p-sm font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-24 text-center">Unidad</th>
          </tr>
        </thead>
        <tbody className="font-body-lg text-body-lg text-on-surface divide-y divide-outline-variant/50">
          {VISIT_PARAMETER_DEFINITIONS.map((definition) => (
            <tr key={definition.key}>
              <td className="p-sm font-medium">{definition.label}</td>
              <td className="p-sm">
                <input
                  type="number"
                  required={!definition.optional}
                  value={parameterValues[definition.key] ?? ''}
                  onChange={(event) => onChangeParameter(definition.key, event.target.value)}
                  placeholder={definition.specMin != null && definition.specMax != null ? `${definition.specMin}-${definition.specMax}` : ''}
                  className="w-full border border-outline-variant rounded-sm px-sm py-xs font-body-lg text-body-lg focus:border-primary focus:ring-1"
                />
              </td>
              <td className="p-sm text-center text-on-surface-variant">{definition.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
