# Phase 57: Query Proofs - Research

**Researched:** 2026-06-10  
**Domain:** Deterministic in-memory graph query proofs over validated `OlfactoryGraph` (zero-dependency TypeScript) [VERIFIED: repository file read]  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
- **CLI for graph query/export** — Phase 58
- **Writer to `data/read-models/olfactory-graph/v2.11/`** — Phase 58
- **Boundary audit / protected-path hashing** — Phase 58 (`GVAL-03+`)
- **Maintainer documentation with query proof examples** — Phase 59 (`GDOC-01`)
- **Neo4J mapping notes** — Phase 59 (`GDOC-02`)
- **Multi-hop similarity traversal** — out of scope; 1-hop sufficient for v2.11 proofs
- **Same-family related descriptors tier** — deferred; Phase 57 uses same-subfamily only
- **Material / descriptor-level similarity** — separate milestone per REQUIREMENTS.md
- **Agent/RAG runtime consumption** — future (`GRAG-01`); Phase 57 only structures static proof evidence
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GQRY-01 | Maintainer can generate deterministic query proofs for descriptors by family/subfamily, including descriptor status and review metadata. [CITED: .planning/REQUIREMENTS.md lines 36-36] | Implement `getDescriptorsByFamily` / `getDescriptorsBySubfamily` filtering descriptor nodes by `properties.family_id` / `properties.subfamily_id`; project GQRY fields only; sort by descriptor `id`. [VERIFIED: src/graph_read_model/build_graph.ts lines 84-110][VERIFIED: baseline — `woody` family has 18 descriptors across `woody_dry` and `woody_mossy`] |
| GQRY-02 | Maintainer can generate deterministic query proofs for alias resolution paths from Alias to Descriptor. [CITED: .planning/REQUIREMENTS.md lines 37-37] | Implement `resolveAliasPath` walking `alias:{alias}` → `resolves_to` → `descriptor:*` → parent subfamily via `contains_descriptor` inbound edge → parent family via `contains_subfamily`. [VERIFIED: src/graph_read_model/build_graph.ts lines 118-147][VERIFIED: data/compiled/v2/descriptor_aliases.json — 18 aliases e.g. `cedar` → `cedarwood`] |
| GQRY-03 | Maintainer can generate deterministic query proofs for descriptor-to-family paths and related descriptors through shared family/subfamily context. [CITED: .planning/REQUIREMENTS.md lines 38-38] | Implement `getDescriptorToFamilyPath` (descriptor → subfamily → family chain) and `getRelatedDescriptors` (same `subfamily_id`, exclude self, all statuses). [VERIFIED: src/graph_read_model/contract.ts GRAPH_EDGE_ENDPOINT_KINDS][CITED: 57-CONTEXT.md D-20–D-22] |
| GQRY-04 | Maintainer can generate deterministic query proofs for subfamily similarity neighborhoods, cross-family bridges and graph hubs based only on existing similarity edges. [CITED: .planning/REQUIREMENTS.md lines 39-39] | Implement 1-hop bidirectional `similar_to` neighborhood, cross-family filter on `family_id`, hub by in+out degree with lexicographic tie-break. Baseline: hub=`floral_rose` (degree 3), 5 cross-family bridges, 13 total similarity edges. [VERIFIED: node script on data/compiled/v2/similarity_matrix.json + taxonomy.json] |
| GQRY-05 | Maintainer can inspect query proof outputs that are useful for a future Alquem.io AI agent/RAG layer without implementing agent runtime, SaaS runtime or API endpoints. [CITED: .planning/REQUIREMENTS.md lines 40-40] | Typed `{ query_kind, params, result, path }` proofs JSON-serializable; live aggregate regression over full baseline catalog proves consumability at scale. [CITED: 57-CONTEXT.md D-07–D-09, D-25][VERIFIED: Phase 56 JSON.stringify determinism pattern in build_graph.test.ts] |
</phase_requirements>

