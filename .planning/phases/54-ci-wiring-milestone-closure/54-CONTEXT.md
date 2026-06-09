# Phase 54: CI Wiring & Milestone Closure - Context

**Gathered:** 2026-06-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 54 closes v2.10 by wiring GitHub Actions CI for the `src` package and executing the formal milestone boundary audit. This phase may add `.github/workflows/`, stabilize `src/tests/analysis/stress.test.ts` for cold CI runners, and produce Phase 54 GSD closure artifacts. It must not mutate taxonomy truth, publish or mutate `data/compiled/v2/*`, open FUT-01/FUT-02 curation, or expand into Graphify, scoring, UI, MVP, or Knowledge Engine work.

</domain>

<decisions>
## Implementation Decisions

### Phase Scope & Execution Order
- **D-01:** Phase 54 delivers only CI Wiring & Milestone Closure for v2.10.
- **D-02:** Satisfy CI-01, CI-02, CI-03, CI-04, BOUND-01, BOUND-02, and BOUND-03 before marking the milestone ready for completion.
- **D-03:** Stabilize `src/tests/analysis/stress.test.ts` as the first task because it is a practical blocker for CI-03 on cold runners.

### Stress Test Stabilization (Task 1)
- **D-04:** Preserve the performance-regression intent of `tests/analysis/stress.test.ts`; do not delete the test or skip it without explicit justification.
- **D-05:** Make the test CI-safe through an explicit, auditable mechanism: either a CI/cold-runner timing threshold or reduced analysis load in CI while still detecting gross regressions.
- **D-06:** Do not change the test's core purpose; only adjust threshold, environment detection, or CI-specific load so `npm --prefix src test` is reliable on GitHub Actions.
- **D-07:** The current ceiling constant `CI_SAFE_ANALYSIS_5K_CEILING_MS = 1500` in `src/tests/analysis/stress.test.ts` is the known flake source on cold runners (389/390 observed in v2.10 milestone audit).

### GitHub Actions Workflow
- **D-08:** Create a GitHub Actions workflow under `.github/workflows/`.
- **D-09:** Use reproducible install via `npm ci --prefix src`.
- **D-10:** CI must run, in order after install: `npm --prefix src run typecheck`, `npm --prefix src test`, `npm --prefix src run alias:integrity -- --json`, and `npm --prefix src run verify:integrity -- --json`.
- **D-11:** Include both `alias:integrity` (CI-04 requirement) and `verify:integrity` (official Phase 53 local guardrail) so CI validates the hardened guardrail surface, not only the base command.
- **D-12:** Keep the workflow simple: one job, no complex matrix, no multi-version Node matrix in this phase.

### Trigger & Runtime Policy
- **D-13:** Trigger on `push` and `pull_request` targeting `master`.
- **D-14:** Use Node.js 24 to align with the current project environment.
- **D-15:** Do not introduce multiple Node versions unless planning uncovers a strong compatibility reason.

### Compile & Guardrail Preservation
- **D-16:** Preserve `scripts.compile` exactly as `node dist/cli/compile.js`.
- **D-17:** Do not add `alias:integrity`, `verify:integrity`, or `compile:quality` to the normal compile path.
- **D-18:** Preserve Phase 53 behavior for `verify:integrity` and `compile:quality` (`/tmp/phase53-compile-quality` quality compile + alias proof).

### Boundary Audit Final
- **D-19:** Run a final milestone boundary audit proving v2.10 made no unauthorized changes to: `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/taxonomy/alias_target_exceptions.v1.json`, `data/compiled/v2/*`, Graphify (`graphify-out/**`), `src/scoring`, `src/ui`, and `src/knowledge-engine`.
- **D-20:** Reuse the Phase 53 boundary-diff pattern as the baseline proof mechanism, adapted for Phase 54 closure.
- **D-21:** `.github/**` is intentionally in scope for Phase 54 CI wiring and must not be treated as forbidden; audit it as an intentional, limited change confined to the new workflow(s).
- **D-22:** Treat preexisting unstaged `graphify-out/**` dirty state like Phase 53: it may remain, must not be staged, and must not be claimed as Phase 54 work.
- **D-23:** Record boundary audit results in Phase 54 verification/summary artifacts.

### Milestone Closure
- **D-24:** Produce Phase 54 GSD artifacts: SUMMARY, VERIFICATION, VALIDATION, and UAT per standard workflow.
- **D-25:** Update `.planning/ROADMAP.md`, `.planning/STATE.md`, and `.planning/REQUIREMENTS.md` only after CI-01 through CI-04 and BOUND-01 through BOUND-03 are proven complete.
- **D-26:** After Phase 54 verification, re-run `/gsd-audit-milestone v2.10`.
- **D-27:** Do not run `/gsd-complete-milestone v2.10` until the milestone audit is clean.

### Optional Traceability
- **D-28:** If cheap and non-blocking, add a light documentary cross-reference linking Phase 52/50 verification closure to Phase 53/54 guardrail and CI work.
- **D-29:** Optional traceability must not compete with or delay CI wiring and boundary proof.

