import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Аналитика', path: '/analytics' },
  { label: 'Категория', path: '/categories' },
  { label: 'Профиль', path: '/profile' },
]

export const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex items-center justify-between px-2 py-1 flex-shrink-0">
      <h1 className="text-white text-base font-normal tracking-tight">
        Добро пожаловать,{' '}
        <span className="text-purple-300 font-medium">{user?.login ?? '...'}</span>
      </h1>

      <nav className="glass-nav rounded-full px-1.5 py-1 flex items-center gap-0.5">
        {NAV_ITEMS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/55 hover:text-white/90 hover:bg-white/8'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        title="Выйти"
        className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/15 hover:ring-purple-400/50 transition-all duration-200 flex-shrink-0"
      >
        <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
      </button>
    </header>
  )
}
