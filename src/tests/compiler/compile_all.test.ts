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
  frequency: new Map([['lemon', 3], ['bergamot', 2], ['fresh', 4], ['note', 10]]),
  cooccurrence: new Map([['fresh|lemon', 2]]),
  aliasCandidates: [],
}

const inputs = (aliasSeed: Record<string, string> = { lemony: 'lemon' }): CompileAllInputs => ({
  seed,
  aliasSeed,
  analysis,
  graphInputs: { curatedRelations: { version: '1', relations: [] }, accordMap: { version: '1', accords: [] } },
  noiseConfig: { noise_descriptors: ['note'], downweight_value: 0.35 },
})

describe('compileAll and writeCompileResults', () => {
  it('returns ok true and all artifacts when valid', () => {
    const result = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
    expect(result.ok).toBe(true)
    expect(result.taxonomy.generated_at).toBe('2026-01-01T00:00:00.000Z')
    expect(result.aliases.aliases).toEqual({ lemony: 'lemon' })
    expect(result.similarity.review_queue).toEqual([])
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
