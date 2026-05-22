import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/router/ProtectedRoute'
import { PublicRoute } from '@/components/router/PublicRoute'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MainPage } from '@/pages/MainPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { ProfilePage } from '@/pages/ProfilePage'

export const App = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
