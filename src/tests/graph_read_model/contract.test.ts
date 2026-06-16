import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  GRAPH_ALLOWED_PRODUCTION_INPUTS,
  GRAPH_EDGE_ENDPOINT_KINDS,
  GRAPH_EDGE_ID_FORMAT,
  GRAPH_ID_PARSE_ERROR_CODES,
  GRAPH_EDGE_KINDS,
  GRAPH_EDGE_OPTIONAL_PROPERTIES,
  GRAPH_EDGE_REQUIRED_PROPERTIES,
  GRAPH_EXPECTED_BASELINE_STATS,
  GRAPH_FORBIDDEN_NODE_PREFIXES,
  GRAPH_ID_PREFIXES,
  GRAPH_INVARIANT_IDS,
  GRAPH_NODE_KINDS,
  GRAPH_NODE_REQUIRED_PROPERTIES,
  GRAPH_OUTPUT_POLICY,
  GRAPH_PHASE_56_INVARIANTS,
  GRAPH_SCHEMA_VERSION,
  GRAPH_VALIDATION_CODE_TO_INVARIANT_ID,
  GRAPH_VALIDATION_ERROR_CODES,
  GRAPH_VALIDATION_PROFILE_IDS,
  OLFACTORY_GRAPH_CONTRACT,
  SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE,
} from '../../graph_read_model/contract.js'
import { makeGraphError } from '../../graph_read_model/types.js'

const contractSourcePath = join(process.cwd(), 'graph_read_model', 'contract.ts')
const docsPath = join(process.cwd(), '..', 'docs', 'olfactory_graph_contract.md')
const buildGraphSourcePath = join(process.cwd(), 'graph_read_model', 'build_graph.ts')
const queryGraphSourcePath = join(process.cwd(), 'graph_read_model', 'query_graph.ts')
const validateGraphSourcePath = join(process.cwd(), 'graph_read_model', 'validate_graph.ts')
const validationErrorsSourcePath = join(process.cwd(), 'graph_read_model', 'validation_errors.ts')

const stripComments = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')

