import { useEffect, useState } from 'react'
import { listInternships } from '../../lib/api'
import PlacementCard from '../../components/student/PlacementCard'

const ALL = 'All'
const select = 'rounded-lg border border-line bg-card px-3 py-2 text-xs'

export default function ExploreInternships() {
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState('')
  const [category, setCategory] = useState(ALL)
  const [place, setPlace] = useState(ALL)
  const [mode, setMode] = useState(ALL)

  useEffect(() => {
    listInternships().then(setJobs).catch((e) => setError(e.message))
  }, [])

  const options = (key) => [ALL, ...new Set((jobs || []).map((j) => j[key]).filter(Boolean))]
  const shown = (jobs || []).filter((j) => (category === ALL || j.category === category) && (place === ALL || j.location === place) && (mode === ALL || j.mode === mode))
  const paid = jobs?.length ? Math.round((jobs.filter((j) => j.stipend > 0).length / jobs.length) * 100) : 0

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl">Curated placements</h1>
          <p className="mt-3 max-w-xl text-muted">Placements from verified organisations, ranked by how well they fit your skills and preferences.</p>
        </div>
        <dl className="flex gap-8 rounded-2xl bg-soft px-6 py-4 text-center">
          <div><dt className="text-xs text-muted">Open roles</dt><dd className="text-xl font-semibold">{jobs?.length ?? '-'}</dd></div>
          <div><dt className="text-xs text-muted">Paid</dt><dd className="text-xl font-semibold">{jobs ? `${paid}%` : '-'}</dd></div>
        </dl>
      </header>

      {error && <p role="alert" className="rounded-xl bg-soft p-4 text-sm">We could not load placements: {error}</p>}
      {!jobs && !error && <p className="text-sm text-muted">Loading placements</p>}

      {jobs && (
        <>
          <section className="rounded-2xl border border-line bg-card p-5">
            <div className="flex flex-wrap gap-2">
              {options('category').map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-xs font-medium ${c === category ? 'bg-ink text-white' : 'bg-soft hover:bg-line'}`}>{c === ALL ? 'All placements' : c}</button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="text-xs text-muted">Location <select value={place} onChange={(e) => setPlace(e.target.value)} className={select}>{options('location').map((o) => <option key={o}>{o}</option>)}</select></label>
              <label className="text-xs text-muted">Work mode <select value={mode} onChange={(e) => setMode(e.target.value)} className={select}>{options('mode').map((o) => <option key={o}>{o}</option>)}</select></label>
            </div>
          </section>

          {shown.length === 0 ? (
            <p className="text-sm text-muted">{jobs.length === 0 ? 'No placements are open yet. Please check back soon.' : 'No placements match those filters.'}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((j) => <PlacementCard key={j.id} job={j} />)}</div>
          )}
          <p className="text-xs text-muted">Showing {shown.length} of {jobs.length} placements.</p>
        </>
      )}
    </main>
  )
}