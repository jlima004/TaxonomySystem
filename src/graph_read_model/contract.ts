export const GRAPH_SCHEMA_VERSION = 'olfactory_graph_read_model.v1' as const

export const GRAPH_NODE_KINDS = ['family', 'subfamily', 'descriptor', 'alias'] as const

export const GRAPH_EDGE_KINDS = ['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'] as const

export const GRAPH_ID_PREFIXES = ['family:', 'subfamily:', 'descriptor:', 'alias:'] as const

export const GRAPH_FORBIDDEN_NODE_PREFIXES = [
  'material:',
  'molecule:',
  'pubchem:',
  'review_item:',
  'score:',
  'graphify:',
  'neo4j:',
] as const

export const GRAPH_EDGE_ID_FORMAT = 'edge:<edge_kind>:<source_graph_id>-><target_graph_id>' as const

export const GRAPH_NODE_REQUIRED_PROPERTIES = {
  family: ['family_id', 'name'],
  subfamily: ['subfamily_id', 'family_id', 'name'],
  descriptor: ['descriptor_id', 'family_id', 'subfamily_id', 'source', 'frequency', 'status', 'review_required', 'corpus_derived'],
  alias: ['alias', 'target_descriptor_id'],
} as const

export const GRAPH_EDGE_REQUIRED_PROPERTIES = {
  contains_subfamily: ['family_id', 'subfamily_id'],
  contains_descriptor: ['subfamily_id', 'descriptor_id'],
  resolves_to: ['alias', 'target_descriptor_id'],
  similar_to: ['source_subfamily_id', 'target_subfamily_id', 'score', 'dimensions', 'evidence'],
} as const

export const GRAPH_EDGE_OPTIONAL_PROPERTIES = {
  contains_subfamily: [],
  contains_descriptor: [],
  resolves_to: [],
  similar_to: ['final_score'],
} as const

export const GRAPH_EDGE_ENDPOINT_KINDS = {
  contains_subfamily: { source: 'family', target: 'subfamily' },
  contains_descriptor: { source: 'subfamily', target: 'descriptor' },
  resolves_to: { source: 'alias', target: 'descriptor' },
  similar_to: { source: 'subfamily', target: 'subfamily' },
} as const

export const GRAPH_ALLOWED_PRODUCTION_INPUTS = [
  'data/compiled/v2/taxonomy.json',
  'data/compiled/v2/descriptor_aliases.json',
  'data/compiled/v2/similarity_matrix.json',
] as const

export const GRAPH_OUTPUT_POLICY = {
  sanctioned_output_path: 'data/read-models/olfactory-graph/v2.11/',
  verification_only_support_path: '/tmp',
  verification_only_support_policy: '/tmp is verification-only support and must not become the source-of-truth graph output.',
  forbidden_output_prefixes: ['data/compiled/', 'data/taxonomy/', 'data/inference/', 'graphify-out/'],
} as const

export const GRAPH_PHASE_56_INVARIANTS = [
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
] as const

export const GRAPH_VALIDATION_ERROR_CODES = [
  'invalid_schema_version',
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
  'inconsistent_stats',
  'invalid_graph_id',
  'profile_baseline_mismatch',
  'graph_not_validated',
] as const

export const GRAPH_INVARIANT_IDS = [
  'schema_version_match',
  'duplicate_node_id_detection',
  'duplicate_edge_id_detection',
  'missing_edge_endpoints',
  'wrong_endpoint_kinds',
  'invalid_alias_targets',
  'invalid_subfamily_similarity_endpoints',
  'graph_id_parse',
  'profile_baseline_match',
  'graph_validation_required',
] as const

export const GRAPH_VALIDATION_CODE_TO_INVARIANT_ID = {
  invalid_schema_version: 'schema_version_match',
  duplicate_node_id_detection: 'duplicate_node_id_detection',
  duplicate_edge_id_detection: 'duplicate_edge_id_detection',
  missing_edge_endpoints: 'missing_edge_endpoints',
  wrong_endpoint_kinds: 'wrong_endpoint_kinds',
  invalid_alias_targets: 'invalid_alias_targets',
  invalid_subfamily_similarity_endpoints: 'invalid_subfamily_similarity_endpoints',
  invalid_graph_id: 'graph_id_parse',
  profile_baseline_mismatch: 'profile_baseline_match',
  graph_not_validated: 'graph_validation_required',
} as const

export const GRAPH_ID_PARSE_ERROR_CODES = [
  'empty_graph_id',
  'unknown_graph_id_prefix',
  'ambiguous_graph_id_format',
] as const

