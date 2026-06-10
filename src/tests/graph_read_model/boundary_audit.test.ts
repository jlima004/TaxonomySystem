import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  BoundaryAuditResult,
  BoundaryFileDigest,
  GVAL_03_PROTECTED_FILES,
  capturePreDigests,
  compareDigests,
  hashFile,
  runBoundaryAudit,
} from '../../graph_read_model/boundary_audit.js'

describe('hashFile', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'hash-file-test-'))
  })

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('returns a consistent SHA-256 hex for known content', async () => {
    const filePath = join(tmpDir, 'test.txt')
    await writeFile(filePath, 'hello world', 'utf8')

    const hash1 = await hashFile(filePath)
    const hash2 = await hashFile(filePath)

    expect(hash1).toBe(hash2)
    // Known SHA-256 of 'hello world' (UTF-8 encoded as Buffer)
    expect(hash1).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
  })

  it('returns a 64-character hex string', async () => {
    const filePath = join(tmpDir, 'test.txt')
    await writeFile(filePath, 'test content', 'utf8')

    const hash = await hashFile(filePath)
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('returns a different hash for different content', async () => {
    const file1 = join(tmpDir, 'file1.txt')
    const file2 = join(tmpDir, 'file2.txt')
    await writeFile(file1, 'content A', 'utf8')
    await writeFile(file2, 'content B', 'utf8')

    const hash1 = await hashFile(file1)
    const hash2 = await hashFile(file2)

    expect(hash1).not.toBe(hash2)
  })
})

describe('GVAL_03_PROTECTED_FILES', () => {
  it('contains exactly 3 entries', () => {
    expect(GVAL_03_PROTECTED_FILES).toHaveLength(3)
  })

  it('includes data/taxonomy/taxonomy-seed.v2.json', () => {
    expect(GVAL_03_PROTECTED_FILES).toContain('data/taxonomy/taxonomy-seed.v2.json')
  })

  it('includes data/taxonomy/descriptor_aliases.seed.json', () => {
    expect(GVAL_03_PROTECTED_FILES).toContain('data/taxonomy/descriptor_aliases.seed.json')
  })

  it('includes data/taxonomy/alias_target_exceptions.v1.json', () => {
    expect(GVAL_03_PROTECTED_FILES).toContain('data/taxonomy/alias_target_exceptions.v1.json')
  })
})

describe('capturePreDigests and runBoundaryAudit', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'boundary-audit-test-'))
  })

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('pre/post hashes match when files are unchanged — returns ok: true', async () => {
    const file1 = join(tmpDir, 'protected1.json')
    const file2 = join(tmpDir, 'protected2.json')
    await writeFile(file1, '{"key": "value"}', 'utf8')
    await writeFile(file2, '{"other": "data"}', 'utf8')

    const files = [file1, file2]
    const preDigests = await capturePreDigests(files)

    // Files not modified between captures
    const result = await runBoundaryAudit('/output/graph.json', tmpDir, preDigests)

    expect(result.ok).toBe(true)
    expect(result.protected_files).toHaveLength(2)
    expect(result.protected_files.every((d: BoundaryFileDigest) => d.unchanged)).toBe(true)
  })

  it('reports ok: false when a file is modified between captures', async () => {
    const file1 = join(tmpDir, 'protected.json')
    await writeFile(file1, '{"original": true}', 'utf8')

    const files = [file1]
    const preDigests = await capturePreDigests(files)

    // Simulate mutation
    await writeFile(file1, '{"mutated": true}', 'utf8')

    const result = await runBoundaryAudit('/output/graph.json', tmpDir, preDigests)

    expect(result.ok).toBe(false)
    const fileDigest = result.protected_files.find((d: BoundaryFileDigest) => d.path === file1)
    expect(fileDigest).toBeDefined()
    expect(fileDigest?.unchanged).toBe(false)
    expect(fileDigest?.sha256_before).not.toBe(fileDigest?.sha256_after)
  })

  it('graphify_out_accesses is always 0', async () => {
    const file1 = join(tmpDir, 'file.json')
    await writeFile(file1, '{}', 'utf8')

    const preDigests = await capturePreDigests([file1])
    const result = await runBoundaryAudit('/output/graph.json', tmpDir, preDigests)

    expect(result.graphify_out_accesses).toBe(0)
  })

  it('output_written matches the provided path', async () => {
    const file1 = join(tmpDir, 'file.json')
    await writeFile(file1, '{}', 'utf8')

    const preDigests = await capturePreDigests([file1])
    const expectedOutput = 'data/read-models/olfactory-graph/v2.11/graph.json'
    const result = await runBoundaryAudit(expectedOutput, tmpDir, preDigests)

    expect(result.output_written).toBe(expectedOutput)
  })

  it('compareDigests returns correct unchanged status for each file', async () => {
    const unchangedFile = join(tmpDir, 'unchanged.json')
    const changedFile = join(tmpDir, 'changed.json')
    await writeFile(unchangedFile, '{"stable": true}', 'utf8')
    await writeFile(changedFile, '{"initial": true}', 'utf8')

    const files = [unchangedFile, changedFile]
    const preDigests = await capturePreDigests(files)

    // Mutate only one file
    await writeFile(changedFile, '{"mutated": true}', 'utf8')

    const digests = await compareDigests(preDigests, files)

    const unchangedDigest = digests.find(d => d.path === unchangedFile)
    const changedDigest = digests.find(d => d.path === changedFile)

    expect(unchangedDigest?.unchanged).toBe(true)
    expect(changedDigest?.unchanged).toBe(false)
  })

  it('audit result has forbidden_prefix_rejections as empty array', async () => {
    const file1 = join(tmpDir, 'file.json')
    await writeFile(file1, '{}', 'utf8')

    const preDigests = await capturePreDigests([file1])
    const result: BoundaryAuditResult = await runBoundaryAudit('/output/graph.json', tmpDir, preDigests)

    expect(result.forbidden_prefix_rejections).toEqual([])
  })
})
