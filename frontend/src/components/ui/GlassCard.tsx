import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap: Record<NonNullable<GlassCardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export const GlassCard = ({ children, className = '', padding = 'md' }: GlassCardProps) => (
  <div className={`dark-card rounded-2xl ${paddingMap[padding]} ${className}`}>
    {children}
  </div>
)
