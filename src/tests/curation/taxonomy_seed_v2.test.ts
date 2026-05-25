import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSeed } from '../../loader/seed_validator.js'
import { DEFAULT_PATHS } from '../../cli/parse_args.js'

type SeedSubfamily = {
  readonly id: string
  readonly name: string
  readonly descriptors: readonly string[]
}

type SeedFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly SeedSubfamily[]
}

type TaxonomySeedFixture = {
  readonly version: string
  readonly metadata: {
    readonly created_at: string
    readonly author: string
    readonly description: string
  }
  readonly families: readonly SeedFamily[]
}

type ApprovedSeedEntry = {
  readonly approvalId: string
  readonly round: string | undefined
  readonly familyId: string
  readonly subfamilyId: string
  readonly descriptorId: string
  readonly rationale: string
  readonly evidence: string
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const v1SeedPath = path.join(repoRoot, 'data/taxonomy/taxonomy-seed.v1.json')
const v2SeedPath = path.join(repoRoot, 'data/taxonomy/taxonomy-seed.v2.json')
const workbookPath = path.join(repoRoot, '.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md')

const DEFERRED_IDS = [
  'marine_ozonic',
  'tobacco',
  'powdery',
  'aldehydic',
  'medicinal_camphoraceous',
  'earthy_mineral',
  'smoky',
] as const

const IN_SCOPE_FAMILIES = [
  'floral',
  'woody',
  'citrus',
  'gourmand',
  'spicy',
  'green',
  'fruity',
  'amber_resinous',
  'animalic',
  'fresh_spice',
] as const

const APPROVED_ROUND_3_SEED_PATHS = [
  'amber_resinous/amber/amber',
  'amber_resinous/balsamic_resin/labdanum',
  'amber_resinous/balsamic_resin/benzoin',
  'animalic/musky/musk',
  'animalic/musky/ambrette',
  'animalic/leathery/leathery',
  'fresh_spice/fresh_spice/anise',
] as const

const ROUND_3_PENDING_OR_DEFERRED_SEED_PATHS = [
  'amber_resinous/balsamic_resin/resinous',
  'amber_resinous/balsamic_resin/balsamic',
  'animalic/musky/musky',
  'animalic/musky/animal',
  'animalic/musky/civet',
  'fresh_spice/fresh_spice/anisic',
] as const

const snakeCaseAscii = /^[a-z][a-z0-9_]*$/

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const countSeedEntries = (seed: TaxonomySeedFixture): number => {
  const subfamilyCount = seed.families.reduce((total, family) => total + family.subfamilies.length, 0)
  const descriptorCount = seed.families.reduce(
    (total, family) => total + family.subfamilies.reduce((subTotal, subfamily) => subTotal + subfamily.descriptors.length, 0),
    0,
  )

  return seed.families.length + subfamilyCount + descriptorCount
}

const descriptorKeys = (seed: TaxonomySeedFixture): Set<string> => {
  const keys = new Set<string>()
  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => keys.add(`${family.id}/${subfamily.id}/${descriptor}`))
    })
  })

  return keys
}

const parseApprovedSeedEntries = (workbook: string): ApprovedSeedEntry[] => {
  const blocks = workbook
    .split(/\n### /)
    .filter(block => block.startsWith('approval-') || block.startsWith('r2-approval-') || block.startsWith('r3-approval-'))

  return blocks.flatMap(block => {
    const field = (name: string): string | undefined => {
      const match = block.match(new RegExp('- `' + name + '`: ?(?:`([^`]+)`|([^\\n]+))'))
      return (match?.[1] ?? match?.[2])?.trim()
    }

    const approvalId = field('approval_id') ?? block.split('\n', 1)[0]?.trim()
    const round = field('round')
    const familyId = field('family_id')
    const subfamilyId = field('subfamily_id')
    const descriptorId = field('descriptor_id')
    const manualApproval = field('manual_approval')
    const primaryDisposition = field('primary_disposition')
    const rationale = field('rationale')
    const evidence = field('evidence')

    if (
      familyId === undefined ||
      subfamilyId === undefined ||
      descriptorId === undefined ||
      approvalId === undefined ||
      manualApproval !== 'approved' ||
      primaryDisposition !== 'promote_to_seed' ||
      rationale === undefined ||
      rationale.length === 0 ||
      evidence === undefined ||
      evidence.length === 0
    ) {
      return []
    }

    if (approvalId.startsWith('r3-approval-') && round !== 'phase_10_round_3') {
      return []
    }

    return [{ approvalId, round, familyId, subfamilyId, descriptorId, rationale, evidence }]
  })
}

const parseApprovedRound3SeedEntries = (workbook: string): ApprovedSeedEntry[] =>
  parseApprovedSeedEntries(workbook).filter(entry =>
    entry.approvalId.startsWith('r3-approval-') && entry.round === 'phase_10_round_3',
  )

const assertNoDeferredIds = (seed: TaxonomySeedFixture): void => {
  const ids = seed.families.flatMap(family => [family.id, ...family.subfamilies.map(subfamily => subfamily.id)])
  DEFERRED_IDS.forEach(deferredId => expect(ids).not.toContain(deferredId))
}

const assertLowerSnakeCaseAscii = (seed: TaxonomySeedFixture): void => {
  seed.families.forEach(family => {
    expect(family.id).toMatch(snakeCaseAscii)
    family.subfamilies.forEach(subfamily => {
      expect(subfamily.id).toMatch(snakeCaseAscii)
      subfamily.descriptors.forEach(descriptor => expect(descriptor).toMatch(snakeCaseAscii))
    })
  })
}

const assertNoGlobalDescriptorDuplicates = (seed: TaxonomySeedFixture): void => {
  const seen = new Set<string>()
  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      subfamily.descriptors.forEach(descriptor => {
        expect(seen.has(descriptor), `duplicate descriptor: ${descriptor}`).toBe(false)
        seen.add(descriptor)
      })
    })
  })
}

