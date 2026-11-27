import { useState } from 'react'
import { cases, options } from '../../data/institution'
import Picture from '../../components/ui/Picture'
import { card, btnDark, chip } from '../../lib/styles'

const fmt = (h) => `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`

export default function VerificationQueue() {
  const [activeId, setActiveId] = useState(cases[0].id)
  const [choice, setChoice] = useState('')
  const [note, setNote] = useState('')
  const [resolved, setResolved] = useState({})
  const c = cases.find((x) => x.id === activeId)
  const open = cases.filter((x) => !resolved[x.id]).length

  const submit = () => {
    setResolved({ ...resolved, [c.id]: options.find((o) => o[0] === choice)[1] })
    setChoice('')
    setNote('')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header>
        <h1 className="font-display text-4xl">Verification queue</h1>
        <p className="mt-2 max-w-xl text-muted">Review cases where a student's record and their supervisor's record do not agree.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        {[['Open cases', open], ['Average time to resolve', '14.2 hrs'], ['Records verified', '98.6%'], ['Hours verified', '4,110']].map(([l, v]) => (
          <div key={l} className={card}><p className="text-xs text-muted">{l}</p><p className="mt-2 text-3xl font-semibold">{v}</p></div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} p-3`}>
          <h2 className="px-3 pt-2 text-sm font-semibold">Cases</h2>
          <ul className="mt-2 space-y-1">
            {cases.map((x) => (
              <li key={x.id}>
                <button onClick={() => { setActiveId(x.id); setChoice(''); setNote('') }} className={`w-full rounded-xl p-3 text-left ${x.id === activeId ? 'bg-soft' : 'hover:bg-page'}`}>
                  <span className="flex justify-between text-xs text-muted"><span>{x.id}</span><span>{resolved[x.id] ? 'Resolved' : `${x.priority} priority`}</span></span>
                  <span className="block text-sm font-medium">{x.student}</span>
                  <span className="block text-xs text-muted">{x.issue}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} space-y-6 lg:col-span-2`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted">{c.id} · {c.host}</p>
              <h2 className="text-2xl font-semibold">{c.student}</h2>
              <p className="text-xs text-muted">{c.matric}</p>
            </div>
            <div className="rounded-xl bg-soft px-4 py-3 text-right text-sm">
              <p className="text-xs text-muted">Hours gap</p>
              <p className="text-xl font-semibold">{fmt(Math.abs(c.logged - c.confirmed))}</p>
              <p className="text-xs text-muted">Logged {c.logged}h · Confirmed {c.confirmed}h</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">What each person says</h3>
            <ul className="mt-3 space-y-3">
              {c.perspectives.map(([role, who, text]) => (
                <li key={role} className="rounded-xl bg-soft p-4 text-sm"><p className="text-xs text-muted">{role} · {who}</p><p className="mt-1">{text}</p></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Location record</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Picture alt="Map of the check-in site" label="Map" className="h-32 rounded-xl text-sm" />
              <ul className="space-y-2 text-sm">{c.checks.map(([l, v]) => <li key={l}><span className="text-xs text-muted">{l}</span><p>{v}</p></li>)}</ul>
            </div>
          </div>

          {resolved[c.id] ? (
            <p role="status" className="rounded-xl bg-soft p-4 text-sm"><span className={chip}>Resolved</span> Decision recorded: {resolved[c.id]}.</p>
          ) : (
            <div>
              <h3 className="text-sm font-semibold">Your decision</h3>
              <div className="mt-3 space-y-2">
                {options.map(([id, title, detail]) => (
                  <label key={id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${choice === id ? 'border-ink' : 'border-line'}`}>
                    <input type="radio" name="decision" checked={choice === id} onChange={() => setChoice(id)} className="mt-1" />
                    <span><span className="block font-medium">{title}</span><span className="text-xs text-muted">{detail}</span></span>
                  </label>
                ))}
              </div>
              <label htmlFor="note" className="mt-4 block text-xs text-muted">Note for the student and supervisor</label>
              <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border border-line p-3 text-sm" />
              <button onClick={submit} disabled={!choice} className={`${btnDark} mt-3 disabled:opacity-50`}>Record decision</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}