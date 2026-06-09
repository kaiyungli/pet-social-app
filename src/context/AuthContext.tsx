import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

import { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

type AuthContextValue = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
})

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getUser()

      setUser(data.user ?? null)
      setLoading(false)
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}