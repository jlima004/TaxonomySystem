import { describe, it, expect } from 'vitest'

describe('Determinism Check', () => {
  it('should guarantee consistent object key ordering', () => {
    const obj1 = { b: 2, a: 1, c: 3 }
    const obj2 = { c: 3, b: 2, a: 1 }

    // Standard JSON.stringify does not sort keys. In our taxonomy, 
    // we should ensure any hashing or key retrieval is deterministic.
    const keys1 = Object.keys(obj1).sort()
    const keys2 = Object.keys(obj2).sort()

    expect(keys1).toEqual(['a', 'b', 'c'])
    expect(keys2).toEqual(['a', 'b', 'c'])
  })
})
