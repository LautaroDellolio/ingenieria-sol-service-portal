export default function StepProgress({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-xs" role="img" aria-label={`Paso ${currentStep} de ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          className={`w-sm h-sm rounded-full ${index + 1 === currentStep ? 'bg-secondary' : 'bg-outline-variant'}`}
        />
      ))}
    </div>
  )
}
