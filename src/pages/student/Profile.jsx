import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { studentSample as s } from '../../data/profiles'
import { card, btnLight, chip } from '../../lib/styles'

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
    <dt className="text-muted">{label}</dt><dd className="text-right font-medium">{value || 'Not added'}</dd>
  </div>
)

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full ${on ? 'bg-ink' : 'bg-line'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function Profile() {
  const { profile } = useAuth()
  const d = profile?.details || {}
  const name = profile?.full_name || 'Student'
  const [consents, setConsents] = useState(s.consents.map((c) => c[2]))
  const pct = Math.round((s.credits.earned / s.credits.required) * 100)

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <section className={`${card} flex flex-wrap items-center gap-6`}>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-ink font-display text-3xl text-white">{name[0]}</div>
        <div className="min-w-60 flex-1">
          <h1 className="font-display text-4xl">{name}</h1>
          <p className="text-sm text-muted">{d.course || s.headline} · {d.university || 'Your university'}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className={chip}>CGPA {s.cgpa}</span><span className={chip}>{s.level}</span>
            <span className={chip}>Account {profile?.verification_status || 'pending'}</span>
          </div>
        </div>
        <button className={btnLight}>Download CV</button>
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted"><span>Credit units earned</span><span>{s.credits.earned} of {s.credits.required}</span></div>
          <div className="mt-2 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} /></div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className={card}>
            <h2 className="font-semibold">Academic record</h2>
            <dl className="mt-3">
              <Row label="University" value={d.university} /><Row label="Faculty" value={s.faculty} />
              <Row label="Department" value={s.department} /><Row label="Matric number" value={d.matric} />
              <Row label="Email" value={profile?.email} /><Row label="Academic adviser" value={`${s.adviser[0]}, ${s.adviser[1]}`} />
            </dl>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Certified coursework</h2>
            <ul className="mt-3 divide-y divide-line text-sm">
              {s.coursework.map(([code, title, grade]) => (
                <li key={code} className="flex items-center justify-between py-2.5"><span><span className="text-xs text-muted">{code}</span> {title}</span><span className="font-semibold">{grade}</span></li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Placement preferences</h2>
            <dl className="mt-3">{s.preferences.map(([l, v]) => <Row key={l} label={l} value={v} />)}</dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <div className="flex justify-between"><h2 className="font-semibold">Current placement</h2><span className={chip}>Active</span></div>
            <p className="mt-3 text-lg font-semibold">{s.placement.host}</p>
            <p className="text-xs text-muted">{s.placement.where} · {s.placement.dates}</p>
            <p className="mt-3 text-sm">Supervisor: {s.placement.supervisor}, {s.placement.role}</p>
            <div className="mt-3 rounded-xl bg-soft p-4 text-sm"><p className="text-xs text-muted">Latest review · {s.placement.rating}</p><p className="mt-1">{s.placement.review}</p></div>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Skills and work samples</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">{s.skills.map((k) => <span key={k} className={chip}>{k}</span>)}</div>
            <ul className="mt-4 divide-y divide-line text-sm">
              {s.artifacts.map(([t, when]) => <li key={t} className="flex justify-between py-2.5"><span>{t}</span><span className="text-xs text-muted">{when}</span></li>)}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Privacy and sharing</h2>
            <ul className="mt-3 space-y-4">
              {s.consents.map(([t, x], i) => (
                <li key={t} className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted">{x}</p></div>
                  <Toggle label={t} on={consents[i]} onChange={(v) => setConsents(consents.map((c, j) => (j === i ? v : c)))} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}