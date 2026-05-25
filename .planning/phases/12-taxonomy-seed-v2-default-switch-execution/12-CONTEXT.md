# Phase 12: Taxonomy Seed v2 Default Switch Execution - Context

> **Canonical decisions document.** Extracted from `12-DISCUSSION-LOG.md`, `12-PREFLIGHT.md` and `12-DISCUSS-CHECKPOINT.json` after all Phase 12 context-gathering areas were covered.
> This document is the authoritative input for future research, planning and execution agents.

**Date:** 2026-05-24
**Phase:** 12-taxonomy-seed-v2-default-switch-execution
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision count:** 64 (`SWITCH-D-01` through `SWITCH-D-64`)

---

## 1. Phase Boundary

Phase 12 is the controlled execution phase for a future default switch from taxonomy seed v1 defaults to taxonomy seed v2 defaults. During context gathering, no execution is authorized.

Current boundary:

- v2 has not been promoted.
- `DEFAULT_PATHS` continue pointing to v1.
- `data/compiled/v2` does not exist.
- `data/compiled/v1` remains the baseline/archive.
- v1 inputs remain protected.
- v2 inputs must not be altered in this phase.
- No executable plan exists yet.
- No code change, seed/data input change, compiled artifact change, artifact publication, rollback execution or default switch is authorized by this context.

Protected context-gathering boundary:

- Do not create `12-01-PLAN.md` during context capture.
- Do not create `12-RESEARCH.md` during context capture.
- Do not create `12-PATTERNS.md` during context capture.
- Do not create `12-VALIDATION.md` during context capture.
- Do not create `12-FINAL-APPROVAL.md` during context capture.
- Do not create `data/compiled/v2` during context capture.
- Do not alter `DEFAULT_PATHS` during context capture.
- Do not promote v2 during context capture.

---

## 2. Post-Phase 11 Baseline

Phase 11 closed in commit:

- `1f31b76 docs(phase-11): close validation for documentation-only execution`

Phase 11 produced documentation-only readiness and migration planning outputs:

- readiness audit
- soft findings disposition
- legacy alias exception policy
- graph/review readiness
- migration/default-switch proposal
- rollback validation and release gates

Technical baseline from Phase 11:

| Metric | V2 Candidate |
|--------|--------------|
| Families | 10 |
| Subfamilies | 18 |
| Seed descriptors | 39 |
| Total compiled descriptors | 303 |
| Review queue | 317 |
| Input relations | 14 |
| Input accords | 19 |
| Compiled graph edges | 13 |
| Isolated subfamilies | 0 |
| Hard failures | none in last comparison report |

Known baseline facts:

- Previous v2 compile was deterministic.
- Previous curation tests passed.
- v2 remains candidate-only.
- `DEFAULT_PATHS` remain v1.
- Official `data/compiled/v2` does not exist.
- `data/compiled/v1` remains baseline/archive.

---

## 3. Final Approval Policy

Phase 12 requires final persisted human approval before any mutation. Approval must be recorded in:

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`

Approval in chat is insufficient. No mutable plan may execute before this file exists and explicitly approves the default switch, `data/compiled/v2` publication, accepted soft findings and rollback requirement.

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

Decisions:

- `SWITCH-D-01`: Phase 12 will require persisted final human approval before any mutation.
- `SWITCH-D-02`: Final approval will be recorded in `12-FINAL-APPROVAL.md`.
- `SWITCH-D-03`: Chat approval will not be sufficient to authorize the default switch.
- `SWITCH-D-04`: `12-FINAL-APPROVAL.md` must explicitly approve default switch, publication of `data/compiled/v2`, acceptance of soft findings and rollback requirement.
- `SWITCH-D-05`: No mutable plan may execute before persisted final approval exists.

---

## 4. Readiness Revalidation

Phase 12 requires full pre-switch revalidation before any mutation. Phase 10/11 evidence is historical baseline only and does not replace current validation.

Required temporary paths:

- `/tmp/opencode/taxonomy-phase12-switch/v1-baseline`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`

Required policy:

