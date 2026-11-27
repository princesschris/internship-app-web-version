import { NavLink, Outlet } from 'react-router-dom'
import Footer from './Footer'

const pill = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium ${isActive ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl">Intern Link</span>
          <nav className="flex gap-1 rounded-full bg-soft p-1">
            <NavLink to="/signin" className={pill}>Sign in</NavLink>
            <NavLink to="/signup" className={pill}>Create account</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
      <Footer />
    </div>
  )
}