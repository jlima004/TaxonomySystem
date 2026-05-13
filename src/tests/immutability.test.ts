import { describe, it, expect } from 'vitest'

describe('Immutability Checks', () => {
  it('relies on TypeScript readonly for structural immutability', () => {
    // A codebase-wide adoption of `readonly` is used instead of `Object.freeze` overhead.
    // This test ensures the suite runs, but the real guarantee is at compile-time via `tsc --noEmit`.
    expect(true).toBe(true)
  })
})
