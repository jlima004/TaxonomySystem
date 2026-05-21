// Compiler shared types — validation result, error, and CompiledAliases wrapper
import type { DescriptorAliasMap } from '../types/taxonomy.js'

// Wrapper type for descriptor_aliases.json output
export type CompiledAliases = {
  readonly version: string
  readonly schema_version: string
  readonly generated_at: string
  readonly aliases: DescriptorAliasMap
}

// Structured validation error for compiler outputs
export type CompilerValidationError = {
  readonly artifact: 'taxonomy' | 'aliases' | 'similarity'
  readonly code: string
  readonly path: string
  readonly message: string
}

// Validation result with errors and warnings
export type CompilerValidationResult = {
  readonly ok: boolean
  readonly errors: readonly CompilerValidationError[]
  readonly warnings: readonly CompilerValidationError[]
}

// Helper to create a CompilerValidationError with $ prefix enforcement
export const makeCompilerError = (
  artifact: CompilerValidationError['artifact'],
  code: string,
  path: string,
  message: string
): CompilerValidationError => ({
  artifact,
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
})

// Combine multiple CompilerValidationResults into one
export const combineResults = (
  ...results: CompilerValidationResult[]
): CompilerValidationResult => {
  const errors: CompilerValidationError[] = []
  const warnings: CompilerValidationError[] = []
  for (const r of results) {
    errors.push(...r.errors)
    warnings.push(...r.warnings)
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}

// Recursively find all null values in a data structure
// Returns array of {path} with JSONPath-like paths ($ prefix)
const SIMPLE_JSON_PATH_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/

export const appendJsonPathKey = (basePath: string, key: string): string => {
  if (SIMPLE_JSON_PATH_KEY.test(key)) return `${basePath}.${key}`
  return `${basePath}[${JSON.stringify(key)}]`
}

export const findNullsDeep = (
  data: unknown,
  basePath: string
): Array<{ path: string }> => {
  const results: Array<{ path: string }> = []

  if (data === null) {
    results.push({ path: basePath })
    return results
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const child = data[i]
      if (child === null || (typeof child === 'object' && child !== null)) {
        results.push(...findNullsDeep(child, `${basePath}[${i}]`))
      }
    }
    return results
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      const childPath = appendJsonPathKey(basePath, key)
      if (val === null) {
        results.push({ path: childPath })
      } else if (typeof val === 'object' && val !== null) {
        results.push(...findNullsDeep(val, childPath))
      }
    }
  }

  return results
}
