---
phase: 15
slug: post-triage-safety-guards-current-state-docs-cleanup
status: context_gathering
created: 2026-05-26
updated: 2026-05-26
---

# Phase 15 Discussion Log

> Audit trail only. Downstream agents should use `15-CONTEXT.md` as the canonical source.

## Starting Prompt

Phase 15 suggested name: `Post-Triage Safety Guards & Current-State Docs Cleanup`.

Objective: transform a small and safe part of Phase 14 outputs into controlled execution, prioritizing operational protection after the v2 default switch.

Initial status:

- `context_gathering`
- `not_ready_for_execution`

## Mandatory Base

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CLOSURE.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DOCS-HELP-SHORTLIST.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-SAFETY-AUTOMATION-SHORTLIST.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-VALIDATION.md`

## Area: Initial Phase 15 Priority

Question: Qual frente a Phase 15 deve priorizar primeiro?

| Option | Description | Selected |
|---|---|---|
| Safety automation guards | Prioritize operational safety guards first. | yes |
| Docs/help current-state cleanup | Start with current-state docs/help cleanup. | |
| Safety automation + docs/help, but separate plans | Include both fronts but keep plans separate. | |
| Apenas contexto/planejamento, sem execução nesta fase | Stay context-only. | |

User selection:

- Safety automation guards.

Decision captured:

- Phase 15 prioritizes safety automation guards first.
- Docs/help cleanup remains possible later, preferably as a separate plan if included.

## Area: Safety Guard Subset

Question: Qual subset de safety guards a Phase 15 deve planejar primeiro?

| Option | Description | Selected |
|---|---|---|
| Protected boundary guards | Protected diff guard + Graphify staging guard; smallest non-mutating scope. | yes |
| Defaults/fallback guards | `DEFAULT_PATHS` v2 assertion + explicit v1 fallback assertion. | |
| Tmp-only compile guard | Ensure smoke/compile validation writes only to `/tmp`. | |
| Combined minimal set | Protected diff + Graphify staging + defaults/fallback assertions together. | |

User selection:

- Protected boundary guards.

Decision captured:

- The first Phase 15 safety guard subset is protected boundary guards only.
- Defaults/fallback guards and tmp-only compile guard are deferred from the first front.

## Area: Protected Diff Boundary

Question: Para o protected diff guard inicial, qual boundary deve ser bloqueada?

| Option | Description | Selected |
|---|---|---|
| Full Phase 14 boundary | Cover `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`. | yes |
| Artifacts/defaults only | Cover only compiled artifacts and `src/cli/parse_args.ts`. | |
| Exact shortlist command | Use exactly the shortlist command without reinterpretation. | |
| You decide | Planner chooses the smallest safe boundary. | |

User selection:

- Full Phase 14 boundary.

Notes:

- The guard should be broad but simple and non-mutating.
- Excluding taxonomy/inference inputs would leave out files future curatorial phases could accidentally touch.
- `graphify-out/*` is handled by a separate guard, not by protected diff.

Command-base expected:

```bash
git diff --exit-code -- \
  data/taxonomy \
  data/inference \
  data/compiled/v1 \
  data/compiled/v2 \
  src/cli/parse_args.ts
```

## Area: Graphify Staging Guard

Question: Como o Graphify staging guard deve se comportar no primeiro plano?

| Option | Description | Selected |
|---|---|---|
| Report and fail | Detect any status in `graphify-out/*`, report contamination and fail without cleanup/staging. | yes |
| Warn only | Warn about dirty Graphify state but do not fail. | |
| Exact status check | Only run `git status --short -- graphify-out` and defer failure policy. | |
| You decide | Planner chooses the simplest non-mutating protection. | |

User selection:

- Report and fail.

Notes:

- Dirty Graphify is commit-contamination risk, not taxonomy correctness evidence.
- The guard must not clean, revert, stage, commit, regenerate Graphify, alter hooks or alter `.gitignore`.
- Any corrective Graphify action requires a separate generated-artifact plan with allowlist and diff policy.

Command-base expected:

```bash
git status --short -- graphify-out
```

## Area: First-Front Validation

Question: Qual validação mínima o primeiro plano deve exigir para esses protected boundary guards?

| Option | Description | Selected |
|---|---|---|
| Local proof only | Record local commands, exit codes, outputs and no-mutation confirmations, without compile/smoke. | yes |
| Unit tests required | Require versioned automated tests for the guards. | |
| Manual checklist | Register an operational checklist without automation. | |
| You decide | Planner chooses validation based on Phase 14 shortlist and repo patterns. | |

User selection:

- Local proof only.

Notes:

- Local proof must record exact commands, exit codes, relevant stdout/stderr, success/failure behavior and recommended failure messages.
- Local proof must confirm no files were modified, no compile/smoke was run and `graphify-out/*` was not cleaned/reverted/staged/committed/regenerated.
- Versioned unit tests are not mandatory for the first front.
- Unit tests may be considered later if these guards become permanent scripts or CI integration.

## Non-Actions Confirmed For This Context Step

- No curation executed.
- No descriptor promoted.
- No alias added, removed or remapped.
- No relation or accord added, removed or edited.
- No compile/smoke run.
- No safety automation implemented.
- No docs/help fix applied.
- No `graphify-out/*` cleanup, revert, staging, regeneration or commit performed.
- No `15-RESEARCH.md`, `15-PATTERNS.md`, `15-VALIDATION.md` or `15-01-PLAN.md` created.

## Area: Post-15-01 Graphify Policy

Context: `15-01 local_proof_only` ran the protected diff guard and Graphify staging guard. Protected diff passed. Graphify remained dirty under `graphify-out/*` and was reported without remediation.

User decision:

- Keep preexisting dirty `graphify-out/*` as known issue `accepted_with_policy`.
- Continue treating dirty Graphify as commit-contamination risk, not taxonomy evidence.
- Do not require `graphify-out/*` to be clean in the working tree as a condition for future safety automation commits.
- Require future plans to block staged Graphify paths and exclude Graphify from commits unless a dedicated generated-artifacts plan authorizes it.

Decisions captured:

- `SAFE-D-22`: The preexisting dirty state of `graphify-out/*` is a known issue accepted with policy.
- `SAFE-D-23`: Dirty Graphify remains a commit-contamination risk, not taxonomy evidence.
- `SAFE-D-24`: Upcoming safety automation plans must not require `graphify-out/*` to be clean in the working tree as a commit condition.
- `SAFE-D-25`: Upcoming safety automation plans must require that `graphify-out/*` is not staged and not included in the commit.
- `SAFE-D-26`: Any cleanup, revert, regeneration, staging or commit of `graphify-out/*` still requires a separate generated-artifacts plan with allowlist and diff policy.
- `SAFE-D-27`: The next safety automation plan should use a commit/staging guard, not a working-tree-clean guard, for Graphify.

Allowed in upcoming safety automation plans:

- `graphify-out/*` may appear as preexisting dirty state in the working tree.
- The dirty state may be recorded as known issue `accepted_with_policy`.

Blocking in upcoming safety automation plans:

- Any `graphify-out/*` path appears staged.
- Any `graphify-out/*` path appears in `git diff --cached --name-only`.
- Any cleanup, revert, regeneration, staging or commit of Graphify is attempted without a dedicated generated-artifacts plan.

Recommended next guard command:

```bash
git diff --cached --name-only -- graphify-out
```

Success criterion: empty output.

Failure criterion: any staged path under `graphify-out/*`.

Suggested next plan:

- `15-02 — Staged commit safety guard`: create or validate a safety automation front that protects the commit/staging boundary, permits known dirty Graphify state in the working tree, and blocks staged Graphify or unexpected staged protected paths.

Non-actions confirmed for this policy update:

- No curation.
- No compile/smoke.
- No docs/help fixes.
- No Graphify cleanup, revert, regeneration, staging or commit.
- No artifact refresh.
- No `DEFAULT_PATHS` changes.
