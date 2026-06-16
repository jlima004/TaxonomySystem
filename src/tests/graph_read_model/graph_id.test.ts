import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  isAliasGraphId,
  isDescriptorGraphId,
  isFamilyGraphId,
  isSubfamilyGraphId,
  makeAliasGraphId,
  makeDescriptorGraphId,
  makeFamilyGraphId,
  makeSubfamilyGraphId,
  parseGraphId,
  stripGraphIdPrefix,
} from '../../graph_read_model/graph_id.js'

const graphIdSourcePath = join(process.cwd(), 'graph_read_model', 'graph_id.ts')

describe('graph id helpers', () => {
  it('covers D-01 and D-02 with exact makers, guards and strip behavior', () => {
    expect(makeFamilyGraphId('floral')).toBe('family:floral')
    expect(makeSubfamilyGraphId('floral_rose')).toBe('subfamily:floral_rose')
    expect(makeDescriptorGraphId('cedarwood')).toBe('descriptor:cedarwood')
    expect(makeAliasGraphId('cedar')).toBe('alias:cedar')

    expect(isFamilyGraphId('family:floral')).toBe(true)
    expect(isSubfamilyGraphId('subfamily:floral_rose')).toBe(true)
    expect(isDescriptorGraphId('descriptor:cedarwood')).toBe(true)
    expect(isAliasGraphId('alias:cedar')).toBe(true)

    expect(isFamilyGraphId('family:')).toBe(false)
    expect(isSubfamilyGraphId('subfamily:')).toBe(false)
    expect(isDescriptorGraphId('descriptor:')).toBe(false)
    expect(isAliasGraphId('alias:')).toBe(false)

    expect(stripGraphIdPrefix('family:floral')).toBe('floral')
    expect(stripGraphIdPrefix('subfamily:floral_rose')).toBe('floral_rose')
    expect(stripGraphIdPrefix('descriptor:cedarwood')).toBe('cedarwood')
    expect(stripGraphIdPrefix('alias:cedar')).toBe('cedar')
    expect(stripGraphIdPrefix('material:rose')).toBeNull()
  })

  it('covers D-03 and D-04 with deterministic parseGraphId success and failure results', () => {
    expect(parseGraphId('descriptor:cedarwood')).toEqual({
      ok: true,
      kind: 'descriptor',
      prefix: 'descriptor:',
      raw_id: 'cedarwood',
      graph_id: 'descriptor:cedarwood',
    })

    expect(parseGraphId('')).toEqual({
      ok: false,
      error: {
        code: 'empty_graph_id',
        message: 'graph_id must not be empty',
        expected: { allowed_prefixes: ['family:', 'subfamily:', 'descriptor:', 'alias:'] },
        actual: { graph_id: '' },
      },
    })

    expect(parseGraphId('family:')).toEqual({
      ok: false,
      error: {
        code: 'empty_graph_id',
        message: 'graph_id raw_id must not be empty',
        expected: { non_empty_raw_id: true, prefix: 'family:' },
        actual: { graph_id: 'family:', raw_id: '' },
      },
    })

    expect(parseGraphId('material:cedar')).toEqual({
      ok: false,
      error: {
        code: 'unknown_graph_id_prefix',
        message: 'graph_id must start with an authoritative prefix',
        expected: { allowed_prefixes: ['family:', 'subfamily:', 'descriptor:', 'alias:'] },
        actual: { graph_id: 'material:cedar' },
      },
    })

    expect(parseGraphId('family:subfamily:rose')).toEqual({
      ok: false,
      error: {
        code: 'ambiguous_graph_id_format',
        message: 'graph_id raw_id must not contain another authoritative prefix token',
        expected: {
          disallowed_embedded_prefixes: ['family:', 'subfamily:', 'descriptor:', 'alias:'],
          prefix: 'family:',
        },
        actual: {
          graph_id: 'family:subfamily:rose',
          raw_id: 'subfamily:rose',
          embedded_prefix: 'family:',
        },
      },
    })
  })

  it('imports authoritative prefix data from contract and keeps failures JSON-safe', async () => {
    const source = await readFile(graphIdSourcePath, 'utf8')

    expect(source).toContain("from './contract.js'")
    expect(source).toContain('GRAPH_ID_PREFIXES')
    expect(source).toContain('GRAPH_ID_PARSE_ERROR_CODES')
    expect(source).not.toContain("['family:', 'subfamily:', 'descriptor:', 'alias:']")

    const failedParse = parseGraphId('family:alias:cedar')
    expect(failedParse.ok).toBe(false)
    if (failedParse.ok) {
      throw new Error('expected parseGraphId to fail')
    }

    expect(JSON.parse(JSON.stringify(failedParse))).toEqual(failedParse)
    expect(failedParse.error.actual).toEqual({
      graph_id: 'family:alias:cedar',
      raw_id: 'alias:cedar',
      embedded_prefix: 'alias:',
    })
  })
})
