---
phase: 15
slug: post-triage-safety-guards-current-state-docs-cleanup
status: context_gathering
execution_readiness: not_ready_for_execution
created: 2026-05-26
updated: 2026-05-26
protected_paths_touched: none
---

# Phase 15 Context

## Domain

Phase 15 is a post-triage safety/control phase. It converts a small, safe part of Phase 14's non-authorizing backlog outputs into future controlled execution planning, with operational protection after the v2 default switch as the first priority.

The first planning front is `Protected boundary guards`: a non-mutating protected diff guard plus a separate Graphify staging/contamination guard. Docs/help cleanup remains eligible later, but must stay separate unless explicitly approved in a later discussion/plan.

## Canonical Refs

Downstream researcher and planner agents must read these before planning Phase 15.

### Phase 15 Current Context

- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md` — This canonical context and decisions `SAFE-D-01` through `SAFE-D-21`.
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-DISCUSSION-LOG.md` — Human audit trail only; do not use instead of this context.
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-PREFLIGHT.md` — Non-executable preflight boundary, if present.

### Upstream Phase 14 Handoff

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CLOSURE.md` — Phase 14 closure and handoff; confirms Phase 15+ receives real execution backlog only after separate approval and gates.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` — Source matrix for `CI-01`, `CI-02`, `CI-03`, `DOC-01` and protected boundary policy.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md` — Source for candidate safety guard shapes and proof commands.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DOCS-HELP-SHORTLIST.md` — Non-authorizing docs/help current-state shortlist; later/separate front only.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md` — Phase 14 validation and protected diff/hygiene expectations.

### Project State And Requirements

- `.planning/PROJECT.md` — Current active Phase 15 status and project constraints.
- `.planning/REQUIREMENTS.md` — Phase 14/15 requirement traceability and prior protected boundary decisions.
- `.planning/ROADMAP.md` — Phase 15 goal, status and plan placeholder.
- `.planning/STATE.md` — Current GSD tracking and prior decisions.

### Existing Code And Tests

- `src/cli/parse_args.ts` — `DEFAULT_PATHS` source of truth; protected/no-edit in the first Phase 15 guard front.
- `src/tests/curation/v1_v2_comparison.test.ts` — Existing `DEFAULT_PATHS` v2 and explicit v1 fallback assertions; not part of first front, but relevant for later defaults/fallback guards.
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Existing v2 seed/default preservation patterns.
- `src/tests/cli/parse_args.test.ts` — Existing CLI defaults parsing tests.
- `src/tests/cli/compile.test.ts` — Existing temp-output compile test pattern; tmp-only compile guard is deferred from first front.
- `src/package.json` — npm scripts for `build`, `typecheck`, `test` and `compile` if later plans need them.

## Prior Phase Facts

- Phase 14 closed as `read_only_report_only` execution.
- Phase 14 did not execute curation, compile/smoke, safety automation implementation or docs/help fixes.
- Phase 14 did not alter taxonomy seed inputs, alias seed, relation/accord inputs, compiled v1/v2 artifacts, `src/cli/parse_args.ts` or `graphify-out/*`.
- Phase 14 created non-authorizing shortlists for docs/help and safety automation.
- Phase 15+ receives any real execution backlog only after separate approval, explicit allowlist, validation gates and rollback/restore policy.
- The Phase 15 directory has one canonical spelling: `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/`. No duplicate `cleanUP` directory was found during this context update.

## Decisions

### Phase Priority And Execution Boundary

- `SAFE-D-01`: Phase 15 should prioritize `Safety automation guards` first.
- `SAFE-D-02`: The first safety guard planning front should stay non-mutating and operationally protective.
- `SAFE-D-03`: Docs/help current-state cleanup remains eligible, but should not be mixed into the first safety guard plan unless explicitly approved later.
- `SAFE-D-04`: If both safety automation and docs/help cleanup proceed in Phase 15, they should be separated into distinct plans.
- `SAFE-D-05`: Phase 15 remains `not_ready_for_execution` until research/pattern/validation/plan artifacts are explicitly authorized and created in a later step.
- `SAFE-D-06`: No taxonomy curation, descriptor promotion, alias add/remove/remap, relation/accord edit, official artifact mutation, `DEFAULT_PATHS` change, Graphify mutation, compile/smoke, safety implementation or docs/help fix is authorized by this context capture.

### First Safety Guard Subset

The first safety guard subset Phase 15 should plan is `Protected boundary guards`: a protected diff guard plus a separate Graphify staging/contamination guard. Defaults/fallback guards and tmp-only compile guard are deferred from the first front.

### Protected Diff Guard

- `SAFE-D-07`: The protected diff guard initial boundary is the full Phase 14 boundary.
- `SAFE-D-08`: The protected diff boundary includes `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`.
- `SAFE-D-09`: Taxonomy inputs and inference inputs must not be excluded from the first protected diff guard.
- `SAFE-D-10`: The protected diff guard must not include `graphify-out/*`; Graphify is handled by a separate staging/contamination guard.
- `SAFE-D-11`: The protected diff guard is non-mutating and must not clean, revert, stage, compile, smoke-test or alter files.

Command-base expected for planning:

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

### Graphify Staging Guard

