/**
 * Trim leading and trailing underscores.
 *
 * @param input - Descriptor-like string.
 * @returns String without leading/trailing underscores.
 */
export const trimUnderscores = (input: string): string => {
  return input.replace(/^_+|_+$/g, '')
}
