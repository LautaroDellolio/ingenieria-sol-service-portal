import { useAuth } from '../../context/AuthContext'

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function TopBar({ title }) {
  const { profile } = useAuth()

  return (
    <header className="hidden md:flex fixed top-0 right-0 left-[25.6rem] h-[6.4rem] bg-surface border-b border-outline-variant justify-between items-center px-margin-desktop z-30">
      <span className="font-headline-md text-headline-md font-extrabold text-on-surface">{title}</span>
      <div className="flex items-center gap-md text-on-surface-variant">
        <button
          type="button"
          aria-label="Notificaciones"
          className="hover:text-secondary transition-colors p-sm rounded-full hover:bg-surface-variant/50"
        >
          <span className="material-symbols-outlined text-[2.4rem]">notifications</span>
        </button>
        <div className="h-xl w-px bg-outline-variant mx-xs" />
        <div className="flex items-center gap-sm">
          <span className="w-xl h-xl rounded-full bg-primary-fixed-dim flex items-center justify-center font-label-sm text-label-sm text-on-primary-fixed border border-outline-variant">
            {profile ? getInitials(profile.full_name) : '—'}
          </span>
          <span className="font-label-md text-label-md text-on-surface">{profile?.full_name}</span>
        </div>
      </div>
    </header>
  )
}
