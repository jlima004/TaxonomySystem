import type { ValidationError, ValidationResult } from './types.js'
import { makeError, makeResult } from './types.js'
import type { TaxonomySeed } from '../types/seed.js'

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isSnakeCase = (s: string): boolean => /^[a-z][a-z0-9_]*$/.test(s)

export const validateSeed = (data: unknown): ValidationResult<TaxonomySeed> => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    return makeResult([makeError('root', 'object', typeof data)])
  }

  const obj = data as Record<string, unknown>

  if (!isNonEmptyString(obj.version)) {
    errors.push(makeError('version', 'non-empty string', String(obj.version)))
  }

  if (!obj.metadata || typeof obj.metadata !== 'object') {
    errors.push(makeError('metadata', 'object', typeof obj.metadata))
  } else {
    const metadata = obj.metadata as Record<string, unknown>
    if (!isNonEmptyString(metadata.created_at)) {
      errors.push(makeError('metadata.created_at', 'non-empty string', String(metadata.created_at)))
    }
    if (!isNonEmptyString(metadata.author)) {
      errors.push(makeError('metadata.author', 'non-empty string', String(metadata.author)))
    }
    if (!isNonEmptyString(metadata.description)) {
      errors.push(makeError('metadata.description', 'non-empty string', String(metadata.description)))
    }
  }

  if (!Array.isArray(obj.families) || obj.families.length === 0) {
    errors.push(makeError('families', 'non-empty array', Array.isArray(obj.families) ? 'empty array' : typeof obj.families))
  } else {
    const familyIds = new Set<string>()
    const globalSubfamilyIds = new Set<string>()

    obj.families.forEach((family: unknown, fIdx: number) => {
      if (!family || typeof family !== 'object') {
        errors.push(makeError(`families[${fIdx}]`, 'object', typeof family))
        return
      }

      const fObj = family as Record<string, unknown>
      const familyName = isNonEmptyString(fObj.name) ? fObj.name : String(fIdx)
      const familyPath = `Family ${familyName}`

      if (!isNonEmptyString(fObj.id)) {
        errors.push(makeError(`${familyPath} (id)`, 'non-empty string', String(fObj.id)))
      } else if (!isSnakeCase(fObj.id)) {
        errors.push(makeError(`${familyPath} (id)`, 'snake_case string', fObj.id))
      } else if (familyIds.has(fObj.id)) {
        errors.push(makeError(`${familyPath} (id)`, 'unique family id', fObj.id))
      } else {
        familyIds.add(fObj.id)
      }

      if (!isNonEmptyString(fObj.name)) {
        errors.push(makeError(`${familyPath} (name)`, 'non-empty string', String(fObj.name)))
      }

      if (!Array.isArray(fObj.subfamilies) || fObj.subfamilies.length === 0) {
        errors.push(makeError(`${familyPath} > subfamilies`, 'non-empty array', Array.isArray(fObj.subfamilies) ? 'empty array' : typeof fObj.subfamilies))
      } else {
        fObj.subfamilies.forEach((subfamily: unknown, sIdx: number) => {
          if (!subfamily || typeof subfamily !== 'object') {
            errors.push(makeError(`${familyPath} > subfamilies[${sIdx}]`, 'object', typeof subfamily))
            return
          }

          const sObj = subfamily as Record<string, unknown>
          const subfamilyName = isNonEmptyString(sObj.name) ? sObj.name : String(sIdx)
          const subfamilyPath = `${familyPath} > Subfamily ${subfamilyName}`

          if (!isNonEmptyString(sObj.id)) {
            errors.push(makeError(`${subfamilyPath} (id)`, 'non-empty string', String(sObj.id)))
          } else if (!isSnakeCase(sObj.id)) {
            errors.push(makeError(`${subfamilyPath} (id)`, 'snake_case string', sObj.id))
          } else if (globalSubfamilyIds.has(sObj.id)) {
            errors.push(makeError(`${subfamilyPath} (id)`, 'unique global subfamily id', sObj.id))
          } else {
            globalSubfamilyIds.add(sObj.id)
          }

          if (!isNonEmptyString(sObj.name)) {
            errors.push(makeError(`${subfamilyPath} (name)`, 'non-empty string', String(sObj.name)))
          }

          if (!Array.isArray(sObj.descriptors) || sObj.descriptors.length === 0) {
            errors.push(makeError(`${subfamilyPath} > descriptors`, 'non-empty array', Array.isArray(sObj.descriptors) ? 'empty array' : typeof sObj.descriptors))
          } else {
            const descriptorsSet = new Set<string>()
            sObj.descriptors.forEach((desc: unknown, dIdx: number) => {
              const descPath = `${subfamilyPath} > descriptors[${dIdx}]`
              if (!isNonEmptyString(desc)) {
                errors.push(makeError(descPath, 'non-empty string', String(desc)))
              } else if (!isSnakeCase(desc as string)) {
                errors.push(makeError(descPath, 'snake_case string', desc as string))
              } else {
                if (descriptorsSet.has(desc as string)) {
                  errors.push(makeError(descPath, 'unique descriptor in subfamily', desc as string))
                } else {
                  descriptorsSet.add(desc as string)
                }
              }
            })
          }
        })
      }
    })
  }

  return makeResult<TaxonomySeed>(errors, errors.length === 0 ? (data as TaxonomySeed) : undefined)
}
