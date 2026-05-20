import { motion } from 'framer-motion'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const RegisterPage = () => (
  <div className="h-screen flex overflow-hidden" style={{ background: '#0a0a0f' }}>
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ width: '58%' }}
      className="flex-shrink-0 h-full"
    >
      <img src="/wallpaper.png" alt="" className="w-full h-full object-cover block" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
      className="flex-1 flex items-center justify-center"
    >
      <RegisterForm />
    </motion.div>
  </div>
)