export const GRAPH_VALIDATION_PROFILE_IDS = ['sanctioned_v2.11'] as const

export const GRAPH_EXPECTED_BASELINE_STATS = {
  families: 10,
  subfamilies: 18,
  descriptors: 341,
  aliases: 18,
  subfamily_similarity_edges: 13,
} as const

export const SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE = {
  profile_id: 'sanctioned_v2.11',
  schema_version: GRAPH_SCHEMA_VERSION,
  expected_stats: GRAPH_EXPECTED_BASELINE_STATS,
} as const

export type GraphSchemaVersion = typeof GRAPH_SCHEMA_VERSION
export type GraphNodeKind = (typeof GRAPH_NODE_KINDS)[number]
export type GraphEdgeKind = (typeof GRAPH_EDGE_KINDS)[number]
export type GraphIdPrefix = (typeof GRAPH_ID_PREFIXES)[number]
export type GraphForbiddenNodePrefix = (typeof GRAPH_FORBIDDEN_NODE_PREFIXES)[number]
export type GraphEdgeIdFormat = typeof GRAPH_EDGE_ID_FORMAT
export type GraphNodeRequiredProperties = typeof GRAPH_NODE_REQUIRED_PROPERTIES
export type GraphEdgeRequiredProperties = typeof GRAPH_EDGE_REQUIRED_PROPERTIES
export type GraphEdgeOptionalProperties = typeof GRAPH_EDGE_OPTIONAL_PROPERTIES
export type GraphEdgeEndpointKinds = typeof GRAPH_EDGE_ENDPOINT_KINDS
export type GraphAllowedProductionInput = (typeof GRAPH_ALLOWED_PRODUCTION_INPUTS)[number]
export type GraphOutputPolicy = typeof GRAPH_OUTPUT_POLICY
export type GraphPhase56Invariant = (typeof GRAPH_PHASE_56_INVARIANTS)[number]
export type GraphValidationErrorCode = (typeof GRAPH_VALIDATION_ERROR_CODES)[number]
export type GraphInvariantId = (typeof GRAPH_INVARIANT_IDS)[number]
export type GraphValidationCodeToInvariantId = typeof GRAPH_VALIDATION_CODE_TO_INVARIANT_ID
export type GraphIdParseErrorCode = (typeof GRAPH_ID_PARSE_ERROR_CODES)[number]
export type GraphValidationProfileId = (typeof GRAPH_VALIDATION_PROFILE_IDS)[number]
export type GraphExpectedBaselineStats = typeof GRAPH_EXPECTED_BASELINE_STATS
export type SanctionedGraphValidationProfile = typeof SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE

export const OLFACTORY_GRAPH_CONTRACT = {
  schema_version: GRAPH_SCHEMA_VERSION,
  node_kinds: GRAPH_NODE_KINDS,
  edge_kinds: GRAPH_EDGE_KINDS,
  id_prefixes: GRAPH_ID_PREFIXES,
  forbidden_node_prefixes: GRAPH_FORBIDDEN_NODE_PREFIXES,
  edge_id_format: GRAPH_EDGE_ID_FORMAT,
  node_required_properties: GRAPH_NODE_REQUIRED_PROPERTIES,
  edge_required_properties: GRAPH_EDGE_REQUIRED_PROPERTIES,
  edge_optional_properties: GRAPH_EDGE_OPTIONAL_PROPERTIES,
  edge_endpoint_kinds: GRAPH_EDGE_ENDPOINT_KINDS,
  allowed_production_inputs: GRAPH_ALLOWED_PRODUCTION_INPUTS,
  output_policy: GRAPH_OUTPUT_POLICY,
  phase_56_invariants: GRAPH_PHASE_56_INVARIANTS,
  validation_error_codes: GRAPH_VALIDATION_ERROR_CODES,
  invariant_ids: GRAPH_INVARIANT_IDS,
  validation_code_to_invariant_id: GRAPH_VALIDATION_CODE_TO_INVARIANT_ID,
  graph_id_parse_error_codes: GRAPH_ID_PARSE_ERROR_CODES,
  validation_profile_ids: GRAPH_VALIDATION_PROFILE_IDS,
  expected_baseline_stats: GRAPH_EXPECTED_BASELINE_STATS,
  sanctioned_v2_11_validation_profile: SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE,
} as const

export type OlfactoryGraphContract = typeof OLFACTORY_GRAPH_CONTRACT
