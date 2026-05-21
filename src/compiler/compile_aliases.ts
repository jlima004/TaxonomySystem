import type { DescriptorAliasSeed } from '../types/alias.js'
import type { CompiledAliases } from './types.js'

export type CompileAliasesOptions = {
  readonly version?: string
  readonly schemaVersion?: string
  readonly generatedAt: string
}

const DEFAULT_VERSION = '1.0.0'
const DEFAULT_SCHEMA_VERSION = '1'

export const compileAliases = (
  aliasSeed: DescriptorAliasSeed,
  options: CompileAliasesOptions,
): CompiledAliases => {
  const aliases = Object.fromEntries(
    Object.entries(aliasSeed).sort(([left], [right]) => left.localeCompare(right)),
  )

  return {
    version: options.version ?? DEFAULT_VERSION,
    schema_version: options.schemaVersion ?? DEFAULT_SCHEMA_VERSION,
    generated_at: options.generatedAt,
    aliases,
  }
}
