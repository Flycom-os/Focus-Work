import { useEffect } from 'react'

export function MiroHome() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'miro')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page">
      <div className="page__title">Miro</div>
      <div className="grid">
        <div className="card">
          <div className="card__title">Доски</div>
          <div className="muted">Прототип: список досок/недавние.</div>
        </div>
        <div className="card">
          <div className="card__title">Mind map</div>
          <div className="muted">Прототип: базовая сцена + элементы.</div>
        </div>
        <div className="card">
          <div className="card__title">Экспорт</div>
          <div className="muted">Прототип: png/pdf.</div>
        </div>
      </div>
    </div>
  )
}

