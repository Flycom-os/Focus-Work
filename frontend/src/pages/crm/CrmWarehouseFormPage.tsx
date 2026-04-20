import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function CrmWarehouseFormPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const isEdit = Boolean(id)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken || !isEdit) return
    ;(async () => {
      try {
        const rows = await api.crm.warehouses.list(accessToken)
        const row = rows.find((x) => x.id === id)
        if (row) {
          setName(row.name)
          setAddress(row.address)
          setComment(row.comment ?? '')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки склада')
      }
    })()
  }, [accessToken, id, isEdit])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setError(null)
    setIsSaving(true)
    try {
      if (isEdit && id) {
        await api.crm.warehouses.update(accessToken, id, { name, address, comment })
      } else {
        await api.crm.warehouses.create(accessToken, { name, address, comment })
      }
      navigate('/crm/warehouses')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="crmTitleRow">
        <div className="page__title">{isEdit ? 'Редактировать склад' : 'Создать склад'}</div>
        <Link className="btn btn--ghost" to="/crm/warehouses">
          Назад
        </Link>
      </div>

      <form className="crmPanel" onSubmit={onSubmit}>
        <div className="crmGrid crmGrid--2">
          <label className="field">
            <div className="field__label">Наименование</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="field">
            <div className="field__label">Адрес</div>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
        </div>
        <label className="field">
          <div className="field__label">Комментарий</div>
          <textarea className="input crmTextarea" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        {error ? <div className="alert alert--error">{error}</div> : null}
        <div className="crmActions">
          <button className="btn btn--ghost" type="button" onClick={() => navigate('/crm/warehouses')}>
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
