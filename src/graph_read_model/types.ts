import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityGraph } from '../types/similarity.js'
import type {
  GraphEdgeKind,
  GraphNodeKind,
  GraphSchemaVersion,
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

export type GraphValidationError = {
  readonly code: string
  readonly path: string
  readonly message: string
  readonly node_id?: string
  readonly edge_id?: string
}

export type GraphValidationResult = {
  readonly ok: boolean
  readonly errors: readonly GraphValidationError[]
  readonly warnings: readonly GraphValidationError[]
}

export const makeGraphError = (
  code: string,
  path: string,
  message: string,
  options: { node_id?: string; edge_id?: string } = {},
): GraphValidationError => ({
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
  ...(options.node_id !== undefined ? { node_id: options.node_id } : {}),
  ...(options.edge_id !== undefined ? { edge_id: options.edge_id } : {}),
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
