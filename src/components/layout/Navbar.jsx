import { NavLink } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { student } from '../../data/mock'

const links = [
  { to: '/student', label: 'Dashboard', end: true },
  { to: '/student/explore', label: 'Explore internships' },
  { to: '/student/attendance', label: 'Attendance and logbook' },
  { to: '/student/milestones', label: 'Practicum milestones' },
  { to: '/student/messages', label: 'Messages' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-page/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <span className="font-display text-xl">Intern Link</span>
        <nav className="flex flex-1 gap-6 overflow-x-auto text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 pb-1 ${isActive ? 'border-ink font-medium' : 'border-transparent text-muted hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Bell size={18} className="text-muted" />
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs sm:block">
            <p className="font-medium">{student.fullName}</p>
            <p className="text-muted">{student.institution}</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-medium text-white">
            {student.firstName[0]}
          </div>
        </div>
      </div>
    </header>
  )
}