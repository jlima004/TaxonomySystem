import { GRAPH_EDGE_ENDPOINT_KINDS, type GraphNodeKind } from './contract.js'
import type {
  GraphEdge,
  GraphNode,
  GraphStats,
  GraphValidationResult,
  OlfactoryGraph,
} from './types.js'
import { combineGraphResults, makeGraphError } from './types.js'

const countNodesByKind = (nodes: readonly GraphNode[], kind: GraphNodeKind): number =>
  nodes.filter(node => node.kind === kind).length

const countEdgesByKind = (edges: readonly GraphEdge[], kind: GraphEdge['kind']): number =>
  edges.filter(edge => edge.kind === kind).length

const deriveStatsFromGraph = (graph: OlfactoryGraph): GraphStats => ({
  families: countNodesByKind(graph.nodes, 'family'),
  subfamilies: countNodesByKind(graph.nodes, 'subfamily'),
  descriptors: countNodesByKind(graph.nodes, 'descriptor'),
  aliases: countNodesByKind(graph.nodes, 'alias'),
  subfamily_similarity_edges: countEdgesByKind(graph.edges, 'similar_to'),
})

const validateDuplicateNodeIds = (nodes: readonly GraphNode[]): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []
  const seen = new Set<string>()

  nodes.forEach((node, index) => {
    if (seen.has(node.id)) {
      errors.push(
        makeGraphError(
          'duplicate_node_id_detection',
          `$.nodes[${index}].id`,
          `duplicate node id: ${node.id}`,
          { node_id: node.id },
        ),
      )
    } else {
      seen.add(node.id)
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateDuplicateEdgeIds = (edges: readonly GraphEdge[]): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []
  const seen = new Set<string>()

  edges.forEach((edge, index) => {
    if (seen.has(edge.id)) {
      errors.push(
        makeGraphError(
          'duplicate_edge_id_detection',
          `$.edges[${index}].id`,
          `duplicate edge id: ${edge.id}`,
          { edge_id: edge.id },
        ),
      )
    } else {
      seen.add(edge.id)
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const buildNodeIndex = (nodes: readonly GraphNode[]): Map<string, GraphNode> => {
  const index = new Map<string, GraphNode>()
  for (const node of nodes) {
    if (!index.has(node.id)) {
      index.set(node.id, node)
    }
  }
  return index
}

const validateMissingEdgeEndpoints = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []

  edges.forEach((edge, index) => {
    const path = `$.edges[${index}]`

    if (!nodeIndex.has(edge.source)) {
      errors.push(
        makeGraphError(
          'missing_edge_endpoints',
          `${path}.source`,
          `missing edge source node: ${edge.source}`,
          { edge_id: edge.id },
        ),
      )
    }

    if (!nodeIndex.has(edge.target)) {
      errors.push(
        makeGraphError(
          'missing_edge_endpoints',
          `${path}.target`,
          `missing edge target node: ${edge.target}`,
          { edge_id: edge.id },
        ),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateWrongEndpointKinds = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []

  edges.forEach((edge, index) => {
    const path = `$.edges[${index}]`
    const expectedKinds = GRAPH_EDGE_ENDPOINT_KINDS[edge.kind]

    const sourceNode = nodeIndex.get(edge.source)
    if (sourceNode && sourceNode.kind !== expectedKinds.source) {
      errors.push(
        makeGraphError(
          'wrong_endpoint_kinds',
          `${path}.source`,
          `edge source kind '${sourceNode.kind}' does not match expected '${expectedKinds.source}' for ${edge.kind}`,
          { edge_id: edge.id, node_id: edge.source },
        ),
      )
    }

    const targetNode = nodeIndex.get(edge.target)
    if (targetNode && targetNode.kind !== expectedKinds.target) {
      errors.push(
        makeGraphError(
          'wrong_endpoint_kinds',
          `${path}.target`,
          `edge target kind '${targetNode.kind}' does not match expected '${expectedKinds.target}' for ${edge.kind}`,
          { edge_id: edge.id, node_id: edge.target },
        ),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateInvalidAliasTargets = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []

  edges.forEach((edge, index) => {
    if (edge.kind !== 'resolves_to') return

    const path = `$.edges[${index}].target`
    const targetNode = nodeIndex.get(edge.target)

    if (!targetNode || targetNode.kind !== 'descriptor') {
      errors.push(
        makeGraphError(
          'invalid_alias_targets',
          path,
          `alias resolves_to target must be a descriptor node, got: ${edge.target}`,
          { edge_id: edge.id, node_id: edge.target },
        ),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateInvalidSubfamilySimilarityEndpoints = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []

  edges.forEach((edge, index) => {
    if (edge.kind !== 'similar_to') return

    const path = `$.edges[${index}]`
    const sourceNode = nodeIndex.get(edge.source)
    const targetNode = nodeIndex.get(edge.target)

    if (!sourceNode || sourceNode.kind !== 'subfamily') {
      errors.push(
        makeGraphError(
          'invalid_subfamily_similarity_endpoints',
          `${path}.source`,
          `similar_to source must be a subfamily node, got: ${edge.source}`,
          { edge_id: edge.id, node_id: edge.source },
        ),
      )
    }

    if (!targetNode || targetNode.kind !== 'subfamily') {
      errors.push(
        makeGraphError(
          'invalid_subfamily_similarity_endpoints',
          `${path}.target`,
          `similar_to target must be a subfamily node, got: ${edge.target}`,
          { edge_id: edge.id, node_id: edge.target },
        ),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const STAT_KEYS: readonly (keyof GraphStats)[] = [
  'families',
  'subfamilies',
  'descriptors',
  'aliases',
  'subfamily_similarity_edges',
]

const validateStatsReconciliation = (graph: OlfactoryGraph): GraphValidationResult => {
  const errors: ReturnType<typeof makeGraphError>[] = []
  const derived = deriveStatsFromGraph(graph)

  for (const key of STAT_KEYS) {
    if (graph.stats[key] !== derived[key]) {
      errors.push(
        makeGraphError(
          'inconsistent_stats',
          `$.stats.${key}`,
          `stats.${key} (${graph.stats[key]}) does not match actual count (${derived[key]})`,
        ),
      )
    }
  }

  return { ok: errors.length === 0, errors, warnings: [] }
}

export const validateOlfactoryGraph = (graph: OlfactoryGraph): GraphValidationResult => {
  const duplicateNodeResult = validateDuplicateNodeIds(graph.nodes)
  const duplicateEdgeResult = validateDuplicateEdgeIds(graph.edges)
  const nodeIndex = buildNodeIndex(graph.nodes)

  return combineGraphResults(
    duplicateNodeResult,
    duplicateEdgeResult,
    validateMissingEdgeEndpoints(graph.edges, nodeIndex),
    validateWrongEndpointKinds(graph.edges, nodeIndex),
    validateInvalidAliasTargets(graph.edges, nodeIndex),
    validateInvalidSubfamilySimilarityEndpoints(graph.edges, nodeIndex),
    validateStatsReconciliation(graph),
  )
}