- v1 and v2 must compile in explicit temporary paths.
- v2 determinism must be revalidated with repeat compile and `cmp -s`.
- Any hard gate failure blocks publication and default switch.
- `data/compiled/v2` must remain nonexistent until official publication.

Decisions:

- `SWITCH-D-06`: Phase 12 will require full pre-switch revalidation before any mutation.
- `SWITCH-D-07`: Phase 10/11 evidence is historical baseline, not a substitute for current validation.
- `SWITCH-D-08`: v1 and v2 must be compiled in explicit temporary paths before publication/default switch.
- `SWITCH-D-09`: v2 determinism must be revalidated with repeat compile and `cmp -s`.
- `SWITCH-D-10`: Any hard gate failure blocks artifact publication and `DEFAULT_PATHS` switch.
- `SWITCH-D-11`: `data/compiled/v2` must remain nonexistent until the official publication step.

---

## 5. Expected Diffs

Allowed future diffs after required approval and gates:

- Phase 12 docs, tracking, summaries and validation reports.
- `12-FINAL-APPROVAL.md`.
- `data/compiled/v2/taxonomy.json`.
- `data/compiled/v2/descriptor_aliases.json`.
- `data/compiled/v2/similarity_matrix.json`.
- `src/cli/parse_args.ts` only for approved `DEFAULT_PATHS` fields.
- README, CLI docs or release notes if needed.
- Tests only if strictly necessary to reflect v2 default and explicit v1 fallback.

Protected/no-edit paths:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- `graphify-out/*`, unless a separate explicit plan authorizes it

Decisions:

- `SWITCH-D-12`: Phase 12 will use a minimal controlled diff set.
- `SWITCH-D-13`: v1 inputs, v2 inputs, `descriptor_aliases.seed.json` and `data/compiled/v1` are protected/no-edit.
- `SWITCH-D-14`: `data/compiled/v2` will be the only new official artifact set allowed.
- `SWITCH-D-15`: `src/cli/parse_args.ts` may change only in the approved `DEFAULT_PATHS` fields.
- `SWITCH-D-16`: Docs, tracking, summaries and validation reports may change to reflect promotion.
- `SWITCH-D-17`: Any diff outside the allowlist is a blocker and requires human review.

---

## 6. DEFAULT_PATHS Switch

The future `DEFAULT_PATHS` switch must be atomic. All five fields must change together:

- `seedPath`
- `relationsPath`
- `accordsPath`
- `outputDir`
- `version`

The switch may occur only after final approval, full revalidation, official `data/compiled/v2` publication and validation, v1 preservation checks and documented rollback. Partial switch is prohibited.

