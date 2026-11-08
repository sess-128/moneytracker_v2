import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { Navbar } from '@/components/layout/Navbar'

export const AppShell = () => {
  const location = useLocation()
  useCurrentUser()

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: 'var(--an-bg)', transition: 'background 0.2s ease' }}>
      <div className="app-container flex flex-col h-full mx-auto w-full" style={{ maxWidth: 1480 }}>
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="app-content flex-1 min-h-0 flex flex-col overflow-y-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
