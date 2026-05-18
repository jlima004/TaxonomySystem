import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { FrequencyMap } from '../types/analysis.js'

type AnalysisMaterial = {
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
      const canonical = normalizeDescriptor(rawDescriptor)
      if (canonical.length > 0) {
        descriptorSet.add(canonical)
      }
    }

    for (const descriptor of descriptorSet) {
      frequency.set(descriptor, (frequency.get(descriptor) ?? 0) + 1)
    }
  }

  return frequency
}
