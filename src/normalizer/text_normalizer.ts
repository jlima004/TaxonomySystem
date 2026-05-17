import { normalizeDescriptor } from './normalize_descriptor.js'

/**
 * @deprecated Use normalizeDescriptor instead.
 */
export const normalizeText = (text: string): string => {
  return normalizeDescriptor(text)
}
