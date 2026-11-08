import type { ReactNode } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChartNoAxesCombined, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggle } = useThemeStore()

  return (
    <div className="auth-screen">
      <header className="auth-header">
        <div className="flex items-center gap-3">
          <span className="brand-mark"><ChartNoAxesCombined size={20} strokeWidth={1.7} /></span>
          <span className="text-sm tracking-tight">Money Tracker</span>
        </div>
        <button type="button" onClick={toggle} className="auth-theme" aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'} title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="auth-main">
        <section className="auth-story">
          <div className="auth-story-copy">
            <span className="auth-eyebrow"><span />Личные финансы под контролем</span>
            <h1>Больше ясности.<br /><span>Меньше лишних трат.</span></h1>
            <p>Все доходы, расходы и накопления в одном месте.<br className="hidden lg:block" /> Чтобы понимать, куда уходят деньги, и планировать дальше.</p>
          </div>

          <div className="auth-preview" aria-hidden="true">
            <div className="flex items-center justify-between gap-3">
              <div><p className="an-body">Финансовый обзор</p><p className="an-caption mt-1">Ваш бюджет — наглядно</p></div>
              <span className="auth-preview-chip">За месяц</span>
            </div>
            <div className="auth-preview-stats">
              <div><span className="an-caption">Доходы</span><p><span className="auth-stat-icon income"><ArrowDownLeft size={14} /></span>85 000 ₽</p></div>
              <div><span className="an-caption">Расходы</span><p><span className="auth-stat-icon expense"><ArrowUpRight size={14} /></span>32 450 ₽</p></div>
            </div>
            <div className="auth-preview-chart">
              <div className="auth-donut"><div><span>52 550 ₽</span><small>Осталось</small></div></div>
              <div className="auth-preview-legend">
                <p><span style={{ background: '#a778ee' }} />Покупки <small>45%</small></p>
                <p><span style={{ background: '#309a76' }} />Продукты <small>30%</small></p>
                <p><span style={{ background: '#3095af' }} />Транспорт <small>15%</small></p>
                <p><span style={{ background: '#e58a23' }} />Другое <small>10%</small></p>
              </div>
            </div>
            <div className="auth-preview-footer"><span className="auth-live-dot" />Пример финансового обзора</div>
          </div>
          <p className="auth-story-note">Замечайте привычки. Принимайте взвешенные решения.</p>
        </section>
        <section className="auth-form-area" aria-label="Доступ к аккаунту">{children}</section>
      </main>
      <footer className="auth-footer"><span>Money Tracker</span><span>Ваши финансы. Ваши решения.</span></footer>
    </div>
  )
}
