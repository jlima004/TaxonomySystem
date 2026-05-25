# Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption - Discussion Log

> **Audit trail only.** Do not use as the sole input to planning, research or execution agents.
> Stable decisions are captured in `13-CONTEXT.md`.

**Date:** 2026-05-25
**Phase:** 13-taxonomy-v2-post-promotion-stabilization-consumer-adoption
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision IDs:** `POST-D-01` through `POST-D-12`, `STAB-D-01` through `STAB-D-39`
**Required baseline:** Phase 12 closed with taxonomy seed v2 as default and rollback dry-run validated.

---

## Phase Boundary

Phase 13 validates and stabilizes the project after the Phase 12 v2 default promotion. It is not a taxonomy expansion or curation phase.

Phase 13 context gathering must not:

- Perform new taxonomy curation.
- Edit `data/taxonomy/taxonomy-seed.v2.json`.
- Edit `data/inference/curated_relations.v2.json`.
- Edit `data/inference/accord_map.v2.json`.
- Edit `data/taxonomy/descriptor_aliases.seed.json`.
- Overwrite or remove `data/compiled/v1/`.
- Overwrite or remove `data/compiled/v2/`.
- Change `src/cli/parse_args.ts`.
- Mutate `graphify-out/*` without a separate explicit plan.

---

## Starting Context

Phase 12 promoted v2 to default after persisted approval and Gates 0 through 6. Current known state:

- `src/cli/parse_args.ts` defaults to taxonomy seed v2 inputs, `data/compiled/v2` and version `2.0.0`.
- Official `data/compiled/v2/` artifacts exist.
- `data/compiled/v1/` remains preserved as baseline/archive.
- v1 fallback was validated by rollback dry-run without deleting v2 artifacts.
- Phase 11 accepted soft findings and legacy alias exception remain accepted with policy.

---

## Areas Discussed

Consumer inventory, default v2 smoke tests, explicit v1 fallback, docs consistency, graphify policy, CI/hooks/generated artifacts, release confidence checklist and Phase 14 backlog boundary.

---

## Consumer Inventory

| Option | Description | Selected |
|--------|-------------|----------|
| In-repo completo | Código, testes, scripts npm, docs, planning docs e artifacts versionados que mencionam defaults, paths explícitos ou compiled outputs. | yes |
| Código/testes só | Apenas `src/**/*.ts` e testes Vitest; docs ficariam para outra área. | |
| Runtime só | Apenas consumidores executáveis reais; testes/docs seriam suporte. | |

**User's choice:** Full in-repo inventory.

**Notes:** The inventory must include references to `DEFAULT_PATHS`, v1/v2 seed files, v1/v2 relation and accord files, `data/compiled/v1`, `data/compiled/v2`, versions `1.0.0` and `2.0.0`, `npm run compile`, and CLI flags `--seed`, `--relations`, `--accords`, `--out`, `--version`. References to v1 should be classified as baseline/archive, explicit fallback, stale reference or legacy context, not treated as errors automatically.

---

## Default V2 Smoke Tests

| Option | Description | Selected |
|--------|-------------|----------|
| Temp output only | Validate `DEFAULT_PATHS` and run equivalent default compile with `--out /tmp/...` and fixed `--generated-at`; compare against official artifacts when useful. | yes |
| Tests only | Use typecheck/tests only, without compile smoke. | |
| Read-only audit | Inspect files and documented commands only. | |

**User's choice:** Temp output only.

**Notes:** Do not run compile default directly against `data/compiled/v2`. Use `/tmp/opencode/taxonomy-phase13-smoke/default-v2`, fixed timestamp `2026-01-01T00:00:00.000Z`, validate the three outputs, version `2.0.0`, validation/quality status and diff-clean official artifacts.

---

## Explicit V1 Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit temp compile | Use explicit flags for all v1 inputs/version and write only to `/tmp`, never `data/compiled/v1`. | yes |
| Rollback-like check | Also validate rollback values remain documented, without simulating rollback. | |
| Docs only | Check fallback docs only, without compile validation. | |

