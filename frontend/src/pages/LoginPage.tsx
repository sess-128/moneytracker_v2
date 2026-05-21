import { motion } from 'framer-motion'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const LoginPage = () => (
  <div className="h-screen flex overflow-hidden" style={{ background: '#0c0c14' }}>
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '52%', background: 'linear-gradient(160deg, #1a1030 0%, #0f0a1e 50%, #12101e 100%)' }}
      className="flex-shrink-0 h-full flex flex-col justify-end p-12 border-r border-white/5"
    >
      <p className="text-white text-3xl font-semibold tracking-tight leading-snug">
        Контролируй расходы.<br />
        <span className="text-purple-400">Управляй бюджетом.</span>
      </p>
      <p className="text-white/35 text-sm mt-3">Money Tracker — личные финансы под контролем.</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
      className="flex-1 flex items-center justify-center"
    >
      <LoginForm />
    </motion.div>
  </div>
)
