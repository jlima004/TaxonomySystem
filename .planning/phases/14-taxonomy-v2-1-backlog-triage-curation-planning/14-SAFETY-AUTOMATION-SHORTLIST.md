---
phase: 14-taxonomy-v2-1-backlog-triage-curation-planning
artifact: safety-automation-shortlist
status: read_only_shortlist
non_authorizing: true
source_rows: [CI-01, CI-02, CI-03]
protected_paths_touched: none
---

# Phase 14 Safety Automation Shortlist

This shortlist is a planning aid for possible future safety automation. It authorizes no script, test, CI, release behavior, source, data, artifact, default-path or Graphify change.

## Candidate Guards

| guard | local_proof_command | expected_failure_mode | protected_paths_unchanged | rollback_or_removal_path |
|---|---|---|---|---|
| Protected diff guard | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` | Fails when a future plan accidentally mutates curated inputs, official artifacts or CLI defaults. | `data/taxonomy/**`, `data/inference/**`, `data/compiled/v1/**`, `data/compiled/v2/**`, `src/cli/parse_args.ts` | Remove the guard script/test added by a future plan; no data rollback should be needed because the guard is non-mutating. |
| Graphify staging guard | `git status --short -- graphify-out` | Fails or reports contamination when `graphify-out/*` has changes that a future plan might accidentally stage or commit without an artifact plan. | `graphify-out/*` | Remove the future guard or narrow its allowlist if a later Graphify artifact plan explicitly authorizes Graphify changes. |
| Tmp-only compile guard | Future proof command should compile only to `/tmp/opencode/taxonomy-phase14-smoke/...` with fixed `--generated-at`, then re-run protected diff. | Fails if compile validation writes official `data/compiled/v1` or `data/compiled/v2` outputs, omits deterministic timestamp, or relies on undocumented external state. | `data/compiled/v1/**`, `data/compiled/v2/**` | Delete the future guard and temporary `/tmp` outputs; no repository artifact rollback should be needed. |
| `DEFAULT_PATHS` v2 assertion | Existing local proof analog: `src/tests/curation/v1_v2_comparison.test.ts` asserts `DEFAULT_PATHS.seedPath`, relation path, accord path, output dir and version. | Fails if a future change regresses the default seed, inference inputs, output directory or version away from v2. | `src/cli/parse_args.ts`, `data/taxonomy/**`, `data/inference/**`, `data/compiled/v2/**` | Revert only the future assertion change if it is too broad; do not change defaults without a separate approved plan. |
| Explicit v1 fallback assertion | Existing local proof analog: `src/tests/curation/v1_v2_comparison.test.ts` compiles v1 baseline with explicit paths and deterministic timestamp. | Fails if explicit v1 fallback behavior stops compiling in a temp output while v2 remains default. | `data/compiled/v1/**`, `data/compiled/v2/**`, `src/cli/parse_args.ts` | Remove or narrow the future assertion; any fallback behavior change requires a separate migration/rollback plan. |

## Exclusions

| excluded_scope | reason |
|---|---|
| Full release pipeline automation | `CI-04` is broad, high risk and marked `follow_up_later`; BACKLOG-D-205, D-209 and D-213 defer it. |
| Data quality mutation guards that also edit data | Phase 14 prioritizes non-mutating protected guards first; curation/data execution requires persisted approval and a separate allowlist. |
| Graphify lifecycle policy changes | Graphify mutation, cleanup, ignore-policy or generated artifact commits require a separate artifact plan. |

## Non-Authorization

This shortlist does not approve implementation of any guard. It records candidate guard shapes and proof paths for future planning only.
