# Phase 59: Live Artifact Regression, Documentation & Milestone Closure - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 59 delivers **maintainer-facing documentation**, **documented live-artifact regression evidence**, and **v2.11 milestone closure** — proving the graph read model is trustworthy and understandable without turning it into an official taxonomy publication, runtime integration, or database deployment.

**In scope:**
- Single maintainer guide `docs/olfactory_graph_read_model.md` (GDOC-01, GDOC-02, GDOC-03)
- Documented regression evidence referencing existing Vitest tests and `graph:build` operator workflow
- Query proof examples for all 8 stable `query_kind` values, copied from test snapshots (not re-run on `graph.json`)
- Phase verification artifact `59-VERIFICATION.md`
- Milestone release closure `.planning/releases/v2.11-CLOSURE.md` with full 22-requirement checklist and boundary-audit summary

**Out of scope (operator-locked — do not pull forward):**
- Neo4J, Docker, database drivers, Cypher import jobs, or database tests
- `query_proofs.json` or other query-proof artifacts on disk
- New mandatory CLI/integration tests (Phase 58 already covers `graph:build`)
- Re-running queries on `graph.json` to generate documentation examples
- Disclaimer or metadata embedded in `graph.json` or `data/read-models/olfactory-graph/v2.11/README.md`
- Expanding `docs/olfactory_graph_contract.md` into operational documentation
- Mutation of `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`
- Official compiled taxonomy publication or curation truth upgrades

**Focus:** Document, prove, and close — not build new graph capabilities.

</domain>

<decisions>
## Implementation Decisions

### Documentation Layout (GDOC-01, GDOC-02, GDOC-03)
- **D-01:** **Single maintainer guide** — create `docs/olfactory_graph_read_model.md` as the sole operational documentation file. Sections: read-model overview, protected inputs, `graph.json` output, `graph:build` workflow, validation/regression, query proof examples (copied from tests), GDOC-03 disclaimer banner, conceptual Neo4J mapping note.
- **D-02:** **Keep contract doc separate** — `docs/olfactory_graph_contract.md` remains the static Phase 55 contract reference. The maintainer guide links to it for full schema/invariant tables; do not duplicate contract tables in the guide (avoid dual sources of truth).
- **D-03:** **Portuguese narrative** — maintainer guide prose in Portuguese, matching `olfactory_graph_contract.md` and engine docs. Technical identifiers (paths, `query_kind`, CLI flags, function names) stay in English.
- **D-04:** **Disclaimer banner at guide top** — GDOC-03 prominent warning block at the top of `olfactory_graph_read_model.md`. States v2.11 outputs are derived read models for consultation, documentation, and future agent/RAG consumption; not official compiled taxonomy artifacts; not curation truth upgrades; do not replace protected `data/compiled/v2/*` files. No changes to `graph.json`, compiled artifacts, or output-dir README.
- **D-05:** **Neo4J section = mapping tables only** — conceptual section with tables: graph node kind → Neo4J label, edge kind → relationship type, ID prefix → property key. Brief prose on future export path. No Cypher snippets, no CSV samples, no Docker/drivers/import jobs.

### Live Regression Evidence
- **D-06:** **Document existing tests — no new regression test files** — maintainer guide cites current Vitest coverage as canonical regression proof. Phase 59 does not add mandatory new CLI tests; Phase 58 already covers `graph:build` integration, UAT, and guardrails.
- **D-07:** **`graph:build` as operator proof** — guide documents `npm run graph:build` as the maintainer command. Regression story = existing Vitest tests + documented baseline counts + expected CLI steps + expected stdout/`--json` audit proof shape.
- **D-08:** **Canonical regression test references** — guide lists each file with a one-line proof statement:
  - `src/tests/graph_read_model/live_artifact_baseline.test.ts` — build + validate from live v2 catalog; baseline stats
  - `src/tests/graph_read_model/query_live_baseline.test.ts` — aggregate query proofs over full catalog
  - `src/tests/graph_read_model/write_graph.test.ts` — writer path policy and atomic output
  - `src/tests/graph_read_model/boundary_audit.test.ts` — SHA-256 boundary audit behavior
  - `src/tests/cli/graph_read_model.test.ts` — CLI integration for `graph:build`
