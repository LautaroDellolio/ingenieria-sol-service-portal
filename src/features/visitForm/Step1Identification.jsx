import FormSection from '../../components/ui/FormSection'
import { SERVICE_TYPE_LABELS } from '../../lib/constants'

export default function Step1Identification({ visit, serviceType, onChangeServiceType }) {
  return (
    <FormSection stepNumber={1} title="Identificación del Equipo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="space-y-xs relative">
          <label className="font-label-sm text-label-sm text-on-surface block">ID del Equipo</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={visit.equipment?.motor ?? ''}
              className="w-full bg-surface-container-low border border-outline text-on-surface text-body-md font-body-md rounded px-sm py-sm pr-12"
            />
            <button
              type="button"
              disabled
              title="Escaneo QR disponible próximamente"
              className="absolute right-0 top-0 bottom-0 px-sm text-on-surface-variant flex items-center justify-center border-l border-outline bg-surface-container-low rounded-r cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[2rem]">qr_code_scanner</span>
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {visit.equipment?.clients?.name} · {visit.equipment?.motor} {visit.equipment?.generador}
          </p>
        </div>
        <div className="space-y-xs">
          <label htmlFor="service-type" className="font-label-sm text-label-sm text-on-surface block">Tipo de Servicio</label>
          <select
            id="service-type"
            value={serviceType}
            onChange={(event) => onChangeServiceType(event.target.value)}
            className="w-full bg-surface border border-outline text-on-surface text-body-md font-body-md rounded px-sm py-sm focus:outline-none focus:border-primary focus:ring-1 focus:border-2 transition-all"
          >
            {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </FormSection>
  )
}
