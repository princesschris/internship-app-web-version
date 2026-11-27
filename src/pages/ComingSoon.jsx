import { useAuth } from '../context/AuthContext'
import { btnDark } from '../lib/styles'

export default function ComingSoon({ role }) {
  const { profile, signOut } = useAuth()
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Welcome, {profile?.full_name?.split(' ')[0] || 'there'}</h1>
      <p className="mt-3 text-muted">The {role} area is still being built. You are signed in and your account is working.</p>
      <button onClick={signOut} className={`${btnDark} mt-8`}>Sign out</button>
    </main>
  )
}