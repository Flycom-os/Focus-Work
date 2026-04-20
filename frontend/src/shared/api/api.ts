export type AuthUser = {
  id: string
  email: string
  fullName: string
  phone?: string | null
  role: string
  icon?: string | null
}

type LoginResponse = {
  message: string
  user: AuthUser
  access_token: string
  refreash_token: string
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:7000'

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const token = init?.token
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

export const api = {
  auth: {
    login: (params: { identifier: string; password: string }) =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  },
  user: {
    me: (token: string) =>
      request<AuthUser>('/user/me', {
        method: 'GET',
        token,
      }),
  },
}

