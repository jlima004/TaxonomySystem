import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export type BoundaryFileDigest = {
  path: string
  sha256_before: string
  sha256_after: string
  unchanged: boolean
}

export type BoundaryAuditResult = {
  ok: boolean
  protected_files: BoundaryFileDigest[]
  graphify_out_accesses: 0
  output_written: string
  forbidden_prefix_rejections: string[]
}

/**
 * Computes the SHA-256 hex digest of a file's contents.
 */
export const hashFile = async (filePath: string): Promise<string> => {
  const content = await readFile(filePath)
  return createHash('sha256').update(content).digest('hex')
}

/**
 * The exact named protected files for GVAL-03 boundary audit (D-13).
 * These are protected taxonomy seeds that must never be mutated by the graph workflow.
 */
export const GVAL_03_PROTECTED_FILES: readonly string[] = [
  'data/taxonomy/taxonomy-seed.v2.json',
  'data/taxonomy/descriptor_aliases.seed.json',
  'data/taxonomy/alias_target_exceptions.v1.json',
]

/**
 * Discovers the full set of protected files for GVAL-03:
 * - The 3 named taxonomy seed files (GVAL_03_PROTECTED_FILES)
 * - All files dynamically discovered under data/compiled/v2/
 *
 * All paths are resolved relative to baseDir. Returns a sorted array of absolute paths.
 */
export const discoverProtectedFiles = async (baseDir: string): Promise<string[]> => {
  const namedFiles = GVAL_03_PROTECTED_FILES.map(f => resolve(baseDir, f))

  const compiledV2Dir = resolve(baseDir, 'data/compiled/v2')
  let compiledFiles: string[] = []
  try {
    const entries = await readdir(compiledV2Dir)
    compiledFiles = entries.map(entry => join(compiledV2Dir, entry))
  } catch {
    // If directory doesn't exist, return only named files
  }

  const allFiles = [...namedFiles, ...compiledFiles]
  return [...new Set(allFiles)].sort()
}

/**
 * Hashes all files and returns a map of path → sha256.
 */
export const capturePreDigests = async (
  files: readonly string[],
): Promise<Map<string, string>> => {
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const hash = await hashFile(filePath)
      return [filePath, hash] as const
    }),
  )
  return new Map(entries)
}

/**
 * Re-hashes files and compares with pre-digests.
 * Returns an array of BoundaryFileDigest for each file.
 */
export const compareDigests = async (
  preDigests: Map<string, string>,
  files: readonly string[],
): Promise<BoundaryFileDigest[]> => {
  return Promise.all(
    files.map(async (filePath) => {
      const sha256_before = preDigests.get(filePath) ?? ''
      const sha256_after = await hashFile(filePath)
      return {
        path: filePath,
        sha256_before,
        sha256_after,
        unchanged: sha256_before === sha256_after,
      }
    }),
  )
}

/**
 * Runs the boundary audit after graph write:
 * - Re-hashes protected files and compares with pre-digests
 * - Reports graphify_out_accesses as 0 (static, per D-14 — GVAL-04 is enforced via path guard, not content hashing)
 * - Returns ok: true only if ALL protected files remain unchanged
 */
export const runBoundaryAudit = async (
  outputWritten: string,
  baseDir: string,
  preDigests: Map<string, string>,
): Promise<BoundaryAuditResult> => {
  const files = [...preDigests.keys()]
  const fileDigests = await compareDigests(preDigests, files)

  const ok = fileDigests.every(digest => digest.unchanged)

  return {
    ok,
    protected_files: fileDigests,
    graphify_out_accesses: 0,
    output_written: outputWritten,
    forbidden_prefix_rejections: [],
  }
}
