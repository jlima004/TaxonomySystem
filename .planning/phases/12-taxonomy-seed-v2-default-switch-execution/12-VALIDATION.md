---
phase: 12
slug: 12-taxonomy-seed-v2-default-switch-execution
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-24
execution_readiness: gate_0_only
---

# Phase 12 - Validation Strategy

> Per-phase validation contract for future execution sampling. This file approves only Gate 0 final approval capture after explicit human authorization. It does not authorize artifact publication, `DEFAULT_PATHS` changes, `data/compiled/v2` creation, seed/data input mutation, v2 promotion, or Plans 12-02 through 12-05.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest plus TypeScript/build, CLI compile commands, source assertions, artifact assertions and git diff gates |
| Config file | `src/vitest.config.ts` |
| Quick run command | `cd src && npm run typecheck && npm test -- tests/cli/parse_args.test.ts tests/curation/v1_v2_comparison.test.ts` |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` |
| Estimated runtime | Unknown until future Gate 1 execution; executors must record actual runtime in validation reports |

---

## Sampling Rate

- After every task commit: run the gate-specific source/assertion checks plus the quick run command when source behavior is touched.
- After every plan wave: run the full suite command and the protected path diff gates for the current stage.
- Before `/gsd-verify-work`: Gate 0 through Gate 6 evidence must exist, and the full suite plus protected diff gates must be green.
- Max feedback latency: one task; no future executor may perform a mutable task without its immediately preceding gate evidence.

---

## Global Hard Gates

| Gate | Owner Plan | Required Evidence | Blocking Condition |
|------|------------|-------------------|--------------------|
| Gate 0 - Final approval | 12-01 | Complete `12-FINAL-APPROVAL.md` with all required approval fields from `12-PREFLIGHT.md` | Missing persisted approval, chat-only approval, or incomplete required fields |
| Gate 1 - Pre-switch revalidation | 12-02 | typecheck, tests, build, explicit v1 temp compile, explicit v2 temp compile, repeated v2 temp compile, `cmp -s` determinism, clean protected diffs, `data/compiled/v2` absent | Any command failure, hard finding, pre-existing `data/compiled/v2`, protected path drift, or stale Phase 11 evidence used as substitute |
| Gate 2 - Official v2 publication | 12-03 | Exactly three official files in `data/compiled/v2`, equivalence to validated temp output, artifact validation, clean v1/input diffs | Extra/missing official files, mismatch with validated temp output, v1/input mutation, or unvalidated generated_at policy |
| Gate 3 - DEFAULT_PATHS switch | 12-04 | Atomic five-field switch in `src/cli/parse_args.ts` only: `seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version` | Partial switch, unrelated source diff, switch before Gate 2 pass, or seed/input/v1 artifact drift |
| Gate 4 - Post-switch validation | 12-04 | Default compile uses v2 and writes to `data/compiled/v2`; explicit v1 compile still works in `/tmp`; typecheck/tests/build pass | Default still points to v1, explicit v1 fallback fails, official v2 invalid, or protected v1 drift |
| Gate 5 - Rollback dry-run | 12-05 | Temporary rollback validation restores v1 defaults, validates v1 compile, preserves `data/compiled/v2`, records `rollback_success: true` | Rollback depends only on git revert, deletes v2 artifacts, fails v1 validation, or lacks persisted evidence |
| Gate 6 - Release documentation | 12-05 | Release/migration docs and final validation reports accurately state v2 default, official v2 artifacts, preserved v1 baseline, rollback path, and accepted soft findings | Docs claim v1 was removed, hide rollback, imply accepted soft findings were resolved, or start new curation |

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command / Check | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|---------------------------|-------------|--------|
| 12-01-01 | 01 | 0 | SWITCH-01, SWITCH-02 | T12-approval-bypass | No mutation can proceed without persisted final approval | source/doc assertion | `test -f .planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-FINAL-APPROVAL.md` plus required field checks | missing until future approval | pending |
| 12-01-02 | 01 | 0 | SWITCH-04, SWITCH-08, SWITCH-11 | T12-protected-drift | v1/input/default paths remain unchanged during approval/preflight | diff assertion | `git diff --exit-code -- data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts` | infrastructure exists | pending |
| 12-02-01 | 02 | 1 | SWITCH-03, SWITCH-04, SWITCH-08 | T12-stale-readiness | Current repository state passes typecheck/tests/build before artifact publication | command assertion | `cd src && npm run typecheck && npm test && npm run build` | infrastructure exists | pending |
| 12-02-02 | 02 | 1 | SWITCH-03, SWITCH-05, SWITCH-08 | T12-temp-compile-contamination | v1 and v2 compile only to `/tmp/opencode/taxonomy-phase12-switch/*`; official paths remain unchanged | command/artifact assertion | Explicit v1/v2/repeat compile commands with `--out /tmp/opencode/taxonomy-phase12-switch/...` and fixed `--generated-at 2026-01-01T00:00:00.000Z` | temp outputs future only | pending |
| 12-02-03 | 02 | 1 | SWITCH-03, SWITCH-05 | T12-nondeterminism | Repeated v2 temp outputs are byte-identical before publication | artifact assertion | `cmp -s` for `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json` between v2 temp and repeat dirs | temp outputs future only | pending |
| 12-02-04 | 02 | 1 | SWITCH-04, SWITCH-06 | T12-early-publication | `data/compiled/v2` is absent before Gate 2 | artifact assertion | `test ! -d data/compiled/v2` | absent now | pending |
| 12-03-01 | 03 | 2 | SWITCH-05, SWITCH-06, SWITCH-08 | T12-artifact-mismatch | Official v2 artifacts are copied/published only from validated temp output | artifact assertion | Verify `data/compiled/v2` contains exactly `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`; compare to validated temp output | future only | pending |
| 12-03-02 | 03 | 2 | SWITCH-04, SWITCH-06, SWITCH-08, SWITCH-11 | T12-publication-scope-creep | Artifact publication commit excludes defaults, seed/input edits and v1 mutations | diff assertion | `git diff --name-only` allowlist audit for `data/compiled/v2/**` plus Phase 12 validation docs only | future only | pending |
| 12-04-01 | 04 | 3 | SWITCH-07, SWITCH-08 | T12-partial-default-switch | `DEFAULT_PATHS` switch changes all five approved fields together and no other defaults | source assertion | Parse/assert `DEFAULT_PATHS.seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version` equal approved v2 values | source exists | pending |
| 12-04-02 | 04 | 4 | SWITCH-03, SWITCH-07, SWITCH-08 | T12-post-switch-regression | Default compile uses v2, explicit v1 fallback still works, and protected v1 stays unchanged | command/diff assertion | Full suite plus default compile and explicit v1 temp compile; protected diff gates | future only | pending |
| 12-05-01 | 05 | 5 | SWITCH-09, SWITCH-11 | T12-rollback-false-positive | Rollback dry-run proves v1 defaults can be restored without deleting official v2 | temporary rollback assertion | Temporary patch/worktree/equivalent asserts v1 defaults, v1 compile, `data/compiled/v2` still present, and `rollback_success: true` | future only | pending |
| 12-05-02 | 05 | 6 | SWITCH-10, SWITCH-11 | T12-doc-misrepresentation | Docs accurately describe v2 default, preserved v1 baseline, validated rollback and accepted soft findings | doc/source assertion | Search docs for required statements and forbidden claims such as unsupported `v1 removed` or soft findings `resolved` | future only | pending |

---

## Wave 0 Requirements

- [x] Wave 0 planning/validation contract is complete and ready only for explicit Gate 0 final approval capture.
- [x] `12-01-PLAN.md` keeps all later mutation blocked until Gate 0 passes.
- [x] Future executors must record actual command outputs and timestamps in Phase 12 validation/reporting docs.
- [x] Existing test infrastructure covers typecheck, tests and build; no new test framework is planned.
- [ ] `12-FINAL-APPROVAL.md` must exist with all required fields before any future mutable plan task is executable.
- [ ] Plans 12-02 through 12-05 remain blocked until Gate 0 passes.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Final approval intent | SWITCH-01 | Approval must be a human governance decision, not inferred from automation or chat | Human curator creates/approves `12-FINAL-APPROVAL.md` with all required fields before Gate 1 can run |
| Soft finding acceptance | SWITCH-01, SWITCH-03, SWITCH-10 | Acceptance of known soft findings is a curatorial/release decision | Confirm final approval and release docs explicitly accept legacy alias and soft finding policies without claiming resolution |
| Release messaging adequacy | SWITCH-10 | Docs must be judged for communication accuracy, not just file existence | Human reviews release/migration docs for v2 default, preserved v1, rollback and accepted soft findings statements |

---

## Validation Sign-Off

- [x] All planned tasks have automated verify commands or explicit manual governance gates.
- [x] Sampling continuity: no mutable future task may proceed without immediately preceding gate evidence.
- [x] Wave 0 identifies missing approval artifact and blocks mutation until present.
- [x] No watch-mode flags are used.
- [x] Feedback latency is bounded to one task/gate.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved_for_gate_0_final_approval_capture_only. Plans 12-02 through 12-05 remain blocked until Gate 0 passes; execution remains blocked until persisted final approval and required preflight gates pass.
