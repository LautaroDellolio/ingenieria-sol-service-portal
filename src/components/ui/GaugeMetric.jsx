const TONE_STROKE = {
  secondary: 'stroke-secondary',
  warning: 'stroke-warning',
  error: 'stroke-error',
}

// Arco de ~270 grados (como la aguja de un instrumento real, no un circulo
// completo) con el hueco de 90 grados centrado abajo. START_ROTATION mueve
// el punto de inicio del trazo (naturalmente a las 3 en punto) hasta las
// 7:30, para que el arco visible recorra 9 -> 12 -> 3 y termine a las 4:30.
const SIZE = 120
const CENTER = SIZE / 2
const RADIUS = 50
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TRACK_LENGTH = CIRCUMFERENCE * 0.75
const START_ROTATION = 135

export default function GaugeMetric({ icon, label, value, tone = null }) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const resolvedTone = tone ?? (clampedValue >= 80 ? 'secondary' : clampedValue >= 50 ? 'warning' : 'error')
  const valueOffset = CIRCUMFERENCE - (clampedValue / 100) * TRACK_LENGTH

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-1 overflow-hidden">
      <div className="flex items-center gap-sm p-md border-b border-outline-variant text-on-surface-variant">
        {icon && <span className="material-symbols-outlined text-[2rem]">{icon}</span>}
        <span className="font-label-sm text-label-sm uppercase">{label}</span>
      </div>
      <div className="p-md flex justify-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[15rem] aspect-square">
          <g transform={`rotate(${START_ROTATION} ${CENTER} ${CENTER})`}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={10}
              strokeLinecap="round"
              className="stroke-surface-container-high"
              strokeDasharray={`${TRACK_LENGTH} ${CIRCUMFERENCE}`}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={10}
              strokeLinecap="round"
              className={`animate-gauge-sweep ${TONE_STROKE[resolvedTone]}`}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={valueOffset}
              style={{ '--gauge-start': CIRCUMFERENCE, '--gauge-end': valueOffset }}
            />
          </g>
          <text
            x={CENTER}
            y={CENTER + 8}
            textAnchor="middle"
            fontSize={26}
            className="font-display-lg fill-on-surface"
          >
            {Math.round(clampedValue)}%
          </text>
        </svg>
      </div>
    </div>
  )
}
