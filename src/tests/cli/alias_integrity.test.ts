import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runAliasIntegrityCli } from '../../cli/alias_integrity.js'

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return {
    ...actual,
    readFile: vi.fn(actual.readFile),
    access: vi.fn(actual.access),
  }
})

const writeJson = (path: string, value: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')

const emptyExceptionPolicy = {
  version: '1.0.0',
  schema_version: 'alias_target_exceptions.v1',
  exceptions: [],
}

const writeAliasIntegrityFixtures = async (
  dir: string,
  opts: { aliases: Record<string, string>; descriptorIds: string[] },
) => {
  const aliasPath = join(dir, 'data/taxonomy/descriptor_aliases.seed.json')
  const exceptionPath = join(dir, 'data/taxonomy/alias_target_exceptions.v1.json')
  const taxonomyPath = join(dir, 'data/compiled/v2/taxonomy.json')

  await mkdir(join(dir, 'data/taxonomy'), { recursive: true })
  await mkdir(join(dir, 'data/compiled/v2'), { recursive: true })
  await writeJson(aliasPath, opts.aliases)
  await writeJson(exceptionPath, emptyExceptionPolicy)
  await writeJson(taxonomyPath, {
    families: [
      {
        subfamilies: [
          {
            descriptors: opts.descriptorIds.map((id) => ({ id })),
          },
        ],
      },
    ],
  })

  return { aliasPath, exceptionPath, taxonomyPath }
}

describe('runAliasIntegrityCli', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let originalCwd: string

  beforeEach(() => {
    originalCwd = process.cwd()
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.chdir(originalCwd)
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('prints help and exits 0', async () => {
    const exitCode = await runAliasIntegrityCli(['--help'])
    expect(exitCode).toBe(0)
    expect(consoleLogSpy.mock.calls[0]?.[0]).toContain('Alias Target Integrity Proof CLI')
  })

  it('runs against real data, outputs JSON, and exits 0 with all targets resolved', async () => {
    const exitCode = await runAliasIntegrityCli(['--json'])
    expect(exitCode).toBe(0)

    const jsonStr = consoleLogSpy.mock.calls[0]?.[0]
    expect(jsonStr).toBeDefined()
    const jsonOut = JSON.parse(jsonStr as string)
    expect(jsonOut.status).toBe('PASS')
    expect(jsonOut.compiled_descriptor_count).toBe(341)
    expect(jsonOut.valid_target_count).toBe(18)
    expect(jsonOut.unresolved_target_count).toBe(0)
    expect(jsonOut.unresolved).toHaveLength(0)
  })

  describe('temp-fixture runs', () => {
    it('exits 0 when all alias targets resolve and emits PASS output', async () => {
      const dir = await mkdtemp(join(tmpdir(), 'alias-integrity-pass-'))
      await writeAliasIntegrityFixtures(dir, {
        aliases: { lemony: 'lemon' },
        descriptorIds: ['lemon'],
      })
      process.chdir(dir)

      const exitCode = await runAliasIntegrityCli([])
      expect(exitCode).toBe(0)

      const output = consoleLogSpy.mock.calls.flat().join('\n')
      expect(output).toContain('Alias target integrity: PASS')
      expect(output).toContain('Seed aliases: 1')
      expect(output).toContain('Valid targets: 1')
      expect(output).toContain('Unresolved targets: 0')
    })

    it('exits 1 and reports unresolved alias details plus remediation hint when target absent without approved exception', async () => {
      const dir = await mkdtemp(join(tmpdir(), 'alias-integrity-fail-'))
      await writeAliasIntegrityFixtures(dir, {
        aliases: { lemony: 'lemon', bad_alias: 'missing_target' },
        descriptorIds: ['lemon'],
      })
      process.chdir(dir)

      const exitCode = await runAliasIntegrityCli([])
      expect(exitCode).toBe(1)

      const output = consoleLogSpy.mock.calls.flat().join('\n')
      expect(output).toContain('Alias target integrity: FAIL')
      expect(output).toContain('Unresolved targets: 1')
      expect(output).toContain('alias: bad_alias')
      expect(output).toContain('target: missing_target')
      expect(output).toContain('source: data/taxonomy/descriptor_aliases.seed.json')
      expect(output).toContain('exception: none')
      expect(output).toContain(
        'hint: resolve in Phase 51 by adding target, correcting alias, dropping alias, or documenting an approved exception.',
      )
    })
  })
})

describe('alias:integrity npm script wiring', () => {
  it('exposes alias:integrity without wiring into default test, build, or compile scripts', async () => {
    const pkg = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }

    expect(pkg.scripts['alias:integrity']).toMatch(/alias_integrity\.js/)
    expect(pkg.scripts.test).not.toMatch(/alias:integrity/)
    expect(pkg.scripts.build).not.toMatch(/alias:integrity/)
    expect(pkg.scripts.compile).not.toMatch(/alias:integrity/)
    expect(pkg.scripts['precompile']).not.toMatch(/alias:integrity/)
  })

  it('supports --json output through the CLI entry invoked by alias:integrity script', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const exitCode = await runAliasIntegrityCli(['--json'])
    expect(exitCode).toBe(0)

    const jsonStr = logSpy.mock.calls[0]?.[0]
    expect(jsonStr).toBeDefined()
    const jsonOut = JSON.parse(jsonStr as string)
    expect(jsonOut).toEqual(
      expect.objectContaining({
        status: 'PASS',
        seed_alias_count: 18,
        compiled_descriptor_count: 341,
        valid_target_count: 18,
        unresolved_target_count: 0,
        unresolved: [],
      }),
    )

    logSpy.mockRestore()
  })
})
