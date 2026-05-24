# Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning - Pattern Map

**Mapped:** 2026-05-24  
**Files analyzed:** 6 target groups  
**Analogs found:** 6 / 6  
**Scope:** readiness and migration planning only. Do not execute default switch, alter `DEFAULT_PATHS`, create official `data/compiled/v2`, or modify code/data/artifacts.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-readiness-audit.md` | validation report / readiness audit | batch/reporting | `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` | exact |
| `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md` | policy document / validation report | transform/disposition ledger | `11-CONTEXT.md` soft findings + alias readiness sections | exact |
| `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-graph-review-readiness.md` | validation report | batch/reporting | `curation/v1-v2-comparison.md` graph/review metrics | exact |
| `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-migration-default-switch-proposal.md` | migration proposal / config planning | protected no-write + future diff proposal | `10-04-PLAN.md` temp-output/protected-path plan + `src/cli/parse_args.ts` | exact |
| `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-rollback-validation-release-gates.md` | rollback runbook / release gates | request-response validation checklist | `11-VALIDATION.md` + `10-04-PLAN.md` verification sections | role-match |
| Protected no-write/read-only paths: `src/cli/parse_args.ts`, `data/compiled/v1`, `data/taxonomy/taxonomy-seed.v1.json`, `data/inference/curated_relations.v1.json`, `data/inference/accord_map.v1.json`, `code/data/artifacts`, `data/compiled/v2` absence | protected config/data/artifact guard | no-write verification | `src/cli/parse_args.ts`, `09-04-PLAN.md`, `11-VALIDATION.md` | exact |

## Pattern Assignments

### `11-readiness-audit.md` (validation report / readiness audit, batch/reporting)

**Analog:** `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md`

**Report header/scope pattern** (lines 1-5):
```markdown
# Phase 10 Plan 04: v1 Baseline vs v2 Round 3 Candidate Comparison

**Status:** PASS - zero hard failures found.  
**Generated:** 2026-05-24  
**Scope:** validation report only; v2 remains candidate and is not promoted to default.
```

**Hard gate table pattern** (lines 24-37):
```markdown
## Hard Gate Results

| Hard gate | Result | Evidence |
|---|---:|---|
| Schema invalid | PASS | Both CLI compiles completed with `validation_status=ok` and `quality_gate_status=PASS`. |
| Nondeterminism | PASS | v2 was recompiled to `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate-repeat`; `cmp -s` matched all three generated JSON artifacts. |
| Default drift | PASS | `src/cli/parse_args.ts` defaults still point to v1 seed, v1 relations, v1 accords, and `data/compiled/v1`. |
| Protected mutation | PASS | `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` returned 0. |

**Hard failures:** none.
```

**Phase 11 required criteria source** (`11-CONTEXT.md` lines 66-80):
```markdown
Mandatory criteria:

- zero hard failures
- deterministic compile with fixed `generated_at`
- complete curation traceability
- explicit alias readiness policy
- graph readiness with no isolated subfamilies
- review queue readiness by distribution/severity
- zero-frequency policy
- migration plan
- rollback plan
- final persisted human approval
```

**Core pattern to copy:** use a readiness checklist with columns like `Gate`, `Required Evidence`, `Current Evidence`, `Result`, and `Promotion Impact`. The audit must separate evidence from authorization and should end with `ready_for_promotion` or `not_ready` recommendation, but must state Phase 11 does not execute promotion.

---

### `11-soft-findings-alias-policy.md` (policy document / validation report, transform/disposition ledger)

**Analog:** `11-CONTEXT.md` soft findings and alias readiness sections, plus `src/tests/curation/alias_seed_v2.test.ts` legacy-alias guard.

**Required disposition schema** (`11-CONTEXT.md` lines 91-117):
```markdown
Soft findings do not become blockers automatically, but none may remain implicit. Every soft finding must have one disposition:

- `blocker_before_promotion`
- `accepted_with_policy`
- `follow_up_after_promotion`

