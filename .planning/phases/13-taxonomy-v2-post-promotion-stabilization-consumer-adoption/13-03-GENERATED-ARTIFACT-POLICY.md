# Phase 13 Plan 03 Generated Artifact Policy

**Plan:** 13-03  
**Created:** 2026-05-25  
**Scope:** read-only/status-only audit of scripts, hooks, CI and generated-artifact contamination risks.  
**Policy target:** `graphify-out/*`.

## Execution Boundary

This plan was executed as read-only/status-only except for this Phase 13 evidence artifact and its matching summary.

Commands intentionally not run:

- No Graphify command or regeneration.
- No test command.
- No build command.
- No smoke compile command.
- No curation command.
- No package install command.
- No cleanup, revert, reset, staging or mutation of `graphify-out/*`.

Protected paths intentionally not edited:

- `data/compiled/v1`
- `data/compiled/v2`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v1.json`
- `data/inference/accord_map.v2.json`
- `src/cli/parse_args.ts`

## Read-Only Commands Run

| command | purpose | result |
|---|---|---|
| `git status --short` | Record whole-worktree status without modifying files. | `graphify-out/*` dirty; Phase 13 13-02 evidence files untracked from prior plan. |
| `git status --short -- graphify-out` | Record only generated Graphify output status. | Four modified `graphify-out/*` files listed. |
| `git diff --name-only -- graphify-out` | Record changed generated Graphify file names only. | Four `graphify-out/*` files listed. |
| File discovery for `.github/workflows` | Check CI config presence. | No files found. |
| File discovery for `.husky` | Check Husky hook presence. | No files found. |
| Directory read of `.git/hooks` | Check local Git hook presence. | Active `post-commit` and `post-checkout` hooks plus sample hooks. |
| Read `src/package.json` | Audit npm scripts without running them. | Scripts listed below. |
| Read active hook files | Audit hook behavior without executing hooks. | Both active hooks can launch Graphify rebuilds in background. |
| Protected diff gate | Verify code/data/artifacts/defaults stayed clean. | Exit code 0. |

## NPM Scripts Audit

Source: `src/package.json`.

| script | command | generated-artifact risk | Phase 13 disposition |
|---|---|---|---|
| `build` | `tsc` | Build output risk only if run; not run in this plan. | Not executed in 13-03. |
| `typecheck` | `tsc --noEmit` | No write expected, but not needed for status-only policy audit. | Not executed in 13-03. |
| `precompile` | `npm run build` | Runs build before compile; not run in this plan. | Not executed in 13-03. |
| `compile` | `node dist/cli/compile.js` | Can write compiled artifacts depending on flags/defaults; not run in this plan. | Not executed in 13-03. |
| `compile:quality` | `npm run precompile && node dist/cli/compile.js --quality-report` | Can build and compile; not run in this plan. | Not executed in 13-03. |
| `test` | `vitest run` | Test execution not needed for read-only/status-only policy audit. | Not executed in 13-03. |
| `test:watch` | `vitest` | Watch-mode command; forbidden for this plan. | Not executed in 13-03. |

No `src/package.json` script directly invokes Graphify. Graphify risk in this workspace comes from active Git hooks and existing generated-output dirty state.

## CI Config Audit

| location | status | evidence | Phase 13 disposition |
|---|---|---|---|
| `.github/workflows/*` | absent | File discovery returned no files. | No repository CI workflow behavior to claim. |
| `.husky/*` | absent | File discovery returned no files. | No Husky-managed hook behavior to claim. |

No CI config was found in the audited locations. This plan documents absence only; it does not infer external CI behavior.

## Git Hooks Audit

Source: `.git/hooks` directory and active hook file reads.

| hook | status | behavior | contamination risk | Phase 13 disposition |
|---|---|---|---|---|
| `.git/hooks/post-commit` | active, executable hook file present | Installed by `graphify hook install`; computes changed files and launches a detached background Graphify rebuild via Python when Graphify is importable. | A normal commit can asynchronously modify `graphify-out/*` after the commit command returns. | Treat as commit-contamination risk; do not stage `graphify-out/*` in Phase 13. |
| `.git/hooks/post-checkout` | active, executable hook file present | Installed by `graphify hook install`; on branch switch, if `graphify-out` exists, launches a detached background Graphify rebuild via Python. | Branch switches can asynchronously modify `graphify-out/*`. | Treat as workspace-contamination risk; do not use Graphify outputs as correctness evidence in Phase 13. |
| `.git/hooks/*.sample` | sample hooks | Git sample hooks only. | No active project behavior unless renamed/activated. | No Phase 13 action. |

Additional project hook files observed by file discovery:

| file | behavior | Phase 13 disposition |
|---|---|---|
| `.agents/hooks/gsd-workflow-guard.js` | Soft PreToolUse advisory for edits outside GSD workflow context when enabled. | Not a Graphify generator; read-only evidence only. |
| `.agent/hooks/gsd-workflow-guard.js` | Same soft workflow guard copy. | Not a Graphify generator; read-only evidence only. |

## Generated Artifact Status

`graphify-out/` directory entries observed by directory read:

- `.graphify_labels.json`
- `.graphify_python`
- `.graphify_root`
- `.graphify_uncached.txt`
- `.rebuild.lock`
- `cache/`
- `cost.json`
- `GRAPH_REPORT.md`
- `graph.html`
- `graph.json`
- `manifest.json`

`git status --short -- graphify-out` result:

```text
 M graphify-out/.rebuild.lock
 M graphify-out/GRAPH_REPORT.md
 M graphify-out/graph.html
 M graphify-out/graph.json
```

`git diff --name-only -- graphify-out` result:

```text
graphify-out/.rebuild.lock
graphify-out/GRAPH_REPORT.md
graphify-out/graph.html
graphify-out/graph.json
```

Current generated-output state: dirty before/at policy audit. This dirty state is evidence of contamination risk, not a Phase 13 blocker by itself and not taxonomy correctness evidence.

## Phase 13 Graphify Policy

Requirements and decisions cited: POST-07, POST-06, POST-D-07, STAB-D-19, STAB-D-20, STAB-D-21, STAB-D-22 and STAB-D-23.

| artifact/path | current state | Phase 13 policy | allowed mutation | commit policy | correctness evidence | blocker condition |
|---|---|---|---|---|---|---|
| `graphify-out/*` | Dirty: `.rebuild.lock`, `GRAPH_REPORT.md`, `graph.html`, `graph.json`. | `protected_plan_gated` | allowed mutation: none in Phase 13 without a separate explicit Graphify plan | stage only explicit Phase 13 evidence artifacts and summaries; exclude `graphify-out/*` | not authoritative taxonomy correctness evidence in Phase 13 without dedicated plan | `graphify-out/*` enters a Phase 13 commit without explicit plan, or hooks generate undocumented diffs outside the allowlist |
| Git Graphify hooks | Active `post-commit` and `post-checkout` launch background rebuilds when conditions match. | contamination-risk-only | no hook execution requested by this plan; no hook edits authorized | if a commit is later made, inspect status and stage explicit paths only | hook output does not validate taxonomy correctness | unreviewed hook-generated files are staged/committed with Phase 13 evidence |
| Future Graphify artifacts | Existing generated output set plus cache/manifest files. | future explicit plan required | none under 13-03 | separate commit policy required | only authoritative if future plan defines evidence criteria | future plan omits expected files, generation command or diff criteria |

## Commit Hygiene Gate

For this plan, commit hygiene is:

- Stage only `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-GENERATED-ARTIFACT-POLICY.md` and `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-03-SUMMARY.md` if a commit is requested later.
- Do not stage `graphify-out/*`.
- Do not clean, revert or reset `graphify-out/*`.
- Do not use `graphify-out/*` to claim taxonomy correctness.
- Re-check `git status --short -- graphify-out` before any Phase 13 commit because active hooks can update files asynchronously.

## Future Graphify Plan Requirements

Any future plan that authorizes Graphify regeneration or mutation must declare all five items required by STAB-D-21:

1. Expected files under `graphify-out/*`.
2. Generation command.
3. Acceptable diff criteria.
4. Whether the artifact is versioned or local-only.
5. Separate commit policy.

Long-term choices such as archive-only, regenerable, ignored or plan-gated remain follow-up policy unless needed to prevent Phase 13 contamination. For Phase 13 execution, the operative status is `protected_plan_gated`.

## Protected Diff Policy

Protected diff command:

```bash
git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json src/cli/parse_args.ts
```

Result: exit code 0.

Protected source/input/artifact/default paths remain unchanged by Plan 13-03.

## Result

Plan 13-03 policy audit passed:

- Scripts, CI locations, active hooks and generated artifact status were audited read-only.
- `graphify-out/*` status was recorded without mutation, cleanup, revert, staging or regeneration.
- `graphify-out/*` is documented as `protected_plan_gated` for Phase 13.
- No Graphify command, hook, test, build, smoke compile or curation was run.
- Code/data/artifact/default protected paths remained diff-clean.
