import { describe, expect, it } from 'vitest'
import { singularize } from '../../normalizer/singularize.js'

describe('singularize', () => {
  it('uses irregular plural dictionary first', () => {
    expect(singularize('woods')).toBe('wood')
    expect(singularize('mosses')).toBe('moss')
    expect(singularize('leaves')).toBe('leaf')
  })

  it('handles suffix fallback rules', () => {
    expect(singularize('categories')).toBe('category')
    expect(singularize('classes')).toBe('class')
    expect(singularize('boxes')).toBe('box')
    expect(singularize('roses')).toBe('rose')
  })

  it('keeps protected terminals unchanged', () => {
    expect(singularize('gas')).toBe('gas')
    expect(singularize('citrus')).toBe('citrus')
    expect(singularize('analysis')).toBe('analysis')
  })

  it('singularizes snake_case tokens independently', () => {
    expect(singularize('fresh_green_woods')).toBe('fresh_green_wood')
  })
})
