export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^\w\s-]/g, '') // Remove punctuation except hyphens and underscores
    .toLowerCase()
    .trim()
}
