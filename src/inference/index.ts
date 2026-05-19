export {
  scoreSemanticNoise,
  suggestCorpusSemanticNoise,
} from './noise.js'
export { buildSeedCorpusProfiles } from './seed_profile.js'
export type {
  CorpusNoiseSuggestionOptions,
  SemanticNoiseOptions,
} from './noise.js'
export type { SeedCorpusProfileOptions } from './types.js'

import type { CorpusAnalysis } from '../types/analysis.js'
import type { DescriptorClusterResult, SeedCorpusProfileResult } from '../types/inference.js'
import type { DescriptorClusterOptions } from './types.js'

export type { DescriptorClusterOptions } from './types.js'

export const buildDescriptorClusters = (
  _profileResult: SeedCorpusProfileResult,
  _analysis: CorpusAnalysis,
  _options: DescriptorClusterOptions = {},
): DescriptorClusterResult => {
  throw new Error('Not implemented: buildDescriptorClusters')
}
