/**
 * Token-level Jaccard similarity over `_`-separated tokens.
 */
export const tokenJaccard = (a: string, b: string): number => {
  const tokensA = new Set(a.split('_'))
  const tokensB = new Set(b.split('_'))

  let intersection = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection += 1
    }
  }

  const union = tokensA.size + tokensB.size - intersection
  if (union === 0) {
    return 1
  }

  return intersection / union
}
