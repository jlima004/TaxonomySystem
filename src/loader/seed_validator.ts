import type { ValidationError, ValidationResult } from './types.js'
import { make_error, make_result } from './types.js'

const is_non_empty_string = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const is_snake_case = (s: string): boolean => /^[a-z][a-z0-9_]*$/.test(s)

export const validate_seed = (data: unknown): ValidationResult => {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    return make_result([make_error('root', 'object', typeof data)])
  }

  const obj = data as Record<string, unknown>

  // R1: version é string não-vazia
  if (!is_non_empty_string(obj.version)) {
    errors.push(make_error('version', 'non-empty string', String(obj.version)))
  }

  // Metadata checks
  if (!obj.metadata || typeof obj.metadata !== 'object') {
    errors.push(make_error('metadata', 'object', typeof obj.metadata))
  } else {
    const metadata = obj.metadata as Record<string, unknown>
    // R2: metadata.created_at é string não-vazia
    if (!is_non_empty_string(metadata.created_at)) {
      errors.push(make_error('metadata.created_at', 'non-empty string', String(metadata.created_at)))
    }
    // R3: metadata.author é string não-vazia
    if (!is_non_empty_string(metadata.author)) {
      errors.push(make_error('metadata.author', 'non-empty string', String(metadata.author)))
    }
    // R4: metadata.description é string não-vazia
    if (!is_non_empty_string(metadata.description)) {
      errors.push(make_error('metadata.description', 'non-empty string', String(metadata.description)))
    }
  }

  // R5: families é array não-vazio
  if (!Array.isArray(obj.families) || obj.families.length === 0) {
    errors.push(make_error('families', 'non-empty array', Array.isArray(obj.families) ? 'empty array' : typeof obj.families))
  } else {
    const family_ids = new Set<string>()
    const global_subfamily_ids = new Set<string>()

    obj.families.forEach((family: unknown, f_idx: number) => {
      const family_path = `families[${f_idx}]`
      
      if (!family || typeof family !== 'object') {
        errors.push(make_error(family_path, 'object', typeof family))
        return
      }

      const f_obj = family as Record<string, unknown>

      // R6: families[].id é snake_case, único entre todas as families
      if (!is_non_empty_string(f_obj.id)) {
        errors.push(make_error(`${family_path}.id`, 'non-empty string', String(f_obj.id)))
      } else if (!is_snake_case(f_obj.id)) {
        errors.push(make_error(`${family_path}.id`, 'snake_case string', f_obj.id))
      } else if (family_ids.has(f_obj.id)) {
        errors.push(make_error(`${family_path}.id`, 'unique family id', f_obj.id))
      } else {
        family_ids.add(f_obj.id)
      }

      // R7: families[].name é string não-vazia
      if (!is_non_empty_string(f_obj.name)) {
        errors.push(make_error(`${family_path}.name`, 'non-empty string', String(f_obj.name)))
      }

      // R8: families[].subfamilies é array não-vazio para cada family
      if (!Array.isArray(f_obj.subfamilies) || f_obj.subfamilies.length === 0) {
        errors.push(make_error(`${family_path}.subfamilies`, 'non-empty array', Array.isArray(f_obj.subfamilies) ? 'empty array' : typeof f_obj.subfamilies))
      } else {
        f_obj.subfamilies.forEach((subfamily: unknown, s_idx: number) => {
          const subfamily_path = `${family_path}.subfamilies[${s_idx}]`

          if (!subfamily || typeof subfamily !== 'object') {
            errors.push(make_error(subfamily_path, 'object', typeof subfamily))
            return
          }

          const s_obj = subfamily as Record<string, unknown>

          // R9: subfamilies[].id é snake_case, único GLOBAL
          if (!is_non_empty_string(s_obj.id)) {
            errors.push(make_error(`${subfamily_path}.id`, 'non-empty string', String(s_obj.id)))
          } else if (!is_snake_case(s_obj.id)) {
            errors.push(make_error(`${subfamily_path}.id`, 'snake_case string', s_obj.id))
          } else if (global_subfamily_ids.has(s_obj.id)) {
            errors.push(make_error(`${subfamily_path}.id`, 'unique global subfamily id', s_obj.id))
          } else {
            global_subfamily_ids.add(s_obj.id)
          }

          // R10: subfamilies[].name é string não-vazia
          if (!is_non_empty_string(s_obj.name)) {
            errors.push(make_error(`${subfamily_path}.name`, 'non-empty string', String(s_obj.name)))
          }

          // R11: subfamilies[].descriptors é array não-vazio de strings não-vazias
          if (!Array.isArray(s_obj.descriptors) || s_obj.descriptors.length === 0) {
            errors.push(make_error(`${subfamily_path}.descriptors`, 'non-empty array', Array.isArray(s_obj.descriptors) ? 'empty array' : typeof s_obj.descriptors))
          } else {
            const descriptors_set = new Set<string>()
            s_obj.descriptors.forEach((desc: unknown, d_idx: number) => {
              const desc_path = `${subfamily_path}.descriptors[${d_idx}]`
              if (!is_non_empty_string(desc)) {
                errors.push(make_error(desc_path, 'non-empty string', String(desc)))
              } else {
                // R12: Nenhum descriptor duplicado dentro da mesma subfamily
                if (descriptors_set.has(desc)) {
                  errors.push(make_error(desc_path, 'unique descriptor in subfamily', desc))
                } else {
                  descriptors_set.add(desc)
                }
              }
            })
          }
        })
      }
    })
  }

  return make_result(errors)
}
