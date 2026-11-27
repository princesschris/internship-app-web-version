import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationsByRole } from '../../data/notifications'

const item = 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-soft'

// One avatar button that opens profile, notifications and sign out.
export default function UserMenu({ profilePath, subtitle }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [read, setRead] = useState(false)

  const name = profile?.full_name || 'Account'
  const notes = notificationsByRole[profile?.role] || []
  const unread = read ? 0 : notes.length

  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
        className="relative flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-medium text-white">{name[0]}</span>
        <ChevronDown size={14} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-ok ring-2 ring-page" />}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-line bg-card p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted">{subtitle || profile?.email}</p>
          </div>
          <Link role="menuitem" to={profilePath} onClick={() => setOpen(false)} className={item}><User size={16} /> Profile</Link>

          <button role="menuitem" aria-expanded={showNotes} onClick={() => { setShowNotes(!showNotes); setRead(true) }} className={item}>
            <Bell size={16} /> <span className="flex-1">Notifications</span>
            {unread > 0 && <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-white">{unread}</span>}
            <ChevronDown size={14} className={`text-muted transition-transform ${showNotes ? 'rotate-180' : ''}`} />
          </button>
          {showNotes && (
            <ul className="mx-1 mb-1 space-y-1 rounded-xl bg-page p-2">
              {notes.map(([t, x, when]) => (
                <li key={t} className="rounded-lg p-2 text-sm">
                  <p className="flex justify-between font-medium">{t}<span className="text-xs font-normal text-muted">{when}</span></p>
                  <p className="text-xs text-muted">{x}</p>
                </li>
              ))}
              {notes.length === 0 && <li className="p-2 text-xs text-muted">You have no new notifications.</li>}
            </ul>
          )}

          <button role="menuitem" onClick={async () => { await signOut(); navigate('/signin') }} className={item}><LogOut size={16} /> Sign out</button>
        </div>
      )}
    </div>
  )
}