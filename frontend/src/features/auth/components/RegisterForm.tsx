import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowRight, LoaderCircle, UserRoundPlus } from 'lucide-react'
import { PasswordField } from './PasswordField'
import { useRegister } from '../hooks/useAuth'

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data?.message) return data.message
    if (error.response?.status === 400) return 'Проверьте правильность данных'
    if (error.response?.status === 409) return 'Пользователь с таким логином или почтой уже существует'
  }
  return 'Ошибка регистрации. Попробуйте снова.'
}

export const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: register, isPending, isError, error } = useRegister()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    register({ email, username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-form-heading">
        <span className="auth-form-icon"><UserRoundPlus size={22} strokeWidth={1.6} /></span>
        <h2>Создайте аккаунт</h2>
        <p>Начните вести бюджет и видеть больше за цифрами.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="RegisterForm-email">Почта</label>
        <input
          className="auth-input"
          type="email"
          id="RegisterForm-email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="RegisterForm-username">Логин</label>
        <input
          className="auth-input"
          type="text"
          id="RegisterForm-username"
          placeholder="Введите логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="RegisterForm-password">Пароль</label>
        <PasswordField id="RegisterForm-password" value={password} onChange={setPassword} autoComplete="new-password" describedBy="password-hint" />
        <p id="password-hint" className="auth-password-hint">
          Мин. 8 символов: A–Z, a–z, 0–9, спецсимвол (#?!@$%^&*-)
        </p>
      </div>

      {isError && (
        <p role="alert" className="auth-error">{extractErrorMessage(error)}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="auth-submit"
        aria-busy={isPending}
      >
        {isPending ? <><LoaderCircle size={16} className="animate-spin" />Создаём аккаунт…</> : <>Создать аккаунт<ArrowRight size={16} /></>}
      </button>

      <p className="auth-switch">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="auth-link">
          Войти
        </Link>
      </p>
    </form>
  )
}
