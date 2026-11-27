import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { defaultSettings } from '../../data/institutionTools'
import { card, btnDark, btnLight } from '../../lib/styles'

const input = 'mt-1 w-full rounded-lg border border-line bg-page px-3 py-2 text-sm'

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-6 w-11 shrink-0 rounded-full ${on ? 'bg-ink' : 'bg-line'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function SetupGovernance() {
  const { profile } = useAuth()
  const [s, setS] = useState(defaultSettings)
  const [saved, setSaved] = useState(defaultSettings)
  const set = (k, v) => setS({ ...s, [k]: v })
  const dirty = JSON.stringify(s) !== JSON.stringify(saved)

  if (profile?.sub_role !== 'institution_admin')
    return <p className="px-6 py-20 text-center text-muted">Only institution admins can change these settings.</p>

  let ok
  try { ok = new RegExp(s.pattern).test(s.sample) } catch { ok = 'invalid' }
  const num = (k, label, unit) => (
    <div>
      <label htmlFor={k} className="text-xs text-muted">{label}</label>
      <div className="flex items-center gap-2"><input id={k} type="number" min="0" value={s[k]} onChange={(e) => set(k, Number(e.target.value))} className={input} />{unit && <span className="mt-1 text-xs text-muted">{unit}</span>}</div>
    </div>
  )

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10 pb-28">
      <header>
        <h1 className="font-display text-4xl">Setup and governance</h1>
        <p className="mt-2 max-w-xl text-muted">Set the rules your students and host organisations follow.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <h2 className="font-semibold">Student sign-up rules</h2>
          <label htmlFor="pattern" className="mt-4 block text-xs text-muted">Matric number pattern</label>
          <input id="pattern" value={s.pattern} onChange={(e) => set('pattern', e.target.value)} className={`${input} font-mono`} />
          <label htmlFor="sample" className="mt-3 block text-xs text-muted">Try a matric number</label>
          <input id="sample" value={s.sample} onChange={(e) => set('sample', e.target.value)} className={`${input} font-mono`} />
          <p role="status" className={`mt-2 text-sm ${ok === true ? 'text-ok' : 'text-muted'}`}>{ok === 'invalid' ? 'This pattern is not valid.' : ok ? 'This number matches.' : 'This number does not match.'}</p>
          <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-4">
            <div><p className="text-sm font-medium">Only allow school email addresses</p><p className="text-xs text-muted">Students must sign up with the domain below.</p></div>
            <Toggle on={s.domainLock} onChange={(v) => set('domainLock', v)} label="Only allow school email addresses" />
          </div>
          <label htmlFor="domain" className="mt-3 block text-xs text-muted">Email domain</label>
          <input id="domain" value={s.domain} disabled={!s.domainLock} onChange={(e) => set('domain', e.target.value)} className={`${input} disabled:opacity-50`} />
        </section>

        <section className={card}>
          <h2 className="font-semibold">Practicum rules</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {num('hours', 'Required hours', 'hrs')}{num('credits', 'Credit units', 'units')}
            {num('stipend', 'Minimum monthly stipend', '₦')}{num('signoffDays', 'Logbook sign-off window', 'days')}
            {num('dailyMax', 'Overtime alert after', 'hrs a day')}
          </div>
        </section>

        <section className={card}>
          <h2 className="font-semibold">Check-in location</h2>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div><p className="text-sm font-medium">Check-ins must be at the host site</p><p className="text-xs text-muted">Check-ins outside the radius are flagged for review.</p></div>
            <Toggle on={s.geofence} onChange={(v) => set('geofence', v)} label="Check-ins must be at the host site" />
          </div>
          <label htmlFor="radius" className="mt-4 flex justify-between text-xs text-muted"><span>Site radius</span><span>{s.radius} m</span></label>
          <input id="radius" type="range" min="50" max="500" step="10" value={s.radius} disabled={!s.geofence} onChange={(e) => set('radius', Number(e.target.value))} className="mt-1 w-full disabled:opacity-50" />
          <div className="mt-4">{num('mismatchMinutes', 'Flag when logged and confirmed times differ by', 'minutes')}</div>
        </section>

        <section className={card}>
          <h2 className="font-semibold">Credit approval</h2>
          <p className="mt-1 text-sm text-muted">The person who signs off practicum credit for your institution.</p>
          <label htmlFor="sig" className="mt-4 block text-xs text-muted">Name</label>
          <input id="sig" value={s.signatory} onChange={(e) => set('signatory', e.target.value)} className={input} />
          <label htmlFor="sigt" className="mt-3 block text-xs text-muted">Title</label>
          <input id="sigt" value={s.signatoryTitle} onChange={(e) => set('signatoryTitle', e.target.value)} className={input} />
        </section>
      </div>

      {dirty && (
        <div className="fixed inset-x-4 bottom-4 z-10 mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink p-4 text-white">
          <p className="text-sm">You have unsaved changes.</p>
          <div className="flex gap-2">
            <button onClick={() => setS(saved)} className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium">Discard</button>
            <button onClick={() => setSaved(s)} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-ink">Save changes</button>
          </div>
        </div>
      )}
    </main>
  )
}