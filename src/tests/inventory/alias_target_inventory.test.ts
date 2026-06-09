import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  validateAliasTargetIntegrity,
  type ExceptionPolicy,
} from '../../compiler/alias_target_integrity.js'
import { resolveExistingPath } from '../helpers/resolve_existing_path'

type AliasSeed = Record<string, string>

type CompiledAliases = {
  readonly aliases: AliasSeed
}

type CompiledDescriptor = {
  readonly id: string
  readonly source?: string
  readonly frequency?: number
  readonly status?: string
  readonly review_required?: boolean
  readonly corpus_derived?: boolean
}

type CompiledTaxonomy = {
  readonly families: readonly {
    readonly subfamilies: readonly {
      readonly descriptors: readonly CompiledDescriptor[]
    }[]
  }[]
}

type TaxonomySeed = {
  readonly families: readonly {
    readonly subfamilies: readonly {
      readonly descriptors: readonly string[]
    }[]
  }[]
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const seedAliasPath = path.join(repoRoot, 'data/taxonomy/descriptor_aliases.seed.json')
const compiledAliasPath = path.join(repoRoot, 'data/compiled/v2/descriptor_aliases.json')
const compiledTaxonomyPath = path.join(repoRoot, 'data/compiled/v2/taxonomy.json')
const taxonomySeedPath = path.join(repoRoot, 'data/taxonomy/taxonomy-seed.v2.json')
const exceptionPolicyPath = path.join(repoRoot, 'data/taxonomy/alias_target_exceptions.v1.json')
const inventoryPath = resolveExistingPath(
  path.join( repoRoot, 'src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md'),
  path.join( repoRoot, '.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md'),
  path.join( repoRoot, '.planning/milestones/v2.9-phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md'),
)

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const collectCompiledDescriptorIds = (taxonomy: CompiledTaxonomy): Set<string> => {
  const ids = new Set<string>()

  taxonomy.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => ids.add(descriptor.id))
    })
  })

  return ids
}

const collectSeedDescriptorIds = (seed: TaxonomySeed): Set<string> => {
  const ids = new Set<string>()

  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => ids.add(descriptor))
    })
  })

  return ids
}

describe('phase 49 alias target integrity inventory contract', () => {
  it('audits live alias data with 18 seed/compiled entries, 341 descriptors, 18 valid, 0 dangling', async () => {
    const [seedAliases, compiled, taxonomy, exceptionPolicy] = await Promise.all([
      readJson<AliasSeed>(seedAliasPath),
      readJson<CompiledAliases>(compiledAliasPath),
      readJson<CompiledTaxonomy>(compiledTaxonomyPath),
      readJson<ExceptionPolicy>(exceptionPolicyPath),
    ])
    const compiledAliases = compiled.aliases
    const descriptorIds = collectCompiledDescriptorIds(taxonomy)

    expect(Object.keys(seedAliases)).toHaveLength(18)
    expect(Object.keys(compiledAliases)).toHaveLength(18)
    expect(seedAliases).toEqual(compiledAliases)
    expect(descriptorIds.size).toBe(341)

    const result = validateAliasTargetIntegrity(seedAliases, descriptorIds, exceptionPolicy)

    expect(result).toEqual({
      status: 'PASS',
      seed_alias_count: 18,
      compiled_descriptor_count: 341,
      valid_target_count: 18,
      unresolved_target_count: 0,
      unresolved: [],
    })
  })

  it('requires the inventory artifact with mandated sections and classification', async () => {
    const content = await readFile(inventoryPath, 'utf8')

    expect(content.length).toBeGreaterThan(0)
    expect(content).toContain('Sources Inspected')
    expect(content).toContain('Completeness Proof')
    expect(content).toContain('Zero-Mutation Statement')
    expect(content).toContain('remediation_required')
    expect(content).toContain('Handoff to Phase 50/51')
  })

  it('documents ylang near-match evidence and confirms ylang_ylang is now present in live sources', async () => {
    const [content, taxonomy, taxonomySeed] = await Promise.all([
      readFile(inventoryPath, 'utf8'),
      readJson<CompiledTaxonomy>(compiledTaxonomyPath),
      readJson<TaxonomySeed>(taxonomySeedPath),
    ])

    expect(content).toContain('corpus candidate')
    expect(content).toContain('semantically distinct')
    expect(content).toMatch(/ylang_ylang.*does not appear/i)

    const ylang = taxonomy.families
      .flatMap(family => family.subfamilies)
      .flatMap(subfamily => subfamily.descriptors)
      .find(descriptor => descriptor.id === 'ylang')

    expect(ylang).toBeDefined()
    expect(ylang?.source).toBe('corpus')
    expect(ylang?.status).toBe('candidate')
    expect(ylang?.review_required).toBe(true)
    expect(ylang?.corpus_derived).toBe(true)

    const compiledIds = collectCompiledDescriptorIds(taxonomy)
    const seedIds = collectSeedDescriptorIds(taxonomySeed)

    expect(compiledIds.has('ylang_ylang')).toBe(true)
    expect(seedIds.has('ylang_ylang')).toBe(true)
    expect(compiledIds.has('ylang')).toBe(true)
  })
})
