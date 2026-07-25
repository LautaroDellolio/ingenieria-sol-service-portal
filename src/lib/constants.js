export const ROLES = {
  ADMINISTRATIVO: 'administrativo',
  TECNICO: 'tecnico',
  SUPERVISOR: 'supervisor',
}

export const ROLE_LABELS = {
  [ROLES.ADMINISTRATIVO]: 'Administrativo',
  [ROLES.TECNICO]: 'Técnico',
  [ROLES.SUPERVISOR]: 'Supervisor',
}

export const ROLE_HOME_PATH = {
  [ROLES.ADMINISTRATIVO]: '/admin',
  [ROLES.TECNICO]: '/tecnico',
  [ROLES.SUPERVISOR]: '/supervisor',
}

export const VISIT_STATUS = {
  PLANIFICADA: 'planificada',
  BORRADOR: 'borrador',
  ENVIADA: 'enviada',
  REVISION_SOLICITADA: 'revision_solicitada',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
}

export const VISIT_STATUS_LABELS = {
  [VISIT_STATUS.PLANIFICADA]: 'Planificada',
  [VISIT_STATUS.BORRADOR]: 'Borrador',
  [VISIT_STATUS.ENVIADA]: 'Esperando Revisión',
  [VISIT_STATUS.REVISION_SOLICITADA]: 'Revisión Solicitada',
  [VISIT_STATUS.APROBADA]: 'Aprobada',
  [VISIT_STATUS.RECHAZADA]: 'Rechazada',
}

// Estados de una visita que el tecnico todavia puede editar.
export const TECHNICIAN_EDITABLE_STATUSES = [
  VISIT_STATUS.PLANIFICADA,
  VISIT_STATUS.BORRADOR,
  VISIT_STATUS.REVISION_SOLICITADA,
]

export const SERVICE_TYPE = {
  PREVENTIVO: 'preventivo',
  CORRECTIVO: 'correctivo',
  INSTALACION: 'instalacion',
  INSPECCION: 'inspeccion',
}

export const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPE.PREVENTIVO]: 'Mantenimiento Preventivo',
  [SERVICE_TYPE.CORRECTIVO]: 'Reparación Correctiva',
  [SERVICE_TYPE.INSTALACION]: 'Instalación/Puesta en marcha',
  [SERVICE_TYPE.INSPECCION]: 'Inspección de Rutina',
}

export const CONDITION_STATUS = {
  OPTIMO: 'optimo',
  ATENCION: 'atencion',
  FUERA_SERVICIO: 'fuera_servicio',
}

export const CONDITION_STATUS_LABELS = {
  [CONDITION_STATUS.OPTIMO]: 'Óptimo',
  [CONDITION_STATUS.ATENCION]: 'Requiere Atención',
  [CONDITION_STATUS.FUERA_SERVICIO]: 'Fuera de Servicio',
}

// Cantidad de dias antes del vencimiento del service anual para mostrar la alerta.
export const ANNUAL_SERVICE_ALERT_WINDOW_DAYS = 30

// PLACEHOLDER: checklist de la visita tecnica, pendiente de la especificacion
// detallada del usuario (CLAUDE.md: "luego te dare mas detalles").
export const VISIT_CHECKLIST_ITEMS = [
  {
    key: 'inspeccion_visual',
    label: 'Inspección Visual Completada',
    description: 'Comprobar si hay daños físicos, corrosión o desgaste.',
  },
  {
    key: 'diagnostico',
    label: 'Ejecución de Diagnóstico Realizada',
    description: 'Prueba de ciclo operativo estándar de 15 minutos.',
  },
  {
    key: 'nivel_aceite',
    label: 'Nivel de Aceite Verificado',
    description: 'Comprobar que el nivel esté dentro del rango recomendado.',
  },
  {
    key: 'estado_bateria',
    label: 'Estado de Batería Verificado',
    description: 'Medir tensión y comprobar bornes y terminales.',
  },
  {
    key: 'filtros',
    label: 'Filtros Inspeccionados',
    description: 'Revisar estado de filtros de aire, aceite y combustible.',
  },
  {
    key: 'fugas_corrosion',
    label: 'Fugas o Corrosión Detectadas',
    description: 'Marcar si se detectaron fugas de fluidos o corrosión visible.',
  },
]

// PLACEHOLDER: parametros cuantitativos medidos durante la visita, pendiente
// de la especificacion detallada del usuario.
export const VISIT_PARAMETER_DEFINITIONS = [
  { key: 'horas_uso', label: 'Horas de Uso', unit: 'h' },
  { key: 'tension_r', label: 'Tensión Fase R', unit: 'V', specMin: 210, specMax: 230 },
  { key: 'tension_s', label: 'Tensión Fase S', unit: 'V', specMin: 210, specMax: 230 },
  { key: 'tension_t', label: 'Tensión Fase T', unit: 'V', specMin: 210, specMax: 230 },
  { key: 'frecuencia', label: 'Frecuencia', unit: 'Hz', specMin: 49, specMax: 51 },
  { key: 'presion_aceite', label: 'Presión de Aceite', unit: 'bar', specMin: 2, specMax: 6 },
  { key: 'temperatura_motor', label: 'Temperatura del Motor', unit: '°C', specMin: 70, specMax: 95 },
  { key: 'nivel_combustible', label: 'Nivel de Combustible', unit: '%', specMin: 20, specMax: 100 },
  { key: 'tension_bateria', label: 'Tensión de Batería', unit: 'V', specMin: 12, specMax: 14.5 },
  { key: 'resistencia_aislacion', label: 'Resistencia de Aislación', unit: 'MΩ', specMin: 1, specMax: null },
]
