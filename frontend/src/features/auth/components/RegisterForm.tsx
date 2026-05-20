import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ width: 300 }}>
      <h2 className="text-white text-2xl font-semibold mb-1">
        Зарегистрируйтесь на платформу
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-white/45 text-xs">почта</label>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

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
          autoComplete="new-password"
          required
        />
        <p className="text-white/30 text-[11px] mt-0.5">
          Мин. 8 символов: A–Z, a–z, 0–9, спецсимвол (#?!@$%^&*-)
        </p>
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
        {isPending ? 'Регистрация...' : 'Регистрация'}
      </button>

      <p className="text-white/45 text-sm text-center">
        Уже есть аккаунт? Тогда используйтесь{' '}
        <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
          Входом
        </Link>
      </p>
    </form>
  )
}
