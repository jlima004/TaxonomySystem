# Phase 55: Graph Contract & Boundary Decisions - Pattern Map

**Mapped:** 2026-06-09  
**Files analyzed:** 3  
**Analogs found:** 3 / 3

## Scope Source

Files to create/modify were extracted from `55-RESEARCH.md` lines 198-201 and 209-219 plus `55-VALIDATION.md` lines 50-55. Phase 55 remains contract-only: do not plan graph builder, loader, writer, query, CLI, Graphify, Neo4J, runtime API, or generated graph artifact files.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/graph_read_model/contract.ts` | config / model | transform (static contract constants/types) | `src/cli/parse_args.ts`; `src/types/taxonomy.ts`; `src/types/similarity.ts` | role-match |
| `src/tests/graph_read_model/contract.test.ts` | test | transform (contract assertions) | `src/tests/cli/parse_args.test.ts`; `src/tests/cli/alias_integrity.test.ts` | exact |
| `docs/olfactory_graph_contract.md` | config / documentation | transform (requirements-to-contract documentation) | `README.md`; `src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md` | role-match |

## Pattern Assignments

### `src/graph_read_model/contract.ts` (config/model, transform)

**Analogs:** `src/cli/parse_args.ts`, `src/types/taxonomy.ts`, `src/types/similarity.ts`, `src/compiler/types.ts`

**Imports pattern:** none needed for a static contract module. Existing constant/type modules use first-party exports and avoid runtime dependencies.

**Readonly type pattern** (`src/cli/parse_args.ts` lines 1-14):
```typescript
export type CompileCliArgs = {
  readonly seedPath: string
  readonly aliasPath: string
  readonly corpusPath: string
  readonly relationsPath: string
  readonly accordsPath: string
  readonly noisePath: string
  readonly conflictStopwordsPath: string
  readonly outputDir: string
  readonly version: string
  readonly generatedAt: string | undefined
  readonly help: boolean
  readonly qualityReport: boolean
}
```

**Immutable constant pattern** (`src/cli/parse_args.ts` lines 16-26):
```typescript
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v2.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v2.json',
  accordsPath: 'data/inference/accord_map.v2.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  conflictStopwordsPath: 'data/inference/conflict_stopwords.v1.json',
  outputDir: 'data/compiled/v2',
  version: '2.1.0',
} as const
```

**Compiled taxonomy property names to mirror** (`src/types/taxonomy.ts` lines 4-39):
```typescript
export type TaxonomyStats = {
  readonly family_count: number
  readonly subfamily_count: number
  readonly descriptor_count: number
}

export type CanonicalDescriptor = {
  readonly id: string
  readonly source: 'seed' | 'corpus' | 'inferred'
  readonly frequency: number
  readonly status: 'curated' | 'candidate' | 'inferred'
  readonly review_required: boolean
  readonly corpus_derived: boolean
}

export type TaxonomySubfamily = {
  readonly id: string
  readonly name: string
  readonly family_id: string
  readonly descriptors: readonly CanonicalDescriptor[]
}

export type TaxonomyFamily = {
  readonly id: string
  readonly name: string
  readonly subfamilies: readonly TaxonomySubfamily[]
}

export type CompiledTaxonomy = {
  readonly version: string
  readonly generated_at: string
  readonly stats: TaxonomyStats
  readonly families: readonly TaxonomyFamily[]
}

export type DescriptorAliasMap = Readonly<Record<string, string>>
```

**Similarity edge field names to preserve** (`src/types/similarity.ts` lines 12-19):
```typescript
export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly final_score?: number
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>> | FinalScoreDimensions
  readonly evidence?: SimilarityEdgeEvidence
}
```

**Structured helper/export style** (`src/compiler/types.ts` lines 13-38):
```typescript
export type CompilerValidationError = {
  readonly artifact: 'taxonomy' | 'aliases' | 'similarity'
  readonly code: string
  readonly path: string
  readonly message: string
}

// Validation result with errors and warnings
export type CompilerValidationResult = {
  readonly ok: boolean
  readonly errors: readonly CompilerValidationError[]
  readonly warnings: readonly CompilerValidationError[]
}

