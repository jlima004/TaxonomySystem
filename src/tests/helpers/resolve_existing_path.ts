import { existsSync } from 'node:fs'

export const resolveExistingPath = (...paths: string[]): string => {
  const found = paths.find(existsSync)

  if (!found) {
    throw new Error(`Missing required curation fixture. Tried:\n${paths.join('\n')}`)
  }

  return found
}
