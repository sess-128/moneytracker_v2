/** Шкала включает ноль и отрицательные значения снятий и баланса. */
export const chartScale = (min: number, max: number) => {
  const lower = Math.min(0, min)
  const upper = Math.max(0, max)
  const span = upper - lower
  if (span === 0) return { bottom: 0, top: 5, step: 1 }
  const raw = span / 5
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 3, 5, 10].map(m => m * magnitude).find(s => s >= raw) ?? 10 * magnitude
  return {
    bottom: Math.floor(lower / step) * step,
    top: Math.ceil(upper / step) * step,
    step,
  }
}
