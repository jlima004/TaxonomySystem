import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { CorpusNoiseSuggestion, NoiseDecision } from '../types/inference.js'

const DEFAULT_NOISE_WEIGHT = 0.35
const DEFAULT_MIN_NOISE_SUGGESTION_FREQUENCY = 3

export type SemanticNoiseInput = {
  readonly version?: string
  readonly noise_descriptors?: readonly string[]
  readonly downweight_value?: number
  readonly hard_exclude?: readonly string[]
  readonly pattern_exclude?: readonly string[]
  readonly downweight?: Readonly<Record<string, number>>
  readonly default_downweight?: number
}

export type NormalizedSemanticNoiseConfig = {
  readonly hard_exclude: readonly string[]
  readonly pattern_exclude: readonly string[]
  readonly downweight: Readonly<Record<string, number>>
  readonly default_downweight: number
}

export type SemanticNoiseOptions = {
  readonly curatedNoiseDescriptors?: readonly string[]
  readonly downweightValue?: number
  readonly seedDescriptors?: readonly string[]
  readonly normalizedConfig?: NormalizedSemanticNoiseConfig
}

export type CorpusNoiseSuggestionOptions = SemanticNoiseOptions & {
  readonly minNoiseSuggestionFrequency?: number
}

const toNormalizedSet = (values: readonly string[] = []): Set<string> => {
  const normalized = new Set<string>()
  for (const value of values) {
    const descriptor = normalizeDescriptor(value)
    if (descriptor.length > 0) {
      normalized.add(descriptor)
    }
  }
  return normalized
}

const toNormalizedWeightMap = (weights: Readonly<Record<string, number>> = {}): Readonly<Record<string, number>> => {
  const normalized: Record<string, number> = {}
  for (const [raw, weight] of Object.entries(weights)) {
    const descriptor = normalizeDescriptor(raw)
    if (descriptor.length > 0) {
      normalized[descriptor] = weight
    }
  }
  return normalized
}

export const normalizeSemanticNoiseConfig = (input: SemanticNoiseInput): NormalizedSemanticNoiseConfig => {
  const default_downweight = input.default_downweight ?? input.downweight_value ?? DEFAULT_NOISE_WEIGHT
  const hard_exclude = Array.from(toNormalizedSet(input.hard_exclude))
  const pattern_exclude = Array.from(new Set(input.pattern_exclude ?? []))

  const downweight: Record<string, number> = {
    ...toNormalizedWeightMap(input.downweight),
  }

  for (const descriptor of input.noise_descriptors ?? []) {
    const normalized = normalizeDescriptor(descriptor)
    if (normalized.length > 0 && downweight[normalized] === undefined) {
      downweight[normalized] = default_downweight
    }
  }

  return {
    hard_exclude,
    pattern_exclude,
    downweight,
    default_downweight,
  }
}

export const scoreSemanticNoise = (
  descriptor: string,
  options: SemanticNoiseOptions = {},
): NoiseDecision => {
  const normalized = normalizeDescriptor(descriptor)
  const normalizedConfig = options.normalizedConfig
  const curatedNoise = normalizedConfig === undefined
    ? toNormalizedSet(options.curatedNoiseDescriptors)
    : new Set(Object.keys(normalizedConfig.downweight))
  const seedDescriptors = toNormalizedSet(options.seedDescriptors)
  const downweightValue = normalizedConfig?.downweight[normalized]
    ?? options.downweightValue
    ?? normalizedConfig?.default_downweight
    ?? DEFAULT_NOISE_WEIGHT
  const isCuratedNoise = curatedNoise.has(normalized)
  const seedException = isCuratedNoise && seedDescriptors.has(normalized)
  const downweighted = isCuratedNoise && !seedException

  return {
    descriptor: normalized,
    normalized_descriptor: normalized,
    weight: downweighted ? downweightValue : 1,
    reason: seedException
      ? 'curated_noise_seed_exception'
      : downweighted
        ? 'curated_semantic_noise_downweight'
        : 'not_curated_semantic_noise',
    source: isCuratedNoise ? 'curated' : 'corpus',
    seed_exception: seedException,
    downweighted,
    evidence: {
      curated_noise: isCuratedNoise,
      seed_descriptor: seedDescriptors.has(normalized),
      downweight_value: downweightValue,
    },
  }
}

const looksLikeCorpusNoiseSuggestion = (descriptor: string): boolean => {
  return descriptor.includes('generic') || descriptor.includes('phrase')
}

export const suggestCorpusSemanticNoise = (
  analysis: CorpusAnalysis,
  options: CorpusNoiseSuggestionOptions = {},
): readonly CorpusNoiseSuggestion[] => {
  const minFrequency = options.minNoiseSuggestionFrequency ?? DEFAULT_MIN_NOISE_SUGGESTION_FREQUENCY
  const curatedNoise = toNormalizedSet(options.curatedNoiseDescriptors)
  const suggestions: CorpusNoiseSuggestion[] = []

  for (const [rawDescriptor, frequency] of analysis.frequency) {
    const descriptor = normalizeDescriptor(rawDescriptor)
    if (descriptor.length === 0 || frequency < minFrequency || curatedNoise.has(descriptor)) {
      continue
    }

    if (!looksLikeCorpusNoiseSuggestion(descriptor)) {
      continue
    }

    suggestions.push({
      descriptor,
      normalized_descriptor: descriptor,
      source: 'corpus',
      review_only: true,
      auto_applied: false,
      corpus_frequency: frequency,
      reason: 'high_frequency_generic_corpus_descriptor',
      evidence: {
        frequency,
        min_noise_suggestion_frequency: minFrequency,
      },
    })
  }

  return suggestions.sort((left, right) => left.descriptor.localeCompare(right.descriptor))
}
