const TONE_CLASSES = {
  success: 'bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant',
  warning: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  error: 'bg-error-container text-on-error-container',
  neutral: 'bg-surface-variant text-on-surface-variant',
}

export default function StatusChip({ label, tone = 'neutral', variant = 'pill' }) {
  const toneClass = TONE_CLASSES[tone]

  if (variant === 'dot') {
    return (
      <span className="inline-flex items-center gap-xs font-label-sm text-label-sm">
        <span className={`w-sm h-sm rounded-full ${toneClass}`} aria-hidden="true" />
        {label}
      </span>
    )
  }

  if (variant === 'tag') {
    return (
      <span className={`inline-block rounded-[0.125rem] px-sm py-[0.2rem] font-label-sm text-label-sm uppercase ${toneClass}`}>
        {label}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center rounded-full px-sm py-[0.2rem] font-label-sm text-label-sm ${toneClass}`}>
      {label}
    </span>
  )
}
