// Corpus Material types — maps enriched_materials.json schema
// Source: data/enriched_materials.json (TGSC + SF merged dataset)

export type MolecularProperties = {
  readonly cid?: number
  readonly smiles?: string
  readonly molecular_weight?: number
  readonly xlogp?: number
  readonly tpsa?: number
  readonly rotatable_bonds?: number
}

export type OlfactoryProfile = {
  readonly descriptors: readonly string[]
  readonly primary_type: string
  readonly odor_description: string
  readonly descriptor_sources: {
    readonly tgsc?: readonly string[]
    readonly sf?: readonly string[]
  }
}

export type MaterialIdentifiers = {
  readonly cas?: string
  readonly einecs?: string
}

export type MaterialIdentity = {
  readonly name: string
  readonly canonical_name: string
  readonly aliases: readonly string[]
  readonly identifiers: MaterialIdentifiers
}

export type MaterialClassification = {
  readonly category: string
  readonly category_path: readonly string[]
}

export type MaterialUsage = {
  readonly found_in_nature: readonly string[]
  readonly uses: readonly string[]
  readonly blenders: readonly string[]
}

export type CorpusMaterial = {
  readonly id: string
  readonly identity: MaterialIdentity
  readonly classification: MaterialClassification
  readonly olfactory: OlfactoryProfile
  readonly usage: MaterialUsage
  readonly molecular: MolecularProperties
}

export type SemanticMaterial = {
  readonly id: string
  readonly identity: MaterialIdentity
  readonly olfactory: OlfactoryProfile
  readonly organoleptic?: Record<string, unknown>
  readonly meta?: Record<string, unknown>
}
