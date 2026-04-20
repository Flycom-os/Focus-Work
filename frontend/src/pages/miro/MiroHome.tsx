import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { api, type MiroBoardListItem } from '../../shared/api/api'

export function MiroHome() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [boards, setBoards] = useState<MiroBoardListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('Mind map')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'miro')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!accessToken) return
      setLoading(true)
      setError(null)
      try {
        const list = await api.miro.boards.list(accessToken)
        if (!cancelled) setBoards(list)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка загрузки досок')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  const canCreate = useMemo(() => title.trim().length > 0 && !creating && !!accessToken, [title, creating, accessToken])

  return (
    <div className="page">
      <div className="page__title">Miro</div>
      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 12' as any }}>
          <div className="card__title">Доски</div>
          <div className="muted" style={{ marginBottom: 10 }}>
            Создавайте доски и открывайте редактор. Данные сохраняются в Postgres через Nest API.
          </div>

          <div className="miroList">
            <div className="miroCreate">
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название доски" />
              <button
                className="btn"
                disabled={!canCreate}
                onClick={async () => {
                  if (!accessToken) return
                  setCreating(true)
                  setError(null)
                  try {
                    const b = await api.miro.boards.create(accessToken, { title: title.trim() })
                    navigate(`/miro/boards/${b.id}`)
                  } catch (e) {
                    setError(e instanceof Error ? e.message : 'Ошибка создания доски')
                  } finally {
                    setCreating(false)
                  }
                }}
              >
                {creating ? 'Создаём…' : 'Создать и открыть'}
              </button>
            </div>

            {error ? <div className="alert alert--error">{error}</div> : null}

            {loading ? (
              <div className="muted">Загрузка…</div>
            ) : (
              <div className="miroBoards">
                {boards.length === 0 ? (
                  <div className="muted">Пока нет досок. Создайте первую выше.</div>
                ) : (
                  boards.map((b) => (
                    <button key={b.id} className="miroBoardCard" onClick={() => navigate(`/miro/boards/${b.id}`)}>
                      <div className="miroBoardCard__title">{b.title}</div>
                      <div className="muted">
                        Нод: {b._count?.nodes ?? 0} · обновлено {new Date(b.updatedAt).toLocaleString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