Final soft findings table must include `finding_id`, `description`, `affected_area`, `disposition`, `rationale`, `required_policy`, `promotion_blocker` and optional `follow_up_phase`.
```

**Specific soft finding rows to copy/adapt** (`11-CONTEXT.md` lines 107-115):
```markdown
| Finding | Disposition | Policy |
|---------|-------------|--------|
| `ylang ylang -> ylang_ylang` absent target | `accepted_with_policy` only with legacy alias exception; otherwise blocker | Must be explicit and auditable |
| lower graph density | `accepted_with_policy` | Allowed if `isolated_subfamilies = 0` and coverage is documented |
| inherited zero-frequency seeds | `accepted_with_policy` | List as accepted legacy; new zero-frequency without rationale blocks |
| review_queue 317 | `accepted_with_policy` plus `follow_up_after_promotion` | Must be smaller/more actionable than v1 and have no blocker types without disposition |
| increased `seed_corpus_conflict` | `accepted_with_policy` | Accepted when tied to curated seed truth with approval/rationale/evidence |
| pending/deferred candidates | `follow_up_after_promotion` | Must not contaminate authoritative artifacts |
```

**Alias exception policy pattern** (`11-CONTEXT.md` lines 136-147):
```markdown
- New aliases with absent targets are hard blockers.
- Round 3+ aliases must point to canonical targets present in seed v2.
- Alias candidate/review-only entries must never enter `descriptor_aliases.json`.
- Legacy aliases with absent targets are allowed only in an explicit, auditable exception list.
- Each exception needs rationale, disposition and follow-up.
```

**Existing code guard for legacy aliases** (`src/tests/curation/alias_seed_v2.test.ts` lines 79-84, 139-143):
```typescript
const isPreservedLegacyAlias = (alias: string, target: string): boolean => existingApprovedAliases[alias] === target

Object.entries(aliasSeed).forEach(([alias, target]) => {
  expect(
    descriptors.has(target) || isPreservedLegacyAlias(alias, target),
    `${alias} points to absent canonical target ${target} without approved legacy preservation`,
  ).toBe(true)
})
```

**Core pattern to copy:** create a final soft findings table with the mandated fields, then a separate legacy alias exception list. `ylang ylang -> ylang_ylang` may be accepted only as an auditable legacy exception; do not propose adding `ylang_ylang`, removing the alias, or remapping it in Phase 11.

---

### `11-graph-review-readiness.md` (validation report, batch/reporting)

**Analog:** `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md`

**Graph metrics pattern** (lines 91-101):
```markdown
### 6. Graph Coverage

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Input relation_count | 6 | 14 | +8 |
| Input accord_count | 5 | 19 | +14 |
| Compiled graph edges | 6 | 13 | +7 |
| Graph density | 0.4000 | 0.0850 | -0.3150 |
| Isolated subfamilies | 0 | 0 | 0 |

Density decreases because v2 adds many subfamilies faster than compiled edge count, but all 18 v2 subfamilies participate in at least one compiled graph edge.
```

**Review queue metrics pattern** (lines 119-128):
```markdown
### 8. Review Queue Quality

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Review queue total | 427 | 317 | -110 |
| Medium severity items | 427 | 317 | -110 |
| `corpus_candidate_low_support` | 410 | 284 | -126 |
| `seed_corpus_conflict` | 17 | 33 | +16 |

