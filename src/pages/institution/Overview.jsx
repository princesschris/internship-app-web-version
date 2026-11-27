import { useState } from 'react'
import { overview, stages, departments, students, notices, TARGET_HOURS } from '../../data/institution'
import Picture from '../../components/ui/Picture'
import { shortDate } from '../../lib/format'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

const stageShade = ['bg-line', 'bg-ink', 'bg-muted', 'bg-ok']

export default function Overview() {
  const [dept, setDept] = useState('All')
  const [query, setQuery] = useState('')
  const total = stages.reduce((n, [, c]) => n + c, 0)
  const rows = students.filter((s) => s.status !== 'Awaiting placement' && (dept === 'All' || s.dept === dept) && (s.name + s.matric + s.host).toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Placements overview</h1>
          <p className="mt-2 max-w-xl text-muted">Follow your students, their host organisations and attendance in one place.</p>
        </div>
        <div className="flex gap-3"><button className={btnLight}>Generate cohort report</button><button className={btnDark}>Export credit report</button></div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Active placements', overview.active], ['Verified hours', overview.hours.toLocaleString('en-NG')], ['Reviews awaiting sign-off', overview.awaiting], ['Approvals pending', overview.approvals]].map(([l, v]) => (
          <div key={l} className={card}><p className="text-xs text-muted">{l}</p><p className="mt-2 text-3xl font-semibold">{v}</p></div>
        ))}
      </div>

      <section className={card}>
        <h2 className="font-semibold">Where your students are</h2>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          {stages.map(([n, c], i) => <div key={n} className={stageShade[i]} style={{ width: `${(c / total) * 100}%` }} title={`${n}: ${c}`} />)}
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-4">
          {stages.map(([n, c], i) => (
            <li key={n} className="text-sm"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${stageShade[i]}`} /><span className="font-medium">{n}</span>
              <p className="text-xs text-muted">{c} students · {Math.round((c / total) * 100)}%</p></li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <div className="flex flex-wrap items-center gap-2">
            {['All', ...departments].map((d) => (
              <button key={d} onClick={() => setDept(d)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${dept === d ? 'bg-ink text-white' : 'bg-soft'}`}>{d}</button>
            ))}
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student or host" aria-label="Search" className="ml-auto rounded-lg border border-line px-3 py-1.5 text-xs" />
          </div>
          <ul className="mt-4 divide-y divide-line">
            {rows.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-4 py-4">
                <div className="min-w-40 flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted">{s.matric} · {s.dept}</p></div>
                <div className="min-w-32 flex-1 text-xs"><p className="text-muted">{s.host}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ink" style={{ width: `${(s.hours / TARGET_HOURS) * 100}%` }} /></div>
                  <p className="mt-1 text-muted">{s.hours} of {TARGET_HOURS} hrs</p></div>
                <span className={chip}>{s.attendance}</span>
                <p className="w-24 text-xs text-muted">Reviewed {s.lastReview ? shortDate(s.lastReview) : 'never'}</p>
                <button className={`${btnLight} px-4 py-1.5 text-xs`}>Review</button>
              </li>
            ))}
            {rows.length === 0 && <li className="py-6 text-sm text-muted">No students match. Try another department or search.</li>}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className={card}>
            <h2 className="text-sm font-semibold">Notices</h2>
            <ul className="mt-3 space-y-3">
              {notices.map((n) => (
                <li key={n.title} className="rounded-xl bg-soft p-3 text-sm"><p className="flex justify-between font-medium">{n.title}<span className="text-xs font-normal text-muted">{n.level}</span></p><p className="mt-1 text-xs text-muted">{n.text}</p></li>
              ))}
            </ul>
          </section>
          <section className={card}>
            <h2 className="text-sm font-semibold">Host organisations</h2>
            <Picture alt="Map of host organisations" label="Map or photo" className="mt-3 h-40 w-full rounded-xl text-sm" />
            <p className="mt-2 text-xs text-muted">Hosts across Lagos, Abuja, Kano and Port Harcourt.</p>
          </section>
        </aside>
      </div>
    </main>
  )
}