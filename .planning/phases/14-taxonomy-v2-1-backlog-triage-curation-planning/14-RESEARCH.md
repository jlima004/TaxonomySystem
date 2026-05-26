# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Research

**Researched:** 2026-05-26  
**Status:** research_and_pattern_mapping_only  
**Execution readiness:** not_ready_for_execution  
**Domain:** post-v2-default backlog triage, review_queue actionability planning, soft-finding re-disposition, alias/graph/relation/accord audit planning, generated-artifact protection and safety automation planning.  
**Confidence:** HIGH for Phase 14 boundaries and local v2 metrics; MEDIUM for future candidate dispositions because final triage artifacts have not been created yet.

## Scope

This research maps sources, reusable patterns, safe commands, data structures, risks, expected artifacts and strategy for future Phase 14 planning. It creates no validation contract, no executable plan, no backlog matrix, no review queue report and no manual-review pack.

Phase 14 remains `context_captured / not_ready_for_execution` after this research.

## Mandatory Base Consumed

| Source | Role | Research Use |
|---|---|---|
| `14-CONTEXT.md` | Canonical decision source for `BACKLOG-D-01` through `BACKLOG-D-225` | Defines risk-first policy, protected paths, required matrix fields, review_queue report requirements and future artifact boundaries. |
| `14-PREFLIGHT.md` | Non-executable boundary | Confirms `allowed_next_step: research_and_pattern_mapping`, `executable: false`, no code/data/artifact mutation and no executable plans. |
| `14-DISCUSSION-LOG.md` | Audit trail | Confirms selected alternatives and rationale, but does not override `14-CONTEXT.md`. |

## User Constraints

### Allowed Now

- Create `14-RESEARCH.md`.
- Create `14-PATTERNS.md`.
- Read protected data/artifact/source files for research only.
- Describe future compile/smoke commands only as planned `/tmp` commands; do not execute them in this step.

### Forbidden Now

- Do not alter `data/taxonomy/taxonomy-seed.v2.json`.
- Do not alter `data/taxonomy/descriptor_aliases.seed.json`.
- Do not alter `data/inference/curated_relations.v2.json`.
- Do not alter `data/inference/accord_map.v2.json`.
- Do not alter `data/compiled/v1` or `data/compiled/v2`.
- Do not alter `src/cli/parse_args.ts`.
- Do not alter, regenerate, stage, clean or revert `graphify-out/*`.
- Do not execute curation, descriptor promotion, alias add/remove/remap, relation/accord add/remove/score change or official artifact regeneration.
- Do not create `14-VALIDATION.md`, `14-01-PLAN.md`, `14-BACKLOG-MATRIX.md`, `14-REVIEW-QUEUE-TRIAGE.md` or manual-review packs in this step.

## Phase Requirements Support

| Requirement | Research Support |
|---|---|
| `TRIAGE-01` Review queue reduction | Future `14-REVIEW-QUEUE-TRIAGE.md` should be actionability-first, split `corpus_candidate_low_support` from `seed_corpus_conflict`, include summary metrics, groupings, samples, suggested dispositions and guardrails. |
| `TRIAGE-02` Soft findings disposition | Future `14-BACKLOG-MATRIX.md` must re-disposition prior accepted findings with risk, impact, evidence, mutation type, approval and validation fields. |
| `TRIAGE-03` Alias cleanup | Future matrix should cover absent-target aliases `ylang ylang -> ylang_ylang` and `petit grain -> petitgrain`; optional alias pack only if matrix needs human decisions beyond row-level triage. |
| `TRIAGE-04` Graph quality | Future matrix should preserve coverage-first framing; low density remains accepted with policy unless endpoint, score, rationale, isolation or artifact safety gates fail. |
| `TRIAGE-05` Curation candidates | Future matrix should inventory candidates without promotion; optional curation pack only for clear candidates with existing family/subfamily fit and traceable evidence. |
| `TRIAGE-06` Relations/accords quality | Future matrix should audit endpoint validity, score validity, rationale/evidence and gaps before any expansion or tuning. |
| `TRIAGE-07` Docs/help cleanup | Future matrix may shortlist small current-state docs/help cleanup, but no direct fix without a plan and protected diff gate. |
| `TRIAGE-08` Graphify/generated lifecycle | Future matrix should keep Graphify/generated artifacts protected/plan-gated and treat them as contamination risk, not taxonomy truth. |
| `TRIAGE-09` CI/release automation | Future matrix may shortlist non-mutating guard checks, prioritizing protected diff, `/tmp` compile guard, Graphify staging guard, v2 default assertion and v1 fallback assertion. |

