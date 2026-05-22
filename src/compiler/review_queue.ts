import type { ReviewQueueItem } from '../types/inference.js'

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
