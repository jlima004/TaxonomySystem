/**
 * Collapse consecutive underscores into a single underscore.
 *
 * @param input - Descriptor-like string that may contain `__` sequences.
 * @returns String with no consecutive underscores.
 */
export const collapseUnderscores = (input: string): string => {
  return input.replace(/_+/g, '_')
}
