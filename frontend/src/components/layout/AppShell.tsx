import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'

export const AppShell = () => {
  const location = useLocation()

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: '#0c0c14' }}>
      <div className="flex flex-col h-full mx-auto w-full px-6 py-4 gap-3" style={{ maxWidth: 1480 }}>
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="flex-1 min-h-0 flex flex-col"
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
