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
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))

    await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

    await expect(readFile(join(paths.out, 'taxonomy.json'), 'utf8')).resolves.toContain('fresh_citrus')
    await expect(readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')).resolves.toContain('lemony')
    await expect(readFile(join(paths.out, 'similarity_matrix.json'), 'utf8')).resolves.toContain('review_queue')
  })

  it('returns non-zero on validation failure without writing outputs', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-invalid-')))

    await expect(runCompileCli([...argvFor(paths), '--version', ''])).resolves.toBe(1)
    await expect(stat(join(paths.out, 'taxonomy.json'))).rejects.toThrow()
  })
})
