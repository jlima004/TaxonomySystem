export type ExceptionEntry = {
  alias: string
  target: string
  rationale: string
  status: string
  approved_by?: string
  source?: string
  approved_at?: string
  milestone?: string
  review_policy?: string
  expiry?: string
}

export type ExceptionPolicy = {
  version: string
  schema_version: string
  exceptions: ExceptionEntry[]
}

export type UnresolvedEntry = {
  alias: string
  target: string
  source: string
  exception_status: string
  remediation_hint: string
}

export type AliasIntegrityResult = {
  status: 'PASS' | 'FAIL'
  seed_alias_count: number
  compiled_descriptor_count: number
  valid_target_count: number
  unresolved_target_count: number
  unresolved: UnresolvedEntry[]
}

export const validateExceptionPolicy = (policy: unknown): policy is ExceptionPolicy => {
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) return false

  const obj = policy as Record<string, unknown>
  if (obj['version'] !== '1.0.0') return false
  if (obj['schema_version'] !== 'alias_target_exceptions.v1') return false
  if (!Array.isArray(obj['exceptions'])) return false

  for (const entry of obj['exceptions']) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false
    const e = entry as Record<string, unknown>
    if (typeof e['alias'] !== 'string') return false
    if (typeof e['target'] !== 'string') return false
    if (typeof e['rationale'] !== 'string') return false
    if (typeof e['status'] !== 'string') return false
    
    if (e['approved_by'] !== undefined && typeof e['approved_by'] !== 'string') return false
    if (e['source'] !== undefined && typeof e['source'] !== 'string') return false
    if (e['approved_by'] === undefined && e['source'] === undefined) return false

    if (e['approved_at'] !== undefined && typeof e['approved_at'] !== 'string') return false
    if (e['milestone'] !== undefined && typeof e['milestone'] !== 'string') return false
    if (e['approved_at'] === undefined && e['milestone'] === undefined) return false
    
    if (e['review_policy'] !== undefined && typeof e['review_policy'] !== 'string') return false
    if (e['expiry'] !== undefined && typeof e['expiry'] !== 'string') return false
  }

  return true
}

export const validateAliasTargetIntegrity = (
  seedAliases: Record<string, string>,
  compiledDescriptorIds: Set<string>,
  exceptionPolicy: unknown,
  aliasSource: string = 'data/taxonomy/descriptor_aliases.seed.json'
): AliasIntegrityResult => {
  if (!validateExceptionPolicy(exceptionPolicy)) {
    return {
      status: 'FAIL',
      seed_alias_count: 0,
      compiled_descriptor_count: 0,
      valid_target_count: 0,
      unresolved_target_count: 1,
      unresolved: [
        {
          alias: 'N/A',
          target: 'N/A',
          source: aliasSource,
          exception_status: 'malformed_policy',
          remediation_hint: 'Fix alias_target_exceptions.v1.json to match the required schema',
        }
      ]
    }
  }

  const exceptionMap = new Map<string, ExceptionEntry>()
  for (const entry of exceptionPolicy.exceptions) {
    if (entry.status === 'approved') {
      exceptionMap.set(`${entry.alias} -> ${entry.target}`, entry)
    }
  }

  const unresolved: UnresolvedEntry[] = []
  let valid_target_count = 0

  for (const [alias, target] of Object.entries(seedAliases)) {
    if (compiledDescriptorIds.has(target)) {
      valid_target_count++
    } else {
      const exceptionKey = `${alias} -> ${target}`
      const exception = exceptionMap.get(exceptionKey)
      
      if (exception) {
        valid_target_count++ // Approved exceptions count as valid
      } else {
        unresolved.push({
          alias,
          target,
          source: aliasSource,
          exception_status: 'none',
          remediation_hint: 'resolve in Phase 51 by adding target, correcting alias, dropping alias, or documenting an approved exception.'
        })
      }
    }
  }

  return {
    status: unresolved.length === 0 ? 'PASS' : 'FAIL',
    seed_alias_count: Object.keys(seedAliases).length,
    compiled_descriptor_count: compiledDescriptorIds.size,
    valid_target_count,
    unresolved_target_count: unresolved.length,
    unresolved,
  }
}
