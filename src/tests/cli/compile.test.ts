import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCompileCli } from '../../cli/compile.js'

const seed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [
    { id: 'citrus', name: 'Citrus', subfamilies: [{ id: 'fresh_citrus', name: 'Fresh Citrus', descriptors: ['lemon', 'bergamot'] }] },
  ],
}

const corpus = [
  { id: 'm1', identity: { name: 'M1', canonical_name: 'M1' }, olfactory: { descriptors: ['lemon', 'bergamot'] } },
  { id: 'm2', identity: { name: 'M2', canonical_name: 'M2' }, olfactory: { descriptors: ['lemon'] } },
]

const writeJson = (path: string, value: unknown): Promise<void> => writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')

const writeFixtures = async (dir: string, aliases: Record<string, string> = { lemony: 'lemon' }) => {
  const paths = {
    seed: join(dir, 'seed.json'),
    aliases: join(dir, 'aliases.json'),
    corpus: join(dir, 'corpus.json'),
    relations: join(dir, 'relations.json'),
    accords: join(dir, 'accords.json'),
    noise: join(dir, 'noise.json'),
    out: join(dir, 'out'),
  }
  await writeJson(paths.seed, seed)
  await writeJson(paths.aliases, aliases)
  await writeJson(paths.corpus, corpus)
  await writeJson(paths.relations, { version: '1', relations: [] })
  await writeJson(paths.accords, { version: '1', accords: [] })
  await writeJson(paths.noise, { version: '1', noise_descriptors: ['note'], downweight_value: 0.35 })
  return paths
}

const writeFixturesWithCorpus = async (
  dir: string,
  fixtureCorpus: readonly unknown[],
  aliases: Record<string, string> = { lemony: 'lemon' },
) => {
  const paths = await writeFixtures(dir, aliases)
  await writeJson(paths.corpus, fixtureCorpus)
  return paths
}

const argvFor = (paths: Awaited<ReturnType<typeof writeFixtures>>): string[] => [
  '--seed', paths.seed,
  '--aliases', paths.aliases,
  '--corpus', paths.corpus,
  '--relations', paths.relations,
  '--accords', paths.accords,
  '--noise', paths.noise,
  '--out', paths.out,
  '--generated-at', '2026-01-01T00:00:00.000Z',
]

describe('runCompileCli', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads inputs and writes all compiled outputs', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))

    await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

    await expect(readFile(join(paths.out, 'taxonomy.json'), 'utf8')).resolves.toContain('fresh_citrus')
    await expect(readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')).resolves.toContain('lemony')
    await expect(readFile(join(paths.out, 'similarity_matrix.json'), 'utf8')).resolves.toContain('review_queue')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('Review summary:')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('review_items_by_severity=')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('review_items_by_type=')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('validation_status=ok')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_gate_status=PASS')
  })

  it('prints quality-report details without creating extra artifacts', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-quality-')))
    await expect(runCompileCli([...argvFor(paths), '--quality-report'])).resolves.toBe(0)
    expect(logSpy.mock.calls.flat().join('\n')).toContain('Quality report:')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_warnings=')
    expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_metrics=')
    await expect(stat(join(paths.out, 'taxonomy.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.out, 'descriptor_aliases.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.out, 'similarity_matrix.json'))).resolves.toBeDefined()
    await expect(stat(join(paths.out, 'quality_report.json'))).rejects.toThrow()
  })

  it('returns non-zero on validation failure without writing outputs', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-invalid-')))

    await expect(runCompileCli([...argvFor(paths), '--version', ''])).resolves.toBe(1)
    await expect(stat(join(paths.out, 'taxonomy.json'))).rejects.toThrow()
  })

  it('canonicalizes curated aliases before generating taxonomy evidence', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const fixtureCorpus = [
      { id: 'm1', identity: { name: 'M1', canonical_name: 'M1' }, olfactory: { descriptors: ['lemony'] } },
      { id: 'm2', identity: { name: 'M2', canonical_name: 'M2' }, olfactory: { descriptors: ['lemon'] } },
    ]
    const paths = await writeFixturesWithCorpus(await mkdtemp(join(tmpdir(), 'compile-cli-alias-canon-')), fixtureCorpus)

    await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

    const taxonomy = JSON.parse(await readFile(join(paths.out, 'taxonomy.json'), 'utf8')) as {
      families: ReadonlyArray<{
        subfamilies: ReadonlyArray<{
          descriptors: ReadonlyArray<{ id: string; frequency: number }>
        }>
      }>
    }

    const descriptors = taxonomy.families.flatMap(family =>
      family.subfamilies.flatMap(subfamily => subfamily.descriptors),
    )
    const lemon = descriptors.find(item => item.id === 'lemon')
    const lemony = descriptors.find(item => item.id === 'lemony')

    expect(lemon?.frequency).toBe(2)
    expect(lemony).toBeUndefined()
  })

  it('keeps authoritative descriptor_aliases artifact sourced from curated seed only', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-alias-artifact-')))

    await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

    const aliasesArtifact = await readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')
    expect(aliasesArtifact).toContain('"lemony"')
    expect(aliasesArtifact).not.toContain('"camomile"')
    expect(aliasesArtifact).not.toContain('"chamomile"')
  })
})
