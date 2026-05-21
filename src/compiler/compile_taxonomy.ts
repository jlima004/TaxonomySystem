import { encodePairKey } from '../analyzer/pair_key.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { SeedCorpusProfileResult } from '../types/inference.js'
import type { TaxonomySeed } from '../types/seed.js'
import type { CanonicalDescriptor, CompiledTaxonomy, TaxonomyFamily, TaxonomySubfamily } from '../types/taxonomy.js'

export type CompileTaxonomyOptions = {
  readonly version?: string
  readonly generatedAt: string
  readonly minCooccurrenceSupport?: number
}

type Placement = {
  readonly familyId: string
  readonly subfamilyId: string
  readonly support: number
}

const DEFAULT_VERSION = '1.0.0'

const sortLex = (left: string, right: string): number => left.localeCompare(right)

const getSupport = (descriptor: string, seedDescriptor: string, analysis: CorpusAnalysis): number => {
  if (descriptor === seedDescriptor) return analysis.frequency.get(descriptor) ?? 0
  return analysis.cooccurrence.get(encodePairKey(descriptor, seedDescriptor)) ?? 0
}

const choosePlacement = (
  descriptor: string,
  subfamilySeedDescriptors: ReadonlyMap<string, readonly string[]>,
  analysis: CorpusAnalysis,
  minSupport: number,
): Placement | undefined => {
  let selected: Placement | undefined

  for (const [key, seedDescriptors] of subfamilySeedDescriptors) {
    const [familyId, subfamilyId] = key.split('|') as [string, string]
    const support = seedDescriptors.reduce((total, seedDescriptor) => total + getSupport(descriptor, seedDescriptor, analysis), 0)
    if (support < minSupport) continue

    if (
      selected === undefined ||
      support > selected.support ||
      (support === selected.support && subfamilyId.localeCompare(selected.subfamilyId) < 0)
    ) {
      selected = { familyId, subfamilyId, support }
    }
  }

  return selected
}

export const compileTaxonomy = (
  seed: TaxonomySeed,
  profileResult: SeedCorpusProfileResult,
  analysis: CorpusAnalysis,
  options: CompileTaxonomyOptions,
): CompiledTaxonomy => {
  const version = options.version ?? DEFAULT_VERSION
  const minSupport = options.minCooccurrenceSupport ?? 1
  const profilesBySubfamily = new Map<string, typeof profileResult.profiles>()
  const seedDescriptorsBySubfamily = new Map<string, readonly string[]>()

  for (const profile of profileResult.profiles) {
    const key = `${profile.family_id}|${profile.subfamily_id}`
    profilesBySubfamily.set(key, [...(profilesBySubfamily.get(key) ?? []), profile])
  }

  for (const family of seed.families) {
    for (const subfamily of family.subfamilies) {
      const key = `${family.id}|${subfamily.id}`
      seedDescriptorsBySubfamily.set(
        key,
        (profilesBySubfamily.get(key) ?? [])
          .map(profile => profile.descriptor)
          .sort(sortLex),
      )
    }
  }

  const corpusBySubfamily = new Map<string, CanonicalDescriptor[]>()
  for (const inferred of profileResult.inferred_descriptors) {
    const placement = choosePlacement(inferred.descriptor, seedDescriptorsBySubfamily, analysis, minSupport)
    if (placement === undefined) continue

    const key = `${placement.familyId}|${placement.subfamilyId}`
    const descriptor: CanonicalDescriptor = {
      id: inferred.descriptor,
      source: 'corpus',
      frequency: inferred.corpus_count,
      status: 'candidate',
      review_required: true,
      corpus_derived: true,
    }
    corpusBySubfamily.set(key, [...(corpusBySubfamily.get(key) ?? []), descriptor])
  }

  const families: TaxonomyFamily[] = [...seed.families]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(family => {
      const subfamilies: TaxonomySubfamily[] = [...family.subfamilies]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map(subfamily => {
          const key = `${family.id}|${subfamily.id}`
          const seedDescriptors: CanonicalDescriptor[] = (profilesBySubfamily.get(key) ?? [])
            .map(profile => ({
              id: profile.descriptor,
              source: 'seed' as const,
              frequency: profile.corpus_count,
              status: 'curated' as const,
              review_required: false,
              corpus_derived: false,
            }))
            .sort((left, right) => left.id.localeCompare(right.id))
          const corpusDescriptors = (corpusBySubfamily.get(key) ?? []).sort((left, right) => left.id.localeCompare(right.id))

          return {
            id: subfamily.id,
            name: subfamily.name,
            family_id: family.id,
            descriptors: [...seedDescriptors, ...corpusDescriptors],
          }
        })

      return {
        id: family.id,
        name: family.name,
        subfamilies,
      }
    })

  const subfamilyCount = families.reduce((total, family) => total + family.subfamilies.length, 0)
  const descriptorCount = families.reduce(
    (total, family) => total + family.subfamilies.reduce((subTotal, subfamily) => subTotal + subfamily.descriptors.length, 0),
    0,
  )

  return {
    version,
    generated_at: options.generatedAt,
    stats: {
      family_count: families.length,
      subfamily_count: subfamilyCount,
      descriptor_count: descriptorCount,
    },
    families,
  }
}
