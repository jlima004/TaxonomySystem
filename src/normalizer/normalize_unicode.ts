/**
 * Normalize Unicode text by removing diacritics and expanding ligatures.
 *
 * @param input - Any UTF-8 string.
 * @returns NFD-normalized text without combining marks, preserving original case.
 */
export const normalizeUnicode = (input: string): string => {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/Œ/g, 'OE')
    .replace(/Æ/g, 'AE')
}
