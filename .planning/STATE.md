---
gsd_state_version: 1.0
milestone: post-v1.0
milestone_name: Post-v1.0 Infrastructure & Curation
status: complete
last_updated: "2026-05-26T21:46:00.000Z"
progress:
  total_phases: 17
  completed_phases: 17
  total_plans: 53
  completed_plans: 53
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-12)

**Core value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.
**Current focus:** Phase 17 complete. Safety guard usability wrapper.

## Phase State

**Current Phase**: 17
**Phase Name**: Safety Guard Usability Wrapper
**Phase Slug**: safety-guard-usability-wrapper
**Phase Status**: complete
**Execution Readiness**: ready_for_execution
**Execution Type**: local_package_wrapper
**Plans Created**: 1
**Plans Completed**: 1
**Artifacts**: 17-CONTEXT.md, 17-DISCUSSION-LOG.md, 17-PREFLIGHT.md, 17-01-PLAN.md, 17-01-SUMMARY.md, 17-VALIDATION.md, 17-CLOSURE.md
**Next Recommended Work**: All phases in this milestone are complete.
**Candidate Policy**: Do not treat corpus candidates as curated descriptors
**Known Limitation**: Phase 11 accepted soft findings remain accepted with policy; they were not claimed resolved by the default switch. graphify-out/* dirty in working tree remains accepted_with_policy.
**Last Activity**: 2026-05-26
**Context File**: .planning/phases/17-safety-guard-usability-wrapper/17-CONTEXT.md
**Discussion File**: .planning/phases/17-safety-guard-usability-wrapper/17-DISCUSSION-LOG.md
**Preflight File**: .planning/phases/17-safety-guard-usability-wrapper/17-PREFLIGHT.md
**Closure File**: .planning/phases/17-safety-guard-usability-wrapper/17-CLOSURE.md

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
- Phase 12 executed the approved staged default switch after persisted final approval and Gates 0 through 6.
- `src/cli/parse_args.ts` now defaults to taxonomy seed v2 inputs, `data/compiled/v2`, and version `2.0.0`.
- `data/compiled/v2` is the official v2 artifact set; `data/compiled/v1` and v1 inputs remain preserved as baseline/archive.
- Rollback to v1 defaults was validated in a temporary context with `rollback_success: true` without deleting v2 artifacts.
- Phase 11 accepted soft findings and the legacy alias exception remain accepted with policy; Phase 12 does not claim they are resolved.
- Phase 13 is closed and complete.
- Phase 13 executed without new taxonomy curation.
- Phase 13 verified consumers, docs, CLI behavior, explicit v1 fallback, v1/v2 artifacts and `graphify-out/*` policy.
- Phase 13 captured post-promotion risks and backlog candidates for a future Phase 14 without executing that backlog.
- Phase 14 context is captured with BACKLOG-D-01 through BACKLOG-D-225. No taxonomy data, compiled artifacts, `src/cli/parse_args.ts`, `graphify-out/*`, curation, descriptor promotion, alias cleanup, relation/accord edits, artifact regeneration or executable planning is authorized yet.
- Phase 14 closed as read-only/report-only execution with `14-01`, `14-02` and `14-03` complete.
- Phase 14 created `14-BACKLOG-MATRIX.md`, `14-REVIEW-QUEUE-TRIAGE.md`, `14-DOCS-HELP-SHORTLIST.md`, `14-SAFETY-AUTOMATION-SHORTLIST.md` and summaries `14-01`, `14-02`, `14-03` only as non-authorizing reports.
- Phase 14 did not create alias or curation manual-review packs because neither was justified.
- Phase 14 did not execute curation, compile/smoke, safety automation implementation or docs/help fixes; Phase 15+ receives any real execution backlog.
- Phase 15 opened in context gathering only with execution readiness `not_ready_for_execution`.
- Phase 15 first priority is safety automation guards; docs/help cleanup remains possible later, preferably as a separate plan.
- Phase 15 context capture does not authorize curation, descriptor promotion, alias add/remove/remap, relation/accord edits, official artifact mutation, `src/cli/parse_args.ts` edits, `graphify-out/*` mutation, compile/smoke, safety automation implementation or docs/help fixes.
- Phase 15 closed as local_proof_only / safety_guard_validation with 15-01 protected diff PASS and Graphify REPORT_AND_FAIL accepted_with_policy, plus 15-02 Graphify staged PASS and protected paths staged PASS.
- `graphify-out/*` dirty in the working tree remains a known issue accepted_with_policy; no Graphify remediation, cleanup, revert, regeneration, staging or commit was performed.
- Phase 15 implemented no permanent safety automation and changed no scripts, package scripts, hooks or CI.
- Phase 15 executed no curation, docs/help fix, compile, smoke, typecheck, tests or build.
- Phase 16 opened in context gathering only with execution readiness `not_ready_for_execution`.
- Phase 16 initial implementation format is `Local script only`: a small versioned non-mutating local script, not a package wrapper, Git hook or CI check.
- Phase 16 first guard scope is staged `graphify-out/*`, staged protected paths and protected diff boundary; dirty `graphify-out/*` in the working tree remains accepted_with_policy and must not block unless staged.
- Phase 16 context capture does not authorize curation, taxonomy seed changes, alias changes, relation/accord changes, official artifact mutation, `DEFAULT_PATHS` changes, `src/cli/parse_args.ts` edits, `graphify-out/*` mutation, docs/help fixes or compile/smoke/typecheck/tests/build.
- Phase 16 implemented `scripts/check-safety-guards.sh` as a permanent non-mutating local script protecting staged `graphify-out/*`, staged protected paths, and working-tree protected diffs.
- Real-repo PASS proof and /tmp failure simulations for GRAPHIFY_STAGED, PROTECTED_PATH_STAGED, PROTECTED_DIFF, report_all multi-violation, and dirty-working-tree-allowed BONUS scenario are documented in `16-01-SUMMARY.md`.
- Phase 16 closed without altering package scripts, Git hooks, CI, `src/package.json`, protected data/seed/compiled paths, or `graphify-out/*`.
- `graphify-out/*` dirty in working tree remains `accepted_with_policy`; no cleanup, revert, regeneration, staging or commit was performed.
- [Phase 17]: O wrapper de usabilidade no package.json será registrado como `safety:guard`, executando `bash ../scripts/check-safety-guards.sh`. Ele deve preservar o exit code do script original sem alterar hooks, CI, Graphify, data/taxonomy, data/inference, data/compiled/v1, data/compiled/v2 ou src/cli/parse_args.ts.

### Roadmap Evolution

- Phase 13 added: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption
- Phase 14 closed: Taxonomy v2.1 Backlog Triage & Curation Planning, read-only/report-only.
- Phase 15 closed: Post-Triage Safety Guards & Current-State Docs Cleanup, local_proof_only safety guard validation.
- Phase 16 closed: Permanent Safety Guard Implementation, local_script_only; `scripts/check-safety-guards.sh` delivered and validated.
- Phase 17 added: Safety Guard Usability Wrapper, local_package_wrapper.

## Last Session

- **Stopped At**: Milestone post-v1.0 complete.
- **Resume File**: (empty)

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
| 12. Taxonomy Seed v2 Default Switch Execution | ✅ Complete / Closed | 2026-05-25 |
| 13. Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption | ✅ Complete / Closed | 2026-05-25 |
| 14. Taxonomy v2.1 Backlog Triage & Curation Planning | ✅ Complete / Closed / Read-only report-only | 2026-05-26 |
| 15. Post-Triage Safety Guards & Current-State Docs Cleanup | ✅ Complete / Closed / Local proof-only safety guard validation | 2026-05-26 |
| 16. Permanent Safety Guard Implementation | ✅ Complete / Closed / Local script only | 2026-05-26 |
| 17. Safety Guard Usability Wrapper | ✅ Complete / Closed / Local package wrapper | 2026-05-26 |

## Active Phase

| Phase | Status | Execution Readiness | Plans |
|-------|--------|---------------------|-------|
| (none) | — | — | — |

## Workstreams

- Milestone complete.

## Post-v1 Findings Backlog

- See `.planning/future/DATA-QUALITY-INFERENCE-HARDENING.md` (Data Quality).
- See `.planning/future/POST-V1-RELEASE-BACKLOG.md` (Post-v1.0 Infrastructure & Curation).

Status: Ready to execute

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