- `SAFE-D-12`: The Graphify staging guard initial behavior is `report_and_fail`.
- `SAFE-D-13`: Any status line for `graphify-out/*` must make the guard fail/report potential commit contamination.
- `SAFE-D-14`: The Graphify guard must not clean, revert, stage, commit, regenerate Graphify, alter hooks or alter `.gitignore`.
- `SAFE-D-15`: Dirty Graphify state is a commit-contamination risk, not taxonomy correctness evidence.
- `SAFE-D-16`: Any corrective Graphify action requires a separate generated-artifact plan with explicit allowlist and diff policy.

Command-base expected for planning:

```bash
git status --short -- graphify-out
```

Success criterion: empty output for `graphify-out/*`.

Failure criterion: any line for `graphify-out/*`, including modified or untracked paths.

Expected failure message should explain that `graphify-out/*` is dirty, the guard will not clean or revert it, Graphify can only be handled by an explicit generated-artifact plan, and the finding is commit hygiene risk rather than taxonomy evidence.

### First-Front Validation Policy

- `SAFE-D-17`: The first protected boundary guards plan should use `local_proof_only` validation.
- `SAFE-D-18`: Local proof must record exact commands, exit codes, relevant stdout/stderr and expected failure messages.
- `SAFE-D-19`: Versioned unit tests are not mandatory for the first protected boundary guard plan.
- `SAFE-D-20`: Unit tests may be considered later if these guards become permanent scripts or CI integration.
- `SAFE-D-21`: Local proof must confirm no compile/smoke command was run and no protected paths or `graphify-out/*` were modified, cleaned, reverted, staged, committed or regenerated.

## Candidate Safety Guard Fronts

Source: `14-SAFETY-AUTOMATION-SHORTLIST.md` and `14-BACKLOG-MATRIX.md` rows `CI-01`, `CI-02`, `CI-03`.

### First Front: Protected Boundary Guards

- Protected diff guard: plan first, using the full Phase 14 protected boundary and the command recorded above.
- Graphify staging guard: plan first, separately from protected diff, using `report_and_fail` behavior and the command recorded above.

### Deferred Safety Fronts

- `DEFAULT_PATHS` v2 assertion: future planning may consider tests/assertions that protect the post-Phase 12 v2 defaults without editing `src/cli/parse_args.ts` behavior.
- Explicit v1 fallback assertion: future planning may consider tests/assertions that preserve explicit v1 fallback behavior in temporary output only.
- Tmp-only compile guard: future planning may consider proof that any compile validation writes only to `/tmp/opencode/...`, never official compiled directories.

## Candidate Docs/Help Front

Source: `14-DOCS-HELP-SHORTLIST.md` and `14-BACKLOG-MATRIX.md` row `DOC-01`.

- CLI help title/default-version wording may be checked later for current-state accuracy.
- Current usage docs may be checked later for stale statements that guide present consumers incorrectly.
- Broad historical docs rewrites remain out of scope.
- Any docs/help fix requires a separate approved plan and should preserve historical audit records.

## Codebase Context

### Reusable Assets

- `src/cli/parse_args.ts` exposes `DEFAULT_PATHS`, but is protected/no-edit for the first Phase 15 guard front.
- `src/tests/curation/v1_v2_comparison.test.ts` already asserts v2 defaults and explicit v1 fallback patterns; useful later, but not the first protected boundary guard front.
- `src/tests/cli/parse_args.test.ts` covers CLI default parsing; useful later if defaults/fallback assertions are planned.
- `src/tests/cli/compile.test.ts` uses temporary output patterns; useful later if tmp-only compile guard is planned.
- `src/package.json` provides `npm run typecheck`, `npm test`, `npm run build` and `npm run compile` from the `src/` package.

### Established Patterns

- Existing project conventions emphasize TypeScript strict, zero runtime dependencies, pure functions, deterministic behavior and no semicolons.
- Smoke compiles and before/after validations should write to `/tmp` with fixed `generated_at` when compile validation is in scope.
- Protected diff checks are mandatory around any executable work touching protected boundaries.
- Generated Graphify outputs are protected/plan-gated and should not enter commits without an explicit artifact plan.

### Integration Points

- The first Phase 15 plan should likely be a small safety-guard/local-proof plan, not broad CI/release automation.
- The planner should not create `15-RESEARCH.md`, `15-PATTERNS.md`, `15-VALIDATION.md` or `15-01-PLAN.md` during context capture; these are next-step artifacts only after this context is accepted.
- Any future execution must stage explicit files only and exclude `graphify-out/*` unless a dedicated generated-artifact plan authorizes it.

## Hard Boundaries

Do not alter:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Do not execute yet:

- Curation.
- Descriptor promotion.
- Alias add/remove/remap.
- Relation or accord changes.
- Compile/smoke commands.
- Safety automation implementation.
- Docs/help fixes.
- Graphify cleanup, revert, regeneration, staging or commit.
- Broad CI/release pipeline automation.

## Open Questions For Next Workflow

- Research/planning must decide how to represent the two guards minimally: shell commands in a planning artifact, a small local script, a package script, or another low-risk mechanism.
- Research/planning must define the exact failure text and local proof artifact for the first plan.
- Defaults/fallback assertions, tmp-only compile guard and docs/help cleanup remain possible later fronts, but are not part of the first protected boundary guard plan.
