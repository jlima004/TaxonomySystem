import { lookupIrregularPlural } from './irregular_plurals.js'

const NON_PLURAL_TERMINALS = new Set([
  'gas',
  'iris',
  'citrus',
  'anis',
  'canvas',
  'chaos',
  'cosmos',
  'ethos',
  'pathos',
  'analysis',
  'thesis',
  'basis',
  'crisis',
  'hypothesis',
  'synthesis',
])

const singularizeToken = (word: string): string => {
  const irregular = lookupIrregularPlural(word)
  if (irregular !== undefined) return irregular

  if (NON_PLURAL_TERMINALS.has(word)) return word

  if (word.endsWith('ies') && word.length > 3) return word.slice(0, -3) + 'y'
  if (/(sses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 2) return word.slice(0, -1)

  return word
}

/**
 * Convert plural tokens to singular form using dictionary-first rules.
 *
 * @param input - Normalized descriptor token or snake_case descriptor.
 * @returns Singularized token(s), preserving underscores as token separators.
 */
export const singularize = (input: string): string => {
  if (input.includes('_')) {
    return input
      .split('_')
      .map(singularizeToken)
      .join('_')
  }

  return singularizeToken(input)
}
