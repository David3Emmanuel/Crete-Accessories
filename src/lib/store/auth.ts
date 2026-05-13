import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: number
  username: string
  email: string
}

interface AuthStore {
  user: AuthUser | null
  jwt: string | null
  setAuth: (user: AuthUser, jwt: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      setAuth: (user, jwt) => set({ user, jwt }),
      logout: () => set({ user: null, jwt: null }),
    }),
    { name: 'crete-auth' },
  ),
)
