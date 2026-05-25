---
phase: 13
slug: 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption
status: stabilization_preflight_approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-25
execution_readiness: ready_for_stabilization_only_execution
---

# Phase 13 - Validation Strategy

> Per-phase validation contract for post-promotion stabilization execution. Final preflight review approved Phase 13 for stabilization-only execution: evidence/report/summary artifacts under this Phase 13 directory may be written, while protected source/data/generated paths remain no-edit.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest via `src/package.json`, TypeScript/build scripts, CLI smoke compiles, source assertions, artifact assertions and git diff gates |
| Config file | `src/vitest.config.ts` |
| Quick run command | `cd src && npm run typecheck && npm test -- tests/curation/v1_v2_comparison.test.ts tests/curation/taxonomy_seed_v2.test.ts tests/cli/compile.test.ts` |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` |
| Smoke output root | `/tmp/opencode/taxonomy-phase13-smoke` |
| Execution note | Commands are planned for Phase 13 execution only; this validation document did not run them. |

---

## Sampling Rate

- After every task: run the task-specific source/doc/artifact assertion and record evidence in the task artifact.
- After every plan: run protected diff checks for seed/inference/alias inputs, `src/cli/parse_args.ts`, `data/compiled/v1`, `data/compiled/v2`, and `graphify-out/*` status where relevant.
- After smoke validation: run the full protected diff gate before and after both `/tmp` compiles.
- Before final closure: aggregate all evidence in `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` and confirm no checklist area is `blocker`.
- Max feedback latency: one task; no follow-up plan may treat missing evidence from an earlier task as pass.

---

## Global Hard Gates

| Gate | Owner Plan | Required Evidence | Blocking Condition |
|------|------------|-------------------|--------------------|
| Gate 1 - Consumer and docs inventory | 13-01 | `13-01-CONSUMER-INVENTORY.md` lists all search targets, classifies v1 references, and identifies blocking docs inconsistencies | Unclassified v1 reference, current docs implying v1 is default, docs claiming v1 removal, docs claiming soft findings resolved, or missing inventory scope |
| Gate 2 - Safe default/fallback smoke | 13-02 | `13-02-SMOKE-VALIDATION.md` records default-v2 `/tmp` compile, explicit-v1 `/tmp` compile, output file/version checks, quality status and protected diffs | Smoke command failure, output outside `/tmp`, wrong version, missing artifact, quality gate failure, or protected path diff |
| Gate 3 - Generated artifact contamination policy | 13-03 | `13-03-GENERATED-ARTIFACT-POLICY.md` records CI/hooks/script audit, `graphify-out/*` status and policy | `graphify-out/*` mutation/staging without explicit plan, undocumented hook-generated diffs, or missing policy decision |
| Gate 4 - Release confidence and backlog boundary | 13-04 | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` contains nine checklist areas and Phase 14 backlog classifications | Any active `blocker`, unresolved protected diff, Phase 14 curation executed in Phase 13, or backlog mixed into stabilization scope |

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command / Check | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|---------------------------|-------------|--------|
| 13-01-01 | 01 | 1 | POST-01, POST-05 | T13-stale-consumer-docs | In-repo default/path/artifact references are inventoried and classified without auto-fixing | audit/doc assertion | `rg -n "DEFAULT_PATHS|taxonomy-seed\\.v1\\.json|taxonomy-seed\\.v2\\.json|curated_relations\\.v1\\.json|curated_relations\\.v2\\.json|accord_map\\.v1\\.json|accord_map\\.v2\\.json|data/compiled/v1|data/compiled/v2|version: 1\\.0\\.0|version: 2\\.0\\.0|npm run compile|--seed|--relations|--accords|--out|--version" README.md src .planning` | `13-01-CONSUMER-INVENTORY.md` | planned |
| 13-01-02 | 01 | 1 | POST-05, POST-08 | T13-misleading-release-docs | Blocking docs inconsistencies are identified as blockers or backlog without editing docs silently | doc assertion | Search current docs/release notes for forbidden claims: v1 default, v1 removed, v2 replaced v1, soft findings resolved, or Phase 13 curation | `13-01-CONSUMER-INVENTORY.md` | planned |
| 13-02-01 | 02 | 2 | POST-02, POST-04, POST-06 | T13-default-overwrite | Default v2 smoke writes only to `/tmp` and leaves official artifacts unchanged | command/artifact/diff assertion | `cd src && npm run compile -- --out /tmp/opencode/taxonomy-phase13-smoke/default-v2 --generated-at 2026-01-01T00:00:00.000Z` plus output/version checks | `13-02-SMOKE-VALIDATION.md` | planned |
| 13-02-02 | 02 | 2 | POST-03, POST-04, POST-06 | T13-fallback-false-positive | Explicit v1 fallback uses complete flags, not `DEFAULT_PATHS`, and writes only to `/tmp` | command/artifact/diff assertion | `cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z` | `13-02-SMOKE-VALIDATION.md` | planned |
| 13-02-03 | 02 | 2 | POST-02, POST-06 | T13-default-drift | `DEFAULT_PATHS` remain v2 and `src/cli/parse_args.ts` is not edited | source/diff assertion | Assert `DEFAULT_PATHS.seedPath`, `relationsPath`, `accordsPath`, `outputDir`, `version` equal v2 values; run protected diff gate | `13-02-SMOKE-VALIDATION.md` | planned |
| 13-03-01 | 03 | 2 | POST-04, POST-07 | T13-generated-contamination | CI/hooks/npm scripts and generated artifacts are audited without running Graphify | audit/status assertion | `git status --short -- graphify-out` and `git diff --name-only -- graphify-out`; inspect package scripts and CI/hook locations | `13-03-GENERATED-ARTIFACT-POLICY.md` | planned |
| 13-03-02 | 03 | 2 | POST-06, POST-07 | T13-staging-contamination | `graphify-out/*` remains protected/plan-gated and excluded from Phase 13 commits unless explicitly planned | policy/source assertion | Policy table states allowed mutation = none for Phase 13; commit hygiene requires explicit staging of Phase 13 artifacts only | `13-03-GENERATED-ARTIFACT-POLICY.md` | planned |
| 13-04-01 | 04 | 3 | POST-01..POST-08 | T13-false-release-confidence | Final checklist aggregates evidence for all nine required areas and blocks closure on active blockers | doc assertion | Checklist rows include `area`, `status`, `evidence`, `commands_run`, `protected_diff_result`, `artifacts_touched`, `follow_up`, `blocker_reason` | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` | planned |
| 13-04-02 | 04 | 3 | POST-08 | T13-backlog-scope-creep | Phase 14 backlog is captured without executing curation or soft finding cleanup | doc assertion | Backlog entries are classified as `follow_up_phase_14`, `follow_up_later`, `accepted_with_policy` or `not_in_scope_phase_13` | `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` | planned |
| 13-ALL-01 | all | 3 | POST-06 | T13-protected-drift | Protected source/input/artifact paths remain unchanged through Phase 13 | protected diff | `git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts` | all Phase 13 evidence artifacts | planned |

---

## Wave 0 Requirements

- [x] `13-CONTEXT.md` captures Phase 13 boundaries, protected paths and decisions.
- [x] `13-PREFLIGHT.md` records `execution_readiness: ready_for_stabilization_only_execution` after final preflight approval.
- [x] `13-RESEARCH.md` exists and includes a Validation Architecture section.
- [x] `13-PATTERNS.md` exists and maps Phase 13 evidence artifacts to prior analogs.
- [x] `13-VALIDATION.md` defines this validation contract.
- [x] Execution evidence artifacts `13-01-CONSUMER-INVENTORY.md` through `13-04-RELEASE-CONFIDENCE-CHECKLIST.md` are execution outputs, not planning outputs.

---

## Final Preflight Review

Review date: 2026-05-25

Result: approved for `stabilization-only` execution. Do not execute Phase 14 curation or backlog work during Phase 13.

| Check | Result | Evidence |
|-------|--------|----------|
| `files_modified` scope | pass | Plans 13-01 through 13-04 list only Phase 13 evidence docs: `13-01-CONSUMER-INVENTORY.md`, `13-02-SMOKE-VALIDATION.md`, `13-03-GENERATED-ARTIFACT-POLICY.md`, `13-04-RELEASE-CONFIDENCE-CHECKLIST.md`; plan outputs are Phase 13 summaries only. |
| Smoke compiles write only to `/tmp` | pass | Plan 13-02 forbids bare `npm run compile` and uses only `/tmp/opencode/taxonomy-phase13-smoke/default-v2` and `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback` for smoke output. |
| Protected paths unchanged | pass | Preflight protected diff command exited 0 for taxonomy inputs, inference inputs, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`. |
| `data/compiled/v1` and `data/compiled/v2` overwrite safety | pass | Plan 13-02 requires pre/post protected diff gates and `/tmp` smoke output; no plan authorizes official compiled artifact writes. |
| `src/cli/parse_args.ts` no-edit | pass | Plans assert/read `DEFAULT_PATHS` but forbid edits and include `src/cli/parse_args.ts` in protected diff gates. |
| `graphify-out/*` no mutation/commit | pass with existing dirty state | Current workspace has existing `graphify-out/*` diffs; Plan 13-03 treats them as contamination evidence only and prohibits mutation, staging, revert, clean or commit without a separate explicit Graphify plan. |
| Phase 14 backlog boundary | pass | Plan 13-04 captures backlog classifications only and forbids curation, soft-finding cleanup, alias cleanup, review queue reduction or future-work execution. |

Execution allowlist for Phase 13 is limited to:

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-01-CONSUMER-INVENTORY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-01-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SMOKE-VALIDATION.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-02-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-GENERATED-ARTIFACT-POLICY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-SUMMARY.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-04-RELEASE-CONFIDENCE-CHECKLIST.md`
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-04-SUMMARY.md`

All other files are read-only for Phase 13 unless a future explicit plan changes this validation contract.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Docs consistency judgment | POST-05 | Some docs references are historical and should not block only because they mention old states | Review `13-01-CONSUMER-INVENTORY.md` classifications before closure |
| Graphify policy choice | POST-07 | The long-term policy can be archive-only, regenerable, ignored or plan-gated; Phase 13 can only lock its own execution policy | Confirm `13-03-GENERATED-ARTIFACT-POLICY.md` matches intended project policy before committing generated artifacts later |
| Release confidence approval | POST-08 | Closure requires human confidence that no active blockers remain | Review `13-04-RELEASE-CONFIDENCE-CHECKLIST.md`; do not execute Phase 14 backlog in Phase 13 |

---

## Validation Sign-Off

- [x] All planned tasks have automated assertions, artifact evidence, protected diff checks or explicit manual gates.
- [x] Sampling continuity prevents smoke validation from proceeding without protected diff checks.
- [x] Wave 0 covers research, patterns and validation planning artifacts.
- [x] No watch-mode commands are used.
- [x] No new dependencies are required.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** ready_for_stabilization_only_execution. Phase 13 may execute Plans 13-01 through 13-04 only within the evidence/report/summary allowlist above. Protected paths, official compiled artifacts, `src/cli/parse_args.ts`, `graphify-out/*` and Phase 14 backlog work remain out of execution scope.
