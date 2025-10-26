import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  userId: string
  email: string
  userName: string
  phoneNumber : string
  role: "USER"
}

interface AuthStore {
  accessToken: string | null
  user: User | null
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setUser: (user: User) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    { name: "auth-storage" }
  )
)
