/**
 * Encode/decode helpers for sparse co-occurrence keys.
 *
 * The key format is `${a}|${b}` with lexical order `a < b`.
 */

export const encodePairKey = (a: string, b: string): string => {
  if (a === b) {
    throw new Error(`ANAL-D-17 violation: self-pair is not allowed (${a})`)
  }

  return a < b ? `${a}|${b}` : `${b}|${a}`
}

export const decodePairKey = (key: string): readonly [string, string] => {
  const separatorIndex = key.indexOf('|')
  if (separatorIndex <= 0 || separatorIndex >= key.length - 1) {
    throw new Error(`Invalid pair key: ${key}`)
  }

  const a = key.slice(0, separatorIndex)
  const b = key.slice(separatorIndex + 1)
  return [a, b]
}
