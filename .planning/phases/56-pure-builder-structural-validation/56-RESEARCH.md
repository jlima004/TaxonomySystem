# Phase 56: Pure Builder & Structural Validation - Research

**Researched:** 2026-06-09  
**Domain:** In-memory TypeScript graph building and structural validation for the v2.11 olfactory read model [VERIFIED: repository file read]  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Phase 56 implements **only** pure builder + in-memory structural validation. No CLI, writer, read-model output, boundary audit hashing, Neo4J, Graphify, Material nodes, or query proofs. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 33-35]
- **D-02:** Success proof targets: deterministic nodes/edges; unique node and edge IDs; valid edge endpoints; valid alias targets; similarity **subfamily→subfamily only**; stats reconciling `10 families / 18 subfamilies / 341 descriptors / 18 aliases / 13 subfamily-similarity edges` per `GRAPH_EXPECTED_BASELINE_STATS`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 35-36]
- **D-03:** Builder and validator consume **objects already loaded in memory** — not filesystem paths. Tests may read compiled artifacts; production modules must not. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-37]
- **D-04:** Separate modules, not integrated builder+validator:
  - `src/graph_read_model/build_graph.ts` — pure builder
  - `src/graph_read_model/validate_graph.ts` — pure structural validator
  - `src/graph_read_model/types.ts` — in-memory graph types only (if needed) [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 38-42]
- **D-05:** Public signatures:
  - `buildOlfactoryGraph(input): OlfactoryGraph`
  - `validateOlfactoryGraph(graph): GraphValidationResult` [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 43-45]
- **D-06:** No Phase 56 function reads files, writes files, generates disk output, or depends on CLI. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md line 46]
- **D-07:** Validation returns structured results (repo pattern), not throws for expected graph errors. `GraphValidationResult`: `{ ok, errors, warnings? }`. Errors include `code`, `path`, `message`, and optionally `node_id` or `edge_id`. Throw only for extreme programmer errors (invalid API usage), not structural graph failures. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 47-48]
- **D-08:** Follow `CompilerValidationResult` / `makeCompilerError` pattern from `src/compiler/types.ts` and `validate_output.ts` as the reference for error shape and combine semantics. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md line 48]
- **D-09:** `GraphNode` shape: `{ id, kind, properties }`. `GraphEdge` shape: `{ id, kind, source, target, properties }`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 50-52]
- **D-10:** `OlfactoryGraph` contains: `schema_version`, `nodes` (array), `edges` (array), `stats`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 52-53]
- **D-11:** Nodes and edges are stable, serializable arrays. No persisted indexes on the final graph object — indexes may exist only as internal/temporary builder or validator helpers. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 53-54]
- **D-12:** Node kinds: `family`, `subfamily`, `descriptor`, `alias` only. Edge kinds: `contains_subfamily`, `contains_descriptor`, `resolves_to`, `similar_to` only. Forbidden node prefixes from contract remain forbidden. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 54-55]
- **D-13:** Stats must reconcile exactly with contract baseline counts by node/edge kind (families, subfamilies, descriptors, aliases, subfamily-similarity edges). [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 55-56]
- **D-14:** Explicit, tested sort order:
  - Nodes: by `kind`, then `id`
  - Edges: by `kind`, then `source`, then `target`, then `id` [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 57-60]
- **D-15:** Edge IDs follow contract exactly: `edge:<edge_kind>:<source_graph_id>-><target_graph_id>`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md line 61]
- **D-16:** Node IDs use type-prefixed contract prefixes: `family:`, `subfamily:`, `descriptor:`, `alias:`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md line 62]
- **D-17:** `similar_to` edges preserve `score`, `dimensions`, `evidence`, and optional `final_score` from `similarity_matrix.json` without reinterpreting as descriptor or material similarity. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md line 63]
- **D-18:** No `Date.now()`, `new Date()`, or fresh wall-clock metadata. Build metadata, if any, must be injectable or omitted in Phase 56. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 64-65]
- **D-19:** Phase 56 does not write JSON to disk. Byte-identical serialization may be tested in memory via `JSON.stringify` on sorted graph output. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 65-66]
- **D-20:** Validator must implement all `GRAPH_PHASE_56_INVARIANTS`:
  - `duplicate_node_id_detection`
  - `duplicate_edge_id_detection`
  - `missing_edge_endpoints`
  - `wrong_endpoint_kinds`
  - `invalid_alias_targets`
  - `invalid_subfamily_similarity_endpoints` [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 67-75]
