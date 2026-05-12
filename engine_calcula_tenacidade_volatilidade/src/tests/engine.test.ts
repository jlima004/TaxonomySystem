import { describe, expect, it } from 'vitest'
import { normalize, normalizeFinite, NORMALIZATION_RANGES } from '../engine/normalization'
import { clamp01, toFiniteNumber } from '../utils'

describe('numeric utilities', () => {
  it('clamps scores to the inclusive 0 to 1 range', () => {
    expect(clamp01(-0.2)).toBe(0)
    expect(clamp01(0.4)).toBe(0.4)
    expect(clamp01(1.8)).toBe(1)
    expect(clamp01(Number.NaN)).toBe(0)
  })

  it('parses finite numbers from numeric strings and rejects invalid values', () => {
    expect(toFiniteNumber(' 12.5 ')).toBe(12.5)
    expect(toFiniteNumber(7)).toBe(7)
    expect(toFiniteNumber('')).toBeUndefined()
    expect(toFiniteNumber('not-a-number')).toBeUndefined()
    expect(toFiniteNumber(Number.NaN)).toBeUndefined()
    expect(toFiniteNumber(undefined)).toBeUndefined()
  })
})

describe('normalization', () => {
  it('normalizes values and clamps outside the configured range', () => {
    expect(normalize(50, 50, 400)).toBe(0)
    expect(normalize(225, 50, 400)).toBe(0.5)
    expect(normalize(400, 50, 400)).toBe(1)
    expect(normalize(10, 50, 400)).toBe(0)
    expect(normalize(1000, 50, 400)).toBe(1)
    expect(normalize(Number.NaN, 50, 400)).toBe(0)
  })

  it('returns undefined for invalid optional feature values', () => {
    expect(normalizeFinite(Number.NaN, NORMALIZATION_RANGES.molecularWeight)).toBeUndefined()
    expect(normalizeFinite(undefined, NORMALIZATION_RANGES.molecularWeight)).toBeUndefined()
    expect(normalizeFinite(225, NORMALIZATION_RANGES.molecularWeight)).toBe(0.5)
  })
})

import {
  DEFAULT_TENACITY_WEIGHTS,
  DEFAULT_VOLATILITY_WEIGHTS,
  mergeWeights,
  weightedAverage
} from '../engine/weights'
import { calculateTenacity } from '../engine/tenacity'
import { calculateVolatility, normalizeVaporPressure } from '../engine/volatility'
import { calculateMaterialScores, classifyNote } from '../engine'

describe('weights', () => {
  it('uses the configured default engine weights', () => {
    expect(DEFAULT_VOLATILITY_WEIGHTS).toEqual({
      vaporPressure: 0.5,
      molecularWeight: 0.3,
      xlogp: 0.2
    })
    expect(DEFAULT_TENACITY_WEIGHTS).toEqual({
      xlogp: 0.4,
      molecularWeight: 0.4,
      rotatableBonds: 0.2,
      tpsaPenalty: 0.1
    })
  })

  it('rebases weights across only usable feature values', () => {
    expect(
      weightedAverage([
        { value: undefined, weight: 0.5 },
        { value: Number.NaN, weight: 0.9 },
        { value: 0.25, weight: 0.3 },
        { value: 0.75, weight: 0.2 }
      ])
    ).toBeCloseTo(0.45, 5)
  })

  it('returns the neutral fallback when no features are usable', () => {
    expect(weightedAverage([{ value: undefined, weight: 1 }])).toBe(0.5)
  })

  it('merges finite non-negative custom weights and keeps defaults for invalid custom values', () => {
    expect(
      mergeWeights(DEFAULT_VOLATILITY_WEIGHTS, {
        vaporPressure: 0.7,
        molecularWeight: Number.NaN
      })
    ).toEqual({
      vaporPressure: 0.7,
      molecularWeight: 0.3,
      xlogp: 0.2
    })
  })
})

