import { decodePairKey } from '../analyzer/pair_key.js'
import { levenshteinSimilarity } from '../analyzer/similarity/levenshtein.js'
import { tokenJaccard } from '../analyzer/similarity/token_overlap.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type {
  DescriptorCluster,
  DescriptorClusterResult,
  InferredDescriptor,
  ReviewQueueItem,
  SeedCorpusProfileResult,
} from '../types/inference.js'
import type { DescriptorClusterOptions } from './types.js'

const DEFAULT_MIN_CO_OCCURRENCE = 2
const DEFAULT_MIN_CORPUS_FREQUENCY = 2
const DEFAULT_MIN_SIMILARITY = 0.55
const DEFAULT_MAX_REPRESENTATIVE_DESCRIPTORS = 5

type ClusterSignal = {
  readonly descriptor: string
  readonly cooccurrence: number
  readonly similarity: number
  readonly signals: readonly ('cooccurrence' | 'similarity')[]
}

const sortLex = (left: string, right: string): number => left.localeCompare(right)

const descriptorSimilarity = (left: string, right: string): number => {
  return Math.max(tokenJaccard(left, right), levenshteinSimilarity(left, right))
}

const getPairCount = (analysis: CorpusAnalysis, left: string, right: string): number => {
  if (left === right) return 0

  for (const [key, count] of analysis.cooccurrence) {
    const [a, b] = decodePairKey(key)
    if ((a === left && b === right) || (a === right && b === left)) {
      return count
    }
  }

  return 0
}

const representativeDescriptors = (
  descriptors: readonly string[],
  maxRepresentativeDescriptors: number,
): readonly string[] => {
  return Array.from(new Set(descriptors)).sort(sortLex).slice(0, maxRepresentativeDescriptors)
}

const signalsForSeedAnchor = (
  seedDescriptor: string,
  inferred: InferredDescriptor,
  analysis: CorpusAnalysis,
  minCoOccurrence: number,
  minSimilarity: number,
): ClusterSignal | undefined => {
  const cooccurrence = getPairCount(analysis, seedDescriptor, inferred.descriptor)
  const similarity = descriptorSimilarity(seedDescriptor, inferred.descriptor)
  const signals: ('cooccurrence' | 'similarity')[] = []

  if (cooccurrence >= minCoOccurrence) signals.push('cooccurrence')
  if (similarity >= minSimilarity) signals.push('similarity')
  if (signals.length === 0) return undefined

  return {
    descriptor: inferred.descriptor,
    cooccurrence,
    similarity,
    signals,
  }
}

const makeSeedAnchorClusters = (
  profileResult: SeedCorpusProfileResult,
  analysis: CorpusAnalysis,
  options: Required<DescriptorClusterOptions>,
): readonly DescriptorCluster[] => {
  const clusters: DescriptorCluster[] = []
  const profiles = [...profileResult.profiles].sort((left, right) => {
    if (left.subfamily_id !== right.subfamily_id) return left.subfamily_id.localeCompare(right.subfamily_id)
    return left.descriptor.localeCompare(right.descriptor)
  })

  for (const profile of profiles) {
    const memberSignals: ClusterSignal[] = []
    for (const inferred of profileResult.inferred_descriptors) {
      if (inferred.corpus_count < options.minCorpusFrequency) continue
      const signal = signalsForSeedAnchor(
        profile.descriptor,
        inferred,
        analysis,
        options.minCoOccurrence,
        options.minSimilarity,
      )
      if (signal !== undefined) {
        memberSignals.push(signal)
      }
    }

    if (memberSignals.length === 0) continue

    const members = [profile.descriptor, ...memberSignals.map(signal => signal.descriptor)].sort(sortLex)
    const signalSet = new Set<'cooccurrence' | 'similarity'>()
    for (const signal of memberSignals) {
      for (const membershipSignal of signal.signals) {
        signalSet.add(membershipSignal)
      }
    }

    clusters.push({
      cluster_id: `seed_anchor:${profile.subfamily_id}:${profile.descriptor}`,
      cluster_kind: 'seed_anchor',
      status: 'accepted_seed_anchor',
      anchor_id: profile.subfamily_id,
      seed_anchor: profile.subfamily_id,
      corpus_derived: false,
      members,
      evidence: {
        representative_descriptors: representativeDescriptors(members, options.maxRepresentativeDescriptors),
        seed_anchor: profile.subfamily_id,
        corpus_support: memberSignals.reduce((total, signal) => total + signal.cooccurrence, 0),
        similarity_support: Math.max(...memberSignals.map(signal => signal.similarity)),
        membership_signals: Array.from(signalSet).sort(sortLex),
        membership_reason: 'seed descriptor connected to corpus candidates by co-occurrence and/or similarity',
      },
    })
  }

  return clusters
}

