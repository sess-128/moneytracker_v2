const PALETTE = [
  '#6d28d9', '#7c3aed', '#5b21b6',
  '#2563eb', '#1d4ed8',
  '#0891b2', '#0e7490',
  '#059669', '#047857',
  '#d97706', '#b45309',
  '#db2777', '#be185d',
  '#dc2626', '#b91c1c',
]

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

interface AvatarProps {
  username: string
  size?: number
  className?: string
}

export const Avatar = ({ username, size = 40, className = '' }: AvatarProps) => {
  const color = PALETTE[hashStr(username || '?') % PALETTE.length]
  const initials = (username || '?').slice(0, 2).toUpperCase()

  return (
    <div
      className={`rounded-full flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.round(size * 0.38),
        color: '#fff',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      {initials}
    </div>
  )
}