- **D-21:** Validation failure codes should map to invariant names for traceability in tests and planner tasks. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 75-76]
- **D-22:** **Inline minimal fixtures** for:
  - family/subfamily/descriptor/alias node construction
  - hierarchy edges (`contains_subfamily`, `contains_descriptor`)
  - alias `resolves_to` edges
  - `similar_to` subfamily→subfamily edges
  - duplicate node ID, duplicate edge ID
  - missing endpoint, wrong endpoint kind
  - invalid alias target, invalid similarity endpoint
  - determinism (build twice → deep equal) [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 77-86]
- **D-23:** **Live v2 artifact regression** (tests only, read-only):
  - Load `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`
  - Assert baseline stats `10/18/341/18/13`
  - Assert all 18 aliases resolve to existing descriptor nodes
  - Assert all 13 similarity edges connect existing subfamily nodes
  - No disk writes; do not read `data/enriched_materials.json` or `graphify-out/**` [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 87-93]
- **D-24:** Builder input is derived only from the three allowed production inputs defined in `GRAPH_ALLOWED_PRODUCTION_INPUTS`. No fourth production input. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 94-96]

### the agent's Discretion
- Exact TypeScript input type for `buildOlfactoryGraph` (typed views of compiled artifacts vs generic records) — follow existing `src/types/taxonomy.ts`, alias, and similarity types where practical. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 97-99]
- Whether `warnings` array is populated in Phase 56 or left empty until a later phase needs it. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 99-100]
- Internal helper file names beyond the three mandated modules (e.g., `graph_ids.ts` for ID formatting) if they keep modules focused. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 100-101]
- Specific error `code` string literals — must be stable and test-asserted, but naming detail left to planner/implementer. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 101-102]

### Deferred Ideas (OUT OF SCOPE)
- **CLI for graph build/validate** — Phase 58 (`GVAL-03+`) [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 169-173]
- **Writer to `data/read-models/olfactory-graph/v2.11/`** — Phase 58 [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 172-173]
- **Boundary audit hashing / protected-path proofs** — Phase 58 [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 173-174]
- **Query proofs (descriptors by family, alias paths, similarity neighborhoods)** — Phase 57 [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 174-175]
- **Neo4J export documentation and mapping** — Phase 59 [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 176-176]
- **Material / Molecule / PubChem graph nodes** — separate milestone scope per REQUIREMENTS.md anti-scope [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 177-177]
- **Descriptor-level or material-level similarity** — out of scope; similarity artifact is subfamily-level only [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 178-178]
- **Graphify integration** — navigation-only; not a production input or output [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 179-179]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GBLD-01 | Maintainer can build a deterministic in-memory graph containing Family, Subfamily, Descriptor and Alias nodes derived only from allowed compiled artifacts. [CITED: .planning/REQUIREMENTS.md lines 20-20] | Use a single pure builder that accepts `{ taxonomy, aliases, similarity }`-style in-memory inputs, emits only contract node kinds, and sorts nodes by `kind` then `id`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 39-45, 57-63][VERIFIED: src/types/taxonomy.ts; src/graph_read_model/contract.ts] |
| GBLD-02 | Maintainer can build hierarchy edges from the compiled taxonomy: Family contains Subfamily and Subfamily contains Descriptor. [CITED: .planning/REQUIREMENTS.md lines 21-21] | Derive hierarchy edges directly while traversing `families[].subfamilies[].descriptors[]`; preserve raw IDs in properties and graph IDs in endpoints. [VERIFIED: src/types/taxonomy.ts; src/graph_read_model/contract.ts] |
| GBLD-03 | Maintainer can build Alias resolves-to Descriptor edges from the compiled alias artifact without changing alias seeds or compiled aliases. [CITED: .planning/REQUIREMENTS.md lines 22-22] | Treat `descriptor_aliases.json.aliases` as an object map; create `alias:*` nodes and `resolves_to` edges without deduping or mutating source alias data. [VERIFIED: src/compiler/types.ts; python JSON inspection; src/tests/inventory/alias_target_inventory.test.ts] |
| GBLD-04 | Maintainer can build Subfamily similar-to Subfamily edges from `similarity_matrix.json`, preserving score, dimensions and evidence without reinterpreting them as descriptor or material similarity. [CITED: .planning/REQUIREMENTS.md lines 23-23] | Copy each matrix edge once into `similar_to`, prefix endpoints as `subfamily:*`, and preserve `score`, `dimensions`, `evidence`, plus optional `final_score` exactly. [VERIFIED: src/types/similarity.ts; python JSON inspection; src/graph_read_model/contract.ts] |
| GBLD-05 | Maintainer can generate graph output with stable ordering and deterministic JSON formatting, avoiding fresh wall-clock metadata unless explicitly injected. [CITED: .planning/REQUIREMENTS.md lines 24-24] | Sort nodes/edges per D-14, omit wall-clock fields, and prove determinism with build-twice deep-equality tests plus optional in-memory `JSON.stringify` comparison. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 57-66][VERIFIED: src/tests/inference/build_similarity_graph.test.ts; src/compiler/write_outputs.ts] |
| GVAL-01 | Maintainer can run graph validation that fails on duplicate node IDs, duplicate edge IDs, missing edge endpoints, wrong endpoint kinds, invalid alias targets or invalid subfamily-similarity endpoints. [CITED: .planning/REQUIREMENTS.md lines 28-28] | Mirror `CompilerValidationResult` + `makeCompilerError` semantics, run invariant-specific scans before any lossy Map overwrite, and return structured errors instead of throwing. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 47-48, 67-76][VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts] |
| GVAL-02 | Maintainer can verify graph stats against the protected v2 baseline, including 10 families, 18 subfamilies, 341 descriptors, 18 aliases and 13 subfamily-similarity edges. [CITED: .planning/REQUIREMENTS.md lines 29-29] | Compute stats from built nodes/edges, compare against both actual graph contents and `GRAPH_EXPECTED_BASELINE_STATS`, and prove the live baseline with one read-only regression test. [VERIFIED: src/graph_read_model/contract.ts; python JSON inspection; src/tests/inventory/alias_target_inventory.test.ts] |

