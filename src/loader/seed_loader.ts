import { readFile } from 'node:fs/promises'
import type { TaxonomySeed } from '../types/seed.js'
import { validateSeed } from './seed_validator.js'

export class SeedLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SeedLoadError'
  }
}

export class SeedParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SeedParseError'
  }
}

export class SeedValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SeedValidationError'
  }
}

export const loadTaxonomySeed = async (path: string): Promise<TaxonomySeed> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new SeedLoadError(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new SeedParseError(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }

  const result = validateSeed(parsed)
  if (!result.ok || !result.value) {
    const errorMessages = result.errors
      .map(e => `[${e.path}] Expected ${e.expected}, but received ${e.received}`)
      .join('\n')
    throw new SeedValidationError(`Validation failed with ${result.errors.length} errors:\n${errorMessages}`)
  }

  return result.value
}
