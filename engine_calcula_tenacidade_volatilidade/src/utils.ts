export const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(1, Math.max(0, value))
}

export const toFiniteNumber = (value: unknown): number | undefined => {
  if (typeof value === 'string' && value.trim().length === 0) {
    return undefined
  }

  const numericValue = typeof value === 'string' ? Number(value.trim()) : value

  return typeof numericValue === 'number' && Number.isFinite(numericValue)
    ? numericValue
    : undefined
}
