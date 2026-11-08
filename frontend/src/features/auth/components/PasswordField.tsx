import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  describedBy?: string
}

export const PasswordField = ({ id, value, onChange, autoComplete, describedBy }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input id={id} className="auth-input auth-password" type={visible ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete} aria-describedby={describedBy} placeholder={autoComplete === 'new-password' ? 'Придумайте пароль' : 'Введите пароль'} required />
      <button type="button" className="auth-password-toggle" onClick={() => setVisible(v => !v)} aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'} aria-pressed={visible}>
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}
