import type { DescriptorProfile, SemanticOverlapScore } from '../types/inference.js'

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

const profileWeights = (profiles: readonly DescriptorProfile[]): ReadonlyMap<string, number> => {
  const weights = new Map<string, number>()
  for (const profile of profiles) {
    if (profile.descriptor.length === 0) continue
    weights.set(profile.descriptor, Math.max(weights.get(profile.descriptor) ?? 0, clamp01(profile.weight)))
  }
  return weights
}

export const computeSemanticOverlap = (
  leftProfile: readonly DescriptorProfile[],
  rightProfile: readonly DescriptorProfile[],
): SemanticOverlapScore => {
  const leftWeights = profileWeights(leftProfile)
  const rightWeights = profileWeights(rightProfile)
  const descriptors = Array.from(new Set([...leftWeights.keys(), ...rightWeights.keys()])).sort((a, b) => a.localeCompare(b))
  const sharedDescriptors: string[] = []
  let weightedIntersection = 0
  let weightedUnion = 0

  for (const descriptor of descriptors) {
    const leftWeight = leftWeights.get(descriptor) ?? 0
    const rightWeight = rightWeights.get(descriptor) ?? 0
    if (leftWeight > 0 && rightWeight > 0) {
      sharedDescriptors.push(descriptor)
      weightedIntersection += Math.min(leftWeight, rightWeight)
    }
    weightedUnion += Math.max(leftWeight, rightWeight)
  }

  return {
    id: 'semantic_overlap',
    score: weightedUnion === 0 ? 0 : clamp01(weightedIntersection / weightedUnion),
    evidence: {
      shared_descriptors: sharedDescriptors,
      weighted_intersection: weightedIntersection,
      weighted_union: weightedUnion,
    },
  }
}
