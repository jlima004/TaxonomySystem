# Phase 53: Alias Integrity Gate Hardening - Pattern Map

**Mapped:** 2026-06-06  
**Files analyzed:** 3 new/modified files  
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/package.json` | config | batch / command-execution | `src/package.json` existing `alias:integrity`, `compile:quality`, `compile`, `safety:guard` scripts | exact |
| `src/tests/cli/alias_integrity.test.ts` | test | request-response / command-execution | `src/tests/cli/alias_integrity.test.ts` existing CLI JSON and script wiring tests | exact |
| `src/tests/inventory/alias_target_inventory.test.ts` | test | file-I/O / transform | `src/tests/inventory/alias_target_inventory.test.ts` + `src/tests/compiler/alias_target_integrity.test.ts` | exact |

## Pattern Assignments

### `src/package.json` (config, batch / command-execution)

**Analog:** `src/package.json`

**Current script wiring pattern** (lines 6-16):
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report",
  "safety:guard": "bash ../scripts/check-safety-guards.sh",
  "test": "vitest run",
  "test:watch": "vitest",
  "alias:integrity": "npm run precompile && node dist/cli/alias_integrity.js"
}
```

**Pattern to copy:** add `verify:integrity` as a semantic wrapper/local proof command while preserving `alias:integrity` as the base proof surface. Do not alter `compile` (line 10). If `compile:quality` is updated, keep it in the local quality path only (line 11) and do not merge it with `safety:guard` (line 12).

**Boundary analog:** `scripts/check-safety-guards.sh` remains a separate non-mutating file/protected-path guard.

**Safety guard boundary pattern** (`scripts/check-safety-guards.sh` lines 1-17):
```bash
#!/usr/bin/env bash
# check-safety-guards.sh — Non-mutating local safety guard for staged Graphify and protected paths.
#
# Purpose: Block staged graphify-out/* and staged/dirty protected path changes
#          before they can enter a commit. Dirty working-tree graphify-out is allowed.
...
# This script is NON-MUTATING. It never runs git add, git reset, git checkout,
# git clean, or git rm. It only reads repository state.
```

**Protected-path check pattern** (`scripts/check-safety-guards.sh` lines 43-64):
```bash
PROTECTED_PATH_STAGED=$(git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
...
PROTECTED_DIFF=$(git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
```

---

### `src/tests/cli/alias_integrity.test.ts` (test, request-response / command-execution)

**Analog:** `src/tests/cli/alias_integrity.test.ts`

**Imports and test harness pattern** (lines 1-6):
```typescript
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runAliasIntegrityCli } from '../../cli/alias_integrity.js'
```

**Mocking pattern** (lines 7-14):
```typescript
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return {
    ...actual,
    readFile: vi.fn(actual.readFile),
    access: vi.fn(actual.access),
  }
})
```

**CLI JSON proof assertion pattern** (lines 76-88):
```typescript
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
```

**Script-wiring assertion pattern to extend** (lines 134-145):
```typescript
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
```

**Apply to Phase 53:** add/extend assertions for `verify:integrity`, confirm `compile` does not mention `alias:integrity`, `verify:integrity`, or `compile:quality`, and confirm `compile:quality` includes the integrity path only if the script is changed.

---

### `src/tests/inventory/alias_target_inventory.test.ts` (test, file-I/O / transform)

**Analog:** `src/tests/inventory/alias_target_inventory.test.ts`

**Imports and fixture-first path pattern** (lines 1-5, 38-47):
```typescript
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolveExistingPath } from '../helpers/resolve_existing_path'
...
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const inventoryPath = resolveExistingPath(
  path.join( repoRoot, 'src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md'),
  path.join( repoRoot, '.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md'),
  path.join( repoRoot, '.planning/milestones/v2.9-phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md'),
)
```

**Read JSON helper pattern** (line 49):
```typescript
const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T
```

