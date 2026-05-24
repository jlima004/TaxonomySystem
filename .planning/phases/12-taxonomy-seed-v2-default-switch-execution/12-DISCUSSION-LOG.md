# Phase 12: Taxonomy Seed v2 Default Switch Execution - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `12-CONTEXT.md` only after discussion produces enough stable decisions.

**Date:** 2026-05-24
**Phase:** 12-taxonomy-seed-v2-default-switch-execution
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Decision IDs:** `SWITCH-D-01`, `SWITCH-D-02`, `SWITCH-D-03`, ...
**Required baseline:** Phase 11 closed in commit `1f31b76 docs(phase-11): close validation for documentation-only execution`

---

## Phase Boundary

Phase 12 registers a potentially executable future phase for controlled and reversible promotion of taxonomy seed v2 to default. It starts from the post-Phase 11 documentation-only baseline.

Phase 12 context gathering must NOT:

- Promote v2 to default.
- Alter `DEFAULT_PATHS`.
- Create executable plans.
- Implement code changes.
- Change seed/data files.
- Change compiled artifacts.
- Create official `data/compiled/v2/`.
- Overwrite or remove `data/compiled/v1/`.
- Edit or remove `taxonomy-seed.v1.json`, `curated_relations.v1.json`, or `accord_map.v1.json`.
- Edit v2 input files during context gathering.
- Edit `descriptor_aliases.seed.json`.
- Treat corpus/review_queue evidence as curated truth.

---

## Post-Phase 11 Starting Context

Phase 11 concluded as documentation-only readiness and migration planning. It did not execute default switch, did not alter `DEFAULT_PATHS`, did not create official `data/compiled/v2/`, and did not alter code/data/artifacts.

Post-Phase 11 state:

- v2 remains candidate-only.
- `DEFAULT_PATHS` continue pointing to v1.
- `data/compiled/v1/` remains baseline/archive.
- Official `data/compiled/v2/` does not exist.
- `taxonomy-seed.v1.json`, `curated_relations.v1.json`, and `accord_map.v1.json` remain protected.
- Phase 11 documented readiness audit, soft findings disposition, legacy alias exception policy, graph/review readiness, migration/default-switch proposal, rollback validation and release gates.

Post-Phase 10/11 technical baseline:

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

Known preserved facts:

- v2 compile was deterministic in the prior temporary comparison.
- Curation tests passed previously.
- v1 protected inputs and compiled baseline remained unchanged through Phase 11.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 12: Taxonomy Seed v2 Default Switch Execution? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | All areas | Discutir final approval, readiness revalidation, expected diffs, DEFAULT_PATHS switch, data/compiled/v2 publication, protected v1 preservation, rollback execution, docs/release notes, validation gates e commit strategy. | yes |
| 2 | Final approval | Como registrar aprovacao humana final persistida antes do switch. | |
| 3 | Readiness revalidation | Quais gates da Phase 11 precisam ser reexecutados antes da promocao. | |
| 4 | Expected diffs | Quais arquivos podem mudar no default switch e quais nunca devem mudar. | |
| 5 | DEFAULT_PATHS switch | Como alterar seedPath, relationsPath, accordsPath, outputDir e version para v2. | |
| 6 | Official v2 artifacts | Como criar e validar data/compiled/v2 sem sobrescrever data/compiled/v1. | |
| 7 | Protected v1 baseline | Como preservar taxonomy-seed.v1.json, curated_relations.v1.json, accord_map.v1.json e data/compiled/v1. | |
| 8 | Rollback execution | Como testar/documentar rollback para restaurar defaults v1. | |
| 9 | Docs and release notes | Quais docs precisam comunicar v2 default e caminho de rollback. | |
| 10 | Validation gates | Quais hard gates precisam passar antes e depois do switch. | |
| 11 | Commit strategy | Como separar commits de approval, artifact publication, DEFAULT_PATHS switch, docs e validation. | |
| 12 | Type your own answer | Add another discussion area. | |

**Initial recommendation:** discuss all areas (option 1).

**User selection:** All areas (option 1).

Next discussion order:

1. Final approval
2. Readiness revalidation
3. Expected diffs
4. DEFAULT_PATHS switch
5. Official v2 artifacts
6. Protected v1 baseline
7. Rollback execution
8. Docs and release notes
9. Validation gates
10. Commit strategy

---

## Recommended Future Execution Waves

These waves are discussion inputs only. They are not executable plans.

### Wave 0 - Final Approval And Preflight

Before any mutation, require final human approval persisted outside chat.