### the agent's Discretion
- The planner may choose the exact stress-test stabilization mechanism (CI env var + adjusted ceiling, reduced synthetic corpus size in CI, warmup pass, etc.) as long as D-04 through D-06 are satisfied and the change is auditable in test output or constants.
- The planner may choose workflow filename, step naming, and whether boundary proof is a shell script, inline CI step, or final-plan verification command, reusing the Phase 53 bash diff gate where practical.
- The planner may skip optional traceability (D-28) if it would expand scope or delay CI delivery.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone And Phase Scope
- `.planning/ROADMAP.md` — Phase 54 goal, success criteria, requirements mapping, and v2.10 exclusions.
- `.planning/REQUIREMENTS.md` — CI-01 through CI-04 and BOUND-01 through BOUND-03; v2.10 out-of-scope table.
- `.planning/PROJECT.md` — milestone intent, protected `341/18/0` baseline, and quality-flow preferences.
- `.planning/STATE.md` — current milestone position and carry-forward decisions.
- `.planning/v2.10-MILESTONE-AUDIT.md` — open gaps, stress-test flake evidence, and Phase 54 readiness notes.

### Prior Phase Decisions
- `.planning/phases/52-retroactive-verification-closure/52-CONTEXT.md` — verification closure scope fence; CI deferred to Phase 54.
- `.planning/phases/53-alias-integrity-gate-hardening/53-CONTEXT.md` — `verify:integrity`, `compile:quality`, compile isolation, and D-25 CI deferral.
- `.planning/phases/53-alias-integrity-gate-hardening/53-03-PLAN.md` — boundary diff proof commands and forbidden-path list used as Phase 54 audit template.
- `.planning/phases/53-alias-integrity-gate-hardening/53-03-SUMMARY.md` — Phase 53 proof outputs (`341/18/0`, boundary PASS).

### CI And Script Integration Points
- `src/package.json` — scripts for `typecheck`, `test`, `alias:integrity`, `verify:integrity`, `compile`, and `compile:quality`.
- `src/package-lock.json` — lockfile consumed by `npm ci --prefix src`.
- `src/tests/analysis/stress.test.ts` — CI flake blocker; `CI_SAFE_ANALYSIS_5K_CEILING_MS` constant.
- `src/tests/cli/alias_integrity.test.ts` — script wiring contract for integrity commands.
- `scripts/check-safety-guards.sh` — protected-path enforcement reference; remains separate from alias semantic checks.

### Verification And Audit References
- `.planning/phases/50-retroactive-verification-closure/50-VERIFICATION.md` or equivalent — upstream HYG verification traceability (optional cross-ref only).
- `.planning/milestones/v2.9-ROADMAP.md` — original alias integrity implementation context.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/tests/analysis/stress.test.ts`: already defines `CI_SAFE_ANALYSIS_5K_CEILING_MS = 1500` and logs elapsed time; natural place for CI-safe threshold or load adjustment.
- `src/package.json` + `src/package-lock.json`: all CI commands already exist locally; Phase 54 only needs consumers, not new guardrail logic.
- Phase 53 boundary bash gate in `53-03-PLAN.md` verify block: reusable pattern for final milestone boundary proof with Graphify exception handling.

### Established Patterns
- All npm commands run with `--prefix src` from repo root (Phase 52/53 proof convention).
- Alias integrity proof uses JSON output with `341/18/0` baseline; both `alias:integrity` and `verify:integrity` invoke `dist/cli/alias_integrity.js` after `precompile`.
- Phase 53 forbade `.github` changes; Phase 54 explicitly reverses that only for CI workflow addition.
- No `.github/workflows/` exists yet; greenfield CI wiring.

### Integration Points
- New workflow file(s) under `.github/workflows/` become the CI-01 through CI-04 consumer.
- `stress.test.ts` must be green before CI-03 step is trustworthy.
- Phase 54 VERIFICATION.md should cite workflow file path, command outputs, and boundary diff results.

</code_context>

<specifics>
## Specific Ideas

- Execution order: (1) stabilize stress test, (2) add GitHub Actions workflow, (3) run full proof package + boundary audit, (4) produce GSD closure artifacts, (5) re-audit milestone.
- Desired CI command sequence after `npm ci --prefix src`:
  - `npm --prefix src run typecheck`
  - `npm --prefix src test`
  - `npm --prefix src run alias:integrity -- --json`
  - `npm --prefix src run verify:integrity -- --json`
- Trigger policy: `push` + `pull_request` on `master`, Node 24, single job.
- Boundary audit must allow intentional `.github/workflows/` changes while still forbidding taxonomy/compiled/deferred-scope mutation.
- Milestone completion gate: `/gsd-audit-milestone v2.10` must pass before `/gsd-complete-milestone v2.10`.

</specifics>

<deferred>
## Deferred Ideas

- FUT-01 low-support curation and FUT-02 seed/corpus conflict curation remain future milestones.
- Graphify, scoring, UI, MVP, and Knowledge Engine work remain excluded.
- Multi-version Node CI matrix, path-filtered workflows, and advanced CI features (caching layers, deployment, notifications) are deferred unless planning finds a minimal necessity.
- Formal `52-VERIFICATION.md` creation and deep Phase 50/52/53 traceability docs are optional (D-28) and must not block CI delivery.
- `/gsd-complete-milestone v2.10` is explicitly deferred until post-Phase-54 milestone audit is clean.

</deferred>

---

*Phase: 54-CI Wiring & Milestone Closure*
*Context gathered: 2026-06-08*
