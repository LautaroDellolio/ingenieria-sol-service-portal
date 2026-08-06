export default function FormSection({ stepNumber, title, children }) {
  return (
    <section>
      <h3 className="list-title-bar font-label-md text-label-md uppercase tracking-wider mb-md px-md py-xs rounded">
        {stepNumber ? `${stepNumber}. ${title}` : title}
      </h3>
      <div className="space-y-md">{children}</div>
    </section>
  )
}
