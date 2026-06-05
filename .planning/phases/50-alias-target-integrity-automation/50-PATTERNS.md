# Phase 50: Alias Target Integrity Automation - Pattern Map

**Mapped:** 2026-06-05
**Files analyzed:** 6
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/compiler/alias_target_integrity.ts` | utility | transform | `src/compiler/quality_gates.ts` | exact |
| `src/cli/alias_integrity.ts` | utility | file-I/O | `src/cli/compile.ts` | exact |
| `src/tests/compiler/alias_target_integrity.test.ts` | test | transform | `src/tests/compiler/quality_gates.test.ts` | exact |
| `src/tests/cli/alias_integrity.test.ts` | test | file-I/O | `src/tests/cli/compile.test.ts` | exact |
| `src/package.json` | config | batch | `src/package.json` | exact |
| `data/taxonomy/alias_target_exceptions.v1.json` | config | file-I/O | `data/compiled/v2/descriptor_aliases.json` | partial |

## Pattern Assignments

### `src/compiler/alias_target_integrity.ts` (utility, transform)

**Analog:** `src/compiler/quality_gates.ts`

**Imports pattern** (`src/compiler/quality_gates.ts` lines 1-4):
```ts
import type { SimilarityGraph } from '../types/similarity.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import type { CompiledAliases, CompilerValidationResult } from './types.js'
import { makeCompilerError } from './types.js'
```

**Core validator shape** (`src/compiler/quality_gates.ts` lines 20-23, 76-80):
```ts
export const runArtifactQualityGates = ({ taxonomy, aliases, similarity, inputs }: QualityGateInput): CompilerValidationResult => {
  const errors = [] as ReturnType<typeof makeCompilerError>[]
  const warnings = [] as ReturnType<typeof makeCompilerError>[]

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
```

**Loop-and-count validation pattern** (`src/compiler/quality_gates.ts` lines 29-40, 55-59):
```ts
const descriptorIds = new Set<string>()
for (const family of taxonomy.families) {
  for (const subfamily of family.subfamilies) {
    for (const descriptor of subfamily.descriptors) {
      const descriptorId = descriptor.id
      if (descriptorIds.has(descriptorId)) {
        errors.push(makeCompilerError('taxonomy', 'DUPLICATE_DESCRIPTOR_ID', '$.families[*].subfamilies[*].descriptors[*].id', `duplicate descriptor id: ${descriptorId}`))
      }
      descriptorIds.add(descriptorId)
    }
  }
}

for (const [alias, canonical] of Object.entries(aliases.aliases)) {
  if (canonical === 'candidate') {
    errors.push(makeCompilerError('aliases', 'ALIAS_CANDIDATE_CANONICAL', '$.aliases', `alias '${alias}' maps to candidate marker`))
  }
}
```

**Supplemental schema-validation pattern** (`src/compiler/validate_output.ts` lines 248-297):
```ts
export const validateCompiledAliases = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'aliases' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }

  const obj = data as Record<string, unknown>

  if (!isNonEmptyString(obj['version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.version', 'version must be a non-empty string'))
  }
  if (!isNonEmptyString(obj['schema_version'])) {
    errors.push(makeCompilerError(A, 'MISSING_FIELD', '$.schema_version', 'schema_version must be a non-empty string'))
  }

  return { ok: errors.length === 0, errors, warnings }
}
```

**What to copy:** pure function signature, local `errors`/`warnings` arrays, `Set`-based membership checks, and structured return object instead of throwing.

---

### `src/cli/alias_integrity.ts` (utility, file-I/O)

**Analog:** `src/cli/compile.ts`

**Imports + stdlib path pattern** (`src/cli/compile.ts` lines 1-3, 13):
```ts
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from './parse_args.js'
```

**Path resolution pattern** (`src/cli/compile.ts` lines 67-78):
```ts
const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path, 'utf8')) as T

const exists = async (path: string): Promise<boolean> => access(path).then(() => true).catch(() => false)

