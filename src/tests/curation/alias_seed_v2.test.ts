import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { compileAliases } from '../../compiler/compile_aliases.js'
import { validateAliasSeed } from '../../loader/alias_validator.js'
import { resolveExistingPath } from '../helpers/resolve_existing_path.js'

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
  readonly approvalId: string
  readonly round: string
  readonly alias: string
  readonly canonical: string
  readonly rationale: string
  readonly evidence: string
}

type AliasSeedFixture = Record<string, string>

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const aliasSeedPath = path.join(repoRoot, 'data/taxonomy/descriptor_aliases.seed.json')
const v2SeedPath = path.join(repoRoot, 'data/taxonomy/taxonomy-seed.v2.json')
const workbookPath = resolveExistingPath(
  path.join(repoRoot, 'src/tests/fixtures/curation/candidate-review.md'),
  path.join(repoRoot, '.planning/phases/08-taxonomy-seed-expansion-curation/curation/candidate-review.md'),
)
const phase33ApprovalPath = resolveExistingPath(
  path.join(repoRoot, 'src/tests/fixtures/curation/33-FINAL-APPROVAL.md'),
  path.join(repoRoot, '.planning/phases/33-rosewood-alias-mutation-execution/33-FINAL-APPROVAL.md'),
)
const phase38SummaryPath = resolveExistingPath(
  path.join(repoRoot, 'src/tests/fixtures/curation/38-SUMMARY.md'),
  path.join(repoRoot, '.planning/phases/38-group-b-conflict-microcuration/38-SUMMARY.md'),
  path.join(repoRoot, '.planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-SUMMARY.md'),
)

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
  'cedar': 'cedarwood',
  'sandal wood': 'sandalwood',
  'ambergri': 'ambergris',
}

