export const IRREGULAR_PLURALS: Readonly<Record<string, string>> = Object.freeze({
  woods: 'wood',
  mosses: 'moss',
  leaves: 'leaf',
  berries: 'berry',
  blossoms: 'blossom',
  petals: 'petal',
  resins: 'resin',
  aldehydes: 'aldehyde',
  musks: 'musk',
  ionones: 'ionone',
  esters: 'ester',
  ketones: 'ketone',
  absolutes: 'absolute',
  concretes: 'concrete',
})

/**
 * Lookup helper for domain irregular plurals.
 *
 * @param word - Single normalized token.
 * @returns Singular form when known, otherwise `undefined`.
 */
export const lookupIrregularPlural = (word: string): string | undefined => {
  return IRREGULAR_PLURALS[word]
}
