/**
 * Remove all characters outside the canonical ASCII descriptor charset.
 *
 * @param input - Text expected to be post-unicode-normalized.
 * @returns String containing only `[a-zA-Z0-9_]`, preserving token boundaries when punctuation separates words.
 */
export const removePunctuation = (input: string): string => {
  return input
    .replace(/([a-zA-Z0-9])[^a-zA-Z0-9_]+(?=[a-zA-Z0-9])/g, '$1_')
    .replace(/[^a-zA-Z0-9_]/g, '')
}
