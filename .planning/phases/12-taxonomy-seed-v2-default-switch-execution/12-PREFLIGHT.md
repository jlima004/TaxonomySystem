---
status: context_captured
executable: false
plans: none
implementation: not_authorized
---

# Phase 12: Taxonomy Seed v2 Default Switch Execution - Preflight

## Status

Phase 12 has captured canonical context in `12-CONTEXT.md`. No executable plans exist, no mutation has been authorized, and the phase is not ready for execution.

## Execution Boundary

- No executable plans exist.
- No implementation is authorized.
- No code changes are part of this phase state.
- No seed/data changes are authorized during context gathering.
- No compiled artifacts should be changed during context gathering.
- No official `data/compiled/v2/` should be created during context gathering.
- `taxonomy-seed.v1.json` must not be edited or removed.
- `curated_relations.v1.json` must not be edited or removed.
- `accord_map.v1.json` must not be edited or removed.
- `taxonomy-seed.v2.json` must not be edited during context gathering.
- `curated_relations.v2.json` must not be edited during context gathering.
- `accord_map.v2.json` must not be edited during context gathering.
- `descriptor_aliases.seed.json` must not be edited during context gathering.
- `data/compiled/v1/` must not be overwritten or removed.
- v2 must not be promoted to default.
- `DEFAULT_PATHS` must not be altered.
- `src/cli/parse_args.ts` must not be altered during context gathering.
- `12-CONTEXT.md` exists as the canonical context for future non-executable planning/research.

## Explicitly Not Created Yet

- `12-01-PLAN.md`
- `12-RESEARCH.md`
- `12-PATTERNS.md`
- `12-VALIDATION.md`
- `12-FINAL-APPROVAL.md`

## Required Baseline

Phase 12 must use Phase 11 as mandatory baseline.

Phase 11 closed in commit:

- `1f31b76 docs(phase-11): close validation for documentation-only execution`

Phase 11 documented:

- readiness audit
- soft findings disposition
- legacy alias exception policy
- graph/review readiness
- migration/default-switch proposal
- rollback validation and release gates

## Starting Point

Post-Phase 11 state:

- v2 candidate: 10 families, 18 subfamilies, 39 seed descriptors.
- Total compiled descriptors: 303 in prior temporary v2 comparison output.
- Review queue: 317 items.
- Input relation_count: 14.
- Input accord_count: 19.
- Compiled graph edges: 13.
- Isolated subfamilies: 0.
- Hard failures: none in last comparison report.
- v2 remains explicit-path only; defaults remain v1.
- `DEFAULT_PATHS` continue pointing to v1.
- `data/compiled/v1/` remains baseline/archive.
- Official `data/compiled/v2/` does not exist.
- Protected v1 inputs remain preserved.
- v2 compile was deterministic in a prior temporary comparison.
- Curation tests passed previously.

## Required Future Approval Gate

Any future execution must be blocked until final human approval is persisted outside chat.

Suggested approval artifact:

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`

Required approval fields:

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

Without persisted approval, no execution may proceed.

Additional approval gate rules:

- Without `12-FINAL-APPROVAL.md`, no plan may alter `DEFAULT_PATHS`.
- Without `12-FINAL-APPROVAL.md`, no plan may create `data/compiled/v2`.
- Without `12-FINAL-APPROVAL.md`, no plan may execute default switch.
- The approval file must explicitly state that soft findings accepted by Phase 11 remain accepted for the switch.
- The approval file must explicitly state that testable rollback is required.
- `12-FINAL-APPROVAL.md` is intentionally not created during context gathering.

## Required Future Pre-Switch Revalidation

Before any mutation, Phase 12 must reexecute full pre-switch revalidation against the current repository state.

Required gates:

- typecheck
- tests
- build
- compile v1 explicit in `/tmp/opencode/taxonomy-phase12-switch/v1-baseline`
- compile v2 explicit in `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- repeat compile v2 in `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`
- compare repeated v2 output with `cmp -s`
- hard failures: none
- soft findings remain explicitly dispositioned/accepted
- legacy alias exception policy remains explicit
- graph coverage still satisfies `isolated_subfamilies = 0`
- review queue distribution/severity remains acceptable or documented
- protected diff clean for v1/default paths
- `data/compiled/v2` absent before official publication step
- `DEFAULT_PATHS` still point to v1 before switch

Hard gate policy:

