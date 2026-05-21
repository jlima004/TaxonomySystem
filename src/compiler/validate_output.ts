// Schema validators for compiled taxonomy outputs
// Pure functions: unknown → CompilerValidationResult
import type { CompilerValidationResult } from './types.js'
import { makeCompilerError, combineResults, findNullsDeep } from './types.js'

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0

const isNumberInRange = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && !Number.isNaN(v) && v >= min && v <= max

const isNonNegativeNumber = (v: unknown): v is number =>
  typeof v === 'number' && !Number.isNaN(v) && v >= 0

// ---------------------------------------------------------------------------
// validateCompiledTaxonomy
// ---------------------------------------------------------------------------
export const validateCompiledTaxonomy = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'taxonomy' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }

  // Deep null rejection
  const nulls = findNullsDeep(data, '$')
  for (const n of nulls) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', n.path, `null is not allowed at ${n.path}`))
  }

  const obj = data as Record<string, unknown>

  // version
  if (!isNonEmptyString(obj['version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.version', 'version must be a non-empty string'))
  }

  // generated_at
  if (!isNonEmptyString(obj['generated_at'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.generated_at', 'generated_at must be a non-empty string'))
  }

  // stats
  if (!obj['stats'] || typeof obj['stats'] !== 'object' || Array.isArray(obj['stats'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.stats', 'stats must be an object'))
  } else {
    const stats = obj['stats'] as Record<string, unknown>
    if (!isNonNegativeNumber(stats['family_count'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.family_count', 'family_count must be a number >= 0'))
    }
    if (!isNonNegativeNumber(stats['subfamily_count'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.subfamily_count', 'subfamily_count must be a number >= 0'))
    }
    if (!isNonNegativeNumber(stats['descriptor_count'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.descriptor_count', 'descriptor_count must be a number >= 0'))
    }
  }

  // families
  if (!Array.isArray(obj['families'])) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.families', 'families must be an array'))
    return { ok: errors.length === 0, errors, warnings }
  }

  const families = obj['families'] as unknown[]
  const familyIds = new Set<string>()
  const subfamilyIds = new Set<string>()
  let totalSubfamilies = 0
  let totalDescriptors = 0

  for (let fi = 0; fi < families.length; fi++) {
    const fam = families[fi]
    const fp = `$.families[${fi}]`

    if (!fam || typeof fam !== 'object' || Array.isArray(fam)) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', fp, 'family must be an object'))
      continue
    }

    const fObj = fam as Record<string, unknown>

    // family.id
    if (!isNonEmptyString(fObj['id'])) {
      errors.push(makeCompilerError(A, 'MISSING_FIELD', `${fp}.id`, 'family id must be a non-empty string'))
    } else if (familyIds.has(fObj['id'])) {
      errors.push(makeCompilerError(A, 'DUPLICATE_ID', `${fp}.id`, `duplicate family id: ${fObj['id']}`))
    } else {
      familyIds.add(fObj['id'])
    }

    // family.name
    if (!isNonEmptyString(fObj['name'])) {
      errors.push(makeCompilerError(A, 'MISSING_FIELD', `${fp}.name`, 'family name must be a non-empty string'))
    }

    // family.subfamilies
    if (!Array.isArray(fObj['subfamilies'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', `${fp}.subfamilies`, 'subfamilies must be an array'))
      continue
    }

    const subs = fObj['subfamilies'] as unknown[]
    totalSubfamilies += subs.length

    for (let si = 0; si < subs.length; si++) {
      const sub = subs[si]
      const sp = `${fp}.subfamilies[${si}]`

      if (!sub || typeof sub !== 'object' || Array.isArray(sub)) {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', sp, 'subfamily must be an object'))
        continue
      }

      const sObj = sub as Record<string, unknown>

      // subfamily.id
      if (!isNonEmptyString(sObj['id'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${sp}.id`, 'subfamily id must be a non-empty string'))
      } else if (subfamilyIds.has(sObj['id'])) {
        errors.push(makeCompilerError(A, 'DUPLICATE_ID', `${sp}.id`, `duplicate subfamily id: ${sObj['id']}`))
      } else {
        subfamilyIds.add(sObj['id'])
      }

      // subfamily.name
      if (!isNonEmptyString(sObj['name'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${sp}.name`, 'subfamily name must be a non-empty string'))
      }

      // subfamily.family_id
      if (!isNonEmptyString(sObj['family_id'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${sp}.family_id`, 'subfamily family_id must be a non-empty string'))
      } else if (isNonEmptyString(fObj['id']) && sObj['family_id'] !== fObj['id']) {
        errors.push(makeCompilerError(A, 'INVALID_VALUE', `${sp}.family_id`, `subfamily family_id '${sObj['family_id']}' does not match parent family id '${fObj['id']}'`))
      }

      // subfamily.descriptors
      if (!Array.isArray(sObj['descriptors'])) {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', `${sp}.descriptors`, 'descriptors must be an array'))
        continue
      }

      const descs = sObj['descriptors'] as unknown[]
      totalDescriptors += descs.length

      for (let di = 0; di < descs.length; di++) {
        const desc = descs[di]
        const dp = `${sp}.descriptors[${di}]`

        if (!desc || typeof desc !== 'object' || Array.isArray(desc)) {
          errors.push(makeCompilerError(A, 'INVALID_TYPE', dp, 'descriptor must be an object'))
          continue
        }

        const dObj = desc as Record<string, unknown>

        if (!isNonEmptyString(dObj['id'])) {
          errors.push(makeCompilerError(A, 'MISSING_FIELD', `${dp}.id`, 'descriptor id must be a non-empty string'))
        }

        const validSources = ['seed', 'corpus', 'inferred'] as const
        if (!validSources.includes(dObj['source'] as typeof validSources[number])) {
          errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.source`, `source must be one of: seed, corpus, inferred. Got: ${String(dObj['source'])}`))
        }

        if (!isNonNegativeNumber(dObj['frequency'])) {
          errors.push(makeCompilerError(A, 'INVALID_TYPE', `${dp}.frequency`, 'frequency must be a number >= 0'))
        }

        const validStatuses = ['curated', 'candidate', 'inferred'] as const
        if (!validStatuses.includes(dObj['status'] as typeof validStatuses[number])) {
          errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `status must be one of: curated, candidate, inferred. Got: ${String(dObj['status'])}`))
        }

        if (typeof dObj['review_required'] !== 'boolean') {
          errors.push(makeCompilerError(A, 'INVALID_TYPE', `${dp}.review_required`, 'review_required must be a boolean'))
        }

        if (typeof dObj['corpus_derived'] !== 'boolean') {
          errors.push(makeCompilerError(A, 'INVALID_TYPE', `${dp}.corpus_derived`, 'corpus_derived must be a boolean'))
        }

        // Invariants
        const src = dObj['source']
        const status = dObj['status']
        const reviewReq = dObj['review_required']
        const corpusDer = dObj['corpus_derived']

        if (src === 'seed') {
          if (status !== 'curated') {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `seed descriptor must have status 'curated', got '${String(status)}'`))
          }
          if (reviewReq !== false) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.review_required`, 'seed descriptor must have review_required: false'))
          }
          if (corpusDer !== false) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.corpus_derived`, 'seed descriptor must have corpus_derived: false'))
          }
        } else if (src === 'corpus') {
          if (status !== 'candidate') {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `corpus descriptor must have status 'candidate', got '${String(status)}'`))
          }
          if (reviewReq !== true) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.review_required`, 'corpus descriptor must have review_required: true'))
          }
          if (corpusDer !== true) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.corpus_derived`, 'corpus descriptor must have corpus_derived: true'))
          }
        } else if (src === 'inferred') {
          if (status !== 'inferred') {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `inferred descriptor must have status 'inferred', got '${String(status)}'`))
          }
          if (reviewReq !== true) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.review_required`, 'inferred descriptor must have review_required: true'))
          }
          if (corpusDer !== true) {
            errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.corpus_derived`, 'inferred descriptor must have corpus_derived: true'))
          }
        }
      }
    }
  }

  // Stats consistency
  if (obj['stats'] && typeof obj['stats'] === 'object' && !Array.isArray(obj['stats'])) {
    const stats = obj['stats'] as Record<string, unknown>
    if (typeof stats['family_count'] === 'number' && stats['family_count'] !== families.length) {
      errors.push(makeCompilerError(A, 'INCONSISTENT_STATS', '$.stats.family_count', `family_count (${stats['family_count']}) != families.length (${families.length})`))
    }
    if (typeof stats['subfamily_count'] === 'number' && stats['subfamily_count'] !== totalSubfamilies) {
      errors.push(makeCompilerError(A, 'INCONSISTENT_STATS', '$.stats.subfamily_count', `subfamily_count (${stats['subfamily_count']}) != actual (${totalSubfamilies})`))
    }
    if (typeof stats['descriptor_count'] === 'number' && stats['descriptor_count'] !== totalDescriptors) {
      errors.push(makeCompilerError(A, 'INCONSISTENT_STATS', '$.stats.descriptor_count', `descriptor_count (${stats['descriptor_count']}) != actual (${totalDescriptors})`))
    }
  }

  return { ok: errors.length === 0, errors, warnings }
}

