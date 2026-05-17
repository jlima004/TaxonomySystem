import { describe, expect, it } from 'vitest'
import { singularize } from '../../normalizer/singularize.js'

describe('singularize', () => {
  it('uses irregular plural dictionary first', () => {
    expect(singularize('woods')).toBe('wood')
    expect(singularize('mosses')).toBe('moss')
    expect(singularize('leaves')).toBe('leaf')
    expect(singularize('berries')).toBe('berry')
  })

  it('handles suffix fallback rules', () => {
    expect(singularize('categories')).toBe('category')
    expect(singularize('classes')).toBe('class')
    expect(singularize('boxes')).toBe('box')
    expect(singularize('roses')).toBe('rose')
    expect(singularize('petals')).toBe('petal')
  })

  it('keeps protected terminals unchanged', () => {
    expect(singularize('gas')).toBe('gas')
    expect(singularize('citrus')).toBe('citrus')
    expect(singularize('iris')).toBe('iris')
    expect(singularize('anis')).toBe('anis')
    expect(singularize('lotus')).toBe('lotus')
    expect(singularize('osmanthus')).toBe('osmanthus')
    expect(singularize('analysis')).toBe('analysis')
    expect(singularize('thesis')).toBe('thesis')
    expect(singularize('basis')).toBe('basis')
    expect(singularize('crisis')).toBe('crisis')
  })

  it('singularizes snake_case tokens independently', () => {
    expect(singularize('fresh_green_woods')).toBe('fresh_green_wood')
  })

  it('keeps singular and short words unchanged', () => {
    expect(singularize('jasmine')).toBe('jasmine')
    expect(singularize('moss')).toBe('moss')
    expect(singularize('as')).toBe('as')
    expect(singularize('is')).toBe('is')
  })
})
