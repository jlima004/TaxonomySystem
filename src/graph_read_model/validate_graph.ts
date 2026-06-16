import {
  SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE,
  GRAPH_EDGE_ENDPOINT_KINDS,
  GRAPH_SCHEMA_VERSION,
  type GraphNodeKind,
} from './contract.js'
import {
  isAliasGraphId,
  isDescriptorGraphId,
  isFamilyGraphId,
  isSubfamilyGraphId,
  parseGraphId,
} from './graph_id.js'
import type {
  GraphEdge,
  GraphNode,
  GraphStats,
  GraphValidationProfile,
  GraphValidationResult,
  OlfactoryGraph,
} from './types.js'
import { combineGraphResults } from './types.js'
import {
  makeDuplicateEdgeIdError,
  makeDuplicateNodeIdError,
  makeGraphValidationError,
  makeInconsistentStatsError,
  makeInvalidAliasTargetError,
  makeInvalidGraphIdError,
  makeInvalidSchemaVersionError,
  makeInvalidSimilarityEndpointError,
  makeMissingEdgeEndpointError,
  makeProfileBaselineMismatchError,
  makeWrongEndpointKindError,
} from './validation_errors.js'

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

const validateSchemaVersion = (graph: OlfactoryGraph): GraphValidationResult => {
  if (graph.schema_version !== GRAPH_SCHEMA_VERSION) {
    return {
      ok: false,
      errors: [
        makeInvalidSchemaVersionError(String(graph.schema_version)),
      ],
      warnings: [],
    }
  }

  return { ok: true, errors: [], warnings: [] }
}

