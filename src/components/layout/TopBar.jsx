import UserMenu from './UserMenu'

export default function TopBar({ title }) {
  return (
    <header className="hidden md:flex fixed top-0 right-0 left-[25.6rem] h-[6.4rem] bg-surface border-b border-outline-variant justify-between items-center px-margin-desktop z-30">
      <span className="font-headline-md text-headline-md font-extrabold text-on-surface">{title}</span>
      <UserMenu />
    </header>
  )
}
