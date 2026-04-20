import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Header } from '../../shared/ui/Header'
import { useAuth } from '../providers/AuthProvider'

export function AuthedLayout() {
  const { isReady, user } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="page page--center">
        <div className="card">Загрузка…</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="appShell">
      <Header />
      <main className="appMain">
        <Outlet />
      </main>
    </div>
  )
}