- Phase 10/11 evidence is historical baseline only.
- Current pre-switch revalidation is required before publication or default changes.
- Any hard gate failure blocks `data/compiled/v2` publication and `DEFAULT_PATHS` switch.
- `data/compiled/v2` must remain nonexistent until the official publication step.

## Future Expected Diff Allowlist

Allowed future diffs, only after required approval and gates:

- Phase 12 approval/context/research/patterns/validation/plans/summaries/pre-switch/post-switch/rollback documentation under `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/`.
- Official v2 artifacts only under `data/compiled/v2/`.
- `src/cli/parse_args.ts` only for approved `DEFAULT_PATHS` fields: `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, and `version`.
- CLI docs, release/migration notes and GSD tracking docs needed to communicate the promotion.
- Tests only when clearly scoped to v2 default behavior and explicit v1 fallback preservation.

Protected/no-edit paths:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- `graphify-out/*`, unless separately and explicitly planned

Diff blocker policy:

- `data/compiled/v2` may be created only in the official publication step.
- `src/cli/parse_args.ts` may change only after `data/compiled/v2` exists and validates.
- Any diff outside the allowlist blocks execution and requires human review.

## Future DEFAULT_PATHS Switch Policy

The future `DEFAULT_PATHS` switch must be atomic and happen only after approval, full pre-switch revalidation, official `data/compiled/v2` publication/validation, preserved `data/compiled/v1`, and documented validatable rollback.

Only `src/cli/parse_args.ts` may change for the default switch, and only these fields may change:

| Field | Required future value |
|-------|-----------------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v2` |
| `version` | `2.0.0` |

Partial switch is prohibited:

- Do not use v2 inputs with `data/compiled/v1`.
- Do not use v1 inputs with `data/compiled/v2`.
- Do not change only some of the five fields.

Post-switch validation must confirm default compile uses v2 and writes to `data/compiled/v2`, explicit v1 compile still works in `/tmp`, `data/compiled/v1` remains preserved, tests/typecheck/build pass, and rollback instructions remain valid.

## Future Official V2 Artifact Publication Policy

Official `data/compiled/v2` artifacts may be created only after final approval, full pre-switch revalidation, explicit temporary v2 compile, repeated deterministic v2 comparison, zero hard failures, accepted/dispositioned soft findings, and verified intact `data/compiled/v1`.

Temporary v2 outputs:

- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`

Official outputs allowed:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Publication constraints:

- Do not copy Phase 10 temporary outputs.
- Do not compile directly to `data/compiled/v2` before temp validation.
- Do not overwrite `data/compiled/v1`.
- Do not alter seed/input files during publication.
- Use fixed official `generated_at` where possible, preferably `2026-01-01T00:00:00.000Z`; otherwise document comparison policy.
- Validate official artifacts after publication and compare them to the validated temp output.
- `DEFAULT_PATHS` switch is blocked until official `data/compiled/v2` exists and validates.

## Immutable V1 Baseline Policy

The v1 baseline is immutable/protected during and after Phase 12.

Protected v1 paths:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`
- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`
- `data/compiled/v1/**`

Also protected during Phase 12:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`

Required protected diff gates:

- Before and after `data/compiled/v2` publication.
- Before and after `DEFAULT_PATHS` switch.
- Before phase closure.

Base protected diff command:

```bash
git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json
```

Required existence checks:

```bash
test -f data/taxonomy/taxonomy-seed.v1.json
test -f data/inference/curated_relations.v1.json
test -f data/inference/accord_map.v1.json
test -f data/compiled/v1/taxonomy.json
test -f data/compiled/v1/descriptor_aliases.json
test -f data/compiled/v1/similarity_matrix.json
```

Rules:

- Do not rely only on git rollback.
- Do not create an additional archive copy by default unless a future plan detects a need.
- Do not update metadata inside `data/compiled/v1`.
- Do not compile directly to `data/compiled/v1`.
- Explicit v1 validation compile must use temporary output paths.
- Any protected v1 diff blocks execution and requires human review.

## Future Rollback Dry-Run Policy

Rollback must be validated before Phase 12 can close. Validation must happen in a temporary patch/branch/worktree or equivalent, not as a permanent rollback on the main branch.

Rollback must restore these default values:

| Field | Required rollback value |
|-------|-------------------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

Rollback validation must confirm v1 defaults, preserved v1 inputs/artifacts, explicit v1 compile in a temporary output path, relevant tests/typecheck/build, v2 no longer default, and `data/compiled/v2` not deleted.

Rollback constraints:

- Git revert may assist but is not sufficient alone.
- Do not delete `data/compiled/v2` to validate rollback.
- Do not alter or overwrite v1 inputs or `data/compiled/v1`.
- Rollback dry-run failure is a hard blocker.
- Final reporting must include commands executed, result and `rollback_success: true/false`.

## Future Docs And Release Notes Policy

Phase 12 will use minimal release/migration documentation, not a broad documentation sweep.

Allowed/expected docs:

- GSD tracking: `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/REQUIREMENTS.md`, `.planning/PROJECT.md` if needed.
- Phase 12 docs: final approval, pre-switch validation, post-switch validation, rollback validation, summaries, release/migration notes.
- User-facing docs only if impacted: `README.md`, CLI usage docs, existing migration/release notes.

Required messaging:

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

Documentation constraints:

- Do not state v1 was removed.
- Do not state v2 physically replaced `data/compiled/v1`.
- Do not hide rollback.
- Do not present accepted soft findings as resolved.
- Do not start new taxonomy curation.
- Do not alter seed/data inputs through docs work.

## Future Full Staged Validation Gates

Phase 12 future execution must use separate gates. Any hard gate failure blocks the next stage.

Gate 0 - Final approval:

- Requires complete `12-FINAL-APPROVAL.md` with approval for default switch, v2 publication, rollback, v1 baseline preservation and chat approval insufficiency.

Gate 1 - Pre-switch revalidation:

- Requires typecheck, tests, build, explicit v1/v2 temporary compiles, repeated deterministic v2 compile with `cmp -s`, zero hard failures, accepted/dispositioned soft findings, explicit legacy alias exception policy, `isolated_subfamilies = 0`, documented review_queue distribution, no preexisting `data/compiled/v2`, v1 defaults before switch and clean protected v1 diff.

Gate 2 - Official v2 artifact publication:

- Allows only `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` in `data/compiled/v2`; requires schema/status/quality validation, equivalence to validated temp output, approved `generated_at` policy and clean protected/input diffs.

Gate 3 - `DEFAULT_PATHS` switch:

- Allows only `src/cli/parse_args.ts` and only the five approved fields. Partial switches and seed/input or `data/compiled/v1` diffs are hard failures.

Gate 4 - Post-switch validation:

- Requires v2 defaults, default version `2.0.0`, default output to `data/compiled/v2`, explicit v1 compile in temporary path, tests/typecheck/build, official v2 validation, preserved `data/compiled/v1` and release/migration docs.

Gate 5 - Rollback dry-run:

- Requires temporary rollback validation restoring v1 defaults, validating preserved v1 inputs/artifacts, explicit v1 compile, preserving `data/compiled/v2`, and recording `rollback_success: true`.

Gate 6 - Final release documentation:

- Requires post-switch validation report, rollback validation report, release/migration notes, v2 default messaging, preserved v1 baseline messaging, validated rollback messaging, and clear statement that accepted soft findings were not automatically resolved.

Global hard blockers:

- missing persisted final approval
- hard gate failure at any stage
- diff outside allowlist
- seed/data input mutation
- `data/compiled/v1` mutation
- unexpected artifact creation
- partial `DEFAULT_PATHS` switch
- rollback dry-run failure
- missing post-switch report
- missing release/migration notes

## Future Commit Strategy

Phase 12 future execution must use a staged commit sequence. Each commit corresponds to a validated gate/stage and must pass protected diff checks before advancing.

Recommended commits:

1. `docs(12): record final approval and pre-switch validation`
2. `build(data): publish compiled v2 taxonomy artifacts`
3. `feat(cli): switch taxonomy defaults to v2`
4. `docs(12): document v2 default migration and rollback`
5. `test(12): record post-switch and rollback validation`

Commit constraints:

- Do not mix approval/prevalidation with mutation.
- Do not mix artifact publication and `DEFAULT_PATHS` switch.
- Do not commit diffs outside the allowlist.
- Do not include `graphify-out/*` or unrelated changes.
- Do not include protected v1 paths.
- Final commit requires post-switch validation and rollback dry-run with `rollback_success: true`.

## Preflight Result

Phase 12 is `context_captured` and `not_ready_for_execution`. `12-CONTEXT.md` exists as the canonical context. The next permitted step is non-executable planning/research when authorized. No implementation, mutation, artifact publication, rollback, default switch, or executable plan creation is authorized.
