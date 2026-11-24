import { Check } from 'lucide-react'
import { student, placement, pipeline, attendance, meeting, advisor, milestones, internships } from '../../data/mock'
import PlacementCard from '../../components/student/PlacementCard'

const card = 'rounded-2xl border border-line bg-card p-6'
const btnDark = 'rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white'
const btnLight = 'rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium'

export default function Dashboard() {
  const pct = Math.round((placement.loggedHours / placement.targetHours) * 100)

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted">{student.term} · Verified practicum student</p>
          <h1 className="mt-2 font-display text-4xl">Good morning, <em>{student.firstName}.</em></h1>
          <p className="mt-2 max-w-xl text-muted">
            Your placement is underway. Review your milestones, confirm today's hours, and prepare for your next supervisor meeting.
          </p>
        </div>
        <p className="text-sm">Week <span className="font-semibold">{placement.week}</span> of {placement.totalWeeks}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span>Active placement · Remote</span>
              <span>Checked in at {placement.checkedInAt}</span>
            </div>
            <p className="mt-5 text-xs text-muted">{placement.organisation}</p>
            <h2 className="text-2xl font-semibold">{placement.title}</h2>
            <p className="mt-2 text-sm text-muted">
              Supervised by {placement.supervisor} ({placement.supervisorRole}). Focus on {placement.focus}.
            </p>
            <div className="mt-6 rounded-xl bg-page p-4">
              <div className="flex justify-between text-xs text-muted">
                <span>Week {placement.week} of {placement.totalWeeks} · {pct}% complete</span>
                <span>{placement.targetHours - placement.loggedHours} hours remaining</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-line">
                <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>Logged: {placement.loggedHours} hrs</span>
                <span>Target: {placement.targetHours} hrs</span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className={btnDark}>Open daily logbook</button>
              <button className={btnLight}>View placement agreement</button>
            </div>
          </section>

          <section className={`${card} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <p className="text-xs text-muted">Scheduled · Mid-term review</p>
              <h3 className="font-semibold">{meeting.title}</h3>
              <p className="text-sm text-muted">{meeting.when} with {meeting.with}</p>
            </div>
            <button className={btnLight}>Join video call</button>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recommended for you</h2>
                <p className="text-sm text-muted">Chosen by your advisor to fit your focus area.</p>
              </div>
              <a href="/student/explore" className="text-sm font-medium hover:underline">View all</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {internships.slice(0, 2).map((j) => <PlacementCard key={j.id} job={j} compact />)}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className={card}>
            <h3 className="text-sm font-semibold">Applications</h3>
            <div className="mt-4 grid grid-cols-3 text-center">
              {[['In review', pipeline.active], ['Shortlisted', pipeline.shortlisted], ['Offers', pipeline.offers]].map(([l, n]) => (
                <div key={l}><p className="text-2xl font-semibold">{n}</p><p className="text-xs text-muted">{l}</p></div>
              ))}
            </div>
          </section>

          <section className={card}>
            <h3 className="text-sm font-semibold">Today's attendance</h3>
            <p className="mt-4 text-3xl font-semibold">{attendance.today}</p>
            <p className="text-xs text-muted">of {attendance.target} daily target · {attendance.percent}%</p>
            <div className="mt-3 h-1.5 rounded-full bg-line">
              <div className="h-full rounded-full bg-ok" style={{ width: `${attendance.percent}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted">Break time logged: {attendance.breakMinutes} mins</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className={btnLight}>Pause</button>
              <button className={btnDark}>Clock out</button>
            </div>
          </section>

          <section className={card}>
            <p className="font-semibold">{advisor.name}</p>
            <p className="text-xs text-muted">{advisor.role}</p>
            <p className="mt-3 font-display text-base italic text-muted">“{advisor.note}”</p>
            <button className={`${btnLight} mt-4 w-full`}>Send note to advisor</button>
          </section>

          <section className={card}>
            <h3 className="text-sm font-semibold">Milestones</h3>
            <ul className="mt-4 space-y-4">
              {milestones.map((m) => (
                <li key={m.label} className="flex gap-3">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${m.status === 'done' ? 'bg-ok' : m.status === 'current' ? 'bg-ink' : 'bg-line'}`}>
                    {m.status === 'done' && <Check size={12} />}
                  </span>
                  <div>
                    <p className={`text-sm ${m.status === 'upcoming' ? 'text-muted' : 'font-medium'}`}>{m.label}</p>
                    <p className="text-xs text-muted">{m.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}