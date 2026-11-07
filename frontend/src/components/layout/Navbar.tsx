import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { Avatar } from '@/components/ui/Avatar'

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Аналитика', path: '/analytics' },
  { label: 'Категория', path: '/categories' },
  { label: 'Профиль', path: '/profile' },
]

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountTrigger = useRef<HTMLButtonElement>(null)
  const accountMenuId = useId()

  useEffect(() => {
    if (!accountOpen) return
    accountRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const closeOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setAccountOpen(false)
      accountTrigger.current?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  const handleMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') { setAccountOpen(false); return }
    const items = Array.from(accountRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const index = items.findIndex(item => item === document.activeElement)
    let next: number
    if (event.key === 'ArrowDown') next = (index + 1) % items.length
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    items[next]?.focus()
  }

  const handleLogout = () => {
    setAccountOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex items-center justify-between px-2 py-1 flex-shrink-0">
      <h1 className="text-gray-900 dark:text-white text-base font-normal tracking-tight">
        Добро пожаловать,{' '}
        <span className="text-purple-500 dark:text-purple-300 font-medium">{user?.login ?? '...'}</span>
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
                  ? 'bg-gray-900/8 dark:bg-white/15 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-500 dark:text-white/55 hover:text-gray-800 dark:hover:text-white/90 hover:bg-gray-900/5 dark:hover:bg-white/8'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          className="w-9 h-9 rounded-full glass-btn flex items-center justify-center text-gray-500 dark:text-white/55 hover:text-gray-800 dark:hover:text-white/90 transition-colors"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div ref={accountRef} className="relative" onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAccountOpen(false)
        }}>
          <button
            ref={accountTrigger}
            type="button"
            onClick={() => setAccountOpen(open => !open)}
            title="Меню аккаунта"
            aria-label="Меню аккаунта"
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            aria-controls={accountOpen ? accountMenuId : undefined}
            className="rounded-full ring-2 ring-gray-900/15 dark:ring-white/15 hover:ring-purple-400/50 transition-all duration-200"
          >
            <Avatar username={user?.login ?? '?'} size={40} />
          </button>
          {accountOpen && (
            <div
              id={accountMenuId}
              role="menu"
              aria-label="Аккаунт"
              onKeyDown={handleMenuKey}
              className="absolute right-0 z-50 mt-2 w-44 rounded-xl border p-1 shadow-xl"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <NavLink
                to="/profile"
                role="menuitem"
                tabIndex={-1}
                onClick={() => setAccountOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-white hover:bg-gray-900/5 dark:hover:bg-white/10 focus:bg-gray-900/5 dark:focus:bg-white/10"
              >Профиль</NavLink>
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
              >Выйти</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
