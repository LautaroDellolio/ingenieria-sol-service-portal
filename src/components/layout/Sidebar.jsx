import { NavLink } from 'react-router-dom'

export default function Sidebar({ navItems }) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-[25.6rem] fixed left-0 top-0 bg-primary-container border-r border-outline-variant py-md z-40">
      <div className="px-lg pb-xl flex flex-col">
        <span className="font-headline-md text-headline-md font-bold text-on-primary tracking-tight">
          Ingenieria Sol
        </span>
        <span className="font-label-sm text-label-sm text-on-primary-container uppercase mt-xs">
          Operaciones Empresariales
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-lg py-sm font-label-md text-label-md rounded mx-2 transition-colors ${
                isActive
                  ? 'bg-secondary text-on-secondary'
                  : 'text-on-primary-fixed-variant hover:text-on-primary hover:bg-primary/20'
              }`
            }
          >
            <span className="material-symbols-outlined text-[2rem]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
