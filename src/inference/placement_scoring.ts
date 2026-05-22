import type {
  CandidatePlacementDecision,
  CandidatePlacementEvidence,
  CandidatePlacementThresholds,
} from '../types/inference.js'

export const DEFAULT_PLACEMENT_THRESHOLDS: CandidatePlacementThresholds = {
  support: 3,
  normalized_support: 0.05,
  placement_score: 0.35,
}

const normalizeFrequency = (frequency: number): number => (frequency <= 0 ? 1 : frequency)

export const scoreCandidatePlacement = (
  candidate: string,
  subfamily: string,
  evidence: CandidatePlacementEvidence,
  options?: {
    readonly thresholds?: CandidatePlacementThresholds
  },
): CandidatePlacementDecision => {
  const thresholds = options?.thresholds ?? DEFAULT_PLACEMENT_THRESHOLDS
  const support = evidence.support
  const candidateFrequency = evidence.candidate_frequency
  const normalized_support = support / normalizeFrequency(candidateFrequency)
  const downweightValue = evidence.downweight_value ?? 1
  const noise_penalty = 1 - downweightValue
  const placement_score =
    0.6 * Math.min(1, support / 10)
    + 0.3 * Math.min(1, normalized_support / 0.2)
    - 0.1 * noise_penalty

  if (evidence.hardExcluded === true) {
    return {
      candidate,
      subfamily,
      pass: false,
      reason: 'hard_excluded_descriptor_blocked',
      support,
      candidate_frequency: candidateFrequency,
      normalized_support,
      placement_score,
      noise_penalty,
      thresholds,
    }
  }

  if (support < thresholds.support) {
    return {
      candidate,
      subfamily,
      pass: false,
      reason: 'support_below_threshold',
      support,
      candidate_frequency: candidateFrequency,
      normalized_support,
      placement_score,
      noise_penalty,
      thresholds,
    }
  }

  if (normalized_support < thresholds.normalized_support) {
    return {
      candidate,
      subfamily,
      pass: false,
      reason: 'normalized_support_below_threshold',
      support,
      candidate_frequency: candidateFrequency,
      normalized_support,
      placement_score,
      noise_penalty,
      thresholds,
    }
  }

  if (placement_score < thresholds.placement_score) {
    return {
      candidate,
      subfamily,
      pass: false,
      reason: 'placement_score_below_threshold',
      support,
      candidate_frequency: candidateFrequency,
      normalized_support,
      placement_score,
      noise_penalty,
      thresholds,
    }
  }

  return {
    candidate,
    subfamily,
    pass: true,
    reason: 'accepted',
    support,
    candidate_frequency: candidateFrequency,
    normalized_support,
    placement_score,
    noise_penalty,
    thresholds,
  }
}
