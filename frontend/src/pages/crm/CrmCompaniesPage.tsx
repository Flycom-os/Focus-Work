import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, type CrmCompany } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function CrmCompaniesPage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<CrmCompany[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        setItems(await api.crm.companies.list(accessToken))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки компаний')
      }
    })()
  }, [accessToken])

  return (
    <div className="page">
      <div className="crmTitleRow">
        <div className="page__title">Мои компании</div>
        <div className="crmActions">
          <Link className="btn btn--ghost" to="/crm">
            Назад
          </Link>
          <button className="btn" onClick={() => navigate('/crm/companies/new')}>
            Создать
          </button>
        </div>
      </div>

      <div className="crmPanel">
        <div className="crmTable">
          <div className="crmTable__head">
            <div>Название</div>
            <div>Страна</div>
            <div />
          </div>
          {items.map((item) => (
            <div key={item.id} className="crmTable__row">
              <div>{item.name}</div>
              <div>{item.country || 'Россия'}</div>
              <div>
                <button className="btn btn--ghost" onClick={() => navigate(`/crm/companies/${item.id}`)}>
                  Открыть
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 ? <div className="crmEmpty">В таблице отсутствуют данные</div> : null}
        </div>
      </div>
      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  )
}
