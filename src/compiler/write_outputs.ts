import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { CompileAllResult } from './compile_all.js'
import type { CompilerValidationError } from './types.js'

export const TAXONOMY_FILENAME = 'taxonomy.json'
export const ALIASES_FILENAME = 'descriptor_aliases.json'
export const SIMILARITY_FILENAME = 'similarity_matrix.json'

export class CompileWriteError extends Error {
  readonly errors: readonly CompilerValidationError[]

  constructor(errors: readonly CompilerValidationError[]) {
    super(`Cannot write invalid compile outputs: ${errors.map(error => `${error.artifact}:${error.code} at ${error.path}`).join('; ')}`)
    this.name = 'CompileWriteError'
    this.errors = errors
  }
}

export const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

const cleanupTemps = async (paths: readonly string[]): Promise<void> => {
  await Promise.all(paths.map(path => rm(path, { force: true }).catch(() => undefined)))
}

export const writeCompileResults = async (
  result: CompileAllResult,
  outputDir: string,
): Promise<string[]> => {
  if (!result.ok) {
    throw new CompileWriteError(result.validation.errors)
  }

  await mkdir(outputDir, { recursive: true })

  const outputs = [
    { tmp: join(outputDir, `.${TAXONOMY_FILENAME}.tmp`), final: join(outputDir, TAXONOMY_FILENAME), payload: result.taxonomy },
    { tmp: join(outputDir, `.${ALIASES_FILENAME}.tmp`), final: join(outputDir, ALIASES_FILENAME), payload: result.aliases },
    { tmp: join(outputDir, `.${SIMILARITY_FILENAME}.tmp`), final: join(outputDir, SIMILARITY_FILENAME), payload: result.similarity },
  ] as const

  const tempPaths = outputs.map(output => output.tmp)

  try {
    for (const output of outputs) {
      await writeJsonDeterministic(output.tmp, output.payload)
    }
    for (const output of outputs) {
      await rename(output.tmp, output.final)
    }
  } catch (error) {
    await cleanupTemps(tempPaths)
    throw error
  }

  return outputs.map(output => output.final)
}
