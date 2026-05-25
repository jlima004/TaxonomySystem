# Phase 12: Taxonomy Seed v2 Default Switch Execution - Pattern Map

**Mapped:** 2026-05-24  
**Files analyzed:** 12 target files/artifact classes  
**Analogs found:** 12 / 12  
**Scope:** pattern map only. This file does **not** authorize execution, artifact publication, `DEFAULT_PATHS` changes, `data/compiled/v2` creation, rollback execution, or final approval.

## File Classification

| New/Modified File or Artifact Class | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `12-FINAL-APPROVAL.md` | governance / approval document | request-response approval gate | `12-CONTEXT.md` lines 83-114; `12-PREFLIGHT.md` lines 80-113 | exact |
| Phase 12 pre-switch validation report(s) | validation report | batch/reporting | `12-VALIDATION.md` lines 38-68; `11-VALIDATION.md` lines 19-49 | exact |
| Temporary compile outputs under `/tmp/opencode/taxonomy-phase12-switch/*` | temporary artifact | file-I/O batch | `12-RESEARCH.md` lines 322-356; `v1_v2_comparison.test.ts` lines 74-87, 178-205 | exact |
| `data/compiled/v2/{taxonomy.json,descriptor_aliases.json,similarity_matrix.json}` | official artifact publication | file-I/O batch | `11-migration-default-switch-proposal.md` lines 26-37; `data/compiled/v1/*` file set | exact |
| `src/cli/parse_args.ts` | CLI config/source | request-response / argument transform | `src/cli/parse_args.ts` lines 15-24 | exact |
| `src/tests/cli/parse_args.test.ts` | test | request-response / argument transform | `src/tests/cli/parse_args.test.ts` lines 4-57 | exact |
| `src/tests/curation/v1_v2_comparison.test.ts` | test | file-I/O batch / deterministic compile | `src/tests/curation/v1_v2_comparison.test.ts` lines 89-205 | exact |
| Protected v1/input diff checks | validation guard | no-write verification | `12-PREFLIGHT.md` lines 240-270; `11-PATTERNS.md` lines 260-283 | exact |
| Rollback dry-run evidence/report | rollback runbook / validation report | temporary request-response validation | `11-rollback-validation-release-gates.md` lines 10-57; `12-VALIDATION.md` lines 66-67 | exact |
| Release/migration documentation (`README.md`, release notes, tracking docs) | documentation | transform/reporting | `README.md` lines 67-101; `12-PREFLIGHT.md` lines 296-327 | role-match |
| Staged commit/wave plan structure | planning / dependency control | event-driven gate sequence | `12-CONTEXT.md` lines 323-386; `12-RESEARCH.md` lines 141-164 | exact |
| `src/package.json` / `src/vitest.config.ts` command/test infrastructure | config | batch test/build | `src/package.json` lines 6-19; `src/vitest.config.ts` lines 1-7 | exact |

## Pattern Assignments

### `12-FINAL-APPROVAL.md` (governance / approval document, request-response approval gate)

**Analog:** `12-CONTEXT.md` and `12-PREFLIGHT.md`

**Required field pattern** (`12-CONTEXT.md` lines 83-105):
```markdown
Phase 12 requires final persisted human approval before any mutation. Approval must be recorded in:

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`

Required future approval fields:

- `approval_status: approved_for_default_switch`
- `approved_by: human_curator`
- `approved_at`
- `scope: taxonomy_seed_v2_default_switch`
- `accepts_soft_findings: true`
- `legacy_alias_exception_policy_accepted: true`
- `rollback_required: true`
- `rollback_plan_required_before_switch: true`
- `data_compiled_v2_publication: approved`
- `default_paths_switch: approved`
- `v1_baseline_preservation_required: true`
- `human_approval_final: true`
- `chat_approval_insufficient: true`
```

**Blocking pattern** (`12-PREFLIGHT.md` lines 106-113):
```markdown
- Without `12-FINAL-APPROVAL.md`, no plan may alter `DEFAULT_PATHS`.
- Without `12-FINAL-APPROVAL.md`, no plan may create `data/compiled/v2`.
- Without `12-FINAL-APPROVAL.md`, no plan may execute default switch.
```

**Planner use:** Plan 12-01 should copy this approval field list exactly and keep all later mutation plans blocked until the persisted file exists and passes field checks. Do not infer approval from chat.

---

### Phase 12 pre-switch validation report(s) (validation report, batch/reporting)

**Analog:** `12-VALIDATION.md`

**Gate table pattern** (`12-VALIDATION.md` lines 38-48):
```markdown
| Gate | Owner Plan | Required Evidence | Blocking Condition |
|------|------------|-------------------|--------------------|
| Gate 0 - Final approval | 12-01 | Complete `12-FINAL-APPROVAL.md` with all required approval fields from `12-PREFLIGHT.md` | Missing persisted approval, chat-only approval, or incomplete required fields |
| Gate 1 - Pre-switch revalidation | 12-02 | typecheck, tests, build, explicit v1 temp compile, explicit v2 temp compile, repeated v2 temp compile, `cmp -s` determinism, clean protected diffs, `data/compiled/v2` absent | Any command failure, hard finding, pre-existing `data/compiled/v2`, protected path drift, or stale Phase 11 evidence used as substitute |
```

**Per-task verification pattern** (`12-VALIDATION.md` lines 56-68): use rows like `12-02-01` through `12-05-02` with columns `Task ID`, `Plan`, `Wave`, `Requirement`, `Threat Ref`, `Secure Behavior`, `Test Type`, `Automated Command / Check`, `File Exists`, `Status`.

**Planner use:** Future validation/pre-switch reports should record current command evidence, not reuse Phase 10/11 evidence as proof. Keep `execution_readiness: not_ready_for_execution` until Gate 0 and Gate 1 pass.

---

### Temporary compile validation outputs (temporary artifact, file-I/O batch)

**Analog:** `12-RESEARCH.md` and `v1_v2_comparison.test.ts`

**Future Gate 1 command shape** (`12-RESEARCH.md` lines 322-356):
```bash
cd src
npm run typecheck
npm test
npm run build

npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v1.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v1.json \
  --accords ../data/inference/accord_map.v1.json \
  --out /tmp/opencode/taxonomy-phase12-switch/v1-baseline \
  --version 1.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z

npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v2.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v2.json \
  --accords ../data/inference/accord_map.v2.json \
  --out /tmp/opencode/taxonomy-phase12-switch/v2-candidate \
  --version 2.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z
```

**Deterministic test pattern** (`v1_v2_comparison.test.ts` lines 178-205): repeated compiles compare output strings exactly:
```typescript
const taxonomy1 = await readFile(join(paths1.outDir, 'taxonomy.json'), 'utf8')
const taxonomy2 = await readFile(join(paths2.outDir, 'taxonomy.json'), 'utf8')
expect(taxonomy1).toBe(taxonomy2)