Potential approval artifact:

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`

Required fields to discuss:

- `approval_status: approved_for_default_switch`
- `approved_by: human_curator`
- `approved_at`
- `scope: taxonomy_seed_v2_default_switch`
- `accepts_soft_findings: true/false`
- `rollback_required: true`
- `data_compiled_v2_publication: approved`
- `DEFAULT_PATHS_switch: approved`

### Wave 1 - Pre-Switch Revalidation

Temporary paths to discuss:

- `/tmp/opencode/taxonomy-phase12-switch/v1-baseline`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`

Required gates to discuss:

- typecheck
- tests
- build
- compile v1 explicit
- compile v2 explicit
- deterministic v2 with `cmp -s`
- hard failures none
- soft findings disposition still accepted
- legacy alias exception still explicit
- isolated_subfamilies = 0
- no protected v1 drift
- no `data/compiled/v2` before publication step

### Wave 2 - Publish Official V2 Artifacts

Potential official outputs:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Publication rules to discuss:

- Do not overwrite `data/compiled/v1/`.
- Use approved fixed `generated_at` or another explicit timestamp policy.
- Validate schema/status/quality gates.
- Compare official artifacts with temporary v2 output.
- Confirm `data/compiled/v1/` remains intact.

### Wave 3 - DEFAULT_PATHS Switch

Potential future change target:

- `src/cli/parse_args.ts`

Fields to discuss:

- `seedPath`: `data/taxonomy/taxonomy-seed.v2.json`
- `relationsPath`: `data/inference/curated_relations.v2.json`
- `accordsPath`: `data/inference/accord_map.v2.json`
- `outputDir`: `data/compiled/v2`
- `version`: `2.0.0`

Rules to discuss:

- Do not remove v1 paths.
- Do not alter v1 inputs.
- Do not alter `data/compiled/v1/`.
- Switch only after approval and v2 artifact publication.

### Wave 4 - Docs, Release Notes, And Post-Switch Validation

Docs to discuss:

- `README.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- release/migration notes if they exist

Validation to discuss:

- default compile writes to `data/compiled/v2`
- `data/compiled/v1/` remains preserved
- explicit v1 compile still works in `/tmp`
- rollback instructions exist
- tests pass
- build passes
- compiled v2 artifacts exist
- `DEFAULT_PATHS` point to v2
- default version is `2.0.0`

### Wave 5 - Rollback Validation

Rollback options to discuss:

- rollback dry-run in patch/temp branch
- rollback documented commands only
- rollback smoke test via temporary copy
- git revert plus explicit `DEFAULT_PATHS` validation

Required rollback criteria to discuss:

- rollback restores v1 defaults
- v1 artifacts remain present
- v1 inputs remain present
- rollback does not depend only on git revert

---

## Decision Capture Rules

Use decision IDs `SWITCH-D-01`, `SWITCH-D-02`, `SWITCH-D-03`, and so on.

Until `12-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## 1. Final Approval

### Approval Artifact Policy

**User selection:** Dedicated approval file (option 1).

Phase 12 will use a dedicated final approval file:

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`

Rationale:

- Phase 12 is the first potentially mutable phase for v2 default promotion.
- Approval must be persisted, auditable and separate from chat, canonical context and technical plans.
- Chat approval is insufficient for default switch execution.

Required fields:

- `approval_status: approved_for_default_switch`
- `approved_by: human_curator`
- `approved_at: <timestamp>`
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

Gate rules:

- Without `12-FINAL-APPROVAL.md`, no plan may alter `DEFAULT_PATHS`.
- Without `12-FINAL-APPROVAL.md`, no plan may create `data/compiled/v2`.
- Without `12-FINAL-APPROVAL.md`, no plan may execute default switch.
- Approval in chat is not sufficient.
- The approval file must exist before execution of any mutable plan.
- The approval file must explicitly state that soft findings accepted by Phase 11 remain accepted for the switch.
- The approval file must explicitly state that testable rollback is required.

Current context-gathering state:

- `12-FINAL-APPROVAL.md` is intentionally not created yet.
- This discussion records the approval policy only.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-01:** Phase 12 will require persisted final human approval before any mutation.
- **SWITCH-D-02:** Final approval will be recorded in `12-FINAL-APPROVAL.md`.
- **SWITCH-D-03:** Chat approval will not be sufficient to authorize the default switch.
- **SWITCH-D-04:** `12-FINAL-APPROVAL.md` must explicitly approve default switch, publication of `data/compiled/v2`, acceptance of soft findings and rollback requirement.
- **SWITCH-D-05:** No mutable plan may execute before persisted final approval exists.

---

## 2. Readiness Revalidation

### Pre-Switch Revalidation Policy

**User selection:** Full pre-switch revalidation (option 1).

Phase 12 must reexecute a complete validation suite before any real default switch.

Rationale:

- Phase 10/11 evidence is historical baseline, not current authorization.
- Before altering `DEFAULT_PATHS` or publishing official `data/compiled/v2`, the current repository state must be validated.
- Documentation-only readiness from Phase 11 does not replace current pre-switch validation.

Required gates before mutation:

1. typecheck
2. tests
3. build
4. compile v1 explicit in temporary path
5. compile v2 explicit in temporary path
6. repeat compile v2 with fixed `generated_at` and `cmp -s`
7. hard failures: none
8. soft findings remain dispositioned/accepted
9. legacy alias exception policy remains explicit
10. graph coverage still satisfies `isolated_subfamilies = 0`
11. review queue distribution/severity remains acceptable or documented
12. protected diff clean for v1/default paths
13. `data/compiled/v2` does not exist before publication step
14. `DEFAULT_PATHS` still point to v1 before switch

Temporary paths:

- `/tmp/opencode/taxonomy-phase12-switch/v1-baseline`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`

