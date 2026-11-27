import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { roles } from '../../data/roles'
import { useAuth, homeFor } from '../../context/AuthContext'
import { card, btnDark } from '../../lib/styles'

const input = 'mt-1 w-full rounded-lg border border-line bg-page px-3 py-2.5 text-sm'

export default function SignIn() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const { signIn, signOut } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setNotice('')
    setBusy(true)
    try {
      const p = await signIn(email, password)
      if (!p) setNotice('We could not find your profile. Please contact support.')
      else if (p.role !== role && p.role !== 'admin') {
        await signOut()
        setNotice(`This account is registered as ${roles.find((r) => r.id === p.role)?.label.toLowerCase()}. Pick that tab to sign in.`)
      } else navigate(homeFor(p.role))
    } catch (err) {
      setNotice(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-14">
      <h1 className="text-center font-display text-4xl">Welcome back to <em>Intern Link</em></h1>
      <p className="mt-3 text-center text-muted">Sign in to see your placements, logbook and supervision calendar.</p>

      <form onSubmit={submit} className={`${card} mt-8 space-y-5`}>
        <div>
          <p className="text-xs text-muted">I am signing in as</p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-soft p-1">
            {roles.map((r) => (
              <button type="button" key={r.id} aria-pressed={role === r.id} onClick={() => { setRole(r.id); setNotice('') }}
                className={`rounded-full px-2 py-2 text-xs font-medium ${role === r.id ? 'bg-ink text-white' : 'text-muted'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-xs text-muted">Institutional or work email</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amara.okafor@student.veritas.edu.ng" className={input} />
        </div>

        <div>
          <div className="flex justify-between text-xs"><label htmlFor="password" className="text-muted">Password</label><button type="button" className="font-medium hover:underline">Forgot password?</button></div>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} pr-10`} />
            <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-muted">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Keep me signed in on this device</label>

        {notice && <p role="status" className="rounded-lg bg-soft p-3 text-sm">{notice}</p>}
        <button type="submit" disabled={busy} className={`${btnDark} w-full disabled:opacity-60`}>{busy ? 'Signing in' : 'Sign in'}</button>
        <p className="text-center text-sm text-muted">New here? <Link to="/signup" className="font-medium text-ink hover:underline">Create an account</Link></p>
      </form>
    </main>
  )
}