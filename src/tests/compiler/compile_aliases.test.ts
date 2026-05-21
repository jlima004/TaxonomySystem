import { describe, expect, it } from 'vitest'
import { compileAliases } from '../../compiler/compile_aliases.js'

describe('compileAliases', () => {
  it('returns wrapper format with only expected keys', () => {
    expect(Object.keys(compileAliases({ a: 'b' }, { generatedAt: '2026-01-01T00:00:00.000Z' }))).toEqual(['version', 'schema_version', 'generated_at', 'aliases'])
  })

  it('sorts aliases alphabetically by key', () => {
    const result = compileAliases({ z: 'y', a: 'b', m: 'n' }, { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(Object.keys(result.aliases)).toEqual(['a', 'm', 'z'])
  })

  it('uses schema_version default of 1', () => {
    expect(compileAliases({ a: 'b' }, { generatedAt: '2026-01-01T00:00:00.000Z' }).schema_version).toBe('1')
  })

  it('does not add corpus alias candidates', () => {
    const result = compileAliases({ curated: 'canonical' }, { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.aliases).toEqual({ curated: 'canonical' })
    expect(result.aliases).not.toHaveProperty('candidate')
  })

  it('passes values without mutation', () => {
    const seed = { z: 'y', a: 'b' }
    const result = compileAliases(seed, { version: '2.0.0', schemaVersion: '9', generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(seed).toEqual({ z: 'y', a: 'b' })
    expect(result).toMatchObject({ version: '2.0.0', schema_version: '9', generated_at: '2026-01-01T00:00:00.000Z' })
  })
})
