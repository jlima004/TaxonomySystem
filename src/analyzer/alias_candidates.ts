import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { AliasCandidate, FrequencyMap } from '../types/analysis.js'
import type { TaxonomySeed } from '../types/seed.js'
import { encodePairKey } from './pair_key.js'
import { levenshteinSimilarity } from './similarity/levenshtein.js'
import { tokenJaccard } from './similarity/token_overlap.js'

// ANAL-D-16
const DEFAULT_MIN_FREQUENCY = 2
// ANAL-D-11
const DEFAULT_MIN_SCORE = 0.9
// ANAL-D-09
const DEFAULT_TOKEN_OVERLAP_FLOOR = 0.5
// ANAL-D-10
const DEFAULT_SUBSTRING_REJECT_SCORE = 0.97

type PoolEntry = {
  readonly word: string
  readonly frequency: number
}

type ShouldEmitResult = {
  readonly emit: boolean
  readonly score: number
  readonly algo: 'lev_norm' | 'lev_norm+tokens'
  readonly tokenOverlap?: number
}

const isMultiToken = (value: string): boolean => {
  return value.includes('_')
}

const isSubstringOnly = (a: string, b: string): boolean => {
  if (a === b) return false
  const short = a.length <= b.length ? a : b
  const long = a.length <= b.length ? b : a
  return long.includes(short)
}

const shouldEmitCandidate = (
  a: string,
  b: string,
  thresholds: {
    readonly minScore: number
    readonly tokenOverlapFloor: number
    readonly substringRejectScore: number
  },
): ShouldEmitResult => {
  const score = levenshteinSimilarity(a, b)
  if (score < thresholds.minScore) {
    return { emit: false, score, algo: 'lev_norm' }
  }

  if (isSubstringOnly(a, b) && score < thresholds.substringRejectScore) {
    return { emit: false, score, algo: 'lev_norm' }
  }

  if (isMultiToken(a) && isMultiToken(b)) {
    const overlap = tokenJaccard(a, b)
    if (overlap < thresholds.tokenOverlapFloor) {
      return { emit: false, score, algo: 'lev_norm+tokens', tokenOverlap: overlap }
    }

    return { emit: true, score, algo: 'lev_norm+tokens', tokenOverlap: overlap }
  }

  return { emit: true, score, algo: 'lev_norm' }
}

const buildSeedPairSet = (aliasSeed?: DescriptorAliasSeed): Set<string> => {
  if (aliasSeed === undefined) {
    return new Set<string>()
  }

  const pairs = new Set<string>()
  for (const [raw, canonical] of Object.entries(aliasSeed)) {
    const normalizedRaw = normalizeDescriptor(raw)
    const normalizedCanonical = normalizeDescriptor(canonical)
    if (normalizedRaw.length === 0 || normalizedCanonical.length === 0 || normalizedRaw === normalizedCanonical) {
      continue
    }

    pairs.add(encodePairKey(normalizedRaw, normalizedCanonical))
  }

  return pairs
}

const buildSeedCanonicalSet = (aliasSeed?: DescriptorAliasSeed): Set<string> => {
  if (aliasSeed === undefined) {
    return new Set<string>()
  }

  const descriptors = new Set<string>()
  for (const canonical of Object.values(aliasSeed)) {
    const normalized = normalizeDescriptor(canonical)
    if (normalized.length > 0) {
      descriptors.add(normalized)
    }
  }

  return descriptors
}

const buildDescriptorToFamilies = (taxonomySeed?: TaxonomySeed): Map<string, readonly string[]> => {
  const mapping = new Map<string, readonly string[]>()
  if (taxonomySeed === undefined) {
    return mapping
  }

  const temp = new Map<string, Set<string>>()

  for (const family of taxonomySeed.families) {
    for (const subfamily of family.subfamilies) {
      const familyRef = `${family.id}:${subfamily.id}`
      for (const descriptor of subfamily.descriptors) {
        const normalized = normalizeDescriptor(descriptor)
        if (normalized.length === 0) continue

        const current = temp.get(normalized) ?? new Set<string>()
        current.add(familyRef)
        temp.set(normalized, current)
      }
    }
  }

  for (const [descriptor, families] of temp) {
    mapping.set(descriptor, Array.from(families).sort((a, b) => a.localeCompare(b)))
  }

  return mapping
}

const buildTaxonomyDescriptorSet = (descriptorToFamilies: Map<string, readonly string[]>): Set<string> => {
  return new Set<string>(descriptorToFamilies.keys())
}

const pickCanonical = (
  a: string,
  b: string,
  frequencyA: number,
  frequencyB: number,
  seedCanonicalSet: Set<string>,
  taxonomyDescriptorSet: Set<string>,
): string => {
  const aIsSeedCanonical = seedCanonicalSet.has(a)
  const bIsSeedCanonical = seedCanonicalSet.has(b)
  if (aIsSeedCanonical !== bIsSeedCanonical) {
    return aIsSeedCanonical ? a : b
  }

  const aInTaxonomy = taxonomyDescriptorSet.has(a)
  const bInTaxonomy = taxonomyDescriptorSet.has(b)
  if (aInTaxonomy !== bInTaxonomy) {
    return aInTaxonomy ? a : b
  }

  if (frequencyA !== frequencyB) {
    return frequencyA > frequencyB ? a : b
  }

  return a < b ? a : b
}

