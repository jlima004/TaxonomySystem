import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { compileAll } from '../../compiler/compile_all.js'
import { CompileWriteError, writeCompileResults } from '../../compiler/write_outputs.js'
import type { CompileAllInputs } from '../../compiler/compile_all.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { TaxonomySeed } from '../../types/seed.js'

const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [
    { id: 'citrus', name: 'Citrus', subfamilies: [{ id: 'fresh_citrus', name: 'Fresh Citrus', descriptors: ['lemon', 'bergamot'] }] },
  ],
}

const analysis: CorpusAnalysis = {
  frequency: new Map([['lemon', 3], ['bergamot', 2], ['fresh', 4], ['note', 10], ['generic_note', 30]]),
  cooccurrence: new Map([['fresh|lemon', 2], ['bergamot|generic_note', 1]]),
  aliasCandidates: [],
}

const inputs = (aliasSeed: Record<string, string> = { lemony: 'lemon' }): CompileAllInputs => ({
  seed,
  aliasSeed,
  analysis,
  graphInputs: { curatedRelations: { version: '1', relations: [] }, accordMap: { version: '1', accords: [] } },
  noiseConfig: { hard_exclude: [], pattern_exclude: [], downweight: { note: 0.35 }, default_downweight: 0.35 },
})

describe('compileAll and writeCompileResults', () => {
  it('returns ok true and all artifacts when valid', () => {
    const result = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.ok).toBe(true)
    expect(result.taxonomy.generated_at).toBe('2026-01-01T00:00:00.000Z')
    expect(result.aliases.aliases).toEqual({ lemony: 'lemon' })
    expect(Array.isArray(result.similarity.review_queue)).toBe(true)
  })

  it('keeps placement review items only in similarity.review_queue', () => {
    const result = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(JSON.stringify(result.taxonomy)).not.toContain('review_queue')
    expect(
      result.similarity.review_queue.some(
        item => item.type === 'corpus_candidate_low_support' || item.type === 'corpus_candidate_high_frequency_generic',
      ),
    ).toBe(true)
  })

  it('sorts merged review queue deterministically across runs', () => {
    const left = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    const right = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(left.similarity.review_queue).toEqual(right.similarity.review_queue)
  })

  it('keeps taxonomy family/subfamily counts anchored to seed when gap suggestions exist', () => {
    const result = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.taxonomy.stats.family_count).toBe(1)
    expect(result.taxonomy.stats.subfamily_count).toBe(1)
  })

  it('does not create taxonomy-seed.v2.json as part of compileAll', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'compile-seed-no-mutation-'))
    compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    await expect(stat(join(dir, 'taxonomy-seed.v2.json'))).rejects.toThrow()
  })

  it('is pure and does not touch filesystem before writes', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'compile-pure-'))
    compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    await expect(stat(join(dir, 'taxonomy.json'))).rejects.toThrow()
  })

  it('returns ok false when any artifact fails validation', () => {
    expect(compileAll(inputs({ lemon: 'lemon' }), { generatedAt: '2026-01-01T00:00:00.000Z' }).ok).toBe(false)
  })

  it('produces deterministic output for fixed generatedAt', () => {
    const left = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    const right = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(JSON.stringify(left.taxonomy)).toBe(JSON.stringify(right.taxonomy))
    expect(JSON.stringify(left.aliases)).toBe(JSON.stringify(right.aliases))
    expect(JSON.stringify(left.similarity)).toBe(JSON.stringify(right.similarity))
  })

  it('returns ok false when quality gates fail hard', () => {
    const invalidSeed: TaxonomySeed = {
      version: seed.version,
      metadata: seed.metadata,
      families: [{
        id: 'citrus',
        name: 'Citrus',
        subfamilies: [{
          id: 'fresh_citrus',
          name: 'Fresh Citrus',
          descriptors: ['at'],
        }],
      }],
    }

    const result = compileAll({ ...inputs(), seed: invalidSeed }, { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.ok).toBe(false)
  })

  it('keeps soft quality warnings non-blocking', () => {
    const result = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.ok).toBe(true)
    expect(result.validation.warnings.length).toBeGreaterThanOrEqual(0)
  })

  it('writeCompileResults rejects invalid results and writes nothing', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'compile-invalid-'))
    const result = compileAll(inputs({ lemon: 'lemon' }), { generatedAt: '2026-01-01T00:00:00.000Z' })
    await expect(writeCompileResults(result, dir)).rejects.toBeInstanceOf(CompileWriteError)
    await expect(stat(join(dir, 'taxonomy.json'))).rejects.toThrow()
  })

  it('preserves unrelated files and writes pretty JSON with trailing newline', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'compile-valid-'))
    const extra = join(dir, 'keep.txt')
    await writeFile(extra, 'keep', 'utf8')
    const files = await writeCompileResults(compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' }), dir)
    expect(files).toHaveLength(3)
    await expect(readFile(extra, 'utf8')).resolves.toBe('keep')
    await expect(readFile(join(dir, 'taxonomy.json'), 'utf8')).resolves.toMatch(/\n$/)
  })
})
