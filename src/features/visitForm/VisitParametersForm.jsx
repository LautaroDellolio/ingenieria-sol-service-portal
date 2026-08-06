import { VISIT_PARAMETER_DEFINITIONS } from '../../lib/constants'

export default function VisitParametersForm({ parameterValues, onChangeParameter }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="list-title-bar p-md flex items-center gap-sm">
        <span className="material-symbols-outlined">speed</span>
        <h3 className="font-label-md text-label-md uppercase">Verificación de Parámetros</h3>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container border-b border-outline-variant">
            <th className="p-md font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium">Parámetro</th>
            <th className="p-md font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-[16rem]">Valor Medido</th>
            <th className="p-md font-label-md text-[1.6rem] text-on-surface-variant uppercase font-medium w-[10rem] text-center">Unidad</th>
          </tr>
        </thead>
        <tbody className="font-body-lg text-body-lg text-on-surface divide-y divide-outline-variant/50">
          {VISIT_PARAMETER_DEFINITIONS.map((definition) => (
            <tr key={definition.key}>
              <td className="p-md font-medium">{definition.label}</td>
              <td className="p-md">
                <input
                  type="number"
                  step="any"
                  required={!definition.optional}
                  value={parameterValues[definition.key] ?? ''}
                  onChange={(event) => onChangeParameter(definition.key, event.target.value)}
                  className="w-full bg-surface border border-outline rounded px-md py-sm font-body-lg text-body-lg text-on-surface focus:border-secondary focus:border-2 focus:outline-none transition-colors"
                />
              </td>
              <td className="p-md text-center text-on-surface-variant">{definition.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
