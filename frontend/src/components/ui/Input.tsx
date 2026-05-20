import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'glass' | 'auth'
}

export const Input = ({ label, error, variant = 'glass', className = '', ...rest }: InputProps) => (
  <div className="flex flex-col gap-1 w-full">
    {label && (
      <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
        {label}
      </label>
    )}
    <input
      className={`
        ${variant === 'auth' ? 'auth-input' : 'glass-input rounded-lg px-4 py-2.5 text-sm w-full'}
        ${error ? 'border-red-500/60' : ''}
        ${className}
      `}
      {...rest}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
)
