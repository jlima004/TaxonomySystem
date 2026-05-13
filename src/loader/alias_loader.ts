import { readFile } from 'node:fs/promises'
import type { DescriptorAliasSeed } from '../types/alias.js'
import { validateAliasSeed } from './alias_validator.js'

export class AliasLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AliasLoadError'
  }
}

export class AliasParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AliasParseError'
  }
}

export class AliasValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AliasValidationError'
  }
}

export const loadAliasSeed = async (path: string): Promise<DescriptorAliasSeed> => {
  let content: string
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    throw new AliasLoadError(`Failed to read file at ${path}: ${error instanceof Error ? error.message : String(error)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new AliasParseError(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }

  const result = validateAliasSeed(parsed)
  if (!result.ok || !result.value) {
    const errorMessages = result.errors
      .map(e => `[${e.path}] Expected ${e.expected}, but received ${e.received}`)
      .join('\n')
    throw new AliasValidationError(`Validation failed with ${result.errors.length} errors:\n${errorMessages}`)
  }

  return result.value
}
