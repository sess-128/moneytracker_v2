interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  step?: number
}

export const AmountInput = ({ value, onChange, step = 1 }: AmountInputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
        Сумма
      </label>
      <input
        type="number"
        className="glass-input rounded-lg px-4 py-2.5 text-sm w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        min="0"
        step="0.01"
      />
    </div>
  )
}