Policy:

- Phase 10 evidence is historical baseline only.
- No default switch can happen without current pre-switch revalidation.
- If any hard gate fails, Phase 12 must stop before artifact publication or default changes.
- Soft findings may proceed only if they still have explicit disposition.
- `data/compiled/v2` must remain absent until the official publication step.

Current context-gathering state:

- These gates are recorded as future execution requirements only.
- No validation command has been run by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-06:** Phase 12 will require full pre-switch revalidation before any mutation.
- **SWITCH-D-07:** Phase 10/11 evidence is historical baseline, not a substitute for current validation.
- **SWITCH-D-08:** v1 and v2 must be compiled in explicit temporary paths before publication/default switch.
- **SWITCH-D-09:** v2 determinism must be revalidated with repeat compile and `cmp -s`.
- **SWITCH-D-10:** Any hard gate failure blocks artifact publication and `DEFAULT_PATHS` switch.
- **SWITCH-D-11:** `data/compiled/v2` must remain nonexistent until the official publication step.

---

## 3. Expected Diffs

### Controlled Diff Policy

**User selection:** Minimal controlled diff set (option 1).

Phase 12 will use a minimal and controlled expected diff set for any future execution.

Allowed future created/modified files, if approval and gates pass:

1. Approval and Phase 12 documentation

- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md`
- `12-RESEARCH.md`
- `12-PATTERNS.md`
- `12-VALIDATION.md`
- `12-*-PLAN.md`
- `12-*-SUMMARY.md`
- `12-PRE-SWITCH-VALIDATION.md`
- `12-POST-SWITCH-VALIDATION.md`
- `12-ROLLBACK-VALIDATION.md`
- `12-CONTEXT.md`

2. Official v2 compiled artifacts

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

3. `DEFAULT_PATHS` switch

- `src/cli/parse_args.ts`

Allowed `src/cli/parse_args.ts` changes only:

- `seedPath` from v1 to `data/taxonomy/taxonomy-seed.v2.json`
- `relationsPath` from v1 to `data/inference/curated_relations.v2.json`
- `accordsPath` from v1 to `data/inference/accord_map.v2.json`
- `outputDir` from `data/compiled/v1` to `data/compiled/v2`
- `version` from `1.0.0` to `2.0.0`

4. Docs and release notes

- README/docs of CLI, if they exist
- migration notes/release notes, if they exist
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`, if needed

5. Tests only if necessary

- Tests may be updated or added only to reflect v2 as default and preserve explicit v1 fallback.
- Any changed test must have clear default-switch scope.

Protected/no-edit files:

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- any official v1 artifact
- any curation seed/data input
- `graphify-out/*`, unless a separate explicit plan authorizes it

Ordering policy:

- `data/compiled/v2` may be created only in the publication step, after approval and pre-switch revalidation.
- `src/cli/parse_args.ts` may change only after `data/compiled/v2` exists and validates.
- v1 inputs and `data/compiled/v1` are baseline/archive and rollback anchors.
- v2 inputs are already curated; Phase 12 must not modify taxonomic content.
- Any diff outside the allowlist is a blocker and requires human review.

Current context-gathering state:

- This records the future diff policy only.
- No runtime/data/default file in the allowlist has been changed by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-12:** Phase 12 will use a minimal controlled diff set.
- **SWITCH-D-13:** v1 inputs, v2 inputs, `descriptor_aliases.seed.json` and `data/compiled/v1` are protected/no-edit.
- **SWITCH-D-14:** `data/compiled/v2` will be the only new official artifact set allowed.
- **SWITCH-D-15:** `src/cli/parse_args.ts` may change only in the approved `DEFAULT_PATHS` fields.
- **SWITCH-D-16:** Docs, tracking, summaries and validation reports may change to reflect promotion.
- **SWITCH-D-17:** Any diff outside the allowlist is a blocker and requires human review.

---

## 4. DEFAULT_PATHS Switch

### Atomic Default Switch Policy

**User selection:** Atomic `DEFAULT_PATHS` switch after v2 publication (option 1).