| Field | Before | After |
|-------|--------|-------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v1` | `data/compiled/v2` |
| `version` | `1.0.0` | `2.0.0` |

Decisions:

- `SWITCH-D-18`: `DEFAULT_PATHS` switch will be atomic and will alter `seedPath`, `relationsPath`, `accordsPath`, `outputDir` and `version` together.
- `SWITCH-D-19`: `DEFAULT_PATHS` switch may occur only after official `data/compiled/v2` publication and validation.
- `SWITCH-D-20`: Partial switch between v2 inputs and v1 outputDir, or v1 inputs and v2 outputDir, is prohibited.
- `SWITCH-D-21`: v1 paths and artifacts will be preserved and not removed.
- `SWITCH-D-22`: The switch is limited to `src/cli/parse_args.ts` and approved `DEFAULT_PATHS` fields.
- `SWITCH-D-23`: Post-switch, default compile must use v2 and output to `data/compiled/v2`.

---

## 7. Official V2 Artifacts

Official `data/compiled/v2` artifacts must be published from validated temporary v2 output. Old Phase 10 temporary outputs must not be used as official artifacts.

Official artifact set:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Publication policy:

- Create only the three official v2 artifacts listed above.
- Preserve `data/compiled/v1` without overwrite.
- Validate official artifacts against schema/status/quality gates.
- Official `generated_at` must be fixed or have an explicit comparison policy.
- `DEFAULT_PATHS` switch may occur only after official v2 artifacts exist and validate.

Decisions:

- `SWITCH-D-24`: `data/compiled/v2` will be published from validated temporary v2 output.
- `SWITCH-D-25`: Phase 12 will not use old Phase 10 temporary outputs as official artifacts.
- `SWITCH-D-26`: Official publication will create only `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` in `data/compiled/v2`.
- `SWITCH-D-27`: `data/compiled/v1` will be preserved without overwrite and remain baseline/archive.
- `SWITCH-D-28`: Official v2 artifacts must pass schema/status/quality gates after publication.
- `SWITCH-D-29`: Official `generated_at` must be fixed or have an explicit comparison policy.
- `SWITCH-D-30`: `DEFAULT_PATHS` switch may occur only after `data/compiled/v2` exists and validates.

---

## 8. Protected V1 Baseline

The v1 baseline is immutable/protected during and after Phase 12. `data/compiled/v1` remains baseline/archive and rollback anchor.

V1 protection policy:

- v1 inputs and official v1 compiled artifacts must not be altered, removed or regenerated.
- Protected v1 diff checks are mandatory before and after publication, default switch and phase closure.
- Explicit v1 compile must use `/tmp`, never `data/compiled/v1`.
- Any diff in protected v1 paths is a hard blocker.
- Git-only rollback does not replace physical preservation of v1 files.

Decisions:

- `SWITCH-D-31`: v1 baseline will be treated as immutable/protected during and after Phase 12.
- `SWITCH-D-32`: `data/compiled/v1` will remain baseline/archive and rollback anchor.
- `SWITCH-D-33`: v1 inputs and official v1 compiled artifacts must not be altered, removed or regenerated.
- `SWITCH-D-34`: Protected v1 diff checks are mandatory before and after publication, default switch and phase closure.
- `SWITCH-D-35`: Explicit v1 validation compile will use temporary paths, never `data/compiled/v1`.
- `SWITCH-D-36`: Any diff in protected v1 paths is a hard blocker and requires human review.
- `SWITCH-D-37`: Git-only rollback does not replace physical preservation of v1 files.

---

## 9. Rollback Execution

Rollback dry-run in a temporary environment is mandatory before Phase 12 can close. Git revert may support rollback but is not sufficient as the primary strategy.

Rollback policy:

- Rollback restores `DEFAULT_PATHS` to v1.
- Rollback validates v1 inputs and artifacts are preserved.
- Rollback must not delete `data/compiled/v2`.
- Rollback dry-run failure is a hard blocker.
- Final reporting must record `rollback_success` and validation evidence.

Required rollback values:

| Field | Required rollback value |
|-------|-------------------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

Decisions:

- `SWITCH-D-38`: Phase 12 will require rollback dry-run in a temporary environment before promotion closure.
- `SWITCH-D-39`: Git revert may support rollback, but is not a sufficient primary strategy.
- `SWITCH-D-40`: Rollback must restore `DEFAULT_PATHS` to v1 and validate preserved v1 inputs/artifacts.
- `SWITCH-D-41`: Rollback must not delete `data/compiled/v2`; it only removes v2 as default.
- `SWITCH-D-42`: Rollback dry-run failure is a hard blocker for closing Phase 12.
- `SWITCH-D-43`: Phase 12 final report must record `rollback_success` and validation evidence.

---

## 10. Docs And Release Notes

Phase 12 should use minimal release/migration documentation, not a broad documentation sweep.

Documentation policy:

- Update GSD tracking and Phase 12 validation/release docs.
- Update README/CLI docs only if they exist and mention impacted defaults or usage.
- Release notes must declare v2 default, official `data/compiled/v2`, preserved v1 baseline and validated rollback.
- Docs must not say v1 was removed.
- Docs must not say soft findings were resolved if they were only `accepted_with_policy`.
- Docs/release notes do not authorize new taxonomy curation.

Decisions:

- `SWITCH-D-44`: Phase 12 will use minimal release/migration documentation, not a broad sweep.
- `SWITCH-D-45`: GSD tracking and Phase 12 validation/release docs will be updated to reflect v2 default.
- `SWITCH-D-46`: README/CLI docs will be updated only if they exist and mention impacted defaults/usage.
- `SWITCH-D-47`: Release notes must declare v2 default, official `data/compiled/v2`, preserved v1 baseline and validated rollback.
- `SWITCH-D-48`: Docs must not claim v1 was removed or soft findings resolved when they were only accepted by policy.
- `SWITCH-D-49`: Docs/release notes do not authorize new taxonomy curation.

---

## 11. Validation Gates

Phase 12 future execution must use staged gates. Any hard gate failure blocks the next stage.

Required gates:

- Gate 0: Final approval.
- Gate 1: Pre-switch revalidation.
- Gate 2: Official v2 artifact publication.
- Gate 3: `DEFAULT_PATHS` switch.
- Gate 4: Post-switch validation.
- Gate 5: Rollback dry-run.
- Gate 6: Final release documentation.

Gate policy:

- `data/compiled/v2` may be created only after Gate 1 passes.
- `DEFAULT_PATHS` switch may occur only after Gate 2 passes.
- Phase 12 may close only if rollback dry-run passes and records `rollback_success: true`.
- Diff outside the allowlist is a hard blocker.
- Mutation of v1 baseline or seed/input files is a hard blocker.
- Incorrect or missing docs/release notes block phase closure.

Decisions:

- `SWITCH-D-50`: Phase 12 will use full staged validation gates.
- `SWITCH-D-51`: Final approval, pre-switch revalidation, artifact publication, `DEFAULT_PATHS` switch, post-switch validation, rollback dry-run and release docs will have separate gates.
- `SWITCH-D-52`: Any hard gate failure blocks the next stage.
- `SWITCH-D-53`: `data/compiled/v2` may be created only after Gate 1 passes.
- `SWITCH-D-54`: `DEFAULT_PATHS` switch may occur only after Gate 2 passes.
- `SWITCH-D-55`: Phase 12 may close only if rollback dry-run passes and records `rollback_success: true`.
- `SWITCH-D-56`: Diff outside the allowlist is a hard blocker.
- `SWITCH-D-57`: Mutation of v1 baseline or seed/input files is a hard blocker.
- `SWITCH-D-58`: Incorrect or missing docs/release notes are a hard blocker for phase closure.

---

## 12. Commit Strategy

Phase 12 future execution must use a staged commit sequence. Artifact publication and `DEFAULT_PATHS` switch must be separate commits.

Commit policy:

- Approval and pre-switch validation must happen before any mutation commit.
- Each commit must correspond to a validated gate and pass protected diff checks.
- Diffs outside the allowlist, `graphify-out/*` and unrelated changes must not be included.
- Final commit may occur only after post-switch validation and rollback dry-run with `rollback_success: true`.

Recommended commits:

1. `docs(12): record final approval and pre-switch validation`
2. `build(data): publish compiled v2 taxonomy artifacts`
3. `feat(cli): switch taxonomy defaults to v2`
4. `docs(12): document v2 default migration and rollback`
5. `test(12): record post-switch and rollback validation`

Decisions:

- `SWITCH-D-59`: Phase 12 will use a staged commit sequence.
- `SWITCH-D-60`: Artifact publication and `DEFAULT_PATHS` switch must be separate commits.
- `SWITCH-D-61`: Approval/pre-switch validation must occur before any mutation commit.
- `SWITCH-D-62`: Each commit must correspond to a validated gate and pass protected diff checks.
- `SWITCH-D-63`: Diffs outside the allowlist or unrelated changes must not be committed.
- `SWITCH-D-64`: Final commit may occur only after post-switch validation and rollback dry-run with `rollback_success: true`.

---

## Current Phase 12 Result

Phase 12 is `context_captured` and `not_ready_for_execution`.

This context does not authorize implementation. The next permitted step is non-executable planning/research when explicitly authorized. Future execution remains blocked until persisted final approval, current revalidation, approved plans and the staged gates above exist.
