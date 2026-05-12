import { clamp01, toFiniteNumber } from '../utils'

export type NormalizationRange = {
  min: number
  max: number
}

export const NORMALIZATION_RANGES = {
  molecularWeight: { min: 50, max: 400 },
  xlogp: { min: -2, max: 8 },
  tpsa: { min: 0, max: 150 },
  rotatableBonds: { min: 0, max: 15 },
  vaporPressureLog: { min: -6, max: 2 }
} as const satisfies Record<string, NormalizationRange>

export const normalize = (value: number, min: number, max: number): number => {
  if (max <= min) {
    throw new RangeError('Normalization max must be greater than min')
  }

  if (!Number.isFinite(value)) {
    return 0
  }

  return clamp01((value - min) / (max - min))
}

export const normalizeFinite = (
  value: unknown,
  range: NormalizationRange
): number | undefined => {
  const numericValue = toFiniteNumber(value)

  return numericValue === undefined
    ? undefined
    : normalize(numericValue, range.min, range.max)
}
