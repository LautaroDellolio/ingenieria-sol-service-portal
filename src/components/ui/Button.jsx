const VARIANT_CLASSES = {
  primary: 'bg-secondary text-on-secondary hover:bg-secondary-container shadow-sm',
  'secondary-outline': 'border border-outline text-on-surface hover:bg-surface-container-low',
  'destructive-outline': 'border border-error text-error hover:bg-error-container',
}

export default function Button({
  variant = 'primary',
  type = 'button',
  icon = null,
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  ...rest
}) {
  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-sm rounded py-sm px-lg font-label-md text-label-md transition-colors ${VARIANT_CLASSES[variant]} ${widthClass} ${disabledClass} ${className}`}
      {...rest}
    >
      {children}
      {icon && <span className="material-symbols-outlined text-[1.8rem]">{icon}</span>}
    </button>
  )
}
