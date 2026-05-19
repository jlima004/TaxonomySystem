import type { AliasCandidate } from '../types/analysis.js'
import type { AliasEvidenceScore, DescriptorProfile } from '../types/inference.js'

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

const descriptorSet = (profiles: readonly DescriptorProfile[]): ReadonlySet<string> => {
  return new Set(profiles.map(profile => profile.descriptor))
}

export const computeAliasEvidence = (
  leftProfile: readonly DescriptorProfile[],
  rightProfile: readonly DescriptorProfile[],
  aliasCandidates: readonly AliasCandidate[],
): AliasEvidenceScore | undefined => {
  const leftDescriptors = descriptorSet(leftProfile)
  const rightDescriptors = descriptorSet(rightProfile)
  const matched = aliasCandidates
    .filter(candidate => {
      return (leftDescriptors.has(candidate.a) && rightDescriptors.has(candidate.b))
        || (leftDescriptors.has(candidate.b) && rightDescriptors.has(candidate.a))
    })
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score
      return `${left.a}|${left.b}`.localeCompare(`${right.a}|${right.b}`)
    })

  if (matched.length === 0) return undefined

  return {
    id: 'alias_evidence',
    weak: true,
    score: clamp01(matched.reduce((max, candidate) => Math.max(max, candidate.score), 0) * 0.5),
    evidence: {
      aliases: matched.map(candidate => `${candidate.a}|${candidate.b}`),
      canonical_ids_unchanged: true,
    },
  }
}
