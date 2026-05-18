type SyntheticMaterial = {
  readonly olfactory: {
    readonly descriptors: readonly string[]
  }
}

type GenerateOptions = {
  readonly materials: number
  readonly seed: number
}

const createMulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const VOCABULARY = Array.from({ length: 200 }, (_, index) => `descriptor_${index}`)

export const generateSyntheticCorpus = ({ materials, seed }: GenerateOptions): readonly SyntheticMaterial[] => {
  const random = createMulberry32(seed)
  const corpus: SyntheticMaterial[] = []

  for (let index = 0; index < materials; index++) {
    const descriptorCount = 5 + Math.floor(random() * 11)
    const descriptors = new Set<string>()

    while (descriptors.size < descriptorCount) {
      const vocabIndex = Math.floor(random() * VOCABULARY.length)
      descriptors.add(VOCABULARY[vocabIndex] ?? 'descriptor_0')
    }

    corpus.push({
      olfactory: {
        descriptors: Array.from(descriptors),
      },
    })
  }

  return corpus
}
