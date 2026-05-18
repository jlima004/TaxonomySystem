/**
 * Normalized Levenshtein primitives (ANAL-D-08).
 */

export const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const short = a.length <= b.length ? a : b
  const long = a.length <= b.length ? b : a
  const width = short.length + 1

  let previous = new Uint16Array(width)
  let current = new Uint16Array(width)

  for (let i = 0; i < width; i++) {
    previous[i] = i
  }

  for (let j = 1; j <= long.length; j++) {
    current[0] = j
    const longCode = long.charCodeAt(j - 1)

    for (let i = 1; i <= short.length; i++) {
      const cost = short.charCodeAt(i - 1) === longCode ? 0 : 1
      current[i] = Math.min(
        (previous[i] ?? 0) + 1,
        (current[i - 1] ?? 0) + 1,
        (previous[i - 1] ?? 0) + cost,
      )
    }

    const swap = previous
    previous = current
    current = swap
  }

  return previous[short.length] ?? 0
}

export const levenshteinSimilarity = (a: string, b: string): number => {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1

  return 1 - levenshteinDistance(a, b) / maxLength
}