const aliases1 = await readFile(join(paths1.outDir, 'descriptor_aliases.json'), 'utf8')
const aliases2 = await readFile(join(paths2.outDir, 'descriptor_aliases.json'), 'utf8')
expect(aliases1).toBe(aliases2)
```

**Planner use:** Gate 1 must write only under `/tmp/opencode/taxonomy-phase12-switch/*`, use fixed `generated_at` unless final approval explicitly chooses another comparison policy, and compare all three artifacts (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`) before publication.

---

### Official `data/compiled/v2` artifacts (official artifact publication, file-I/O batch)

**Analog:** `11-migration-default-switch-proposal.md` and current `data/compiled/v1` file set

**Side-by-side layout pattern** (`11-migration-default-switch-proposal.md` lines 26-37):
```markdown
Future approved promotion is expected to maintain this side-by-side official layout:

- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`data/compiled/v1` remains preserved baseline/archive; it is not a replacement target for v2 writes.
```

**Current official v1 file identifiers found:**
```text
data/compiled/v1/taxonomy.json
data/compiled/v1/descriptor_aliases.json
data/compiled/v1/similarity_matrix.json
```

**Planner use:** Plan 12-03 may publish only the three v2 files after Gate 1 passes. It must not copy old Phase 10 temp output, overwrite `data/compiled/v1`, alter seed/input files, or combine artifact publication with `DEFAULT_PATHS` switch.

---

### `src/cli/parse_args.ts` (CLI config/source, request-response argument transform)

**Analog:** current `DEFAULT_PATHS` source

**Imports pattern:** none; file is self-contained TypeScript with exported types/constants.

**Current default block** (`src/cli/parse_args.ts` lines 15-24):
```typescript
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v1.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v1.json',
  accordsPath: 'data/inference/accord_map.v1.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v1',
  version: '1.0.0',
} as const
```

**Argument validation pattern** (`src/cli/parse_args.ts` lines 47-51, 83-85):
```typescript
const validateGeneratedAt = (value: string): void => {
  if (!value.endsWith('Z') || Number.isNaN(Date.parse(value))) {
    throw new CliArgumentError('--generated-at must be a parseable UTC ISO timestamp ending in Z')
  }
}
```

**Planner use:** Plan 12-04 may edit only these five fields and only after official v2 artifacts validate: `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version`. Preserve `aliasPath`, `corpusPath`, `noisePath`, parser behavior, error class, flags, and generated-at validation.

---

### `src/tests/cli/parse_args.test.ts` (test, request-response argument transform)

**Analog:** current CLI parser test

**Test imports pattern** (`src/tests/cli/parse_args.test.ts` lines 1-2):
```typescript
import { describe, expect, it } from 'vitest'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from '../../cli/parse_args.js'
```

**Defaults and flag parsing pattern** (`src/tests/cli/parse_args.test.ts` lines 4-31):
```typescript
describe('parseCompileArgs', () => {
  it('returns defaults', () => {
    expect(parseCompileArgs([])).toEqual({ ...DEFAULT_PATHS, generatedAt: undefined, help: false, qualityReport: false })
  })

  it('parses --version', () => {
    expect(parseCompileArgs(['--version', '2.0.0']).version).toBe('2.0.0')
  })

  it('parses all path flags', () => {
    const result = parseCompileArgs(['--seed', 's', '--aliases', 'a', '--corpus', 'c', '--relations', 'r', '--accords', 'ac'])
    expect(result).toMatchObject({ seedPath: 's', aliasPath: 'a', corpusPath: 'c', relationsPath: 'r', accordsPath: 'ac' })
  })
```

**Planner use:** If tests change after Gate 3, keep them narrow: assert v2 defaults and explicit v1 override/fallback without broad rewrites. Do not add a new test framework.

---

### `src/tests/curation/v1_v2_comparison.test.ts` (test, file-I/O batch / deterministic compile)

**Analog:** current v1/v2 comparison guard

**Imports and fixture pattern** (`src/tests/curation/v1_v2_comparison.test.ts` lines 1-7):
```typescript
import { mkdtemp, readFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCompileCli } from '../../cli/compile.js'
import { DEFAULT_PATHS } from '../../cli/parse_args.js'
```

**Explicit path argv pattern** (`src/tests/curation/v1_v2_comparison.test.ts` lines 74-87):
```typescript
const argvFor = (
  paths: Awaited<ReturnType<typeof writeComparisonFixtures>>,
  version: string,
): string[] => [
  '--seed', paths.seedPath,
  '--aliases', paths.aliasesPath,
  '--corpus', paths.corpusPath,
  '--relations', paths.relationsPath,
  '--accords', paths.accordsPath,
  '--noise', paths.noisePath,
  '--out', paths.outDir,
  '--version', version,
  '--generated-at', '2026-01-01T00:00:00.000Z',
]
```

**Current default guard** (`src/tests/curation/v1_v2_comparison.test.ts` lines 94-99):
```typescript
it('preserves DEFAULT_PATHS pointing to v1 inputs and output', () => {
  expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v1.json')
  expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v1.json')
  expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v1.json')
  expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v1')
})
```

**Planner use:** After Gate 3, update this guard only if necessary so it reflects approved v2 defaults while preserving explicit v1 compile coverage. Keep temp fixture patterns and fixed timestamp.

---

### Protected v1/data input diff checks (validation guard, no-write verification)

**Analog:** `12-PREFLIGHT.md`

**Protected diff command** (`12-PREFLIGHT.md` lines 240-250):
```bash
git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json
```

**Required existence checks** (`12-PREFLIGHT.md` lines 252-261):
```bash
test -f data/taxonomy/taxonomy-seed.v1.json
test -f data/inference/curated_relations.v1.json
test -f data/inference/accord_map.v1.json
test -f data/compiled/v1/taxonomy.json
test -f data/compiled/v1/descriptor_aliases.json
test -f data/compiled/v1/similarity_matrix.json
```

**Protected input identifiers found:**
```text
data/taxonomy/taxonomy-seed.v1.json
data/taxonomy/taxonomy-seed.v2.json
data/taxonomy/descriptor_aliases.seed.json
data/inference/curated_relations.v1.json
data/inference/curated_relations.v2.json
data/inference/accord_map.v1.json
data/inference/accord_map.v2.json
data/inference/semantic_noise.v1.json
```

**Planner use:** Every mutable plan must run protected diff/existence checks before and after its stage. Any diff in v1 artifacts, v1/v2 inputs, alias seed, or unrelated files is a hard blocker requiring human review.

---

### Rollback dry-run evidence/report (rollback runbook / validation report, temporary request-response validation)

**Analog:** `11-rollback-validation-release-gates.md` and `12-VALIDATION.md`

**Rollback principles** (`11-rollback-validation-release-gates.md` lines 10-18):
```markdown
- Rollback must be documented and testable before any future switch.
- **git-only rollback is insufficient** as the primary rollback strategy.
- Rollback must restore runtime defaults and validate preserved v1 inputs/artifacts.
- No future promotion proceeds without approved rollback commands and validation gates.
```

**Rollback restore values** (`11-rollback-validation-release-gates.md` lines 19-29):
```markdown
- `seedPath` to `data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath` to `data/inference/curated_relations.v1.json`
- `accordsPath` to `data/inference/accord_map.v1.json`
- `outputDir` to `data/compiled/v1`
- `version` to `1.0.0`
```

**Phase 12 rollback task row** (`12-VALIDATION.md` lines 66-67):
```markdown
| 12-05-01 | 05 | 5 | SWITCH-09, SWITCH-11 | T12-rollback-false-positive | Rollback dry-run proves v1 defaults can be restored without deleting official v2 | temporary rollback assertion | Temporary patch/worktree/equivalent asserts v1 defaults, v1 compile, `data/compiled/v2` still present, and `rollback_success: true` | future only | pending |
```

**Planner use:** Plan 12-05 should validate rollback in a temporary patch/worktree/equivalent, not permanently rollback the main branch. It must prove v1 defaults and v1 compile, preserve `data/compiled/v2`, and record `rollback_success: true` before closure.

---

### Release/migration documentation (`README.md`, release notes, tracking docs) (documentation, transform/reporting)

**Analog:** current `README.md` status section and `12-PREFLIGHT.md` docs policy

**Current README default-status pattern** (`README.md` lines 67-82):
```markdown
## Current Taxonomy Status

O compiler e CLI v1 estão completos e geram artefatos determinísticos em `data/compiled/v1/`.

Importante: `src/cli/parse_args.ts` continua apontando os defaults para v1 (`taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json`, `data/compiled/v1`, version `1.0.0`). O v2 precisa ser usado por caminhos explícitos até existir um plano separado de promoção com aprovação humana, migração e rollback.
```

**Required future messaging** (`12-PREFLIGHT.md` lines 306-318):
```markdown
- v2 is default.
- `DEFAULT_PATHS` point to v2 seed/relation/accord inputs, `data/compiled/v2`, and version `2.0.0`.
- `data/compiled/v2` is official v2.
- `data/compiled/v1` remains baseline/archive.
- v1 inputs remain preserved.
- rollback to v1 is documented and validated.
- Phase 11 soft findings remain accepted/documented, not necessarily resolved.
- `ylang ylang -> ylang_ylang` remains legacy alias exception.
- explicit v1 compile remains available through explicit paths.
- promotion was approved by `12-FINAL-APPROVAL.md`.
```

**Forbidden docs claims** (`12-PREFLIGHT.md` lines 319-327):
```markdown
- Do not state v1 was removed.
- Do not state v2 physically replaced `data/compiled/v1`.
- Do not hide rollback.
- Do not present accepted soft findings as resolved.
- Do not start new taxonomy curation.
```

**Planner use:** Plan 12-05 should update README/release/tracking docs only after Gate 4 and rollback evidence. Keep docs minimal and scoped to changed defaults, official v2 artifacts, v1 preservation, rollback, and accepted soft findings.

---

### Staged commit/wave dependency implications (planning / dependency control, event-driven gate sequence)

**Analog:** `12-CONTEXT.md` and `12-RESEARCH.md`

**Gate sequence pattern** (`12-CONTEXT.md` lines 323-335):
```markdown
- Gate 0: Final approval.
- Gate 1: Pre-switch revalidation.
- Gate 2: Official v2 artifact publication.
- Gate 3: `DEFAULT_PATHS` switch.
- Gate 4: Post-switch validation.
- Gate 5: Rollback dry-run.
- Gate 6: Final release documentation.
```

**Recommended commits** (`12-CONTEXT.md` lines 360-386):
```markdown
1. `docs(12): record final approval and pre-switch validation`
2. `build(data): publish compiled v2 taxonomy artifacts`
3. `feat(cli): switch taxonomy defaults to v2`
4. `docs(12): document v2 default migration and rollback`
5. `test(12): record post-switch and rollback validation`
```

**Five-plan breakdown** (`12-RESEARCH.md` lines 141-149): use Plan 12-01 approval/preflight, 12-02 pre-switch revalidation, 12-03 official publication, 12-04 default switch/post-switch validation, 12-05 rollback/docs/closure.

**Planner use:** Plans must be wave-dependent. Do not mix artifact publication and default switch. Do not place release closure before rollback evidence. Each commit should correspond to one validated gate and pass protected diff checks.

---

### Command/test infrastructure (`src/package.json`, `src/vitest.config.ts`) (config, batch test/build)

**Analog:** existing package scripts and Vitest config

**Script pattern** (`src/package.json` lines 6-14):
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Test include pattern** (`src/vitest.config.ts` lines 1-7):
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  }
})
```

**Planner use:** Use existing npm scripts and Vitest. Do not add dependencies or watch-mode commands. Future quick command should match `cd src && npm run typecheck && npm test -- tests/cli/parse_args.test.ts tests/curation/v1_v2_comparison.test.ts`; full suite should match `cd src && npm run typecheck && npm test && npm run build`.

## Shared Patterns

### Non-execution boundary until final approval and final preflight
**Source:** `12-CONTEXT.md` lines 14-39; `12-VALIDATION.md` lines 11-14.  
**Apply to:** all Phase 12 planning documents and plans.
```markdown
Phase 12 is `context_captured` / `not_ready_for_execution`. No code change, seed/data input change, compiled artifact change, artifact publication, rollback execution or default switch is authorized until persisted final approval and current gates pass.
```

### Atomic `DEFAULT_PATHS` switch
**Source:** `12-CONTEXT.md` lines 181-209.  
**Apply to:** Plan 12-04 only, after Gate 2.
```markdown
The future `DEFAULT_PATHS` switch must be atomic. All five fields must change together:
- `seedPath`
- `relationsPath`
- `accordsPath`
- `outputDir`
- `version`
```

### Official artifact publication scope
**Source:** `12-CONTEXT.md` lines 212-239.  
**Apply to:** Plan 12-03 only, after Gate 1.
```markdown
Official publication will create only `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` in `data/compiled/v2`.
```

### Protected v1/input paths
**Source:** `12-CONTEXT.md` lines 158-169 and `12-PREFLIGHT.md` lines 154-165.  
**Apply to:** all plans.
```markdown
Protected/no-edit paths include v1 and v2 taxonomy/inference inputs, `descriptor_aliases.seed.json`, `data/compiled/v1/**`, and `graphify-out/*` unless separately and explicitly planned.
```

### No new dependencies
**Source:** `12-RESEARCH.md` lines 123-127 and `src/package.json` lines 15-19.  
**Apply to:** all plans.
```markdown
No external package installation is recommended for Phase 12; use existing TypeScript/Vitest dev dependencies and system tools (`git`, `cmp`, `test`).
```

## No Analog Found

None. Every target Phase 12 artifact/file class has a direct analog in Phase 11 planning docs, Phase 12 context/validation contracts, current CLI source/tests, README, package config, or current `data/compiled/v1` artifact file set.

## Metadata

**Analog search scope:** `.planning/phases/12-taxonomy-seed-v2-default-switch-execution`, `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration`, `src/cli`, `src/tests/cli`, `src/tests/curation`, `src/package.json`, `src/vitest.config.ts`, `README.md`, `data/compiled/v1`, `data/taxonomy`, `data/inference`  
**Files scanned/read:** 24 plus directory/file-name inventories  
**Project instructions:** no repository-root `AGENTS.md` found. `.agents/skills` exists; relevant GSD skill indices read for planning/validation/execution/verify/ship conventions.  
**Pattern extraction date:** 2026-05-24
