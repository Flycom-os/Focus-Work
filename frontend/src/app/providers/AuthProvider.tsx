import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, type AuthUser } from '../../shared/api/api'

type AuthState = {
  isReady: boolean
  user: AuthUser | null
  accessToken: string | null
  login: (params: { identifier: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const ACCESS_TOKEN_KEY = 'fw_access_token'
const REFRESH_TOKEN_KEY = 'fw_refresh_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY))

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setAccessToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (params: { identifier: string; password: string }) => {
    const res = await api.auth.login(params)
    localStorage.setItem(ACCESS_TOKEN_KEY, res.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreash_token)
    setAccessToken(res.access_token)
    setUser(res.user)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!token) {
        if (!cancelled) setIsReady(true)
        return
      }

      try {
        const me = await api.user.me(token)
        if (!cancelled) {
          setAccessToken(token)
          setUser(me)
        }
      } catch {
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setIsReady(true)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [logout])

  const value = useMemo<AuthState>(
    () => ({
      isReady,
      user,
      accessToken,
      login,
      logout,
    }),
    [isReady, user, accessToken, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

