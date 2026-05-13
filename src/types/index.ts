// Barrel export — all domain types
// Import via: import type { CorpusMaterial, TaxonomySeed, ... } from './types/index.ts'

export type {
  CorpusMaterial,
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
