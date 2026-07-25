import { NavLink } from 'react-router-dom'

export default function MobileTabBar({ navItems }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[6.4rem] bg-surface-container-lowest border-t border-outline-variant flex items-stretch z-40">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-[0.2rem] font-label-sm text-label-sm transition-colors ${
              isActive ? 'text-secondary' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[2rem]">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
