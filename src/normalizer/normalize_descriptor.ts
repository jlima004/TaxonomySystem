import { normalizeUnicode } from './normalize_unicode.js'
import { normalizeCase } from './normalize_case.js'
import { normalizeSeparators } from './normalize_separators.js'
import { removePunctuation } from './remove_punctuation.js'
import { collapseUnderscores } from './collapse_underscores.js'
import { trimUnderscores } from './trim_underscores.js'
import { singularize } from './singularize.js'

/**
 * Pipeline contracts:
 *
 * | Step | Assumes input | Guarantees output |
 * | --- | --- | --- |
 * | normalizeUnicode | any UTF-8 string | NFD-normalized, no combining marks, ligatures expanded |
 * | normalizeCase | valid string | all lowercase |
 * | normalizeSeparators | lowercase string | spaces, hyphens, slashes, apostrophes, unicode dashes -> `_` |
 * | removePunctuation | any string | only `[a-zA-Z0-9_]` remains, preserving case |
 * | collapseUnderscores | descriptor-like string with underscores | no consecutive `__` |
 * | trimUnderscores | descriptor-like string with underscores | no leading/trailing `_` |
 * | singularize | clean snake_case `[a-z0-9_]+` tokens | plural tokens mapped to singular forms |
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
