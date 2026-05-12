import type { MaterialInput, VolatilityWeights } from '../types'
import { toFiniteNumber } from '../utils'
import { NORMALIZATION_RANGES, normalize, normalizeFinite } from './normalization'
import { DEFAULT_VOLATILITY_WEIGHTS, mergeWeights, weightedAverage } from './weights'

const VAPOR_PRESSURE_EPSILON = 1e-6

export const normalizeVaporPressure = (value: string | number | undefined): number | undefined => {
  const vaporPressure = toFiniteNumber(value)

  if (vaporPressure === undefined || vaporPressure < 0) {
    return undefined
  }

  const vaporPressureLog = Math.log10(vaporPressure + VAPOR_PRESSURE_EPSILON)

  return normalize(
    vaporPressureLog,
    NORMALIZATION_RANGES.vaporPressureLog.min,
    NORMALIZATION_RANGES.vaporPressureLog.max
  )
}

export const calculateVolatility = (
  input: MaterialInput,
  customWeights?: Partial<VolatilityWeights>
): number => {
  const weights = mergeWeights(DEFAULT_VOLATILITY_WEIGHTS, customWeights)
  const vaporPressureNorm = normalizeVaporPressure(input.physchem?.vapor_pressure)
  const molecularWeightNorm = normalizeFinite(
    input.physchem?.molecular_weight,
    NORMALIZATION_RANGES.molecularWeight
  )
  const xlogpNorm = normalizeFinite(input.molecular?.xlogp, NORMALIZATION_RANGES.xlogp)

  return weightedAverage([
    { value: vaporPressureNorm, weight: weights.vaporPressure },
    {
      value: molecularWeightNorm === undefined ? undefined : 1 - molecularWeightNorm,
      weight: weights.molecularWeight
    },
    { value: xlogpNorm === undefined ? undefined : 1 - xlogpNorm, weight: weights.xlogp }
  ])
}
