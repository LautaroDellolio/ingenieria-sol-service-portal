import StatusChip from '../../components/ui/StatusChip'

function isOutOfSpec(parameter) {
  const { value, spec_min: specMin, spec_max: specMax } = parameter
  if (value == null) return false
  if (specMin != null && value < specMin) return true
  if (specMax != null && value > specMax) return true
  return false
}

export default function ParametersTable({ parameters }) {
  if (parameters.length === 0) {
    return <p className="font-body-sm text-body-sm text-on-surface-variant">Sin parámetros registrados.</p>
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-outline-variant">
          <th className="font-label-sm text-label-sm text-on-surface-variant uppercase py-xs pr-sm">Parámetro</th>
          <th className="font-label-sm text-label-sm text-on-surface-variant uppercase py-xs pr-sm">Valor</th>
          <th className="font-label-sm text-label-sm text-on-surface-variant uppercase py-xs">Estado</th>
        </tr>
      </thead>
      <tbody>
        {parameters.map((parameter) => {
          const outOfSpec = isOutOfSpec(parameter)
          return (
            <tr key={parameter.id} className="border-b border-outline-variant/50">
              <td className="font-body-sm text-body-sm text-on-surface py-xs pr-sm">{parameter.metric_label}</td>
              <td className={`font-label-md text-label-md py-xs pr-sm ${outOfSpec ? 'text-error' : 'text-on-surface'}`}>
                {parameter.value ?? '—'} {parameter.unit ?? ''}
              </td>
              <td className="py-xs">
                {outOfSpec ? (
                  <StatusChip label="Fuera de Rango" tone="error" variant="tag" />
                ) : (
                  <StatusChip label="Óptimo" tone="success" variant="tag" />
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
