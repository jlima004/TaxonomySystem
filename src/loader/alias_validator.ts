import { makeError, makeResult } from './types.js'
import type { ValidationResult, ValidationError } from './types.js'
import type { DescriptorAliasSeed } from '../types/alias.js'

export const validateAliasSeed = (data: unknown, maxDepth: number = 1): ValidationResult<DescriptorAliasSeed> => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return makeResult([makeError('root', 'Record<string, string>', Array.isArray(data) ? 'array' : typeof data)])
  }

  const obj = data as Record<string, unknown>
  const seed: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value !== 'string') {
      errors.push(makeError(`alias[${key}]`, 'string', typeof value))
    } else {
      seed[key] = value
    }
  }

  if (errors.length > 0) {
    return makeResult(errors)
  }

  // Detect circular dependencies and long chains
  for (const key of Object.keys(seed)) {
    const visited = new Set<string>()
    let current: string | undefined = key
    let depth = 0

    while (current !== undefined && seed[current] !== undefined) {
      if (visited.has(current)) {
        errors.push(makeError(`alias[${key}]`, 'non-circular reference', `circular reference at ${current}`))
        break
      }
      visited.add(current)
      current = seed[current]
      depth++

      if (current !== undefined && visited.has(current)) {
        continue
      }

      if (depth > maxDepth) {
        errors.push(makeError(`alias[${key}]`, `max chain depth ${maxDepth}`, `chain depth ${depth}`))
        break
      }
    }
  }

  return makeResult<DescriptorAliasSeed>(errors, errors.length === 0 ? seed : undefined)
}
