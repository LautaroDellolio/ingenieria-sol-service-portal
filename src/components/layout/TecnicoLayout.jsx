import RoleLayoutShell from './RoleLayoutShell'

const NAV_ITEMS = [
  { to: '/tecnico', end: true, icon: 'calendar_month', label: 'Mi Plan' },
  { to: '/tecnico/historial', icon: 'history', label: 'Mi Historial' },
]

export default function TecnicoLayout() {
  return <RoleLayoutShell navItems={NAV_ITEMS} title="Ingeniería Sol · Técnico" />
}
