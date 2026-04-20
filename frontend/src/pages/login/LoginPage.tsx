import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'

export function LoginPage() {
  const { isReady, user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(
    () => identifier.trim().length > 0 && password.length >= 6 && !loading,
    [identifier, password, loading],
  )

  if (isReady && user) return <Navigate to={from} replace />

  return (
    <div className="page page--center" data-theme="auth">
      <div className="card card--wide">
        <div className="card__header">
          <div className="card__title">Вход</div>
          <div className="card__hint">Используйте email или телефон и пароль</div>
        </div>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            try {
              await login({ identifier, password })
              navigate(from, { replace: true })
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Ошибка входа')
            } finally {
              setLoading(false)
            }
          }}
        >
          <label className="field">
            <div className="field__label">Email / телефон</div>
            <input
              className="input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              placeholder="login@example.com"
            />
          </label>

          <label className="field">
            <div className="field__label">Пароль</div>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Минимум 6 символов"
            />
          </label>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn" type="submit" disabled={!canSubmit}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}

