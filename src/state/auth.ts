import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email?: string
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  needsOnboarding: boolean
  login: (user: User, opts?: { needsOnboarding?: boolean }) => void
  logout: () => void
  completeOnboarding: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      login: (user, opts) => set({ user, isAuthenticated: true, needsOnboarding: !!opts?.needsOnboarding }),
      logout: () => set({ user: null, isAuthenticated: false, needsOnboarding: false }),
      completeOnboarding: () => set({ needsOnboarding: false }),
    }),
    { name: 'auth-store' }
  )
)

export const demoLogin = () => {
  useAuthStore.getState().login({ id: 'u_1', name: 'Alex Contractor', email: 'demo@onsite.app' })
}
