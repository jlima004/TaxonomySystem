// Taxonomy Seed types — manual hierarchy input
// Represents the human-curated taxonomy seed (family → subfamily → descriptors)

export type SeedMetadata = {
  readonly created_at: string
  readonly author: string
  readonly description: string
}

export type TaxonomySeedSubfamily = {
  readonly id: string
  readonly name: string
  readonly descriptors: readonly string[]
}

export type TaxonomySeedFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly TaxonomySeedSubfamily[]
}

export type TaxonomySeed = {
  readonly version: string
  readonly metadata: SeedMetadata
  readonly families: readonly TaxonomySeedFamily[]
}
