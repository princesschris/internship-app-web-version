import { useState } from 'react'
import { filters, conversations } from '../../data/messages'
import { card, btnDark } from '../../lib/styles'

const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('')

export default function Messages() {
  const [convos, setConvos] = useState(conversations)
  const [activeId, setActiveId] = useState(1)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')

  const list = convos.filter((c) => (filter === 'All' || c.group === filter) && (c.title + c.preview).toLowerCase().includes(query.toLowerCase()))
  const active = convos.find((c) => c.id === activeId)

  const send = () => {
    if (!draft.trim()) return
    const time = new Date().toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
    setConvos(convos.map((c) => (c.id === activeId ? { ...c, preview: `You: ${draft}`, time, messages: [...c.messages, { from: 'You', me: true, time, text: draft }] } : c)))
    setDraft('')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Messages and advisory</h1>
          <p className="mt-2 max-w-xl text-muted">Talk directly with your host mentor, faculty lead and fellow interns.</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm">
          <div><p className="text-xs text-muted">Next tripartite review</p><p className="font-medium">Tomorrow, 2:00 PM WAT</p></div>
          <button className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-white">Join call</button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} p-4`}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages" aria-label="Search messages" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs font-medium ${f === filter ? 'bg-ink text-white' : 'bg-soft'}`}>{f}</button>
            ))}
          </div>
          <ul className="mt-3 space-y-1">
            {list.map((c) => (
              <li key={c.id}>
                <button onClick={() => setActiveId(c.id)} className={`flex w-full gap-3 rounded-xl p-3 text-left ${c.id === activeId ? 'bg-soft' : 'hover:bg-page'}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-line text-xs font-medium">{initials(c.title)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between text-sm font-medium"><span className="truncate">{c.title}</span><span className="text-xs font-normal text-muted">{c.time}</span></span>
                    <span className="block truncate text-xs text-muted">{c.preview}</span>
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="p-3 text-sm text-muted">No conversations match. Try another filter or search.</li>}
          </ul>
        </section>

        <section className={`${card} flex flex-col p-0 lg:col-span-2`}>
          <div className="border-b border-line p-5">
            <h2 className="font-semibold">{active.title}</h2>
            <p className="text-xs text-muted">{active.people}</p>
          </div>
          <div className="flex-1 space-y-5 p-5">
            {active.messages.map((m, i) => (
              <div key={i} className={m.me ? 'flex flex-col items-end' : ''}>
                <p className="text-xs text-muted">{m.from}{m.role ? ` · ${m.role}` : ''} · {m.time}</p>
                <div className={`mt-1 max-w-lg rounded-2xl p-4 text-sm leading-relaxed ${m.me ? 'bg-ink text-white' : 'bg-soft'}`}>
                  {m.text}
                  {m.file && <p className="mt-3 rounded-lg bg-white/10 p-2 text-xs">{m.file}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line p-4">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send() }} rows={3} placeholder="Write a message to this group" aria-label="Message" className="w-full rounded-lg border border-line p-3 text-sm" />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted">Press Ctrl + Enter to send. Messages are saved to your portfolio.</p>
              <button onClick={send} className={btnDark}>Send message</button>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[['Official record', 'Messages with your supervisors can be used as evidence for your credit assessment.'], ['48-hour replies', 'Faculty leads and host mentors aim to reply to work logs within 48 hours.'], ['Your work stays private', "Your host organisation's code and files stay in your own secure space."]].map(([t, x]) => (
          <div key={t} className="rounded-2xl border border-line bg-card p-4"><p className="text-sm font-semibold">{t}</p><p className="mt-1 text-xs text-muted">{x}</p></div>
        ))}
      </div>
    </main>
  )
}