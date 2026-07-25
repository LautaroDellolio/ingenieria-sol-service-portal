function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function TechnicianAvailabilityList({ technicians }) {
  return (
    <div>
      <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-sm">Técnicos Disponibles</h2>
      <ul className="space-y-xs">
        {technicians.map((technician) => (
          <li key={technician.id} className="flex items-center gap-sm p-xs">
            <span className="relative">
              <span className="w-xl h-xl rounded-full bg-primary-fixed-dim flex items-center justify-center font-label-sm text-label-sm text-on-primary-fixed">
                {getInitials(technician.full_name)}
              </span>
              <span className="absolute -bottom-[0.1rem] -right-[0.1rem] w-sm h-sm rounded-full bg-tertiary-fixed-dim border-2 border-surface-container-lowest" />
            </span>
            <span className="font-label-md text-label-md text-on-surface">{technician.full_name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
