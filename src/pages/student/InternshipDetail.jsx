import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInternship, myApplication, applyToInternship, isSaved, setSaved } from '../../lib/api'
import Picture from '../../components/ui/Picture'
import { naira, shortDate } from '../../lib/format'
import { card, btnDark, btnLight, chip } from '../../lib/styles'

const label = { submitted: 'Application submitted', shortlisted: 'You have been shortlisted', offered: 'You have an offer', accepted: 'Offer accepted', rejected: 'Not selected this time', withdrawn: 'Application withdrawn' }

export default function InternshipDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [job, setJob] = useState(undefined)
  const [app, setApp] = useState(null)
  const [saved, setSavedState] = useState(false)
  const [statement, setStatement] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getInternship(id), myApplication(id), isSaved(id)])
      .then(([j, a, s]) => { setJob(j); setApp(a); setSavedState(s) })
      .catch((e) => { setError(e.message); setJob(null) })
  }, [id])

  const apply = async () => {
    setBusy(true); setError('')
    try {
      await applyToInternship(id, profile.id, statement)
      setApp(await myApplication(id))
    } catch (e) {
      setError(e.code === '23505' ? 'You have already applied for this placement.' : e.message)
    } finally { setBusy(false) }
  }

  const toggleSave = async () => {
    try { await setSaved(id, profile.id, !saved); setSavedState(!saved) } catch (e) { setError(e.message) }
  }

  if (job === undefined) return <p className="px-6 py-20 text-center text-muted">Loading</p>
  if (!job) return <p className="px-6 py-20 text-center text-muted">{error || 'We could not find that placement.'}</p>
  const d = profile?.details || {}

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <Link to="/student/explore" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft size={16} /> Back to curated placements</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <div className="flex flex-wrap gap-2 text-xs"><span className={chip}>{job.match}% match</span><span className={chip}>{job.category}</span></div>
            <h1 className="mt-4 font-display text-4xl">{job.title}</h1>
            <p className="mt-3 text-sm text-muted">{job.organisation} · {job.location} ({job.mode}) · {naira(job.stipend)} a month</p>
          </section>

          <Picture src={job.image} alt={`${job.organisation} workplace`} label="Workplace photo" className="h-64 w-full rounded-2xl text-sm" />

          <section className={card}>
            <h2 className="text-xs text-muted">About the placement</h2>
            <p className="mt-3 max-w-prose leading-relaxed">{job.description || job.summary}</p>
          </section>

          {job.responsibilities.length > 0 && (
            <section className={card}>
              <h2 className="text-lg font-semibold">What you will do</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
          )}

          <section className={card}>
            <h2 className="text-lg font-semibold">Skills and departments</h2>
            <p className="mt-3 text-xs text-muted">Skills wanted</p>
            <div className="mt-1 flex flex-wrap gap-1.5">{job.skills.map((s) => <span key={s} className={chip}>{s}</span>)}</div>
            {job.departments.length > 0 && (<><p className="mt-4 text-xs text-muted">Open to students from</p>
              <div className="mt-1 flex flex-wrap gap-1.5">{job.departments.map((s) => <span key={s} className={chip}>{s}</span>)}</div></>)}
          </section>
        </div>

        <aside className="space-y-6">
          <section className={card}>
            <h2 className="text-xs text-muted">Your application</h2>
            <div className="mt-3 rounded-xl bg-soft p-4 text-sm">
              <p className="font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted">{d.matric || 'No matric number'} · {d.course || 'No course added'}</p>
              <p className="text-xs text-muted">{d.university}</p>
            </div>
            {app ? (
              <p role="status" className="mt-4 rounded-xl bg-soft p-4 text-sm font-medium">{label[app.status] || app.status}</p>
            ) : (
              <>
                <label htmlFor="note" className="mt-4 block text-xs text-muted">Personal statement (optional)</label>
                <textarea id="note" rows={4} value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Share why this placement fits your goals." className="mt-1 w-full rounded-lg border border-line p-3 text-sm" />
                <button onClick={apply} disabled={busy} className={`${btnDark} mt-4 w-full disabled:opacity-60`}>{busy ? 'Submitting' : 'Submit application'}</button>
              </>
            )}
            <button onClick={toggleSave} className={`${btnLight} mt-2 w-full`}>{saved ? 'Saved to shortlist' : 'Save to shortlist'}</button>
            {error && <p role="alert" className="mt-3 text-sm text-muted">{error}</p>}
          </section>

          <section className={card}>
            <h3 className="text-sm font-semibold">Key facts</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Applications close</dt><dd>{job.deadline ? shortDate(job.deadline) : 'Open'}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Openings</dt><dd>{job.openings}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Monthly stipend</dt><dd>{naira(job.stipend)}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  )
}