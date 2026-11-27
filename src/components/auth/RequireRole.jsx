import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, homeFor } from '../../context/AuthContext'

const Message = ({ children }) => <p className="px-6 py-20 text-center text-muted">{children}</p>

// Wrap a role's routes: only signed-in people with that role get in.
export default function RequireRole({ role }) {
  const { session, profile, loading, signOut } = useAuth()
  if (loading) return <Message>Loading</Message>
  if (!session) return <Navigate to="/signin" replace />
  if (!profile)
    return (
      <Message>
        We could not load your profile. <button onClick={signOut} className="font-medium text-ink underline">Sign out</button> and try again.
      </Message>
    )
  if (profile.role !== role) return <Navigate to={homeFor(profile.role)} replace />
  return <Outlet />
}

// "/" sends people to their own area, or to sign in.
export function RootRedirect() {
  const { session, profile, loading } = useAuth()
  if (loading) return <Message>Loading</Message>
  return <Navigate to={session && profile ? homeFor(profile.role) : '/signin'} replace />
}