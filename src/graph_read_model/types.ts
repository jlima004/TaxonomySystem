import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityGraph } from '../types/similarity.js'
import type {
  GraphEdgeKind,
  GraphInvariantId,
  GraphNodeKind,
  GraphSchemaVersion,
  GraphValidationErrorCode,
  GraphValidationProfileId,
} from './contract.js'

export type GraphNode = {
  readonly id: string
  readonly kind: GraphNodeKind
  readonly properties: Readonly<Record<string, unknown>>
}

export type GraphEdge = {
  readonly id: string
  readonly kind: GraphEdgeKind
  readonly source: string
  readonly target: string
  readonly properties: Readonly<Record<string, unknown>>
}

export type GraphStats = {
  readonly families: number
  readonly subfamilies: number
  readonly descriptors: number
  readonly aliases: number
  readonly subfamily_similarity_edges: number
}

export type OlfactoryGraph = {
  readonly schema_version: GraphSchemaVersion
  readonly nodes: readonly GraphNode[]
  readonly edges: readonly GraphEdge[]
  readonly stats: GraphStats
}

export type BuildOlfactoryGraphInput = {
  readonly taxonomy: CompiledTaxonomy
  readonly aliases: CompiledAliases
  readonly similarity: SimilarityGraph
}

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export type JsonObject = { readonly [key: string]: JsonValue }
export type JsonArray = readonly JsonValue[]

export type GraphValidationError = {
  readonly code: GraphValidationErrorCode
  readonly path: string
  readonly message: string
  readonly invariant_id?: GraphInvariantId
  readonly node_id?: string
  readonly edge_id?: string
  readonly expected?: JsonValue
  readonly actual?: JsonValue
}

export type GraphValidationResult = {
  readonly ok: boolean
  readonly errors: readonly GraphValidationError[]
  readonly warnings: readonly GraphValidationError[]
}

export type GraphValidationProfile = {
  readonly profile_id: GraphValidationProfileId
  readonly schema_version: GraphSchemaVersion
  readonly expected_stats: GraphStats
}

export const makeGraphError = (
  code: GraphValidationErrorCode,
  path: string,
  message: string,
  options: {
    invariant_id?: GraphInvariantId
    node_id?: string
    edge_id?: string
    expected?: JsonValue
    actual?: JsonValue
  } = {},
): GraphValidationError => ({
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
  ...(options.invariant_id !== undefined ? { invariant_id: options.invariant_id } : {}),
  ...(options.node_id !== undefined ? { node_id: options.node_id } : {}),
  ...(options.edge_id !== undefined ? { edge_id: options.edge_id } : {}),
  ...(options.expected !== undefined ? { expected: options.expected } : {}),
  ...(options.actual !== undefined ? { actual: options.actual } : {}),
})

export const combineGraphResults = (
  ...results: GraphValidationResult[]
): GraphValidationResult => {
  const errors: GraphValidationError[] = []
  const warnings: GraphValidationError[] = []
  for (const result of results) {
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}

export type GraphQueryKind =
  | 'descriptors_by_family'
  | 'descriptors_by_subfamily'
  | 'alias_resolution_path'
  | 'descriptor_to_family_path'
  | 'related_descriptors'
  | 'similarity_neighborhood'
  | 'cross_family_bridges'
  | 'similarity_hub'

export type PathSegment = {
  readonly graph_id: string
  readonly kind: GraphNodeKind
  readonly name?: string
}

export type DescriptorProofItem = {
  readonly id: string
  readonly graph_id: string
  readonly status: 'curated' | 'candidate' | 'inferred'
  readonly review_required: boolean
  readonly corpus_derived: boolean
  readonly source: 'seed' | 'corpus' | 'inferred'
}

export type GraphQueryProof<TKind extends GraphQueryKind, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}

export type DescriptorsByFamilyResult = {
  readonly descriptors: readonly DescriptorProofItem[]
}

export type DescriptorsBySubfamilyResult = {
  readonly descriptors: readonly DescriptorProofItem[]
}

export type AliasResolutionPathResult = {
  readonly target_descriptor_id: string | null
}

export type DescriptorToFamilyPathResult = {
  readonly family_id: string | null
  readonly subfamily_id: string | null
}

export type RelatedDescriptorsResult = {
  readonly descriptors: readonly DescriptorProofItem[]
}

export type SimilarityNeighborhoodEntry = {
  readonly neighbor_id: string
  readonly neighbor_graph_id: string
  readonly score: number
  readonly final_score?: number
  readonly dimensions: Readonly<Record<string, number>>
  readonly evidence?: Readonly<Record<string, unknown>>
  readonly direction: 'outbound' | 'inbound'
}

export type CrossFamilyBridgeItem = {
  readonly source_subfamily_id: string
  readonly target_subfamily_id: string
  readonly source_family_id: string
  readonly target_family_id: string
  readonly score: number
  readonly final_score?: number
  readonly dimensions: Readonly<Record<string, number>>
  readonly evidence?: Readonly<Record<string, unknown>>
}

export type SimilarityHubResult = {
  readonly subfamily_id: string
  readonly graph_id: string
  readonly family_id: string
  readonly degree: number
}

export type DescriptorsByFamilyProof = GraphQueryProof<
  'descriptors_by_family',
  { readonly family_id: string },
  DescriptorsByFamilyResult
>

export type DescriptorsBySubfamilyProof = GraphQueryProof<
  'descriptors_by_subfamily',
  { readonly subfamily_id: string },
  DescriptorsBySubfamilyResult
>

export type AliasResolutionPathProof = GraphQueryProof<
  'alias_resolution_path',
  { readonly alias: string },
  AliasResolutionPathResult
>

export type DescriptorToFamilyPathProof = GraphQueryProof<
  'descriptor_to_family_path',
  { readonly descriptor_id: string },
  DescriptorToFamilyPathResult
>

export type RelatedDescriptorsProof = GraphQueryProof<
  'related_descriptors',
  { readonly descriptor_id: string },
  RelatedDescriptorsResult
>

export type SimilarityNeighborhoodProof = GraphQueryProof<
  'similarity_neighborhood',
  { readonly subfamily_id: string },
  { readonly neighbors: readonly SimilarityNeighborhoodEntry[] }
>

export type CrossFamilyBridgesProof = GraphQueryProof<
  'cross_family_bridges',
  Record<string, never>,
  { readonly bridges: readonly CrossFamilyBridgeItem[] }
>

export type SimilarityHubProof = GraphQueryProof<
  'similarity_hub',
  Record<string, never>,
  { readonly hub: SimilarityHubResult | null }
>