const makeCorpusNativeClusters = (
  profileResult: SeedCorpusProfileResult,
  analysis: CorpusAnalysis,
  options: Required<DescriptorClusterOptions>,
): readonly DescriptorCluster[] => {
  const seedDescriptors = new Set(profileResult.profiles.map(profile => profile.descriptor))
  const inferredSet = new Set(profileResult.inferred_descriptors
    .filter(descriptor => descriptor.corpus_count >= options.minCorpusFrequency)
    .map(descriptor => descriptor.descriptor))
  const clusters: DescriptorCluster[] = []

  for (const [key, count] of analysis.cooccurrence) {
    const [a, b] = decodePairKey(key)
    if (count < options.minCoOccurrence || seedDescriptors.has(a) || seedDescriptors.has(b)) {
      continue
    }
    if (!inferredSet.has(a) || !inferredSet.has(b)) {
      continue
    }

    const members = [a, b].sort(sortLex)
    clusters.push({
      cluster_id: `corpus_native:${members.join('+')}`,
      cluster_kind: 'corpus_native',
      status: 'candidate',
      corpus_derived: true,
      members,
      evidence: {
        representative_descriptors: representativeDescriptors(members, options.maxRepresentativeDescriptors),
        corpus_support: count,
        similarity_support: descriptorSimilarity(a, b),
        membership_signals: ['cooccurrence'],
        membership_reason: 'corpus-native descriptors co-occur above threshold and require curation review',
      },
    })
  }

  return clusters
}

const makeReviewQueue = (clusters: readonly DescriptorCluster[]): readonly ReviewQueueItem[] => {
  return clusters
    .filter(cluster => cluster.cluster_kind === 'corpus_native')
    .map((cluster): ReviewQueueItem => ({
      type: 'descriptor_cluster_candidate',
      severity: 'low',
      affected: { descriptor: cluster.members.join(',') },
      evidence: cluster.evidence,
      suggested_action: 'review_corpus_native_cluster',
      source: 'corpus',
      reason: cluster.evidence.membership_reason,
    }))
    .sort((left, right) => (left.affected.descriptor ?? '').localeCompare(right.affected.descriptor ?? ''))
}

export const buildDescriptorClusters = (
  profileResult: SeedCorpusProfileResult,
  analysis: CorpusAnalysis,
  options: DescriptorClusterOptions = {},
): DescriptorClusterResult => {
  const resolvedOptions: Required<DescriptorClusterOptions> = {
    minCoOccurrence: options.minCoOccurrence ?? DEFAULT_MIN_CO_OCCURRENCE,
    minCorpusFrequency: options.minCorpusFrequency ?? DEFAULT_MIN_CORPUS_FREQUENCY,
    minSimilarity: options.minSimilarity ?? DEFAULT_MIN_SIMILARITY,
    maxRepresentativeDescriptors: options.maxRepresentativeDescriptors ?? DEFAULT_MAX_REPRESENTATIVE_DESCRIPTORS,
  }
  const seedAnchorClusters = makeSeedAnchorClusters(profileResult, analysis, resolvedOptions)
  const corpusNativeClusters = makeCorpusNativeClusters(profileResult, analysis, resolvedOptions)
  const clusters = [...seedAnchorClusters, ...corpusNativeClusters].sort((left, right) => {
    if (left.cluster_kind !== right.cluster_kind) return left.cluster_kind === 'seed_anchor' ? -1 : 1
    return (left.anchor_id ?? left.cluster_id).localeCompare(right.anchor_id ?? right.cluster_id)
  })

  return {
    clusters,
    review_queue: makeReviewQueue(clusters),
  }
}
