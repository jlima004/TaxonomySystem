// Barrel export — all domain types
// Import via: import type { CorpusMaterial, TaxonomySeed, ... } from './types/index.ts'

export type {
  CorpusMaterial,
  SemanticMaterial,
  MaterialIdentity,
  MaterialIdentifiers,
  MaterialClassification,
  MaterialUsage,
  OlfactoryProfile,
  MolecularProperties,
} from './corpus.ts'

export type {
  TaxonomySeed,
  TaxonomySeedFamily,
  TaxonomySeedSubfamily,
  SeedMetadata,
} from './seed.ts'

export type {
  CompiledTaxonomy,
  TaxonomyFamily,
  TaxonomySubfamily,
  TaxonomyStats,
  CanonicalDescriptor,
  DescriptorAliasMap,
} from './taxonomy.ts'

export type {
  SimilarityGraph,
  SimilarityDimension,
  SimilarityEdge,
  SimilarityStats,
} from './similarity.ts'

export type {
  FrequencyMap,
  CoOccurrenceMap,
  FrequencyEntry,
  CoOccurrenceEdge,
  AliasCandidate,
  CorpusAnalysis,
} from './analysis.ts'

export type { DescriptorAliasSeed } from './alias.ts'
export type { DescriptorNode, DescriptorRegistry } from './registry.ts'
