# Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning - Context

> **Canonical decisions document.** Extracted from `11-DISCUSSION-LOG.md` after all 9 initial discussion areas were covered.
> This document is the authoritative input for future research, planning and execution agents.

**Date:** 2026-05-24
**Phase:** 11-taxonomy-seed-v2-promotion-readiness-default-migration
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision count:** 53 (PROMO-D-01 through PROMO-D-53)

---

## Phase Boundary

Phase 11 evaluates readiness for a possible future promotion of `taxonomy-seed.v2.json` and plans controlled migration/rollback. It does not execute v2 promotion.

### Hard Constraints

- v2 remains candidate-only in Phase 11.
- No executable plan exists yet.
- No code changes are authorized.
- No seed/data changes are authorized.
- No compiled artifact changes are authorized.
- `DEFAULT_PATHS` must not be changed in Phase 11.
- No official `data/compiled/v2` is created in Phase 11.
- `data/compiled/v1/` remains protected baseline/archive.
- `taxonomy-seed.v1.json`, `curated_relations.v1.json` and `accord_map.v1.json` remain protected.
- Any real default switch requires a separate future phase/plan with final persisted human approval.

### Post-Phase 10 Baseline

| Metric | V1 | V2 Round 3 Candidate |
|--------|----|----------------------|
| Families | 3 | 10 |
| Subfamilies | 6 | 18 |
| Seed descriptors | 21 | 39 |
| Total compiled descriptors | 177 | 303 |
| Review queue | 427 | 317 |
| Input relations | 6 | 14 |
| Input accords | 5 | 19 |
| Compiled graph edges | 6 | 13 |

Validated post-Phase 10 facts:

- hard failures: none
- deterministic v2 compile via repeated `cmp -s`
- curation tests passed: 5 files, 28 tests
- protected v1/default files intact
- isolated subfamilies = 0
- v2 remains candidate-only

Known soft findings:

- `ylang ylang -> ylang_ylang` target absent
- graph density lower
- zero-frequency seeds inherited from v1
- review_queue still has 317 items
- `seed_corpus_conflict` increased
- pending/deferred candidates remain

---

## 1. Readiness Criteria

Phase 11 requires a strict readiness checklist before any future default switch.

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

Decisions:

- PROMO-D-01: Phase 11 will use a strict readiness checklist before any default switch.
- PROMO-D-02: Zero hard failures, determinism, curation traceability and final human approval are hard requirements.
- PROMO-D-03: Soft findings may be accepted only if they have explicit policy and documented disposition.
- PROMO-D-04: Migration plan and rollback plan are mandatory before promoting v2.
- PROMO-D-05: Phase 11 must not promote v2 automatically only because Phase 10 passed.

---

## 2. Soft Findings Policy

Soft findings do not become blockers automatically, but none may remain implicit. Every soft finding must have one disposition:

- `blocker_before_promotion`
- `accepted_with_policy`
- `follow_up_after_promotion`

Disposition rules:

- Findings affecting correctness, reversibility, authoritative aliases, default behavior or traceability may become blockers.
- Known, limited and documented findings with explicit policy may be accepted.
- Findings that do not block switch but remain curation work become follow-up.

Specific soft finding dispositions:

| Finding | Disposition | Policy |
|---------|-------------|--------|
| `ylang ylang -> ylang_ylang` absent target | `accepted_with_policy` only with legacy alias exception; otherwise blocker | Must be explicit and auditable |
| lower graph density | `accepted_with_policy` | Allowed if `isolated_subfamilies = 0` and coverage is documented |
| inherited zero-frequency seeds | `accepted_with_policy` | List as accepted legacy; new zero-frequency without rationale blocks |
| review_queue 317 | `accepted_with_policy` plus `follow_up_after_promotion` | Must be smaller/more actionable than v1 and have no blocker types without disposition |
| increased `seed_corpus_conflict` | `accepted_with_policy` | Accepted when tied to curated seed truth with approval/rationale/evidence |
| pending/deferred candidates | `follow_up_after_promotion` | Must not contaminate authoritative artifacts |