**Current duplicated target-resolution logic to replace** (lines 75-99):
```typescript
it('audits live alias data with 18 seed/compiled entries, 341 descriptors, 18 valid, 0 dangling', async () => {
  const [seedAliases, compiled, taxonomy] = await Promise.all([
    readJson<AliasSeed>(seedAliasPath),
    readJson<CompiledAliases>(compiledAliasPath),
    readJson<CompiledTaxonomy>(compiledTaxonomyPath),
  ])
  const compiledAliases = compiled.aliases
  const descriptorIds = collectCompiledDescriptorIds(taxonomy)

  expect(Object.keys(seedAliases)).toHaveLength(18)
  expect(Object.keys(compiledAliases)).toHaveLength(18)
  expect(seedAliases).toEqual(compiledAliases)
  expect(descriptorIds.size).toBe(341)

  const valid = Object.fromEntries(
    Object.entries(seedAliases).filter(([, target]) => descriptorIds.has(target)),
  )
  const dangling = Object.fromEntries(
    Object.entries(seedAliases).filter(([, target]) => !descriptorIds.has(target)),
  )

  expect(Object.keys(valid)).toHaveLength(18)
  expect(dangling).toEqual({})
})
```

**Shared-validator pattern to copy from validator tests** (`src/tests/compiler/alias_target_integrity.test.ts` lines 1-3, 11-23):
```typescript
import { describe, expect, it } from 'vitest'
import { validateAliasTargetIntegrity, type ExceptionPolicy } from '../../compiler/alias_target_integrity.js'

it('Test 1: returns PASS when every alias target resolves to a compiled descriptor ID', () => {
  const seedAliases = { 'alias_a': 'target_a', 'alias_b': 'target_b' }
  const compiledDescriptorIds = new Set(['target_a', 'target_b', 'target_c'])

  const result = validateAliasTargetIntegrity(seedAliases, compiledDescriptorIds, validPolicy)

  expect(result.status).toBe('PASS')
  expect(result.seed_alias_count).toBe(2)
  expect(result.compiled_descriptor_count).toBe(3)
  expect(result.valid_target_count).toBe(2)
  expect(result.unresolved_target_count).toBe(0)
  expect(result.unresolved).toHaveLength(0)
})
```

**Documentary coverage pattern to preserve** (`src/tests/inventory/alias_target_inventory.test.ts` lines 101-140):
```typescript
it('requires the inventory artifact with mandated sections and classification', async () => {
  const content = await readFile(inventoryPath, 'utf8')

  expect(content.length).toBeGreaterThan(0)
  expect(content).toContain('Sources Inspected')
  expect(content).toContain('Completeness Proof')
  expect(content).toContain('Zero-Mutation Statement')
  expect(content).toContain('remediation_required')
  expect(content).toContain('Handoff to Phase 50/51')
})
...
expect(compiledIds.has('ylang_ylang')).toBe(true)
expect(seedIds.has('ylang_ylang')).toBe(true)
expect(compiledIds.has('ylang')).toBe(true)
```

**Apply to Phase 53:** import `validateAliasTargetIntegrity`, read `data/taxonomy/alias_target_exceptions.v1.json`, call the shared validator in the first inventory test, assert `PASS` and `341/18/0`, and keep the documentary inventory/ylang tests intact.

## Shared Patterns

### Alias integrity CLI proof surface

**Source:** `src/cli/alias_integrity.ts`

**Imports and validator call** (lines 1-5, 51-68):
```typescript
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateAliasTargetIntegrity } from '../compiler/alias_target_integrity.js'
import { DEFAULT_PATHS } from './parse_args.js'
...
const aliasPath = await resolveReadablePath(DEFAULT_PATHS.aliasPath)
const compiledTaxonomyPath = await resolveReadablePath(join(DEFAULT_PATHS.outputDir, 'taxonomy.json'))
const exceptionPolicyPath = await resolveReadablePath('data/taxonomy/alias_target_exceptions.v1.json')
...
const result = validateAliasTargetIntegrity(aliasSeed, descriptorIds, exceptionPolicy, 'data/taxonomy/descriptor_aliases.seed.json')
```

**JSON/non-zero contract** (lines 70-92):
```typescript
if (args.json) {
  console.log(JSON.stringify(result, null, 2))
  return result.status === 'PASS' ? 0 : 1
}
...
return result.status === 'PASS' ? 0 : 1
```

**Apply to:** `verify:integrity` script behavior and CLI/script tests.

### Shared validator result contract

**Source:** `src/compiler/alias_target_integrity.ts`

