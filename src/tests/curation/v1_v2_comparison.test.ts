import { mkdtemp, readFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCompileCli } from '../../cli/compile.js'
import { DEFAULT_PATHS } from '../../cli/parse_args.js'

const seedV1 = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'v1 baseline' },
  families: [
    {
      id: 'floral',
      name: 'Floral',
      subfamilies: [
        { id: 'floral_white', name: 'White Floral', descriptors: ['jasmine', 'tuberose'] },
        { id: 'floral_rose', name: 'Rose', descriptors: ['rose', 'geranium'] },
      ],
    },
  ],
}

const seedV2 = {
  version: '2.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'v2 candidate' },
  families: [
    ...seedV1.families,
    {
      id: 'gourmand',
      name: 'Gourmand',
      subfamilies: [{ id: 'vanilla', name: 'Vanilla', descriptors: ['vanilla'] }],
    },
  ],
}

const corpus = [
  { id: 'm1', identity: { name: 'M1', canonical_name: 'M1' }, olfactory: { descriptors: ['jasmine', 'rose'] } },
  { id: 'm2', identity: { name: 'M2', canonical_name: 'M2' }, olfactory: { descriptors: ['rose'] } },
]

const aliasSeed = { jasmin: 'jasmine' }

const noiseConfig = {
  version: '2.0.0',
  default_downweight: 0.35,
  hard_exclude: [],
  pattern_exclude: [],
  downweight: {},
}

const writeJson = async (dir: string, name: string, value: unknown): Promise<string> => {
  const filePath = join(dir, name)
  const { writeFile } = await import('node:fs/promises')
  await writeFile(filePath, `${JSON.stringify(value)}\n`, 'utf8')
  return filePath
}

const writeComparisonFixtures = async (
  dir: string,
  seed: typeof seedV1,
  relations: { version: string; relations: readonly unknown[] },
  accords: { version: string; accords: readonly unknown[] },
) => {
  const seedPath = await writeJson(dir, 'seed.json', seed)
  const aliasesPath = await writeJson(dir, 'aliases.json', aliasSeed)
  const corpusPath = await writeJson(dir, 'corpus.json', corpus)
  const relationsPath = await writeJson(dir, 'relations.json', relations)
  const accordsPath = await writeJson(dir, 'accords.json', accords)
  const noisePath = await writeJson(dir, 'noise.json', noiseConfig)
  const outDir = join(dir, 'out')
  return { seedPath, aliasesPath, corpusPath, relationsPath, accordsPath, noisePath, outDir }
}

const argvFor = (
  paths: Awaited<ReturnType<typeof writeComparisonFixtures>>,
  version: string,
): string[] => [
  '--seed', paths.seedPath,
  '--aliases', paths.aliasesPath,
  '--corpus', paths.corpusPath,
  '--relations', paths.relationsPath,
  '--accords', paths.accordsPath,
  '--noise', paths.noisePath,
  '--out', paths.outDir,
  '--version', version,
  '--generated-at', '2026-01-01T00:00:00.000Z',
]

