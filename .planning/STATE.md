---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Phase 12 context_captured / not_ready_for_execution
last_updated: "2026-05-24T13:00:00Z"
progress:
  total_phases: 12
  completed_phases: 11
  total_plans: 36
  completed_plans: 36
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-12)

**Core value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.
**Current focus:** Phase 12 context captured — controlled and reversible taxonomy seed v2 default switch execution remains not ready for execution. v2 remains candidate-only and defaults remain v1.

## Phase State

**Current Phase**: 12
**Phase Name**: Taxonomy Seed v2 Default Switch Execution
**Phase Slug**: 12-taxonomy-seed-v2-default-switch-execution
**Phase Status**: context_captured
**Execution Readiness**: not_ready_for_execution
**Plans Created**: 0
**Plans Completed**: 0
**Artifacts**: Phase 12 discussion log, preflight and canonical context file. No executable plan, research, patterns, validation, final approval, code change, seed/data change, compiled artifact change, `DEFAULT_PATHS` change, official `data/compiled/v2`, or v2 promotion exists.
**Next Recommended Work**: Non-executable planning/research when authorized; do not execute default switch.
**Candidate Policy**: Do not treat corpus candidates as curated descriptors
**Known Limitation**: v2 seed remains candidate-only; Phase 12 context gathering does not authorize promotion.
**Last Activity**: 2026-05-24
**Context File**: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md
**Discussion File**: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-DISCUSSION-LOG.md
**Preflight File**: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-PREFLIGHT.md
**Research File**: not created yet
**Patterns File**: not created yet
**Validation File**: not created yet

## Decisions

