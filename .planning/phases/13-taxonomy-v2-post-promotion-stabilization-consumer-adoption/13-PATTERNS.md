# Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption - Pattern Map

**Mapped:** 2026-05-25  
**Files analyzed:** 10 target files/artifact classes  
**Analogs found:** 10 / 10  
**Scope:** pattern map only. This file does **not** authorize test execution, smoke compiles, curation, Graphify regeneration, hooks, application code edits, seed/input edits, compiled artifact edits, `src/cli/parse_args.ts` edits, or `graphify-out/*` mutation.

## File Classification

| New/Modified File or Artifact Class | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `13-01-CONSUMER-INVENTORY.md` | audit report / documentation inventory | batch/reporting | `11-readiness-audit.md` pattern in `11-PATTERNS.md`; `13-RESEARCH.md` inventory pattern | exact |
| `13-02-SMOKE-VALIDATION.md` | validation report / smoke evidence | file-I/O batch + request-response CLI | `12-GATE-4-POST-SWITCH-VALIDATION.md`; `12-02-PLAN.md`; `src/tests/curation/v1_v2_comparison.test.ts` | exact |
| `13-03-GENERATED-ARTIFACT-POLICY.md` | generated-artifact policy / contamination audit | event-driven + no-write verification | `12-GATE-0-PREFLIGHT.md` Graphify dirty-state record; `13-CONTEXT.md` Graphify decisions | exact |
| `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` | release checklist / backlog boundary | transform/reporting | `12-RELEASE-MIGRATION-NOTES.md`; `12-05-PLAN.md`; `11-rollback-validation-release-gates.md` | exact |
| Protected diff checks over `data/compiled/v1`, `data/compiled/v2`, seed/inference/alias inputs, and `src/cli/parse_args.ts` | validation guard | no-write verification | `12-VALIDATION.md`; `13-RESEARCH.md` protected diff command | exact |
| `graphify-out/*` protected/plan-gated policy | generated artifact guard | event-driven contamination control | `13-CONTEXT.md` lines 185-199; prior summaries in grep results | exact |
| `13-01-PLAN.md` | executable plan | batch audit/reporting | `12-02-PLAN.md` frontmatter/task structure; `11-01-PLAN.md` docs-only audit style | exact |
| `13-02-PLAN.md` | executable plan | file-I/O batch smoke validation | `12-04-PLAN.md` post-switch validation task and `12-02-PLAN.md` temp compile task | exact |
| `13-03-PLAN.md` | executable plan | event-driven generated-output policy | `11-05-PLAN.md` future-only policy plan; `12-05-PLAN.md` documentation/policy task | role-match |
| `13-04-PLAN.md` | executable plan | transform/reporting closure | `12-05-PLAN.md` release/closure plan | exact |

## Pattern Assignments

### `13-01-CONSUMER-INVENTORY.md` (audit report / documentation inventory, batch/reporting)

**Analog:** `13-RESEARCH.md`, `11-PATTERNS.md`, `README.md`

**Inventory target pattern** (`13-CONTEXT.md` lines 100-120):
```markdown
- `STAB-D-01`: The Phase 13 consumer inventory will have full in-repo scope.
- `STAB-D-02`: The inventory will include source code, tests, npm scripts, documented CLI commands, README/docs, planning docs and versioned artifacts that mention defaults, explicit paths or compiled outputs.
- `STAB-D-04`: References to v1 are not errors by themselves; they must be classified as `baseline/archive`, `explicit_fallback`, `stale_reference` or `legacy_context`.

Inventory search targets:
- `DEFAULT_PATHS`
- `taxonomy-seed.v1.json`
- `taxonomy-seed.v2.json`
- `curated_relations.v1.json`
- `curated_relations.v2.json`
- `accord_map.v1.json`
- `accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `version: 1.0.0`
- `version: 2.0.0`
- `npm run compile`
- CLI flags: `--seed`, `--relations`, `--accords`, `--out`, `--version`
```

**Read-only command pattern to plan, not run during planning** (`13-RESEARCH.md` lines 204-209):
```bash
# read-only inventory search from repo root
rg -n "DEFAULT_PATHS|taxonomy-seed\.v1\.json|taxonomy-seed\.v2\.json|curated_relations\.v1\.json|curated_relations\.v2\.json|accord_map\.v1\.json|accord_map\.v2\.json|data/compiled/v1|data/compiled/v2|version: 1\.0\.0|version: 2\.0\.0|npm run compile|--seed|--relations|--accords|--out|--version" README.md src .planning
```

**Report table pattern** (`11-PATTERNS.md` lines 34-46):
```markdown
## Hard Gate Results

