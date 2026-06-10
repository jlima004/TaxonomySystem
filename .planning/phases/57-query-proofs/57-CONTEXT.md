# Phase 57: Query Proofs - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 57 delivers **deterministic in-memory query proofs** over a validated `OlfactoryGraph`, demonstrating future agent/RAG value without any infrastructure, I/O, or graph mutation.

**In scope:**
- Pure query functions in `src/graph_read_model/query_graph.ts` consuming `OlfactoryGraph` post-`validateOlfactoryGraph`
- Typed proof result objects (`query_kind`, `params`, `result`, `path`) in `types.ts`
- Named functions mapped 1:1 to GQRY-01 through GQRY-05
- Vitest coverage: inline fixtures with stable v2 baseline IDs + one read-only live-artifact aggregate regression
- Determinism proofs: explicit sort order, build+validate+query twice → deep equal

**Out of scope (operator-locked — do not pull forward):**
- CLI
- Writer or any disk output under `data/read-models/olfactory-graph/v2.11/`
- Neo4J, Graphify, database drivers
- Runtime, API, SaaS, agent/RAG runtime
- Material, Molecule, PubChem, ReviewItem nodes
- New scoring, similarity computation, or reinterpretation of subfamily similarity
- Mutation of `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`
- Changes to `build_graph.ts`, `validate_graph.ts`, or graph contract
- Boundary audit hashing (Phase 58)
- Documentation of query examples for maintainers (Phase 59 / GDOC-01)

**Focus:** Produce deterministic query proofs, not infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Scope & Phase Boundaries (operator-locked)
- **D-01:** Phase 57 consumes `OlfactoryGraph` in memory only. No CLI, writer, `data/read-models/` output, Neo4J, Graphify, runtime/API/SaaS, Material nodes, new scoring/similarity, or mutation of taxonomy/compiled/inference.
- **D-02:** Queries assume graph is already structurally valid (`validateOlfactoryGraph` returns `ok: true`). Tests enforce validate-before-query; production query modules do not re-validate or read files.

### Module Layout & API
- **D-03:** Single module `src/graph_read_model/query_graph.ts` for all query functions — mirrors `build_graph.ts` / `validate_graph.ts` layout.
- **D-04:** Public API uses **named functions per proof category**, not generic traversal or fluent builders.
- **D-05:** Ephemeral indexes per call — internal helpers may build temporary `Map` indexes at function entry; `OlfactoryGraph` object remains index-free (Phase 56 D-11).
- **D-06:** Proof types live in `src/graph_read_model/types.ts` (extend existing types file).

### Proof Result Shape
- **D-07:** Each query returns a typed proof object:
  ```ts
  { query_kind, params, result, path }
  ```
  - `query_kind`: stable string identifier (see D-08)
  - `params`: query input parameters (family id, alias, descriptor id, subfamily id, etc.)
  - `result`: query-specific typed payload
  - `path`: traversal chain where applicable (IDs + names when available)
- **D-08:** Stable `query_kind` values:
  - `descriptors_by_family`
  - `descriptors_by_subfamily`
  - `alias_resolution_path`
  - `descriptor_to_family_path`
  - `related_descriptors`
  - `similarity_neighborhood`
  - `cross_family_bridges`
  - `similarity_hub`
- **D-09:** Property depth — return only GQRY-relevant fields, not full node/edge copies:
  - Descriptors: `status`, `review_required`, `corpus_derived`, `source` (+ id, name as needed)
  - Similarity: `score`, `dimensions`, `evidence`, `final_score` when present
  - Paths: graph IDs + human-readable names when available on nodes
- **D-10:** Deterministic output ordering — queries define their own sort rules (not merely passthrough from graph array order):
  - Default lists: lexicographic by `id`
  - Paths: lexicographic by path segment order
  - Similarity neighborhoods: score/`final_score` descending, then target `id` lexicographic
  - Tests prove build+validate+query twice → deep equal; use `JSON.stringify` equality when practical

