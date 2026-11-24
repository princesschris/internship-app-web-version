import { useState } from 'react'
import { internships, categories } from '../../data/mock'
import PlacementCard from '../../components/student/PlacementCard'

export default function ExploreInternships() {
  const [category, setCategory] = useState(categories[0])
  const shown = category === categories[0] ? internships : internships.filter((j) => j.category === category)

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl">Curated placements</h1>
          <p className="mt-3 max-w-xl text-muted">
            Placements from organisations verified by your institution, matched to your department and skills.
          </p>
        </div>
        <dl className="flex gap-8 rounded-2xl bg-soft px-6 py-4 text-center">
          <div><dt className="text-xs text-muted">Open roles</dt><dd className="text-xl font-semibold">{internships.length}</dd></div>
          <div><dt className="text-xs text-muted">Paid</dt><dd className="text-xl font-semibold">100%</dd></div>
        </dl>
      </header>

      <section className="rounded-2xl border border-line bg-card p-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-medium ${c === category ? 'bg-ink text-white' : 'bg-soft hover:bg-line'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {['Location: All of Nigeria', 'Mode: Hybrid and on-site', 'Stipend: ₦100,000+ a month'].map((f) => (
            <button key={f} className="rounded-lg border border-line px-3 py-2">{f}</button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((j) => <PlacementCard key={j.id} job={j} />)}
      </div>

      <p className="text-xs text-muted">Showing {shown.length} of {internships.length} placements. Updated every morning at 8:00 AM WAT.</p>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Need guidance before you apply?</h2>
          <p className="text-sm text-muted">Your practicum coordinator can review your CV and suggest placements.</p>
        </div>
        <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">Book an advisor slot</button>
      </section>
    </main>
  )
}