const approvedRound3Aliases: AliasSeedFixture = {
  'musky': 'musk',
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

const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target

const parseField = (block: string, name: string): string | undefined => {
  const match = block.match(new RegExp('- `' + name + '`: ?(?:`([^`]+)`|([^\n]+))'))

  return (match?.[1] ?? match?.[2])?.trim()
}

const parseApprovedAliasEntries = (workbook: string): readonly ApprovedAliasEntry[] => {
  const blocks = workbook
    .split(/\n### /)
    .filter(block => block.startsWith('r3-alias-cleanup-') || block.startsWith('approval-'))

  return blocks.flatMap(block => {
    const approvalId = parseField(block, 'approval_id') ?? block.split('\n', 1)[0]?.trim()
    const round = parseField(block, 'round')
    const manualApproval = parseField(block, 'manual_approval')
    const primaryDisposition = parseField(block, 'primary_disposition')
    const alias = parseField(block, 'alias') ?? parseField(block, 'alias_id') ?? parseField(block, 'alias_key') ?? parseField(block, 'alias_source')
    const canonical =
      parseField(block, 'canonical') ?? parseField(block, 'canonical_id') ?? parseField(block, 'target_descriptor') ?? parseField(block, 'alias_target')
    const rationale = parseField(block, 'rationale')
    const evidence = parseField(block, 'evidence')

    if (
      approvalId === undefined ||
      !approvalId.startsWith('r3-alias-cleanup-') ||
      round !== 'phase_10_round_3' ||
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

    return [{ approvalId, round, alias, canonical, rationale, evidence }]
  })
}

const parseModernAliasApproval = (approval: string): readonly ApprovedAliasEntry[] => {
  const aliases: ApprovedAliasEntry[] = []
  
  const aliasesSection = approval.match(/Aliases autorizados:([\s\S]*?)Aprovado por:/)
  if (!aliasesSection) return aliases
  
  const matches = aliasesSection[1]!.matchAll(/- ([^\s]+) → ([^\s]+)/g)
  
  let index = 1
  for (const match of matches) {
    const alias = match[1]!
    const canonical = match[2]!
    
    aliases.push({
      approvalId: `modern-alias-approval-${index++}`,
      round: 'modern_approval',
      alias,
      canonical,
      rationale: 'Modern alias mutation phase',
      evidence: 'Phase 33 approval'
    })
  }
  
  return aliases
}

const approvedPhase38Aliases: AliasSeedFixture = {
  'banana_ripe_banana': 'banana',
  'orange_bitter_orange': 'bitter_orange',
  'rose_red_rose': 'rose',
}

const parsePhase38AliasApprovals = (summary: string): readonly ApprovedAliasEntry[] =>
  Object.entries(approvedPhase38Aliases).flatMap(([alias, canonical], index) => {
    const arrowForms = [
      `${alias} -> ${canonical}`,
      `${alias} → ${canonical}`,
      `\`${alias}\` -> \`${canonical}\``,
      `\`${alias}\` → \`${canonical}\``,
    ]

    if (!arrowForms.some(form => summary.includes(form))) {
      return []
    }

    return [{
      approvalId: `phase38-alias-approval-${index + 1}`,
      round: 'phase_38_group_b_microcuration',
      alias,
      canonical,
      rationale: 'Phase 38 Group B safe alias normalization',
      evidence: 'Phase 38 summary documents safe mutation',
    }]
  })

describe('descriptor alias seed v2 curation contract', () => {
  it('validates descriptor_aliases.seed.json with the existing alias validator', async () => {
    const aliasSeed = await readJson<AliasSeedFixture>(aliasSeedPath)
    const result = validateAliasSeed(aliasSeed)

    expect(result.ok).toBe(true)
    expect(result.value).toEqual(aliasSeed)
  })

  it('requires every new alias target to exist as a seed v2 descriptor', async () => {
    const [aliasSeed, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const descriptors = collectDescriptors(v2Seed)

    Object.entries(aliasSeed).forEach(([alias, target]) => {
      expect(
        descriptors.has(target) || isPreservedLegacyAlias(alias, target),
        `${alias} points to absent canonical target ${target} without approved legacy preservation`,
      ).toBe(true)
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

  it('rejects candidate, deferred, ambiguous, or absent canonical targets for new aliases', async () => {
    const [aliasSeed, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const descriptors = collectDescriptors(v2Seed)

    Object.entries(aliasSeed).forEach(([alias, target]) => {
      expect(target, `${alias} must not point to candidate placeholder`).not.toBe('candidate')
      expect(deferredCanonicalTargets.has(target), `${alias} points to deferred canonical target ${target}`).toBe(false)
      expect(
        descriptors.has(target) || isPreservedLegacyAlias(alias, target),
        `${alias} points to ambiguous or absent canonical target ${target} without approved legacy preservation`,
      ).toBe(true)
    })
  })

  it('adds only approved Round 3 add_alias workbook blocks and modern approvals with existing v2 targets', async () => {
    const [aliasSeed, workbook, phase33Approval, phase38Summary, v2Seed] = await Promise.all([
      readJson<AliasSeedFixture>(aliasSeedPath),
      readFile(workbookPath, 'utf8'),
      readFile(phase33ApprovalPath, 'utf8'),
      readFile(phase38SummaryPath, 'utf8'),
      readJson<TaxonomySeedFixture>(v2SeedPath),
    ])
    const approvedAliasEntries = parseApprovedAliasEntries(workbook)
    const modernAliasEntries = parseModernAliasApproval(phase33Approval)
    const phase38AliasEntries = parsePhase38AliasApprovals(phase38Summary)

    const approvedAliasMap = Object.fromEntries(approvedAliasEntries.map(entry => [entry.alias, entry.canonical]))
    const modernAliasMap = Object.fromEntries(modernAliasEntries.map(entry => [entry.alias, entry.canonical]))
    const phase38AliasMap = Object.fromEntries(phase38AliasEntries.map(entry => [entry.alias, entry.canonical]))

    const descriptors = collectDescriptors(v2Seed)
    const allowedAliases = {
      ...existingApprovedAliases,
      ...approvedRound3Aliases,
      ...modernAliasMap,
      ...phase38AliasMap,
    }

    expect(approvedAliasMap).toEqual(approvedRound3Aliases)
    expect(phase38AliasMap).toEqual(approvedPhase38Aliases)
    
    ;[...approvedAliasEntries, ...modernAliasEntries, ...phase38AliasEntries].forEach(entry => 
      expect(descriptors.has(entry.canonical), `${entry.canonical} must exist in v2 seed`).toBe(true)
    )
    
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
