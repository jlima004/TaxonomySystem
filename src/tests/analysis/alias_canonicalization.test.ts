import { describe, expect, it } from 'vitest'
import {
  buildCuratedAliasMap,
  canonicalizeDescriptor,
} from '../../analyzer/alias_canonicalization.js'

describe('alias canonicalization', () => {
  it('canonicalizes descriptor using normalized curated alias seed with audit', () => {
    const result = canonicalizeDescriptor('orange_flower', {
      'orange flower': 'orange_blossom',
    }, 'orange flower')

    expect(result.canonical).toBe('orange_blossom')
    expect(result.audit).toEqual({
      raw: 'orange flower',
      normalized: 'orange_flower',
      canonical: 'orange_blossom',
      alias_source: 'curated_seed',
    })
  })

  it('normalizes alias seed keys and values when building curated alias map', () => {
    const map = buildCuratedAliasMap({
      'oak moss': 'oakmoss',
      patchouly: 'patchouli',
      'cedar wood': 'cedarwood',
      'sandal wood': 'sandalwood',
    })

    expect(Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))).toEqual([
      ['cedar_wood', 'cedarwood'],
      ['oak_moss', 'oakmoss'],
      ['patchouly', 'patchouli'],
      ['sandal_wood', 'sandalwood'],
    ])
  })

  it('returns unchanged descriptor and no alias audit when mapping does not exist', () => {
    const result = canonicalizeDescriptor('lemon', {
      'orange flower': 'orange_blossom',
    })

    expect(result.canonical).toBe('lemon')
    expect(result.audit).toBeUndefined()
  })

  it('accepts only curated alias seed/map as canonicalization input', () => {
    const map = buildCuratedAliasMap({
      lemony: 'lemon',
    })

    const result = canonicalizeDescriptor('lemony', map)
    expect(result.canonical).toBe('lemon')
  })
})
