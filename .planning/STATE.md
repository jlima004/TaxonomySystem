---
gsd_state_version: 1.0
milestone: v2.12
milestone_name: Olfactory Knowledge Graph Read Model
status: verifying
last_updated: "2026-06-17T16:42:17.918Z"
last_activity: 2026-06-17 -- Completed 62-02-PLAN.md
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 10
  completed_plans: 10
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-12)

**Core value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.
**Current focus:** Phase 62 — sanctioned-cli-boundary-proofs

## Current Position

Phase: 62 (sanctioned-cli-boundary-proofs) — COMPLETE
Plan: 2 of 2
Status: Phase complete — ready for verification
Last activity: 2026-06-17 -- Completed 62-02-PLAN.md

## Performance Metrics

**Velocity:**

- v2.10 phases completed: 3/3
- v2.10 plans completed: 7/7
- Timeline: 2026-06-06 → 2026-06-09 (3 days)

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 56-pure-builder-structural-validation | 01 | 5min | 2 | 3 |
| 56-pure-builder-structural-validation | 02 | 6min | 3 | 3 |
| 57-query-proofs | 01 | 12min | 3 | 3 |
| 57-query-proofs | 02 | 18min | 3 | 4 |
| 62-sanctioned-cli-boundary-proofs | 01 | 5min | 2 | 3 |
| 62-sanctioned-cli-boundary-proofs | 02 | 6min | 3 | 4 |

## Accumulated Context

### Recent Decisions

- [v2.10]: Harden integrity gates without curation or artifact mutation; protect the current `341/18/0` alias integrity state operationally.
- [v2.10]: `alias:integrity` belongs in quality/safety/CI flows, not the normal compile path.
- [v2.10]: FUT-01, FUT-02, new seed promotion, compiled v2 publication/mutation, Graphify/scoring/UI/MVP/Knowledge Engine are excluded.
- [v2.11]: Graph read-model outputs use `data/read-models/olfactory-graph/v2.11/`; `/tmp` is verification-only support.
- [v2.11]: Graph work remains zero-dependency, read-only, static and detached from Neo4J, Graphify and runtime systems.
- [Phase 56 P01]: Included GraphValidationResult helpers in types.ts mirroring compiler validation pattern for plan 02 handoff.
- [Phase 56 P01]: Derived graph.stats from emitted arrays using exact contract baseline key names.
- [Phase 56 P02]: Stats validation reconciles graph.stats against array-derived counts; baseline 10/18/341/18/13 proven in live regression.
- [Phase 56 P02]: Phase 56 warnings array is always present but empty unless warning-only invariants are added.
- [Phase 57]: Query proofs consume validated OlfactoryGraph in memory only; single `query_graph.ts` with named functions and typed `{ query_kind, params, result, path }` proof objects.
- [Phase 57]: Hybrid test strategy — inline v2 baseline snapshots + live aggregate catalog (10 families, 18 aliases, all similarity neighborhoods, hub, cross-family bridges).
- [Phase 57]: Similarity proofs are 1-hop; hub = max degree; related descriptors = same subfamily only.
- [Phase 57 P01]: DescriptorProofItem omits name field per RESEARCH A5 (descriptor nodes lack name in builder).
- [Phase 57 P01]: Missing query targets return empty structured proofs with path undefined, not throws per A3.
- [Phase 57 P01]: Similarity payload types pre-defined in types.ts for plan 02 handoff without further type changes.
- [Phase 57 P02]: Similarity neighborhood entries project edge properties only; no score recomputation per D-19.
- [Phase 57 P02]: All three similarity functions omit path field per A4.
- [Phase 57 P02]: Live regression uses structural/count assertions with selective cedar→cedarwood content check per D-26.
- [Phase 60]: `contract.ts` remains normative, but graph ID construction/parsing must move behind a single typed boundary consumed by builder, validator and query code.
- [Phase 60]: Validation errors use a hybrid contract: stable `code`, optional normative `invariant_id`, and JSON-safe `expected`/`actual`.
- [Phase 60]: Validation surface splits into structural, profile-aware and sanctioned-wrapper entrypoints; CLI must use the sanctioned wrapper, and future agent-facing consumption must reuse it in Phase 61.
- [Phase 60]: Future consumer boundaries must reuse the same sanctioned validation profile and error factories rather than local flags or ad-hoc strings; proof-generation fail-closed behavior remains Phase 61 scope.
- [Phase 60 P01]: `contract.ts` now exports authoritative validation codes, invariant IDs, parse-code vocabulary and `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE` without adding imports or runtime I/O.
- [Phase 60 P01]: `GraphValidationError` now supports typed `invariant_id`, `expected` and `actual` fields via explicit `JsonValue`, while preserving existing `makeGraphError` call sites.
- [Phase 60 P02]: `graph_id.ts` now owns graph ID construction, guards, stripping and typed parsing using only contract-defined prefixes and parse codes.
- [Phase 60 P02]: Invalid graph IDs now produce deterministic JSON-safe parse failures (`empty_graph_id`, `unknown_graph_id_prefix`, `ambiguous_graph_id_format`) without generic throws.
- [Phase 60 P03]: `validation_errors.ts` now centralizes named validation error factories with contract-bound codes and optional invariant mapping.
- [Phase 60 P03]: Validation error payloads are now proven JSON-safe in tests before validator branch migration, preserving the base compatibility shape.
- [Phase 62 P01]: Extracted `runSanctionedGraphWorkflow` with injectable `GuardrailExecutor` and typed `forbidden_path`/`guardrail_failed` boundaries.
- [Phase 62 P01]: Guardrails now run before `writeGraphOutput` for fail-closed artifact safety; public `graph:build` remains a thin adapter without `--out`.
- [Phase 62 P02]: Measured graphify-out/** isolation uses pre/post directory snapshots independent of boundary_audit declarative fields.
- [Phase 62 P02]: Hybrid guardrail executor intercepts only test with explicit injected_test_evidence metadata.
- [Phase 62 P02]: Public CLI JSON contract locked to ok, graph_output, boundary_audit, guardrails top-level keys.

### Blockers/Concerns

None.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Curation | FUT-01: 243 remaining `corpus_candidate_low_support` items | Deferred to future milestone | v2.10 scope definition |
| Curation | FUT-02: 13 remaining `seed_corpus_conflict` items | Deferred to future milestone | v2.10 scope definition |
| Dev UX | Local stress benchmark 1500ms ceiling without CI=true | Documented tech debt | v2.10 milestone audit |

## Operator Next Steps

- Run phase verification for Phase 62 and proceed to Phase 63 planning.
