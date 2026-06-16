import type { CompiledAliases } from '../compiler/types.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { SimilarityEdge, SimilarityGraph } from '../types/similarity.js'
import {
  makeAliasGraphId,
  makeDescriptorGraphId,
  makeFamilyGraphId,
  makeSubfamilyGraphId,
} from './graph_id.js'
import { GRAPH_SCHEMA_VERSION } from './contract.js'
import type {
  BuildOlfactoryGraphInput,
  GraphEdge,
  GraphNode,
  GraphStats,
  OlfactoryGraph,
} from './types.js'

const edgeId = (kind: GraphEdge['kind'], source: string, target: string): string =>
  `edge:${kind}:${source}->${target}`

const compareGraphNodes = (left: GraphNode, right: GraphNode): number => {
  if (left.kind !== right.kind) return left.kind.localeCompare(right.kind)
  return left.id.localeCompare(right.id)
}

const compareGraphEdges = (left: GraphEdge, right: GraphEdge): number => {
  if (left.kind !== right.kind) return left.kind.localeCompare(right.kind)
  if (left.source !== right.source) return left.source.localeCompare(right.source)
  if (left.target !== right.target) return left.target.localeCompare(right.target)
  return left.id.localeCompare(right.id)
}

const deriveGraphStats = (nodes: readonly GraphNode[], edges: readonly GraphEdge[]): GraphStats => ({
  families: nodes.filter(node => node.kind === 'family').length,
  subfamilies: nodes.filter(node => node.kind === 'subfamily').length,
  descriptors: nodes.filter(node => node.kind === 'descriptor').length,
  aliases: nodes.filter(node => node.kind === 'alias').length,
  subfamily_similarity_edges: edges.filter(edge => edge.kind === 'similar_to').length,
})

const buildTaxonomyNodesAndEdges = (
  taxonomy: CompiledTaxonomy,
): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  for (const family of taxonomy.families) {
    const familyGraphId = makeFamilyGraphId(family.id)
    nodes.push({
      id: familyGraphId,
      kind: 'family',
      properties: {
        family_id: family.id,
        name: family.name,
      },
    })

    for (const subfamily of family.subfamilies) {
      const subfamilyGraphId = makeSubfamilyGraphId(subfamily.id)
      nodes.push({
        id: subfamilyGraphId,
        kind: 'subfamily',
        properties: {
          subfamily_id: subfamily.id,
          family_id: family.id,
          name: subfamily.name,
        },
      })

      edges.push({
        id: edgeId('contains_subfamily', familyGraphId, subfamilyGraphId),
        kind: 'contains_subfamily',
        source: familyGraphId,
        target: subfamilyGraphId,
        properties: {
          family_id: family.id,
          subfamily_id: subfamily.id,
        },
      })

      for (const descriptor of subfamily.descriptors) {
        const descriptorGraphId = makeDescriptorGraphId(descriptor.id)
        nodes.push({
          id: descriptorGraphId,
          kind: 'descriptor',
          properties: {
            descriptor_id: descriptor.id,
            family_id: family.id,
            subfamily_id: subfamily.id,
            source: descriptor.source,
            frequency: descriptor.frequency,
            status: descriptor.status,
            review_required: descriptor.review_required,
            corpus_derived: descriptor.corpus_derived,
          },
        })

        edges.push({
          id: edgeId('contains_descriptor', subfamilyGraphId, descriptorGraphId),
          kind: 'contains_descriptor',
          source: subfamilyGraphId,
          target: descriptorGraphId,
          properties: {
            subfamily_id: subfamily.id,
            descriptor_id: descriptor.id,
          },
        })
      }
    }
  }

  return { nodes, edges }
}

const buildAliasNodesAndEdges = (aliases: CompiledAliases): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  for (const [alias, targetDescriptorId] of Object.entries(aliases.aliases)) {
    const aliasGraphId = makeAliasGraphId(alias)
    const descriptorGraphId = makeDescriptorGraphId(targetDescriptorId)

    nodes.push({
      id: aliasGraphId,
      kind: 'alias',
      properties: {
        alias,
        target_descriptor_id: targetDescriptorId,
      },
    })

    edges.push({
      id: edgeId('resolves_to', aliasGraphId, descriptorGraphId),
      kind: 'resolves_to',
      source: aliasGraphId,
      target: descriptorGraphId,
      properties: {
        alias,
        target_descriptor_id: targetDescriptorId,
      },
    })
  }

  return { nodes, edges }
}

const buildSimilarityEdgeProperties = (edge: SimilarityEdge): Readonly<Record<string, unknown>> => {
  const properties: Record<string, unknown> = {
    source_subfamily_id: edge.source,
    target_subfamily_id: edge.target,
    score: edge.score,
    dimensions: edge.dimensions,
    evidence: edge.evidence,
  }

  if (edge.final_score !== undefined) {
    properties.final_score = edge.final_score
  }

  return properties
}

const buildSimilarityEdges = (similarity: SimilarityGraph): GraphEdge[] => {
  const edges: GraphEdge[] = []

  for (const edge of similarity.edges) {
    const sourceGraphId = makeSubfamilyGraphId(edge.source)
    const targetGraphId = makeSubfamilyGraphId(edge.target)

    edges.push({
      id: edgeId('similar_to', sourceGraphId, targetGraphId),
      kind: 'similar_to',
      source: sourceGraphId,
      target: targetGraphId,
      properties: buildSimilarityEdgeProperties(edge),
    })
  }

  return edges
}

export const buildOlfactoryGraph = (input: BuildOlfactoryGraphInput): OlfactoryGraph => {
  const taxonomyResult = buildTaxonomyNodesAndEdges(input.taxonomy)
  const aliasResult = buildAliasNodesAndEdges(input.aliases)
  const similarityEdges = buildSimilarityEdges(input.similarity)

  const nodes = [
    ...taxonomyResult.nodes,
    ...aliasResult.nodes,
  ].sort(compareGraphNodes)

  const edges = [
    ...taxonomyResult.edges,
    ...aliasResult.edges,
    ...similarityEdges,
  ].sort(compareGraphEdges)

  return {
    schema_version: GRAPH_SCHEMA_VERSION,
    nodes,
    edges,
    stats: deriveGraphStats(nodes, edges),
  }
}
