import type { CorpusNoiseSuggestionOptions, SemanticNoiseOptions } from './noise.js'

export type SeedCorpusProfileOptions = SemanticNoiseOptions & CorpusNoiseSuggestionOptions & {
  readonly minCorpusFrequency?: number
}

export type DescriptorClusterOptions = {
  readonly minCoOccurrence?: number
  readonly minCorpusFrequency?: number
  readonly minSimilarity?: number
  readonly maxRepresentativeDescriptors?: number
}
