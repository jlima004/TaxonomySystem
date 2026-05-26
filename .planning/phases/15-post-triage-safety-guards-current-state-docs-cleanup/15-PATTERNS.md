# Phase 15: Post-Triage Safety Guards & Current-State Docs Cleanup - Pattern Map

**Mapped:** 2026-05-26  
**Files analyzed:** 5 planned artifacts/mechanisms  
**Analogs found:** 5 / 5  
**Scope:** pattern map only. This file does **not** authorize safety automation implementation, compile/smoke, docs/help fixes, curation, protected-path edits, Graphify cleanup/regeneration/staging/commit, or any source/data/generated-artifact mutation.

## File Classification

| New/Modified File or Referenced Mechanism | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-01-PLAN.md` | plan artifact / local-proof contract | request-response validation checklist + no-write verification | `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-01-PLAN.md`; `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-01-PLAN.md` | exact |
| Protected diff guard command | validation guard | no-write verification | `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md`; `14-SAFETY-AUTOMATION-SHORTLIST.md` | exact |
| Graphify staging guard command | generated-artifact hygiene guard | no-write status/reporting | `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md`; `14-BACKLOG-MATRIX.md` GEN rows | exact |
| Local proof evidence fields / acceptance criteria | validation strategy | source assertion + local proof | `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-VALIDATION.md`; `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-01-PLAN.md` | exact |
| `src/cli/parse_args.ts` protected `DEFAULT_PATHS` reference | protected config/source reference | no-write configuration guard | `src/cli/parse_args.ts`; `src/tests/curation/v1_v2_comparison.test.ts` | exact |

## Pattern Assignments

### `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-01-PLAN.md` (plan artifact / local-proof contract, request-response validation checklist + no-write verification)

**Analog:** `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-01-PLAN.md`

**Plan frontmatter/files-modified pattern** (lines 1-13):

```yaml
---
phase: 14-taxonomy-v2-1-backlog-triage-curation-planning
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md
  - .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-01-SUMMARY.md