**Result type** (lines 28-35):
```typescript
export type AliasIntegrityResult = {
  status: 'PASS' | 'FAIL'
  seed_alias_count: number
  compiled_descriptor_count: number
  valid_target_count: number
  unresolved_target_count: number
  unresolved: UnresolvedEntry[]
}
```

**Core validation/error-handling pattern** (lines 68-91, 124-131):
```typescript
export const validateAliasTargetIntegrity = (
  seedAliases: Record<string, string>,
  compiledDescriptorIds: Set<string>,
  exceptionPolicy: unknown,
  aliasSource: string = 'data/taxonomy/descriptor_aliases.seed.json'
): AliasIntegrityResult => {
  if (!validateExceptionPolicy(exceptionPolicy)) {
    return {
      status: 'FAIL',
      seed_alias_count: 0,
      compiled_descriptor_count: 0,
      valid_target_count: 0,
      unresolved_target_count: 1,
      unresolved: [ ... ]
    }
  }
  ...
  return {
    status: unresolved.length === 0 ? 'PASS' : 'FAIL',
    seed_alias_count: Object.keys(seedAliases).length,
    compiled_descriptor_count: compiledDescriptorIds.size,
    valid_target_count,
    unresolved_target_count: unresolved.length,
    unresolved,
  }
}
```

**Apply to:** inventory test refactor. Do not change production validator behavior merely to satisfy tests.

### Fixture-first historical artifact resolution

**Source:** `src/tests/helpers/resolve_existing_path.ts`

**Helper pattern** (lines 1-10):
```typescript
import { existsSync } from 'node:fs'

export const resolveExistingPath = (...paths: string[]): string => {
  const found = paths.find(existsSync)

  if (!found) {
    throw new Error(`Missing required curation fixture. Tried:\n${paths.join('\n')}`)
  }

  return found
}
```

**Apply to:** preserving historical planning-artifact coverage in `alias_target_inventory.test.ts`; do not replace fixture/documentary assertions with only live validator checks.

### Compile quality path behavior

**Source:** `src/cli/compile.ts` and `src/tests/cli/compile.test.ts`

**Quality report CLI option** (`src/cli/compile.ts` lines 15-33, 57-64):
```typescript
const printHelp = (): void => {
  console.log(`Taxonomy Compiler — v2 default
...
  --quality-report       Print quality metrics summary (console only)
`)
}
...
if (!qualityReport) return
console.log('  Quality report:')
console.log(`    quality_warnings=${result.validation.warnings.length}`)
console.log(`    quality_metrics={edges:${result.similarity.stats.edge_count},density:${result.similarity.stats.density}}`)
```

**Quality report test pattern** (`src/tests/cli/compile.test.ts` lines 83-94):
```typescript
it('prints quality-report details without creating extra artifacts', async () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
  const paths = await writeFixtures(await mkdtemp(join(tmpdir(), 'compile-cli-quality-')))
  await expect(runCompileCli([...argvFor(paths), '--quality-report'])).resolves.toBe(0)
  expect(logSpy.mock.calls.flat().join('\n')).toContain('Quality report:')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_warnings=')
  expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_metrics=')
  await expect(stat(join(paths.out, 'taxonomy.json'))).resolves.toBeDefined()
  await expect(stat(join(paths.out, 'descriptor_aliases.json'))).resolves.toBeDefined()
  await expect(stat(join(paths.out, 'similarity_matrix.json'))).resolves.toBeDefined()
  await expect(stat(join(paths.out, 'quality_report.json'))).rejects.toThrow()
})
```

**Apply to:** `compile:quality` script changes and proof planning. Prefer a non-mutating temporary output if feasible; otherwise require boundary diff proof after running quality command.

## No Analog Found

All expected Phase 53 file changes have close in-code analogs.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| — | — | — | — |

## Metadata

**Analog search scope:** `src/package.json`, `src/cli/*.ts`, `src/compiler/*.ts`, `src/tests/**/*.ts`, `scripts/*`, `.agents/rules/graphify.md`, `graphify-out/GRAPH_REPORT.md`  
**Files scanned/read:** 13  
**Project instructions:** `AGENTS.md` missing; `.agents/rules/graphify.md` read and `graphify-out/GRAPH_REPORT.md` consulted.  
**Pattern extraction date:** 2026-06-06