const validateDuplicateNodeIds = (nodes: readonly GraphNode[]): GraphValidationResult => {
  const errors: GraphValidationResult['errors'][number][] = []
  const seen = new Set<string>()

  nodes.forEach((node, index) => {
    if (seen.has(node.id)) {
      errors.push(
        makeDuplicateNodeIdError(`$.nodes[${index}].id`, node.id),
      )
    } else {
      seen.add(node.id)
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateDuplicateEdgeIds = (edges: readonly GraphEdge[]): GraphValidationResult => {
  const errors: GraphValidationResult['errors'][number][] = []
  const seen = new Set<string>()

  edges.forEach((edge, index) => {
    if (seen.has(edge.id)) {
      errors.push(
        makeDuplicateEdgeIdError(`$.edges[${index}].id`, edge.id),
      )
    } else {
      seen.add(edge.id)
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateNodeGraphIds = (nodes: readonly GraphNode[]): GraphValidationResult => {
  const errors: GraphValidationResult['errors'][number][] = []

  nodes.forEach((node, index) => {
    const path = `$.nodes[${index}].id`
    const parsed = parseGraphId(node.id)
    if (!parsed.ok) {
      errors.push(
        makeGraphValidationError(
          'invalid_graph_id',
          path,
          `node graph_id is invalid: ${node.id}`,
          {
            expected: parsed.error.expected,
            actual: parsed.error.actual,
            node_id: node.id,
          },
        ),
      )
      return
    }

    const matchesKind =
      (node.kind === 'family' && isFamilyGraphId(node.id)) ||
      (node.kind === 'subfamily' && isSubfamilyGraphId(node.id)) ||
      (node.kind === 'descriptor' && isDescriptorGraphId(node.id)) ||
      (node.kind === 'alias' && isAliasGraphId(node.id))

    if (!matchesKind) {
      errors.push(
        makeGraphValidationError(
          'invalid_graph_id',
          path,
          `node kind '${node.kind}' does not match graph id prefix for ${node.id}`,
          {
            expected: { node_kind: node.kind, matching_prefix: true },
            actual: { node_kind: node.kind, graph_id: node.id, parsed_kind: parsed.kind },
            node_id: node.id,
          },
        ),
      )
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
  const errors: GraphValidationResult['errors'][number][] = []

  edges.forEach((edge, index) => {
    const path = `$.edges[${index}]`

    if (!nodeIndex.has(edge.source)) {
      errors.push(
        makeMissingEdgeEndpointError(`${path}.source`, edge.id, 'source', edge.source),
      )
    }

    if (!nodeIndex.has(edge.target)) {
      errors.push(
        makeMissingEdgeEndpointError(`${path}.target`, edge.id, 'target', edge.target),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateWrongEndpointKinds = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: GraphValidationResult['errors'][number][] = []

  edges.forEach((edge, index) => {
    const path = `$.edges[${index}]`
    const parsedSource = parseGraphId(edge.source)
    const parsedTarget = parseGraphId(edge.target)

    if (!parsedSource.ok) {
      errors.push(
        makeGraphValidationError(
          'invalid_graph_id',
          `${path}.source`,
          `edge source graph_id is invalid: ${edge.source}`,
          {
            expected: parsedSource.error.expected,
            actual: parsedSource.error.actual,
            edge_id: edge.id,
            node_id: edge.source,
          },
        ),
      )
    }

    if (!parsedTarget.ok) {
      errors.push(
        makeGraphValidationError(
          'invalid_graph_id',
          `${path}.target`,
          `edge target graph_id is invalid: ${edge.target}`,
          {
            expected: parsedTarget.error.expected,
            actual: parsedTarget.error.actual,
            edge_id: edge.id,
            node_id: edge.target,
          },
        ),
      )
    }

    const expectedKinds = GRAPH_EDGE_ENDPOINT_KINDS[edge.kind as keyof typeof GRAPH_EDGE_ENDPOINT_KINDS]

    if (!expectedKinds) {
      errors.push(
        makeWrongEndpointKindError(
          `${path}.kind`,
          edge.id,
          edge.kind,
          edge.kind,
          'known_edge_kind',
        ),
      )
      return
    }

    if (!parsedSource.ok || !parsedTarget.ok) {
      return
    }

    const sourceNode = nodeIndex.get(edge.source)
    if (sourceNode && sourceNode.kind !== expectedKinds.source) {
      errors.push(
        makeWrongEndpointKindError(
          `${path}.source`,
          edge.id,
          edge.kind,
          sourceNode.kind,
          expectedKinds.source,
          edge.source,
        ),
      )
    }

    const targetNode = nodeIndex.get(edge.target)
    if (targetNode && targetNode.kind !== expectedKinds.target) {
      errors.push(
        makeWrongEndpointKindError(
          `${path}.target`,
          edge.id,
          edge.kind,
          targetNode.kind,
          expectedKinds.target,
          edge.target,
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
  const errors: GraphValidationResult['errors'][number][] = []

  edges.forEach((edge, index) => {
    if (edge.kind !== 'resolves_to') return

    const path = `$.edges[${index}].target`
    const targetNode = nodeIndex.get(edge.target)

    if (!targetNode || targetNode.kind !== 'descriptor') {
      errors.push(
        makeInvalidAliasTargetError(path, edge.id, edge.target),
      )
    }
  })

  return { ok: errors.length === 0, errors, warnings: [] }
}

const validateInvalidSubfamilySimilarityEndpoints = (
  edges: readonly GraphEdge[],
  nodeIndex: Map<string, GraphNode>,
): GraphValidationResult => {
  const errors: GraphValidationResult['errors'][number][] = []

  edges.forEach((edge, index) => {
    if (edge.kind !== 'similar_to') return

    const path = `$.edges[${index}]`
    const sourceNode = nodeIndex.get(edge.source)
    const targetNode = nodeIndex.get(edge.target)

    if (!sourceNode || sourceNode.kind !== 'subfamily') {
      errors.push(
        makeInvalidSimilarityEndpointError(`${path}.source`, edge.id, 'source', edge.source),
      )
    }

    if (!targetNode || targetNode.kind !== 'subfamily') {
      errors.push(
        makeInvalidSimilarityEndpointError(`${path}.target`, edge.id, 'target', edge.target),
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
  const errors: GraphValidationResult['errors'][number][] = []
  const derived = deriveStatsFromGraph(graph)

  for (const key of STAT_KEYS) {
    if (graph.stats[key] !== derived[key]) {
      errors.push(
        makeInconsistentStatsError(key, graph.stats[key], derived[key]),
      )
    }
  }

  return { ok: errors.length === 0, errors, warnings: [] }
}

export const validateOlfactoryGraphStructure = (graph: OlfactoryGraph): GraphValidationResult => {
  const schemaVersionResult = validateSchemaVersion(graph)
  const nodeGraphIdResult = validateNodeGraphIds(graph.nodes)
  const duplicateNodeResult = validateDuplicateNodeIds(graph.nodes)
  const duplicateEdgeResult = validateDuplicateEdgeIds(graph.edges)
  const nodeIndex = buildNodeIndex(graph.nodes)

  return combineGraphResults(
    schemaVersionResult,
    nodeGraphIdResult,
    duplicateNodeResult,
    duplicateEdgeResult,
    validateMissingEdgeEndpoints(graph.edges, nodeIndex),
    validateWrongEndpointKinds(graph.edges, nodeIndex),
    validateInvalidAliasTargets(graph.edges, nodeIndex),
    validateInvalidSubfamilySimilarityEndpoints(graph.edges, nodeIndex),
    validateStatsReconciliation(graph),
  )
}

export const validateOlfactoryGraphAgainstProfile = (
  graph: OlfactoryGraph,
  profile: GraphValidationProfile,
): GraphValidationResult => {
  const structuralResult = validateOlfactoryGraphStructure(graph)
  if (!structuralResult.ok) {
    return structuralResult
  }

  const errors: GraphValidationResult['errors'][number][] = []
  if (graph.schema_version !== profile.schema_version) {
    errors.push(makeInvalidSchemaVersionError(String(graph.schema_version)))
  }

  for (const key of Object.keys(profile.expected_stats) as (keyof GraphStats)[]) {
    if (graph.stats[key] !== profile.expected_stats[key]) {
      errors.push(
        makeProfileBaselineMismatchError(key, graph.stats[key], profile.expected_stats[key]),
      )
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: [],
  }
}

export const validateSanctionedV211Graph = (
  graph: OlfactoryGraph,
): GraphValidationResult =>
  validateOlfactoryGraphAgainstProfile(graph, SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE)

export const validateOlfactoryGraph = validateOlfactoryGraphStructure
