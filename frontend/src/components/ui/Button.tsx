import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'glass' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-white text-gray-900 hover:bg-gray-100 font-medium',
  glass: 'glass-btn text-white',
  ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/8 border border-white/10',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = ({
  children,
  variant = 'glass',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    disabled={disabled}
    className={`
      flex items-center justify-center rounded-full
      transition-all duration-200 cursor-pointer select-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
    {...rest}
  >
    {children}
  </button>
)
