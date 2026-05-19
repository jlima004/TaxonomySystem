export type InferenceDescriptorSource = 'seed' | 'corpus' | 'inferred'

export type InferenceReviewItem = {
  readonly type: string
  readonly severity: 'low' | 'medium' | 'high'
  readonly affected: {
    readonly descriptor?: string
    readonly subfamily?: string
    readonly family?: string
  }
  readonly evidence: Readonly<Record<string, unknown>>
  readonly suggested_action: string
  readonly confidence?: number
  readonly source?: InferenceDescriptorSource | 'curated' | 'alias'
  readonly reason?: string
}

export type ReviewQueueItem = InferenceReviewItem

export type NoiseDecision = {
  readonly descriptor: string
  readonly normalized_descriptor: string
  readonly weight: number
  readonly reason: string
  readonly source: InferenceDescriptorSource | 'curated'
  readonly seed_exception: boolean
  readonly downweighted: boolean
  readonly review_only?: boolean
  readonly auto_applied?: boolean
  readonly corpus_frequency?: number
  readonly evidence: Readonly<Record<string, unknown>>
}

export type CorpusNoiseSuggestion = {
  readonly descriptor: string
  readonly normalized_descriptor: string
  readonly source: 'corpus'
  readonly review_only: true
  readonly auto_applied: false
  readonly corpus_frequency: number
  readonly reason: string
  readonly evidence: Readonly<Record<string, unknown>>
}

export type DescriptorProfile = {
  readonly family_id: string
  readonly subfamily_id: string
  readonly descriptor: string
  readonly source: 'seed'
  readonly status: 'curated'
  readonly weight: number
  readonly corpus_count: number
  readonly evidence: Readonly<Record<string, unknown>>
  readonly noise?: NoiseDecision
}

export type InferredDescriptor = {
  readonly descriptor: string
  readonly source: 'corpus'
  readonly status: 'candidate' | 'inferred'
  readonly corpus_derived: true
  readonly corpus_count: number
  readonly weight: number
  readonly evidence: Readonly<Record<string, unknown>>
  readonly noise?: NoiseDecision
}

export type DescriptorClusterEvidence = {
  readonly representative_descriptors: readonly string[]
  readonly seed_anchor?: string
  readonly corpus_support: number
  readonly similarity_support: number
  readonly membership_signals: readonly ('cooccurrence' | 'similarity')[]
  readonly membership_reason: string
}

export type DescriptorCluster = {
  readonly cluster_id: string
  readonly cluster_kind: 'seed_anchor' | 'corpus_native'
  readonly status: 'accepted_seed_anchor' | 'candidate'
  readonly anchor_id?: string
  readonly seed_anchor?: string
  readonly corpus_derived: boolean
  readonly members: readonly string[]
  readonly evidence: DescriptorClusterEvidence
}

export type SeedCorpusProfileResult = {
  readonly profiles: readonly DescriptorProfile[]
  readonly inferred_descriptors: readonly InferredDescriptor[]
  readonly noise_decisions: readonly NoiseDecision[]
  readonly corpus_noise_suggestions: readonly CorpusNoiseSuggestion[]
  readonly review_queue: readonly ReviewQueueItem[]
}

export type DescriptorClusterResult = {
  readonly clusters: readonly DescriptorCluster[]
  readonly review_queue: readonly ReviewQueueItem[]
}

export type DimensionScore = {
  readonly id: string
  readonly score: number
}

export type SemanticOverlapEvidence = {
  readonly shared_descriptors: readonly string[]
  readonly weighted_intersection: number
  readonly weighted_union: number
}

export type SemanticOverlapScore = DimensionScore & {
  readonly id: 'semantic_overlap'
  readonly evidence: SemanticOverlapEvidence
}

export type CuratedTraditionRelation = {
  readonly source_subfamily_id: string
  readonly target_subfamily_id: string
  readonly relation: string
  readonly score: number
  readonly evidence?: string
}

export type CuratedRelationsInput = {
  readonly version: string
  readonly relations: readonly CuratedTraditionRelation[]
}

export type TraditionEvidence = {
  readonly curated_relation?: CuratedTraditionRelation
  readonly seed_proximity?: number
  readonly corpus_support?: number
}

export type TraditionScore = DimensionScore & {
  readonly id: 'tradition'
  readonly evidence: TraditionEvidence
}

export type TraditionScoreContext = {
  readonly curatedRelations?: CuratedRelationsInput
  readonly seedProximity?: ReadonlyMap<string, number>
  readonly corpusSupport?: ReadonlyMap<string, number>
}

export type CuratedAccordReference = {
  readonly source_subfamily_id: string
  readonly target_subfamily_id: string
  readonly accord: string
  readonly score: number
  readonly reference?: string
}

export type AccordMapInput = {
  readonly version: string
  readonly accords: readonly CuratedAccordReference[]
}

export type AccordCompatibilityEvidence = {
  readonly accord_reference: CuratedAccordReference
}

export type AccordCompatibilityScore = DimensionScore & {
  readonly id: 'accord_compatibility'
  readonly evidence: AccordCompatibilityEvidence
}

export type AliasEvidenceScore = DimensionScore & {
  readonly id: 'alias_evidence'
  readonly weak: true
  readonly evidence: {
    readonly aliases: readonly string[]
    readonly canonical_ids_unchanged: true
  }
}
