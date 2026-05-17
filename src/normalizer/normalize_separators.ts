/**
 * Normalize lexical separators to underscores.
 *
 * @param input - Usually a lowercased descriptor string.
 * @returns String where whitespace, dashes, slashes and apostrophes are replaced by `_`.
 */
export const normalizeSeparators = (input: string): string => {
  return input.replace(/[\s\-\/\\'\u2018\u2019\u201B\u2013\u2014]+/g, '_')
}
