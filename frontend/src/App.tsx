import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ProtectedRoute } from '@/components/router/ProtectedRoute'
import { PublicRoute } from '@/components/router/PublicRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MainPage } from '@/pages/MainPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { ProfilePage } from '@/pages/ProfilePage'

export const App = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