- **D-09:** **Baseline counts table** — dedicated table mapping each `10/18/341/18/13` metric to `GRAPH_EXPECTED_BASELINE_STATS` field, regression test source, and meaning. Suggested columns: `Métrica | Valor esperado | Fonte no contrato | Teste de regressão | O que prova`.

### Query Proof Examples (GDOC-01)
- **D-10:** **All 8 query kinds documented** — one example per stable `query_kind`: `descriptors_by_family`, `descriptors_by_subfamily`, `alias_resolution_path`, `descriptor_to_family_path`, `related_descriptors`, `similarity_neighborhood`, `cross_family_bridges`, `similarity_hub`.
- **D-11:** **Copy from test snapshots only** — examples copied from `query_graph.test.ts` (primary) and/or `query_live_baseline.test.ts` (aggregate-scale notes only). Do not load `graph.json` and re-run queries (Phase 58 D-21).
- **D-12:** **JSON code blocks** — each example as a fenced JSON block with brief Portuguese caption (params, result intent). Inline snapshots from `query_graph.test.ts` are the primary source for all 8 kinds.
- **D-13:** **Function mapping table** — guide includes: `GQRY requirement | Function name | query_kind | Example params | Source test`. Links public `query_graph.ts` API to documented examples for maintainers and future agent/RAG consumers.

### Milestone Closure
- **D-14:** **Dual closure artifacts** — (1) `59-VERIFICATION.md` in phase dir for Phase 59 success criteria, commands, tests, UAT, validation, security, final result; (2) `.planning/releases/v2.11-CLOSURE.md` for milestone archive following v2.8 release-closure pattern.
- **D-15:** **Primary milestone closure location** — canonical v2.11 closure lives at `.planning/releases/v2.11-CLOSURE.md` alongside prior release closures. Phase dir holds phase artifacts (`59-CONTEXT.md`, plans, summaries, `59-VERIFICATION.md`).
- **D-16:** **Boundary audit in closure = summary + sample JSON shape** — `v2.11-CLOSURE.md` documents expected `graph:build --json` audit structure: protected files unchanged, `graphify_out_accesses: 0`, `output_written: data/read-models/olfactory-graph/v2.11/graph.json`, `forbidden_prefix_rejections: []`, proof via `boundary_audit.test.ts`. No full SHA-256 digest list embedded; no persisted audit file.
- **D-17:** **Full 22-requirement checklist** — closure table with one row per v2.11 requirement. Columns: `Requirement ID | Grupo | Phase | Status | Proof reference`. Covers GCON, GBLD, GVAL, GQRY, GDOC groups. Each row points to test, doc, phase summary, verification, UAT, or artifact evidence.

### Agent Discretion
- Exact section ordering and heading names inside `olfactory_graph_read_model.md`.
- Which specific inline snapshot per `query_kind` to copy when multiple exist in `query_graph.test.ts`.
- Aggregate-scale notes to pull from `query_live_baseline.test.ts` (e.g., bridge count, hub degree).
- Sample audit JSON excerpt formatting in closure doc (representative fields vs full example block).
- Whether `59-VERIFICATION.md` is produced during planning or execution (workflow convention).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 59 goal and success criteria (lines 182–195)
- `.planning/REQUIREMENTS.md` — GDOC-01, GDOC-02, GDOC-03; v2.11 traceability table; out-of-scope table

### Maintainer documentation (Phase 59 deliverables)
- `docs/olfactory_graph_read_model.md` — **to be created** — single maintainer guide (GDOC-01/02/03)
- `docs/olfactory_graph_contract.md` — static contract reference (link, do not expand)
- `.planning/releases/v2.11-CLOSURE.md` — **to be created** — milestone closure archive

### Graph contract & modules (Phases 55–58)
- `src/graph_read_model/contract.ts` — `GRAPH_OUTPUT_POLICY`, `GRAPH_ALLOWED_PRODUCTION_INPUTS`, `GRAPH_EXPECTED_BASELINE_STATS`
- `src/graph_read_model/build_graph.ts` — `buildOlfactoryGraph`
- `src/graph_read_model/validate_graph.ts` — `validateOlfactoryGraph`
- `src/graph_read_model/query_graph.ts` — query functions and `query_kind` values
- `src/graph_read_model/types.ts` — proof envelope types
- `src/cli/graph_read_model.ts` — `graph:build` CLI

