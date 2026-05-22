import { GlassCard } from '@/components/ui/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/authStore'

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard padding="lg" className="flex flex-col items-center gap-5">
        <Avatar username={user?.login ?? '?'} size={96} className="ring-4 ring-purple-500/30" />
        <div className="text-center">
          <p className="text-white text-xl font-semibold">{user?.login ?? '—'}</p>
          <p className="text-white/40 text-sm mt-1">ID: {user?.id ?? '—'}</p>
        </div>
      </GlassCard>
    </div>
  )
}