const resolveReadablePath = async (path: string): Promise<string> => {
  if (await exists(path)) return path
  if (path.startsWith('data/')) {
    const parentDataPath = join('..', path)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return path
}
```

**CLI wrapper pattern** (`src/cli/compile.ts` lines 99-104, 108-123, 168-183):
```ts
export const runCompileCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  const args = parseCompileArgs(argv)
  if (args.help) {
    printHelp()
    return 0
  }

  console.log('Taxonomy Compiler — v2 default\n')
  console.log('  Loading inputs...')
  const seedPath = await resolveReadablePath(args.seedPath)
  const aliasPath = await resolveReadablePath(args.aliasPath)
  const seed = await loadTaxonomySeed(seedPath)
  const aliasSeed = await loadAliasSeed(aliasPath)

  if (!result.ok) {
    printValidationErrors(new CompileWriteError(result.validation.errors))
    return 1
  }

  console.log('\nCompilation complete')
  return 0
}
```

**Main + error exit pattern** (`src/cli/compile.ts` lines 186-202):
```ts
const main = async (): Promise<void> => {
  process.exit(await runCompileCli())
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    if (error instanceof CliArgumentError) {
      console.error(`Argument error: ${error.message}`)
      process.exit(1)
    }
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
```

**What to copy:** file-loading helpers, repo-root/`src` path fallback, `runXCli(argv): Promise<number>`, concise console output, and `process.exit(...)` only in `main()`.

---

### `src/tests/compiler/alias_target_integrity.test.ts` (test, transform)

**Analog:** `src/tests/compiler/quality_gates.test.ts`

**Imports + inline fixture pattern** (`src/tests/compiler/quality_gates.test.ts` lines 1-6, 8-28):
```ts
import { describe, expect, it } from 'vitest'
import { runArtifactQualityGates } from '../../compiler/quality_gates.js'
import { compileAll } from '../../compiler/compile_all.js'
import type { CompileAllInputs } from '../../compiler/compile_all.js'

const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [{ id: 'floral', name: 'Floral', subfamilies: [{ id: 'rose', name: 'Rose', descriptors: ['rose'] }] }],
}

const baseInputs: CompileAllInputs = {
  seed,
  aliasSeed: { rosy: 'rose' },
  analysis,
  graphInputs: { curatedRelations: { version: '1.0.0', relations: [] }, accordMap: { version: '1.0.0', accords: [] } },
  noiseConfig: { hard_exclude: [], pattern_exclude: [], downweight: {}, default_downweight: 0.35 },
}
```

**Mutation-based failure assertion pattern** (`src/tests/compiler/quality_gates.test.ts` lines 30-39, 67-75):
```ts
describe('runArtifactQualityGates', () => {
  it('fails hard for descriptor consistency, alias candidates, final_score range, timestamp mismatch, and duplicate ids', () => {
    const result = compiled()
    const invalidTaxonomy = structuredClone(result.taxonomy)

    const validation = runArtifactQualityGates({
      taxonomy: invalidTaxonomy as typeof result.taxonomy,
      aliases: invalidAliases as typeof result.aliases,
      similarity: invalidSimilarity as typeof result.similarity,
    })

    expect(validation.ok).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })
})
```

**Supplemental purity pattern** (`src/tests/compiler/compile_all.test.ts` lines 70-74, 76-78):
```ts
it('is pure and does not touch filesystem before writes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'compile-pure-'))
  compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
  await expect(stat(join(dir, 'taxonomy.json'))).rejects.toThrow()
})

it('returns ok false when any artifact fails validation', () => {
  expect(compileAll(inputs({ lemon: 'lemon' }), { generatedAt: '2026-01-01T00:00:00.000Z' }).ok).toBe(false)
})
```

**What to copy:** small inline fixtures, direct function calls, `structuredClone` for invalid cases, and assertions on `ok`, counts, and unresolved entries.

---

### `src/tests/cli/alias_integrity.test.ts` (test, file-I/O)

**Analog:** `src/tests/cli/compile.test.ts`

**Fixture writer pattern** (`src/tests/cli/compile.test.ts` lines 1-5, 20-39):
```ts
import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCompileCli } from '../../cli/compile.js'

const writeJson = (path: string, value: unknown): Promise<void> => writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')