### Query proof example sources (copy-only — Phase 58 D-21)
- `src/tests/graph_read_model/query_graph.test.ts` — primary inline snapshots for all 8 query kinds
- `src/tests/graph_read_model/query_live_baseline.test.ts` — aggregate-scale regression notes

### Regression evidence sources
- `src/tests/graph_read_model/live_artifact_baseline.test.ts` — live v2 build+validate baseline
- `src/tests/graph_read_model/write_graph.test.ts` — writer and path policy
- `src/tests/graph_read_model/boundary_audit.test.ts` — boundary audit proof
- `src/tests/cli/graph_read_model.test.ts` — CLI integration

### Prior phase context (boundaries carried forward)
- `.planning/phases/58-cli-writer-boundary-audit/58-CONTEXT.md` — no query disk export; docs copy from Vitest; graph.json metadata-free
- `.planning/phases/57-query-proofs/57-CONTEXT.md` — query_kind values, GQRY mapping, proof envelope shape
- `.planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md` — baseline stats, fs-free production modules

### Closure pattern reference
- `.planning/releases/v2.8.0-CLOSURE.md` — prior release closure format (metrics, boundaries, checklist)

### Protected paths (must not mutate)
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/taxonomy/alias_target_exceptions.v1.json`
- `data/compiled/v2/*`
- `data/read-models/olfactory-graph/v2.11/graph.json` — official read-model output (write via `graph:build` only)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `docs/olfactory_graph_contract.md` — contract tables and boundary rules to cross-reference (not duplicate)
- `live_artifact_baseline.test.ts` — live regression assertions and `GRAPH_EXPECTED_BASELINE_STATS` proof
- `query_graph.test.ts` — deterministic inline proof snapshots for all 8 query kinds
- `query_live_baseline.test.ts` — full-catalog aggregate proof counts (10 families, 18 aliases, bridges, hub)
- Phase 58 CLI tests — `graph:build` workflow, boundary audit JSON shape, writer path policy

### Established Patterns
- Maintainer docs in Portuguese; code/tests/CLI in English
- Documentation examples sourced from Vitest snapshots, not re-executed queries
- Release closures under `.planning/releases/` with metrics tables and boundary preservation statements
- Phase verification docs (`*-VERIFICATION.md`) separate from milestone release closures
- `graph.json` remains pure `OlfactoryGraph` — disclaimers live in docs only

### Integration Points
- New `docs/olfactory_graph_read_model.md` links to contract doc, test files, and `graph:build` npm script
- `v2.11-CLOSURE.md` references all phase summaries (55–59), REQUIREMENTS.md traceability, and boundary audit proof
- No changes to production graph modules unless documentation reveals a doc/code drift fix (out of scope unless discovered during write)

</code_context>

<specifics>
## Specific Ideas

Operator discussion order: A (documentation layout) → B (regression evidence) → C (query examples) → D (milestone closure).

Operator intent:
- Phase 59 is documentation + regression proof + milestone closure — not new graph capabilities
- Single maintainer guide reduces dispersion at milestone end
- Regression = document what Phases 56–58 already proved; do not add another execution layer
- Closure separates phase verification from milestone archive (two files, two responsibilities)

</specifics>

<deferred>
## Deferred Ideas

- **`query_proofs.json` on disk** — rejected in Phase 58; documentation copies from tests instead
- **Disclaimer in `graph.json` or output-dir README** — operator rejected; guide banner only
- **Full SHA-256 digest list in closure doc** — operator rejected; summary + sample JSON shape only
- **Neo4J Cypher/CSV examples** — operator chose mapping tables only; implementation deferred to GDB-01 future milestone
- **Expanding contract doc into full guide** — operator rejected to preserve contract/operations separation

</deferred>

---

*Phase: 59-Live Artifact Regression, Documentation & Milestone Closure*
*Context gathered: 2026-06-10*
