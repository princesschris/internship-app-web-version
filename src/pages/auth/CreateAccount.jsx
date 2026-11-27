import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff } from 'lucide-react'
import { roles, signupFields } from '../../data/roles'
import { useAuth, homeFor } from '../../context/AuthContext'
import { card, btnDark } from '../../lib/styles'

const input = 'mt-1 w-full rounded-lg border border-line bg-page px-3 py-2.5 text-sm'

const strength = (p) =>
  [p.length >= 8, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length

export default function CreateAccount() {
  const [role, setRole] = useState('student')
  const [values, setValues] = useState({})
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const set = (name, v) => setValues({ ...values, [name]: v })
  const score = strength(password)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Your password needs at least 8 characters.')
    if (!agree) return setError('Please accept the terms to continue.')
    setError('')
    setBusy(true)
    try {
      const { fullName, email, ...details } = values
      const data = await signUp({ email, password, role, fullName, details })
      if (data.session) navigate(homeFor(role))
      else setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done)
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Request received</h1>
        <p className="mt-3 text-muted">We sent a confirmation link to {values.email}. Open it, then sign in. Your account shows as pending until it is verified.</p>
        <Link to="/signin" className={`${btnDark} mt-8 inline-block`}>Go to sign in</Link>
      </main>
    )

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-center font-display text-4xl">Create your account</h1>
      <p className="mt-3 text-center text-muted">Choose how you will use Intern Link.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {roles.map((r) => (
          <button type="button" key={r.id} aria-pressed={role === r.id} onClick={() => { setRole(r.id); setValues({}) }}
            className={`relative rounded-2xl border bg-card p-5 text-left ${role === r.id ? 'border-ink ring-1 ring-ink' : 'border-line'}`}>
            {role === r.id && <span className="absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full bg-ink text-white"><Check size={12} /></span>}
            <p className="font-semibold">{r.title}</p>
            <p className="mt-2 text-sm text-muted">{r.desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className={`${card} mx-auto mt-8 max-w-2xl space-y-5`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {signupFields[role].map((f) => (
            <div key={f.name} className={f.name === 'email' ? 'sm:col-span-2' : ''}>
              <label htmlFor={f.name} className="text-xs text-muted">{f.label}</label>
              {f.options ? (
                <select id={f.name} required value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} className={input}>
                  <option value="" disabled>Choose one</option>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={f.name} type={f.type || 'text'} required value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} className={input} />
              )}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="new-password" className="text-xs text-muted">Password (at least 8 characters)</label>
          <div className="relative">
            <input id="new-password" type={showPw ? 'text' : 'password'} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} pr-10`} />
            <button type="button" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-muted">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1 rounded-full ${n <= score ? 'bg-ok' : 'bg-line'}`} />)}
          </div>
          <p className="mt-1 text-xs text-muted">Mix upper and lower case letters, numbers and symbols for a stronger password.</p>
        </div>

        <label className="flex gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
          <span>I confirm my details are correct and I agree to the Intern Link terms and code of conduct.</span></label>

        {error && <p role="alert" className="rounded-lg bg-soft p-3 text-sm">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="submit" disabled={busy} className={`${btnDark} disabled:opacity-60`}>{busy ? 'Creating account' : 'Create account'}</button>
          <p className="text-sm text-muted">Already registered? <Link to="/signin" className="font-medium text-ink hover:underline">Sign in</Link></p>
        </div>
      </form>
    </main>
  )
}