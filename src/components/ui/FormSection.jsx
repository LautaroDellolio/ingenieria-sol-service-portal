export default function FormSection({ stepNumber, title, children }) {
  return (
    <section>
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md border-b border-outline-variant pb-xs">
        {stepNumber ? `${stepNumber}. ${title}` : title}
      </h3>
      <div className="space-y-md">{children}</div>
    </section>
  )
}