const assertNoEmptySubfamilies = (seed: TaxonomySeedFixture): void => {
  seed.families.forEach(family => {
    family.subfamilies.forEach(subfamily => {
      expect(subfamily.descriptors.length, `${family.id}/${subfamily.id} must not be empty`).toBeGreaterThan(0)
    })
  })
}

const assertApprovedExpansionTraceability = (
  v1: TaxonomySeedFixture,
  v2: TaxonomySeedFixture,
  approvals: readonly ApprovedSeedEntry[],
): void => {
  const v1Descriptors = descriptorKeys(v1)
  const additions = [...descriptorKeys(v2)].filter(key => !v1Descriptors.has(key))
  expect(additions.length).toBeGreaterThan(0)
  expect(countSeedEntries(v2)).toBeGreaterThan(countSeedEntries(v1))

  additions.forEach(addition => {
    const [familyId, subfamilyId, descriptorId] = addition.split('/')
    const approval = approvals.find(
      entry => entry.familyId === familyId && entry.subfamilyId === subfamilyId && entry.descriptorId === descriptorId,
    )
    expect(approval, `missing approved workbook entry for ${addition}`).toBeDefined()
    expect(approval?.rationale.length).toBeGreaterThan(0)
    expect(approval?.evidence.length).toBeGreaterThan(0)
  })
}

describe('taxonomy seed v2 curation contract', () => {
  it('uses v2 as the default CLI/compiler seed path after promotion', () => {
    expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v2.json')
  })

  it('keeps v1 present and versioned as 1.0.0', async () => {
    const v1 = await readJson<TaxonomySeedFixture>(v1SeedPath)
    expect(v1.version).toBe('1.0.0')
    expect(validateSeed(v1).ok).toBe(true)
  })

  it('has at least one persisted approved promote_to_seed workbook entry with rationale and evidence', async () => {
    const workbook = await readFile(workbookPath, 'utf8')
    const approvals = parseApprovedSeedEntries(workbook)

    expect(approvals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          familyId: 'gourmand',
          subfamilyId: 'vanilla',
          descriptorId: 'vanilla',
        }),
      ]),
    )
  })

  it('validates reusable scope, naming, duplicate, and approval helpers before v2 data exists', async () => {
    const workbook = await readFile(workbookPath, 'utf8')
    const approvals = parseApprovedSeedEntries(workbook)
    const fixtureV1: TaxonomySeedFixture = {
      version: '1.0.0',
      metadata: { created_at: 'now', author: 'test', description: 'test' },
      families: [{ id: 'floral', name: 'Floral', subfamilies: [{ id: 'floral_white', name: 'White', descriptors: ['jasmine'] }] }],
    }
    const fixtureV2: TaxonomySeedFixture = {
      version: '2.0.0',
      metadata: { created_at: 'now', author: 'test', description: 'test' },
      families: [
        ...fixtureV1.families,
        { id: 'gourmand', name: 'Gourmand', subfamilies: [{ id: 'vanilla', name: 'Vanilla', descriptors: ['vanilla'] }] },
      ],
    }

    assertNoDeferredIds(fixtureV2)
    assertLowerSnakeCaseAscii(fixtureV2)
    assertNoGlobalDescriptorDuplicates(fixtureV2)
    assertNoEmptySubfamilies(fixtureV2)
    assertApprovedExpansionTraceability(fixtureV1, fixtureV2, approvals)
  })

  it('parses only complete approved Round 3 seed approvals for Phase 10 additions', async () => {
    const workbook = await readFile(workbookPath, 'utf8')
    const approvedRound3Entries = parseApprovedRound3SeedEntries(workbook)
    const approvedRound3Paths = approvedRound3Entries.map(
      entry => `${entry.familyId}/${entry.subfamilyId}/${entry.descriptorId}`,
    )

    expect(approvedRound3Paths).toEqual([...APPROVED_ROUND_3_SEED_PATHS])
    ROUND_3_PENDING_OR_DEFERRED_SEED_PATHS.forEach(seedPath => expect(approvedRound3Paths).not.toContain(seedPath))
  })

  it('validates taxonomy-seed.v2.json when present', async () => {
    if (!existsSync(v2SeedPath)) {
      return
    }

    const [v1, v2, workbook] = await Promise.all([
      readJson<TaxonomySeedFixture>(v1SeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
      readFile(workbookPath, 'utf8'),
    ])
    const approvals = parseApprovedSeedEntries(workbook)

    expect(v2.version).toBe('2.0.0')
    expect(validateSeed(v2).ok).toBe(true)
    expect(v2.families.map(family => family.id).every(id => IN_SCOPE_FAMILIES.includes(id as (typeof IN_SCOPE_FAMILIES)[number]))).toBe(true)
    assertNoDeferredIds(v2)
    assertLowerSnakeCaseAscii(v2)
    assertNoGlobalDescriptorDuplicates(v2)
    assertNoEmptySubfamilies(v2)
    assertApprovedExpansionTraceability(v1, v2, approvals)

    const approvedRound3Entries = parseApprovedRound3SeedEntries(workbook)
    const v2Descriptors = descriptorKeys(v2)

    approvedRound3Entries.forEach(entry => {
      expect(v2Descriptors.has(`${entry.familyId}/${entry.subfamilyId}/${entry.descriptorId}`)).toBe(true)
    })
    ROUND_3_PENDING_OR_DEFERRED_SEED_PATHS.forEach(seedPath => expect(v2Descriptors.has(seedPath)).toBe(false))
  })
})
