import type { TenacityWeights, VolatilityWeights } from '../types'
import { clamp01, toFiniteNumber } from '../utils'

export const DEFAULT_VOLATILITY_WEIGHTS: VolatilityWeights = {
  vaporPressure: 0.5,
  molecularWeight: 0.3,
  xlogp: 0.2
}

export const DEFAULT_TENACITY_WEIGHTS: TenacityWeights = {
  xlogp: 0.4,
  molecularWeight: 0.4,
  rotatableBonds: 0.2,
  tpsaPenalty: 0.1
}

export type WeightedFeature = {
  value: number | undefined
  weight: number
}

const isUsableWeight = (value: unknown): value is number => {
  const numericValue = toFiniteNumber(value)

  return numericValue !== undefined && numericValue >= 0
}

export const mergeWeights = <T extends Record<string, number>>(
  defaults: T,
  customWeights?: Partial<T>
): T => {
  const mergedEntries = Object.entries(defaults).map(([key, defaultValue]) => {
    const customValue = customWeights?.[key]

    return [key, isUsableWeight(customValue) ? customValue : defaultValue] as const
  })

  return Object.fromEntries(mergedEntries) as T
}

export const weightedAverage = (
  features: readonly WeightedFeature[],
  fallback = 0.5
): number => {
  const usableFeatures = features.flatMap((feature) => {
    const value = toFiniteNumber(feature.value)

    return value !== undefined && isUsableWeight(feature.weight)
      ? [{ value, weight: feature.weight }]
      : []
  })
  const totalWeight = usableFeatures.reduce((sum, feature) => sum + feature.weight, 0)

  if (totalWeight <= 0) {
    return clamp01(fallback)
  }

  const weightedSum = usableFeatures.reduce(
    (sum, feature) => sum + feature.value * feature.weight,
    0
  )

  return clamp01(weightedSum / totalWeight)
}
