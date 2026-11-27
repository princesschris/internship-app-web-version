import { useAuth } from '../../context/AuthContext'
import { institutionSample as i } from '../../data/profiles'
import Picture from '../../components/ui/Picture'
import { card, chip } from '../../lib/styles'

export default function InstitutionProfile() {
  const { profile } = useAuth()
  const name = profile?.details?.instName || i.name
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <section className={`${card} flex flex-wrap items-center gap-6`}>
        <Picture alt={`${name} logo`} label={initials} className="h-20 w-20 rounded-2xl font-display text-2xl" />
        <div className="min-w-60 flex-1">
          <h1 className="font-display text-4xl">{name}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">{i.about}</p>
          <p className="mt-2 text-xs text-muted">Account {profile?.verification_status || 'pending'}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {i.stats.map(([l, v]) => <div key={l} className={card}><p className="text-xs text-muted">{l}</p><p className="mt-2 text-3xl font-semibold">{v}</p></div>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className={card}>
            <h2 className="font-semibold">Practicum coordinator</h2>
            <p className="mt-3 text-lg font-semibold">{i.coordinator[0]}</p>
            <p className="text-sm text-muted">{i.coordinator[1]} · {i.coordinator[2]}</p>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Programmes on placement</h2>
            <ul className="mt-3 divide-y divide-line text-sm">
              {i.programmes.map(([p, n]) => <li key={p} className="flex justify-between py-2.5"><span>{p}</span><span className="font-semibold">{n} students</span></li>)}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Faculty mentors</h2>
            <ul className="mt-3 space-y-3">
              {i.mentors.map(([n, d]) => (
                <li key={n} className="flex items-center gap-3 text-sm">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-soft text-xs font-medium">{n.replace(/^(Dr|Prof)\. /, '')[0]}</span>
                  <span><span className="block font-medium">{n}</span><span className="text-xs text-muted">{d}</span></span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <h2 className="font-semibold">Partner host organisations</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">{i.hosts.map((h) => <span key={h} className={chip}>{h}</span>)}</div>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Placement rules</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {i.policies.map(([t, x]) => <li key={t}><span className="font-medium">{t}: </span><span className="text-muted">{x}</span></li>)}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-semibold">Matric number format</h2>
            <p className="mt-3 rounded-lg bg-soft p-3 font-mono text-xs">{i.matricPattern}</p>
            <p className="mt-2 text-xs text-muted">You can change this on the Student roster page.</p>
          </section>

          <Picture alt="Campus" label="Campus photo" className="h-44 w-full rounded-2xl text-sm" />
        </div>
      </div>
    </main>
  )
}