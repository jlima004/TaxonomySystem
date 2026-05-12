import type { MaterialInput, TenacityWeights } from '../types'
import { clamp01 } from '../utils'
import { NORMALIZATION_RANGES, normalizeFinite } from './normalization'
import { DEFAULT_TENACITY_WEIGHTS, mergeWeights, weightedAverage } from './weights'

export const calculateTenacity = (
  input: MaterialInput,
  customWeights?: Partial<TenacityWeights>
): number => {
  const weights = mergeWeights(DEFAULT_TENACITY_WEIGHTS, customWeights)
  const xlogpNorm = normalizeFinite(input.molecular?.xlogp, NORMALIZATION_RANGES.xlogp)
  const molecularWeightNorm = normalizeFinite(
    input.physchem?.molecular_weight,
    NORMALIZATION_RANGES.molecularWeight
  )
  const rotatableBondsNorm = normalizeFinite(
    input.molecular?.rotatable_bonds,
    NORMALIZATION_RANGES.rotatableBonds
  )
  const tpsaNorm = normalizeFinite(input.molecular?.tpsa, NORMALIZATION_RANGES.tpsa)
  const baseTenacity = weightedAverage([
    { value: xlogpNorm, weight: weights.xlogp },
    { value: molecularWeightNorm, weight: weights.molecularWeight },
    {
      value: rotatableBondsNorm === undefined ? undefined : 1 - rotatableBondsNorm,
      weight: weights.rotatableBonds
    }
  ])
  const tpsaPenalty = tpsaNorm === undefined ? 0 : weights.tpsaPenalty * tpsaNorm

  return clamp01(baseTenacity - tpsaPenalty)
}
