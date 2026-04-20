import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type TrackerTimesheet } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function TrackerTimesheetsPage() {
  const { accessToken } = useAuth()
  const [data, setData] = useState<TrackerTimesheet | null>(null)
  const [day, setDay] = useState('')
  const [hours, setHours] = useState('0')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        setData(await api.tracker.timesheet.get(accessToken))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки таймшита')
      }
    })()
  }, [accessToken])

  return (
    <div className="page trackerPage">
      <div className="trackerTopNav">
        <div className="trackerBreadcrumb">Timesheets</div>
        <Link to="/tracker" className="btn btn--ghost">
          Назад
        </Link>
      </div>
      {!data ? (
        <div className="card">Загрузка...</div>
      ) : (
        <div className="trackerTimesheet">
          <div className="trackerTimesheet__header">
            <h2>{data.weekTitle}</h2>
            <div>Spent time {data.spentTime}</div>
          </div>
          <div className="trackerCreate">
            <select className="input" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Выбери день</option>
              {data.days.map((d) => (
                <option key={d.day} value={d.day}>
                  {d.day}
                </option>
              ))}
            </select>
            <input className="input" type="number" min={0} max={24} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} />
            <button
              className="btn"
              type="button"
              disabled={isSaving}
              onClick={async () => {
                if (!accessToken) return
                if (!day) {
                  setError('Выбери день')
                  return
                }
                setError(null)
                setIsSaving(true)
                try {
                  const next = await api.tracker.timesheet.addEntry(accessToken, { day, hours: Number(hours) || 0 })
                  setData(next)
                  setHours('0')
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Ошибка сохранения часов')
                } finally {
                  setIsSaving(false)
                }
              }}
            >
              {isSaving ? 'Сохранение...' : 'Записать часы'}
            </button>
          </div>
          <div className="trackerDays">
            {data.days.map((day) => (
              <div key={day.day} className="trackerDay">
                <div>{day.day}</div>
                <div>{day.hours}h of 8h</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  )
}
