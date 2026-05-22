import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { FrequencyMap } from '../types/analysis.js'
import { sanitizeDescriptor } from './descriptor_sanitizer.js'

type AnalysisMaterial = {
  readonly id?: string
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

/**
 * Compute descriptor document frequency (deduplicated per material).
 */
export const computeDescriptorFrequency = (corpus: readonly AnalysisMaterial[]): FrequencyMap => {
  const frequency = new Map<string, number>()

  for (const material of corpus) {
    const descriptorSet = new Set<string>()
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
      }
    }

    for (const descriptor of descriptorSet) {
      frequency.set(descriptor, (frequency.get(descriptor) ?? 0) + 1)
    }
  }

  return frequency
}
