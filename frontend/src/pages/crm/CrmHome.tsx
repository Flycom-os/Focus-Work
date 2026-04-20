import { useEffect } from 'react'

export function CrmHome() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page">
      <div className="page__title">CRM</div>
      <div className="grid">
        <div className="card">
          <div className="card__title">Клиенты</div>
          <div className="muted">Прототип: таблица/фильтры/карточка.</div>
        </div>
        <div className="card">
          <div className="card__title">Сделки</div>
          <div className="muted">Прототип: канбан/статусы.</div>
        </div>
        <div className="card">
          <div className="card__title">Отчёты</div>
          <div className="muted">Прототип: KPI/аналитика.</div>
        </div>
      </div>
    </div>
  )
}

