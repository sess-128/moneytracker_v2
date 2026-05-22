import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export const PageLayout = ({ children }: PageLayoutProps) => (
  <motion.div
    className="h-screen overflow-hidden flex flex-col"
    style={{ background: '#0c0c14' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    <div className="flex flex-col h-full mx-auto w-full px-6 py-4 gap-3" style={{ maxWidth: 1480 }}>
      {children}
    </div>
  </motion.div>
)