autonomous: true
requirements: [TRIAGE-01, TRIAGE-02, TRIAGE-03, TRIAGE-04, TRIAGE-05, TRIAGE-06, TRIAGE-07, TRIAGE-08, TRIAGE-09]
execution_readiness: approved_for_read_only_report_only_execution
```

**Phase 15 adaptation:** set `phase: 15-post-triage-safety-guards-current-state-docs-cleanup`, `plan: 01`, `files_modified` narrowly to `15-01-PLAN.md` and any explicitly approved Phase 15 proof/summary artifact only. Do **not** include source, data, docs/help, `graphify-out/*`, compiled artifacts, hooks, CI, package scripts, or `src/cli/parse_args.ts`.

**Preconditions pattern** (lines 58-62):

```markdown
<preconditions>
- Do not execute curation, descriptor promotion, alias add/remove/remap, relation/accord add/remove/score change, official artifact regeneration, compile/smoke, Graphify regeneration or code changes.
- Do not edit `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/inference/curated_relations.v2.json`, `data/inference/accord_map.v2.json`, `data/compiled/v1`, `data/compiled/v2`, `src/cli/parse_args.ts`, `.planning/STATE.md`, `.planning/ROADMAP.md` or `graphify-out/*`.
- This plan writes only `14-BACKLOG-MATRIX.md` and `14-01-SUMMARY.md`.
</preconditions>
```

**Phase 15 adaptation:** copy the boundary style, but replace the write allowlist with Phase 15 planning artifacts only and explicitly add: no safety automation implementation, no compile/smoke/typecheck/tests, no docs/help fixes, no Graphify cleanup/revert/regeneration/staging/commit, and no git-state mutation.

**Task/read-first/action/acceptance/verify pattern** (lines 66-85):

```markdown
<task type="auto">
  <name>Task 1: Create the full-backlog matrix schema, policy sections and known-facts baseline</name>
  <read_first>
    - .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md if it already exists, to preserve prior evidence instead of overwriting blindly.
    - .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CONTEXT.md BACKLOG-D-01 through BACKLOG-D-225, especially required fields, allowed dispositions, allowed mutation types and known facts.
  </read_first>
  <files>.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md</files>
  <action>Create `14-BACKLOG-MATRIX.md` with frontmatter or opening metadata stating `status: read_only_report_only`, `non_authorizing: true`, and protected boundary language...</action>
  <acceptance_criteria>
    - `14-BACKLOG-MATRIX.md` exists and states report-only/non-authorizing scope.
    - Protected paths are listed and no protected path was edited.
  </acceptance_criteria>
  <verify>
    <automated>... && git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts</automated>
  </verify>
</task>
```

**Phase 15 adaptation:** use exactly two plan tasks unless the planner has a strong reason to split further:

1. specify protected diff guard command and evidence template;
2. specify separate Graphify `report_and_fail` guard and no-remediation message.

Verification must be local-proof-only and must not add compile/smoke commands.

---

### Protected diff guard command (validation guard, no-write verification)

**Analogs:** `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md`, `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md`, `14-SAFETY-AUTOMATION-SHORTLIST.md`.

**Locked command pattern** (`15-CONTEXT.md` lines 79-94):

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

**Prior validation command pattern** (`14-VALIDATION.md` lines 24-27):

```markdown
| **Quick validation command** | `test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts && git status --short -- graphify-out` |
| **Protected diff command** | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` |
| **Graphify hygiene command** | `git status --short -- graphify-out && git diff --name-only -- graphify-out` |
```

**Safety shortlist source** (`14-SAFETY-AUTOMATION-SHORTLIST.md` lines 16-20):

```markdown
| Protected diff guard | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` | Fails when a future plan accidentally mutates curated inputs, official artifacts or CLI defaults. | `data/taxonomy/**`, `data/inference/**`, `data/compiled/v1/**`, `data/compiled/v2/**`, `src/cli/parse_args.ts` | Remove the guard script/test added by a future plan; no data rollback should be needed because the guard is non-mutating. |
```

**Planner use:** copy the multiline command exactly from `15-CONTEXT.md`. Keep Graphify out of this command. Record exit code, stdout, stderr, timestamp, and interpretation. Passing means exit code 0 and no output; failing means protected diff exists and the plan should report unexpected protected mutation without cleaning/reverting/staging.

---

### Graphify staging guard command (generated-artifact hygiene guard, no-write status/reporting)

**Analogs:** `15-CONTEXT.md`, `15-VALIDATION.md`, `14-BACKLOG-MATRIX.md`, `14-SAFETY-AUTOMATION-SHORTLIST.md`.

**Locked command and behavior** (`15-CONTEXT.md` lines 96-114):

```bash
git status --short -- graphify-out
```

Success criterion: empty output for `graphify-out/*`.  
Failure criterion: any line for `graphify-out/*`, including modified or untracked paths.

**Expected failure text** (`15-VALIDATION.md` lines 78-82):

```markdown
`graphify-out/* is dirty. This guard is report_and_fail only: it will not clean, revert, stage, commit, regenerate Graphify, alter hooks, or alter .gitignore. Treat this as commit hygiene risk, not taxonomy correctness evidence. Corrective Graphify action requires a separate generated-artifact plan with explicit allowlist and diff policy.`
```

**Graphify policy row pattern** (`14-BACKLOG-MATRIX.md` lines 157-165):

```markdown
## Graphify/generated artifacts

TRIAGE-08 and BACKLOG-D-179 through BACKLOG-D-203 keep `graphify-out/*` and official generated artifacts protected. Graphify is supplemental and not taxonomy truth.

| GEN-03 | graphify_artifacts | Dirty or preexisting Graphify output state | BACKLOG-D-181 and protected path policy | low | medium | Preexisting changes are not a taxonomy blocker but are a commit contamination risk | `git status --short -- graphify-out` before staging/commit | graphify_generated | `graphify-out/*` | artifact_plan_approval | staging guard, explicit allowlist if ever committed | none | phase_14_report_only | accepted_with_policy | Existing Graphify dirtiness does not block report-only work, but must remain out of this commit. |
```

**Planner use:** keep this guard separate from protected diff. Do not append `git diff --name-only -- graphify-out` for 15-01 unless explicitly approved; Phase 15 locked the command base to `git status --short -- graphify-out`. Any non-empty output is a hygiene failure/report, not taxonomy evidence.

---

### Local proof evidence fields / acceptance criteria (validation strategy, source assertion + local proof)

**Analog:** `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-VALIDATION.md`

**Test infrastructure pattern** (lines 27-35):

```markdown
| Property | Value |
|----------|-------|
| **Framework** | Local proof only; no unit test framework is required for `15-01`. |
| **Config file** | None. Existing `src/package.json` scripts are out of scope for this first front. |
| **Quick run command** | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` |
| **Full suite command** | Run the protected diff guard plus `git status --short -- graphify-out`; do not run compile/smoke/typecheck/tests. |
| **Estimated runtime** | <10 seconds. |
```

**Per-task verification map pattern** (`15-VALIDATION.md` lines 44-50):

```markdown
| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 15-01 | 1 | SAFETY-01, SAFETY-03 | T15-01 | Full Phase 14 protected boundary is checked without mutation. | local proof | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` | yes | pending |
| 15-01-02 | 15-01 | 1 | SAFETY-01 | T15-02 | Any `graphify-out/*` status line reports/fails as commit hygiene risk and triggers no remediation. | local proof | `git status --short -- graphify-out` | yes | pending |
| 15-01-03 | 15-01 | 1 | SAFETY-02, DOCS-01 | T15-03 | Deferred fronts stay excluded from 15-01. | source assertion | `15-01-PLAN.md` contains explicit exclusions for compile/smoke, docs/help fixes, curation, safety implementation, protected-path edits, and Graphify mutation. | planned | pending |
```

**Required evidence fields** (`15-VALIDATION.md` lines 64-77):

```markdown
Each local proof record must include:

- Exact command.
- Exit code.
- Stdout.
- Stderr.
- Timestamp.
- Expected pass/fail interpretation.
- Explicit note that no compile/smoke command was run.
- Explicit note that no protected paths were modified, cleaned, reverted, staged, committed, or regenerated.
- Explicit note that no `graphify-out/*` files were modified, cleaned, reverted, staged, committed, or regenerated by the guard.
```

**Planner use:** build acceptance criteria directly from these fields. Do not require Vitest, `npm test`, `npm run typecheck`, `npm run build`, `npm run compile`, or smoke validation in 15-01.

---

### `src/cli/parse_args.ts` protected `DEFAULT_PATHS` reference (protected config/source reference, no-write configuration guard)

**Analogs:** `src/cli/parse_args.ts`, `src/tests/curation/v1_v2_comparison.test.ts`.

**Current protected defaults source** (`src/cli/parse_args.ts` lines 15-24):

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

**Existing test analog for future/defaults-only plans** (`src/tests/curation/v1_v2_comparison.test.ts` lines 94-100):

```typescript
it('preserves DEFAULT_PATHS pointing atomically to v2 inputs and output', () => {
  expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v2.json')
  expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v2.json')
  expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v2.json')
  expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v2')
  expect(DEFAULT_PATHS.version).toBe('2.0.0')
})
```

**Planner use:** reference these only as protected context. 15-01 must not edit `src/cli/parse_args.ts` and must not add or run tests around `DEFAULT_PATHS`; defaults/fallback assertions are deferred.

## Shared Patterns

### Non-Authorization Boundary

**Source:** `15-CONTEXT.md` lines 64-72 and `14-SAFETY-AUTOMATION-SHORTLIST.md` lines 10-13.  
**Apply to:** entire `15-01-PLAN.md`.

```markdown
This shortlist is a planning aid for possible future safety automation. It authorizes no script, test, CI, release behavior, source, data, artifact, default-path or Graphify change.
```

Phase 15 plan should say: 15-01 is local-proof-only and does not implement safety automation.

### Protected Path Policy

**Source:** `15-CONTEXT.md` lines 171-183 and `14-BACKLOG-MATRIX.md` lines 15-27.  
**Apply to:** protected diff task and plan preconditions.

```markdown
Do not alter:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `src/cli/parse_args.ts`
- `graphify-out/*`
```

For 15-01, protected diff covers all except `graphify-out/*`; Graphify has a separate staging guard.

### Graphify Is Hygiene, Not Taxonomy Evidence

**Source:** `15-CONTEXT.md` lines 96-115 and `14-BACKLOG-MATRIX.md` lines 157-165.  
**Apply to:** Graphify guard, failure text, acceptance criteria.

```markdown
Dirty Graphify state is a commit-contamination risk, not taxonomy correctness evidence.
```

### Local-Proof-Only Validation

**Source:** `15-CONTEXT.md` lines 116-122 and `15-VALIDATION.md` lines 37-42.  
**Apply to:** acceptance criteria, verification section, proof template.

```markdown
- **During local proof after explicit approval:** run each guard command once and record exact command, exit code, stdout, stderr, timestamp, and interpretation.
- **Before `/gsd-verify-work`:** confirm no compile/smoke command was run and no protected path or `graphify-out/*` was modified, cleaned, reverted, staged, committed, or regenerated by the guard.
```

## Anti-Patterns To Avoid

- Combining `graphify-out/*` into the protected diff guard. `SAFE-D-10` requires Graphify to be separate.
- Cleaning, reverting, staging, committing, regenerating Graphify, altering hooks, or changing `.gitignore` in response to dirty Graphify status.
- Implementing a script, package script, hook, CI job, or safety automation in 15-01.
- Running compile/smoke/typecheck/tests or tmp-only compile proof in 15-01.
- Editing docs/help, curation inputs, inference inputs, official compiled artifacts, or `src/cli/parse_args.ts`.
- Treating dirty `graphify-out/*` as taxonomy correctness evidence.
- Shrinking the protected diff boundary by omitting `data/taxonomy` or `data/inference`.
- Writing outside Phase 15 planning artifacts or mutating git state.

## No Analog Found

None. Every 15-01 planned artifact/mechanism has a direct analog in Phase 14 report-only validation/plans, Phase 11 documentation-only plans, current Phase 15 validation, or existing `DEFAULT_PATHS` tests.

## Metadata

**Analog search scope:** `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration`, `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning`, `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup`, `src/cli`, `src/tests/curation`, `src/tests/cli`.  
**Files scanned/read:** 18 primary files plus project skill index checks.  
**Project instructions:** no repository-root `AGENTS.md` found. `.agents/skills/` exists; relevant GSD skill indexes checked for planning/Graphify/verification context.  
**Pattern extraction date:** 2026-05-26.  
**Commands executed by pattern mapper:** none that mutate source/data/artifacts/git state.  
**Only file written by pattern mapper:** `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-PATTERNS.md`.