## Current Baseline Metrics

Read-only local JSON inspection confirmed these Phase 14 baseline facts. No compile, curation or artifact regeneration was run.

| Area | Current v2 Fact | Source |
|---|---:|---|
| Seed families | 10 | `data/taxonomy/taxonomy-seed.v2.json` |
| Seed subfamilies | 18 | `data/taxonomy/taxonomy-seed.v2.json` |
| Seed descriptors | 39 | `data/taxonomy/taxonomy-seed.v2.json` |
| Review queue total | 317 | `data/compiled/v2/similarity_matrix.json` |
| `corpus_candidate_low_support` | 284 | `data/compiled/v2/similarity_matrix.json` |
| `seed_corpus_conflict` | 33 | `data/compiled/v2/similarity_matrix.json` |
| Review severity | 317 medium | `data/compiled/v2/similarity_matrix.json` |
| Graph subfamilies | 18 | `data/compiled/v2/similarity_matrix.json` stats |
| Graph edges | 13 | `data/compiled/v2/similarity_matrix.json` stats |
| Graph density | 0.08496732026143791 | `data/compiled/v2/similarity_matrix.json` stats |
| Alias seed mappings | 11 | `data/taxonomy/descriptor_aliases.seed.json` |
| Absent alias targets | `ylang ylang -> ylang_ylang`; `petit grain -> petitgrain` | alias seed against v2 seed descriptors |
| Curated relations | 14 | `data/inference/curated_relations.v2.json` |
| Accord records | 19 | `data/inference/accord_map.v2.json` |

Review queue grouping observations from read-only inspection:

| Group | Observation | Planning Consequence |
|---|---|---|
| `corpus_candidate_low_support` by subfamily | Highest groups: `amber` 111, `tropical_fruit` 28, `floral_rose` 24, `citrus_fresh` 22, `orchard_fruit` 20. | Future report should group before sampling; do not classify all 284 line-by-line in first triage. |
| `corpus_candidate_low_support` by reason | `support_below_threshold` 267, `normalized_support_below_threshold` 9, `placement_score_below_threshold` 8. | Report should distinguish reason families and identify whether any group suggests manual review, future candidate inventory or non-actionable corpus noise. |
| `seed_corpus_conflict` by subfamily | Highest groups: `citrus_fresh` 6, `floral_rose` 5, `tropical_fruit` 5, `orchard_fruit` 4. | Conflict triage should remain attention-only; no auto-fix, no auto-promotion. |
| `seed_corpus_conflict` by seed descriptor | Frequent anchors include `rose` 5, `melon` 4, `banana` 3, `bitter_orange` 3, `grapefruit` 3. | Samples should show seed/corpus tension and explain why seed truth is not automatically wrong. |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Full backlog triage | Planning artifact tier | Source/data read-only evidence | `14-BACKLOG-MATRIX.md` is the mandatory handoff and must cover all known backlog areas. |
| Review queue triage | Compiled artifact read-only analysis | Future manual review workflow | `review_queue` lives in official compiled v2 output; Phase 14 can analyze it but must not mutate data or artifacts. |
| Alias cleanup planning | Alias seed + v2 seed read-only comparison | Legacy alias policy docs/tests | Alias mutation requires persisted approval and target integrity validation; default posture is classify only. |
| Graph/relation/accord quality | v2 seed endpoints + relation/accord inputs | Existing relation/accord tests | Future graph changes require endpoint validity, score validity, rationale/evidence, approval and `/tmp` validation. |
| Docs/help cleanup | Current-state docs/code help audit | CLI tests if code help changes later | Current-state errors can become candidates; historical docs should not be rewritten only for old state. |
| Generated-artifact lifecycle | Git/worktree policy | Graphify workflow | `graphify-out/*` remains protected/plan-gated and is not taxonomy truth. |
| Safety automation | Existing npm scripts and git checks | Future CI/hook checks | Phase 14 should prefer low-risk guards before curation-heavy work. |

