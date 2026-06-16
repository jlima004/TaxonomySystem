import {
  GRAPH_SCHEMA_VERSION,
  GRAPH_VALIDATION_CODE_TO_INVARIANT_ID,
  type GraphExpectedBaselineStats,
  type GraphInvariantId,
  type GraphValidationErrorCode,
} from './contract.js'
import type { GraphValidationError, JsonValue } from './types.js'
import { makeGraphError } from './types.js'

export type GraphValidationErrorOptions = {
  readonly invariant_id?: GraphInvariantId
  readonly node_id?: string
  readonly edge_id?: string
  readonly expected?: JsonValue
  readonly actual?: JsonValue
}

const VALIDATION_INVARIANT_LOOKUP: Partial<
  Record<GraphValidationErrorCode, GraphInvariantId>
> = GRAPH_VALIDATION_CODE_TO_INVARIANT_ID

const resolveInvariantId = (
  code: GraphValidationErrorCode,
  invariantId?: GraphInvariantId,
): GraphInvariantId | undefined =>
  invariantId ?? VALIDATION_INVARIANT_LOOKUP[code]

export const makeGraphValidationError = (
  code: GraphValidationErrorCode,
  path: string,
  message: string,
  options: GraphValidationErrorOptions = {},
): GraphValidationError => {
  const normalizedOptions: Parameters<typeof makeGraphError>[3] = {}
  const invariantId = resolveInvariantId(code, options.invariant_id)

  if (invariantId !== undefined) {
    normalizedOptions.invariant_id = invariantId
  }
  if (options.node_id !== undefined) {
    normalizedOptions.node_id = options.node_id
  }
  if (options.edge_id !== undefined) {
    normalizedOptions.edge_id = options.edge_id
  }
  if (options.expected !== undefined) {
    normalizedOptions.expected = options.expected
  }
  if (options.actual !== undefined) {
    normalizedOptions.actual = options.actual
  }

  return makeGraphError(code, path, message, normalizedOptions)
}

export const makeInvalidSchemaVersionError = (
  actualSchemaVersion: string,
): GraphValidationError =>
  makeGraphValidationError(
    'invalid_schema_version',
    '$.schema_version',
    `expected ${GRAPH_SCHEMA_VERSION}, got ${String(actualSchemaVersion)}`,
    {
      expected: { schema_version: GRAPH_SCHEMA_VERSION },
      actual: { schema_version: actualSchemaVersion },
    },
  )

export const makeInvalidGraphIdError = (
  path: string,
  graphId: string,
  expected: JsonValue,
): GraphValidationError =>
  makeGraphValidationError(
    'invalid_graph_id',
    path,
    `graph_id is invalid: ${graphId}`,
    {
      expected,
      actual: { graph_id: graphId },
    },
  )

export const makeDuplicateNodeIdError = (
  path: string,
  nodeId: string,
): GraphValidationError =>
  makeGraphValidationError(
    'duplicate_node_id_detection',
    path,
    `duplicate node id: ${nodeId}`,
    {
      node_id: nodeId,
      expected: { unique_node_id: true },
      actual: { node_id: nodeId },
    },
  )

export const makeDuplicateEdgeIdError = (
  path: string,
  edgeId: string,
): GraphValidationError =>
  makeGraphValidationError(
    'duplicate_edge_id_detection',
    path,
    `duplicate edge id: ${edgeId}`,
    {
      edge_id: edgeId,
      expected: { unique_edge_id: true },
      actual: { edge_id: edgeId },
    },
  )

export const makeMissingEdgeEndpointError = (
  path: string,
  edgeId: string,
  endpoint: 'source' | 'target',
  graphId: string,
): GraphValidationError =>
  makeGraphValidationError(
    'missing_edge_endpoints',
    path,
    `missing edge ${endpoint} node: ${graphId}`,
    {
      edge_id: edgeId,
      expected: { endpoint, existing_node: true },
      actual: { endpoint, graph_id: graphId },
    },
  )

export const makeWrongEndpointKindError = (
  path: string,
  edgeId: string,
  edgeKind: string,
  actualKind: string,
  expectedKind: string,
  nodeId?: string,
): GraphValidationError =>
  makeGraphValidationError(
    'wrong_endpoint_kinds',
    path,
    `edge endpoint kind '${actualKind}' does not match expected '${expectedKind}' for ${edgeKind}`,
    {
      edge_id: edgeId,
      ...(nodeId !== undefined ? { node_id: nodeId } : {}),
      expected: { edge_kind: edgeKind, endpoint_kind: expectedKind },
      actual: { edge_kind: edgeKind, endpoint_kind: actualKind },
    },
  )

export const makeInvalidAliasTargetError = (
  path: string,
  edgeId: string,
  targetNodeId: string,
): GraphValidationError =>
  makeGraphValidationError(
    'invalid_alias_targets',
    path,
    `alias resolves_to target must be a descriptor node, got: ${targetNodeId}`,
    {
      edge_id: edgeId,
      node_id: targetNodeId,
      expected: { target_kind: 'descriptor' },
      actual: { target_graph_id: targetNodeId },
    },
  )

export const makeInvalidSimilarityEndpointError = (
  path: string,
  edgeId: string,
  endpoint: 'source' | 'target',
  graphId: string,
): GraphValidationError =>
  makeGraphValidationError(
    'invalid_subfamily_similarity_endpoints',
    path,
    `similar_to ${endpoint} must be a subfamily node, got: ${graphId}`,
    {
      edge_id: edgeId,
      node_id: graphId,
      expected: { endpoint, node_kind: 'subfamily' },
      actual: { endpoint, graph_id: graphId },
    },
  )

export const makeInconsistentStatsError = (
  statKey: keyof GraphExpectedBaselineStats,
  actualCount: number,
  expectedCount: number,
): GraphValidationError =>
  makeGraphValidationError(
    'inconsistent_stats',
    `$.stats.${statKey}`,
    `stats.${statKey} (${actualCount}) does not match actual count (${expectedCount})`,
    {
      expected: { [statKey]: expectedCount },
      actual: { [statKey]: actualCount },
    },
  )

export const makeProfileBaselineMismatchError = (
  statKey: keyof GraphExpectedBaselineStats,
  actualCount: number,
  expectedCount: number,
): GraphValidationError =>
  makeGraphValidationError(
    'profile_baseline_mismatch',
    `$.stats.${statKey}`,
    `sanctioned profile expected ${statKey}=${expectedCount}, got ${actualCount}`,
    {
      expected: { [statKey]: expectedCount },
      actual: { [statKey]: actualCount },
    },
  )

export const makeGraphNotValidatedError = (reason: string): GraphValidationError =>
  makeGraphValidationError(
    'graph_not_validated',
    '$',
    `graph must be validated before query consumption: ${reason}`,
    {
      expected: { validated_graph: true },
      actual: { reason },
    },
  )
