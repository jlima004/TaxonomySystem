import type { CorpusAnalysis } from '../types/analysis.js'
import type {
  AccordMapInput,
  CuratedRelationsInput,
  DescriptorProfile,
  FinalScoreDimensions,
  FinalScoreWeights,
  ReviewQueueItem,
} from '../types/inference.js'
import type { TaxonomySeed } from '../types/seed.js'
import type { SimilarityDimension, SimilarityEdge, SimilarityEdgeEvidence, SimilarityGraph } from '../types/similarity.js'
import { encodePairKey } from '../analyzer/pair_key.js'
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import { computeAccordCompatibility } from './accord_compatibility.js'
import { computeAliasEvidence } from './alias_evidence.js'
import { DEFAULT_SCORE_WEIGHTS, combineScores, shouldKeepEdge } from './final_score.js'
import { computeSemanticOverlap } from './semantic_overlap.js'
import { computeTraditionScore } from './tradition_score.js'

const GRAPH_VERSION = '1.0.0'
const DEFAULT_GENERATED_AT = '1970-01-01T00:00:00.000Z'
const DEFAULT_THRESHOLD = 0.25

type SubfamilyProfile = {
  readonly id: string
  readonly family_id: string
  readonly subfamily_id: string
  readonly profiles: readonly DescriptorProfile[]
}

export type BuildSimilarityGraphInputs = {
  readonly curatedRelations: CuratedRelationsInput
  readonly accordMap: AccordMapInput
}

export type BuildSimilarityGraphOptions = {
  readonly version?: string
  readonly threshold?: number
  readonly generatedAt?: string
  readonly weights?: FinalScoreWeights
}

const buildSubfamilyProfiles = (
  seed: TaxonomySeed,
  analysis: CorpusAnalysis,
): readonly SubfamilyProfile[] => {
  const subfamilies: SubfamilyProfile[] = []

  for (const family of seed.families) {
    for (const subfamily of family.subfamilies) {
      const descriptorSet = new Set<string>()
      const profiles: DescriptorProfile[] = []

      for (const rawDescriptor of subfamily.descriptors) {
        const descriptor = normalizeDescriptor(rawDescriptor)
        if (descriptor.length === 0 || descriptorSet.has(descriptor)) continue
        descriptorSet.add(descriptor)
        profiles.push({
          family_id: family.id,
          subfamily_id: subfamily.id,
          descriptor,
          source: 'seed',
          status: 'curated',
          weight: 1,
          corpus_count: analysis.frequency.get(descriptor) ?? 0,
          evidence: {
            corpus_frequency: analysis.frequency.get(descriptor) ?? 0,
            seed_authority: true,
          },
        })
      }

      subfamilies.push({
        id: `${family.id}:${subfamily.id}`,
        family_id: family.id,
        subfamily_id: subfamily.id,
        profiles: profiles.sort((left, right) => left.descriptor.localeCompare(right.descriptor)),
      })
    }
  }

  return subfamilies.sort((left, right) => left.id.localeCompare(right.id))
}

const getDescriptorCooccurrence = (
  leftDescriptor: string,
  rightDescriptor: string,
  analysis: CorpusAnalysis,
): number => {
  if (leftDescriptor === rightDescriptor) {
    return analysis.frequency.get(leftDescriptor) ?? 0
  }

  return analysis.cooccurrence.get(encodePairKey(leftDescriptor, rightDescriptor)) ?? 0
}

const computeCooccurrenceSupport = (
  leftProfiles: readonly DescriptorProfile[],
  rightProfiles: readonly DescriptorProfile[],
  analysis: CorpusAnalysis,
): number => {
  let support = 0
  for (const leftProfile of leftProfiles) {
    for (const rightProfile of rightProfiles) {
      support += getDescriptorCooccurrence(leftProfile.descriptor, rightProfile.descriptor, analysis)
    }
  }
  return support
}

