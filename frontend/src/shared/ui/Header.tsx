import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'

const links = [
  { to: '/tracker', label: 'Tracker', theme: 'tracker' },
  { to: '/crm', label: 'CRM', theme: 'crm' },
  { to: '/miro', label: 'Miro', theme: 'miro' },
  { to: '/wiki', label: 'Wiki', theme: 'tracker' },
] as const

export function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const activeTheme =
    links.find((l) => location.pathname.startsWith(l.to))?.theme ?? 'tracker'

  return (
    <header className="header" data-theme={activeTheme}>
      <div className="header__left">
        <NavLink to="/tracker" className="brand" aria-label="Focus Work">
          <img className="brand__logo" src="/logo.svg" alt="Focus Work" />
        </NavLink>
        <nav className="tabs">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'tab tab--active' : 'tab')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="header__right">
        <div className="userChip" title={user?.email ?? ''}>
          <div className="userChip__avatar" />
          <div className="userChip__name">{user?.fullName ?? 'Пользователь'}</div>
        </div>
        <button
          className="btn btn--ghost"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          Выйти
        </button>
      </div>
    </header>
  )
}