## Standard Stack

No new package installation is recommended.

| Tool | Purpose | Phase 14 Use |
|---|---|---|
| Node.js | Read JSON metrics and run future CLI smoke commands | Read-only metric extraction now; future compile only to `/tmp` after validation/plan approval. |
| npm | Existing `src/package.json` scripts | Future `typecheck`, `test`, `build`, `compile` only when explicitly planned. |
| TypeScript | Strict source/type checks | Existing project stack; no code edits authorized now. |
| Vitest | Existing test runner | Future validation for CLI/default/help or data integrity checks only when planned. |
| Git | Protected diff and staging hygiene | Required after research and any future task. |

Existing scripts from `src/package.json`:

```json
{
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "compile": "node dist/cli/compile.js",
  "compile:quality": "npm run precompile && node dist/cli/compile.js --quality-report",
  "test": "vitest run"
}
```

## Data Structures For Future Artifacts

### `14-BACKLOG-MATRIX.md`

Mandatory matrix fields from `14-CONTEXT.md`:

| Field | Expected Use |
|---|---|
| `id` | Stable row ID, grouped by area, e.g. `RQ-01`, `SOFT-01`, `ALIAS-01`. |
| `area` | One of the Phase 14 discussed areas: review_queue, soft_findings, alias_cleanup, graph_quality, curation_candidates, relations_accords, docs_help, graphify_artifacts, ci_release. |
| `item` | Short backlog item. |
| `source_evidence` | File/report/data source and concise fact; avoid unsupported semantic claims. |
| `impact` | Suggested `low`, `medium`, `high`; must not outrank risk-first policy. |
| `risk` | Suggested `low`, `medium`, `high`; risk wins over impact when conflicted. |
| `risk_reason` | Why mutation, ambiguity, artifact/default safety or validation risk exists. |
| `required_evidence` | Evidence still required before any execution or approval. |
| `mutation_type` | Suggested vocabulary: `none_report_only`, `docs_only`, `test_or_guard_only`, `seed_descriptor`, `alias_add_remove_remap`, `relation_accord`, `official_artifact`, `graphify_generated`, `default_path`, `mixed_or_unknown`. |
| `protected_paths_touched` | Explicit protected paths if future execution would touch them; `none` for report-only rows. |
| `approval_required` | `none`, `plan_approval`, `persisted_curatorial_approval`, `artifact_plan_approval`, or `release_plan_approval`. |
| `validation_required` | Named gate set, e.g. protected diff, target integrity, graph gates, `/tmp` compile, CLI tests, docs current-state grep. |
| `dependencies` | Other rows/artifacts/approvals required first. |
| `suggested_phase` | `phase_14_report_only`, `phase_14_candidate_exception`, `phase_15`, `later`, or `not_in_scope`. |
| `disposition` | Use only allowed top-level dispositions: `candidate_for_phase_14`, `defer_phase_15`, `follow_up_later`, `accepted_with_policy`, `not_in_scope`, `blocker_if_unresolved`. |
| `rationale` | Risk-first conclusion and why the row is or is not actionable now. |

The matrix should have at least these sections:

- Boundary and protected artifact policy.
- Review queue summary row pointing to `14-REVIEW-QUEUE-TRIAGE.md`.
- Soft findings re-disposition.
- Alias cleanup.
- Graph quality.
- Future curation candidates.
- Relations/accords quality.
- Docs/help cleanup.
- Graphify/generated artifacts.
- CI/release safety automation.

### `14-REVIEW-QUEUE-TRIAGE.md`