The queue is smaller and more focused. The seed-corpus-conflict increase is an expected soft finding caused by adding curated low/zero-frequency seed truth that still requires manual rationale rather than automatic corpus confirmation.
```

**Phase 11 graph gate source** (`11-CONTEXT.md` lines 163-180):
```markdown
- `isolated_subfamilies = 0`
- every subfamily has approved relation, approved accord, approved `relation_gap`, or approved `accord_gap`
- every edge has existing source and target endpoints
- every edge has manual score in `[0,1]`
- no placeholder `score: 0`
- no edge without workbook approval/rationale/evidence
```

**Core pattern to copy:** preserve coverage-over-density framing. Include graph gates, review queue distribution/severity, blocker disposition, and explicit soft finding status for lower density and increased `seed_corpus_conflict`. Do not propose artificial edges or data edits.

---

### `11-migration-default-switch-proposal.md` (migration proposal / config planning, protected no-write + future diff proposal)

**Analog:** `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/10-04-PLAN.md` and `src/cli/parse_args.ts`

**Temporary output command pattern** (`10-04-PLAN.md` lines 58-61):
```markdown
During future execution, compile v1 baseline only to `/tmp/opencode/taxonomy-phase10-comparison/v1-baseline` and v2 candidate only to `/tmp/opencode/taxonomy-phase10-comparison/v2-candidate`. Use these explicit-path commands, not the CLI defaults:
`cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase10-comparison/v1-baseline --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z`
`cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase10-comparison/v2-candidate --version 2.0.0-round-3-candidate --generated-at 2026-01-01T00:00:00.000Z`
Never run the default compile command that writes to `data/compiled/v1`; never write `data/compiled/v2`; never edit `src/cli/parse_args.ts`.
```

**Current default guard pattern** (`src/cli/parse_args.ts` lines 15-24):
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

**Phase 11 no-switch source** (`11-CONTEXT.md` lines 226-247):
```markdown
Phase 11 must not:

- alter `DEFAULT_PATHS`
- change CLI default behavior
- replace `data/compiled/v1`
- create official `data/compiled/v2`, except as documented proposal
- promote v2 automatically even if readiness gates pass