- Phase 5 semantic noise is an explicit versioned data input passed through pure-function options.
- Phase 5 corpus-derived descriptors and clusters stay reviewable candidates and never mutate curated seed truth.
- Curated tradition and accord data remain explicit function inputs and versioned JSON files; calculators do not import data constants.
- Missing accord/tradition entries return undefined/neutral, not 0, preserving downstream renormalization semantics.
- Alias candidates are emitted only as weak evidence with canonical ids unchanged.
- Final scoring renormalizes over dimensions whose score is present; missing tradition or accord remains neutral rather than zero.
- Sparse graph eligibility is a strict final_score > 0.25 helper outside individual dimension calculators.
- Phase 5 graph edge contracts preserve score as a compatibility alias for final_score.
- Sparse similarity graph generation stores review_queue inside SimilarityGraph and uses deterministic generated_at defaults.
- Compile pipeline remains pure until CLI resolves generatedAt and writer performs filesystem output.
- Default CLI data paths keep documented parser defaults but resolve to ../data when run from the src package.
- Post-Phase 6 semantic findings do not invalidate v1 technical completion: `data/compiled/v1/` artifacts are deterministic, schema-valid and CLI-compilable.
- Phase 7 plan 07-03 added conservative placement scoring gates and deterministic merged review queue population in similarity output.
- compileTaxonomy now returns taxonomy plus placement_review_queue for deterministic downstream merge.
- Seed expansion in Phase 7 remains review-only via seed_taxonomy_gap_suggestion items and does not mutate seed hierarchy.
- Corpus-derived descriptors remain review-required candidates until descriptor sanitation, stronger placement scoring and curated review inputs are addressed.
- Curated aliases should be treated as future pre-analysis canonicalization inputs, not only final compiled alias outputs.
- Empty curated relation/accord inputs can validly produce an empty similarity graph, but future curation should bootstrap positive inputs and review warnings.
- Phase 7 must preserve seed taxonomy as curated truth, keep corpus candidates review-required, keep alias candidates as weak evidence only, preserve deterministic artifacts, add no runtime dependencies, and keep TypeScript strict/pure-function patterns.
- Canonicalization accepts curated alias seed/map only and remains isolated from alias candidates.
- Alias-candidate generation receives aliasSeed exclusion input but remains weak evidence only.
- Curated relation and accord v1 files are manually bootstrapped with locked records; no heuristic generation is allowed.
- compileAll now merges schema validation with runtime semantic quality gates before writeCompileResults can persist artifacts.
- compile:quality remains console-only and does not create sidecar artifact files.
- Similarity graph matching now uses simple `subfamily_id` values for curated relation and accord inputs, fixing the empty graph caused by `family:subfamily` internal IDs.
- Graph-empty curated-input failures are visible as high-severity `graph_empty_with_curated_inputs` review items when they occur.
- Phase 8 is a separate manual curation phase from Phase 7 pipeline hardening.
- Phase 8 starts in context gathering only; no executable plan, implementation, code change or compiled artifact change is authorized by registration.
- Phase 8 must preserve seed authority, review-only corpus evidence and zero auto-promotion.
- Phase 8 context captured CUR-D-01 through CUR-D-75; planning/research may proceed, but execution remains unauthorized until a plan exists and is approved.
- Seed v2 includes only persisted approved approval-001 gourmand/vanilla/vanilla.
- CLI/compiler defaults remain pointed at data/taxonomy/taxonomy-seed.v1.json; v2 remains explicit-path only.
- No aliases were added in 08-03 because candidate-review.md contains no approved primary_disposition: add_alias block.
- descriptor_aliases.seed.json was preserved unchanged in 08-03; pending aliases, secondary hypotheses, frequency evidence, and review_queue evidence were not promoted.
- V2 relation and accord companion inputs retain applicable manual v1 bootstrap records; no relation/accord score was added for `vanilla` without explicit curatorial approval.
- Missing relation/accord coverage for the new v2 `vanilla` subfamily is documented as gap rationale and remains neutral/undefined, not score 0.
- Alias target mismatches against minimal `taxonomy-seed.v2.json` are a soft 08-05 alias-quality finding only; do not alter legacy aliases or v2 descriptors without curatorial approval.
- Phase 09 Plan 03 applied only approved Round 2 relation/accord records with existing seed v2 endpoints; fresh_spice links remain pending because fresh_spice is absent.
- Phase 09 Plan 04 validated v2-expanded side-by-side against v1 using 10 metrics, found zero hard failures, and confirmed v2 remains candidate-only with CLI defaults and protected v1 artifacts unchanged.
- fresh_spice remains deferred because no approved seed endpoint exists, while vanilla is partially resolved through warm_spice relation/accord coverage.
- Phase 10 started in context gathering only; planning is now complete, but no implementation, code change, seed/data change or compiled artifact change is authorized before approval and final preflight.
- Phase 10 uses Phase 9 as baseline: v2-expanded has 7 families, 13 subfamilies, 32 seed descriptors, review_queue 331, relation_count 11 and accord_count 10.
- Phase 10 must not promote v2 to default, edit `taxonomy-seed.v1.json`, overwrite `data/compiled/v1/`, promote corpus/review_queue automatically, alter `DEFAULT_PATHS`, or alter aliases/relations/accords without workbook approval/rationale/evidence.
- Phase 10 context captured R3-D-01 through R3-D-52; planning/research completed with verified plans, and execution remains unauthorized until plans/workbook approvals and final preflight are approved.
- Phase 10 created and executed exactly four approved plans (10-01 through 10-04); final validation passed with zero hard failures and v2 remained candidate-only.
- Phase 10 Plan 02 applied only complete approved Round 3 seed approvals and kept pending/generic/deferred candidates absent.
- Phase 10 Plan 02 added only approved r3-alias-cleanup-001 musky -> musk because canonical musk exists in candidate v2.
- [Phase 10]: Phase 10 Plan 03 applied only complete approved Round 3 relation records with existing v2 endpoints; all pending relation proposals remain absent.
- [Phase 10]: Phase 10 Plan 03 applied only complete approved Round 3 accord records with existing v2 endpoints; all pending accord proposals remain absent.
- [Phase 10]: No Round 3 relation_gap or accord_gap entries were needed because amber, balsamic_resin, musky, leathery, and fresh_spice all have approved relation and accord coverage.
- [Phase 10]: Phase 10 Plan 04 validated v2 Round 3 candidate side-by-side against v1 using temporary compile outputs, found zero hard failures, and confirmed v2 remains candidate-only with protected v1/default files unchanged.
- Phase 11 context is captured with PROMO-D-01 through PROMO-D-53; no executable plan, implementation, code change, seed/data change, compiled artifact change, `DEFAULT_PATHS` change, official `data/compiled/v2`, or v2 promotion is authorized by context capture.
- Phase 11 uses Phase 10 as baseline: v2 Round 3 candidate has 10 families, 18 subfamilies, 39 seed descriptors, 303 total compiled descriptors, review_queue 317, input relation_count 14, input accord_count 19, compiled graph edges 13, and zero hard failures.
- Phase 11 decisions use IDs `PROMO-D-01` through `PROMO-D-53`.
- Phase 11 planning is complete with exactly five documentation-only plans: 11-01 readiness audit, 11-02 soft findings/legacy alias policy, 11-03 graph/review queue readiness, 11-04 migration/default-switch proposal, and 11-05 rollback/validation/release gates. The plans do not authorize default switch, `DEFAULT_PATHS` changes, official `data/compiled/v2`, or code/data/artifact mutation.
- Phase 11 closed in commit `1f31b76 docs(phase-11): close validation for documentation-only execution` after readiness audit, soft findings disposition, legacy alias exception policy, graph/review readiness, migration/default-switch proposal, rollback validation and release gates were documented.
- Phase 12 starts in context gathering only and uses Phase 11 as mandatory baseline; decision IDs must use `SWITCH-D-01`, `SWITCH-D-02`, `SWITCH-D-03`, and so on.
- Phase 12 is potentially executable in the future, but no execution is authorized during context gathering. Do not alter `src/cli/parse_args.ts`, `data/compiled/v1`, `data/compiled/v2`, taxonomy seed files, curated relation/accord files, `descriptor_aliases.seed.json`, compiled artifacts, code, `DEFAULT_PATHS`, or defaults.
- Any future Phase 12 default switch requires persisted human approval before mutation; chat approval alone is insufficient.
- Phase 12 context is captured with `SWITCH-D-01` through `SWITCH-D-64`; execution readiness remains `not_ready_for_execution`, plans remain none, and implementation remains unauthorized.

