interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  step?: number
}

export const AmountInput = ({ value, onChange, step = 1 }: AmountInputProps) => {
  const adjust = (delta: number) => {
    const cents = Math.round((parseFloat(value) || 0) * 100)
    const next = Math.max(0, cents + Math.round(delta * 100))
    const result = next / 100
    onChange(result % 1 === 0 ? String(result) : result.toFixed(2))
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
        Сумма
      </label>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => adjust(-step)}
          className="glass-btn rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0 text-white/60 hover:text-white transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          type="number"
          className="glass-input rounded-lg px-3 py-2.5 text-sm w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          className="glass-btn rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0 text-white/60 hover:text-white transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