</phase_requirements>

## Summary

Phase 56 should stay deliberately small: one pure builder, one pure validator, one graph-types module, and three focused test files. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 38-48, 77-93][VERIFIED: src/graph_read_model/contract.ts] The builder should only transform already-loaded compiled artifacts into a serializable `OlfactoryGraph` with contract IDs, contract edge kinds, explicit sort order, and reconciled stats. [CITED: .planning/ROADMAP.md lines 111-120][VERIFIED: src/types/taxonomy.ts; src/types/similarity.ts; python JSON inspection]

The validator should not try to be a general schema engine. [CITED: .planning/REQUIREMENTS.md lines 90-90] It only needs six invariant families already locked in Phase 55: duplicate node IDs, duplicate edge IDs, missing endpoints, wrong endpoint kinds, invalid alias targets, and invalid subfamily-similarity endpoints. [VERIFIED: src/graph_read_model/contract.ts; .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md] The existing compiler validation pattern already shows the right repo style: accumulate typed errors with JSON-style paths, return `{ ok, errors, warnings }`, and combine sub-results without throwing for expected data failures. [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts]

Live repo evidence confirms the protected baseline is stable today: `taxonomy.json` contains 10 families, 18 subfamilies, and 341 descriptors; `descriptor_aliases.json` contains 18 aliases; `similarity_matrix.json` contains 13 edges; all alias targets resolve; and all similarity endpoints are existing subfamilies. [VERIFIED: python JSON inspection; src/tests/inventory/alias_target_inventory.test.ts] That makes the smallest correct Phase 56 plan a hybrid test strategy: minimal inline fixtures for every invariant plus one read-only live-artifact regression that checks the exact baseline and nothing else. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 77-93]

