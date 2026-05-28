import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type {
  DescriptorProfile,
  InferredDescriptor,
  NoiseDecision,
  ReviewQueueItem,
  SeedCorpusProfileResult,
} from '../types/inference.js'
import type { TaxonomySeed } from '../types/seed.js'
import { scoreSemanticNoise, suggestCorpusSemanticNoise } from './noise.js'
import type { NormalizedSemanticNoiseConfig } from './noise.js'
import type { SeedCorpusProfileOptions } from './types.js'

const DEFAULT_MIN_CORPUS_FREQUENCY = 2

const makeNoiseOptions = (
  options: SeedCorpusProfileOptions,
  seedDescriptors: readonly string[],
): {
  readonly curatedNoiseDescriptors?: readonly string[]
  readonly downweightValue?: number
  readonly normalizedConfig?: NormalizedSemanticNoiseConfig
  readonly seedDescriptors: readonly string[]
} => ({
  ...(options.curatedNoiseDescriptors !== undefined ? { curatedNoiseDescriptors: options.curatedNoiseDescriptors } : {}),
  ...(options.downweightValue !== undefined ? { downweightValue: options.downweightValue } : {}),
  ...(options.normalizedConfig !== undefined ? { normalizedConfig: options.normalizedConfig } : {}),
  seedDescriptors,
})

type SeedDescriptorRef = {
  readonly descriptor: string
  readonly family_id: string
  readonly subfamily_id: string
}

const sortLex = (left: string, right: string): number => left.localeCompare(right)

const collectSeedDescriptors = (seed: TaxonomySeed): readonly SeedDescriptorRef[] => {
  const refs: SeedDescriptorRef[] = []
  for (const family of seed.families) {
    for (const subfamily of family.subfamilies) {
      for (const rawDescriptor of subfamily.descriptors) {
        const descriptor = normalizeDescriptor(rawDescriptor)
        if (descriptor.length === 0) continue
        refs.push({ descriptor, family_id: family.id, subfamily_id: subfamily.id })
      }
    }
  }

  return refs.sort((left, right) => {
    if (left.subfamily_id !== right.subfamily_id) return left.subfamily_id.localeCompare(right.subfamily_id)
    return left.descriptor.localeCompare(right.descriptor)
  })
}

const makeSeedExceptionReview = (profile: DescriptorProfile, noise: NoiseDecision): ReviewQueueItem => ({
  type: 'semantic_noise_seed_exception',
  severity: 'medium',
  affected: {
    descriptor: profile.descriptor,
    subfamily: profile.subfamily_id,
    family: profile.family_id,
  },
  evidence: noise.evidence,
  suggested_action: 'audit_seed_noise_overlap',
  source: 'seed',
  reason: 'seed descriptor appears in curated semantic noise list and was not downweighted',
})

const makeConflictReview = (
  inferred: InferredDescriptor,
  seedRef: SeedDescriptorRef,
): ReviewQueueItem => ({
  type: 'seed_corpus_conflict',
  severity: 'medium',
  affected: {
    descriptor: inferred.descriptor,
    subfamily: seedRef.subfamily_id,
    family: seedRef.family_id,
  },
  evidence: {
    seed_descriptor: seedRef.descriptor,
    corpus_descriptor: inferred.descriptor,
    corpus_count: inferred.corpus_count,
    ...inferred.evidence,
  },
  suggested_action: 'review_corpus_candidate_against_seed_anchor',
  confidence: 0.5,
  source: 'corpus',
  reason: 'corpus descriptor overlaps a seed descriptor but remains review-only',
})

export const buildSeedCorpusProfiles = (
  seed: TaxonomySeed,
  analysis: CorpusAnalysis,
  options: SeedCorpusProfileOptions = {},
): SeedCorpusProfileResult => {
  const minCorpusFrequency = options.minCorpusFrequency ?? DEFAULT_MIN_CORPUS_FREQUENCY
  const seedRefs = collectSeedDescriptors(seed)
  const seedDescriptorSet = new Set(seedRefs.map(ref => ref.descriptor))
  const seedDescriptors = Array.from(seedDescriptorSet).sort(sortLex)
  const profiles: DescriptorProfile[] = []
  const noiseDecisions: NoiseDecision[] = []
  const reviewQueue: ReviewQueueItem[] = []

  for (const ref of seedRefs) {
    const noise = scoreSemanticNoise(ref.descriptor, makeNoiseOptions(options, seedDescriptors))
    const profile: DescriptorProfile = {
      family_id: ref.family_id,
      subfamily_id: ref.subfamily_id,
      descriptor: ref.descriptor,
      source: 'seed',
      status: 'curated',
      weight: noise.weight,
      corpus_count: analysis.frequency.get(ref.descriptor) ?? 0,
      evidence: {
        corpus_frequency: analysis.frequency.get(ref.descriptor) ?? 0,
        seed_authority: true,
      },
      ...(noise.downweighted || noise.seed_exception ? { noise } : {}),
    }
    profiles.push(profile)

    if (noise.downweighted || noise.seed_exception) {
      noiseDecisions.push(noise)
    }
    if (noise.seed_exception) {
      reviewQueue.push(makeSeedExceptionReview(profile, noise))
    }
  }

  const inferredDescriptors: InferredDescriptor[] = []
  for (const [rawDescriptor, frequency] of analysis.frequency) {
    const descriptor = normalizeDescriptor(rawDescriptor)
    if (descriptor.length === 0 || seedDescriptorSet.has(descriptor) || frequency < minCorpusFrequency) {
      continue
    }

    const noise = scoreSemanticNoise(descriptor, makeNoiseOptions(options, seedDescriptors))
    const inferred: InferredDescriptor = {
      descriptor,
      source: 'corpus',
      status: 'candidate',
      corpus_derived: true,
      corpus_count: frequency,
      weight: noise.weight,
      evidence: {
        corpus_frequency: frequency,
        min_corpus_frequency: minCorpusFrequency,
      },
      ...(noise.downweighted ? { noise } : {}),
    }
    inferredDescriptors.push(inferred)
    if (noise.downweighted) {
      noiseDecisions.push(noise)
    }
  }

  const corpusNoiseSuggestions = suggestCorpusSemanticNoise(analysis, options)
  for (const suggestion of corpusNoiseSuggestions) {
    reviewQueue.push({
      type: 'corpus_semantic_noise_suggestion',
      severity: 'low',
      affected: { descriptor: suggestion.descriptor },
      evidence: suggestion.evidence,
      suggested_action: 'review_corpus_noise_suggestion',
      source: 'corpus',
      reason: suggestion.reason,
    })
  }

  for (const inferred of inferredDescriptors) {
    if (options.conflictStopwords?.has(inferred.descriptor)) {
      continue
    }
    const anchor = seedRefs.find(ref => inferred.descriptor.includes(ref.descriptor) || ref.descriptor.includes(inferred.descriptor))
    if (anchor !== undefined) {
      reviewQueue.push(makeConflictReview(inferred, anchor))
    }
  }

  return {
    profiles,
    inferred_descriptors: inferredDescriptors.sort((left, right) => left.descriptor.localeCompare(right.descriptor)),
    noise_decisions: noiseDecisions.sort((left, right) => left.descriptor.localeCompare(right.descriptor)),
    corpus_noise_suggestions: corpusNoiseSuggestions,
    review_queue: reviewQueue.sort((left, right) => {
      if (left.type !== right.type) return left.type.localeCompare(right.type)
      return (left.affected.descriptor ?? '').localeCompare(right.affected.descriptor ?? '')
    }),
  }
}
