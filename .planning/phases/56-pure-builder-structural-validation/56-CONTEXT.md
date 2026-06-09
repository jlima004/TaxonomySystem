# Phase 56: Pure Builder & Structural Validation - Context

**Gathered:** 2026-06-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 56 delivers a **pure in-memory graph builder** and **structural validator** that consume the Phase 55 contract and the three allowed compiled v2 artifacts. The phase proves deterministic nodes/edges, unique IDs, valid endpoints, valid alias targets, subfamily→subfamily similarity only, and baseline stats `10/18/341/18/13`.

**In scope:**
- `buildOlfactoryGraph(input): OlfactoryGraph` — pure builder from in-memory compiled artifact objects
- `validateOlfactoryGraph(graph): GraphValidationResult` — structural validation with structured errors
- In-memory `OlfactoryGraph` with `schema_version`, `nodes`, `edges`, `stats`
- Vitest coverage: minimal inline fixtures for construction/invariants + one live-artifact baseline regression (read-only)

**Out of scope (explicit operator limits — do not pull forward):**
- CLI
- Writer or any disk output under `data/read-models/olfactory-graph/v2.11/`
- Boundary audit hashing (Phase 58)
- Neo4J, Graphify, database drivers
- Material, Molecule, PubChem, ReviewItem, score, Graphify, or Neo4J-specific nodes
- Query proofs (Phase 57)
- File I/O inside builder/validator modules (no path-based loading in production code)
- Mutation of `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`
- Changes to normal compile workflow

</domain>

<decisions>
## Implementation Decisions

### Scope & Phase Boundaries (operator-locked)
- **D-01:** Phase 56 implements **only** pure builder + in-memory structural validation. No CLI, writer, read-model output, boundary audit hashing, Neo4J, Graphify, Material nodes, or query proofs.
- **D-02:** Success proof targets: deterministic nodes/edges; unique node and edge IDs; valid edge endpoints; valid alias targets; similarity **subfamily→subfamily only**; stats reconciling `10 families / 18 subfamilies / 341 descriptors / 18 aliases / 13 subfamily-similarity edges` per `GRAPH_EXPECTED_BASELINE_STATS`.
- **D-03:** Builder and validator consume **objects already loaded in memory** — not filesystem paths. Tests may read compiled artifacts; production modules must not.

### Module Layout & API
- **D-04:** Separate modules, not integrated builder+validator:
  - `src/graph_read_model/build_graph.ts` — pure builder
  - `src/graph_read_model/validate_graph.ts` — pure structural validator
  - `src/graph_read_model/types.ts` — in-memory graph types only (if needed)
- **D-05:** Public signatures:
  - `buildOlfactoryGraph(input): OlfactoryGraph`
  - `validateOlfactoryGraph(graph): GraphValidationResult`
- **D-06:** No Phase 56 function reads files, writes files, generates disk output, or depends on CLI.
- **D-07:** Validation returns structured results (repo pattern), not throws for expected graph errors. `GraphValidationResult`: `{ ok, errors, warnings? }`. Errors include `code`, `path`, `message`, and optionally `node_id` or `edge_id`. Throw only for extreme programmer errors (invalid API usage), not structural graph failures.
- **D-08:** Follow `CompilerValidationResult` / `makeCompilerError` pattern from `src/compiler/types.ts` and `validate_output.ts` as the reference for error shape and combine semantics.

### In-Memory Graph Representation
- **D-09:** `GraphNode` shape: `{ id, kind, properties }`. `GraphEdge` shape: `{ id, kind, source, target, properties }`.
- **D-10:** `OlfactoryGraph` contains: `schema_version`, `nodes` (array), `edges` (array), `stats`.
- **D-11:** Nodes and edges are stable, serializable arrays. No persisted indexes on the final graph object — indexes may exist only as internal/temporary builder or validator helpers.
- **D-12:** Node kinds: `family`, `subfamily`, `descriptor`, `alias` only. Edge kinds: `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to` only. Forbidden node prefixes from contract remain forbidden.
- **D-13:** Stats must reconcile exactly with contract baseline counts by node/edge kind (families, subfamilies, descriptors, aliases, subfamily-similarity edges).

### Determinism
- **D-14:** Explicit, tested sort order:
  - Nodes: by `kind`, then `id`
  - Edges: by `kind`, then `source`, then `target`, then `id`
- **D-15:** Edge IDs follow contract exactly: `edge:<edge_kind>:<source_graph_id>-><target_graph_id>`.
- **D-16:** Node IDs use type-prefixed contract prefixes: `family:`, `subfamily:`, `descriptor:`, `alias:`.
- **D-17:** `similar_to` edges preserve `score`, `dimensions`, `evidence`, and optional `final_score` from `similarity_matrix.json` without reinterpreting as descriptor or material similarity.
- **D-18:** No `Date.now()`, `new Date()`, or fresh wall-clock metadata. Build metadata, if any, must be injectable or omitted in Phase 56.
- **D-19:** Phase 56 does not write JSON to disk. Byte-identical serialization may be tested in memory via `JSON.stringify` on sorted graph output.

### Structural Validation Invariants (from Phase 55 contract)
- **D-20:** Validator must implement all `GRAPH_PHASE_56_INVARIANTS`:
  - `duplicate_node_id_detection`
  - `duplicate_edge_id_detection`
  - `missing_edge_endpoints`
  - `wrong_endpoint_kinds`
  - `invalid_alias_targets`
  - `invalid_subfamily_similarity_endpoints`