const intersects = (left: readonly string[], right: readonly string[]): boolean => {
  if (left.length === 0 || right.length === 0) {
    return false
  }

  const rightSet = new Set<string>(right)
  for (const value of left) {
    if (rightSet.has(value)) {
      return true
    }
  }

  return false
}

export type AliasCandidateOptions = {
  readonly minFrequency?: number
  readonly minScore?: number
  readonly tokenOverlapFloor?: number
  readonly substringRejectScore?: number
  readonly aliasSeed?: DescriptorAliasSeed
  readonly taxonomySeed?: TaxonomySeed
}

/**
 * Suggest lexical alias candidates from descriptor document frequency.
 *
 * Defaults prioritize precision (ANAL-D-11). To detect `camomile`/`chamomile`,
 * callers should lower threshold to `{ minScore: 0.85 }`.
 */
export const findAliasCandidates = (
  frequency: FrequencyMap,
  options: AliasCandidateOptions = {},
): readonly AliasCandidate[] => {
  const {
    minFrequency = DEFAULT_MIN_FREQUENCY,
    minScore = DEFAULT_MIN_SCORE,
    tokenOverlapFloor = DEFAULT_TOKEN_OVERLAP_FLOOR,
    substringRejectScore = DEFAULT_SUBSTRING_REJECT_SCORE,
    aliasSeed,
    taxonomySeed,
  } = options

  const pool: PoolEntry[] = []
  for (const [word, value] of frequency) {
    if (value >= minFrequency) {
      pool.push({ word, frequency: value })
    }
  }

  if (pool.length < 2) {
    return []
  }

  pool.sort((left, right) => left.word.localeCompare(right.word))

  const seedPairSet = buildSeedPairSet(aliasSeed)
  const seedCanonicalSet = buildSeedCanonicalSet(aliasSeed)
  const descriptorToFamilies = buildDescriptorToFamilies(taxonomySeed)
  const taxonomyDescriptorSet = buildTaxonomyDescriptorSet(descriptorToFamilies)

  const buckets = new Map<number, PoolEntry[]>()
  for (const entry of pool) {
    const length = entry.word.length
    const bucket = buckets.get(length) ?? []
    bucket.push(entry)
    buckets.set(length, bucket)
  }

  const lengths = Array.from(buckets.keys()).sort((a, b) => a - b)
  const results: AliasCandidate[] = []

  for (let i = 0; i < lengths.length; i++) {
    const leftLength = lengths[i] ?? 0
    const leftBucket = buckets.get(leftLength) ?? []

    for (let j = i; j < lengths.length; j++) {
      const rightLength = lengths[j] ?? 0
      if (rightLength - leftLength > (1 - minScore) * rightLength) {
        break
      }

      const rightBucket = buckets.get(rightLength) ?? []
      const sameBucket = i === j

      for (let leftIndex = 0; leftIndex < leftBucket.length; leftIndex++) {
        const left = leftBucket[leftIndex]
        if (left === undefined) continue

        const rightStart = sameBucket ? leftIndex + 1 : 0
        for (let rightIndex = rightStart; rightIndex < rightBucket.length; rightIndex++) {
          const right = rightBucket[rightIndex]
          if (right === undefined || left.word === right.word) continue

          const a = left.word < right.word ? left.word : right.word
          const b = left.word < right.word ? right.word : left.word
          const frequencyA = left.word < right.word ? left.frequency : right.frequency
          const frequencyB = left.word < right.word ? right.frequency : left.frequency

          const pairKey = encodePairKey(a, b)
          if (seedPairSet.has(pairKey)) {
            continue
          }

          const decision = shouldEmitCandidate(a, b, {
            minScore,
            tokenOverlapFloor,
            substringRejectScore,
          })
          if (!decision.emit) {
            continue
          }

          const familiesA = descriptorToFamilies.get(a) ?? []
          const familiesB = descriptorToFamilies.get(b) ?? []
          const hasFamilies = familiesA.length > 0 || familiesB.length > 0
          const crossFamily = hasFamilies ? !intersects(familiesA, familiesB) : undefined

          results.push({
            a,
            b,
            score: decision.score,
            algo: decision.algo,
            frequencies: { a: frequencyA, b: frequencyB },
            ...(decision.tokenOverlap !== undefined ? { token_overlap: decision.tokenOverlap } : {}),
            ...(hasFamilies ? { families: { a: familiesA, b: familiesB } } : {}),
            ...(crossFamily !== undefined ? { cross_family: crossFamily } : {}),
            suggested_canonical: pickCanonical(
              a,
              b,
              frequencyA,
              frequencyB,
              seedCanonicalSet,
              taxonomyDescriptorSet,
            ),
          })
        }
      }
    }
  }

  return results.sort((left, right) => {
    if (left.score !== right.score) {
      return right.score - left.score
    }

    if (left.a !== right.a) {
      return left.a.localeCompare(right.a)
    }

    return left.b.localeCompare(right.b)
  })
}

export {
  DEFAULT_MIN_FREQUENCY,
  DEFAULT_MIN_SCORE,
  DEFAULT_TOKEN_OVERLAP_FLOOR,
  DEFAULT_SUBSTRING_REJECT_SCORE,
}