// Helper to create a CompilerValidationError with $ prefix enforcement
export const makeCompilerError = (
  artifact: CompilerValidationError['artifact'],
  code: string,
  path: string,
  message: string
): CompilerValidationError => ({
  artifact,
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
})
```

**Boundary for this file:** copy the `readonly` + `as const` pattern, but keep it constants/types only. Do not copy parser, validator, writer, filesystem, or CLI behavior into Phase 55.

---

### `src/tests/graph_read_model/contract.test.ts` (test, transform)

**Analogs:** `src/tests/cli/parse_args.test.ts`, `src/tests/cli/alias_integrity.test.ts`, `src/tests/inventory/alias_target_inventory.test.ts`, `src/tests/compiler/validate_output.test.ts`

**Imports pattern** (`src/tests/cli/parse_args.test.ts` lines 1-2):
```typescript
import { describe, expect, it } from 'vitest'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from '../../cli/parse_args.js'
```

Use the same Vitest import order and ESM `.js` suffix for the contract import, e.g. `../../graph_read_model/contract.js`.

**Exact-value assertion pattern** (`src/tests/cli/parse_args.test.ts` lines 4-7):
```typescript
describe('parseCompileArgs', () => {
  it('returns defaults', () => {
    expect(parseCompileArgs([])).toEqual({ ...DEFAULT_PATHS, generatedAt: undefined, help: false, qualityReport: false })
  })
```

**Forbidden/boundary assertion pattern** (`src/tests/cli/alias_integrity.test.ts` lines 134-174):
```typescript
describe('alias integrity npm script wiring', () => {
  const requiredScriptKeys = [
    'alias:integrity',
    'verify:integrity',
    'compile',
    'compile:quality',
    'safety:guard',
    'build',
    'test',
    'precompile',
  ] as const

  it('exposes alias:integrity and verify:integrity without wiring into default test, build, or compile scripts', async () => {
    const pkg = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }

    for (const key of requiredScriptKeys) {
      expect(pkg.scripts[key], `missing scripts.${key}`).toBeDefined()
    }

    expect(pkg.scripts['alias:integrity']).toMatch(/alias_integrity\.js/)
    expect(pkg.scripts['verify:integrity']).toMatch(/alias_integrity\.js/)
    expect(pkg.scripts['verify:integrity']).toMatch(/precompile/)
    expect(pkg.scripts.test).not.toMatch(/alias:integrity|verify:integrity/)
    expect(pkg.scripts.build).not.toMatch(/alias:integrity|verify:integrity/)
    expect(pkg.scripts.compile).not.toMatch(/alias:integrity|verify:integrity|compile:quality/)
    expect(pkg.scripts['precompile']).not.toMatch(/alias:integrity|verify:integrity/)
  })

  it('keeps compile:quality on the quality path with temp output and alias proof', async () => {
    const pkg = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }

    expect(pkg.scripts['compile:quality']).toContain('/tmp/phase53-compile-quality')
    expect(pkg.scripts['compile:quality']).toMatch(/alias_integrity\.js/)
    expect(pkg.scripts.compile).toBe('node dist/cli/compile.js')
    expect(pkg.scripts['safety:guard']).toBe('bash ../scripts/check-safety-guards.sh')
    expect(pkg.scripts['safety:guard']).not.toMatch(/alias_integrity|alias:integrity|verify:integrity/)
  })
```

For Phase 55, use this style to assert contract arrays are exact and forbidden scope (`graphify-out/`, `data/taxonomy/`, `data/inference/`, `data/enriched_materials.json`, builder/writer/CLI names) is excluded from allowed inputs or production output policy.

**Fixture/helper style for object shapes** (`src/tests/compiler/validate_output.test.ts` lines 10-67):
```typescript
// ── Helpers ──────────────────────────────────────────────────────────────────

const makeValidTaxonomy = () => ({
  version: '1.0.0',
  generated_at: '2026-01-01T00:00:00Z',
  stats: { family_count: 1, subfamily_count: 1, descriptor_count: 1 },
  families: [
    {
      id: 'floral',
      name: 'Floral',
      subfamilies: [
        {
          id: 'white_floral',
          name: 'White Floral',
          family_id: 'floral',
          descriptors: [
            {
              id: 'jasmine',
              source: 'seed',
              frequency: 42,
              status: 'curated',
              review_required: false,
              corpus_derived: false,
            },
          ],
        },
      ],
    },
  ],
})
```

Use small inline fixtures only for known ID-prefix collision examples (`family:floral` vs `descriptor:floral`, etc.); do not load or traverse compiled artifacts in Phase 55 contract tests.

**Documentation existence/content assertion pattern** (`src/tests/inventory/alias_target_inventory.test.ts` lines 108-117):
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
```

If the planner includes docs assertions, copy this pattern to verify `docs/olfactory_graph_contract.md` contains required sections and explicit no-builder/no-writer/no-Graphify/no-Neo4J boundaries.

---

### `docs/olfactory_graph_contract.md` (config/documentation, transform)

**Analogs:** `README.md`, `src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md`

**Markdown heading + project convention pattern** (`README.md` lines 76-81):
```markdown
## 🛠️ Regras e Convenções do Repositório

- **Linguagem**: Node.js com TypeScript (Strict Mode).
- **Paradigma**: Funcional Pura (sem classes, sem side effects).
- **Dependências**: Abordagem Zero-Dependency para as funções de runtime.
- **Workflow GSD**: O projeto adota a metodologia Get-Shit-Done (GSD). Para ver os planos gerados e o progresso, verifique os comandos listados em `GEMINI.md` ou use `/gsd-progress`.
```

**Source-inspection documentation pattern** (`src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md` lines 1-12):
```markdown
# Phase 49 Alias Target Integrity Inventory

## 1. Sources Inspected

- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/taxonomy.json`

## 2. Method

This inventory was produced by directly reading the three JSON sources, comparing the seed alias dictionary against the compiled `aliases` dictionary key by key, and resolving every alias target against the compiled descriptor ID set extracted from `data/compiled/v2/taxonomy.json` via `families[].subfamilies[].descriptors[].id`.
```

For Phase 55, adapt the sections to the three allowed production inputs only: `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json`, and `data/compiled/v2/similarity_matrix.json`. The method should describe contract decisions, not graph construction.

**Boundary/safety documentation pattern** (`README.md` lines 137-178):
```markdown
## 🔒 Safety Guards (Mecanismos de Segurança)

Para garantir que o repositório permaneça íntegro e em conformidade com as diretrizes de desenvolvimento do projeto, existe um script local de segurança não-mutante (safety guard) que atua como barreira contra commits e alterações acidentais em áreas protegidas.

### Escopo das Checagens do Guard
O script monitora e bloqueia commits se detectar:
1. **Arquivos temporários do Graphify na área de staging (staged):** Qualquer arquivo dentro do diretório `graphify-out/` que esteja adicionado para commit (`git add`) será bloqueado. Alterações no diretório `graphify-out/` na árvore de trabalho (*working tree*) são permitidas e ignoradas pelo guard, desde que não sejam colocadas em staging.
2. **Alterações em caminhos protegidos (staged ou dirty):** Qualquer modificação (seja em staging ou apenas alterada localmente) nos caminhos protegidos do sistema de taxonomia olfativa resultará em falha.
```

**Zero-mutation + handoff pattern** (`src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md` lines 83-94):
```markdown
## 9. Completeness Proof

All 18 aliases from both seed and compiled sources have been verified. 17 resolve to valid compiled descriptor IDs. 1 (`ylang ylang -> ylang_ylang`) is dangling. 18/18 aliases audited = 100% coverage.

## 10. Zero-Mutation Statement

Nenhum arquivo de dados, seed ou compiled foi modificado durante a execucao desta fase. Este inventario e estritamente read-only. Nenhuma decisao de remediacao e tomada nesta fase.

## 11. Handoff to Phase 50/51

- Phase 50 (Alias Target Integrity Automation): Will implement the automated validation gate and exception policy support.
- Phase 51 (Legacy Alias Remediation): Will resolve `ylang ylang -> ylang_ylang` and any other dangling targets confirmed in this inventory, using the Phase 50 gate as proof.
```

For Phase 55, include a zero-mutation statement and a handoff naming Phase 56 as the consumer of invariant names, while explicitly saying Phase 55 does not implement the builder.

## Shared Patterns

### Strict ESM TypeScript
**Source:** `src/package.json`, `src/tsconfig.json`, `src/vitest.config.ts`  
**Apply to:** `src/graph_read_model/contract.ts`, `src/tests/graph_read_model/contract.test.ts`

`src/package.json` lines 5-16:
```json
  "type": "module",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "precompile": "npm run build",
    "compile": "node dist/cli/compile.js",
    "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report --out /tmp/phase53-compile-quality && node dist/cli/alias_integrity.js",
    "safety:guard": "bash ../scripts/check-safety-guards.sh",
    "test": "vitest run",
    "test:watch": "vitest",
    "alias:integrity": "npm run precompile && node dist/cli/alias_integrity.js",
    "verify:integrity": "npm run precompile && node dist/cli/alias_integrity.js"
  },
```

`src/tsconfig.json` lines 2-16:
```json
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["**/*.ts", "vitest.config.ts"],
  "exclude": ["node_modules", "dist"]
```

`src/vitest.config.ts` lines 1-7:
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  }
})
```

### No Runtime Dependency / No Builder Drift
**Source:** `README.md` lines 23-32 and `55-RESEARCH.md` lines 221-244  
**Apply to:** all Phase 55 files

Copy the repo convention: strict TypeScript, no runtime dependencies, pure/static artifacts. Keep contract constants and tests only; no graph construction, filesystem reads, writes, generated graph output, database driver, or CLI.

### Protected Boundary / Safety Guard
**Source:** `scripts/check-safety-guards.sh`  
**Apply to:** contract output policy and contract tests

Lines 32-56:
```bash
# Check 1: Staged graphify-out paths (GUARD16-D-10, GUARD16-D-23, GUARD16-D-26)
GRAPHIFY_STAGED=$(git diff --cached --name-only -- graphify-out)
if [ -n "$GRAPHIFY_STAGED" ]; then
  echo "GRAPHIFY_STAGED: the following graphify-out paths are staged for commit:" >&2
  while IFS= read -r line; do
    echo "  $line" >&2
  done <<< "$GRAPHIFY_STAGED"
  echo "$POLICY_LINE" >&2
  VIOLATIONS=1
fi

# Check 2: Staged protected paths (GUARD16-D-11, GUARD16-D-24, GUARD16-D-27)
PROTECTED_PATH_STAGED=$(git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
```

Lines 54-68:
```bash
# Check 3: Working-tree diff on protected paths (GUARD16-D-12, GUARD16-D-25, GUARD16-D-27)
# Note: working-tree graphify-out dirtiness is accepted_with_policy and NOT checked here (GUARD16-D-13, GUARD16-D-14)
PROTECTED_DIFF=$(git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts)
if [ -n "$PROTECTED_DIFF" ]; then
  echo "PROTECTED_DIFF: the following protected paths have uncommitted working-tree changes:" >&2
```

For Phase 55, contract constants should expose `graphify-out/`, `data/taxonomy/`, `data/inference/`, and `data/compiled/` as forbidden output prefixes where applicable, while allowing the exact v2.11 read-model output path only.

### Deterministic JSON Writer Is Not a Phase 55 Pattern
**Source:** `src/compiler/write_outputs.ts`  
**Apply to:** none in Phase 55; document for later phases only

Lines 20-22 show the writer convention:
```typescript
export const writeJsonDeterministic = async (path: string, payload: object): Promise<void> => {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}
```

Do not create or call this from Phase 55. It is relevant to Phase 58 writer planning, not the contract.

## No Analog Found

No Phase 55 files lack a usable analog. There is no existing `src/graph_read_model/` module, so `contract.ts` should combine the closest current patterns: `as const` static paths from `src/cli/parse_args.ts` and `readonly` artifact shape types from `src/types/*.ts`.

## Metadata

**Analog search scope:** root `AGENTS.md` (none), `.agents/skills/` index, `src/**/*.ts`, `src/tests/**/*.test.ts`, `src/tests/fixtures/**/*.md`, root markdown, safety scripts.  
**Files scanned:** 100+ TypeScript paths surfaced by glob, 56 test files surfaced by glob, root/planning markdown candidates, and safety script.  
**Files read for excerpts:** `55-RESEARCH.md`, `55-VALIDATION.md`, `.agents/skills/gsd-plan-phase/SKILL.md`, `src/package.json`, `src/tsconfig.json`, `src/vitest.config.ts`, `src/cli/parse_args.ts`, `src/types/taxonomy.ts`, `src/types/similarity.ts`, `src/compiler/types.ts`, `src/compiler/validate_output.ts`, `src/compiler/write_outputs.ts`, `src/tests/cli/parse_args.test.ts`, `src/tests/cli/alias_integrity.test.ts`, `src/tests/inventory/alias_target_inventory.test.ts`, `src/tests/compiler/validate_output.test.ts`, `scripts/check-safety-guards.sh`, `README.md`, `src/tests/fixtures/inventory/49-ALIAS-TARGET-INVENTORY.md`.  
**Pattern extraction date:** 2026-06-09
