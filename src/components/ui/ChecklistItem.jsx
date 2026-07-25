export default function ChecklistItem({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start gap-md p-sm hover:bg-surface-variant/30 rounded transition-colors cursor-pointer">
      <span className="relative flex items-center pt-[0.1rem]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer appearance-none w-[1.6rem] h-[1.6rem] border border-outline rounded bg-surface checked:bg-secondary checked:border-secondary cursor-pointer"
        />
        <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[1.4rem] text-on-secondary opacity-0 peer-checked:opacity-100 pointer-events-none">
          check
        </span>
      </span>
      <span className="flex-1">
        <span className="font-label-md text-label-md text-on-surface block">{label}</span>
        {description && <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>}
      </span>
    </label>
  )
}
