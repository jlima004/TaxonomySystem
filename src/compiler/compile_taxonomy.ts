import { encodePairKey } from '../analyzer/pair_key.js'
import { scoreSemanticNoise } from '../inference/noise.js'
import { scoreCandidatePlacement } from '../inference/placement_scoring.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { ReviewQueueItem, SeedCorpusProfileResult } from '../types/inference.js'
import type { TaxonomySeed } from '../types/seed.js'
import type { CanonicalDescriptor, CompiledTaxonomy, TaxonomyFamily, TaxonomySubfamily } from '../types/taxonomy.js'

export type CompileTaxonomyOptions = {
  readonly version?: string
  readonly generatedAt: string
}

type Placement = {
  readonly familyId: string
  readonly subfamilyId: string
  readonly support: number
}

export type CompileTaxonomyResult = {
  readonly taxonomy: CompiledTaxonomy
  readonly placement_review_queue: readonly ReviewQueueItem[]
}

const DEFAULT_VERSION = '1.0.0'

const sortLex = (left: string, right: string): number => left.localeCompare(right)

const getSupport = (descriptor: string, seedDescriptor: string, analysis: CorpusAnalysis): number => {
  if (descriptor === seedDescriptor) return analysis.frequency.get(descriptor) ?? 0
  return analysis.cooccurrence.get(encodePairKey(descriptor, seedDescriptor)) ?? 0
}

const choosePlacement = (
  descriptor: string,
  subfamilySeedDescriptors: ReadonlyMap<string, readonly string[]>,
  analysis: CorpusAnalysis,
): Placement | undefined => {
  let selected: Placement | undefined

  for (const [key, seedDescriptors] of subfamilySeedDescriptors) {
    const [familyId, subfamilyId] = key.split('|') as [string, string]
    const support = seedDescriptors.reduce((total, seedDescriptor) => total + getSupport(descriptor, seedDescriptor, analysis), 0)
    if (
      selected === undefined ||
      support > selected.support ||
      (support === selected.support && subfamilyId.localeCompare(selected.subfamilyId) < 0)
    ) {
      selected = { familyId, subfamilyId, support }
    }
  }

  return selected
}

export const compileTaxonomy = (
  seed: TaxonomySeed,
  profileResult: SeedCorpusProfileResult,
  analysis: CorpusAnalysis,
  options: CompileTaxonomyOptions,
): CompileTaxonomyResult => {
  const version = options.version ?? DEFAULT_VERSION
  const profilesBySubfamily = new Map<string, typeof profileResult.profiles>()
  const seedDescriptorsBySubfamily = new Map<string, readonly string[]>()

  for (const profile of profileResult.profiles) {
    const key = `${profile.family_id}|${profile.subfamily_id}`
    profilesBySubfamily.set(key, [...(profilesBySubfamily.get(key) ?? []), profile])
  }

  for (const family of seed.families) {
    for (const subfamily of family.subfamilies) {
      const key = `${family.id}|${subfamily.id}`
      seedDescriptorsBySubfamily.set(
        key,
        (profilesBySubfamily.get(key) ?? [])
          .map(profile => profile.descriptor)
          .sort(sortLex),
      )
    }
  }

  const corpusBySubfamily = new Map<string, CanonicalDescriptor[]>()
  const placementReviewQueue: ReviewQueueItem[] = []
  for (const inferred of profileResult.inferred_descriptors) {
    const placement = choosePlacement(inferred.descriptor, seedDescriptorsBySubfamily, analysis)
    if (placement === undefined) continue

    const inferredDownweight = inferred.noise?.evidence.downweight_value as number | undefined
    const noise = scoreSemanticNoise(inferred.descriptor, {
      ...(inferredDownweight !== undefined ? { downweightValue: inferredDownweight } : {}),
      curatedNoiseDescriptors: inferred.noise?.downweighted === true ? [inferred.descriptor] : [],
    })
    const decision = scoreCandidatePlacement(inferred.descriptor, placement.subfamilyId, {
      support: placement.support,
      candidate_frequency: inferred.corpus_count,
      downweight_value: noise.downweighted ? noise.weight : 1,
      hardExcluded: false,
    })
    if (!decision.pass) {
      const highFrequencyGeneric = inferred.corpus_count >= 20 && inferred.descriptor.includes('generic')
      placementReviewQueue.push({
        type: highFrequencyGeneric ? 'corpus_candidate_high_frequency_generic' : 'corpus_candidate_low_support',
        severity: highFrequencyGeneric ? 'low' : 'medium',
        affected: {
          descriptor: inferred.descriptor,
          subfamily: placement.subfamilyId,
        },
        evidence: {
          support: decision.support,
          normalized_support: decision.normalized_support,
          placement_score: decision.placement_score,
          thresholds: decision.thresholds,
          candidate_frequency: decision.candidate_frequency,
          noise_penalty: decision.noise_penalty,
          reason: decision.reason,
        },
        suggested_action: 'review_candidate_placement',
        source: 'corpus',
        reason: decision.reason,
      })
      continue
    }

    const key = `${placement.familyId}|${placement.subfamilyId}`
    const descriptor: CanonicalDescriptor = {
      id: inferred.descriptor,
      source: 'corpus',
      frequency: inferred.corpus_count,
      status: 'candidate',
      review_required: true,
      corpus_derived: true,
    }
    corpusBySubfamily.set(key, [...(corpusBySubfamily.get(key) ?? []), descriptor])
  }

  const families: TaxonomyFamily[] = [...seed.families]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(family => {
      const subfamilies: TaxonomySubfamily[] = [...family.subfamilies]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map(subfamily => {
          const key = `${family.id}|${subfamily.id}`
          const seedDescriptors: CanonicalDescriptor[] = (profilesBySubfamily.get(key) ?? [])
            .map(profile => ({
              id: profile.descriptor,
              source: 'seed' as const,
              frequency: profile.corpus_count,
              status: 'curated' as const,
              review_required: false,
              corpus_derived: false,
            }))
            .sort((left, right) => left.id.localeCompare(right.id))
          const corpusDescriptors = (corpusBySubfamily.get(key) ?? []).sort((left, right) => left.id.localeCompare(right.id))

          return {
            id: subfamily.id,
            name: subfamily.name,
            family_id: family.id,
            descriptors: [...seedDescriptors, ...corpusDescriptors],
          }
        })

      return {
        id: family.id,
        name: family.name,
        subfamilies,
      }
    })

  const subfamilyCount = families.reduce((total, family) => total + family.subfamilies.length, 0)
  const descriptorCount = families.reduce(
    (total, family) => total + family.subfamilies.reduce((subTotal, subfamily) => subTotal + subfamily.descriptors.length, 0),
    0,
  )

  return {
    taxonomy: {
      version,
      generated_at: options.generatedAt,
      stats: {
        family_count: families.length,
        subfamily_count: subfamilyCount,
        descriptor_count: descriptorCount,
      },
      families,
    },
    placement_review_queue: placementReviewQueue,
  }
}
