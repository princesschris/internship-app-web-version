import { useState } from 'react'
import { Check } from 'lucide-react'
import { placement } from '../../data/mock'
import { stages, delegates, agenda, rubric, slots, skills } from '../../data/milestones'
import Picture from '../../components/ui/Picture'
import { card, btnDark, btnLight } from '../../lib/styles'

const label = { done: 'Completed', active: 'Active', pending: 'Pending', final: 'Final' }

function Radar({ data }) {
  const pts = data.map(([, v], i) => {
    const a = (i * Math.PI) / 2 - Math.PI / 2
    return `${100 + 70 * (v / 100) * Math.cos(a)},${100 + 70 * (v / 100) * Math.sin(a)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44" role="img" aria-label="Skill distribution chart">
      {[1, 0.66, 0.33].map((s) => <circle key={s} cx="100" cy="100" r={70 * s} fill="none" stroke="var(--color-line)" />)}
      <polygon points={pts} fill="rgba(17,17,17,0.08)" stroke="var(--color-ink)" strokeWidth="2" />
    </svg>
  )
}

export default function PracticumMilestones() {
  const [slot, setSlot] = useState(null)
  const hoursPct = Math.round((placement.loggedHours / placement.targetHours) * 100)

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Practicum milestones and progress</h1>
          <p className="mt-2 max-w-xl text-muted">Track your assessments, competency scores and review sessions with your faculty lead and host mentor.</p>
        </div>
        <button className={btnDark}>Download full dossier</button>
      </header>

      <section className={card}>
        <div className="flex justify-between text-sm"><h2 className="font-semibold">Your roadmap</h2><span className="text-muted">Stage 2 of 4</span></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s) => (
            <div key={s.n} className={`rounded-xl p-4 ${s.status === 'active' ? 'bg-ink text-white' : 'bg-soft'}`}>
              <div className={`flex justify-between text-xs ${s.status === 'active' ? 'text-white/70' : 'text-muted'}`}>
                <span className="flex items-center gap-1">{s.status === 'done' ? <Check size={12} /> : `0${s.n}`}</span><span>{label[s.status]}</span>
              </div>
              <p className="mt-3 text-sm font-semibold">{s.title}</p>
              <p className={`mt-1 text-xs ${s.status === 'active' ? 'text-white/70' : 'text-muted'}`}>{s.note}</p>
              <p className="mt-3 text-xs">{s.when}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className={card}>
            <p className="text-xs text-muted">Official review session</p>
            <h2 className="text-xl font-semibold">Mid-placement review</h2>
            <p className="text-sm text-muted">Tomorrow, 25 Nov · 2:00 to 2:45 PM WAT</p>
            <h3 className="mt-5 text-sm font-medium">Confirmed attendees</h3>
            <ul className="mt-2 flex flex-wrap gap-3">
              {delegates.map(([n, r]) => (
                <li key={n} className="flex items-center gap-2 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-soft text-xs font-medium">{n.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
                  <span><span className="block font-medium">{n}</span><span className="text-xs text-muted">{r}</span></span>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 text-sm font-medium">Agenda</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {agenda.map(([t, x]) => <li key={t}><span className="font-medium">{t}: </span><span className="text-muted">{x}</span></li>)}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className={btnDark}>Join video call</button>
              <button className={btnLight}>Download pre-read (PDF)</button>
            </div>
          </section>

          <section className={card}>
            <h2 className="text-lg font-semibold">Book a consultation</h2>
            <p className="mt-1 text-sm text-muted">Times shown match your faculty lead's and mentor's calendars. Book at least 48 hours ahead.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {slots.map(([d, t, n], i) => (
                <button key={d} onClick={() => setSlot(i)} aria-pressed={slot === i} className={`rounded-xl border p-3 text-left text-sm ${slot === i ? 'border-ink bg-soft' : 'border-line'}`}>
                  <span className="block text-xs text-muted">{d}</span><span className="block font-medium">{t}</span><span className="text-xs text-muted">{n} slots open</span>
                </button>
              ))}
            </div>
            {slot !== null && <p className="mt-3 text-sm text-ok">Selected: {slots[slot][0]}, {slots[slot][1]}</p>}
            <Picture alt="Host workplace" label="Workplace photo" className="mt-4 h-36 w-full rounded-xl text-sm" />
          </section>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <h2 className="text-xs text-muted">Grading and assessment</h2>
            <p className="font-semibold">Faculty and industry evaluation rubric</p>
            <ul className="mt-4 space-y-4">
              {rubric.map(([t, s, x]) => (
                <li key={t}>
                  <div className="flex justify-between text-sm"><span className="font-medium">{t}</span><span>{s} / 5.0</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ink" style={{ width: `${(s / 5) * 100}%` }} /></div>
                  <p className="mt-1 text-xs text-muted">{x}</p>
                </li>
              ))}
              <li>
                <div className="flex justify-between text-sm"><span className="font-medium">Logbook and attendance</span><span className="text-ok">100% certified</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ok" style={{ width: `${hoursPct}%` }} /></div>
                <p className="mt-1 text-xs text-muted">{placement.loggedHours} of {placement.targetHours} required hours · 0 unverified gaps</p>
              </li>
            </ul>
          </section>

          <section className={card}>
            <p className="text-xs text-muted">Practicum credit</p>
            <p className="text-3xl font-semibold">6 <span className="text-sm font-normal text-muted">credit units</span></p>
            <p className="mt-2 text-sm text-muted">Awarded after you pass the final defence in stage 4.</p>
          </section>

          <section className={card}>
            <h2 className="text-sm font-semibold">Skill distribution</h2>
            <Radar data={skills} />
            <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-muted">
              {skills.map(([n, v]) => <li key={n}>{n} ({v}%)</li>)}
            </ul>
          </section>
        </div>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-soft p-6">
        <div>
          <p className="font-semibold">Need to add project evidence?</p>
          <p className="text-sm text-muted">Submit work samples at least 48 hours before your next evaluation.</p>
        </div>
        <div className="flex gap-3"><button className={btnLight}>Practicum handbook</button><button className={btnDark}>Upload work sample</button></div>
      </section>
    </main>
  )
}