import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type TrackerProfile } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function TrackerProfilePage() {
  const { accessToken } = useAuth()
  const [form, setForm] = useState<TrackerProfile | null>(null)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        setForm(await api.tracker.profile.get(accessToken))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки профиля')
      }
    })()
  }, [accessToken])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!accessToken || !form) return
    setError(null)
    setStatus(null)
    setIsSaving(true)
    try {
      const updated = await api.tracker.profile.update(accessToken, {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        ...(password ? { password } : {}),
      })
      setForm(updated)
      setPassword('')
      setStatus('Профиль сохранен')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  if (!form) return <div className="page trackerPage"><div className="card">Загрузка...</div></div>

  return (
    <div className="page trackerPage">
      <div className="trackerTopNav">
        <div className="trackerBreadcrumb">Users / {form.username}</div>
        <Link to="/tracker" className="btn btn--ghost">
          Назад
        </Link>
      </div>
      <form className="trackerProfile" onSubmit={onSubmit}>
        <label className="field"><div className="field__label">Full name</div><input className="input" value={form.fullName} onChange={(e) => setForm((p) => (p ? { ...p, fullName: e.target.value } : p))} /></label>
        <label className="field"><div className="field__label">Username</div><input className="input" value={form.username} onChange={(e) => setForm((p) => (p ? { ...p, username: e.target.value } : p))} /></label>
        <label className="field"><div className="field__label">Email</div><input className="input" value={form.email} onChange={(e) => setForm((p) => (p ? { ...p, email: e.target.value } : p))} /></label>
        <label className="field"><div className="field__label">New password</div><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <div className="trackerProfile__meta">
          <div>Registration date: {new Date(form.createdAt).toLocaleDateString()}</div>
          <div>Timezone: {form.timezone}</div>
          <div>Language: {form.language}</div>
          <div>Date format: {form.dateFormat}</div>
        </div>
        <button className="btn" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </form>
      {error ? <div className="alert alert--error">{error}</div> : null}
      {status ? <div className="alert">{status}</div> : null}
    </div>
  )
}
