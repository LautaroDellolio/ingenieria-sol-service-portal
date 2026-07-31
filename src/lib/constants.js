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
  [VISIT_STATUS.ENVIADA]: 'Enviada',
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

// Solo aplica cuando service_type = preventivo: de que visita mensual se
// trata (algunos equipos se visitan 1 o 2 veces por mes, ver CLAUDE.md).
export const VISIT_OCCURRENCE = {
  PRIMERA: 'primera',
  SEGUNDA: 'segunda',
}

export const VISIT_OCCURRENCE_LABELS = {
  [VISIT_OCCURRENCE.PRIMERA]: 'Primera Visita',
  [VISIT_OCCURRENCE.SEGUNDA]: 'Segunda Visita',
}

export const FUEL_TYPE = {
  DIESEL: 'diesel',
  NAFTA: 'nafta',
  GAS: 'gas',
}

export const FUEL_TYPE_LABELS = {
  [FUEL_TYPE.DIESEL]: 'Diésel',
  [FUEL_TYPE.NAFTA]: 'Nafta',
  [FUEL_TYPE.GAS]: 'Gas',
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

// Categorias del checklist tecnico, segun el diseno de "Informe de Visita de
// Servicio" (Desing/stitch_ingenieria_sol_service_portal/stitch_ingenieria_sol_service_portal (1)).
export const CHECKLIST_CATEGORY = {
  EQUIPO_PARADO: 'equipo_parado',
  EQUIPO_MARCHA: 'equipo_marcha',
}

export const CHECKLIST_CATEGORY_LABELS = {
  [CHECKLIST_CATEGORY.EQUIPO_PARADO]: 'Operaciones: Equipo Parado',
  [CHECKLIST_CATEGORY.EQUIPO_MARCHA]: 'Operaciones: Equipo en Marcha',
}

export const CHECKLIST_ITEM_STATUS = {
  OK: 'ok',
  A_REVISAR: 'a_revisar',
  FALLA: 'falla',
}

export const CHECKLIST_ITEM_STATUS_LABELS = {
  [CHECKLIST_ITEM_STATUS.OK]: 'OK',
  [CHECKLIST_ITEM_STATUS.A_REVISAR]: 'A Revisar',
  [CHECKLIST_ITEM_STATUS.FALLA]: 'Falla',
}

export const VISIT_CHECKLIST_ITEMS = [
  { key: 'revision_general_equipo', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Revisión general del equipo' },
  { key: 'mangueras_agua_radiador', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Control de estado de mangueras de agua de radiador' },
  { key: 'control_correas', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Control de correas' },
  { key: 'perdidas_agua_parado', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Pérdidas de agua' },
  { key: 'ajuste_abrazaderas', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Ajuste de abrazaderas' },
  { key: 'estado_baterias', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Estado de las baterías' },
  { key: 'control_nivel_aceite', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Control de nivel de aceite' },
  {
    key: 'funcionamiento_precalentador',
    category: CHECKLIST_CATEGORY.EQUIPO_PARADO,
    label: 'Funcionamiento de precalentador',
    measurement: { key: 'funcionamiento_precalentador_temp', unit: '°C' },
  },
  {
    key: 'cargador_flote',
    category: CHECKLIST_CATEGORY.EQUIPO_PARADO,
    label: 'Cargador de flote Vcc',
    measurement: { key: 'cargador_flote_tension', unit: 'Vcc' },
  },
  { key: 'limpieza_general_sala', category: CHECKLIST_CATEGORY.EQUIPO_PARADO, label: 'Limpieza general de la sala (o de la cabina)' },
  { key: 'comprobar_presion_aceite', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Comprobar presión de aceite' },
  { key: 'verificar_perdidas_agua', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Verificar pérdidas de agua' },
  { key: 'verificar_perdidas_aceite', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Verificar pérdidas de aceite' },
  { key: 'verificar_perdidas_combustible', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Verificar pérdidas de combustible' },
  { key: 'comprobar_carga_baterias', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Comprobar carga de baterías' },
  { key: 'comprobar_temperatura_agua', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Comprobar temperatura del agua' },
  { key: 'comprobar_tension_frecuencia', category: CHECKLIST_CATEGORY.EQUIPO_MARCHA, label: 'Comprobar tensión de generación y frecuencia' },
]

// Parametros cuantitativos medidos durante la visita.
export const VISIT_PARAMETER_DEFINITIONS = [
  { key: 'presion_aceite_frio', label: 'Presión de Aceite (en frío)', unit: 'bar', specMin: 2, specMax: 6 },
  { key: 'tension_generacion_l_n', label: 'Tensión de Generación L-N', unit: 'V', specMin: 210, specMax: 230 },
  { key: 'tension_generacion_l1_l2', label: 'Tensión de Generación L1-L2', unit: 'V' },
  { key: 'frecuencia', label: 'Frecuencia', unit: 'Hz', specMin: 49, specMax: 51 },
  { key: 'tension_alternador', label: 'Tensión de Alternador de Carga de Baterías', unit: 'V', specMin: 12, specMax: 14.5 },
  { key: 'numero_arranques', label: 'Número de Arranques' },
  { key: 'horas_operacion', label: 'Horas de Operación', unit: 'Hs' },
  { key: 'presion_aceite_caliente', label: 'Presión de Aceite en Caliente', unit: 'bar', specMin: 2, specMax: 6 },
  { key: 'temperatura_agua', label: 'Temperatura del Agua', unit: '°C', specMin: 70, specMax: 95 },
  { key: 'nivel_combustible', label: 'Nivel de Combustible', unit: '%', specMin: 20, specMax: 100 },
]
