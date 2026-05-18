import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CoOccurrenceMap, FrequencyMap } from '../types/analysis.js'
import { encodePairKey } from './pair_key.js'

type AnalysisMaterial = {
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

type FrequencyAndCoOccurrence = {
  readonly frequency: FrequencyMap
  readonly cooccurrence: CoOccurrenceMap
}

const toSortedDescriptorSet = (material: AnalysisMaterial): readonly string[] => {
  const descriptorSet = new Set<string>()
  for (const rawDescriptor of material.olfactory.descriptors) {
    const canonical = normalizeDescriptor(rawDescriptor)
    if (canonical.length > 0) {
      descriptorSet.add(canonical)
    }
  }

  return Array.from(descriptorSet).sort((a, b) => a.localeCompare(b))
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

  for (const material of corpus) {
    const sortedDescriptors = toSortedDescriptorSet(material)

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

  return { frequency, cooccurrence }
}
