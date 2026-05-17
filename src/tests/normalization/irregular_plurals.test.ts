import { describe, expect, it } from 'vitest'
import { IRREGULAR_PLURALS, lookupIrregularPlural } from '../../normalizer/irregular_plurals.js'

describe('IRREGULAR_PLURALS', () => {
  it('contains curated perfume-domain plural mappings', () => {
    expect(IRREGULAR_PLURALS.woods).toBe('wood')
    expect(IRREGULAR_PLURALS.mosses).toBe('moss')
    expect(IRREGULAR_PLURALS.leaves).toBe('leaf')
  })

  it('looks up known and unknown irregular plurals', () => {
    expect(lookupIrregularPlural('woods')).toBe('wood')
    expect(lookupIrregularPlural('unknown')).toBeUndefined()
  })

  it('is frozen at runtime', () => {
    expect(Object.isFrozen(IRREGULAR_PLURALS)).toBe(true)
    expect(Object.keys(IRREGULAR_PLURALS).length).toBeGreaterThanOrEqual(10)
  })
})
