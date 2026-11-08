import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowRight, LoaderCircle, LogIn } from 'lucide-react'
import { PasswordField } from './PasswordField'
import { useLogin } from '../hooks/useAuth'

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data?.message) return data.message
    if (error.response?.status === 401) return 'Неверный логин или пароль'
  }
  return 'Ошибка входа. Попробуйте снова.'
}

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, isError, error } = useLogin()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-form-heading">
        <span className="auth-form-icon"><LogIn size={22} strokeWidth={1.6} /></span>
        <h2>С возвращением</h2>
        <p>Войдите, чтобы продолжить управлять финансами.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="LoginForm-username">Логин</label>
        <input
          className="auth-input"
          type="text"
          id="LoginForm-username"
          placeholder="Введите логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="LoginForm-password">Пароль</label>
        <PasswordField id="LoginForm-password" value={password} onChange={setPassword} autoComplete="current-password" />
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
        {isPending ? <><LoaderCircle size={16} className="animate-spin" />Входим…</> : <>Войти<ArrowRight size={16} /></>}
      </button>

      <p className="auth-switch">
        Нет аккаунта?{' '}
        <Link to="/register" className="auth-link">
          Регистрация
        </Link>
      </p>
    </form>
  )
}
