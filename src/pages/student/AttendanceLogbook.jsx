import { useState } from 'react'
import { placement, attendance } from '../../data/mock'
import { competencies, startTags, startText, logs } from '../../data/logbook'
import { shortDate } from '../../lib/format'
import Picture from '../../components/ui/Picture'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

export default function AttendanceLogbook() {
  const [text, setText] = useState(startText)
  const [checked, setChecked] = useState([0, 1])
  const [tags, setTags] = useState(startTags)
  const [newTag, setNewTag] = useState('')
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const words = text.trim().split(/\s+/).filter(Boolean).length
  const pct = Math.round((placement.loggedHours / placement.targetHours) * 100)
  const shown = logs.filter((l) => (l.title + l.text + l.tags.join(' ')).toLowerCase().includes(query.toLowerCase()))
  const addTag = () => {
    const t = newTag.trim().replace(/^#?/, '#')
    if (t.length > 1 && !tags.includes(t)) setTags([...tags, t])
    setNewTag('')
  }
  const r = 52, c = 2 * Math.PI * r

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header>
        <h1 className="font-display text-4xl">Daily attendance and logbook</h1>
        <p className="mt-2 max-w-xl text-muted">Confirm you were present, record what you worked on, and reflect on your day. Your supervisor countersigns each entry.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={card}>
          <p className="text-xs text-muted">Total hours logged</p>
          <p className="mt-2 text-3xl font-semibold">{placement.loggedHours} <span className="text-sm font-normal text-muted">/ {placement.targetHours} hrs</span></p>
          <div className="mt-3 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} /></div>
          <p className="mt-2 text-xs text-muted">{pct}% complete</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">Current shift</p>
          <p className="mt-2 text-3xl font-semibold">{attendance.today} <span className="text-sm font-normal text-ok">Active</span></p>
          <p className="mt-3 text-xs text-muted">{placement.organisation} · Lagos</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">Supervisor sign-off rate</p>
          <p className="mt-2 text-3xl font-semibold">100% <span className="text-sm font-normal text-ok">Verified</span></p>
          <p className="mt-3 text-xs text-muted">{placement.supervisor} · 6 of 6 weeks countersigned</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${card} lg:col-span-2`}>
          <p className="text-xs text-muted">Shift in progress · Checked in at {placement.checkedInAt}</p>
          <div className="relative mx-auto mt-6 h-40 w-40">
            <svg viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-line)" strokeWidth="8" />
              <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - attendance.percent / 100)} />
            </svg>
            <button className="absolute inset-0 grid place-items-center text-sm font-medium">Check out</button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-soft p-4"><p className="text-xs text-muted">Shift goal</p><p className="font-semibold">{attendance.target.replace('h', ' hrs')}</p><p className="text-xs text-muted">2h 06m remaining</p></div>
            <div className="rounded-xl bg-soft p-4"><p className="text-xs text-muted">Estimated finish</p><p className="font-semibold">05:17 PM</p><p className="text-xs text-muted">Includes {attendance.breakMinutes}m break</p></div>
          </div>
          <Picture alt="Host workplace" label="Workplace photo" className="mt-4 h-32 w-full rounded-xl text-sm" />
          <p className="mt-4 rounded-xl bg-soft p-3 text-xs text-muted">Hours are confirmed automatically when you check in at your host organisation, and sent to your institution when you check out.</p>
        </section>

        <section className={`${card} lg:col-span-3`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's reflection and summary</h2>
            <span className="text-xs text-muted">{submitted ? 'Submitted' : 'Draft'}</span>
          </div>
          <label htmlFor="log" className="mt-4 block text-sm">What did you build, investigate or resolve today?</label>
          <textarea id="log" rows={6} value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-lg border border-line p-3 text-sm leading-relaxed" />
          <p className={`mt-1 text-xs ${words < 40 ? 'text-muted' : 'text-ok'}`}>{words} words · minimum 40</p>

          <p className="mt-4 text-sm font-medium">Competencies shown today</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {competencies.map(([t, x], i) => (
              <label key={t} className="flex cursor-pointer gap-2 rounded-lg border border-line p-3 text-sm">
                <input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked(checked.includes(i) ? checked.filter((n) => n !== i) : [...checked, i])} />
                <span><span className="block font-medium">{t}</span><span className="text-xs text-muted">{x}</span></span>
              </label>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium">Tags</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-ink px-3 py-1 text-xs text-white">
                {t} <button aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}>×</button>
              </span>
            ))}
            <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="Add tag" className="w-24 rounded-full border border-line px-3 py-1 text-xs" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">Entries lock at 11:59 PM WAT</p>
            <div className="flex gap-2">
              <button className={btnLight}>Save draft</button>
              <button onClick={() => setSubmitted(true)} disabled={words < 40 || submitted} className={`${btnDark} disabled:opacity-50`}>{submitted ? 'Entry submitted' : "Submit today's entry"}</button>
            </div>
          </div>
        </section>
      </div>

      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Previous verified logs</h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by tag or keyword" className="rounded-lg border border-line px-3 py-2 text-xs" />
        </div>
        <ul className="mt-4 divide-y divide-line">
          {shown.map((l) => (
            <li key={l.date} className="flex gap-4 py-4">
              <div className="w-12 shrink-0 rounded-lg bg-soft py-2 text-center text-xs font-semibold">{shortDate(l.date)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{l.title} <span className={chip}>{l.hours}h verified</span></p>
                <p className="mt-1 text-sm text-muted">{l.text}</p>
                <p className="mt-1 text-xs text-muted">{l.tags.join('  ')}</p>
              </div>
              <p className="hidden text-xs text-muted sm:block">Countersigned by C. Eze</p>
            </li>
          ))}
          {shown.length === 0 && <li className="py-6 text-sm text-muted">No logs match that search. Try a different tag or keyword.</li>}
        </ul>
        <p className="mt-2 text-xs text-muted">Showing {shown.length} of 28 completed logs</p>
      </section>
    </main>
  )
}