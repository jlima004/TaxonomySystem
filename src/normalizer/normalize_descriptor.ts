import { normalizeUnicode } from './normalize_unicode.js'
import { normalizeCase } from './normalize_case.js'
import { normalizeSeparators } from './normalize_separators.js'
import { removePunctuation } from './remove_punctuation.js'
import { collapseUnderscores } from './collapse_underscores.js'
import { trimUnderscores } from './trim_underscores.js'
import { singularize } from './singularize.js'

/**
 * Pipeline contracts:
 * normalizeUnicode: any UTF-8 string -> no combining marks, ligatures expanded
 * normalizeCase: valid string -> lowercase
 * normalizeSeparators: lowercase string -> lexical separators replaced by `_`
 * removePunctuation: any string -> only `[a-zA-Z0-9_]` remains
 * collapseUnderscores: descriptor-like string -> no consecutive underscores
 * trimUnderscores: descriptor-like string -> no leading/trailing underscores
 * singularize: clean snake_case tokens -> plural tokens mapped to singular forms
 */
const PIPELINE = [
  normalizeUnicode,
  normalizeCase,
  normalizeSeparators,
  removePunctuation,
  collapseUnderscores,
  trimUnderscores,
  singularize,
] as const

/**
 * Normalize raw descriptor text into canonical snake_case form.
 *
 * @param input - Raw descriptor text.
 * @returns Canonical normalized descriptor or empty string.
 */
export const normalizeDescriptor = (input: string): string => {
  return PIPELINE.reduce((acc, fn) => fn(acc), input)
}
