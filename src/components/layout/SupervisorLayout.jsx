import RoleLayoutShell from './RoleLayoutShell'

const NAV_ITEMS = [
  { to: '/supervisor', end: true, icon: 'fact_check', label: 'Validación' },
  { to: '/supervisor/equipos', icon: 'precision_manufacturing', label: 'Equipos' },
  { to: '/supervisor/calendario', icon: 'calendar_month', label: 'Calendario' },
  { to: '/supervisor/personal', icon: 'group', label: 'Personal' },
]

export default function SupervisorLayout() {
  return <RoleLayoutShell navItems={NAV_ITEMS} title="Ingeniería Sol · Supervisor" />
}
