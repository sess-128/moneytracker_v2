import { motion } from 'framer-motion'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const RegisterPage = () => (
  <div className="auth-page h-screen flex overflow-hidden">
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '52%' }}
      className="auth-panel flex-shrink-0 h-full flex flex-col justify-end p-12 border-r"
    >
      <p className="text-gray-900 dark:text-white text-3xl font-semibold tracking-tight leading-snug">
        Начни отслеживать.<br />
        <span className="text-purple-500 dark:text-purple-400">Уже сегодня.</span>
      </p>
      <p className="text-gray-400 dark:text-white/35 text-sm mt-3">Money Tracker — личные финансы под контролем.</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
      className="flex-1 flex items-center justify-center"
    >
      <RegisterForm />
    </motion.div>
  </div>
)
