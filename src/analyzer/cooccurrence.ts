import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import { canonicalizeDescriptor } from './alias_canonicalization.js'
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { CoOccurrenceMap, FrequencyMap } from '../types/analysis.js'
import type { CuratedAliasAuditEntry } from './alias_canonicalization.js'
import type { DescriptorSanitizerAuditEntry } from './descriptor_sanitizer.js'
import { sanitizeDescriptor } from './descriptor_sanitizer.js'
import { encodePairKey } from './pair_key.js'

type AnalysisMaterial = {
  readonly id?: string
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

type FrequencyAndCoOccurrence = {
  readonly frequency: FrequencyMap
  readonly cooccurrence: CoOccurrenceMap
  readonly sanitationAuditEntries: readonly DescriptorSanitizerAuditEntry[]
  readonly aliasCanonicalizationAuditEntries: readonly CuratedAliasAuditEntry[]
}

const toSortedDescriptorSet = (
  material: AnalysisMaterial,
  curatedAliases?: DescriptorAliasSeed,
): {
  readonly descriptors: readonly string[]
  readonly sanitationAuditEntries: readonly DescriptorSanitizerAuditEntry[]
  readonly aliasAuditEntries: readonly CuratedAliasAuditEntry[]
} => {
  const descriptorSet = new Set<string>()
  const sanitationAuditEntries: DescriptorSanitizerAuditEntry[] = []
  const aliasAuditEntries: CuratedAliasAuditEntry[] = []
  for (const rawDescriptor of material.olfactory.descriptors) {
    const normalized = normalizeDescriptor(rawDescriptor)
    if (normalized.length === 0) {
      continue
    }

    const sanitized = sanitizeDescriptor({
      raw: rawDescriptor,
      normalized,
      source: 'olfactory.descriptors',
      ...(material.id === undefined ? {} : { material_id: material.id }),
    })

    if (sanitized.keep) {
      const canonicalized = canonicalizeDescriptor(sanitized.descriptor, curatedAliases, rawDescriptor)
      descriptorSet.add(canonicalized.canonical)
      if (canonicalized.audit !== undefined) {
        aliasAuditEntries.push(canonicalized.audit)
      }
    } else {
      sanitationAuditEntries.push(sanitized.audit)
    }
  }

  return {
    descriptors: Array.from(descriptorSet).sort((a, b) => a.localeCompare(b)),
    sanitationAuditEntries: sanitationAuditEntries.sort((left, right) => {
      if (left.normalized !== right.normalized) {
        return left.normalized.localeCompare(right.normalized)
      }
      if (left.raw !== right.raw) {
        return left.raw.localeCompare(right.raw)
      }
      if (left.reason !== right.reason) {
        return left.reason.localeCompare(right.reason)
      }
      return left.matched_rule.localeCompare(right.matched_rule)
    }),
    aliasAuditEntries: aliasAuditEntries.sort((left, right) => {
      if (left.normalized !== right.normalized) {
        return left.normalized.localeCompare(right.normalized)
      }
      if (left.canonical !== right.canonical) {
        return left.canonical.localeCompare(right.canonical)
      }
      return left.raw.localeCompare(right.raw)
    }),
  }
}

/**
 * Compute descriptor co-occurrence map from a corpus.
 */
export const computeCoOccurrence = (corpus: readonly AnalysisMaterial[], curatedAliases?: DescriptorAliasSeed): CoOccurrenceMap => {
  return computeFrequencyAndCoOccurrence(corpus, curatedAliases).cooccurrence
}

/**
 * Compute descriptor frequency and co-occurrence in one pass.
 */
export const computeFrequencyAndCoOccurrence = (
  corpus: readonly AnalysisMaterial[],
  curatedAliases?: DescriptorAliasSeed,
): FrequencyAndCoOccurrence => {
  const frequency = new Map<string, number>()
  const cooccurrence = new Map<string, number>()
  const sanitationAuditEntries: DescriptorSanitizerAuditEntry[] = []
  const aliasCanonicalizationAuditEntries: CuratedAliasAuditEntry[] = []

  for (const material of corpus) {
    const { descriptors: sortedDescriptors, sanitationAuditEntries: sanitationEntries, aliasAuditEntries } = toSortedDescriptorSet(material, curatedAliases)
    sanitationAuditEntries.push(...sanitationEntries)
    aliasCanonicalizationAuditEntries.push(...aliasAuditEntries)

    for (const descriptor of sortedDescriptors) {
      frequency.set(descriptor, (frequency.get(descriptor) ?? 0) + 1)
    }

    for (let i = 0; i < sortedDescriptors.length - 1; i++) {
      const descriptorA = sortedDescriptors[i] ?? ''
      for (let j = i + 1; j < sortedDescriptors.length; j++) {
        const descriptorB = sortedDescriptors[j] ?? ''
        const key = encodePairKey(descriptorA, descriptorB)
        cooccurrence.set(key, (cooccurrence.get(key) ?? 0) + 1)
      }
    }
  }

  return { frequency, cooccurrence, sanitationAuditEntries, aliasCanonicalizationAuditEntries }
}
