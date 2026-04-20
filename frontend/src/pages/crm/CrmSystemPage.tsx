import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type CrmSystemSettings } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

const MENU_ITEMS = ['Главная', 'Календарь', 'Склад', 'FBS', 'Центр заявок', 'Клиенты', 'Документы', 'Сотрудники', 'CRM', 'DBS']

export function CrmSystemPage() {
  const { accessToken } = useAuth()
  const [form, setForm] = useState<CrmSystemSettings | null>(null)
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
        const data = await api.crm.system.get(accessToken)
        setForm(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки настроек')
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
      const next = await api.crm.system.update(accessToken, form)
      setForm(next)
      setStatus('Настройки сохранены')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  if (!form) return <div className="page"><div className="card">Загрузка...</div></div>

  return (
    <div className="page">
      <div className="crmTitleRow">
        <div className="page__title">Настройки системы</div>
        <div className="crmActions">
          <Link className="btn btn--ghost" to="/crm">Назад</Link>
          <button className="btn" form="crmSystemForm" type="submit" disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      <form id="crmSystemForm" className="crmPanel" onSubmit={onSubmit}>
        <div className="crmGrid crmGrid--3">
          <label className="field">
            <div className="field__label">Наименование программы</div>
            <input className="input" value={form.appName} onChange={(e) => setForm((p) => (p ? { ...p, appName: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">Срок аннулирования заявки</div>
            <input className="input" value={String(form.notifyAfterDays)} onChange={(e) => setForm((p) => (p ? { ...p, notifyAfterDays: Number(e.target.value) || 0 } : p))} />
          </label>
          <label className="field">
            <div className="field__label">Отправлять платежное поручение</div>
            <input className="input" value={form.autoSendInvoice} onChange={(e) => setForm((p) => (p ? { ...p, autoSendInvoice: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">Цвет программы</div>
            <input className="input" value={form.appColor} onChange={(e) => setForm((p) => (p ? { ...p, appColor: e.target.value } : p))} />
          </label>
          <label className="field crmColSpan2">
            <div className="field__label">Токен Telegram бота</div>
            <input className="input" value={form.telegramToken} onChange={(e) => setForm((p) => (p ? { ...p, telegramToken: e.target.value } : p))} />
          </label>
        </div>

        <div className="crmSubTitle">Настройки почтового сервера</div>
        <div className="crmGrid crmGrid--5">
          <label className="field">
            <div className="field__label">SMTP Хост</div>
            <input className="input" value={form.smtpHost} onChange={(e) => setForm((p) => (p ? { ...p, smtpHost: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">SMTP Порт</div>
            <input className="input" value={form.smtpPort} onChange={(e) => setForm((p) => (p ? { ...p, smtpPort: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">IMAP Хост</div>
            <input className="input" value={form.imapHost} onChange={(e) => setForm((p) => (p ? { ...p, imapHost: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">IMAP Порт</div>
            <input className="input" value={form.imapPort} onChange={(e) => setForm((p) => (p ? { ...p, imapPort: e.target.value } : p))} />
          </label>
          <label className="field">
            <div className="field__label">Имя пользователя</div>
            <input className="input" value={form.smtpUser} onChange={(e) => setForm((p) => (p ? { ...p, smtpUser: e.target.value } : p))} />
          </label>
        </div>

        <div className="crmSubTitle">Настройка меню</div>
        <div className="crmMenuToggles">
          {MENU_ITEMS.map((item) => {
            const checked = form.menuMap[item] ?? true
            return (
              <label key={item} className="crmToggle">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setForm((p) =>
                      p
                        ? {
                            ...p,
                            menuMap: { ...p.menuMap, [item]: e.target.checked },
                          }
                        : p,
                    )
                  }
                />
                <span>{item}</span>
              </label>
            )
          })}
        </div>

        {error ? <div className="alert alert--error">{error}</div> : null}
        {status ? <div className="alert">{status}</div> : null}
      </form>
    </div>
  )
}