### GQRY → Function Mapping (explicit 1:1)
- **D-11:** **GQRY-01** → `getDescriptorsByFamily(graph, familyId)`, `getDescriptorsBySubfamily(graph, subfamilyId)` — includes `status`, `review_required`, `corpus_derived`, `source`
- **D-12:** **GQRY-02** → `resolveAliasPath(graph, alias)` — path from `alias:*` through `resolves_to` to `descriptor:*`, with full chain to subfamily and family
- **D-13:** **GQRY-03** → `getDescriptorToFamilyPath(graph, descriptorId)` + `getRelatedDescriptors(graph, descriptorId)` — related = same `subfamily_id` via `contains_descriptor`, excluding self; all statuses included
- **D-14:** **GQRY-04** → `getSimilarityNeighborhood(graph, subfamilyId)` (1-hop only) + `getCrossFamilyBridges(graph)` + `getSimilarityHub(graph)`
- **D-15:** **GQRY-05** → proof contract shape (D-07/D-08/D-09) makes outputs statically inspectable for future agent/RAG; live aggregate regression demonstrates consumability at baseline scale

### Similarity Semantics
- **D-16:** Neighborhood depth = **1-hop** — direct `similar_to` neighbors only; no multi-hop BFS.
- **D-17:** Hub definition = subfamily with highest **degree** (in+out `similar_to` edges). Ties broken by subfamily `id` lexicographic.
- **D-18:** Cross-family bridge = `similar_to` edge where `source` and `target` subfamilies belong to **different** `family_id` values.
- **D-19:** Neighborhood sort: score/`final_score` descending, then target id lexicographic. No new scoring logic — read existing edge properties only.

### Related Descriptors & Paths
- **D-20:** `related_descriptors` = descriptors sharing the same `subfamily_id`, excluding the queried descriptor. Not same-family-only.
- **D-21:** No limit on related descriptor count — return all in subfamily, sorted by descriptor `id` lexicographic.
- **D-22:** `descriptor_to_family_path` = full chain `descriptor:id → subfamily:id → family:id` with names when available on node properties.

### Exemplar & Coverage Strategy
- **D-23:** **Hybrid coverage** — representative inline fixtures + aggregate live regression (not per-item manual proofs for every baseline entity).
- **D-24:** Inline fixtures use **stable v2 baseline IDs** hardcoded in tests (no live file reads inside inline fixtures). Suggested exemplars:
  - Family: `woody` (or other stable family from compiled v2)
  - Alias: real alias with known resolution path from 18-alias baseline
  - Subfamily: one with cross-family `similar_to` edge (e.g., subfamily involved in `cross_family_tradition_bridge` curated relation)
- **D-25:** Live regression (read-only, test layer only) proves aggregate catalog:
  - `descriptors_by_family` for all 10 families
  - `alias_resolution_path` for all 18 aliases
  - `similarity_neighborhood` for every subfamily that has `similar_to` edges
  - One global `similarity_hub`
  - All `cross_family_bridges`
- **D-26:** Inline tests use exact proof-object snapshots. Live regression uses structural + count assertions with selective content checks (not full JSON snapshot of entire catalog).

### Test Strategy
- **D-27:** Hybrid tests mirroring Phase 56:
  - `src/tests/graph_read_model/query_graph.test.ts` — inline minimal fixtures, snapshot proofs, determinism
  - `src/tests/graph_read_model/query_live_baseline.test.ts` — read-only load of `data/compiled/v2/*`, build, validate, aggregate queries
- **D-28:** Determinism test: build+validate+query twice on same inputs → deep equal proof outputs.
- **D-29:** Production query module (`query_graph.ts`) has **no filesystem I/O** — all `readFile` stays in test layer, same as Phase 56 builder/validator boundary.