## Last Session

- **Stopped At**: Captured Phase 12 canonical context for controlled taxonomy seed v2 default switch execution.
- **Resume File**: .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md

## Completed Phases

| Phase | Status | Date |
|-------|--------|------|
| 1. Foundation | ✅ Complete | 2026-05-13 |
| 2. Data Loaders | ✅ Complete | 2026-05-13 |
| 3. Normalization Pipeline | ✅ Complete | 2026-05-17 |
| 4. Corpus Analysis | ✅ Complete | 2026-05-18 |
| 5. Inference Engine | ✅ Complete | 2026-05-19 |
| 6. Compilation & CLI | ✅ Complete | 2026-05-21 |
| 7. Data Quality & Inference Hardening | ✅ Complete | 2026-05-22 |
| 8. Taxonomy Seed Expansion & Curation | ✅ Complete / Verified | 2026-05-23 |
| 9. Taxonomy Seed v2 Expansion Round 2 | ✅ Complete / Verified | 2026-05-23 |
| 10. Taxonomy Seed v2 Expansion Round 3 | ✅ Complete / Verified | 2026-05-24 |
| 11. Taxonomy Seed v2 Promotion Readiness & Default Migration Planning | ✅ Complete / Documentation-only | 2026-05-24 |

## Active Phase

| Phase | Status | Execution Readiness | Plans |
|-------|--------|---------------------|-------|
| 12. Taxonomy Seed v2 Default Switch Execution | context_captured | not_ready_for_execution | 0/0 |

## Workstreams

- Phase 12 has captured final approval, readiness revalidation, expected diffs, `DEFAULT_PATHS` switch, official `data/compiled/v2` publication, protected v1 preservation, rollback execution, docs/release notes, validation gates and commit strategy. v2 remains candidate-only.

## Post-v1 Findings Backlog

See `.planning/future/DATA-QUALITY-INFERENCE-HARDENING.md`.

Status: Phase 12 context_captured / not_ready_for_execution

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 09-taxonomy-seed-v2-expansion-round-2 | 01 | 40min including checkpoint wait | 2 | 2 |
| 09-taxonomy-seed-v2-expansion-round-2 | 02 | 4min | 2 | 3 |
| 09-taxonomy-seed-v2-expansion-round-2 | 03 | 2min 18s | 2 | 3 |
| 09-taxonomy-seed-v2-expansion-round-2 | 04 | 3m21s | 4 | 2 |
| 10-taxonomy-seed-v2-expansion-round-3 | 02 | 3m25s | 2 | 5 |
| 10-taxonomy-seed-v2-expansion-round-3 | 03 | 3m21s | 2 | 3 |
| 10-taxonomy-seed-v2-expansion-round-3 | 04 | 13min | 3 | 3 |
