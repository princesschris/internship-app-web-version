import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export const homeFor = (role) =>
  ({ student: '/student', organisation: '/organisation', institution: '/institution', admin: '/admin' }[role] || '/signin')

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  const [profileReady, setProfileReady] = useState(false)

  // Only store the session here. Do not call Supabase inside this callback.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setReady(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!session) { setProfile(null); setProfileReady(true); return }
    setProfileReady(false)
    supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => { setProfile(data); setProfileReady(true) })
  }, [ready, session?.user?.id])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle()
    return p
  }

  const signUp = async ({ email, password, role, fullName, details }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role, fullName, details } } })
    if (error) throw error
    return data // data.session is null while email confirmation is switched on
  }

  const signOut = () => supabase.auth.signOut()

  const value = { session, profile, loading: !ready || !profileReady, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}