Required sections:

- Summary metrics.
- `seed_corpus_conflict` triage.
- `corpus_candidate_low_support` triage.
- Traceable sample rows.
- Recommendations.
- Guardrails.

Recommended row schema for grouped triage:

| Field | Expected Use |
|---|---|
| `group_id` | Stable group ID, e.g. `RQ-LS-AMBER-01`. |
| `queue_type` | `corpus_candidate_low_support` or `seed_corpus_conflict`. |
| `grouping_key` | Subfamily, reason, seed descriptor, candidate family or another documented dimension. |
| `count` | Number of matching official queue items. |
| `representative_samples` | 3 to 5 samples with descriptor/subfamily/evidence summary. |
| `actionability` | `manual_review_pack`, `phase_15_candidate`, `accepted_with_policy`, `insufficient_evidence`, `non_actionable`. |
| `risk` | Risk if executed, not merely if observed. |
| `suggested_disposition` | Future recommendation; not authorization. |
| `guardrails` | No promotion/rejection/mutation; required approval/validation if later executed. |

Full line-by-line classification of all 317 items is not required for first triage. Grouping quality and representative samples are the quality gate.

### Optional Manual Review Packs

Do not create optional packs unless future matrix/report shows clear need.

| Optional Artifact | Create Only If | Contents | Must Not Do |
|---|---|---|---|
| `14-ALIAS-MANUAL-REVIEW-PACK.md` | Alias matrix rows require human semantic decision beyond target-integrity classification. | Alias, target, target presence, existing canonical alternatives, prior policy, evidence needed, options, risk. | Add/remove/remap aliases or approve execution. |
| `14-CURATION-MANUAL-REVIEW-PACK.md` | Review queue/candidate inventory yields clear future curation candidates fitting existing endpoints. | Candidate descriptor, proposed family/subfamily fit, corpus evidence, risks, dependencies, required approval fields. | Promote descriptors or mutate seed. |

## Safe Commands To Plan

These commands are safe to describe for future validation/planning. Compile/smoke commands are **future-only** and must not be run until a validation contract and executable plan authorize them.

### Read-only metric extraction

```bash
node -e "const fs=require('fs'); const sim=JSON.parse(fs.readFileSync('data/compiled/v2/similarity_matrix.json','utf8')); console.log(sim.review_queue.length, sim.stats.edge_count)"
```

Use only for read-only analysis. It must not write data, artifacts or temp files.

### Protected diff gate

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

Run before and after any future command that could touch data, official artifacts or defaults.

### Graphify contamination guard

```bash
git status --short -- graphify-out
git diff --name-only -- graphify-out
```

Use as a staging/commit hygiene check only. Do not regenerate, clean, revert, stage or commit `graphify-out/*` unless a separate explicit plan authorizes it.

### Future-only `/tmp` smoke compile shape

Do not execute during research/pattern mapping. If a future validation/plan explicitly authorizes smoke validation, output must go to `/tmp`, not official artifact directories.

```bash
cd src && npm run compile -- \
  --out /tmp/opencode/taxonomy-phase14-smoke/default-v2 \
  --generated-at 2026-01-01T00:00:00.000Z
```

Future explicit v1 fallback shape, also `/tmp` only:

```bash
cd src && npm run compile -- \
  --seed ../data/taxonomy/taxonomy-seed.v1.json \
  --aliases ../data/taxonomy/descriptor_aliases.seed.json \
  --relations ../data/inference/curated_relations.v1.json \
  --accords ../data/inference/accord_map.v1.json \
  --out /tmp/opencode/taxonomy-phase14-smoke/explicit-v1-fallback \
  --version 1.0.0 \
  --generated-at 2026-01-01T00:00:00.000Z
```

## Strategy For Future Triage

