import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, type CrmWarehouse } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function CrmWarehousesPage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<CrmWarehouse[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        setItems(await api.crm.warehouses.list(accessToken))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки складов')
      }
    })()
  }, [accessToken])

  const filtered = useMemo(
    () => items.filter((x) => `${x.name} ${x.address} ${x.comment ?? ''}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  )

  return (
    <div className="page">
      <div className="crmTitleRow">
        <div className="page__title">Склады</div>
        <div className="crmActions">
          <Link className="btn btn--ghost" to="/crm">Назад</Link>
          <button className="btn" onClick={() => navigate('/crm/warehouses/new')}>Создать</button>
        </div>
      </div>

      <div className="crmPanel">
        <input className="input" placeholder="Поиск по названию" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="crmTable">
          <div className="crmTable__head">
            <div>Название</div>
            <div>Адрес</div>
            <div>Комментарий</div>
            <div />
          </div>
          {filtered.map((item) => (
            <div key={item.id} className="crmTable__row">
              <div>{item.name}</div>
              <div>{item.address}</div>
              <div>{item.comment || '-'}</div>
              <div>
                <button className="btn btn--ghost" onClick={() => navigate(`/crm/warehouses/${item.id}`)}>
                  Редактировать
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? <div className="crmEmpty">В таблице отсутствуют данные</div> : null}
        </div>
      </div>
      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  )
}
