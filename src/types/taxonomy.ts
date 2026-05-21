// Compiled Taxonomy types — output artifacts
// Represents taxonomy.json and descriptor_aliases.json outputs

export type TaxonomyStats = {
  readonly family_count: number
  readonly subfamily_count: number
  readonly descriptor_count: number
}

export type CanonicalDescriptor = {
  readonly id: string
  readonly source: 'seed' | 'corpus' | 'inferred'
  readonly frequency: number
  readonly status: 'curated' | 'candidate' | 'inferred'
  readonly review_required: boolean
  readonly corpus_derived: boolean
}

export type TaxonomySubfamily = {
  readonly id: string
  readonly name: string
  readonly family_id: string
  readonly descriptors: readonly CanonicalDescriptor[]
}

export type TaxonomyFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly TaxonomySubfamily[]
}

export type CompiledTaxonomy = {
  readonly version: string
  readonly generated_at: string
  readonly stats: TaxonomyStats
  readonly families: readonly TaxonomyFamily[]
}

export type DescriptorAliasMap = Readonly<Record<string, string>>
