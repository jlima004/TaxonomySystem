import { mkdir, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { writeJsonDeterministic } from '../compiler/write_outputs.js'
import { GRAPH_OUTPUT_POLICY } from './contract.js'
import type { OlfactoryGraph } from './types.js'

export class GraphWriteError extends Error {
  readonly code: 'forbidden_prefix' | 'validation_failed' | 'write_failed'

  constructor(message: string, code: 'forbidden_prefix' | 'validation_failed' | 'write_failed') {
    super(message)
    this.name = 'GraphWriteError'
    this.code = code
  }
}

/**
 * Normalizes a path for prefix comparison: strips trailing slash and converts to forward slashes.
 */
const normalizePath = (p: string): string => p.replace(/\\/g, '/').replace(/\/$/, '')

/**
 * Validates that the output directory is not a forbidden path.
 * Throws GraphWriteError with code 'forbidden_prefix' if the path is rejected.
 *
 * Rejected paths:
 * - Any path starting with a forbidden prefix from GRAPH_OUTPUT_POLICY.forbidden_output_prefixes
 * - Any path containing 'graphify-out' anywhere (GVAL-04 write guard)
 */
export const validateOutputPath = (outputDir: string): void => {
  const normalized = normalizePath(outputDir)

  // GVAL-04: Reject any path containing graphify-out anywhere
  if (normalized.includes('graphify-out')) {
    throw new GraphWriteError(
      `Output path rejected: path contains 'graphify-out' (GVAL-04 isolation guard). Got: ${outputDir}`,
      'forbidden_prefix',
    )
  }

  // Reject paths matching forbidden prefixes
  for (const prefix of GRAPH_OUTPUT_POLICY.forbidden_output_prefixes) {
    const normalizedPrefix = normalizePath(prefix)
    if (normalized.startsWith(normalizedPrefix)) {
      throw new GraphWriteError(
        `Output path rejected: path starts with forbidden prefix '${prefix}'. Got: ${outputDir}`,
        'forbidden_prefix',
      )
    }
  }
}

/**
 * Writes an OlfactoryGraph to the specified output directory using the atomic tmp→rename pattern.
 *
 * Workflow:
 * 1. Validate output path against policy
 * 2. Create output directory (recursive)
 * 3. Write to .graph.json.tmp
 * 4. Rename to graph.json
 * 5. On failure: cleanup tmp, re-throw
 *
 * Returns the final output path.
 */
export const writeGraphOutput = async (
  graph: OlfactoryGraph,
  outputDir: string,
): Promise<string> => {
  validateOutputPath(outputDir)

  await mkdir(outputDir, { recursive: true })

  const tmpPath = join(outputDir, '.graph.json.tmp')
  const finalPath = join(outputDir, 'graph.json')

  try {
    await writeJsonDeterministic(tmpPath, graph)
    await rename(tmpPath, finalPath)
  } catch (error) {
    await rm(tmpPath, { force: true })
    throw error
  }

  return finalPath
}
