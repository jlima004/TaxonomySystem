import type {
  FinalScoreDimensionKey,
  FinalScoreDimensions,
  FinalScoreWeights,
} from '../types/inference.js'

export const DEFAULT_SCORE_WEIGHTS: FinalScoreWeights = {
  semantic_overlap: 0.50,
  tradition: 0.25,
  accord_compatibility: 0.15,
  alias_evidence: 0.10,
}

const DIMENSION_KEYS: readonly FinalScoreDimensionKey[] = [
  'semantic_overlap',
  'tradition',
  'accord_compatibility',
  'alias_evidence',
]

const clampScore = (score: number): number => {
  if (!Number.isFinite(score)) return 0
  return Math.min(1, Math.max(0, score))
}

export const combineScores = (
  dimensions: FinalScoreDimensions,
  weights: FinalScoreWeights = DEFAULT_SCORE_WEIGHTS,
): number => {
  let weightedSum = 0
  let availableWeight = 0

  for (const key of DIMENSION_KEYS) {
    const score = dimensions[key]
    if (score === undefined) continue

    const weight = weights[key]
    weightedSum += clampScore(score) * weight
    availableWeight += weight
  }

  if (availableWeight === 0) {
    return 0
  }

  return weightedSum / availableWeight
}

export const shouldKeepEdge = (finalScore: number, threshold = 0.25): boolean => finalScore > threshold
