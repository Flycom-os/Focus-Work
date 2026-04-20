import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function CrmProfilePage() {
  const { accessToken } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        const me = await api.crm.profile.get(accessToken)
        setFullName(me.fullName ?? '')
        setEmail(me.email ?? '')
        setPhone(me.phone ?? '')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось загрузить профиль')
      }
    })()
  }, [accessToken])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setError(null)
    setStatus(null)
    if (password && password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    setIsSaving(true)
    try {
      await api.crm.profile.update(accessToken, {
        fullName,
        email,
        phone,
        ...(password ? { password } : {}),
      })
      setPassword('')
      setConfirmPassword('')
      setStatus('Профиль обновлен')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page__title">Профиль</div>
      <form className="crmPanel" onSubmit={onSubmit}>
        <div className="crmGrid crmGrid--4">
          <label className="field">
            <div className="field__label">Имя</div>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <label className="field">
            <div className="field__label">Фамилия</div>
            <input className="input" value="" readOnly />
          </label>
          <label className="field">
            <div className="field__label">Отчество</div>
            <input className="input" value="" readOnly />
          </label>
          <label className="field">
            <div className="field__label">Эл. почта</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <div className="field__label">Номер телефона</div>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="field">
            <div className="field__label">Пароль</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="field">
            <div className="field__label">Повторите пароль</div>
            <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>
        </div>
        {error ? <div className="alert alert--error">{error}</div> : null}
        {status ? <div className="alert">{status}</div> : null}
        <div className="crmActions">
          <button className="btn btn--ghost" type="button">
            Отменить
          </button>
          <button className="btn" type="submit" disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}
