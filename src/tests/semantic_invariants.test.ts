import { describe, it, expect } from 'vitest'
import { validateAliasSeed } from '../loader/alias_validator.js'

describe('Semantic Invariants', () => {
  it('should detect direct circular dependencies', () => {
    const raw = {
      'a': 'b',
      'b': 'a'
    }
    const result = validateAliasSeed(raw)
    expect(result.ok).toBe(false)
    expect(result.errors[0]?.received).toContain('circular reference')
  })

  it('should detect indirect circular dependencies', () => {
    const raw = {
      'a': 'b',
      'b': 'c',
      'c': 'a'
    }
    const result = validateAliasSeed(raw, 5)
    expect(result.ok).toBe(false)
    expect(result.errors[0]?.received).toContain('circular reference')
  })

  it('should reject chains longer than maxDepth', () => {
    const raw = {
      'a': 'b',
      'b': 'c',
      'c': 'd'
    }
    const result = validateAliasSeed(raw, 1) // max depth 1
    expect(result.ok).toBe(false)
    expect(result.errors[0]?.received).toContain('chain depth 2')
  })

  it('should accept valid aliases', () => {
    const raw = {
      'a': 'b',
      'c': 'd'
    }
    const result = validateAliasSeed(raw)
    expect(result.ok).toBe(true)
  })
})