| Hard gate | Result | Evidence |
|---|---:|---|
| Protected mutation | PASS | `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` returned 0. |

**Hard failures:** none.
```

**Current docs status example to classify** (`README.md` lines 67-90):
```markdown
## Current Taxonomy Status

O compiler e CLI estão completos e geram artefatos determinísticos em `data/compiled/v2/` (default) e `data/compiled/v1/` (baseline/archive).

Estado atual do default CLI/compiler:

- `seedPath`: `data/taxonomy/taxonomy-seed.v2.json`
- `relationsPath`: `data/inference/curated_relations.v2.json`
- `accordsPath`: `data/inference/accord_map.v2.json`
- `outputDir`: `data/compiled/v2`
- `version`: `2.0.0`

Importante: `data/compiled/v1/` continua preservado como baseline/archive v1...
```

**Planner use:** Plan 13-01 should create an evidence table with columns like `surface`, `file`, `line`, `matched target`, `reference kind`, `classification`, `blocking?`, `evidence`, and `recommended disposition`. Do not auto-fix docs in the inventory plan unless a separate remediation plan explicitly authorizes it.

---

### `13-02-SMOKE-VALIDATION.md` (validation report / smoke evidence, file-I/O batch + request-response CLI)

**Analog:** `12-02-PLAN.md`, `12-04-PLAN.md`, `src/cli/parse_args.ts`, `src/cli/compile.ts`, `src/tests/curation/v1_v2_comparison.test.ts`, `src/tests/cli/compile.test.ts`

**Current v2 default source of truth** (`src/cli/parse_args.ts` lines 15-24):
```typescript
export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v2.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v2.json',
  accordsPath: 'data/inference/accord_map.v2.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v2',
  version: '2.0.0',
} as const
```

**Output safety pattern** (`src/cli/compile.ts` lines 70-80, 98-116):
```typescript
const resolveReadablePath = async (path: string): Promise<string> => {
  if (await exists(path)) return path
  if (path.startsWith('data/')) {
    const parentDataPath = join('..', path)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return path
}

const resolveOutputDir = (path: string): string => path === DEFAULT_PATHS.outputDir ? join('..', path) : path

export const runCompileCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  const args = parseCompileArgs(argv)
  if (args.help) {
    printHelp()
    return 0
  }
```

**Smoke command shape to adapt** (`13-RESEARCH.md` lines 217-239):
```bash
npm run compile -- --out /tmp/opencode/taxonomy-phase13-smoke/default-v2 --generated-at 2026-01-01T00:00:00.000Z

npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z

git diff --exit-code -- \
  data/compiled/v1 data/compiled/v2 \
  data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json \
  data/taxonomy/descriptor_aliases.seed.json \
  data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json \
  data/inference/accord_map.v1.json data/inference/accord_map.v2.json \
  src/cli/parse_args.ts
```

**Existing test default assertion pattern** (`src/tests/curation/v1_v2_comparison.test.ts` lines 94-100):
```typescript
it('preserves DEFAULT_PATHS pointing atomically to v2 inputs and output', () => {
  expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v2.json')
  expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v2.json')
  expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v2.json')
  expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v2')
  expect(DEFAULT_PATHS.version).toBe('2.0.0')
})
```

**Existing temp-output assertions** (`src/tests/cli/compile.test.ts` lines 67-80, 83-94):
```typescript
await expect(runCompileCli(argvFor(paths))).resolves.toBe(0)

await expect(readFile(join(paths.out, 'taxonomy.json'), 'utf8')).resolves.toContain('fresh_citrus')
await expect(readFile(join(paths.out, 'descriptor_aliases.json'), 'utf8')).resolves.toContain('lemony')
await expect(readFile(join(paths.out, 'similarity_matrix.json'), 'utf8')).resolves.toContain('review_queue')
expect(logSpy.mock.calls.flat().join('\n')).toContain('validation_status=ok')
expect(logSpy.mock.calls.flat().join('\n')).toContain('quality_gate_status=PASS')

await expect(stat(join(paths.out, 'quality_report.json'))).rejects.toThrow()
```

**Planner use:** Plan 13-02 should begin with protected diff checks, assert/import/inspect v2 `DEFAULT_PATHS`, run default-v2 and explicit-v1 fallback compiles only under `/tmp/opencode/taxonomy-phase13-smoke/*`, assert the three output files and versions, record validation/quality status, then repeat protected diff checks. Do not run a bare default compile that writes to official `data/compiled/v2`.

---

### `13-03-GENERATED-ARTIFACT-POLICY.md` (generated-artifact policy / contamination audit, event-driven + no-write verification)

**Analog:** `13-CONTEXT.md`, `13-PREFLIGHT.md`, `13-RESEARCH.md`, `12-GATE-0-PREFLIGHT.md`

**Graphify policy decisions** (`13-CONTEXT.md` lines 185-199):
```markdown
- `STAB-D-19`: `graphify-out/*` will be treated as protected and plan-gated in Phase 13.
- `STAB-D-20`: Preexisting changes in `graphify-out/*` do not block the phase by themselves, but they cannot enter commits without an explicit plan.
- `STAB-D-21`: Regeneration or mutation of `graphify-out/*` requires its own plan, allowlist and diff policy.
- `STAB-D-22`: Hooks that update `graphify-out/*` must be documented as a commit-contamination risk.
- `STAB-D-23`: Phase 13 will not use `graphify-out/*` as authoritative taxonomy correctness evidence without an explicit plan.

If a future plan needs Graphify, it must declare:
- Expected files under `graphify-out/*`.
- Generation command.
- Acceptable diff criteria.
- Whether the artifact is versioned or local-only.
- Separate commit policy, if applicable.
```

**Current generated-output risk statement** (`13-RESEARCH.md` lines 241-255):
```markdown
### Pattern 3: Generated artifacts are commit-contamination risks, not correctness proof

**What:** Treat `graphify-out/*` as protected/plan-gated and audit its dirty state without regenerating or staging it.

**Current local observation:** `git status --short` reports modified `graphify-out/.rebuild.lock`, `GRAPH_REPORT.md`, `graph.html` and `graph.json`; Phase 13 must not include these in commits without an explicit plan.

git status --short
git status --short -- graphify-out
git diff --name-only -- graphify-out
```

**Preflight boundary** (`13-PREFLIGHT.md` lines 44-53):
```markdown
- Consumer inventory covers the full repository: code, tests, npm scripts, documented CLI commands, README/docs, planning docs and versioned artifacts.
- Default v2 smoke tests must compile to temporary output under `/tmp`, not directly to `data/compiled/v2`.
- Explicit v1 fallback must use complete flags and temporary output under `/tmp`, never `data/compiled/v1`.
- Blocking docs are current/user-facing docs and CLI docs that communicate defaults or fallback behavior.
- `graphify-out/*` is protected and plan-gated, not authoritative taxonomy correctness evidence without a dedicated plan.
- CI/hooks/generated artifact verification must use diff-clean gates.
```

**Planner use:** Plan 13-03 should write a policy table with `artifact/path`, `current state`, `Phase 13 policy`, `allowed mutation?`, `commit policy`, `evidence command`, and `blocker condition`. It may inspect git status and npm scripts later during execution, but must not regenerate Graphify or stage `graphify-out/*`.

---

### `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` (release checklist / backlog boundary, transform/reporting)

**Analog:** `12-RELEASE-MIGRATION-NOTES.md`, `12-05-PLAN.md`, `11-05-PLAN.md`

**Checklist shape** (`13-CONTEXT.md` lines 231-273):
```markdown
- `STAB-D-30`: Phase 13 will close with a structured pass/block checklist.
- `STAB-D-31`: Each area must have status `pass`, `accepted_with_policy`, `follow_up` or `blocker`.
- `STAB-D-32`: The final checklist must include evidence, commands run when applicable and protected diff result.
- `STAB-D-33`: Phase 13 may close only if there are no active blockers.

Required checklist areas:
1. Consumer inventory
2. Default v2 smoke test
3. Explicit v1 fallback
4. Docs consistency
5. Graphify policy
6. CI/hooks/generated artifacts
7. Protected path diff checks
8. Release confidence final
9. Phase 14 backlog boundary

Each checklist item should include:
- `area`
- `status`
- `evidence`
- `commands_run`, if applicable
- `protected_diff_result`
- `artifacts_touched`
- `follow_up`, if applicable
- `blocker_reason`, if applicable
```

**Release notes messaging pattern** (`12-RELEASE-MIGRATION-NOTES.md` lines 25-33, 57-65, 85-90):
```markdown
## Official Artifacts

The official v2 artifact set is:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`data/compiled/v1` remains preserved as the v1 baseline/archive. The v2 promotion did not physically replace or remove `data/compiled/v1`.

## Explicit V1 Fallback

Consumers that need v1 can still use explicit CLI paths:

This fallback is intentionally explicit. The default compile now writes v2 artifacts to `data/compiled/v2`.

## Non-Goals

- v1 was not removed.
- v2 did not physically replace `data/compiled/v1`.
- Accepted soft findings were not claimed resolved.
- No new taxonomy curation was performed during release documentation.
```

**Docs task anti-overclaim pattern** (`12-05-PLAN.md` lines 123-135):
```markdown
Do not claim v1 was removed, do not claim v2 physically replaced `data/compiled/v1`, do not hide rollback, do not claim accepted soft findings were resolved, and do not start new taxonomy curation...

- Negative claim assertion: README/release/closure docs do not state v1 was removed, do not state `data/compiled/v1` was replaced, and do not state accepted soft findings were resolved.
- Scope assertion: automated verify runs protected `git diff --exit-code` for taxonomy seed files, relation/accord inputs, alias seed, `data/compiled/v1`, and `data/compiled/v2` artifacts.
```

**Backlog boundary** (`13-CONTEXT.md` lines 275-306):
```markdown
- `STAB-D-35`: Phase 13 will capture future items only as backlog, without executing curation fixes.
- `STAB-D-36`: Soft findings, review queue, alias cleanup, graph density and curation candidates are Phase 14+ backlog.
- `STAB-D-39`: The final backlog must separate `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` and `not_in_scope_phase_13`.

Allowed Phase 13 actions:
- Inventory.
- Classify.
- Validate.
- Document.
- Open follow-up.
- Register backlog.

Not allowed in Phase 13:
- Edit `taxonomy-seed.v2.json`.
- Edit `curated_relations.v2.json`.
- Edit `accord_map.v2.json`.
- Edit `descriptor_aliases.seed.json`.
- Edit `data/compiled/v1`.
- Edit `data/compiled/v2`.
- Change `src/cli/parse_args.ts`.
```

**Planner use:** Plan 13-04 should aggregate evidence from 13-01 through 13-03 into the nine required areas, block closure on any blocker, and route non-blocking curation or soft findings to explicit backlog buckets. Do not resolve backlog items in Phase 13.

---

### Protected diff checks over protected paths (validation guard, no-write verification)

**Analog:** `12-VALIDATION.md`, `13-RESEARCH.md`, `12-GATE-4-POST-SWITCH-VALIDATION.md`

**Mandatory Phase 13 protected paths** (`13-CONTEXT.md` lines 218-230):
```markdown
- `data/compiled/v1`
- `data/compiled/v2`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `src/cli/parse_args.ts`
```

**Exact command pattern** (`13-RESEARCH.md` lines 458-470):
```bash
git diff --exit-code -- \
  data/compiled/v1 data/compiled/v2 \
  data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json \
  data/taxonomy/descriptor_aliases.seed.json \
  data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json \
  data/inference/accord_map.v1.json data/inference/accord_map.v2.json \
  src/cli/parse_args.ts
```

**Planner use:** Put this diff gate at the start and end of every executable Phase 13 plan, and before any commit. Any diff in these paths is a blocker unless a future explicit plan changes Phase 13 boundaries.

---

### Four `PLAN.md` files (executable plan documents, mixed data flows)

**Analog:** `12-02-PLAN.md`, `12-04-PLAN.md`, `12-05-PLAN.md`, `11-05-PLAN.md`

**Frontmatter pattern** (`12-02-PLAN.md` lines 1-14):
```yaml
---
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 02
type: execute
wave: 1
depends_on: [12-01]
files_modified:
  - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-1-PRE-SWITCH-REVALIDATION.md
  - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-02-SUMMARY.md
autonomous: false
execution_readiness: not_ready_for_execution
blocked_until: 12-01-complete-and-gate-0-approved
requirements: [SWITCH-03, SWITCH-04, SWITCH-05, SWITCH-08]
user_setup: []
---
```

**Objective/context/precondition pattern** (`12-04-PLAN.md` lines 46-80):
```markdown
<objective>
Atomically switch CLI defaults to v2 after official artifact publication, then prove default v2 behavior and explicit v1 fallback without mutating protected v1 paths or seed/input files.

Purpose: make v2 the default only after Gate 2, while preserving v1 rollback anchor and avoiding partial defaults.
Output: narrow `src/cli/parse_args.ts` default-field diff, test updates only if strictly necessary, Gate 3 and Gate 4 evidence docs.
</objective>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md
@.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PATTERNS.md
@src/cli/parse_args.ts
@src/package.json
</context>

<preconditions>
- STOP if protected v1/input files have any diff before the switch.
- STOP if tests are modified for any reason other than reflecting approved v2 defaults and explicit v1 fallback preservation.
</preconditions>
```

**Task pattern for smoke evidence** (`12-04-PLAN.md` lines 117-139):
```markdown
<task type="auto">
  <name>Task 2: Run post-switch validation and explicit v1 fallback compile</name>
  <read_first>
    - .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-VALIDATION.md Gate 4 row
    - src/package.json scripts
    - src/cli/parse_args.ts switched defaults
  </read_first>
  <files>.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-GATE-4-POST-SWITCH-VALIDATION.md</files>
  <action>Run full validation after the switch... Run explicit v1 compile to `/tmp/...`...</action>
  <acceptance_criteria>
    - Command assertion: typecheck, full tests, build, default compile, and explicit v1 fallback compile exit 0.
    - Fallback assertion: explicit v1 compile writes to `/tmp/...`, not `data/compiled/v1`.
    - Protected assertion: automated verify runs protected `git diff --exit-code`...
  </acceptance_criteria>
</task>
```

**Threat model pattern** (`12-05-PLAN.md` lines 141-158):
```markdown
<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| validation evidence → release documentation | Docs must reflect evidence and not overstate status. |
| docs/tracking → user expectations | User-facing docs communicate defaults and rollback to downstream consumers. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-12-05-doc-misrepresentation | Information Disclosure/Repudiation | README/release notes | mitigate | Required/forbidden messaging checks for v2 default, v1 preservation, rollback, and soft findings. |
| T-12-05-curation-creep | Tampering | seed/data input files | mitigate | Documentation task forbids taxonomy curation and runs protected diff checks. |
</threat_model>
```

**Planner use:** Create exactly four plans:
- `13-01-PLAN.md`: Wave 1, read-only inventory/docs audit, writes `13-01-CONSUMER-INVENTORY.md` and summary only.
- `13-02-PLAN.md`: Wave 2 after 13-01, safe `/tmp` smoke validation, writes `13-02-SMOKE-VALIDATION.md` and summary only.
- `13-03-PLAN.md`: Wave 2 or 3, generated-artifact/Graphify policy, writes `13-03-GENERATED-ARTIFACT-POLICY.md` and summary only.
- `13-04-PLAN.md`: Final wave after 13-01 through 13-03, release confidence checklist/backlog boundary, writes `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` and summary only.

## Shared Patterns

### No-mutation stabilization boundary
**Source:** `13-PREFLIGHT.md` lines 16-30; `13-CONTEXT.md` lines 25-46.  
**Apply to:** all Phase 13 plans and evidence artifacts.
```markdown
- No code changes are authorized during context gathering.
- No new taxonomy curation is authorized.
- `taxonomy-seed.v2.json` must not be edited.
- `curated_relations.v2.json` must not be edited.
- `accord_map.v2.json` must not be edited.
- `descriptor_aliases.seed.json` must not be edited.
- `data/compiled/v1/` must not be overwritten or removed.
- `data/compiled/v2/` must not be overwritten or removed.
- `src/cli/parse_args.ts` must not be edited in Phase 13 context gathering.
- `graphify-out/*` is protected and plan-gated.
```

### Use existing npm scripts; no new dependencies
**Source:** `src/package.json` lines 6-19.  
**Apply to:** all executable validation plans.
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

### CLI parser validation and explicit flag support
**Source:** `src/cli/parse_args.ts` lines 33-51; `src/tests/cli/parse_args.test.ts` lines 29-57.  
**Apply to:** Plan 13-02 smoke command design and explicit v1 fallback.
```typescript
const FLAG_TO_KEY = {
  '--seed': 'seedPath',
  '--aliases': 'aliasPath',
  '--corpus': 'corpusPath',
  '--relations': 'relationsPath',
  '--accords': 'accordsPath',
  '--noise': 'noisePath',
  '--out': 'outputDir',
  '--version': 'version',
  '--generated-at': 'generatedAt',
} as const

const validateGeneratedAt = (value: string): void => {
  if (!value.endsWith('Z') || Number.isNaN(Date.parse(value))) {
    throw new CliArgumentError('--generated-at must be a parseable UTC ISO timestamp ending in Z')
  }
}
```

### Official side-by-side artifact layout
**Source:** `12-RELEASE-MIGRATION-NOTES.md` lines 25-33.  
**Apply to:** inventory, smoke validation, release checklist.
```markdown
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

`data/compiled/v1` remains preserved as the v1 baseline/archive. The v2 promotion did not physically replace or remove `data/compiled/v1`.
```

### Graphify commit-contamination guard
**Source:** `13-CONTEXT.md` lines 185-199; `13-RESEARCH.md` lines 241-255.  
**Apply to:** all plans, especially 13-03 and commit/staging instructions.
```markdown
Preexisting changes in `graphify-out/*` do not block the phase by themselves, but they cannot enter commits without an explicit plan.
Regeneration or mutation of `graphify-out/*` requires its own plan, allowlist and diff policy.
```

## No Analog Found

None. Every Phase 13 target has a direct analog in Phase 11/12 planning artifacts, Phase 13 research/context, current CLI source/tests, package scripts, README, or prior protected-path/Graphify contamination records.

## Metadata

**Analog search scope:** `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption`, `.planning/phases/12-taxonomy-seed-v2-default-switch-execution`, `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration`, `README.md`, `src/package.json`, `src/cli`, `src/tests/cli`, `src/tests/curation`  
**Files scanned/read:** 25 plus relevant glob/grep results  
**Project instructions:** no repository-root `AGENTS.md` found. `.agents/skills` exists; relevant `gsd-plan-phase`, `gsd-execute-phase`, and `gsd-verify-work` skill indices were read.  
**Pattern extraction date:** 2026-05-25
