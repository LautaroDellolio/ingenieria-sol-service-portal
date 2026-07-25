import RoleLayoutShell from './RoleLayoutShell'

const NAV_ITEMS = [{ to: '/tecnico', end: true, icon: 'calendar_month', label: 'Mi Plan' }]

export default function TecnicoLayout() {
  return <RoleLayoutShell navItems={NAV_ITEMS} title="Ingeniería Sol · Técnico" />
}
