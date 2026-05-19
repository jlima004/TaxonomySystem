import type { CorpusAnalysis } from '../types/analysis.js'
import type {
  DescriptorClusterResult,
  NoiseDecision,
  SeedCorpusProfileResult,
} from '../types/inference.js'
import type { TaxonomySeed } from '../types/seed.js'

export type SemanticNoiseOptions = {
  readonly curatedNoiseDescriptors?: readonly string[]
  readonly downweightValue?: number
  readonly seedDescriptors?: readonly string[]
}

export type CorpusNoiseSuggestionOptions = SemanticNoiseOptions & {
  readonly minNoiseSuggestionFrequency?: number
}

export type SeedCorpusProfileOptions = SemanticNoiseOptions & CorpusNoiseSuggestionOptions & {
  readonly minCorpusFrequency?: number
}

export type DescriptorClusterOptions = {
  readonly minCoOccurrence?: number
  readonly minCorpusFrequency?: number
  readonly minSimilarity?: number
  readonly maxRepresentativeDescriptors?: number
}

export const scoreSemanticNoise = (
  descriptor: string,
  _options: SemanticNoiseOptions = {},
): NoiseDecision => {
  throw new Error(`Not implemented: scoreSemanticNoise(${descriptor})`)
}

export const suggestCorpusSemanticNoise = (
  _analysis: CorpusAnalysis,
  _options: CorpusNoiseSuggestionOptions = {},
): readonly never[] => {
  throw new Error('Not implemented: suggestCorpusSemanticNoise')
}

export const buildSeedCorpusProfiles = (
  _seed: TaxonomySeed,
  _analysis: CorpusAnalysis,
  _options: SeedCorpusProfileOptions = {},
): SeedCorpusProfileResult => {
  throw new Error('Not implemented: buildSeedCorpusProfiles')
}

export const buildDescriptorClusters = (
  _profileResult: SeedCorpusProfileResult,
  _analysis: CorpusAnalysis,
  _options: DescriptorClusterOptions = {},
): DescriptorClusterResult => {
  throw new Error('Not implemented: buildDescriptorClusters')
}