**Primary recommendation:** Implement only `build_graph.ts`, `validate_graph.ts`, and `types.ts`; keep all I/O in tests; compute stats from built arrays; and fail validation through structured invariant-coded results, not exceptions. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 38-48, 57-76][VERIFIED: repo pattern]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Build in-memory graph objects | API / Backend | — | This is pure TypeScript domain transformation with no browser, DB, or CLI boundary. [CITED: .planning/ROADMAP.md lines 111-120][VERIFIED: src/graph_read_model/contract.ts] |
| Structural graph validation | API / Backend | Tests | Validation follows existing compiler-style pure functions and is consumed by test/plan guardrails. [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts] |
| Deterministic ordering | API / Backend | Tests | Ordering is a builder concern, then proved by deterministic tests. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 57-66][VERIFIED: src/tests/inference/build_similarity_graph.test.ts] |
| Live-artifact regression | Tests | Read-only file fixtures | Production code must not read files; tests may. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-37, 87-93] |
| Output writing / CLI / boundary audit | Deferred Phase 58 tier | — | Explicitly out of scope for Phase 56. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 17-26, 169-174] |
| Query proofs | Deferred Phase 57 tier | — | Explicitly deferred until after the graph shape is stable. [CITED: .planning/ROADMAP.md lines 123-132] |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | 24.14.0 available [VERIFIED: command `node --version`] | Executes repo scripts/tests and provides the test-only file I/O runtime. [VERIFIED: src/package.json] | Already the project runtime; no new runtime is needed. [VERIFIED: src/package.json] |
| TypeScript | `^5.8.0` declared, 5.9.3 installed [VERIFIED: src/package.json; command `npm --prefix src list typescript vitest @types/node --depth=0`] | Implements strict ESM builder/validator/types modules. [VERIFIED: src/tsconfig.json] | Current repo conventions already require strict typing, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. [VERIFIED: src/tsconfig.json] |
| Vitest | `^3.2.0` declared, 3.2.4 installed [VERIFIED: src/package.json; command `npm --prefix src list typescript vitest @types/node --depth=0`] | Inline fixture tests and live-artifact regression tests. [VERIFIED: src/vitest.config.ts] | Existing repo tests use Vitest everywhere, including determinism and live-artifact patterns. [VERIFIED: src/tests/compiler/validate_output.test.ts; src/tests/inference/build_similarity_graph.test.ts; src/tests/inventory/alias_target_inventory.test.ts] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Existing contract module | `olfactory_graph_read_model.v1` schema constants [VERIFIED: src/graph_read_model/contract.ts] | Source of truth for kinds, IDs, endpoints, invariants, and baseline stats. [VERIFIED: src/graph_read_model/contract.ts] | Import in both builder and validator instead of duplicating literals. [VERIFIED: repo pattern] |
| Existing compiler validation helpers | local first-party code [VERIFIED: src/compiler/types.ts] | Structured error shape, JSON path handling, result combining. [VERIFIED: src/compiler/types.ts] | Reuse the pattern, and optionally mirror helper names in graph-specific types. [VERIFIED: src/compiler/validate_output.ts] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure arrays + internal `Map`/`Set` helpers | A graph library or database driver | Unnecessary and explicitly out of scope for this zero-dependency static phase. [CITED: .planning/REQUIREMENTS.md lines 88-90] |
| First-party validator pattern | Zod/AJV/runtime schema package | Adds new dependency with no requirement benefit; repo already has an accepted validation style. [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts] |
| In-memory typed inputs | Path-based loader API | Violates D-03/D-06 and would blur Phase 56 with Phase 58. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-46] |

**Installation:**
```bash
# No new packages for Phase 56.
```

## Package Legitimacy Audit

No external package installation is recommended for Phase 56. [CITED: .planning/REQUIREMENTS.md lines 88-90]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| N/A | N/A | N/A | N/A | N/A | N/A | No new install [VERIFIED: repo scope] |

**Packages removed due to slopcheck [SLOP] verdict:** none.  
**Packages flagged as suspicious [SUS]:** none.

## Architecture Patterns

### System Architecture Diagram

```text
compiled taxonomy object ─┐
compiled alias object ────┼──> buildOlfactoryGraph(input)
similarity matrix object ─┘         │
                                     ├── map raw IDs -> contract graph IDs
                                     ├── emit contract nodes
                                     ├── emit contract edges
                                     ├── sort nodes/edges deterministically
                                     └── derive stats from emitted arrays
                                                  │
                                                  v
                                   OlfactoryGraph { schema_version, nodes, edges, stats }
                                                  │
                                                  v
                                  validateOlfactoryGraph(graph)
                                                  │
                          ┌───────────────────────┼────────────────────────┐
                          │ duplicate scans       │ endpoint/kind checks    │
                          │ alias target checks   │ similarity endpoint checks
                          └───────────────────────┴────────────────────────┘
                                                  │
                                                  v
                           GraphValidationResult { ok, errors, warnings }
```

### Recommended Project Structure
```text
src/
├── graph_read_model/
│   ├── contract.ts         # existing Phase 55 contract constants
│   ├── types.ts            # graph node/edge/stats/result types + error helpers
│   ├── build_graph.ts      # pure in-memory builder only
│   └── validate_graph.ts   # pure structural validator only
└── tests/
    └── graph_read_model/
        ├── build_graph.test.ts            # inline construction + determinism fixtures
        ├── validate_graph.test.ts         # invariant failure fixtures
        └── live_artifact_baseline.test.ts # read-only baseline regression
```