Future execution may alter `src/cli/parse_args.ts`, default seed/relation/accord paths, default version to `2.0.0`, output dir strategy, CLI docs and release notes.
```

**Core pattern to copy:** document expected future diffs as proposal only. Include a table of future files/settings that would change (`seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version`, docs/release notes), but list them as forbidden modifications for Phase 11. Any command examples must use `/tmp/opencode/taxonomy-phase11-readiness/*` or be explicitly labeled future-only.

---

### `11-rollback-validation-release-gates.md` (rollback runbook / release gates, request-response validation checklist)

**Analog:** `11-VALIDATION.md`, `11-CONTEXT.md` rollback/validation gate sections, and `10-04-PLAN.md` verification section.

**Validation contract pattern** (`11-VALIDATION.md` lines 20-26):
```markdown
| Property | Value |
|----------|-------|
| **Framework** | Vitest `^3.2.0` for existing curation/default-path tests; markdown/source assertions for Phase 11 docs |
| **Quick run command** | `git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` |
| **Full suite command** | `test ! -d data/compiled/v2 && git diff --exit-code code/data/artifacts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` |
```

**Per-task verification map pattern** (`11-VALIDATION.md` lines 41-48):
```markdown
| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-04-01 | 04 | 2 | PROMO-07, PROMO-08 | T-11-04 | Migration/default switch is proposal-only; `DEFAULT_PATHS` and official artifact paths remain unchanged | protected diff | `git diff --exit-code src/cli/parse_args.ts data/compiled/v1 && test ! -d data/compiled/v2` | W0 | pending |
| 11-ALL-01 | all | 2 | PROMO-01..PROMO-10 | T-11-01..T-11-05 | No code/data/artifact drift; no official v2 artifacts; Phase 11 outputs remain planning docs only | protected diff | `test ! -d data/compiled/v2 && git diff --exit-code code/data/artifacts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` | yes | pending |
```

**Rollback restore fields** (`11-CONTEXT.md` lines 305-313):
```markdown
Rollback must restore:

- `seedPath` to `data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath` to `data/inference/curated_relations.v1.json`
- `accordsPath` to `data/inference/accord_map.v1.json`
- `outputDir` to `data/compiled/v1`
- `version` to `1.0.0`
```

**Release checklist pattern** (`11-CONTEXT.md` lines 351-363):
```markdown
1. readiness report approved
2. hard gates = pass
3. soft findings have disposition
4. migration plan approved
5. rollback plan approved
6. expected diffs reviewed
7. v1/v2 artifacts compared
8. v1 baseline preserved
9. `data/compiled/v2` strategy defined
10. final human approval persisted
```

**Core pattern to copy:** produce a rollback runbook and release checklist without executing rollback. Treat git-only rollback as insufficient. Include commands/checks as future instructions and protected-path assertions; final persisted human approval remains mandatory and future-only.

---

### Protected no-write/read-only paths (protected config/data/artifact guard, no-write verification)

**Analog:** `09-04-PLAN.md`, `10-04-PLAN.md`, `11-VALIDATION.md`, and `src/cli/parse_args.ts`.

**Protected diff command pattern** (`09-04-PLAN.md` lines 116-125):
```markdown
<action>Verify that `data/compiled/v1/`, `data/taxonomy/taxonomy-seed.v1.json`, `data/inference/curated_relations.v1.json`, `data/inference/accord_map.v1.json`, and `src/cli/parse_args.ts` have a completely empty diff (i.e. no changes made to them).</action>
<verify><automated>git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts</automated></verify>
<acceptance_criteria>
  - Behavior assertion: git diff --exit-code returns 0 for all protected files, confirming they are unchanged.
</acceptance_criteria>
```

**Default path assertion pattern** (`src/tests/curation/v1_v2_comparison.test.ts` lines 94-99):
```typescript
it('preserves DEFAULT_PATHS pointing to v1 inputs and output', () => {
  expect(DEFAULT_PATHS.seedPath).toBe('data/taxonomy/taxonomy-seed.v1.json')
  expect(DEFAULT_PATHS.relationsPath).toBe('data/inference/curated_relations.v1.json')
  expect(DEFAULT_PATHS.accordsPath).toBe('data/inference/accord_map.v1.json')
  expect(DEFAULT_PATHS.outputDir).toBe('data/compiled/v1')
})
```

**Core pattern to copy:** every Phase 11 plan should list only Phase 11 markdown outputs as `files_modified`. Protected checks may read/assert these paths but must not modify them. Include `test ! -d data/compiled/v2` and protected diffs for `code/data/artifacts` where applicable.

## Shared Patterns

### Planning-only boundary
**Source:** `11-PREFLIGHT.md` lines 14-28.  
**Apply to:** all Phase 11 documents.
```markdown
- No executable plans exist.
- No implementation is authorized.
- No code changes are part of this phase state.
- No seed/data changes are authorized during context gathering.
- No compiled artifacts should be changed during discussion.
- No official `data/compiled/v2` should be created by default.
- `DEFAULT_PATHS` must not be altered.
```

### Candidate-only v2 boundary
**Source:** `10-PATTERNS.md` lines 357-360.  
**Apply to:** readiness audit, graph/review readiness, migration proposal.
```markdown
Do not promote v2, change defaults, overwrite `data/compiled/v1`, or mutate v1 inputs.
```

### Future-only command labeling
**Source:** `10-04-PLAN.md` lines 117-119.  
**Apply to:** migration and rollback documents.
```markdown
Future execution runs `cd src && npm test -- tests/curation/` and protected diff checks. Planning does not run tests, builds, compiles, or validation commands.
```

### Protected path validation
**Source:** `11-VALIDATION.md` lines 24-25 and 48.  
**Apply to:** all plans and final release gates.
```bash
test ! -d data/compiled/v2 && git diff --exit-code code/data/artifacts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts
```

### No new dependencies
**Source:** `11-RESEARCH.md` lines 110-114.  
**Apply to:** all Phase 11 outputs.
```markdown
No package installation is recommended for Phase 11.
No external packages are recommended for installation in Phase 11; package legitimacy gate is not applicable.
```

## No Analog Found

None. All target Phase 11 artifacts have direct documentation/report/protected-path analogs in Phase 10/11 planning material and current curation/default-path tests.

## Metadata

**Analog search scope:** `.planning/phases/10-taxonomy-seed-v2-expansion-round-3`, `.planning/phases/09-taxonomy-seed-v2-expansion-round-2`, `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration`, `src/cli`, `src/tests/curation`  
**Files scanned/read:** 16  
**Project instructions:** no repository-root `AGENTS.md` found; no local `.claude/skills` or `.agents/skills` found.  
**Pattern extraction date:** 2026-05-24