## Summary

Phase 57 adds a third pure graph module — `query_graph.ts` — that consumes an already-validated `OlfactoryGraph` and returns named, typed proof objects for eight stable `query_kind` values. [CITED: 57-CONTEXT.md D-03–D-08] No new runtime dependencies, filesystem access, or graph mutation are required; the phase extends the Phase 56 pattern (pure transform + structured results + hybrid Vitest coverage) from build/validate into read-only query proofs. [VERIFIED: src/graph_read_model/build_graph.ts; src/graph_read_model/validate_graph.ts; src/tests/graph_read_model/live_artifact_baseline.test.ts]

Implementation is primarily graph traversal over existing node/edge arrays with ephemeral `Map` indexes built at function entry (same technique as `validate_graph.ts` `buildNodeIndex`). [VERIFIED: src/graph_read_model/validate_graph.ts lines 91-99] Each public function maps 1:1 to GQRY requirements, returns a proof envelope with deterministic sort rules independent of graph array order, and projects only GQRY-relevant property subsets — not full `GraphNode`/`GraphEdge` copies. [CITED: 57-CONTEXT.md D-09–D-10]

Live baseline analysis confirms stable exemplar and regression targets: 10 families, 18 aliases, 13 `similar_to` edges, 5 cross-family bridges, hub subfamily `floral_rose` (degree 3), and `woody` family with 18 descriptors. [VERIFIED: node script on data/compiled/v2/*] Tests should mirror Phase 56: inline minimal fixtures with exact proof snapshots plus a read-only live regression that exercises the full aggregate catalog without snapshotting the entire output. [CITED: 57-CONTEXT.md D-23–D-29][VERIFIED: .planning/phases/56-pure-builder-structural-validation/56-PATTERNS.md]

**Primary recommendation:** Extend `types.ts` with discriminated proof types per `query_kind`, implement nine named query functions in one `query_graph.ts` module using ephemeral indexes and explicit sort comparators, and prove correctness with `query_graph.test.ts` (inline) + `query_live_baseline.test.ts` (aggregate) following the Phase 56 test layout exactly.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Descriptor lookup by family/subfamily | API / Backend (pure module) | — | Reads in-memory `OlfactoryGraph` nodes; no client or DB tier exists in v2.11 |
| Alias resolution path traversal | API / Backend (pure module) | — | Walks `resolves_to` + hierarchy edges already in graph |
| Descriptor-to-family path + related descriptors | API / Backend (pure module) | — | Hierarchy traversal over `contains_descriptor` / `contains_subfamily` |
| Similarity neighborhood / bridges / hub | API / Backend (pure module) | — | Reads existing `similar_to` edge properties only; no scoring tier |
| Proof type definitions | API / Backend (types.ts) | — | Shared contract for future Phase 58 CLI and Phase 59 docs |
| Compiled artifact loading | Test layer only | — | Production `query_graph.ts` is fs-free per D-29 |
| Graph build + validate | Existing Phase 56 modules | Test setup | Tests call `buildOlfactoryGraph` + `validateOlfactoryGraph` before queries |

## Project Constraints (from .cursor/rules/)

No `.cursor/rules/` directory exists in this repository. [VERIFIED: glob search returned 0 files]

Prisma schema conventions rule applies only to `**/*.prisma` files — not relevant to this phase. [VERIFIED: workspace rule globs]

Repo-wide zero-dependency constraint from REQUIREMENTS.md anti-scope table applies: no new graph/RDF/schema/CLI/scoring npm packages. [CITED: .planning/REQUIREMENTS.md lines 90-90]

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | `^5.8.0` | Strict ESM modules under `src/` | Existing repo toolchain [VERIFIED: src/package.json] |
| Node.js built-ins only | — | Test-layer `fs/promises` for live regression | Phase 56 established boundary; production modules fs-free [VERIFIED: live_artifact_baseline.test.ts] |
| Vitest | `^3.2.0` | Unit + live regression tests | Existing test runner [VERIFIED: src/package.json; src/vitest.config.ts] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `buildOlfactoryGraph` | — (local) | Construct graph from compiled artifacts | All query tests (inline + live) [VERIFIED: src/graph_read_model/build_graph.ts] |
| `validateOlfactoryGraph` | — (local) | Precondition gate in tests | Enforce D-02 validate-before-query [VERIFIED: src/graph_read_model/validate_graph.ts] |
| `GRAPH_EXPECTED_BASELINE_STATS` | — (local) | Live regression count assertions | `query_live_baseline.test.ts` [VERIFIED: src/graph_read_model/contract.ts lines 71-77] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Ephemeral `Map` indexes per call | Persisted indexes on `OlfactoryGraph` | Violates Phase 56 D-11 / D-05 — rejected |
| Generic graph traversal DSL | Named functions per GQRY | Violates D-04 — rejected |
| Full node snapshots in proofs | Projected GQRY fields only | Bloated proofs, harder agent inspection — rejected per D-09 |

**Installation:** None required — zero new packages.

**Version verification:**
```bash
npm view vitest version    # 3.2.4 [VERIFIED: npm registry, 2026-06-10]
npm view typescript version  # 5.8.3 [VERIFIED: npm registry, 2026-06-10]
```

## Package Legitimacy Audit

> Phase 57 installs **no external packages**. Existing devDependencies (`vitest`, `typescript`, `@types/node`) were verified in Phase 56. No slopcheck gate required for new installs.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| — | — | — | — | — | — | No new packages |

**Packages removed due to slopcheck [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TEST LAYER (Vitest only)                          │
│  readFile(data/compiled/v2/*.json) → parse → BuildOlfactoryGraphInput   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              buildOlfactoryGraph (Phase 56 — unchanged)                  │
│         taxonomy + aliases + similarity → OlfactoryGraph                 │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           validateOlfactoryGraph (Phase 56 — tests only gate)            │
│                    ok: true required before query                        │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              query_graph.ts (Phase 57 — NEW, fs-free)                    │
│  ┌─────────────────────┐    ephemeral Map indexes at function entry       │
│  │ getDescriptorsBy*   │──► filter descriptor nodes by family/subfamily  │
│  │ resolveAliasPath    │──► alias → descriptor → subfamily → family     │
│  │ getDescriptorTo*    │──► hierarchy path + same-subfamily related        │
│  │ getSimilarity*      │──► 1-hop neighborhood / bridges / hub           │
│  └─────────────────────┘                                                 │
│                    explicit sort → GraphQueryProof<T>                    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│   Typed proof output: { query_kind, params, result, path }               │
│   JSON-serializable → future Phase 58 CLI / Phase 59 docs / GRAG-01     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/graph_read_model/
├── contract.ts          # unchanged
├── types.ts             # extend with GraphQueryProof + result payload types
├── build_graph.ts       # unchanged
├── validate_graph.ts    # unchanged
└── query_graph.ts       # NEW — all nine public query functions

src/tests/graph_read_model/
├── query_graph.test.ts           # NEW — inline fixtures, snapshots, determinism
├── query_live_baseline.test.ts   # NEW — aggregate live catalog regression
├── live_artifact_baseline.test.ts  # extend fs-free guard to query_graph.ts
└── (existing Phase 56 tests unchanged)
```

### Pattern 1: Ephemeral Node Index (reuse validator pattern)
**What:** Build `Map<string, GraphNode>` at function entry; discard after return.  
**When to use:** Any query needing O(1) node lookup by graph ID.  
**Example:**
```typescript
// Source: src/graph_read_model/validate_graph.ts lines 91-99
const buildNodeIndex = (nodes: readonly GraphNode[]): Map<string, GraphNode> => {
  const index = new Map<string, GraphNode>()
  for (const node of nodes) {
    if (!index.has(node.id)) {
      index.set(node.id, node)
    }
  }
  return index
}
```

### Pattern 2: Projected Descriptor Proof Item
**What:** Map descriptor nodes to GQRY-relevant fields only; sort by raw `descriptor_id`.  
**When to use:** `getDescriptorsByFamily`, `getDescriptorsBySubfamily`, `getRelatedDescriptors`.  
**Example:**
```typescript
// Source: src/graph_read_model/build_graph.ts lines 86-98; 57-CONTEXT.md D-09
type DescriptorProofItem = {
  readonly id: string           // raw descriptor_id
  readonly graph_id: string     // descriptor:{id}
  readonly status: 'curated' | 'candidate' | 'inferred'
  readonly review_required: boolean
  readonly corpus_derived: boolean
  readonly source: 'seed' | 'corpus' | 'inferred'
}

const toDescriptorProof = (node: GraphNode): DescriptorProofItem => ({
  id: String(node.properties.descriptor_id),
  graph_id: node.id,
  status: node.properties.status as DescriptorProofItem['status'],
  review_required: Boolean(node.properties.review_required),
  corpus_derived: Boolean(node.properties.corpus_derived),
  source: node.properties.source as DescriptorProofItem['source'],
})
```

### Pattern 3: Path Segment Chain
**What:** Ordered path segments with graph ID + name for traversal proofs.  
**When to use:** `alias_resolution_path`, `descriptor_to_family_path`.  
**Example:**
```typescript
// Source: 57-CONTEXT.md D-22; src/graph_read_model/contract.ts GRAPH_EDGE_ENDPOINT_KINDS
type PathSegment = {
  readonly graph_id: string
  readonly kind: GraphNodeKind
  readonly name?: string
}

// alias_resolution_path path order:
// [alias, descriptor, subfamily, family] — fixed segment order per D-10
```

### Pattern 4: Similarity Neighborhood (1-hop, bidirectional)
**What:** For subfamily S, collect all `similar_to` edges where S is source OR target; project edge properties; sort by score desc then neighbor id.  
**When to use:** `getSimilarityNeighborhood`.  
**Example:**
```typescript
// Source: 57-CONTEXT.md D-16, D-19; data/compiled/v2/similarity_matrix.json
const compareNeighborhoodEntries = (left, right) => {
  const leftScore = left.final_score ?? left.score
  const rightScore = right.final_score ?? right.score
  if (rightScore !== leftScore) return rightScore - leftScore
  return left.neighbor_id.localeCompare(right.neighbor_id)
}
// Note: edges are directed in OlfactoryGraph; neighborhood treats them as undirected for 1-hop
```

### Pattern 5: Cross-Family Bridge Detection
**What:** Filter `similar_to` edges where source/target subfamilies have different `family_id` in node properties.  
**When to use:** `getCrossFamilyBridges`.  
**Verified baseline:** 5 bridges — `citrus_fresh→floral_white`, `floral_rose→woody_dry`, `floral_rose→woody_mossy`, `fresh_spice→warm_spice`, `vanilla→warm_spice`. [VERIFIED: node script on compiled v2 artifacts]

### Pattern 6: Hub by Degree
**What:** Count in+out `similar_to` edges per subfamily; max degree wins; tie-break by subfamily `id` lexicographic.  
**When to use:** `getSimilarityHub`.  
**Verified baseline:** `floral_rose`, degree 3. [VERIFIED: node script on compiled v2 artifacts]

### Pattern 7: Hybrid Test Strategy (Phase 56 mirror)
**What:** Inline minimal fixtures with exact `toEqual` proof snapshots; separate live file with aggregate structural assertions.  
**When to use:** All GQRY requirements.  
**Example:**
```typescript
// Source: src/tests/graph_read_model/build_graph.test.ts lines 136-145; 57-CONTEXT.md D-28
const graph = buildOlfactoryGraph(input)
expect(validateOlfactoryGraph(graph).ok).toBe(true)
const first = getDescriptorsByFamily(graph, 'woody')
const second = getDescriptorsByFamily(graph, 'woody')
expect(first).toEqual(second)
expect(JSON.stringify(first)).toBe(JSON.stringify(second))
```

### Anti-Patterns to Avoid
- **Re-validating inside query functions:** Tests gate with `validateOlfactoryGraph`; production queries trust input per D-02.
- **Reading compiled JSON in `query_graph.ts`:** Violates D-29; all `readFile` stays in test files.
- **Passthrough graph array order:** Proof lists must use explicit sort rules per D-10 even though builder already sorts nodes/edges.
- **Multi-hop similarity BFS:** Locked out per D-16; 1-hop only.
- **Recomputing similarity scores:** Read `score`/`final_score`/`dimensions`/`evidence` from edge properties only per D-19.
- **Returning full `GraphNode` objects:** Violates D-09 property depth constraint.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Graph node lookup | Custom persistent index on `OlfactoryGraph` | Ephemeral `Map` per function call | Phase 56 D-11 forbids persisted indexes; validator already uses this pattern |
| Query DSL / fluent builder | Generic traversal engine | Nine named functions per D-04 | Locked API shape; agent/RAG needs stable `query_kind` |
| Sorting / determinism | Rely on input array order | Explicit `localeCompare` comparators | Graph sort order ≠ query result sort order (D-10) |
| File loading in production | Custom artifact loader | Test-layer `readJson` + `buildOlfactoryGraph` | Phase 56 fs boundary is proven and tested |
| Structural pre-checks | Duplicate validation in queries | `validateOlfactoryGraph` in tests only | D-02 separation of concerns |
| Graph library (graphology, etc.) | External dep | Plain arrays + `Map` | Zero-dependency milestone constraint |

**Key insight:** The graph is small (≤341 descriptor nodes, 13 similarity edges). Ephemeral `Map` indexes and linear edge scans are sufficient and match established repo patterns — external graph libraries add dependency risk with no measurable benefit.

## Common Pitfalls

### Pitfall 1: Directed vs Undirected Neighborhood
**What goes wrong:** `getSimilarityNeighborhood` only follows outgoing `similar_to` edges, missing inbound neighbors.  
**Why it happens:** Edges are stored directed (`source` → `target`) in `build_graph.ts`.  
**How to avoid:** For 1-hop neighborhood, collect edges where `subfamilyId` matches either `source` or `target` (after normalizing to `subfamily:{id}`).  
**Warning signs:** Live regression count mismatch; `woody_dry` missing `floral_rose` as neighbor.

### Pitfall 2: Raw ID vs Graph ID in Params
**What goes wrong:** `params` uses `family:woody` while tests assert `woody`.  
**Why it happens:** Builder uses prefixed graph IDs internally; taxonomy uses raw IDs.  
**How to avoid:** Public function parameters accept **raw taxonomy IDs** (`woody`, `cedar`, `rose`); `params` in proof objects echo the raw input; `result`/`path` use graph IDs where needed. [CITED: 57-CONTEXT.md D-07 params examples]

### Pitfall 3: Alias Key vs Graph ID
**What goes wrong:** Looking up `alias:cedarwood` when alias key is `cedar`.  
**Why it happens:** Alias map keys are surface forms (`cedar`, `orange blossom`), not target descriptor IDs.  
**How to avoid:** `resolveAliasPath(graph, 'cedar')` → node `alias:cedar` → target `descriptor:cedarwood`. [VERIFIED: data/compiled/v2/descriptor_aliases.json]

### Pitfall 4: Related Descriptors Include Self
**What goes wrong:** `getRelatedDescriptors` returns the queried descriptor in the list.  
**Why it happens:** Same `subfamily_id` filter without exclusion.  
**How to avoid:** Explicitly exclude `descriptorId` after collection; sort remainder by `id`. [CITED: 57-CONTEXT.md D-20]

### Pitfall 5: Cross-Family Bridge Uses Wrong Family Key
**What goes wrong:** Bridge detection compares subfamily names instead of `family_id` properties.  
**Why it happens:** Subfamily nodes carry both `name` and `family_id` in properties.  
**How to avoid:** Compare `properties.family_id` on both endpoint subfamily nodes per D-18. [VERIFIED: src/graph_read_model/build_graph.ts lines 63-70]

### Pitfall 6: Hub Tie-Break Wrong Direction
**What goes wrong:** On equal degree, picking arbitrary subfamily instead of lexicographically smallest `id`.  
**Why it happens:** `Map` iteration order is insertion order, not sorted.  
**How to avoid:** Track hub candidate with explicit `id.localeCompare` tie-break per D-17.

### Pitfall 7: Similarity Sort Uses Wrong Score Field
**What goes wrong:** Sorting by `score` when `final_score` is present (or vice versa).  
**Why it happens:** `final_score` is optional on some edges.  
**How to avoid:** Use `final_score ?? score` for descending sort per D-19. [VERIFIED: src/graph_read_model/build_graph.ts lines 150-163]

### Pitfall 8: Inline Tests Accidentally Read Live Files
**What goes wrong:** Inline fixtures become non-hermetic if they import compiled JSON.  
**Why it happens:** Copy-paste from `live_artifact_baseline.test.ts`.  
**How to avoid:** Hardcode stable v2 IDs in inline fixtures only; live reads exclusively in `query_live_baseline.test.ts` per D-24/D-27.

## Code Examples

### Validate-Before-Query Test Setup
```typescript
// Source: src/tests/graph_read_model/live_artifact_baseline.test.ts; 57-CONTEXT.md D-02
import { buildOlfactoryGraph } from '../../graph_read_model/build_graph.js'
import { validateOlfactoryGraph } from '../../graph_read_model/validate_graph.js'
import { getDescriptorsByFamily } from '../../graph_read_model/query_graph.js'

const graph = buildOlfactoryGraph({ taxonomy, aliases, similarity })
const validation = validateOlfactoryGraph(graph)
expect(validation.ok).toBe(true)

const proof = getDescriptorsByFamily(graph, 'woody')
expect(proof.query_kind).toBe('descriptors_by_family')
expect(proof.params).toEqual({ family_id: 'woody' })
```

### Discriminated Proof Type (planner baseline)
```typescript
// Source: 57-CONTEXT.md D-07, D-08 — exact result variants are planner discretion
type GraphQueryProof<TKind extends string, TParams, TResult> = {
  readonly query_kind: TKind
  readonly params: TParams
  readonly result: TResult
  readonly path?: readonly PathSegment[]
}

export type DescriptorsByFamilyProof = GraphQueryProof<
  'descriptors_by_family',
  { readonly family_id: string },
  { readonly descriptors: readonly DescriptorProofItem[] }
>
```

### FS-Free Production Guard (extend Phase 56 test)
```typescript
// Source: src/tests/graph_read_model/live_artifact_baseline.test.ts lines 92-104
const querySource = await readFile(productionModulePaths.queryGraph, 'utf8')
expect(querySource).not.toMatch(/from 'node:fs'|readFile\(/)
```

### Live Aggregate Regression Sketch
```typescript
// Source: 57-CONTEXT.md D-25
for (const family of taxonomy.families) {
  const proof = getDescriptorsByFamily(graph, family.id)
  expect(proof.result.descriptors.length).toBeGreaterThan(0)
  expect(proof.result.descriptors.map(d => d.id)).toEqual(
    [...proof.result.descriptors.map(d => d.id)].sort((a, b) => a.localeCompare(b))
  )
}
expect(getCrossFamilyBridges(graph).result.bridges).toHaveLength(5)
expect(getSimilarityHub(graph).result.hub.subfamily_id).toBe('floral_rose')
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No query layer (Phase 56) | Named proof functions over `OlfactoryGraph` | Phase 57 | Enables GQRY-01–05 without runtime |
| Inventory scripts for alias checks | Graph-native `resolveAliasPath` proof | Phase 57 | Proofs compose with hierarchy paths |
| Raw similarity_matrix inspection | Graph `similar_to` edge queries | Phase 56→57 | Consistent ID namespace and edge properties |

**Deprecated/outdated:**
- Per-requirement manual JSON inspection for graph queries — replaced by typed proof objects and Vitest regression.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 1-hop neighborhood is **bidirectional** (match source OR target) | Pattern 4 / Pitfall 1 | Missing neighbors in proofs; live regression failure |
| A2 | Public params use **raw taxonomy IDs** not graph-prefixed IDs | Pitfall 2 | Proof snapshots and Phase 59 docs inconsistent |
| A3 | Missing/unknown query targets return **empty structured proofs** (not throw) | Open Questions | Tests may need error-path fixtures if operator prefers throws |
| A4 | `path` for non-traversal queries (`similarity_hub`, list queries) is **`undefined`** not `[]` | Agent Discretion | Snapshot churn if planner chooses `[]` instead |
| A5 | Descriptor `name` is omitted from proof items unless present on node properties | Pattern 2 | Descriptor nodes lack `name` in builder — only `descriptor_id` available [VERIFIED: build_graph.ts lines 86-98] |

## Open Questions

1. **Missing entity behavior (unknown family, alias, descriptor, subfamily)**
   - What we know: D-02 assumes valid graph; no locked error contract for bad query params.
   - What's unclear: Throw vs empty proof vs proof with `result: null`.
   - Recommendation: Return structured proof with empty collections (`descriptors: []`, `bridges: []`) and `path: undefined`; reserve throws for programmer errors (e.g., null graph). Inline tests use valid IDs only; optional one test for unknown alias → empty path.

2. **`path` shape for `similarity_hub` and list-only queries**
   - What we know: Agent discretion per CONTEXT.
   - What's unclear: `undefined` vs `[]`.
   - Recommendation: `path: undefined` for queries without traversal chain; use `path` only for `alias_resolution_path` and `descriptor_to_family_path`.

3. **Whether descriptor proof items include `name`**
   - What we know: D-09 says "+ id, name as needed"; descriptor nodes have no `name` property in builder.
   - What's unclear: Use `descriptor_id` as display name or omit `name`.
   - Recommendation: Omit `name` on descriptor proof items; include `name` on path segments for subfamily/family nodes where `properties.name` exists.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | TypeScript build/tests | ✓ | v24.14.0 [VERIFIED: `node --version`] | — |
| npm | Repo scripts/tests | ✓ | 11.9.0 [VERIFIED: `npm --version`] | — |
| `data/compiled/v2/taxonomy.json` | Live query regression | ✓ | current live artifact [VERIFIED: repository glob] | None — blocks live tests |
| `data/compiled/v2/descriptor_aliases.json` | Live query regression | ✓ | 18 aliases [VERIFIED: file read] | None |
| `data/compiled/v2/similarity_matrix.json` | Live query regression | ✓ | 13 edges [VERIFIED: file read] | None |

**Missing dependencies with no fallback:** none  
**Missing dependencies with fallback:** none

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `^3.2.0` [VERIFIED: src/package.json] |
| Config file | `src/vitest.config.ts` [VERIFIED: src/vitest.config.ts] |
| Quick run command | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` |
| Full suite command | `npm --prefix src test` [VERIFIED: src/package.json] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GQRY-01 | Descriptors by family/subfamily with status metadata | unit (inline snapshot) | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | ❌ Wave 0 |
| GQRY-02 | Alias resolution path alias→descriptor→subfamily→family | unit (inline snapshot) | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | ❌ Wave 0 |
| GQRY-03 | Descriptor-to-family path + same-subfamily related descriptors | unit (inline snapshot) | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | ❌ Wave 0 |
| GQRY-04 | 1-hop neighborhood, cross-family bridges, hub | unit + live aggregate | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts` | ❌ Wave 0 |
| GQRY-05 | Typed proof contract + baseline-scale consumability | unit + live aggregate | `npm --prefix src test -- tests/graph_read_model/query_live_baseline.test.ts` | ❌ Wave 0 |
| D-28 | Build+validate+query twice → deep equal | unit | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts` | ❌ Wave 0 |
| D-29 | Production module fs-free | guard test | `npm --prefix src test -- tests/graph_read_model/live_artifact_baseline.test.ts` | ✅ extend existing |

### Sampling Rate
- **Per task commit:** targeted query test file(s)
- **Per wave merge:** `npm --prefix src test`
- **Phase gate:** `npm --prefix src run typecheck && npm --prefix src test` before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/graph_read_model/types.ts` — extend with `GraphQueryProof`, per-`query_kind` result types, `DescriptorProofItem`, `PathSegment`
- [ ] `src/graph_read_model/query_graph.ts` — nine public query functions
- [ ] `src/tests/graph_read_model/query_graph.test.ts` — inline fixtures, proof snapshots, determinism
- [ ] `src/tests/graph_read_model/query_live_baseline.test.ts` — aggregate catalog over compiled v2
- [ ] `src/tests/graph_read_model/live_artifact_baseline.test.ts` — extend fs-free guard to include `query_graph.ts`

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | partial | Graph validated before query in tests; query params are string lookups over trusted in-memory graph |
| V6 Cryptography | no | — |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Query module reading protected paths | Information Disclosure | FS-free production module; test-only reads of `GRAPH_ALLOWED_PRODUCTION_INPUTS` [VERIFIED: contract.ts] |
| Accidental graph mutation during query | Tampering | Pure functions; no writes; readonly types on `OlfactoryGraph` |
| Oversized proof payloads | Denial of Service | Projected fields only (D-09); no full node copies; baseline scale is bounded (341 descriptors max) |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/57-query-proofs/57-CONTEXT.md` — locked decisions, GQRY mapping, test strategy
- `.planning/REQUIREMENTS.md` — GQRY-01 through GQRY-05
- `.planning/ROADMAP.md` lines 127-137 — Phase 57 goal and success criteria
- `src/graph_read_model/build_graph.ts` — node/edge construction, property shapes
- `src/graph_read_model/validate_graph.ts` — ephemeral index pattern
- `src/graph_read_model/contract.ts` — edge endpoint kinds, baseline stats
- `src/graph_read_model/types.ts` — existing graph types to extend
- `src/tests/graph_read_model/live_artifact_baseline.test.ts` — live regression + fs-free guard
- `src/tests/graph_read_model/build_graph.test.ts` — determinism assertion pattern
- `.planning/phases/56-pure-builder-structural-validation/56-PATTERNS.md` — module/test analogs
- `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json` — baseline exemplar IDs and counts
- `src/package.json`, `src/vitest.config.ts` — toolchain

### Secondary (MEDIUM confidence)
- `.planning/phases/56-pure-builder-structural-validation/56-RESEARCH.md` — validation architecture template
- `.planning/STATE.md` — Phase 57 accumulated decisions

### Tertiary (LOW confidence)
- Assumptions A1, A3, A4 in Assumptions Log — need planner confirmation if snapshots depend on them

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new packages; entirely repo-verified toolchain
- Architecture: HIGH — Phase 57 decisions locked in CONTEXT; baseline counts verified by script
- Pitfalls: MEDIUM-HIGH — traversal semantics well-supported; missing-entity behavior is assumption A3

**Research date:** 2026-06-10  
**Valid until:** 2026-07-10

## RESEARCH COMPLETE