**User's choice:** Explicit temp compile.

**Notes:** v1 fallback must not depend on `DEFAULT_PATHS` and must not execute a real rollback. Expected output path is `/tmp/opencode/taxonomy-phase13-smoke/explicit-v1-fallback`, using fixed timestamp `2026-01-01T00:00:00.000Z` and complete explicit CLI flags.

---

## Docs Consistency

| Option | Description | Selected |
|--------|-------------|----------|
| User-facing docs | README, Phase 12 release/migration notes, Phase 13 context/preflight and CLI docs that mention defaults/fallback. | yes |
| All planning docs | Also audit ROADMAP, REQUIREMENTS, STATE and prior gate docs for textual coherence. | |
| README only | Scope only README as public source. | |

**User's choice:** User-facing/current-state docs.

**Notes:** Historical planning docs do not block only because they record old state. Blocking inconsistencies include saying v1 is default, saying v1 was removed, saying v2 physically replaced v1, hiding v1 fallback explicit paths, claiming soft findings were resolved, or presenting new curation as Phase 13 scope.

---

## Graphify Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Plan-gated protected | Treat as protected; read/audit allowed, regeneration/mutation only with explicit plan and diff policy. | yes |
| Archive only | Treat as historical snapshot; no regeneration in this phase. | |
| Regenerable later | Allow future plan to regenerate Graphify if useful. | |

**User's choice:** Plan-gated protected.

**Notes:** Preexisting `graphify-out/*` changes do not block Phase 13 by themselves but cannot enter commits without an explicit plan. Graphify plans need their own allowlist, diff policy, generation command and commit policy. Hooks that update graphify outputs are a commit-contamination risk.

---

## CI, Hooks And Generated Artifacts

| Option | Description | Selected |
|--------|-------------|----------|
| Diff-clean gates | Typecheck/tests/build, smoke compiles in `/tmp`, protected path diff checks, no committed regenerated outputs. | yes |
| Manual audit only | Inventory scripts/hooks/generated artifacts without running commands. | |
| Full CI mimic | Reproduce all local CI if present. | |

**User's choice:** Diff-clean gates.

**Notes:** Expected checks include `npm run typecheck`, `npm test`, `npm run build`, v2 smoke compile in `/tmp`, explicit v1 fallback compile in `/tmp`, and protected diff checks for compiled artifacts, seed/inference inputs and `src/cli/parse_args.ts`. Full CI mimic is out of initial scope unless a future plan finds a clear need.

---

## Release Confidence Checklist

| Option | Description | Selected |
|--------|-------------|----------|
| Pass/block checklist | Structured checklist with `pass`, `accepted_with_policy`, `follow_up` or `blocker`, evidence and protected diff results. | yes |
| Narrative report | Textual confidence report without rigid table. | |
| Minimal summary | Short confirmation only. | |

**User's choice:** Pass/block checklist.

**Notes:** The final checklist must include consumer inventory, default v2 smoke, explicit v1 fallback, docs consistency, graphify policy, CI/hooks/generated artifacts, protected diff checks, release confidence final and Phase 14 backlog boundary. Phase 13 can close only with no active blockers.

---

## Phase 14 Backlog Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Backlog only | Capture future items as backlog only; do not execute curation or non-blocking fixes in Phase 13. | yes |
| Stabilization fixes | Allow Phase 13 to resolve small inconsistencies if found. | |
| Curation prep | Prepare a next curation round without applying data. | |

**User's choice:** Backlog only.

**Notes:** Soft findings, review queue, curation candidates, alias cleanup, `ylang ylang -> ylang_ylang`, graph density, non-blocking docs, consumer gaps, automation, CI/hook, Graphify, smoke-test and release-process improvements are Phase 14+ unless they are real stabilization blockers.

---

## Deferred Ideas

- Phase 14+ backlog: soft findings, review queue, alias cleanup, graph density improvements, future curation candidates and non-blocking process improvements.

## Agent Discretion

- No user decisions were delegated to the agent. Phase 13 planning must follow the explicit `STAB-D-*` decisions captured in `13-CONTEXT.md`.
