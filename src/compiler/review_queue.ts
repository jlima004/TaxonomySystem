import type { ReviewQueueItem } from '../types/inference.js'

export type SeedGapCandidate = {
  readonly descriptor: string
  readonly corpus_count: number
  readonly reason: string
}

const severityRank = (severity: ReviewQueueItem['severity']): number => {
  if (severity === 'high') return 0
  if (severity === 'medium') return 1
  return 2
}

const stableEvidence = (evidence: Readonly<Record<string, unknown>>): string => JSON.stringify(evidence)

export const sortReviewQueue = (items: readonly ReviewQueueItem[]): ReviewQueueItem[] => {
  return [...items].sort((left, right) => {
    if (left.type !== right.type) return left.type.localeCompare(right.type)
    const leftSeverity = severityRank(left.severity)
    const rightSeverity = severityRank(right.severity)
    if (leftSeverity !== rightSeverity) return leftSeverity - rightSeverity
    const leftAffected = JSON.stringify(left.affected)
    const rightAffected = JSON.stringify(right.affected)
    if (leftAffected !== rightAffected) return leftAffected.localeCompare(rightAffected)
    return stableEvidence(left.evidence).localeCompare(stableEvidence(right.evidence))
  })
}

export const buildSeedGapReviewItems = (candidates: readonly SeedGapCandidate[]): ReviewQueueItem[] => {
  return candidates
    .filter(candidate => candidate.corpus_count >= 20 && candidate.descriptor.includes('generic'))
    .map(candidate => ({
      type: 'seed_taxonomy_gap_suggestion',
      severity: 'low',
      affected: {
        descriptor: candidate.descriptor,
      },
      evidence: {
        frequency: candidate.corpus_count,
        reason: candidate.reason,
      },
      suggested_action: 'review_seed_taxonomy_gap',
      source: 'corpus',
      reason: 'high_frequency_generic_candidate_failed_placement',
    }))
}