describe('olfactory graph contract', () => {
  it('locks exact GCON-01 schema values', () => {
    expect(GRAPH_SCHEMA_VERSION).toBe('olfactory_graph_read_model.v1')
    expect(GRAPH_NODE_KINDS).toEqual(['family', 'subfamily', 'descriptor', 'alias'])
    expect(GRAPH_EDGE_KINDS).toEqual(['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'])
    expect(GRAPH_EDGE_ID_FORMAT).toBe('edge:<edge_kind>:<source_graph_id>-><target_graph_id>')
    expect(GRAPH_NODE_REQUIRED_PROPERTIES).toEqual({
      family: ['family_id', 'name'],
      subfamily: ['subfamily_id', 'family_id', 'name'],
      descriptor: ['descriptor_id', 'family_id', 'subfamily_id', 'source', 'frequency', 'status', 'review_required', 'corpus_derived'],
      alias: ['alias', 'target_descriptor_id'],
    })
    expect(GRAPH_EDGE_REQUIRED_PROPERTIES).toEqual({
      contains_subfamily: ['family_id', 'subfamily_id'],
      contains_descriptor: ['subfamily_id', 'descriptor_id'],
      resolves_to: ['alias', 'target_descriptor_id'],
      similar_to: ['source_subfamily_id', 'target_subfamily_id', 'score', 'dimensions', 'evidence'],
    })
    expect(GRAPH_EDGE_OPTIONAL_PROPERTIES).toEqual({
      contains_subfamily: [],
      contains_descriptor: [],
      resolves_to: [],
      similar_to: ['final_score'],
    })
    expect(GRAPH_EDGE_ENDPOINT_KINDS).toEqual({
      contains_subfamily: { source: 'family', target: 'subfamily' },
      contains_descriptor: { source: 'subfamily', target: 'descriptor' },
      resolves_to: { source: 'alias', target: 'descriptor' },
      similar_to: { source: 'subfamily', target: 'subfamily' },
    })
    expect(GRAPH_PHASE_56_INVARIANTS).toEqual([
      'duplicate_node_id_detection',
      'duplicate_edge_id_detection',
      'missing_edge_endpoints',
      'wrong_endpoint_kinds',
      'invalid_alias_targets',
      'invalid_subfamily_similarity_endpoints',
    ])
  })

  it('locks exact GCON-02 production inputs with no fourth input', () => {
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).toEqual([
      'data/compiled/v2/taxonomy.json',
      'data/compiled/v2/descriptor_aliases.json',
      'data/compiled/v2/similarity_matrix.json',
    ])
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).toHaveLength(3)
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).not.toContain('data/enriched_materials.json')
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).not.toContain('data/taxonomy/')
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).not.toContain('data/inference/')
    expect(GRAPH_ALLOWED_PRODUCTION_INPUTS).not.toContain('graphify-out/')
  })

  it('locks exact GCON-03 ID prefixes and known collision examples', () => {
    expect(GRAPH_ID_PREFIXES).toEqual(['family:', 'subfamily:', 'descriptor:', 'alias:'])
    expect(GRAPH_FORBIDDEN_NODE_PREFIXES).toEqual([
      'material:',
      'molecule:',
      'pubchem:',
      'review_item:',
      'score:',
      'graphify:',
      'neo4j:',
    ])

    expect('family:floral').not.toBe('descriptor:floral')
    expect('subfamily:amber').not.toBe('descriptor:amber')
    expect('family:fresh_spice').not.toBe('subfamily:fresh_spice')
  })

  it('locks exact GCON-04 output policy and baseline stats', () => {
    expect(GRAPH_OUTPUT_POLICY).toEqual({
      sanctioned_output_path: 'data/read-models/olfactory-graph/v2.11/',
      verification_only_support_path: '/tmp',
      verification_only_support_policy: '/tmp is verification-only support and must not become the source-of-truth graph output.',
      forbidden_output_prefixes: ['data/compiled/', 'data/taxonomy/', 'data/inference/', 'graphify-out/'],
    })
    expect(GRAPH_OUTPUT_POLICY.forbidden_output_prefixes).toHaveLength(4)
    expect(GRAPH_EXPECTED_BASELINE_STATS).toEqual({
      families: 10,
      subfamilies: 18,
      descriptors: 341,
      aliases: 18,
      subfamily_similarity_edges: 13,
    })
  })

  it('locks D-05 D-06 D-07 D-08 and D-12 validation vocabularies and sanctioned profile', () => {
    expect(GRAPH_VALIDATION_ERROR_CODES).toEqual([
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
    ])
    expect(GRAPH_INVARIANT_IDS).toEqual([
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
    ])
    expect(GRAPH_VALIDATION_CODE_TO_INVARIANT_ID).toEqual({
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
    })
    expect(GRAPH_ID_PARSE_ERROR_CODES).toEqual([
      'empty_graph_id',
      'unknown_graph_id_prefix',
      'ambiguous_graph_id_format',
    ])
    expect(GRAPH_VALIDATION_PROFILE_IDS).toEqual(['sanctioned_v2.11'])
    expect(SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE).toEqual({
      profile_id: 'sanctioned_v2.11',
      schema_version: 'olfactory_graph_read_model.v1',
      expected_stats: {
        families: 10,
        subfamilies: 18,
        descriptors: 341,
        aliases: 18,
        subfamily_similarity_edges: 13,
      },
    })
  })

  it('exports a stable aggregate contract', () => {
    expect(OLFACTORY_GRAPH_CONTRACT).toEqual({
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
    })
  })

  it('keeps D-14 and D-15 payloads JSON-safe and makeGraphError structurally compatible', async () => {
    const source = await readFile(contractSourcePath.replace('contract.ts', 'types.ts'), 'utf8')

    expect(source).toContain('export type JsonValue = JsonPrimitive | JsonObject | JsonArray')
    expect(source).toContain('readonly invariant_id?: GraphInvariantId')
    expect(source).toContain('readonly expected?: JsonValue')
    expect(source).toContain('readonly actual?: JsonValue')
    expect(source).not.toContain('expected?: unknown')
    expect(source).not.toContain('actual?: unknown')

    expect(
      makeGraphError('invalid_schema_version', '.schema_version', 'schema mismatch', {
        invariant_id: 'schema_version_match',
        expected: { schema_version: 'olfactory_graph_read_model.v1' },
        actual: { schema_version: 'unexpected.v0' },
      }),
    ).toEqual({
      code: 'invalid_schema_version',
      path: '$.schema_version',
      message: 'schema mismatch',
      invariant_id: 'schema_version_match',
      expected: { schema_version: 'olfactory_graph_read_model.v1' },
      actual: { schema_version: 'unexpected.v0' },
    })
  })

  it('keeps the Phase 55 contract source free from builder and runtime identifiers', async () => {
    const source = await readFile(contractSourcePath, 'utf8')

    expect(source).not.toMatch(/buildGraph|loadGraph|writeGraph|validateGraph/)
    expect(source).not.toMatch(/createReadStream|readFile\(|writeFile\(/)
    expect(source).not.toMatch(/from 'node:fs'|from "node:fs"/)
    expect(source).not.toContain('graphify-out/GRAPH_REPORT')
    expect(source).not.toContain('neo4j-driver')
    expect(source).not.toContain('GraphDatabase')
    expect(source).not.toContain('driver.session')
  })

  it('requires the maintainer contract document with exact boundary content', async () => {
    const content = await readFile(docsPath, 'utf8')

    expect(content.length).toBeGreaterThan(0)
    expect(content).toContain('olfactory_graph_read_model.v1')
    expect(content).toContain('data/compiled/v2/taxonomy.json')
    expect(content).toContain('data/compiled/v2/descriptor_aliases.json')
    expect(content).toContain('data/compiled/v2/similarity_matrix.json')
    expect(content).toContain('data/read-models/olfactory-graph/v2.11/')
    expect(content).toContain('/tmp is verification-only support')
    expect(content).toContain('graphify-out/')
    expect(content).toContain('material:')
    expect(content).toContain('neo4j:')
    expect(content).toContain('No builder')
    expect(content).toContain('No writer')
    expect(content).toContain('No CLI')
    expect(content).toContain('No generated graph')
    expect(content).toContain('No structural validator')
    expect(content).toContain('No Neo4J or database')
    expect(content).toContain('No runtime')
    expect(content).toContain('Phase 56 consumes invariant names')
    expect(content).toContain('duplicate_node_id_detection')
    expect(content).toContain('13 subfamily-similarity edges')
    expect(content).toContain('Zero-Mutation Statement')
    expect(content).toContain('Phase 55 apenas declara paths, valores e regras.')
  })

  it('guards against drift back to local graph ID helpers and regex prefix stripping', async () => {
    const [buildSource, querySource] = await Promise.all([
      readFile(buildGraphSourcePath, 'utf8'),
      readFile(queryGraphSourcePath, 'utf8'),
    ])
    const buildCode = stripComments(buildSource)
    const queryCode = stripComments(querySource)

    expect(buildCode).toContain("from './graph_id.js'")
    expect(queryCode).toContain("from './graph_id.js'")

    for (const helperName of ['familyNodeId', 'subfamilyNodeId', 'descriptorNodeId', 'aliasNodeId']) {
      expect(buildCode).not.toMatch(new RegExp(`const\\s+${helperName}\\s*=`))
      expect(queryCode).not.toMatch(new RegExp(`const\\s+${helperName}\\s*=`))
      expect(buildCode).not.toMatch(new RegExp(`function\\s+${helperName}\\s*\\(`))
      expect(queryCode).not.toMatch(new RegExp(`function\\s+${helperName}\\s*\\(`))
    }

    expect(queryCode).not.toContain('replace(/^subfamily:/')
  })

  it('keeps observable validation code vocabulary centralized in contract or factories', async () => {
    const [validateSource, validationErrorsSource] = await Promise.all([
      readFile(validateGraphSourcePath, 'utf8'),
      readFile(validationErrorsSourcePath, 'utf8'),
    ])
    const validateCode = stripComments(validateSource)
    const validationErrorsCode = stripComments(validationErrorsSource)

    expect(validationErrorsCode).toContain('makeInvalidGraphIdError')
    expect(validationErrorsCode).toContain('makeProfileBaselineMismatchError')

    expect(validateCode).not.toContain('makeGraphError(')
    expect(validateCode).not.toContain("code: 'invalid_graph_id'")
    expect(validateCode).not.toContain("code: 'profile_baseline_mismatch'")

    expect(validateCode).toContain('makeGraphValidationError(')
    expect(validateCode).toContain("'invalid_graph_id'")
  })
})
