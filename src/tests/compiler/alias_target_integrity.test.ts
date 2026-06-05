import { describe, expect, it } from 'vitest'
import { validateAliasTargetIntegrity, type ExceptionPolicy } from '../../compiler/alias_target_integrity.js'

describe('validateAliasTargetIntegrity', () => {
  const validPolicy: ExceptionPolicy = {
    version: '1.0.0',
    schema_version: 'alias_target_exceptions.v1',
    exceptions: [],
  }

  it('Test 1: returns PASS when every alias target resolves to a compiled descriptor ID', () => {
    const seedAliases = { 'alias_a': 'target_a', 'alias_b': 'target_b' }
    const compiledDescriptorIds = new Set(['target_a', 'target_b', 'target_c'])

    const result = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, validPolicy)

    expect(result.status).toBe('PASS')
    expect(result.seed_alias_count).toBe(2)
    expect(result.compiled_descriptor_count).toBe(3)
    expect(result.valid_target_count).toBe(2)
    expect(result.unresolved_target_count).toBe(0)
    expect(result.unresolved).toHaveLength(0)
  })

  it('Test 2: returns FAIL with one unresolved entry when an alias target is absent and no exception matches', () => {
    const seedAliases = { 'alias_a': 'target_a', 'alias_missing': 'target_missing' }
    const compiledDescriptorIds = new Set(['target_a'])

    const result = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, validPolicy)

    expect(result.status).toBe('FAIL')
    expect(result.seed_alias_count).toBe(2)
    expect(result.compiled_descriptor_count).toBe(1)
    expect(result.valid_target_count).toBe(1)
    expect(result.unresolved_target_count).toBe(1)
    expect(result.unresolved).toHaveLength(1)
    expect(result.unresolved[0]).toEqual({
      alias: 'alias_missing',
      target: 'target_missing',
      source: 'data/taxonomy/descriptor_aliases.seed.json',
      exception_status: 'none',
      remediation_hint: 'resolve in Phase 51 by adding target, correcting alias, dropping alias, or documenting an approved exception.',
    })
  })

  it('Test 3: returns PASS for the exact alias-target pair covered by an approved exception entry', () => {
    const seedAliases = { 'alias_a': 'target_a', 'alias_excepted': 'target_missing' }
    const compiledDescriptorIds = new Set(['target_a'])
    
    const policyWithException: ExceptionPolicy = {
      version: '1.0.0',
      schema_version: 'alias_target_exceptions.v1',
      exceptions: [
        {
          alias: 'alias_excepted',
          target: 'target_missing',
          rationale: 'Legacy requirement',
          status: 'approved',
          approved_by: 'Curator',
          milestone: 'v1',
        }
      ],
    }

    const result = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, policyWithException)

    expect(result.status).toBe('PASS')
    expect(result.valid_target_count).toBe(2)
    expect(result.unresolved_target_count).toBe(0)
  })

  it('Test 4: fails closed for malformed exception envelopes or malformed exception entries', () => {
    const seedAliases = { 'alias_a': 'target_a' }
    const compiledDescriptorIds = new Set(['target_a'])

    const malformedEnvelope = {
      version: '1.0.0',
      // schema_version missing
      exceptions: [],
    }

    const result1 = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, malformedEnvelope)
    expect(result1.status).toBe('FAIL')
    expect(result1.unresolved[0]?.exception_status).toBe('malformed_policy')

    const malformedEntry = {
      version: '1.0.0',
      schema_version: 'alias_target_exceptions.v1',
      exceptions: [
        {
          alias: 'alias_excepted',
          // target missing
          rationale: 'Reason',
          status: 'approved',
        }
      ],
    }

    const result2 = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, malformedEntry)
    expect(result2.status).toBe('FAIL')
    expect(result2.unresolved[0]?.exception_status).toBe('malformed_policy')
  })
})
