import { Link } from 'react-router-dom'
import { ArrowLeft, Construction, Shapes, UserRound } from 'lucide-react'

export const ComingSoon = ({ section }: { section: 'categories' | 'profile' }) => {
  const categories = section === 'categories'
  const Icon = categories ? Shapes : UserRound
  const title = categories ? 'Категории' : 'Профиль'
  return (
    <main className="coming-soon flex flex-1 flex-col gap-6">
      <div><h1 className="an-title1">{title}</h1><p className="an-caption mt-1">{categories ? 'Управление категориями доходов и расходов' : 'Личные данные и настройки аккаунта'}</p></div>
      <section className="an-card flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="relative mb-7 rounded-2xl bg-[var(--an-chip)] p-5 text-[var(--an-chip-border)]">
          <Icon size={36} strokeWidth={1.5} />
          <Construction size={20} className="absolute -bottom-1 -right-1 rounded bg-[var(--an-card)]" />
        </div>
        <span className="an-caption rounded-full bg-[var(--an-inset)] px-3 py-1">В разработке</span>
        <h2 className="mt-4 text-xl text-[var(--an-text)]">Пока ещё не реализовано</h2>
        <p className="an-caption mt-3 max-w-sm leading-6">{categories ? 'Здесь можно будет создавать и настраивать категории для ваших операций.' : 'Здесь появятся настройки профиля и управление аккаунтом.'}</p>
        <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--an-chip)] px-4 py-3 text-xs text-[var(--an-chip-border)] hover:opacity-80"><ArrowLeft size={14} />На главную</Link>
      </section>
    </main>
  )
}
