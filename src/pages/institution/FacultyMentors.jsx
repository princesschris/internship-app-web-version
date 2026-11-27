import { useState } from 'react'
import { mentorTabs, mentors as startMentors } from '../../data/institutionTools'
import { students } from '../../data/institution'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

const field = 'mt-1 w-full rounded-lg border border-line bg-page px-3 py-2 text-sm'

export default function FacultyMentors() {
  const [list, setList] = useState(startMentors)
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')
  const [studentId, setStudentId] = useState('')
  const [adviserId, setAdviserId] = useState('')
  const [msg, setMsg] = useState('')

  const advisers = list.filter((m) => m.kind === 'Faculty adviser')
  const shown = list.filter((m) => (tab === 'All' || m.kind === tab) && (m.name + m.org).toLowerCase().includes(query.toLowerCase()))

  const assign = (e) => {
    e.preventDefault()
    const a = advisers.find((m) => String(m.id) === adviserId)
    const s = students.find((x) => String(x.id) === studentId)
    if (a.assigned >= a.capacity) return setMsg(`${a.name} is at full capacity. Choose another adviser.`)
    setList(list.map((m) => (m.id === a.id ? { ...m, assigned: m.assigned + 1 } : m)))
    setMsg(`${s.name} is now assigned to ${a.name}.`)
    setStudentId('')
    setAdviserId('')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Faculty and mentors</h1>
          <p className="mt-2 max-w-xl text-muted">See who supervises your students, how full their lists are, and assign advisers.</p>
        </div>
        <dl className="flex gap-6 rounded-2xl bg-soft px-6 py-4 text-center">
          {[['Students per adviser', '1:12'], ['Supervised', '142'], ['Reply rate', '100%']].map(([l, v]) => <div key={l}><dt className="text-xs text-muted">{l}</dt><dd className="text-xl font-semibold">{v}</dd></div>)}
        </dl>
      </header>

      <section className={card}>
        <div className="flex flex-wrap items-center gap-2">
          {mentorTabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${tab === t ? 'bg-ink text-white' : 'bg-soft'}`}>{t}</button>)}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or organisation" aria-label="Search" className="ml-auto rounded-lg border border-line px-3 py-1.5 text-xs" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => (
            <article key={m.id} className="rounded-2xl border border-line p-5">
              <span className={chip}>{m.kind}</span>
              <h2 className="mt-3 font-semibold">{m.name}</h2>
              <p className="text-xs text-muted">{m.org}</p>
              <p className="mt-2 text-sm text-muted">{m.bio}</p>
              <p className="mt-3 text-xs text-muted">{m.assigned} of {m.capacity} students · Next session {m.next}</p>
            </article>
          ))}
          {shown.length === 0 && <p className="text-sm text-muted">No one matches. Try another tab or search.</p>}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <h2 className="font-semibold">Adviser workload</h2>
          <ul className="mt-4 space-y-4">
            {advisers.map((m) => (
              <li key={m.id}>
                <div className="flex justify-between text-sm"><span className="font-medium">{m.name} <span className="text-xs font-normal text-muted">{m.org}</span></span><span>{m.assigned} / {m.capacity}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-line"><div className={`h-full rounded-full ${m.assigned >= m.capacity ? 'bg-muted' : 'bg-ink'}`} style={{ width: `${(m.assigned / m.capacity) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>

        <form onSubmit={assign} className={card}>
          <h2 className="font-semibold">Assign an adviser</h2>
          <label htmlFor="stu" className="mt-4 block text-xs text-muted">Student</label>
          <select id="stu" required value={studentId} onChange={(e) => setStudentId(e.target.value)} className={field}>
            <option value="" disabled>Choose a student</option>{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <label htmlFor="adv" className="mt-3 block text-xs text-muted">Faculty adviser</label>
          <select id="adv" required value={adviserId} onChange={(e) => setAdviserId(e.target.value)} className={field}>
            <option value="" disabled>Choose an adviser</option>{advisers.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.assigned}/{m.capacity})</option>)}
          </select>
          {msg && <p role="status" className="mt-3 rounded-lg bg-soft p-3 text-sm">{msg}</p>}
          <button type="submit" className={`${btnDark} mt-4 w-full`}>Confirm assignment</button>
        </form>
      </div>
    </main>
  )
}