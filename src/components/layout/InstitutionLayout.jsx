import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Footer from './Footer'
import UserMenu from './UserMenu'

const links = [
  { to: '/institution', label: 'Overview', end: true },
  { to: '/institution/roster', label: 'Student roster' },
  { to: '/institution/verification', label: 'Verification queue' },
  { to: '/institution/mentors', label: 'Faculty and mentors' },
  { to: '/institution/schedule', label: 'Supervision schedule' },
  { to: '/institution/setup', label: 'Setup and governance', adminOnly: true },
]

export default function InstitutionLayout() {
  const { profile } = useAuth()
  const isAdmin = profile?.sub_role === 'institution_admin'

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-page/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
          <span className="font-display text-xl">Intern Link</span>
          <nav className="flex flex-1 gap-6 overflow-x-auto text-sm">
            {links.filter((l) => !l.adminOnly || isAdmin).map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `whitespace-nowrap border-b-2 pb-1 ${isActive ? 'border-ink font-medium' : 'border-transparent text-muted hover:text-ink'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <UserMenu profilePath="/institution/profile" subtitle={isAdmin ? 'Institution admin' : 'Department manager'} />
        </div>
      </header>
      <Outlet />
      <Footer />
    </div>
  )
}