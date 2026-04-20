import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type TrackerAssignee, type TrackerIssue } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

export function TrackerIssuesPage() {
  const { accessToken } = useAuth()
  const [items, setItems] = useState<TrackerIssue[]>([])
  const [selected, setSelected] = useState<TrackerIssue | null>(null)
  const [query, setQuery] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newAssigneeId, setNewAssigneeId] = useState('')
  const [assignees, setAssignees] = useState<TrackerAssignee[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  async function load(search?: string) {
    if (!accessToken) return
    try {
      setItems(await api.tracker.issues.list(accessToken, search))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки issues')
    }
  }

  useEffect(() => {
    void load()
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    ;(async () => {
      try {
        setAssignees(await api.tracker.assignees.list(accessToken))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки исполнителей')
      }
    })()
  }, [accessToken])

  async function onSearchSubmit(e: FormEvent) {
    e.preventDefault()
    void load(query)
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    if (!newSummary.trim()) {
      setError('Введите название задачи перед созданием')
      return
    }
    setIsCreating(true)
    setError(null)
    try {
      const created = await api.tracker.issues.create(accessToken, {
        summary: newSummary.trim(),
        project: 'WHS',
        ...(newAssigneeId ? { assigneeId: newAssigneeId } : {}),
      })
      setNewSummary('')
      setNewAssigneeId('')
      await load(query)
      setSelected(created)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка создания issue')
    } finally {
      setIsCreating(false)
    }
  }

  async function onSaveIssue() {
    if (!accessToken || !selected) return
    setIsSaving(true)
    setError(null)
    try {
      const updated = await api.tracker.issues.update(accessToken, selected.id, {
        summary: selected.summary,
        type: selected.type,
        priority: selected.priority,
        state: selected.state,
        assigneeId: selected.assigneeId ?? undefined,
        subsystem: selected.subsystem,
        project: selected.project,
      })
      setSelected(updated)
      await load(query)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения задачи')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page trackerPage">
      <div className="trackerTopNav">
        <div className="trackerBreadcrumb">Issues</div>
        <Link to="/tracker" className="btn btn--ghost">
          Назад
        </Link>
      </div>

      <form className="trackerSearch" onSubmit={onSearchSubmit}>
        <input className="input" placeholder="Enter search request" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn--ghost" type="submit">
          Search
        </button>
      </form>

      <form className="trackerCreate" onSubmit={onCreate}>
        <input className="input" placeholder="Summary" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} />
        <select className="input" value={newAssigneeId} onChange={(e) => setNewAssigneeId(e.target.value)}>
          <option value="">Unassigned</option>
          {assignees.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <button className="btn" type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'New issue'}
        </button>
      </form>

      <div className="trackerIssuesLayout">
        <div className="trackerTable">
          <div className="trackerTable__head">
            <div>Issue</div>
            <div>Type</div>
            <div>State</div>
            <div>Assignee</div>
            <div>Subsystem</div>
            <div>Updated</div>
          </div>
          {items.map((item) => (
            <button className="trackerTable__row trackerTable__rowBtn" key={item.id} onClick={() => setSelected(item)} type="button">
              <div>
                <strong>{item.key}</strong> {item.summary}
              </div>
              <div>{item.type}</div>
              <div>{item.state}</div>
              <div>{item.assignee}</div>
              <div>{item.subsystem}</div>
              <div>{item.updatedAt}</div>
            </button>
          ))}
        </div>
        <div className="trackerIssueEditor">
          {!selected ? (
            <div className="muted">Выбери задачу из списка для редактирования</div>
          ) : (
            <>
              <div className="card__title">{selected.key}</div>
              <label className="field">
                <div className="field__label">Summary</div>
                <input className="input" value={selected.summary} onChange={(e) => setSelected((p) => (p ? { ...p, summary: e.target.value } : p))} />
              </label>
              <label className="field">
                <div className="field__label">Type</div>
                <input className="input" value={selected.type} onChange={(e) => setSelected((p) => (p ? { ...p, type: e.target.value } : p))} />
              </label>
              <label className="field">
                <div className="field__label">State</div>
                <input className="input" value={selected.state} onChange={(e) => setSelected((p) => (p ? { ...p, state: e.target.value } : p))} />
              </label>
              <label className="field">
                <div className="field__label">Assignee</div>
                <select
                  className="input"
                  value={selected.assigneeId ?? ''}
                  onChange={(e) => {
                    const assignee = assignees.find((a) => a.id === e.target.value)
                    setSelected((p) =>
                      p
                        ? {
                            ...p,
                            assigneeId: e.target.value || null,
                            assignee: assignee?.name ?? 'Unassigned',
                          }
                        : p,
                    )
                  }}
                >
                  <option value="">Unassigned</option>
                  {assignees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn" type="button" onClick={onSaveIssue} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save issue'}
              </button>
            </>
          )}
        </div>
      </div>
      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  )
}