describe('v1-v2 deterministic comparison guard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('preserves DEFAULT_PATHS pointing atomically to v2 inputs and output', () => {
    expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v2.json')
    expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v2.json')
    expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v2.json')
    expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v2')
    expect(DEFAULT_PATHS.version).toBe('2.1.0')
  })

  it('compiles v1 baseline with explicit paths and deterministic timestamp', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const dir = await mkdtemp(join(tmpdir(), 'comparison-v1-'))
    const paths = await writeComparisonFixtures(
      dir,
      seedV1,
      { version: '1.0.0', relations: [] },
      { version: '1.0.0', accords: [] },
    )

    const exitCode = await runCompileCli(argvFor(paths, '1.0.0'))
    expect(exitCode).toBe(0)

    const taxonomyJson = await readFile(join(paths.outDir, 'taxonomy.json'), 'utf8')
    const taxonomy = JSON.parse(taxonomyJson) as { version: string; generated_at: string }
    expect(taxonomy.version).toBe('1.0.0')
    expect(taxonomy.generated_at).toBe('2026-01-01T00:00:00.000Z')

    await expect(stat(join(paths.outDir, 'taxonomy.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.outDir, 'descriptor_aliases.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.outDir, 'similarity_matrix.json'))).resolves.toBeDefined()
  })

  it('compiles v2 candidate with explicit paths and deterministic timestamp', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const dir = await mkdtemp(join(tmpdir(), 'comparison-v2-'))
    const paths = await writeComparisonFixtures(
      dir,
      seedV2,
      { version: '2.0.0', relations: [] },
      { version: '2.0.0', accords: [] },
    )

    const exitCode = await runCompileCli(argvFor(paths, '2.0.0'))
    expect(exitCode).toBe(0)

    const taxonomyJson = await readFile(join(paths.outDir, 'taxonomy.json'), 'utf8')
    const taxonomy = JSON.parse(taxonomyJson) as { version: string; generated_at: string; families: readonly { id: string }[] }
    expect(taxonomy.version).toBe('2.0.0')
    expect(taxonomy.generated_at).toBe('2026-01-01T00:00:00.000Z')
    expect(taxonomy.families.some(family => family.id === 'gourmand')).toBe(true)

    await expect(stat(join(paths.outDir, 'taxonomy.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.outDir, 'descriptor_aliases.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.outDir, 'similarity_matrix.json'))).resolves.toBeDefined()
  })

  it('separates hard errors from soft warnings in quality gate output', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const dir = await mkdtemp(join(tmpdir(), 'comparison-gates-'))
    const paths = await writeComparisonFixtures(
      dir,
      seedV2,
      {
        version: '2.0.0',
        relations: [
          {
            source_subfamily_id: 'floral_rose',
            target_subfamily_id: 'floral_white',
            relation: 'same_family_tradition',
            score: 0.85,
            evidence: 'manual_phase_7_bootstrap',
          },
        ],
      },
      { version: '2.0.0', accords: [] },
    )

    const exitCode = await runCompileCli(argvFor(paths, '2.0.0'))
    expect(exitCode).toBe(0)

    const similarityJson = await readFile(join(paths.outDir, 'similarity_matrix.json'), 'utf8')
    const similarity = JSON.parse(similarityJson) as { review_queue: readonly unknown[] }
    expect(similarity.review_queue).toBeDefined()
    expect(Array.isArray(similarity.review_queue)).toBe(true)
  })

  it('produces deterministic output across repeated compiles with same inputs', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const dir1 = await mkdtemp(join(tmpdir(), 'comparison-det1-'))
    const dir2 = await mkdtemp(join(tmpdir(), 'comparison-det2-'))
    const paths1 = await writeComparisonFixtures(
      dir1,
      seedV1,
      { version: '1.0.0', relations: [] },
      { version: '1.0.0', accords: [] },
    )
    const paths2 = await writeComparisonFixtures(
      dir2,
      seedV1,
      { version: '1.0.0', relations: [] },
      { version: '1.0.0', accords: [] },
    )

    await runCompileCli(argvFor(paths1, '1.0.0'))
    await runCompileCli(argvFor(paths2, '1.0.0'))

    const taxonomy1 = await readFile(join(paths1.outDir, 'taxonomy.json'), 'utf8')
    const taxonomy2 = await readFile(join(paths2.outDir, 'taxonomy.json'), 'utf8')
    expect(taxonomy1).toBe(taxonomy2)

    const aliases1 = await readFile(join(paths1.outDir, 'descriptor_aliases.json'), 'utf8')
    const aliases2 = await readFile(join(paths2.outDir, 'descriptor_aliases.json'), 'utf8')
    expect(aliases1).toBe(aliases2)
  })
})