### Agent Discretion
- Exact TypeScript types for each `result` payload variant (planner defines per `query_kind`).
- Specific inline exemplar IDs beyond the suggested `woody` / cross-family hints — must be stable v2 baseline IDs.
- Whether `getDescriptorsByFamily` and `getDescriptorsBySubfamily` share an internal helper.
- Exact snapshot content for inline fixtures (planner picks minimal but representative proof objects).
- Whether `path` is `undefined` vs empty array for queries without traversal (e.g., hub listing).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Graph contract & builder (Phase 55–56 — primary)
- `src/graph_read_model/contract.ts` — schema version, node/edge kinds, required properties, baseline stats, allowed inputs
- `src/graph_read_model/build_graph.ts` — `buildOlfactoryGraph` pure builder
- `src/graph_read_model/validate_graph.ts` — `validateOlfactoryGraph` structural validator
- `src/graph_read_model/types.ts` — `OlfactoryGraph`, `GraphNode`, `GraphEdge`, validation types
- `docs/olfactory_graph_contract.md` — maintainer-readable contract mirror

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 57 goal and success criteria (lines 127–137)
- `.planning/REQUIREMENTS.md` — GQRY-01 through GQRY-05, out-of-scope table

### Phase 56 planning & execution artifacts
- `.planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md` — builder boundaries, determinism, test hybrid pattern
- `.planning/phases/56-pure-builder-structural-validation/56-PATTERNS.md` — module and test analogs
- `src/tests/graph_read_model/live_artifact_baseline.test.ts` — live regression pattern to extend for queries

### Compiled artifact inputs (read-only in tests)
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

### Descriptor & similarity field semantics
- `src/types/taxonomy.ts` — compiled taxonomy / descriptor property names
- `src/types/similarity.ts` — similarity edge shape (score, dimensions, evidence, final_score)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `buildOlfactoryGraph` + `validateOlfactoryGraph` — Phase 57 tests build validated graph in memory before querying
- `OlfactoryGraph` with sorted `nodes`/`edges` arrays and `stats` — stable input contract for queries
- Descriptor nodes already carry `status`, `review_required`, `corpus_derived`, `source` per contract
- `similar_to` edges preserve `score`, `dimensions`, `evidence`, optional `final_score` from compiled similarity artifact
- `live_artifact_baseline.test.ts` — read-only compiled v2 load pattern, sanctioned path assertions

### Established Patterns
- Pure functions, zero runtime dependencies, TypeScript strict ESM under `src/`
- Production modules fs-free; filesystem access only in `src/tests/`
- Vitest tests mirror module paths under `src/tests/graph_read_model/`
- Determinism via explicit sort + build-twice deep equality (Phase 56)
- Structured typed results over throws for expected conditions

### Integration Points
- Phase 58 CLI/writer will consume same `OlfactoryGraph` and may later serialize query proofs — keep query outputs JSON-serializable
- Phase 59 documentation will reference query proof examples from tests — stable `query_kind` values matter
- Contract tests remain guardrail; query tests must not require contract changes

</code_context>

<specifics>
## Specific Ideas

Operator locked hard exclusions at discuss start (same spirit as Phase 56 operator limits):
- In-memory `OlfactoryGraph` only; proofs not infrastructure
- No CLI, writer, read-models output, Neo4J, Graphify, runtime/API/SaaS
- No Material nodes, no new scoring/similarity, no taxonomy/compiled/inference mutation

Discussion priority: module layout (A), proof shape (B), and test strategy (F) are architecture-critical; similarity semantics (C), related descriptors (D), and exemplar coverage (E) prevent semantic ambiguity.

Inline exemplar hints from baseline: `woody` family, real alias from 18-alias set, subfamily involved in `cross_family_tradition_bridge` similarity edges.

</specifics>

<deferred>
## Deferred Ideas

- **CLI for graph query/export** — Phase 58
- **Writer to `data/read-models/olfactory-graph/v2.11/`** — Phase 58
- **Boundary audit / protected-path hashing** — Phase 58 (`GVAL-03+`)
- **Maintainer documentation with query proof examples** — Phase 59 (`GDOC-01`)
- **Neo4J mapping notes** — Phase 59 (`GDOC-02`)
- **Multi-hop similarity traversal** — out of scope; 1-hop sufficient for v2.11 proofs
- **Same-family related descriptors tier** — deferred; Phase 57 uses same-subfamily only
- **Material / descriptor-level similarity** — separate milestone per REQUIREMENTS.md
- **Agent/RAG runtime consumption** — future (`GRAG-01`); Phase 57 only structures static proof evidence

</deferred>

---

*Phase: 57-Query Proofs*
*Context gathered: 2026-06-10*
