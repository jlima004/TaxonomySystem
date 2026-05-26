# Phase 16: permanent-safety-guard-implementation - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

## Phase Boundary

Implement a small, permanent, non-mutating local guard script that protects the staging/commit boundary for Graphify and protected paths. No package scripts, hooks, CI, curation, docs/help fixes, compile/smoke/typecheck/tests/build, or protected-path mutations are authorized in this phase.

## Implementation Decisions

### Script path and runtime
- **GUARD16-D-01:** The first implementation is `local script only`.
- **GUARD16-D-02:** Implement as a shell script (no Node/TypeScript runtime).
- **GUARD16-D-03:** Path is `scripts/check-safety-guards.sh`.
- **GUARD16-D-04:** No package script wrapper, hook or CI integration in the first implementation.
- **GUARD16-D-05:** Do not modify `src/package.json`.
- **GUARD16-D-06:** Script must be invokable as `./scripts/check-safety-guards.sh`.
- **GUARD16-D-07:** Script must also work via `bash scripts/check-safety-guards.sh`.
- **GUARD16-D-08:** Include a shebang and prefer executable bit, but support bash invocation if executable bit is missing.

### Guard behavior
- **GUARD16-D-09:** Script is non-mutating; never clean, revert, regenerate, stage or unstage files.
- **GUARD16-D-10:** Block any staged path under `graphify-out`.
- **GUARD16-D-11:** Block any staged path under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`.
- **GUARD16-D-12:** Block any working-tree diff under `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2`, or `src/cli/parse_args.ts`.
- **GUARD16-D-13:** Do not require `graphify-out/*` to be clean in the working tree.
- **GUARD16-D-14:** Dirty `graphify-out/*` in the working tree remains `accepted_with_policy` and must not block unless staged.

### Exit code and output format
- **GUARD16-D-15:** Exit `0` on success, `1` on any blocking violation.
- **GUARD16-D-16:** Labels required: `PASS`, `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, `NOT_GIT_REPO`.
- **GUARD16-D-17:** Use `report_all` behavior; run all checks, list all violations, then exit `1` if any exist.
- **GUARD16-D-18:** Success message prints `PASS` to stdout.
- **GUARD16-D-19:** Failures print labels + paths to stderr.
- **GUARD16-D-20:** Failures include short policy text; do not suggest destructive commands or automatic remediation.

### Command boundaries
- **GUARD16-D-21:** Detect repo root via `git rev-parse --show-toplevel` and run guards from root.
- **GUARD16-D-22:** If not in a git repo, print `NOT_GIT_REPO` to stderr and exit `1`.
- **GUARD16-D-23:** Graphify staged guard uses:
  `git diff --cached --name-only -- graphify-out`
- **GUARD16-D-24:** Protected paths staged guard uses:
  `git diff --cached --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`
- **GUARD16-D-25:** Protected diff guard uses:
  `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts`
- **GUARD16-D-26:** Use `graphify-out` as pathspec (no glob `graphify-out/*`).
- **GUARD16-D-27:** Use explicit path arguments with `--` (no internal array of paths in the first implementation).

### Validation proof requirements
- **GUARD16-D-28:** Validate PASS in the real repo by running both `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh`.
- **GUARD16-D-29:** Prove non-mutating behavior with `git status --short` before/after in the real repo.
- **GUARD16-D-30:** Preexisting dirty state is allowed; success means no new changes caused by the script.
- **GUARD16-D-31:** Simulate failures in a disposable `/tmp` git repo by copying and executing the real script.
- **GUARD16-D-32:** Simulations must cover `GRAPHIFY_STAGED`, `PROTECTED_PATH_STAGED`, `PROTECTED_DIFF`, and multiple violations for `report_all`.
- **GUARD16-D-33:** No unit tests, package scripts, hooks or CI in the first implementation.

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 16 context and boundaries
- `.planning/phases/16-permanent-safety-guard-implementation/16-CONTEXT.md` — This context and decisions.
- `.planning/phases/16-permanent-safety-guard-implementation/16-DISCUSSION-LOG.md` — Audit trail of decisions.
- `.planning/phases/16-permanent-safety-guard-implementation/16-PREFLIGHT.md` — Non-executable boundary and allowed next steps.

### Phase 15 handoff and validation
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-CONTEXT.md` — Guard boundary policy and Phase 15 decisions.
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-VALIDATION.md` — Prior guard behavior and validation evidence requirements.
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-01-SUMMARY.md` — Protected diff PASS and Graphify report_and_fail evidence.
- `.planning/phases/15-post-triage-safety-guards-current-state-docs-cleanup/15-02-SUMMARY.md` — Staged Graphify and staged protected paths PASS evidence.

### Project tracking
- `.planning/ROADMAP.md` — Phase 16 goal and boundaries.
- `.planning/STATE.md` — Current phase status and constraints.

## Existing Code Insights

### Reusable Assets
- `src/cli/parse_args.ts` — Protected path; do not touch. Reference only for boundary awareness.
- `src/package.json` — Scripts exist but must not be modified in this phase.

### Established Patterns
- Non-mutating safety guards and protected diff checks are mandatory for safety automation work.
- `graphify-out/*` dirty working tree is accepted_with_policy; staging is blocking.

### Integration Points
- The guard runs locally and uses git commands; no hook, package script or CI integration in the first implementation.

## Specific Ideas

No additional specific requirements beyond the decisions above.

## Deferred Ideas

- Package script wrapper after local script behavior is proven.
- Git hook or pre-commit integration after local script behavior is stable.
- CI check after local script behavior and failure text are accepted.
- Docs/help cleanup as a separate phase/front.
- Graphify remediation as a separate generated-artifacts plan.

---

*Phase: 16-permanent-safety-guard-implementation*
*Context gathered: 2026-05-26*