const writeFixtures = async (dir: string, aliases: Record<string, string> = { lemony: 'lemon' }) => {
  const paths = {
    seed: join(dir, 'seed.json'),
    aliases: join(dir, 'aliases.json'),
    corpus: join(dir, 'corpus.json'),
    relations: join(dir, 'relations.json'),
    accords: join(dir, 'accords.json'),
    noise: join(dir, 'noise.json'),
    out: join(dir, 'out'),
  }
  await writeJson(paths.seed, seed)
  await writeJson(paths.aliases, aliases)
  return paths
}
```

**CLI exit/output assertion pattern** (`src/tests/cli/compile.test.ts` lines 62-80, 96-103):
```ts
describe('runCompileCli', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads inputs and writes all compiled outputs', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))

    await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)
    expect(logSpy.mock.calls.flat().join('\n')).toContain('Review summary:')
  })

  it('returns non-zero on validation failure without writing outputs', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await expect(runCompileCli([...argvFor(paths), '--version', ''])).resolves.toBe(1)
  })
})
```

**What to copy:** temp-dir fixture creation, `console.log`/`console.error` spies, direct `runXCli(...)` invocation, and assertions for both exit code and emitted text/JSON.

---

### `src/package.json` (config, batch)

**Analog:** `src/package.json`

**Script naming pattern** (`src/package.json` lines 6-15):
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report",
  "safety:guard": "bash ../scripts/check-safety-guards.sh",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**What to copy:** colon-delimited script naming, explicit `node dist/cli/*.js` entrypoints, and additive script changes only.

---

### `data/taxonomy/alias_target_exceptions.v1.json` (config, file-I/O)

**Analog:** `data/compiled/v2/descriptor_aliases.json`

**Versioned JSON envelope pattern** (`data/compiled/v2/descriptor_aliases.json` lines 1-5):
```json
{
  "version": "2.8.0",
  "schema_version": "1",
  "generated_at": "2026-06-04T16:35:12.224Z",
  "aliases": {
```

**Supplemental deterministic object-shape pattern** (`src/compiler/compile_aliases.ts` lines 13-27):
```ts
export const compileAliases = (
  aliasSeed: DescriptorAliasSeed,
  options: CompileAliasesOptions,
): CompiledAliases => {
  const aliases = Object.fromEntries(
    Object.entries(aliasSeed).sort(([left], [right]) => left.localeCompare(right)),
  )

  return {
    version: options.version ?? DEFAULT_VERSION,
    schema_version: options.schemaVersion ?? DEFAULT_SCHEMA_VERSION,
    generated_at: options.generatedAt,
    aliases,
  }
}
```

**What to copy:** top-level `version` + `schema_version` envelope and stable, explicit key naming. Do **not** copy `generated_at` into the new exception policy unless the planner intentionally wants timestamps there; Context specifies only `version`, `schema_version`, and `exceptions` for Phase 50.

## Shared Patterns

### Pure validation modules
**Sources:** `src/compiler/quality_gates.ts` lines 20-23, 76-80; `src/compiler/validate_output.ts` lines 255-257
**Apply to:** `src/compiler/alias_target_integrity.ts`
```ts
const errors = [] as ReturnType<typeof makeCompilerError>[]
const warnings = [] as ReturnType<typeof makeCompilerError>[]

if (!data || typeof data !== 'object' || Array.isArray(data)) {
  return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
}

return {
  ok: errors.length === 0,
  errors,
  warnings,
}
```

### CLI path resolution + numeric exit codes
**Source:** `src/cli/compile.ts` lines 71-78, 99-104, 186-202
**Apply to:** `src/cli/alias_integrity.ts`
```ts
const resolveReadablePath = async (path: string): Promise<string> => {
  if (await exists(path)) return path
  if (path.startsWith('data/')) {
    const parentDataPath = join('..', path)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return path
}

export const runCompileCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  if (args.help) return 0
  if (!result.ok) return 1
  return 0
}
```

### Temp-dir CLI tests with console spies
**Source:** `src/tests/cli/compile.test.ts` lines 20-39, 67-80
**Apply to:** `src/tests/cli/alias_integrity.test.ts`
```ts
const writeJson = (path: string, value: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')

const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-valid-')))

await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)
expect(logSpy.mock.calls.flat().join('\n')).toContain('Review summary:')
```

### Avoid test-only exception allowlists
**Source:** `src/tests/curation/alias_seed_v2.test.ts` lines 51-64, 94, 209-214
**Apply to:** validator design and live-data proof
```ts
const existingApprovedAliases: AliasSeedFixture = {
  'ylang ylang': 'ylang_ylang',
}

const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target

expect(
  descriptors.has(target) || isPreservedLegacyAlias(alias, target),
  `${alias} points to absent canonical target ${target} without approved legacy preservation`,
).toBe(true)
```

Use this as a **replacement target**, not a copy target: Phase 50 should move executable exceptions out of tests and into `data/taxonomy/alias_target_exceptions.v1.json`.

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| None | — | — | All required files have at least one usable analog; the exception policy file only has a partial analog for its envelope. |

## Metadata

**Analog search scope:** `src/compiler/`, `src/cli/`, `src/tests/compiler/`, `src/tests/cli/`, `src/tests/curation/`, `data/taxonomy/`, `data/compiled/v2/`, `src/package.json`

**Files scanned:** 13

**Pattern extraction date:** 2026-06-05
