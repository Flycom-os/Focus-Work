import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../shared/api/api'
import { useAuth } from '../../app/providers/AuthProvider'

const EMPTY_FORM = {
  country: 'Россия',
  inn: '',
  currency: 'RUB',
  organizationType: '',
  name: '',
  address: '',
  bankName: '',
  bankLocation: '',
  bankBik: '',
  cardNumber: '',
  bankAccount: '',
  correspondentAccount: '',
  kpp: '',
  accountNumber: '',
  actNumber: '',
  stampUrl: '',
  signUrl: '',
  paymentMessage: '',
}

export function CrmCompanyFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    if (!accessToken || !id) return
    ;(async () => {
      try {
        const row = await api.crm.companies.get(accessToken, id)
        setForm({
          country: row.country || 'Россия',
          inn: row.inn || '',
          currency: row.currency || 'RUB',
          organizationType: row.organizationType || '',
          name: row.name || '',
          address: row.address || '',
          bankName: row.bankName || '',
          bankLocation: row.bankLocation || '',
          bankBik: row.bankBik || '',
          cardNumber: row.cardNumber || '',
          bankAccount: row.bankAccount || '',
          correspondentAccount: row.correspondentAccount || '',
          kpp: row.kpp || '',
          accountNumber: row.accountNumber || '',
          actNumber: row.actNumber || '',
          stampUrl: row.stampUrl || '',
          signUrl: row.signUrl || '',
          paymentMessage: row.paymentMessage || '',
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки компании')
      }
    })()
  }, [accessToken, id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setError(null)
    setIsSaving(true)
    try {
      if (isEdit && id) {
        await api.crm.companies.update(accessToken, id, form)
      } else {
        await api.crm.companies.create(accessToken, form)
      }
      navigate('/crm/companies')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="crmTitleRow">
        <div className="page__title">{isEdit ? 'Редактировать компанию' : 'Создать компанию'}</div>
        <Link className="btn btn--ghost" to="/crm/companies">
          Назад
        </Link>
      </div>
      <form className="crmPanel" onSubmit={onSubmit}>
        <div className="crmGrid crmGrid--3">
          <label className="field">
            <div className="field__label">Страна</div>
            <input className="input" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
          </label>
          <label className="field">
            <div className="field__label">ИНН</div>
            <input className="input" value={form.inn} onChange={(e) => setForm((p) => ({ ...p, inn: e.target.value }))} />
          </label>
          <label className="field">
            <div className="field__label">Валюта</div>
            <input className="input" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} />
          </label>
          <label className="field">
            <div className="field__label">Тип организации</div>
            <input className="input" value={form.organizationType} onChange={(e) => setForm((p) => ({ ...p, organizationType: e.target.value }))} />
          </label>
          <label className="field">
            <div className="field__label">Наименование</div>
            <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label className="field">
            <div className="field__label">Адрес</div>
            <input className="input" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </label>
        </div>

        <div className="crmSubTitle">Банковские реквизиты</div>
        <div className="crmGrid crmGrid--3">
          <label className="field"><div className="field__label">Наименование банка</div><input className="input" value={form.bankName} onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Расположение банка</div><input className="input" value={form.bankLocation} onChange={(e) => setForm((p) => ({ ...p, bankLocation: e.target.value }))} /></label>
          <label className="field"><div className="field__label">БИК банка</div><input className="input" value={form.bankBik} onChange={(e) => setForm((p) => ({ ...p, bankBik: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Номер банковской карты</div><input className="input" value={form.cardNumber} onChange={(e) => setForm((p) => ({ ...p, cardNumber: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Расчетный счет</div><input className="input" value={form.bankAccount} onChange={(e) => setForm((p) => ({ ...p, bankAccount: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Корреспондентский счет</div><input className="input" value={form.correspondentAccount} onChange={(e) => setForm((p) => ({ ...p, correspondentAccount: e.target.value }))} /></label>
          <label className="field"><div className="field__label">КПП</div><input className="input" value={form.kpp} onChange={(e) => setForm((p) => ({ ...p, kpp: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Номер начала счета</div><input className="input" value={form.accountNumber} onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))} /></label>
          <label className="field"><div className="field__label">Номер начала акта</div><input className="input" value={form.actNumber} onChange={(e) => setForm((p) => ({ ...p, actNumber: e.target.value }))} /></label>
        </div>
        <label className="field">
          <div className="field__label">Сообщение клиенту в телеграм бот по оплате</div>
          <textarea className="input crmTextarea" value={form.paymentMessage} onChange={(e) => setForm((p) => ({ ...p, paymentMessage: e.target.value }))} />
        </label>
        {error ? <div className="alert alert--error">{error}</div> : null}
        <div className="crmActions">
          <button className="btn btn--ghost" type="button" onClick={() => navigate('/crm/companies')}>
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