Final soft findings table must include `finding_id`, `description`, `affected_area`, `disposition`, `rationale`, `required_policy`, `promotion_blocker` and optional `follow_up_phase`.

Decisions:

- PROMO-D-06: Soft findings require documented disposition before any promotion.
- PROMO-D-07: `ylang ylang -> ylang_ylang` target absent will be treated as `accepted_with_policy` only if there is an explicit legacy alias exception; otherwise it becomes `blocker_before_promotion`.
- PROMO-D-08: Low graph density can be `accepted_with_policy` if `isolated_subfamilies = 0` and every subfamily has relation/accord coverage or approved gap.
- PROMO-D-09: Zero-frequency seeds inherited from v1 do not block promotion if documented as accepted legacy; new zero-frequency seeds without rationale block promotion.
- PROMO-D-10: Remaining review queue can be `accepted_with_policy` if it is smaller or more actionable than v1 and has no blocker types without disposition.
- PROMO-D-11: Increased `seed_corpus_conflict` is acceptable if caused by curated seed truth with persisted approval/rationale/evidence.
- PROMO-D-12: Remaining pending/deferred candidates do not block promotion if they do not contaminate authoritative artifacts and are documented as follow-up.
- PROMO-D-13: V2 promotion requires a final soft findings table with explicit disposition.
- PROMO-D-14: No soft finding may remain without disposition at the time of default switch.

---

## 3. Alias Readiness

Phase 11 adopts a formal legacy alias exception policy.

Rules:

- New aliases with absent targets are hard blockers.
- Round 3+ aliases must point to canonical targets present in seed v2.
- Alias candidate/review-only entries must never enter `descriptor_aliases.json`.
- Legacy aliases with absent targets are allowed only in an explicit, auditable exception list.
- Each exception needs rationale, disposition and follow-up.

`ylang ylang -> ylang_ylang` is accepted only as explicit legacy exception. Do not add `ylang_ylang` to seed v2 only to satisfy the alias. Do not remove or remap it automatically. Resolve in a future floral/exotic-floral/ylang cleanup phase.

Default switch can proceed with this absent target only if the exception list exists, the alias is listed, the report marks it `accepted_with_policy`, no new absent-target aliases exist, and tests distinguish accepted legacy aliases from invalid new aliases.

Decisions:

- PROMO-D-15: Phase 11 will adopt a legacy alias exception policy for authoritative aliases with absent targets.
- PROMO-D-16: New aliases with absent targets are hard blockers for promotion.
- PROMO-D-17: `ylang ylang -> ylang_ylang` will be accepted only as an explicit and auditable legacy exception.
- PROMO-D-18: V2 promotion will not require adding `ylang_ylang` to the seed, removing the alias, or remapping the alias in this phase.
- PROMO-D-19: The exception list must differentiate accepted legacy aliases from invalid new aliases.
- PROMO-D-20: Resolving `ylang ylang -> ylang_ylang` remains future alias/floral cleanup follow-up.

---

## 4. Graph Readiness

Graph readiness is based on coverage over density.

Minimum criteria:

- `isolated_subfamilies = 0`
- every subfamily has approved relation, approved accord, approved `relation_gap`, or approved `accord_gap`
- every edge has existing source and target endpoints
- every edge has manual score in `[0,1]`
- no placeholder `score: 0`
- no edge without workbook approval/rationale/evidence
- low graph density is documented as soft finding, if applicable

Hard blockers:

- `isolated_subfamilies > 0` without approved gap
- edge with missing endpoint
- edge without approval/rationale/evidence
- score outside `[0,1]`
- placeholder `score: 0`
- heuristic relation/accord without curation

Decisions:

- PROMO-D-21: Graph readiness will be based on coverage over density.
- PROMO-D-22: `isolated_subfamilies = 0` is a hard requirement for default switch.
- PROMO-D-23: Every subfamily needs an approved relation/accord or explicit approved gap.
- PROMO-D-24: Low graph density is a soft finding if there are no isolated subfamilies and coverage is documented.
- PROMO-D-25: Phase 11 must not create artificial edges only to increase density.
- PROMO-D-26: Every graph edge needs existing endpoints, manual score in `[0,1]`, approval/rationale/evidence and no placeholder score 0.

---

## 5. Review Queue Readiness

Review queue readiness is based on distribution/severity, not a fixed threshold.

Minimum criteria:

- v2 review_queue total is less than or equal to v1, or has explicit justification if not lower
- severity distribution is documented
- review types are documented
- no hard/blocker type remains without disposition
- `seed_corpus_conflict` has rationale when linked to curated seed truth
- remaining `corpus_candidate_low_support` may stay as backlog if it does not contaminate authoritative artifacts
- pending/deferred candidates cannot enter seed/alias/relation/accord without approval
- final report separates blockers, accepted-with-policy and follow-up items

Current interpretation:

- v1 review_queue: 427
- v2 review_queue: 317
- delta: -110
- `corpus_candidate_low_support`: 410 -> 284
- `seed_corpus_conflict`: 17 -> 33

Decisions:

- PROMO-D-27: Review queue readiness will be based on distribution/severity gate, not fixed threshold.
- PROMO-D-28: Remaining queue can be accepted if it is smaller or more actionable than v1 and has no blocker types without disposition.
- PROMO-D-29: Increased `seed_corpus_conflict` can be `accepted_with_policy` when caused by curated seed truth with approval/rationale/evidence.
- PROMO-D-30: Remaining `corpus_candidate_low_support` can become `follow_up_after_promotion` if it does not contaminate authoritative artifacts.
- PROMO-D-31: No review_queue item classified as blocker may remain without disposition before default switch.

---

## 6. Default Switch Strategy

Phase 11 is readiness/migration planning only. It will not execute the switch.

Phase 11 must not:

- alter `DEFAULT_PATHS`
- change CLI default behavior
- replace `data/compiled/v1`
- create official `data/compiled/v2`, except as documented proposal
- promote v2 automatically even if readiness gates pass

Phase 11 should produce:

- readiness audit
- migration plan
- rollback plan
- expected diffs for future promotion
- pre-switch and post-switch validation commands
- recommendation: `ready_for_promotion` or `not_ready`

Future execution may alter `src/cli/parse_args.ts`, default seed/relation/accord paths, default version to `2.0.0`, output dir strategy, CLI docs and release notes.

Decisions:

- PROMO-D-32: Phase 11 is readiness/migration planning only and will not execute default switch.
- PROMO-D-33: The real default switch requires a separate phase/plan with final human approval.
- PROMO-D-34: Phase 11 must document expected diffs, migration commands, validation commands and rollback commands.
- PROMO-D-35: `DEFAULT_PATHS`, CLI behavior and `data/compiled/v1` remain unchanged during Phase 11.
- PROMO-D-36: Even if readiness passes, v2 can become default only in a separate future execution.

---

## 7. Generated Artifacts Strategy

Future promotion should publish official versioned v2 artifacts.

Rules:

- future promotion creates `data/compiled/v2`
- `data/compiled/v1` remains baseline/archive
- promotion must not overwrite `data/compiled/v1`
- v1 inputs remain available for rollback
- `data/compiled/v2` is not created during Phase 11 context gathering
- v1/v2 must remain compilable side by side with fixed `generated_at`

Expected future structure:

- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Decisions:

- PROMO-D-37: The recommended future strategy is to publish official artifacts in `data/compiled/v2`.
- PROMO-D-38: `data/compiled/v1` will be preserved as baseline/archive and must not be overwritten.
- PROMO-D-39: Phase 11 will not create `data/compiled/v2`; it will only document the strategy.
- PROMO-D-40: Creating `data/compiled/v2` requires a future phase/plan with final human approval.
- PROMO-D-41: Future promotion must keep explicit commands to compile v1 and v2 side by side.
- PROMO-D-42: Rollback must restore defaults to v1 and validate preserved v1 artifacts.

---

## 8. Rollback Strategy

Rollback must be documented and validatable before any default switch.

Rollback requirements:

- git-only rollback is not sufficient
- clear rollback commands are required
- rollback restores v1 defaults
- rollback validates v1 inputs and artifacts are preserved
- rollback is testable before switch
- no v2 promotion without approved rollback plan

Rollback must restore:

- `seedPath` to `data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath` to `data/inference/curated_relations.v1.json`
- `accordsPath` to `data/inference/accord_map.v1.json`
- `outputDir` to `data/compiled/v1`
- `version` to `1.0.0`

Rollback validation requires compile v1 pass, tests pass, `DEFAULT_PATHS` point to v1, v1 artifacts exist, v2 is no longer default, and no protected v1 file was deleted.

Decisions:

- PROMO-D-43: Phase 11 will require documented and validatable rollback before any default switch.
- PROMO-D-44: Git-only rollback is not accepted as the primary strategy.
- PROMO-D-45: Rollback must restore `DEFAULT_PATHS` to v1 and validate preserved v1 inputs/artifacts.
- PROMO-D-46: Future promotion can execute only if the plan includes rollback commands and rollback validation.
- PROMO-D-47: `data/compiled/v1` and v1 inputs must remain available for rollback.

---

## 9. Validation Gates

Future v2 promotion requires a full hard/soft gate set.

Hard gate groups:

- technical gates: typecheck, tests, build, compile, schema, quality gates, determinism
- curation traceability gates: all curated changes approved or inherited; no auto-promotion
- alias gates: no new absent targets; legacy exceptions explicit
- graph gates: no isolated subfamilies; approved-or-gap coverage; valid edges/scores
- review queue gates: distribution/severity documented; no blocker without disposition
- protected files/default drift gates: v1 inputs and compiled baseline preserved; defaults change only in approved plan
- migration gates: expected diffs, changed files, promotion commands, post-switch validation and artifact strategy documented
- rollback gates: documented/testable rollback with v1 restorable
- human approval gate: final persisted approval required; chat approval is insufficient

Soft gates requiring disposition:

- low graph density
- high remaining review_queue
- increased `seed_corpus_conflict`
- inherited zero-frequency seeds
- remaining pending/deferred candidates
- legacy alias exceptions
- future curation backlog

Required release checklist:

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

Decisions:

- PROMO-D-48: Future v2 promotion requires a full hard/soft gate set.
- PROMO-D-49: Technical gates are necessary but insufficient without curation, alias, graph, migration and rollback gates.
- PROMO-D-50: No soft finding may remain without disposition before default switch.
- PROMO-D-51: Validatable rollback and final human approval are hard gates.
- PROMO-D-52: Expected diffs and migration commands are mandatory before altering `DEFAULT_PATHS`.
- PROMO-D-53: Promotion can occur only when hard gates pass and soft gates are explicitly accepted, blocked or assigned follow-up.

---

## Expected Phase 11 Output After Future Planning

Phase 11 may later produce readiness/migration planning artifacts, but not executable implementation yet. Future planning should result in:

- readiness audit with strict checklist result
- final soft findings table with disposition
- legacy alias exception policy/list
- graph coverage assessment
- review queue distribution/severity assessment
- migration/default switch plan proposal
- generated artifacts strategy for official `data/compiled/v2`
- rollback plan with commands
- validation/release checklist
- recommendation: `ready_for_promotion` or `not_ready`

No default switch is authorized by this context.
