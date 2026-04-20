import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { AuthedLayout } from './layouts/AuthedLayout'
import { LoginPage } from '../pages/login/LoginPage'
import { TrackerHome } from '../pages/tracker/TrackerHome'
import { CrmHome } from '../pages/crm/CrmHome'
import { CrmProfilePage } from '../pages/crm/CrmProfilePage'
import { CrmSystemPage } from '../pages/crm/CrmSystemPage'
import { CrmWarehousesPage } from '../pages/crm/CrmWarehousesPage'
import { CrmWarehouseFormPage } from '../pages/crm/CrmWarehouseFormPage'
import { CrmCompaniesPage } from '../pages/crm/CrmCompaniesPage'
import { CrmCompanyFormPage } from '../pages/crm/CrmCompanyFormPage'
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
          <Route path="/crm/profile" element={<CrmProfilePage />} />
          <Route path="/crm/system" element={<CrmSystemPage />} />
          <Route path="/crm/warehouses" element={<CrmWarehousesPage />} />
          <Route path="/crm/warehouses/new" element={<CrmWarehouseFormPage />} />
          <Route path="/crm/warehouses/:id" element={<CrmWarehouseFormPage />} />
          <Route path="/crm/companies" element={<CrmCompaniesPage />} />
          <Route path="/crm/companies/new" element={<CrmCompanyFormPage />} />
          <Route path="/crm/companies/:id" element={<CrmCompanyFormPage />} />
          <Route path="/miro" element={<MiroHome />} />
          <Route path="/miro/boards/:boardId" element={<MiroBoardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

