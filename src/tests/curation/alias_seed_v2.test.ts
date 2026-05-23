import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { compileAliases } from '../../compiler/compile_aliases.js'
import { validateAliasSeed } from '../../loader/alias_validator.js'

type SeedSubfamily = {
  readonly id: string
  readonly descriptors: readonly string[]
}

type SeedFamily = {
  readonly id: string
  readonly subfamilies: readonly SeedSubfamily[]
}

type TaxonomySeedFixture = {
  readonly families: readonly SeedFamily[]
}

type ApprovedAliasEntry = {
  readonly alias: string
  readonly canonical: string
  readonly rationale: string
  readonly evidence: string
}

type AliasSeedFixture = Record<string, string>

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const aliasSeedPath = path.join(repoRoot, 'data/taxonomy/descriptor_aliases.seed.json')
const v2SeedPath = path.join(repoRoot, 'data/taxonomy/taxonomy-seed.v2.json')
const workbookPath = path.join(repoRoot, '.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md')

const existingApprovedAliases: AliasSeedFixture = {
  'jasmin': 'jasmine',
  'orange flower': 'orange_blossom',
  'orange blossom': 'orange_blossom',
  'orangeflower': 'orange_blossom',
  'oak moss': 'oakmoss',
  'ylang ylang': 'ylang_ylang',
  'petit grain': 'petitgrain',
  'patchouly': 'patchouli',
  'cedar wood': 'cedarwood',
  'sandal wood': 'sandalwood',
}

const deferredCanonicalTargets = new Set([
  'marine_ozonic',
  'tobacco',
  'powdery',
  'aldehydic',
  'medicinal_camphoraceous',
  'earthy_mineral',
  'smoky',
])

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const collectDescriptors = (seed: TaxonomySeedFixture): Set<string> => {
  const descriptors = new Set<string>()

  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => descriptors.add(descriptor))
    })
  })

  return descriptors
}

const parseField = (block: string, name: string): string | undefined => {
  const match = block.match(new RegExp('- `' + name + '`: ?(?:`([^`]+)`|([^\n]+))'))

  return (match?.[1] ?? match?.[2])?.trim()
}

const parseApprovedAliasEntries = (workbook: string): readonly ApprovedAliasEntry[] => {
  const blocks = workbook.split(/\n### /).filter(block => block.startsWith('approval-') || block.includes('- `primary_disposition`: `add_alias`'))

  return blocks.flatMap(block => {
    const manualApproval = parseField(block, 'manual_approval')
    const primaryDisposition = parseField(block, 'primary_disposition')
    const alias = parseField(block, 'alias') ?? parseField(block, 'alias_id') ?? parseField(block, 'alias_key')
    const canonical = parseField(block, 'canonical') ?? parseField(block, 'canonical_id') ?? parseField(block, 'target_descriptor')
    const rationale = parseField(block, 'rationale')
    const evidence = parseField(block, 'evidence')

    if (
      manualApproval !== 'approved' ||
      primaryDisposition !== 'add_alias' ||
      alias === undefined ||
      canonical === undefined ||
      rationale === undefined ||
      rationale.length === 0 ||
      evidence === undefined ||
      evidence.length === 0
    ) {
      return []
    }

    return [{ alias, canonical, rationale, evidence }]
  })
}

describe('descriptor alias seed v2 curation contract', () => {
  it('validates descriptor_aliases.seed.json with the existing alias validator', async () => {
    const aliasSeed = await readJson<AliasSeedFixture>(aliasSeedPath)
    const result = validateAliasSeed(aliasSeed)

    expect(result.ok).toBe(true)
    expect(result.value).toEqual(aliasSeed)
  })

  it('requires every alias target to exist as a seed v2 descriptor', async () => {
    const [aliasSeed, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const descriptors = collectDescriptors(v2Seed)

    Object.entries(aliasSeed).forEach(([alias, target]) => {
      expect(descriptors.has(target), `${alias} points to absent canonical target ${target}`).toBe(true)
    })
  })

  it('prevents alias keys from duplicating primary seed v2 descriptors', async () => {
    const [aliasSeed, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const descriptors = collectDescriptors(v2Seed)

    Object.keys(aliasSeed).forEach(alias => {
      expect(descriptors.has(alias), `${alias} must remain an alias, not a primary descriptor`).toBe(false)
    })
  })

  it('rejects candidate, deferred, ambiguous, or absent canonical alias targets', async () => {
    const [aliasSeed, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const descriptors = collectDescriptors(v2Seed)

    Object.entries(aliasSeed).forEach(([alias, target]) => {
      expect(target, `${alias} must not point to candidate placeholder`).not.toBe('candidate')
      expect(deferredCanonicalTargets.has(target), `${alias} points to deferred canonical target ${target}`).toBe(false)
      expect(descriptors.has(target), `${alias} points to ambiguous or absent canonical target ${target}`).toBe(true)
    })
  })

  it('does not add aliases without an approved add_alias workbook block', async () => {
    const [aliasSeed, workbook] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readFile(workbookPath, 'utf8'),
    ])
    const approvedAliasEntries = parseApprovedAliasEntries(workbook)
    const approvedAliasMap = Object.fromEntries(approvedAliasEntries.map(entry => [entry.alias, entry.canonical]))
    const allowedAliases = { ...existingApprovedAliases, ...approvedAliasMap }

    expect(approvedAliasEntries).toHaveLength(0)
    expect(aliasSeed).toEqual(allowedAliases)
  })

  it('compiles aliases deterministically without mutating the curated seed map', async () => {
    const aliasSeed = await readJson<AliasSeedFixture>(aliasSeedPath)
    const compiled = compileAliases(aliasSeed, { generatedAt: '2026-01-01T00:00:00.000Z' })
    const expectedKeys = Object.keys(aliasSeed).sort((left, right) => left.localeCompare(right))

    expect(Object.keys(compiled.aliases)).toEqual(expectedKeys)
    expect(aliasSeed).toEqual(await readJson<AliasSeedFixture>(aliasSeedPath))
  })
})
