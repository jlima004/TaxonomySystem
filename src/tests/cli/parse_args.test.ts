import { describe, expect, it } from 'vitest'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from '../../cli/parse_args.js'

describe('parseCompileArgs', () => {
  it('returns defaults', () => {
    expect(parseCompileArgs([])).toEqual({ ...DEFAULT_PATHS, generatedAt: undefined, help: false })
  })

  it('parses --out', () => {
    expect(parseCompileArgs(['--out', '/tmp/test']).outputDir).toBe('/tmp/test')
  })

  it('parses --help', () => {
    expect(parseCompileArgs(['--help']).help).toBe(true)
  })

  it('parses --version', () => {
    expect(parseCompileArgs(['--version', '2.0.0']).version).toBe('2.0.0')
  })

  it('parses --generated-at with UTC timestamp', () => {
    expect(parseCompileArgs(['--generated-at', '2026-01-01T00:00:00Z']).generatedAt).toBe('2026-01-01T00:00:00Z')
  })

  it('parses --noise', () => {
    expect(parseCompileArgs(['--noise', 'custom/noise.json']).noisePath).toBe('custom/noise.json')
  })

  it('parses all path flags', () => {
    const result = parseCompileArgs(['--seed', 's', '--aliases', 'a', '--corpus', 'c', '--relations', 'r', '--accords', 'ac'])
    expect(result).toMatchObject({ seedPath: 's', aliasPath: 'a', corpusPath: 'c', relationsPath: 'r', accordsPath: 'ac' })
  })

  it('throws for unknown flags', () => {
    expect(() => parseCompileArgs(['--foo'])).toThrow(CliArgumentError)
  })

  it('throws for missing values', () => {
    expect(() => parseCompileArgs(['--out'])).toThrow(CliArgumentError)
  })

  it('throws for invalid generated_at', () => {
    expect(() => parseCompileArgs(['--generated-at', 'not-a-date'])).toThrow(CliArgumentError)
  })

  it('throws when generated_at does not end in Z', () => {
    expect(() => parseCompileArgs(['--generated-at', '2026-01-01T00:00:00'])).toThrow(CliArgumentError)
  })

  it('parses combined flags', () => {
    expect(parseCompileArgs(['--out', '/tmp', '--version', '2.0.0', '--generated-at', '2026-01-01T00:00:00Z'])).toMatchObject({
      outputDir: '/tmp',
      version: '2.0.0',
      generatedAt: '2026-01-01T00:00:00Z',
    })
  })
})
