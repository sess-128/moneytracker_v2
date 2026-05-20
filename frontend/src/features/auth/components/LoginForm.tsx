import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ width: 300 }}>
      <h2 className="text-white text-2xl font-semibold mb-1">Войдите на платформу</h2>

      <div className="flex flex-col gap-1">
        <label className="text-white/45 text-xs">логин</label>
        <input
          className="auth-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-white/45 text-xs">пароль</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {isError && (
        <p className="text-red-400 text-sm">{extractErrorMessage(error)}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-gray-900 font-medium text-sm rounded-full py-2.5 mt-1
                   hover:bg-gray-100 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center"
      >
        {isPending ? 'Вход...' : 'Вход'}
      </button>

      <p className="text-white/45 text-sm text-center">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
          Регистрация
        </Link>
      </p>
    </form>
  )
}
