import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function CrmHome() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crm')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page">
      <div className="page__title">Настройки CRM</div>
      <div className="crmTiles">
        <Link className="crmTile" to="/crm/system">
          <div className="crmTile__title">Настройки системы</div>
        </Link>
        <Link className="crmTile" to="/crm/warehouses">
          <div className="crmTile__title">Склады</div>
        </Link>
        <Link className="crmTile" to="/crm/companies">
          <div className="crmTile__title">Мои компании</div>
        </Link>
        <Link className="crmTile" to="/crm/profile">
          <div className="crmTile__title">Профиль</div>
        </Link>
      </div>
    </div>
  )
}

