import { useEffect } from 'react'

export function TrackerHome() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page">
      <div className="page__title">Tracker</div>
      <div className="grid">
        <div className="card">
          <div className="card__title">Сегодня</div>
          <div className="muted">Прототип: список задач/тайм-трекинг.</div>
        </div>
        <div className="card">
          <div className="card__title">Фокус-сессии</div>
          <div className="muted">Прототип: старт/пауза/история.</div>
        </div>
        <div className="card">
          <div className="card__title">Статистика</div>
          <div className="muted">Прототип: графики/метрики.</div>
        </div>
      </div>
    </div>
  )
}