const makeCorpusSupportMap = (
  left: SubfamilyProfile,
  right: SubfamilyProfile,
  analysis: CorpusAnalysis,
): ReadonlyMap<string, number> => {
  const support = computeCooccurrenceSupport(left.profiles, right.profiles, analysis)
  if (support === 0) return new Map<string, number>()

  const maxCorpusCount = Math.max(
    ...left.profiles.map(profile => profile.corpus_count),
    ...right.profiles.map(profile => profile.corpus_count),
    support,
    1,
  )

  return new Map([[encodePairKey(left.id, right.id), Math.min(1, support / maxCorpusCount)]])
}

const toDimensions = (
  dimensions: FinalScoreDimensions,
): FinalScoreDimensions => ({
  ...(dimensions.semantic_overlap !== undefined ? { semantic_overlap: dimensions.semantic_overlap } : {}),
  ...(dimensions.tradition !== undefined ? { tradition: dimensions.tradition } : {}),
  ...(dimensions.accord_compatibility !== undefined ? { accord_compatibility: dimensions.accord_compatibility } : {}),
  ...(dimensions.alias_evidence !== undefined ? { alias_evidence: dimensions.alias_evidence } : {}),
})

const makeEvidence = (
  sharedDescriptors: readonly string[],
  cooccurrenceSupport: number,
  curatedRelation?: string,
  accordReference?: string,
  aliasEvidence?: readonly string[],
): SimilarityEdgeEvidence => ({
  ...(sharedDescriptors.length > 0 ? { shared_descriptors: sharedDescriptors } : {}),
  ...(cooccurrenceSupport > 0 ? { cooccurrence_support: cooccurrenceSupport } : {}),
  ...(curatedRelation !== undefined ? { curated_relation: curatedRelation } : {}),
  ...(accordReference !== undefined ? { accord_reference: accordReference } : {}),
  ...(aliasEvidence !== undefined && aliasEvidence.length > 0 ? { alias_evidence: aliasEvidence } : {}),
})

const makeAliasReviewItem = (
  left: SubfamilyProfile,
  right: SubfamilyProfile,
  aliases: readonly string[],
  confidence: number,
): ReviewQueueItem => ({
  type: 'alias_weak_evidence',
  severity: 'low',
  affected: {
    subfamily: `${left.id}|${right.id}`,
  },
  evidence: {
    aliases,
    canonical_ids_unchanged: true,
  },
  suggested_action: 'review_alias_evidence_before_curation',
  confidence,
  source: 'alias',
  reason: 'alias candidates are weak graph evidence only and do not canonicalize seed descriptors',
})

const makeCuratedInputReviewItem = (
  type: 'empty_curated_relations' | 'empty_accord_map',
): ReviewQueueItem => ({
  type,
  severity: 'low',
  affected: {
    input: type === 'empty_curated_relations' ? 'curated_relations.v1.json' : 'accord_map.v1.json',
  },
  evidence: {
    input_empty: true,
  },
  suggested_action: 'populate_curated_input',
  source: 'curated',
  reason: 'empty curated input remains valid but reduces similarity signal quality',
})

const makeGraphEmptyWithCuratedInputsReviewItem = (
  curatedRelationsCount: number,
  accordMapCount: number,
  threshold: number,
  subfamilyCount: number,
): ReviewQueueItem => ({
  type: 'graph_empty_with_curated_inputs',
  severity: 'high',
  affected: {
    artifact: 'similarity_matrix.json',
  },
  evidence: {
    curated_relations_count: curatedRelationsCount,
    accord_map_count: accordMapCount,
    threshold,
    subfamily_count: subfamilyCount,
  },
  suggested_action: 'inspect_subfamily_id_matching_and_thresholds',
  source: 'curated',
  reason: 'curated graph inputs are non-empty but no similarity edges were emitted',
})

const graphDimensions = (weights: FinalScoreWeights): readonly SimilarityDimension[] => [
  { id: 'semantic_overlap', name: 'Semantic overlap', weight: weights.semantic_overlap },
  { id: 'tradition', name: 'Tradition', weight: weights.tradition },
  { id: 'accord_compatibility', name: 'Accord compatibility', weight: weights.accord_compatibility },
  { id: 'alias_evidence', name: 'Alias evidence', weight: weights.alias_evidence },
]

