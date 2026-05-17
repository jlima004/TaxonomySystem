/**
 * Remove all characters outside the canonical ASCII descriptor charset.
 *
 * @param input - Text expected to be post-unicode-normalized.
 * @returns String containing only `[a-zA-Z0-9_]`.
 */
export const removePunctuation = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9_]/g, '')
}
