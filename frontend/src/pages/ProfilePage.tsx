import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAuthStore } from '@/store/authStore'

const BG_STYLE: React.CSSProperties = {
  background: 'linear-gradient(140deg, #100620 0%, #1c0b34 35%, #0e0519 65%, #160828 100%)',
}

const ORB_STYLE: React.CSSProperties = {
  background:
    'radial-gradient(ellipse 65% 55% at 18% 18%, rgba(130, 50, 240, 0.38) 0%, transparent 70%),' +
    'radial-gradient(ellipse 50% 45% at 80% 75%, rgba(100, 30, 200, 0.28) 0%, transparent 65%)',
}

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <motion.div
      className="h-screen overflow-hidden flex flex-col"
      style={{ backgroundImage: 'url(/wallpaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(4,2,12,0.55)' }} />
      <div className="relative z-10 flex flex-col h-full p-4 gap-3">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <GlassCard padding="lg" className="flex flex-col items-center gap-4">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-400/30"
            />
            <div className="text-center">
              <p className="text-white text-xl font-semibold">{user?.login ?? '—'}</p>
              <p className="text-white/40 text-sm mt-1">ID: {user?.id ?? '—'}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  )
}
