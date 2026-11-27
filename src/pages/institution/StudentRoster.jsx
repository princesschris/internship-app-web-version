import { useState } from 'react'
import { departments, students } from '../../data/institution'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

export default function StudentRoster() {
  const [file, setFile] = useState('')
  const [pattern, setPattern] = useState('^VU/[A-Z]{3}/\\d{2}/\\d{4}$')
  const [sample, setSample] = useState('VU/SEN/22/4409')
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [status, setStatus] = useState('All')
  const [picked, setPicked] = useState([])

  let match = null
  try { match = new RegExp(pattern).test(sample) } catch { match = 'invalid' }

  const rows = students.filter((s) => (dept === 'All' || s.dept === dept) && (status === 'All' || s.status === status) && (s.name + s.matric + s.email).toLowerCase().includes(query.toLowerCase()))
  const toggle = (id) => setPicked(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id])
  const allOn = rows.length > 0 && rows.every((r) => picked.includes(r.id))
  const field = 'rounded-lg border border-line bg-page px-3 py-2 text-sm'

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Student roster</h1>
          <p className="mt-2 max-w-xl text-muted">Keep your list of enrolled students up to date and set how your school writes matric numbers.</p>
        </div>
        <dl className="flex gap-8 rounded-2xl bg-soft px-6 py-4 text-center">
          <div><dt className="text-xs text-muted">Enrolled</dt><dd className="text-xl font-semibold">1,248</dd></div>
          <div><dt className="text-xs text-muted">Verified</dt><dd className="text-xl font-semibold">99.4%</dd></div>
        </dl>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <h2 className="font-semibold">Import students</h2>
          <p className="mt-1 text-sm text-muted">Upload a CSV file with name, email, matric number and department.</p>
          <label className="mt-4 grid cursor-pointer place-items-center rounded-xl border border-dashed border-line bg-page p-6 text-sm text-muted">
            {file || 'Choose a CSV file'}
            <input type="file" accept=".csv" className="sr-only" onChange={(e) => setFile(e.target.files[0]?.name || '')} />
          </label>
          <button className={`${btnLight} mt-3`}>Download CSV template</button>
        </section>

        <section className={card}>
          <h2 className="font-semibold">Matric number format</h2>
          <p className="mt-1 text-sm text-muted">Students must match this pattern when they sign up.</p>
          <label htmlFor="pattern" className="mt-4 block text-xs text-muted">Pattern</label>
          <input id="pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} className={`${field} mt-1 w-full font-mono`} />
          <label htmlFor="sample" className="mt-3 block text-xs text-muted">Try a matric number</label>
          <input id="sample" value={sample} onChange={(e) => setSample(e.target.value)} className={`${field} mt-1 w-full font-mono`} />
          <p role="status" className={`mt-2 text-sm ${match === true ? 'text-ok' : 'text-muted'}`}>
            {match === 'invalid' ? 'This pattern is not valid.' : match ? 'This number matches the pattern.' : 'This number does not match the pattern.'}
          </p>
        </section>
      </div>

      <section className={card}>
        <div className="flex flex-wrap gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or matric number" aria-label="Search students" className={`${field} min-w-60 flex-1`} />
          <select value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department" className={field}><option>All</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className={field}>{['All', 'Placed', 'Awaiting placement', 'Flagged'].map((o) => <option key={o}>{o}</option>)}</select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-170 text-left text-sm">
            <thead className="text-xs text-muted"><tr>
              <th className="py-2"><input type="checkbox" aria-label="Select all" checked={allOn} onChange={() => setPicked(allOn ? [] : rows.map((r) => r.id))} /></th>
              <th>Student</th><th>Matric number</th><th>Department</th><th>Host</th><th>Supervisor</th><th>Status</th>
            </tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="py-3"><input type="checkbox" aria-label={`Select ${s.name}`} checked={picked.includes(s.id)} onChange={() => toggle(s.id)} /></td>
                  <td><p className="font-medium">{s.name}</p><p className="text-xs text-muted">{s.email}</p></td>
                  <td className="font-mono text-xs">{s.matric}</td><td>{s.dept}</td><td>{s.host || 'None yet'}</td><td>{s.supervisor}</td>
                  <td><span className={chip}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="py-6 text-sm text-muted">No students match those filters.</p>}
        </div>
        <p className="mt-3 text-xs text-muted">Showing {rows.length} of 1,248 students</p>
      </section>

      {picked.length > 0 && (
        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink p-4 text-white">
          <p className="text-sm">{picked.length} selected</p>
          <div className="flex gap-2"><button className="rounded-full bg-white px-4 py-2 text-xs font-medium text-ink">Send reminder</button><button className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium">Export list</button></div>
        </div>
      )}
    </main>
  )
}