// ---------------------------------------------------------------------------
// validateCompiledAliases
// ---------------------------------------------------------------------------
export const validateCompiledAliases = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'aliases' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }

  // Deep null rejection
  const nulls = findNullsDeep(data, '$')
  for (const n of nulls) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', n.path, `null is not allowed at ${n.path}`))
  }

  const obj = data as Record<string, unknown>

  if (!isNonEmptyString(obj['version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.version', 'version must be a non-empty string'))
  }

  if (!isNonEmptyString(obj['schema_version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.schema_version', 'schema_version must be a non-empty string'))
  }

  if (!isNonEmptyString(obj['generated_at'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.generated_at', 'generated_at must be a non-empty string'))
  }

  if (obj['aliases'] === undefined || obj['aliases'] === null || typeof obj['aliases'] !== 'object' || Array.isArray(obj['aliases'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.aliases', 'aliases must be an object'))
  } else {
    const aliases = obj['aliases'] as Record<string, unknown>
    for (const key of Object.keys(aliases)) {
      const val = aliases[key]
      if (!isNonEmptyString(key)) {
        errors.push(makeCompilerError(A, 'INVALID_VALUE', `$.aliases["${key}"]`, 'alias key must be a non-empty string'))
      }
      if (typeof val !== 'string' || val.trim().length === 0) {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', `$.aliases["${key}"]`, 'alias value must be a non-empty string'))
      } else if (key === val) {
        errors.push(makeCompilerError(A, 'INVALID_VALUE', `$.aliases["${key}"]`, `alias points to itself: ${key}`))
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings }
}

// ---------------------------------------------------------------------------
// validateSimilarityGraph
// ---------------------------------------------------------------------------
export const validateSimilarityGraph = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'similarity' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }

  // Deep null rejection
  const nulls = findNullsDeep(data, '$')
  for (const n of nulls) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', n.path, `null is not allowed at ${n.path}`))
  }

  const obj = data as Record<string, unknown>

  if (!isNonEmptyString(obj['version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.version', 'version must be a non-empty string'))
  }

  if (!isNonEmptyString(obj['generated_at'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.generated_at', 'generated_at must be a non-empty string'))
  }

  // threshold
  if (typeof obj['threshold'] !== 'number' || Number.isNaN(obj['threshold'])) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.threshold', 'threshold must be a number'))
  } else if (obj['threshold'] < 0 || obj['threshold'] > 1) {
    errors.push(makeCompilerError(A, 'INVALID_VALUE', '$.threshold', `threshold must be in [0, 1], got ${obj['threshold']}`))
  } else if (obj['threshold'] === 0) {
    warnings.push(makeCompilerError(A, 'INVALID_VALUE', '$.threshold', 'threshold is 0 — all edges will be included'))
  }

  // dimensions
  if (!Array.isArray(obj['dimensions'])) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.dimensions', 'dimensions must be an array'))
  } else {
    const dims = obj['dimensions'] as unknown[]
    for (let i = 0; i < dims.length; i++) {
      const dim = dims[i]
      const dp = `$.dimensions[${i}]`
      if (!dim || typeof dim !== 'object' || Array.isArray(dim)) {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', dp, 'dimension must be an object'))
        continue
      }
      const dObj = dim as Record<string, unknown>
      if (!isNonEmptyString(dObj['id'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${dp}.id`, 'dimension id must be a non-empty string'))
      }
      if (!isNonEmptyString(dObj['name'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${dp}.name`, 'dimension name must be a non-empty string'))
      }
      if (typeof dObj['weight'] !== 'number') {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', `${dp}.weight`, 'dimension weight must be a number'))
      }
    }
  }

  // edges
  if (!Array.isArray(obj['edges'])) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.edges', 'edges must be an array'))
  } else {
    const edges = obj['edges'] as unknown[]
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      const ep = `$.edges[${i}]`
      if (!edge || typeof edge !== 'object' || Array.isArray(edge)) {
        errors.push(makeCompilerError(A, 'INVALID_TYPE', ep, 'edge must be an object'))
        continue
      }
      const eObj = edge as Record<string, unknown>

      if (!isNonEmptyString(eObj['source'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${ep}.source`, 'edge source must be a non-empty string'))
      }
      if (!isNonEmptyString(eObj['target'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${ep}.target`, 'edge target must be a non-empty string'))
      }

      // edge.score
      if (typeof eObj['score'] !== 'number' || Number.isNaN(eObj['score'])) {
        errors.push(makeCompilerError(A, 'MISSING_FIELD', `${ep}.score`, 'edge score must be a number'))
      } else if (eObj['score'] < 0 || eObj['score'] > 1) {
        errors.push(makeCompilerError(A, 'INVALID_VALUE', `${ep}.score`, `edge score must be in [0, 1], got ${eObj['score']}`))
      }

      // edge.final_score (optional)
      if (eObj['final_score'] !== undefined) {
        if (typeof eObj['final_score'] !== 'number' || Number.isNaN(eObj['final_score'])) {
          errors.push(makeCompilerError(A, 'INVALID_TYPE', `${ep}.final_score`, 'edge final_score must be a number'))
        } else if (eObj['final_score'] < 0 || eObj['final_score'] > 1) {
          errors.push(makeCompilerError(A, 'INVALID_VALUE', `${ep}.final_score`, `edge final_score must be in [0, 1], got ${eObj['final_score']}`))
        } else if (typeof eObj['score'] === 'number' && eObj['score'] !== eObj['final_score']) {
          errors.push(makeCompilerError(A, 'INCONSISTENT_SCORE', `${ep}`, `edge.score (${eObj['score']}) !== edge.final_score (${eObj['final_score']})`))
        }
      }

      // edge.dimensions
      if (eObj['dimensions'] && typeof eObj['dimensions'] === 'object' && !Array.isArray(eObj['dimensions'])) {
        const dims = eObj['dimensions'] as Record<string, unknown>
        for (const dimId of Object.keys(dims)) {
          const dv = dims[dimId]
          if (typeof dv === 'number' && !Number.isNaN(dv)) {
            if (dv < 0 || dv > 1) {
              errors.push(makeCompilerError(A, 'INVALID_VALUE', `${ep}.dimensions.${dimId}`, `dimension score must be in [0, 1], got ${dv}`))
            }
          }
        }
      }
    }
  }

  // review_queue
  if (obj['review_queue'] !== undefined && !Array.isArray(obj['review_queue'])) {
    errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.review_queue', 'review_queue must be an array'))
  }

  // stats
  if (!obj['stats'] || typeof obj['stats'] !== 'object' || Array.isArray(obj['stats'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.stats', 'stats must be an object'))
  } else {
    const stats = obj['stats'] as Record<string, unknown>

    if (!isNonNegativeNumber(stats['subfamily_count'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.subfamily_count', 'stats.subfamily_count must be a number >= 0'))
    }
    if (!isNonNegativeNumber(stats['edge_count'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.edge_count', 'stats.edge_count must be a number >= 0'))
    }

    // density range
    if (typeof stats['density'] !== 'number' || Number.isNaN(stats['density'])) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.stats.density', 'stats.density must be a number'))
    } else if (!isNumberInRange(stats['density'], 0, 1)) {
      errors.push(makeCompilerError(A, 'INVALID_VALUE', '$.stats.density', `stats.density must be in [0, 1], got ${stats['density']}`))
    }

    // edge_count consistency
    if (
      typeof stats['edge_count'] === 'number' &&
      Array.isArray(obj['edges']) &&
      stats['edge_count'] !== (obj['edges'] as unknown[]).length
    ) {
      errors.push(makeCompilerError(A, 'INCONSISTENT_STATS', '$.stats.edge_count', `stats.edge_count (${stats['edge_count']}) != edges.length (${(obj['edges'] as unknown[]).length})`))
    }
  }

  return { ok: errors.length === 0, errors, warnings }
}

// ---------------------------------------------------------------------------
// validateAllOutputs
// ---------------------------------------------------------------------------
export const validateAllOutputs = (
  taxonomy: unknown,
  aliases: unknown,
  similarity: unknown
): CompilerValidationResult => {
  return combineResults(
    validateCompiledTaxonomy(taxonomy),
    validateCompiledAliases(aliases),
    validateSimilarityGraph(similarity),
  )
}