export const buildSimilarityGraph = (
  seed: TaxonomySeed,
  analysis: CorpusAnalysis,
  inputs: BuildSimilarityGraphInputs,
  options: BuildSimilarityGraphOptions = {},
): SimilarityGraph => {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const weights = options.weights ?? DEFAULT_SCORE_WEIGHTS
  const subfamilies = buildSubfamilyProfiles(seed, analysis)
  const edges: SimilarityEdge[] = []
  const reviewQueue: ReviewQueueItem[] = []

  if (inputs.curatedRelations.relations.length === 0) {
    reviewQueue.push(makeCuratedInputReviewItem('empty_curated_relations'))
  }

  if (inputs.accordMap.accords.length === 0) {
    reviewQueue.push(makeCuratedInputReviewItem('empty_accord_map'))
  }

  for (let i = 0; i < subfamilies.length - 1; i++) {
    const left = subfamilies[i]
    if (left === undefined) continue

    for (let j = i + 1; j < subfamilies.length; j++) {
      const right = subfamilies[j]
      if (right === undefined) continue

      const semanticOverlap = computeSemanticOverlap(left.profiles, right.profiles)
      const cooccurrenceSupport = computeCooccurrenceSupport(left.profiles, right.profiles, analysis)
      const tradition = computeTraditionScore(left.subfamily_id, right.subfamily_id, {
        curatedRelations: inputs.curatedRelations,
      })
      const accordCompatibility = computeAccordCompatibility(left.subfamily_id, right.subfamily_id, inputs.accordMap)
      const aliasEvidence = computeAliasEvidence(left.profiles, right.profiles, analysis.aliasCandidates)
      const dimensions = toDimensions({
        semantic_overlap: semanticOverlap.score,
        ...(tradition !== undefined ? { tradition: tradition.score } : {}),
        ...(accordCompatibility !== undefined ? { accord_compatibility: accordCompatibility.score } : {}),
        ...(aliasEvidence !== undefined ? { alias_evidence: aliasEvidence.score } : {}),
      })
      const finalScore = combineScores(dimensions, weights)

      if (!shouldKeepEdge(finalScore, threshold)) continue

      edges.push({
        source: left.subfamily_id,
        target: right.subfamily_id,
        final_score: finalScore,
        score: finalScore,
        dimensions,
        evidence: makeEvidence(
          semanticOverlap.evidence.shared_descriptors,
          cooccurrenceSupport,
          tradition?.evidence.curated_relation?.relation,
          accordCompatibility?.evidence.accord_reference.accord,
          aliasEvidence?.evidence.aliases,
        ),
      })

      if (aliasEvidence !== undefined && aliasEvidence.evidence.aliases.length > 0) {
        reviewQueue.push(makeAliasReviewItem(left, right, aliasEvidence.evidence.aliases, aliasEvidence.score))
      }
    }
  }

  const possiblePairs = (subfamilies.length * (subfamilies.length - 1)) / 2
  const sortedEdges = edges.sort((left, right) => {
    if (left.source !== right.source) return left.source.localeCompare(right.source)
    return left.target.localeCompare(right.target)
  })

  if ((inputs.curatedRelations.relations.length > 0 || inputs.accordMap.accords.length > 0) && sortedEdges.length === 0) {
    reviewQueue.push(makeGraphEmptyWithCuratedInputsReviewItem(
      inputs.curatedRelations.relations.length,
      inputs.accordMap.accords.length,
      threshold,
      subfamilies.length,
    ))
  }

  return {
    version: options.version ?? GRAPH_VERSION,
    generated_at: options.generatedAt ?? DEFAULT_GENERATED_AT,
    threshold,
    dimensions: graphDimensions(weights),
    edges: sortedEdges,
    review_queue: reviewQueue.sort((left, right) => {
      if (left.type !== right.type) return left.type.localeCompare(right.type)
      return JSON.stringify(left.affected).localeCompare(JSON.stringify(right.affected))
    }),
    stats: {
      subfamily_count: subfamilies.length,
      edge_count: sortedEdges.length,
      density: possiblePairs === 0 ? 0 : sortedEdges.length / possiblePairs,
    },
  }
}