### Pattern 1: Thin Public Module, Private Local Helpers
**What:** Keep one public export per module and implement small local helpers for node creation, edge creation, sorting, stat derivation, and invariant scans. [VERIFIED: repo pattern from src/inference/build_similarity_graph.ts and src/compiler/validate_output.ts]
**When to use:** Use this when Phase 56 needs a clean planner-visible API without introducing extra cross-file complexity. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 38-45]
**Example:**
```typescript
// Source: repo pattern from src/compiler/types.ts and src/inference/build_similarity_graph.ts
export const buildOlfactoryGraph = (input: BuildOlfactoryGraphInput): OlfactoryGraph => {
  const nodes = [
    ...buildFamilyNodes(input.taxonomy),
    ...buildSubfamilyNodes(input.taxonomy),
    ...buildDescriptorNodes(input.taxonomy),
    ...buildAliasNodes(input.aliases),
  ].sort(compareGraphNodes)

  const edges = [
    ...buildHierarchyEdges(input.taxonomy),
    ...buildAliasEdges(input.aliases),
    ...buildSimilarityEdges(input.similarity),
  ].sort(compareGraphEdges)

  return {
    schema_version: GRAPH_SCHEMA_VERSION,
    nodes,
    edges,
    stats: deriveGraphStats(nodes, edges),
  }
}
```

### Pattern 2: Invariant-Specific Validation Passes
**What:** Validate each invariant in a dedicated pass and combine the results. [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts]
**When to use:** Use this for duplicates, missing endpoints, wrong endpoint kinds, alias targets, similarity endpoints, and stats reconciliation. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 67-76]
**Example:**
```typescript
// Source: repo pattern from src/compiler/types.ts
export const validateOlfactoryGraph = (graph: OlfactoryGraph): GraphValidationResult => {
  return combineGraphResults(
    validateDuplicateNodeIds(graph),
    validateDuplicateEdgeIds(graph),
    validateEdgeEndpoints(graph),
    validateAliasTargets(graph),
    validateSimilarityEndpoints(graph),
    validateBaselineStats(graph),
  )
}
```

### Anti-Patterns to Avoid
- **Silent dedup before validation:** Do not build a final `Map` first and lose evidence of duplicate IDs. Scan arrays first. [VERIFIED: validator pattern necessity from src/compiler/validate_output.ts]
- **Path-based production API:** Do not accept file paths or do `readFile()` inside builder/validator modules. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-46]
- **Similarity reinterpretation:** Do not treat `similarity_matrix.json` as descriptor similarity, material similarity, or symmetric reverse-edge generation instructions. [CITED: .planning/REQUIREMENTS.md lines 23, 87][VERIFIED: src/types/similarity.ts; python JSON inspection]
- **Stats copied from input metadata:** Do not trust incoming `stats` objects as graph truth; derive graph stats from emitted arrays, then compare. [VERIFIED: python JSON inspection; src/compiler/validate_output.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime graph engine | Custom adjacency graph class or DB adapter | Final graph as arrays plus ephemeral `Map`/`Set` indexes inside builder/validator [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 52-54][VERIFIED: repo pattern] | Phase 56 only needs deterministic serializable output and invariant checks. |
| Validation framework | New schema/validator dependency | Graph-specific result helpers that mirror `makeCompilerError` and `combineResults` [VERIFIED: src/compiler/types.ts] | Matches repo style and respects zero-dependency scope. |
| Path loader abstraction | Generic artifact reader for production code | Caller-supplied typed in-memory objects [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-46] | Keeps Phase 56 pure and preserves the Phase 58 boundary. |

**Key insight:** The hard part here is not graph algorithms; it is preserving contract boundaries while avoiding silent structural corruption. [VERIFIED: phase scope + repo evidence]

## Common Pitfalls

### Pitfall 1: Duplicate IDs disappear before validation
**What goes wrong:** A `Map` keyed by ID overwrites earlier nodes or edges, so validation misses duplicates. [VERIFIED: standard consequence of Map semantics]
**Why it happens:** Implementers index too early for convenience. [ASSUMED]
**How to avoid:** Validate duplicates by scanning the original sorted arrays before constructing lookup maps. [VERIFIED: validator design need from src/compiler/validate_output.ts]
**Warning signs:** Validation passes, but node/edge counts drop unexpectedly or `stats` fail reconciliation. [VERIFIED: graph stat logic]

### Pitfall 2: Alias targets validate against raw IDs instead of graph IDs
**What goes wrong:** `alias:*` edges point to raw descriptor IDs or compare against the wrong namespace. [CITED: .planning/REQUIREMENTS.md lines 15, 22][VERIFIED: src/graph_read_model/contract.ts]
**Why it happens:** The alias artifact stores raw target IDs, while the graph uses `descriptor:*` node IDs. [VERIFIED: src/compiler/types.ts; python JSON inspection]
**How to avoid:** Preserve raw `target_descriptor_id` in properties, but validate the endpoint against `descriptor:${target_descriptor_id}`. [VERIFIED: contract + live artifact shape]
**Warning signs:** All 18 aliases exist, but endpoint existence checks fail or `resolves_to` edges target non-`descriptor` kinds. [VERIFIED: python JSON inspection]

### Pitfall 3: Similarity edges get doubled or mis-typed
**What goes wrong:** The builder emits both A→B and B→A, or connects descriptors/materials instead of subfamilies. [CITED: .planning/REQUIREMENTS.md lines 23, 87][VERIFIED: src/types/similarity.ts; src/graph_read_model/contract.ts]
**Why it happens:** People treat similarity as a generic undirected graph instead of honoring the existing sparse matrix artifact. [ASSUMED]
**How to avoid:** Emit exactly one `similar_to` edge per source artifact edge, prefix endpoints as `subfamily:*`, and validate source/target kinds strictly. [VERIFIED: src/types/similarity.ts; python JSON inspection]
**Warning signs:** Edge count exceeds 13 on live artifacts or validator reports wrong endpoint kinds. [VERIFIED: python JSON inspection]

### Pitfall 4: Stats are copied, not derived
**What goes wrong:** `graph.stats` mirrors source metadata even when nodes/edges disagree. [VERIFIED: structural risk]
**Why it happens:** Reusing upstream `taxonomy.stats` or `similarity.stats` feels convenient. [ASSUMED]
**How to avoid:** Derive graph stats from emitted node/edge arrays and compare against `GRAPH_EXPECTED_BASELINE_STATS`. [VERIFIED: src/graph_read_model/contract.ts; src/compiler/validate_output.ts]
**Warning signs:** Validation only compares `graph.stats` to constants, not to actual array counts. [VERIFIED: validation design need]

### Pitfall 5: Builder scope leaks into Phase 58/57
**What goes wrong:** Production modules start reading files, formatting JSON for disk, or adding query helpers. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 17-26, 169-179]
**Why it happens:** Those helpers seem adjacent to graph construction. [ASSUMED]
**How to avoid:** Keep I/O in tests only and stop at `OlfactoryGraph` + `GraphValidationResult`. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 12-16, 36-46]
**Warning signs:** `node:fs` imports appear in `src/graph_read_model/*.ts` or tests start asserting output directories. [VERIFIED: scope boundary]

