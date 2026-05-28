import type { CorpusNoiseSuggestionOptions, SemanticNoiseOptions } from './noise.js'

export type SeedCorpusProfileOptions = SemanticNoiseOptions & CorpusNoiseSuggestionOptions & {
  readonly minCorpusFrequency?: number
  readonly conflictStopwords?: ReadonlySet<string>
}

export type DescriptorClusterOptions = {
  readonly minCoOccurrence?: number
  readonly minCorpusFrequency?: number
  readonly minSimilarity?: number
  readonly maxRepresentativeDescriptors?: number
}
