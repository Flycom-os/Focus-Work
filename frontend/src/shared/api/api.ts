export type AuthUser = {
  id: string
  email: string
  fullName: string
  phone?: string | null
  role: string
  icon?: string | null
}

export type MiroBoardListItem = {
  id: string
  title: string
  icon?: string | null
  isArchived: boolean
  createdAt: string
  updatedAt: string
  _count?: { nodes: number }
}

export type MiroNode = {
  id: string
  boardId: string
  type: 'STICKY' | 'TEXT' | 'FRAME'
  x: number
  y: number
  w: number
  h: number
  rotation: number
  zIndex: number
  text?: string | null
  color?: string | null
  data?: string | null
  createdAt: string
  updatedAt: string
}

export type MiroBoard = {
  id: string
  ownerId: string
  title: string
  icon?: string | null
  isArchived: boolean
  createdAt: string
  updatedAt: string
  nodes: MiroNode[]
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
  miro: {
    boards: {
      list: (token: string) =>
        request<MiroBoardListItem[]>('/miro/boards', {
          method: 'GET',
          token,
        }),
      create: (token: string, params: { title: string }) =>
        request<MiroBoard>('/miro/boards', {
          method: 'POST',
          token,
          body: JSON.stringify(params),
        }),
      get: (token: string, boardId: string) =>
        request<MiroBoard>(`/miro/boards/${boardId}`, {
          method: 'GET',
          token,
        }),
      update: (token: string, boardId: string, params: { title?: string; isArchived?: boolean }) =>
        request<MiroBoard>(`/miro/boards/${boardId}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify(params),
        }),
      sync: (token: string, boardId: string, params: { nodes: Array<Partial<MiroNode> & { id?: string }> }) =>
        request<MiroBoard>(`/miro/boards/${boardId}/sync`, {
          method: 'PATCH',
          token,
          body: JSON.stringify(params),
        }),
      delete: (token: string, boardId: string) =>
        request<void>(`/miro/boards/${boardId}`, {
          method: 'DELETE',
          token,
        }),
    },
    nodes: {
      create: (
        token: string,
        boardId: string,
        params: Partial<Pick<MiroNode, 'type' | 'x' | 'y' | 'w' | 'h' | 'text' | 'color' | 'rotation' | 'zIndex' | 'data'>> &
          Pick<MiroNode, 'x' | 'y'>,
      ) =>
        request<MiroNode>(`/miro/boards/${boardId}/nodes`, {
          method: 'POST',
          token,
          body: JSON.stringify(params),
        }),
      update: (
        token: string,
        nodeId: string,
        params: Partial<Pick<MiroNode, 'x' | 'y' | 'w' | 'h' | 'text' | 'color' | 'rotation' | 'zIndex' | 'data'>>,
      ) =>
        request<MiroNode>(`/miro/nodes/${nodeId}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify(params),
        }),
      delete: (token: string, nodeId: string) =>
        request<void>(`/miro/nodes/${nodeId}`, {
          method: 'DELETE',
          token,
        }),
    },
  },
}

