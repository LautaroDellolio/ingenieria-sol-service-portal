export default function Field({ label, value, onChange, type = 'text', required = false, className = '', inputClassName = '' }) {
  return (
    <div className={`space-y-xs ${className}`}>
      <label className="font-label-sm text-label-sm text-on-surface block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-surface border border-outline rounded px-sm py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:border-2 transition-all ${inputClassName}`}
      />
    </div>
  )
}
