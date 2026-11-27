import { useState } from 'react'
import { days, hours, startSessions, startPending, completed } from '../../data/institutionTools'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

export default function SupervisionSchedule() {
  const [sessions, setSessions] = useState(startSessions)
  const [pending, setPending] = useState(startPending)
  const scheduled = 18 + (startPending.length - pending.length)
  const pct = Math.round((scheduled / 24) * 100)

  // Puts the request in the first free slot of the week.
  const book = (req) => {
    const free = days.flatMap((_, d) => hours.map((h) => [d, h])).find(([d, h]) => !sessions.some((s) => s.day === d && s.time === h))
    if (!free) return
    setSessions([...sessions, { day: free[0], time: free[1], title: req.kind, who: req.student }])
    setPending(pending.filter((p) => p.id !== req.id))
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header>
        <h1 className="font-display text-4xl">Supervision schedule</h1>
        <p className="mt-2 max-w-xl text-muted">Plan review meetings between students, faculty advisers and host mentors. Times are in WAT.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} overflow-x-auto lg:col-span-2`}>
          <h2 className="font-semibold">This week</h2>
          <table className="mt-4 w-full min-w-150 table-fixed border-collapse text-xs">
            <thead><tr><th className="w-14" />{days.map((d) => <th key={d} className="pb-2 text-left font-medium text-muted">{d}</th>)}</tr></thead>
            <tbody>
              {hours.map((h) => (
                <tr key={h} className="border-t border-line align-top">
                  <td className="py-2 text-muted">{h}</td>
                  {days.map((_, d) => {
                    const s = sessions.find((x) => x.day === d && x.time === h)
                    return (
                      <td key={d} className="p-1">
                        {s && <div className={`rounded-lg p-2 ${s.next ? 'bg-ink text-white' : 'bg-soft'}`}><p className="font-medium">{s.title}</p><p className={s.next ? 'text-white/70' : 'text-muted'}>{s.who}</p></div>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          <section className={card}>
            <p className="text-xs text-muted">Next session</p>
            <h2 className="font-semibold">Eko Cloud mid-placement review</h2>
            <p className="text-sm text-muted">Wed 25 Nov, 2:00 PM WAT</p>
            <p className="mt-2 text-xs text-muted">Amara Okafor, Chidi Eze and Dr. Ngozi Adeyemi</p>
            <button className={`${btnDark} mt-4 w-full`}>Join video call</button>
          </section>

          <section className={card}>
            <div className="flex justify-between text-sm"><h2 className="font-semibold">Reviews scheduled</h2><span>{scheduled} of 24</span></div>
            <div className="mt-3 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} /></div>
            <h3 className="mt-5 text-sm font-medium">Waiting for a time</h3>
            <ul className="mt-2 space-y-2">
              {pending.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-soft p-3 text-sm">
                  <span><span className="block font-medium">{p.student}</span><span className="text-xs text-muted">{p.kind}</span></span>
                  <button onClick={() => book(p)} className={`${btnLight} px-3 py-1.5 text-xs`}>Find a time</button>
                </li>
              ))}
              {pending.length === 0 && <li className="text-sm text-muted">Everyone has a time booked.</li>}
            </ul>
          </section>
        </aside>
      </div>

      <section className={card}>
        <h2 className="font-semibold">Completed reviews</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="text-xs text-muted"><tr><th className="py-2">Student</th><th>Host</th><th>Review</th><th>Score</th><th>Sign-off</th></tr></thead>
            <tbody className="divide-y divide-line">
              {completed.map(([n, h, r, sc, so]) => <tr key={n}><td className="py-3 font-medium">{n}</td><td>{h}</td><td>{r}</td><td>{sc}</td><td><span className={chip}>{so}</span></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}