## Code Examples

Verified patterns from repository sources:

### Structured validation error helper
```typescript
// Source: src/compiler/types.ts
export const makeCompilerError = (
  artifact: CompilerValidationError['artifact'],
  code: string,
  path: string,
  message: string
): CompilerValidationError => ({
  artifact,
  code,
  path: path.startsWith('$') ? path : `$${path}`,
  message,
})
```

### Deterministic edge ordering
```typescript
// Source: src/inference/build_similarity_graph.ts
const sortedEdges = edges.sort((left, right) => {
  if (left.source !== right.source) return left.source.localeCompare(right.source)
  return left.target.localeCompare(right.target)
})
```

### Determinism proof style
```typescript
// Source: src/tests/inference/build_similarity_graph.test.ts
const first = await buildFixtureGraph('2026-01-01T00:00:00.000Z')
const second = await buildFixtureGraph('2026-01-01T00:00:00.000Z')

expect(first.edges).toEqual(second.edges)
expect(first.review_queue).toEqual(second.review_queue)
expect(first.stats).toEqual(second.stats)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Path-based compile pipeline that reads/writes artifacts | Pure in-memory builder/validator for Phase 56 [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 36-46] | Locked in Phase 56 context on 2026-06-09 [CITED: 56-CONTEXT.md] | Prevents accidental boundary drift into Phase 58. |
| Throwing or ad hoc failures | Structured `{ ok, errors, warnings }` results [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts] | Established in existing compiler code [VERIFIED: repo history via current files] | Makes invariant failures testable and planner-friendly. |
| Implicit output order | Explicit lexicographic sort order plus deterministic test proofs [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 57-66][VERIFIED: src/tests/inference/build_similarity_graph.test.ts] | Existing repo pattern before Phase 56 [VERIFIED: build_similarity_graph.ts] | Enables byte-stable in-memory serialization checks. |

**Deprecated/outdated:**
- Using `graphify-out/**`, `data/taxonomy/**`, `data/inference/**`, or `data/enriched_materials.json` as production graph inputs is not allowed for Phase 56. [CITED: .planning/REQUIREMENTS.md lines 72-90; src/graph_read_model/contract.ts]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `OlfactoryGraph.stats` should use the same key set as `GRAPH_EXPECTED_BASELINE_STATS` (`families`, `subfamilies`, `descriptors`, `aliases`, `subfamily_similarity_edges`) to minimize translation friction. [RESOLVED: 2026-06-09 planning check] | Standard Stack / Architecture Patterns | Low: implementation can rename keys, but planner tasks/tests would need updating. |
| A2 | The smallest clean test split is `build_graph.test.ts`, `validate_graph.test.ts`, and `live_artifact_baseline.test.ts`. [ASSUMED] | Recommended Project Structure | Low: files can be merged, but planner task boundaries become less clear. |
| A3 | Phase 56 can leave `warnings` empty unless a concrete warning invariant is introduced later. [RESOLVED: 2026-06-09 planning check] | Open Questions | Low: result shape stays stable either way. |

## Open Questions (RESOLVED)

1. **Should `graph.stats` be validated only against actual arrays or also against a fixed exported shape?**
   - Resolution: Validate against both actual arrays and a fixed graph stats shape that uses the exact baseline key set from `GRAPH_EXPECTED_BASELINE_STATS`: `families`, `subfamilies`, `descriptors`, `aliases`, `subfamily_similarity_edges`. [RESOLVED: 2026-06-09 planning check]
   - Rationale: Reusing the contract key names removes translation logic between `graph.stats` and baseline validation, keeps the builder and validator aligned to Phase 55 contract language, and gives tests an exact stable shape to assert. [CITED: src/graph_read_model/contract.ts lines 71-77][VERIFIED: phase checker finding]

2. **Do we want any non-failing warnings in Phase 56?**
   - Resolution: Keep the `warnings` field in `GraphValidationResult`, but Phase 56 should return an empty warnings array for valid and invalid graphs unless a required warning-only invariant emerges later. [RESOLVED: 2026-06-09 planning check]
   - Rationale: The repo validation pattern expects `{ ok, errors, warnings }`, but no Phase 56 requirement asks for non-failing warning behavior, so inventing warning semantics now would expand scope without improving acceptance coverage. [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 47-48][VERIFIED: .planning/REQUIREMENTS.md lines 20-29]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | TypeScript build/tests | ✓ [VERIFIED: command `node --version`] | 24.14.0 [VERIFIED: command `node --version`] | — |
| npm | Repo scripts/tests | ✓ [VERIFIED: command `npm --version`] | 11.9.0 [VERIFIED: command `npm --version`] | — |
| Python 3 | Research-time artifact inspection only | ✓ [VERIFIED: command `python3 --version`] | 3.12.3 [VERIFIED: command `python3 --version`] | Not required for implementation |
| `data/compiled/v2/taxonomy.json` | Live baseline regression | ✓ [VERIFIED: repository glob] | current live artifact [VERIFIED: repository glob] | None |
| `data/compiled/v2/descriptor_aliases.json` | Live baseline regression | ✓ [VERIFIED: repository glob] | current live artifact [VERIFIED: repository glob] | None |
| `data/compiled/v2/similarity_matrix.json` | Live baseline regression | ✓ [VERIFIED: repository glob] | current live artifact [VERIFIED: repository glob] | None |

**Missing dependencies with no fallback:** none.  
**Missing dependencies with fallback:** none.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` [VERIFIED: src/package.json] |
| Config file | `src/vitest.config.ts` [VERIFIED: src/vitest.config.ts] |
| Quick run command | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` [VERIFIED: src/package.json; src/vitest.config.ts][ASSUMED: target file name pending implementation] |
| Full suite command | `npm --prefix src test` [VERIFIED: src/package.json] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GBLD-01 | Deterministic node creation from in-memory compiled artifacts only | unit | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` [ASSUMED] | ❌ Wave 0 |
| GBLD-02 | Correct `contains_subfamily` and `contains_descriptor` edges | unit | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` [ASSUMED] | ❌ Wave 0 |
| GBLD-03 | Correct alias nodes and `resolves_to` edges | unit + live regression | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` [ASSUMED] | ❌ Wave 0 |
| GBLD-04 | Correct `similar_to` edges preserving score/dimensions/evidence | unit + live regression | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` [ASSUMED] | ❌ Wave 0 |
| GBLD-05 | Stable sort order and no wall-clock nondeterminism | unit | `npm --prefix src test -- tests/graph_read_model/build_graph.test.ts` [ASSUMED] | ❌ Wave 0 |
| GVAL-01 | Duplicate/missing/wrong-kind/alias/similarity structural failures return structured errors | unit | `npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts` [ASSUMED] | ❌ Wave 0 |
| GVAL-02 | Baseline stats reconcile to `10/18/341/18/13` on live artifacts | live regression | `npm --prefix src test -- tests/graph_read_model/live_artifact_baseline.test.ts` [ASSUMED] | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** targeted Phase 56 Vitest file(s). [VERIFIED: repo test workflow][ASSUMED: file names pending]
- **Per wave merge:** `npm --prefix src test` [VERIFIED: src/package.json]
- **Phase gate:** `npm --prefix src run typecheck && npm --prefix src test` before `/gsd-verify-work`. [VERIFIED: src/package.json]

### Wave 0 Gaps
- [ ] `src/graph_read_model/types.ts` — graph model/result types and helper signatures [CITED: .planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md lines 38-48]
- [ ] `src/graph_read_model/build_graph.ts` — public pure builder [CITED: 56-CONTEXT.md lines 40-45]
- [ ] `src/graph_read_model/validate_graph.ts` — public pure validator [CITED: 56-CONTEXT.md lines 40-48]
- [ ] `src/tests/graph_read_model/build_graph.test.ts` — inline fixture construction/determinism [ASSUMED]
- [ ] `src/tests/graph_read_model/validate_graph.test.ts` — invariant failure coverage [ASSUMED]
- [ ] `src/tests/graph_read_model/live_artifact_baseline.test.ts` — read-only baseline regression [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [VERIFIED: phase scope] | — |
| V3 Session Management | no [VERIFIED: phase scope] | — |
| V4 Access Control | no [VERIFIED: phase scope] | — |
| V5 Input Validation | yes [VERIFIED: structural validator scope] | Structured graph validation with exact kind/endpoint/stat checks and JSON-path errors. [VERIFIED: src/compiler/types.ts; src/compiler/validate_output.ts] |
| V6 Cryptography | no [VERIFIED: phase scope] | — |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed or partial in-memory artifact objects | Tampering | Validate structure and endpoints explicitly; do not trust upstream object shape. [VERIFIED: src/compiler/validate_output.ts] |
| Cross-kind ID spoofing (`descriptor:x` used where `subfamily:x` is required) | Spoofing | Enforce contract prefixes and endpoint kinds during build and validation. [VERIFIED: src/graph_read_model/contract.ts] |
| Silent duplicate overwrite via `Map` | Tampering | Scan arrays for duplicate IDs before indexing. [VERIFIED: validation design need] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md` - locked scope, APIs, invariants, determinism, and test strategy. [CITED]
- `.planning/REQUIREMENTS.md` - exact Phase 56 requirements and anti-scope. [CITED]
- `.planning/ROADMAP.md` - Phase 56 goal, success criteria, and milestone boundaries. [CITED]
- `src/graph_read_model/contract.ts` - schema version, kinds, ID rules, allowed inputs, invariants, baseline stats. [VERIFIED]
- `docs/olfactory_graph_contract.md` - maintainer-readable contract mirror. [VERIFIED]
- `src/compiler/types.ts` and `src/compiler/validate_output.ts` - structured validation result pattern, error shape, and combine semantics. [VERIFIED]
- `src/types/taxonomy.ts`, `src/compiler/types.ts`, `src/types/similarity.ts`, `src/types/alias.ts` - live TypeScript input shapes. [VERIFIED]
- `src/inference/build_similarity_graph.ts` and `src/tests/inference/build_similarity_graph.test.ts` - deterministic ordering, injectable timestamps, and determinism proof style. [VERIFIED]
- `src/tests/compiler/alias_target_integrity.test.ts` and `src/tests/inventory/alias_target_inventory.test.ts` - alias-target risk patterns and live-artifact regression style. [VERIFIED]
- `src/package.json`, `src/tsconfig.json`, `src/vitest.config.ts` - toolchain, scripts, and test framework. [VERIFIED]
- Python JSON inspection of `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json` - current baseline counts, alias-target validity, and similarity endpoint validity. [VERIFIED: command output]
- `gsd-sdk query init.phase-op 56` - phase directory metadata and research target confirmation. [VERIFIED: command output]
- `.agents/skills/gsd-plan-phase/SKILL.md` and `.agents/skills/gsd-validate-phase/SKILL.md` - relevant local planning workflow constraints. [VERIFIED]

### Secondary (MEDIUM confidence)
- `.planning/phases/55-graph-contract-boundary-decisions/55-RESEARCH.md`, `55-01-SUMMARY.md`, and `55-PATTERNS.md` - prior-phase handoff, analogs, and established test/layout patterns. [CITED]

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - entirely repository-verified; no new package choice is required. [VERIFIED]
- Architecture: HIGH - phase boundaries, APIs, invariants, and live baseline are locked in Phase 55/56 artifacts. [CITED: 56-CONTEXT.md; VERIFIED: contract.ts; python JSON inspection]
- Pitfalls: MEDIUM - major risks are strongly supported by repo structure, but a few causal explanations are marked assumed. [VERIFIED + ASSUMED mixed]

**Research date:** 2026-06-09  
**Valid until:** 2026-07-09 [ASSUMED: stable local repo phase scope]