describe('volatility engine', () => {
  it('normalizes vapor pressure on a log10 scale', () => {
    expect(normalizeVaporPressure(0)).toBe(0)
    expect(normalizeVaporPressure('100')).toBe(1)
    expect(normalizeVaporPressure(-1)).toBeUndefined()
    expect(normalizeVaporPressure('invalid')).toBeUndefined()
  })

  it('scores a light high-vapor-pressure material as highly volatile', () => {
    const limonene = {
      physchem: { molecular_weight: 136.24, vapor_pressure: 200 },
      molecular: { xlogp: 4.5 }
    }

    expect(calculateVolatility(limonene)).toBeCloseTo(0.7961, 4)
  })

  it('rebases weights when vapor pressure is missing', () => {
    const material = {
      physchem: { molecular_weight: 200 },
      molecular: { xlogp: 3 }
    }

    expect(calculateVolatility(material)).toBeCloseTo(0.5429, 4)
  })

  it('ignores invalid molecular features and always returns a valid score', () => {
    const material = {
      physchem: { molecular_weight: Number.NaN, vapor_pressure: -10 },
      molecular: { xlogp: Number.NaN }
    }

    expect(calculateVolatility(material)).toBe(0.5)
  })

  it('uses custom volatility weights when provided', () => {
    const material = {
      physchem: { molecular_weight: 225, vapor_pressure: 0 },
      molecular: { xlogp: 3 }
    }

    expect(calculateVolatility(material, { vaporPressure: 1, molecularWeight: 0, xlogp: 0 })).toBe(0)
  })
})

describe('tenacity engine', () => {
  it('scores a heavier hydrophobic material as tenacious', () => {
    const muskLikeMaterial = {
      physchem: { molecular_weight: 294.44, vapor_pressure: 0.0001 },
      molecular: { xlogp: 5.6, rotatable_bonds: 5, tpsa: 0 }
    }

    expect(calculateTenacity(muskLikeMaterial)).toBeCloseTo(0.7167, 4)
  })

  it('applies the TPSA penalty when TPSA is available', () => {
    const material = {
      physchem: { molecular_weight: 300 },
      molecular: { xlogp: 5, rotatable_bonds: 2, tpsa: 120 }
    }

    expect(calculateTenacity(material)).toBeCloseTo(0.6590, 4)
  })

  it('rebases weights when rotatable bonds are missing', () => {
    const material = {
      physchem: { molecular_weight: 225 },
      molecular: { xlogp: 3 }
    }

    expect(calculateTenacity(material)).toBe(0.5)
  })

  it('ignores invalid feature values and returns a valid score', () => {
    const material = {
      physchem: { molecular_weight: Number.NaN },
      molecular: { xlogp: Number.NaN, rotatable_bonds: Number.NaN, tpsa: Number.NaN }
    }

    expect(calculateTenacity(material)).toBe(0.5)
  })

  it('uses custom tenacity weights when provided', () => {
    const material = {
      physchem: { molecular_weight: 400 },
      molecular: { xlogp: -2, rotatable_bonds: 15, tpsa: 0 }
    }

    expect(calculateTenacity(material, { molecularWeight: 1, xlogp: 0, rotatableBonds: 0 })).toBe(1)
  })
})

describe('public engine API', () => {
  it('returns volatility and tenacity scores for a material', () => {
    const material = {
      physchem: { molecular_weight: 136.24, vapor_pressure: 200 },
      molecular: { xlogp: 4.5, rotatable_bonds: 1, tpsa: 0 }
    }

    expect(calculateMaterialScores(material)).toEqual({
      volatility_score: expect.any(Number),
      tenacity_score: expect.any(Number)
    })
    expect(calculateMaterialScores(material).volatility_score).toBeCloseTo(0.7961, 4)
  })

  it('returns neutral valid scores for completely missing data', () => {
    expect(calculateMaterialScores({})).toEqual({
      volatility_score: 0.5,
      tenacity_score: 0.5
    })
  })

  it('classifies note family from volatility score', () => {
    expect(classifyNote(0.71)).toBe('TOP NOTE')
    expect(classifyNote(0.7)).toBe('HEART')
    expect(classifyNote(0.3)).toBe('HEART')
    expect(classifyNote(0.29)).toBe('BASE')
  })

  it('passes custom weights through the public API', () => {
    const material = {
      physchem: { molecular_weight: 225, vapor_pressure: 0 },
      molecular: { xlogp: 3, rotatable_bonds: 0, tpsa: 0 }
    }

    expect(
      calculateMaterialScores(material, {
        volatilityWeights: { vaporPressure: 1, molecularWeight: 0, xlogp: 0 },
        tenacityWeights: { rotatableBonds: 1, xlogp: 0, molecularWeight: 0 }
      })
    ).toEqual({
      volatility_score: 0,
      tenacity_score: 1
    })
  })
})