Phase 12 will switch defaults atomically, only after official `data/compiled/v2` publication and validation.

Required prerequisites before switch:

1. `12-FINAL-APPROVAL.md` exists with `approval_status: approved_for_default_switch`.
2. Full pre-switch revalidation passes.
3. Official `data/compiled/v2` is created.
4. Official v2 artifacts validate.
5. `data/compiled/v1` remains intact.
6. Rollback plan is documented and validatable.

Allowed file:

- `src/cli/parse_args.ts`

Allowed field changes:

| Field | Before | After |
|-------|--------|-------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` | `data/taxonomy/taxonomy-seed.v2.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` | `data/inference/curated_relations.v2.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` | `data/inference/accord_map.v2.json` |
| `outputDir` | `data/compiled/v1` | `data/compiled/v2` |
| `version` | `1.0.0` | `2.0.0` |

Switch rules:

- Alter all five fields together in the same plan/commit.
- Do not perform a partial switch.
- Do not combine v2 inputs with v1 outputDir.
- Do not combine v1 inputs with v2 outputDir.
- Do not remove v1 paths from the repository.
- Do not alter `taxonomy-seed.v1.json`.
- Do not alter `curated_relations.v1.json`.
- Do not alter `accord_map.v1.json`.
- Do not alter `data/compiled/v1`.
- Do not alter v2 inputs during the switch.
- Ensure the switch is reversible by documented rollback.

Post-switch validation requirements:

- `DEFAULT_PATHS` point to v2.
- Default version is `2.0.0`.
- Default `outputDir` is `data/compiled/v2`.
- Default compile writes to `data/compiled/v2`.
- `data/compiled/v1` remains preserved.
- Explicit v1 compile still works in `/tmp`.
- Tests, typecheck and build pass.
- Rollback instructions remain valid.

Current context-gathering state:

- This records the future switch policy only.
- `src/cli/parse_args.ts` has not been changed by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-18:** `DEFAULT_PATHS` switch will be atomic and will alter `seedPath`, `relationsPath`, `accordsPath`, `outputDir` and `version` together.
- **SWITCH-D-19:** `DEFAULT_PATHS` switch may occur only after official `data/compiled/v2` publication and validation.
- **SWITCH-D-20:** Partial switch between v2 inputs and v1 outputDir, or v1 inputs and v2 outputDir, is prohibited.
- **SWITCH-D-21:** v1 paths and artifacts will be preserved and not removed.
- **SWITCH-D-22:** The switch is limited to `src/cli/parse_args.ts` and approved `DEFAULT_PATHS` fields.
- **SWITCH-D-23:** Post-switch, default compile must use v2 and output to `data/compiled/v2`.

---

## 5. Official V2 Artifacts

### Publication Policy

**User selection:** Publish from validated temporary v2 output (option 1).

Phase 12 will publish official `data/compiled/v2` artifacts from a temporary v2 output that has already been validated.

Publication prerequisites:

1. `12-FINAL-APPROVAL.md` exists.
2. Full pre-switch revalidation passes.
3. v2 compiles in an explicit temporary path.
4. repeated v2 compile confirms determinism with `cmp -s`.
5. hard failures = none.
6. soft findings remain accepted/dispositioned.
7. `data/compiled/v1` remains intact.

Temporary paths:

- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`

Official artifacts to create:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Publication rules:

- Do not copy old Phase 10 temporary outputs.
- Do not compile directly to `data/compiled/v2` without temporary validation first.
- Do not overwrite `data/compiled/v1`.
- Do not alter seed/input files during publication.
- Official v2 must be byte-equivalent or semantically equivalent to the validated temporary output, depending on the `generated_at` policy.
- After publication, validate schema/status/quality gates for official artifacts.
- Confirm `data/compiled/v1` remains present and without diff.
- Confirm `data/compiled/v2` contains only the three expected artifacts unless an explicit policy says otherwise.

Generated_at policy:

- Use an approved fixed timestamp for official artifacts, preferably `2026-01-01T00:00:00.000Z`.
- Rationale: fixed timestamp improves determinism, comparison and rollback.
- If a real timestamp is used, the plan must explain how to compare artifacts without false diffs.

Post-publication validation:

- `test -f data/compiled/v2/taxonomy.json`
- `test -f data/compiled/v2/descriptor_aliases.json`
- `test -f data/compiled/v2/similarity_matrix.json`
- schema validation passes
- `quality_gate_status = PASS`
- `validation_status = ok`
- compare temporary v2 output vs official v2 output
- protected diff clean for `data/compiled/v1`, v1 inputs, v2 inputs and `descriptor_aliases.seed.json`

Current context-gathering state:

- This records the future artifact publication policy only.
- `data/compiled/v2` has not been created by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-24:** `data/compiled/v2` will be published from validated temporary v2 output.
- **SWITCH-D-25:** Phase 12 will not use old Phase 10 temporary outputs as official artifacts.
- **SWITCH-D-26:** Official publication will create only `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json` in `data/compiled/v2`.
- **SWITCH-D-27:** `data/compiled/v1` will be preserved without overwrite and remain baseline/archive.
- **SWITCH-D-28:** Official v2 artifacts must pass schema/status/quality gates after publication.
- **SWITCH-D-29:** Official `generated_at` must be fixed or have an explicit comparison policy.
- **SWITCH-D-30:** `DEFAULT_PATHS` switch may occur only after `data/compiled/v2` exists and validates.

---

## 6. Protected V1 Baseline

### Immutable V1 Baseline Policy

**User selection:** Immutable v1 baseline (option 1).

Phase 12 will treat the v1 baseline as immutable/protected during and after promotion.

Policy:

- v1 inputs are protected/no-edit.
- `data/compiled/v1/**` is protected/no-edit.
- `data/compiled/v1` remains baseline/archive.
- rollback depends on preserved v1 inputs and v1 artifacts.
- no Phase 12 wave may alter, remove, format or regenerate official v1 artifacts.
- any diff in v1 protected paths is a hard blocker.

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

Rationale:

- Phase 12 is default switch and artifact publication, not new taxonomy curation.
- v1 and v2 inputs were defined in prior phases.
- v1 physical files must remain available as baseline/archive and rollback anchor.

Required protected-diff gates:

- Before `data/compiled/v2` publication, run protected diff for v1.
- After `data/compiled/v2` publication, run protected diff for v1.
- Before `DEFAULT_PATHS` switch, run protected diff for v1.
- After `DEFAULT_PATHS` switch, run protected diff for v1.
- Before closing the phase, run final protected diff for v1.

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
- Do not create an additional archive copy by default unless a plan detects a need.
- Do not update metadata inside `data/compiled/v1`.
- Do not compile directly to `data/compiled/v1`.
- Explicit v1 validation compile must use `/tmp/opencode/...`, never the official v1 path.
- If any v1 protected path changes, stop execution and require human review.

Current context-gathering state:

- This records the future v1 protection policy only.
- No protected path has been changed by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-31:** v1 baseline will be treated as immutable/protected during and after Phase 12.
- **SWITCH-D-32:** `data/compiled/v1` will remain baseline/archive and rollback anchor.
- **SWITCH-D-33:** v1 inputs and official v1 compiled artifacts must not be altered, removed or regenerated.
- **SWITCH-D-34:** Protected v1 diff checks are mandatory before and after publication, default switch and phase closure.
- **SWITCH-D-35:** Explicit v1 validation compile will use temporary paths, never `data/compiled/v1`.
- **SWITCH-D-36:** Any diff in protected v1 paths is a hard blocker and requires human review.
- **SWITCH-D-37:** Git-only rollback does not replace physical preservation of v1 files.

---

## 7. Rollback Execution

### Rollback Dry-Run Policy

**User selection:** Rollback dry-run in temporary patch/worktree (option 1).

Phase 12 will validate rollback as a dry-run in a temporary environment, without applying permanent rollback on the main branch.

Policy:

- Rollback must be testable before Phase 12 closure.
- Git revert may be an auxiliary tool, but is not sufficient as the rollback strategy.
- Rollback must restore `DEFAULT_PATHS` to v1.
- Rollback must validate that v1 inputs and `data/compiled/v1` remain preserved.
- Rollback must not remove `data/compiled/v2`; it only restores v1 as default.
- Rollback dry-run must run in a patch/temp branch/worktree or equivalent, not as permanent rollback on the main branch.

Rollback must restore:

| Field | Required rollback value |
|-------|-------------------------|
| `seedPath` | `data/taxonomy/taxonomy-seed.v1.json` |
| `relationsPath` | `data/inference/curated_relations.v1.json` |
| `accordsPath` | `data/inference/accord_map.v1.json` |
| `outputDir` | `data/compiled/v1` |
| `version` | `1.0.0` |

Rollback validation must confirm:

1. `DEFAULT_PATHS` point to v1.
2. `data/compiled/v1` exists and is intact.
3. `taxonomy-seed.v1.json` exists and is intact.
4. `curated_relations.v1.json` exists and is intact.
5. `accord_map.v1.json` exists and is intact.
6. explicit v1 compile passes in a temporary output path.
7. tests/typecheck/build pass or, at minimum, relevant curation/default-path tests pass.
8. v2 is no longer default after rollback.
9. `data/compiled/v2` may remain as versioned artifact, but is not default after rollback.
10. rollback does not depend only on git revert.

Rules:

- Do not execute permanent rollback on the main branch as part of validation.
- Do not delete `data/compiled/v2` to validate rollback.
- Do not alter v1 inputs or `data/compiled/v1`.
- Do not overwrite `data/compiled/v1`.
- If rollback dry-run fails, Phase 12 cannot be considered safe for promotion.
- Final report must include commands executed, result and `rollback_success: true/false`.

Current context-gathering state:

- This records the future rollback validation policy only.
- No rollback command has been run by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-38:** Phase 12 will require rollback dry-run in a temporary environment before promotion closure.
- **SWITCH-D-39:** Git revert may support rollback, but is not a sufficient primary strategy.
- **SWITCH-D-40:** Rollback must restore `DEFAULT_PATHS` to v1 and validate preserved v1 inputs/artifacts.
- **SWITCH-D-41:** Rollback must not delete `data/compiled/v2`; it only removes v2 as default.
- **SWITCH-D-42:** Rollback dry-run failure is a hard blocker for closing Phase 12.
- **SWITCH-D-43:** Phase 12 final report must record `rollback_success` and validation evidence.

---

## 8. Docs And Release Notes

### Minimal Release Documentation Policy

**User selection:** Minimal release docs (option 1).

Phase 12 will update minimal and sufficient documentation to communicate v2 default promotion. It will not perform a broad documentation sweep by default.

Allowed/expected docs:

1. GSD tracking

- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`, if needed

2. Phase 12 docs

- `12-FINAL-APPROVAL.md`
- `12-PRE-SWITCH-VALIDATION.md`
- `12-POST-SWITCH-VALIDATION.md`
- `12-ROLLBACK-VALIDATION.md`
- `12-SUMMARY.md` or per-plan summaries
- `12-RELEASE-NOTES.md` or `12-MIGRATION-NOTES.md`

3. User-facing docs, if they exist

- `README.md`
- CLI usage docs
- existing migration/release notes

Required content:

- v2 is now default.
- `DEFAULT_PATHS` now point to:
  - `data/taxonomy/taxonomy-seed.v2.json`
  - `data/inference/curated_relations.v2.json`
  - `data/inference/accord_map.v2.json`
  - `data/compiled/v2`
  - version `2.0.0`
- `data/compiled/v2` is the official v2 artifact set.
- `data/compiled/v1` remains baseline/archive.
- v1 inputs remain preserved.
- rollback to v1 is documented and validated.
- soft findings accepted by Phase 11 remain documented/accepted.
- `ylang ylang -> ylang_ylang` remains a legacy alias exception, not resolved by this phase.
- explicit v1 compile remains possible through explicit paths.
- the change was approved by `12-FINAL-APPROVAL.md`.

Rules:

- Docs must not say v1 was removed.
- Docs must not say v2 physically replaced `data/compiled/v1`.
- Docs must not hide rollback.
- Docs must not present soft findings as resolved if they were only `accepted_with_policy`.
- Docs must not start new taxonomy curation.
- Docs must not alter seed/data inputs.
- A broad documentation sweep remains out of scope unless a document would be broken by obsolete default references.

Current context-gathering state:

- This records the future docs/release-note policy only.
- README/user-facing docs have not been changed by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-44:** Phase 12 will use minimal release/migration documentation, not a broad sweep.
- **SWITCH-D-45:** GSD tracking and Phase 12 validation/release docs will be updated to reflect v2 default.
- **SWITCH-D-46:** README/CLI docs will be updated only if they exist and mention impacted defaults/usage.
- **SWITCH-D-47:** Release notes must declare v2 default, official `data/compiled/v2`, preserved v1 baseline and validated rollback.
- **SWITCH-D-48:** Docs must not claim v1 was removed or soft findings resolved when they were only accepted by policy.
- **SWITCH-D-49:** Docs/release notes do not authorize new taxonomy curation.

---

## 9. Validation Gates

### Full Staged Validation Gate Policy

**User selection:** Full staged validation gates (option 1).

Phase 12 will use complete validation gates separated by execution stage. Any hard gate failure blocks the next stage.

### Gate 0 - Final Approval Gate

Before any mutation, hard requirements:

- `12-FINAL-APPROVAL.md` exists.
- `approval_status: approved_for_default_switch`.
- `data_compiled_v2_publication: approved`.
- `default_paths_switch: approved`.
- `rollback_required: true`.
- `v1_baseline_preservation_required: true`.
- `chat_approval_insufficient: true`.

Hard failures:

- approval absent
- approval incomplete
- approval only in chat

### Gate 1 - Pre-Switch Revalidation Gate

Before creating `data/compiled/v2`, hard requirements:

- typecheck passes
- tests pass
- build passes
- explicit v1 compile in `/tmp/opencode/taxonomy-phase12-switch/v1-baseline`
- explicit v2 compile in `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`
- repeat v2 compile in `/tmp/opencode/taxonomy-phase12-switch/v2-candidate-repeat`
- `cmp -s` confirms determinism for the three v2 artifacts
- hard failures: none
- soft findings remain dispositioned
- legacy alias exception policy remains explicit
- `isolated_subfamilies = 0`
- review_queue distribution/severity remains documented
- `data/compiled/v2` does not exist before publication
- `DEFAULT_PATHS` still point to v1 before switch
- protected v1 diff is clean

Hard failures:

- any test/typecheck/build/compile failure
- repeated v2 compile diverges
- `data/compiled/v2` already exists before publication
- `DEFAULT_PATHS` already point to v2 before switch
- protected v1 diff is not clean

### Gate 2 - Official V2 Artifact Publication Gate

After pre-switch validation and before `DEFAULT_PATHS` switch, hard requirements:

- publish only `data/compiled/v2/taxonomy.json`
- publish only `data/compiled/v2/descriptor_aliases.json`
- publish only `data/compiled/v2/similarity_matrix.json`
- official v2 artifacts validate schema/status/quality gates
- official v2 artifacts are equivalent to validated temporary v2 output
- `generated_at` follows approved policy
- `data/compiled/v1` remains intact
- v1/v2 input files remain without diff
- `descriptor_aliases.seed.json` remains without diff

Hard failures:

- official v2 artifact absent
- unexpected extra artifact in `data/compiled/v2`
- v2 artifact not equivalent to validated temp output
- schema/status/quality gate failure
- any protected v1 diff
- any seed/input file diff

### Gate 3 - DEFAULT_PATHS Switch Gate

After `data/compiled/v2` exists and validates, hard requirements:

- alter only `src/cli/parse_args.ts`
- alter all five fields together:
  - `seedPath` to `data/taxonomy/taxonomy-seed.v2.json`
  - `relationsPath` to `data/inference/curated_relations.v2.json`
  - `accordsPath` to `data/inference/accord_map.v2.json`
  - `outputDir` to `data/compiled/v2`
  - `version` to `2.0.0`
- no partial switch
- no seed/input changes
- no `data/compiled/v1` changes

Hard failures:

- partial switch
- outputDir v2 with inputs v1
- inputs v2 with outputDir v1
- change outside the five approved fields
- seed/data input diff
- `data/compiled/v1` diff

### Gate 4 - Post-Switch Validation Gate

After `DEFAULT_PATHS` switch, hard requirements:

- `DEFAULT_PATHS` point to v2
- default version is `2.0.0`
- default `outputDir` is `data/compiled/v2`
- default compile uses v2 and writes to `data/compiled/v2`
- explicit v1 compile still works in `/tmp/opencode/taxonomy-phase12-switch/v1-after-switch`
- tests pass
- typecheck passes
- build passes
- official v2 artifacts exist and validate
- `data/compiled/v1` remains preserved
- release/migration docs exist

Hard failures:

- default compile still uses v1
- default compile writes to `data/compiled/v1`
- explicit v1 compile fails
- v1 baseline absent
- docs/release notes absent or incorrect

### Gate 5 - Rollback Dry-Run Gate

Before closing Phase 12, hard requirements:

- rollback dry-run in a temporary environment
- rollback restores `DEFAULT_PATHS` to v1:
  - `seedPath` v1
  - `relationsPath` v1
  - `accordsPath` v1
  - `outputDir: data/compiled/v1`
  - `version: 1.0.0`
- rollback validates preserved v1 inputs
- rollback validates preserved `data/compiled/v1`
- explicit v1 compile passes in `/tmp`
- rollback does not delete `data/compiled/v2`
- report records `rollback_success: true`

Hard failures:

- rollback dry-run fails
- rollback depends only on git revert
- rollback deletes `data/compiled/v2`
- rollback does not restore v1 `DEFAULT_PATHS`
- rollback does not validate v1 artifacts

### Gate 6 - Final Release Documentation Gate

Before closing Phase 12, hard requirements:

- `12-POST-SWITCH-VALIDATION.md` exists
- `12-ROLLBACK-VALIDATION.md` exists
- `12-RELEASE-NOTES.md` or `12-MIGRATION-NOTES.md` exists
- docs declare:
  - v2 is default
  - `data/compiled/v2` is official artifact set
  - `data/compiled/v1` remains baseline/archive
  - rollback was validated
  - soft findings accepted with policy were not automatically resolved
  - `ylang ylang -> ylang_ylang` remains legacy alias exception

Hard failures:

- docs say v1 was removed
- docs hide rollback
- docs claim soft findings were resolved when they were not
- docs authorize new taxonomy curation

### Global Hard Blockers

Execution must stop on:

- missing persisted final approval
- hard gate failure in any stage
- diff outside allowlist
- mutation of seed/data input
- mutation of `data/compiled/v1`
- creation of unexpected artifacts
- partial `DEFAULT_PATHS` switch
- rollback dry-run failure
- missing post-switch report
- missing release/migration notes

Current context-gathering state:

- This records the future validation gate policy only.
- No validation commands have been run by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-50:** Phase 12 will use full staged validation gates.
- **SWITCH-D-51:** Final approval, pre-switch revalidation, artifact publication, `DEFAULT_PATHS` switch, post-switch validation, rollback dry-run and release docs will have separate gates.
- **SWITCH-D-52:** Any hard gate failure blocks the next stage.
- **SWITCH-D-53:** `data/compiled/v2` may be created only after Gate 1 passes.
- **SWITCH-D-54:** `DEFAULT_PATHS` switch may occur only after Gate 2 passes.
- **SWITCH-D-55:** Phase 12 may close only if rollback dry-run passes and records `rollback_success: true`.
- **SWITCH-D-56:** Diff outside the allowlist is a hard blocker.
- **SWITCH-D-57:** Mutation of v1 baseline or seed/input files is a hard blocker.
- **SWITCH-D-58:** Incorrect or missing docs/release notes are a hard blocker for phase closure.

---

## 10. Commit Strategy

### Staged Commit Sequence Policy

**User selection:** Staged commit sequence (option 1).

Phase 12 will use a sequence of commits by gate/stage to make review, bisect and rollback easier. Each commit must represent a validated and reversible stage.

Recommended commit sequence:

1. Approval + pre-switch validation docs

Commit:

- `docs(12): record final approval and pre-switch validation`

May include:

- `12-FINAL-APPROVAL.md`
- `12-PRE-SWITCH-VALIDATION.md`
- summaries for the corresponding plan
- GSD tracking if needed

Must not include:

- `data/compiled/v2`
- `src/cli/parse_args.ts`
- seed/data input changes

2. Official v2 artifact publication

Commit:

- `build(data): publish compiled v2 taxonomy artifacts`

May include only:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`
- publication summary/validation doc

