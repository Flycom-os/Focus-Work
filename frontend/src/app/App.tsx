import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { AuthedLayout } from './layouts/AuthedLayout'
import { LoginPage } from '../pages/login/LoginPage'
import { TrackerHome } from '../pages/tracker/TrackerHome'
import { CrmHome } from '../pages/crm/CrmHome'
import { MiroHome } from '../pages/miro/MiroHome'
import { MiroBoardPage } from '../pages/miro/MiroBoardPage'

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthedLayout />}>
          <Route path="/" element={<Navigate to="/tracker" replace />} />
          <Route path="/tracker" element={<TrackerHome />} />
          <Route path="/crm" element={<CrmHome />} />
          <Route path="/miro" element={<MiroHome />} />
          <Route path="/miro/boards/:boardId" element={<MiroBoardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