1. Build the matrix first, not a shortlist first.
2. Treat every row as report/planning until an explicit plan and approvals exist.
3. Split review_queue details into `14-REVIEW-QUEUE-TRIAGE.md`; the matrix should only summarize and link to it.
4. Use risk-first sorting: protected artifacts/defaults and high-mutation curation defer by default.
5. Reserve Phase 14 execution exceptions for low-mutation, clear-validation, reversible items.
6. Prefer docs/help or safety-guard candidates only if they are current-state, small and non-mutating for protected data/artifacts/defaults.
7. Route real curation, alias mutation, relation/accord changes and review_queue reduction to Phase 15+ unless a persisted approval and explicit allowlist exist.

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Triage document accidentally becomes execution authorization | High | State every artifact is non-authorizing; require future `14-VALIDATION.md`, plan and approval before execution. |
| Review queue actionability becomes auto-promotion | High | Separate group/sample triage from promote/reject/defer; require persisted curatorial approval for any future mutation. |
| Alias target absence becomes automatic delete/remap/add | High | Use evidence-first alias order and target integrity gate; no alias mutation in Phase 14 research. |
| Graph density pressure creates artificial edges | High | Keep coverage-first policy; require existing endpoints, manual score, rationale/evidence and approval. |
| Official artifact overwrite from bare compile | High | Future compile commands must use `/tmp` `--out`; protected diff gate must pass after. |
| `graphify-out/*` contaminates commits | Medium | Check Graphify status before staging/commit; do not stage or mutate without separate artifact plan. |
| Historical docs are rewritten as if stale | Medium | Apply current-state rule; preserve legitimate historical audit trail. |
| Matrix becomes too broad to execute | Medium | Matrix is full-backlog; future shortlist is derived separately and does not replace matrix. |

## Anti-Patterns

- Running `npm run compile` without `--out /tmp/...` in research or triage.
- Editing protected taxonomy, inference, alias, compiled artifact or default-path files while classifying backlog.
- Treating Graphify artifacts as authoritative taxonomy correctness evidence.
- Creating empty manual-review packs only because optional names exist.
- Reducing review_queue numerically without actionability, evidence, approval and before/after validation.
- Marking semantic preference as `blocker_if_unresolved` without integrity, artifact/default safety, rollback, schema, determinism or future validation impact.

## Expected Future Artifacts

| Artifact | Status After This Research | Future Purpose |
|---|---|---|
| `14-BACKLOG-MATRIX.md` | Not created | Mandatory full-backlog triage matrix. |
| `14-REVIEW-QUEUE-TRIAGE.md` | Not created | Dedicated review_queue grouping/sample/recommendation report. |
| `14-ALIAS-MANUAL-REVIEW-PACK.md` | Not created | Optional, only if justified. |
| `14-CURATION-MANUAL-REVIEW-PACK.md` | Not created | Optional, only if justified. |
| `14-VALIDATION.md` | Not created | Future validation contract before executable planning. |
| `14-01-PLAN.md` | Not created | Future specific executable plan if Phase 14 later selects a controlled front. |

## Sources

### Primary

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CONTEXT.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-PREFLIGHT.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DISCUSSION-LOG.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`

### Project Data And Code

- `data/compiled/v2/similarity_matrix.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `src/cli/compile.ts`
- `src/package.json`
- `src/types/inference.ts`
- `src/compiler/review_queue.ts`
- `src/tests/curation/alias_seed_v2.test.ts`
- `src/tests/curation/relation_accord_v2.test.ts`
- `src/tests/curation/taxonomy_seed_v2.test.ts`
- `src/tests/curation/v1_v2_comparison.test.ts`

### Prior Phase Analogs

- `13-RESEARCH.md`
- `13-PATTERNS.md`
- `13-04-RELEASE-CONFIDENCE-CHECKLIST.md`
- `12-RESEARCH.md`
- `12-PATTERNS.md`
- `11-RESEARCH.md`
- `11-PATTERNS.md`
- `11-soft-findings-alias-policy.md`

## Metadata

**Files created by this step:** this file and `14-PATTERNS.md` only.  
**Compile/smoke commands run:** none.  
**Curation/data/artifact mutation:** none intended or authorized.  
**Readiness after research:** `not_ready_for_execution`.
