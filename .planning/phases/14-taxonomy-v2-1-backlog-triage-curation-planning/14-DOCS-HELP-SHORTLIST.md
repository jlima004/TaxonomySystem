---
phase: 14-taxonomy-v2-1-backlog-triage-curation-planning
artifact: docs-help-shortlist
status: read_only_shortlist
non_authorizing: true
source_rows: [DOC-01]
protected_paths_touched: none
---

# Phase 14 Docs/Help Shortlist

This shortlist is a planning aid for possible future docs/help cleanup. It authorizes no docs edit, CLI help code change, source change, data mutation, official artifact mutation, `DEFAULT_PATHS` change, Graphify mutation, staging or commit.

## Current-State Candidates

| surface | evidence | why_current_state | proposed_future_fix | required_tests | protected_paths_unchanged |
|---|---|---|---|---|---|
| CLI help title wording | `14-BACKLOG-MATRIX.md` row `DOC-01` cites Phase 13 follow-ups such as CLI help title wording. BACKLOG-D-157 through BACKLOG-D-178 allow only small current-state docs/help candidates. | CLI help describes current user-facing command behavior, not historical context. Any stale title or default-version wording can mislead present usage after the v2 default switch. | Future plan should inspect the CLI help output, identify exact stale wording, and change only the minimal user-facing text if the current output is wrong. | Run the relevant CLI help command/test, TypeScript check if source help text changes, and protected diff check for data, inference, compiled artifacts and `src/cli/parse_args.ts` default behavior. | `data/taxonomy/**`, `data/inference/**`, `data/compiled/v1/**`, `data/compiled/v2/**`, `src/cli/parse_args.ts`, `graphify-out/*` remain unchanged by this shortlist. |
| Current-state usage docs | `DOC-01` requires current-state grep/check across README, CLI help, planning current-state docs and release notes; `DOC-02` excludes broad historical cleanup. | Current usage docs guide present consumers and should not conflict with v2-default status or explicit v1 fallback behavior. Historical phase records are not current-state usage docs. | Future plan should grep only current usage surfaces, list exact stale statements if found, and edit only those statements. | Current-state grep/check, relevant docs checks if configured, CLI test if help/source text changes, protected diff check. | Protected paths remain unchanged unless a later approved docs/help plan explicitly authorizes a non-protected docs-only diff. |

## Exclusions

| excluded_scope | reason |
|---|---|
| Broad historical docs sweep | `DOC-02` marks broad historical cleanup as `not_in_scope`; BACKLOG-D-159 through BACKLOG-D-172 preserve accurate historical context. |
| Planning record rewrites | Prior phase artifacts are audit trail unless they currently guide present usage incorrectly. |
| CLI default-path source changes | `src/cli/parse_args.ts` is protected by Phase 14 boundaries; help-text code changes require a future explicit plan and tests. |

## Non-Authorization

This shortlist does not approve any docs change. It only identifies bounded current-state surfaces that may justify a future minimal plan.