- **D-21:** Validation failure codes should map to invariant names for traceability in tests and planner tasks.

### Test Strategy (hybrid)
- **D-22:** **Inline minimal fixtures** for:
  - family/subfamily/descriptor/alias node construction
  - hierarchy edges (`contains_subfamily`, `contains_descriptor`)
  - alias `resolves_to` edges
  - `similar_to` subfamily→subfamily edges
  - duplicate node ID, duplicate edge ID
  - missing endpoint, wrong endpoint kind
  - invalid alias target, invalid similarity endpoint
  - determinism (build twice → deep equal)
- **D-23:** **Live v2 artifact regression** (tests only, read-only):
  - Load `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`
  - Assert baseline stats `10/18/341/18/13`
  - Assert all 18 aliases resolve to existing descriptor nodes
  - Assert all 13 similarity edges connect existing subfamily nodes
  - No disk writes; do not read `data/enriched_materials.json` or `graphify-out/**`

### Allowed Inputs (from Phase 55 — not renegotiated)
- **D-24:** Builder input is derived only from the three allowed production inputs defined in `GRAPH_ALLOWED_PRODUCTION_INPUTS`. No fourth production input.

### Agent Discretion
- Exact TypeScript input type for `buildOlfactoryGraph` (typed views of compiled artifacts vs generic records) — follow existing `src/types/taxonomy.ts`, alias, and similarity types where practical.
- Whether `warnings` array is populated in Phase 56 or left empty until a later phase needs it.
- Internal helper file names beyond the three mandated modules (e.g., `graph_ids.ts` for ID formatting) if they keep modules focused.
- Specific error `code` string literals — must be stable and test-asserted, but naming detail left to planner/implementer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Graph contract (Phase 55 — primary)
- `src/graph_read_model/contract.ts` — schema version, node/edge kinds, ID rules, invariants, baseline stats, allowed inputs, output policy
- `docs/olfactory_graph_contract.md` — maintainer-readable contract mirror and Phase 56 handoff
- `src/tests/graph_read_model/contract.test.ts` — executable contract assertions

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 56 goal and success criteria (lines 111–121)
- `.planning/REQUIREMENTS.md` — GBLD-01 through GBLD-05, GVAL-01, GVAL-02

### Compiled artifact inputs (read-only in tests)
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

### Validation & typing patterns
- `src/compiler/validate_output.ts` — structured validation result pattern
- `src/compiler/types.ts` — `CompilerValidationResult`, `makeCompilerError`, `combineResults`
- `src/types/taxonomy.ts` — compiled taxonomy property names
- `src/types/similarity.ts` — similarity edge shape (score, dimensions, evidence)

### Phase 55 planning artifacts
- `.planning/phases/55-graph-contract-boundary-decisions/55-RESEARCH.md` — builder/validator deferral rationale
- `.planning/phases/55-graph-contract-boundary-decisions/55-PATTERNS.md` — module and test analogs

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/graph_read_model/contract.ts` — single source of truth for kinds, properties, ID format, invariants, baseline stats; import constants/types in builder and validator
- `src/compiler/validate_output.ts` — pattern for `ok/errors/warnings` validation with coded errors and JSON paths
- `src/types/taxonomy.ts`, alias types, `src/types/similarity.ts` — field names for mapping compiled artifacts to graph nodes/edges

### Established Patterns
- Pure functions, zero runtime dependencies, TypeScript strict ESM under `src/`
- Vitest tests under `src/tests/` mirroring module paths (e.g., `src/tests/graph_read_model/`)
- Deterministic ordering tested via lexicographic sort assertions (see `build_similarity_graph.test.ts`)
- Fixed `generated_at` injection in tests rather than wall-clock timestamps

### Integration Points
- Phase 57 query proofs will consume validated `OlfactoryGraph` in memory — keep graph shape stable and documented
- Phase 58 will add CLI/writer/boundary audit on top of this builder — do not embed I/O here
- Contract tests remain the guardrail; builder/validator tests must fail if contract constants change

</code_context>

<specifics>
## Specific Ideas

Operator provided full A/B/C/D specification in discuss-phase session:
- Module split: `build_graph.ts`, `validate_graph.ts`, optional `types.ts`
- Graph as serializable arrays without persisted indexes
- Sort keys and edge ID format locked to Phase 55 contract
- Hybrid tests: inline fixtures for all invariants + single live v2 baseline regression
- Hard exclusions reinforced: no CLI, writer, read-models output, boundary audit, Neo4J, Graphify, Material nodes, query proofs, compile/taxonomy/inference/graphify mutation

</specifics>

<deferred>
## Deferred Ideas

- **CLI for graph build/validate** — Phase 58 (`GVAL-03+`)
- **Writer to `data/read-models/olfactory-graph/v2.11/`** — Phase 58
- **Boundary audit hashing / protected-path proofs** — Phase 58
- **Query proofs (descriptors by family, alias paths, similarity neighborhoods)** — Phase 57
- **Neo4J export documentation and mapping** — Phase 59
- **Material / Molecule / PubChem graph nodes** — separate milestone scope per REQUIREMENTS.md anti-scope
- **Descriptor-level or material-level similarity** — out of scope; similarity artifact is subfamily-level only
- **Graphify integration** — navigation-only; not a production input or output

</deferred>

---

*Phase: 56-Pure Builder & Structural Validation*
*Context gathered: 2026-06-09*
