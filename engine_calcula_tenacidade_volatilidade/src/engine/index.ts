import type { EngineOptions, EngineOutput, MaterialInput, NoteClassification } from '../types'
import { clamp01, toFiniteNumber } from '../utils'
import { calculateTenacity } from './tenacity'
import { calculateVolatility } from './volatility'

export const calculateMaterialScores = (
  input: MaterialInput,
  options?: EngineOptions
): EngineOutput => ({
  volatility_score: calculateVolatility(input, options?.volatilityWeights),
  tenacity_score: calculateTenacity(input, options?.tenacityWeights)
})

export const classifyNote = (volatilityScore: number): NoteClassification => {
  const finiteScore = toFiniteNumber(volatilityScore) ?? 0.5
  const score = clamp01(finiteScore)

  if (score > 0.7) {
    return 'TOP NOTE'
  }

  if (score >= 0.3) {
    return 'HEART'
  }

  return 'BASE'
}

export { calculateTenacity } from './tenacity'
export { calculateVolatility, normalizeVaporPressure } from './volatility'
export { NORMALIZATION_RANGES, normalize, normalizeFinite } from './normalization'
export {
  DEFAULT_TENACITY_WEIGHTS,
  DEFAULT_VOLATILITY_WEIGHTS,
  mergeWeights,
  weightedAverage
} from './weights'
export type {
  EngineOptions,
  EngineOutput,
  MaterialInput,
  NoteClassification,
  TenacityWeights,
  VolatilityWeights
} from '../types'
