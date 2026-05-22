import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CoOccurrenceMap, FrequencyMap } from '../types/analysis.js'
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
}

const toSortedDescriptorSet = (
  material: AnalysisMaterial,
): { readonly descriptors: readonly string[]; readonly auditEntries: readonly DescriptorSanitizerAuditEntry[] } => {
  const descriptorSet = new Set<string>()
  const auditEntries: DescriptorSanitizerAuditEntry[] = []
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
      descriptorSet.add(sanitized.descriptor)
    } else {
      auditEntries.push(sanitized.audit)
    }
  }

  return {
    descriptors: Array.from(descriptorSet).sort((a, b) => a.localeCompare(b)),
    auditEntries: auditEntries.sort((left, right) => {
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
  }
}

/**
 * Compute descriptor co-occurrence map from a corpus.
 */
export const computeCoOccurrence = (corpus: readonly AnalysisMaterial[]): CoOccurrenceMap => {
  return computeFrequencyAndCoOccurrence(corpus).cooccurrence
}

/**
 * Compute descriptor frequency and co-occurrence in one pass.
 */
export const computeFrequencyAndCoOccurrence = (corpus: readonly AnalysisMaterial[]): FrequencyAndCoOccurrence => {
  const frequency = new Map<string, number>()
  const cooccurrence = new Map<string, number>()
  const sanitationAuditEntries: DescriptorSanitizerAuditEntry[] = []

  for (const material of corpus) {
    const { descriptors: sortedDescriptors, auditEntries } = toSortedDescriptorSet(material)
    sanitationAuditEntries.push(...auditEntries)

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

  return { frequency, cooccurrence, sanitationAuditEntries }
}
