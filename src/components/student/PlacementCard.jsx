import { Bookmark } from 'lucide-react'
import { naira, shortDate } from '../../lib/format'

export default function PlacementCard({ job, compact = false }) {
  const initials = job.organisation.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card">
      {!compact && (
        <div className="relative flex h-32 items-end justify-between bg-soft p-4">
          <span className="absolute left-4 top-4 rounded-full bg-card px-2.5 py-1 text-xs font-medium">{job.match}% profile match</span>
          <span className="font-display text-4xl text-muted/50">{initials}</span>
          <span className="text-xs text-muted">{job.openings} openings</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {compact && (
          <div className="flex items-center justify-between text-xs">
            <span className="rounded-full bg-soft px-2.5 py-1">{job.match}% match</span>
            <Bookmark size={16} className="text-muted" />
          </div>
        )}
        <div>
          <p className="text-xs text-muted">{job.organisation}</p>
          <h3 className="text-base font-semibold">{job.title}</h3>
          <p className="mt-1 text-xs text-muted">{job.location} · {job.mode} · {naira(job.stipend)} a month</p>
        </div>
        <p className="text-sm text-muted">{job.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {job.skills.map((s) => (
            <span key={s} className="rounded-md bg-soft px-2 py-1 text-xs">{s}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs">
          <span className="text-muted">Applications close {shortDate(job.deadline)}</span>
          <button className="font-medium hover:underline">View placement</button>
        </div>
      </div>
    </article>
  )
}