Must not include:

- `src/cli/parse_args.ts`
- `data/compiled/v1`
- seed/input files
- broad unrelated docs

3. `DEFAULT_PATHS` switch

Commit:

- `feat(cli): switch taxonomy defaults to v2`

May include:

- `src/cli/parse_args.ts`
- default-path test changes if necessary

Allowed changes:

- `seedPath` to v2
- `relationsPath` to v2
- `accordsPath` to v2
- `outputDir` to `data/compiled/v2`
- `version` to `2.0.0`

Must not include:

- artifact publication
- seed/input changes
- unrelated docs

4. Docs and release notes

Commit:

- `docs(12): document v2 default migration and rollback`

May include:

- `12-RELEASE-NOTES.md` or `12-MIGRATION-NOTES.md`
- README/CLI docs if necessary
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- post-switch summary docs

Must not include:

- code changes
- seed/input changes
- compiled v1 changes

5. Post-switch and rollback validation closeout

Commit:

- `test(12): record post-switch and rollback validation`

May include:

- `12-POST-SWITCH-VALIDATION.md`
- `12-ROLLBACK-VALIDATION.md`
- final summary/validation status
- test updates if strictly necessary

Must not include:

- new taxonomy curation
- changes to v1 baseline
- changes to v2 seed/inference inputs

Rules:

- Do not mix artifact publication and `DEFAULT_PATHS` switch in the same commit.
- Do not mix approval/prevalidation with mutation.
- Do not commit diffs outside the allowlist.
- Each commit must pass relevant gates before advancing.
- If a gate fails, stop before the next commit.
- `graphify-out/*` and unrelated changes must not be included.
- v1 protected paths must never enter commits.
- Final commit may occur only after rollback dry-run records `rollback_success: true`.

Validation per commit:

- After each commit, run protected diff for v1.
- After artifact commit, confirm `data/compiled/v2` exists and validates.
- After `DEFAULT_PATHS` commit, confirm defaults point to v2.
- After docs commit, confirm docs do not say v1 was removed.
- After rollback validation commit, confirm rollback dry-run is documented and approved.

Current context-gathering state:

- This records the future commit strategy only.
- No commits have been created by this discussion step.
- No mutation is authorized by this discussion-log entry.

### Decisions

- **SWITCH-D-59:** Phase 12 will use a staged commit sequence.
- **SWITCH-D-60:** Artifact publication and `DEFAULT_PATHS` switch must be separate commits.
- **SWITCH-D-61:** Approval/pre-switch validation must occur before any mutation commit.
- **SWITCH-D-62:** Each commit must correspond to a validated gate and pass protected diff checks.
- **SWITCH-D-63:** Diffs outside the allowlist or unrelated changes must not be committed.
- **SWITCH-D-64:** Final commit may occur only after post-switch validation and rollback dry-run with `rollback_success: true`.
