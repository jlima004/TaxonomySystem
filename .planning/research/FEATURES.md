# Feature Landscape: v2.11 Olfactory Knowledge Graph Read Model

**Domain:** Static read-only olfactory knowledge graph over existing compiled taxonomy artifacts  
**Project:** Olfactory Taxonomy System  
**Researched:** 2026-06-08  
**Overall confidence:** HIGH for compiled-artifact-derived features; MEDIUM for future Neo4J readiness details because Neo4J is intentionally not implemented in v2.11.

## Research Basis

v2.11 is a subsequent, deliberately small milestone. It should produce a static graph read model from existing artifacts only, not a new taxonomy publication or runtime product layer.

Evidence from required project files:

- `.planning/PROJECT.md` active requirements: GKG-01 through GKG-05 define schema, read-only builder/export, validation, query proofs and future Neo4J documentation.
- `.planning/PROJECT.md` protected boundaries: no taxonomy seed mutation, no `data/compiled/v2/*` mutation/publication, no FUT-01/FUT-02 curation, no Graphify changes, no scoring/UI/MVP/runtime, no Neo4J/Docker/heavy dependencies.
- `src/types/taxonomy.ts`: compiled taxonomy structure is `Family -> Subfamily -> CanonicalDescriptor` with descriptor `source`, `frequency`, `status`, `review_required` and `corpus_derived` properties.
- `src/types/similarity.ts`: similarity artifact is a sparse graph whose edges have `source`, `target`, score/dimensions/evidence and stats are explicitly `subfamily_count`, `edge_count`, `density`.
- `src/types/corpus.ts`: material records exist in the broader system but are large corpus inputs, not part of the compiled v2 artifact contract.
- `data/compiled/v2/taxonomy.json`: current baseline has 10 families, 18 subfamilies and 341 descriptors.
- `data/compiled/v2/descriptor_aliases.json`: current baseline has 18 aliases.
- `data/compiled/v2/similarity_matrix.json`: current baseline has 13 similarity edges and 257 review queue items. All observed similarity edge endpoints resolve to subfamily IDs. Some endpoint strings also exist as descriptor IDs (`amber`, `leathery`, `vanilla`), so v2.11 must namespace graph IDs and treat similarity edges as subfamily-level unless later repo evidence proves otherwise.

## Committed v2.11 Requirements vs Future Scope

| Area | v2.11 Committed Requirement | Explicitly Deferred / Protected |
|------|-----------------------------|---------------------------------|
| Schema | Minimal graph contract for canonical node IDs, node types, relation types, properties and invariants | Rich ontology, OWL/RDF, graph database schema migrations |
| Inputs | Read-only `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json` from `data/compiled/v2/` | Mutating taxonomy seeds, rewriting compiled v2 artifacts, reopening review queues |
| Builder/export | Deterministic static export in a separated read-model location | Official compiled publication, runtime API, streaming service, product backend |
| Validation | Structural graph validation, endpoint integrity, alias target integrity, determinism, protected-boundary preservation | Semantic curation or resolving low-support/conflict items |
| Queries | Query proofs over static JSON for descriptor paths, aliases and subfamily neighborhoods | RAG runtime, SaaS search API, UI, scoring redesign |
| Neo4J | Documentation/mapping for a future import path | Neo4J dependency, Docker, database provisioning, Cypher-backed runtime |
| Materials | Defer by default; optional only behind explicit boundary audit | Pulling `data/enriched_materials.json` into core graph by default |

## Table Stakes

Features users of the first static graph read model will expect. Missing these would make the milestone feel incomplete or unsafe.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Minimal graph schema contract | GKG-01 requires a stable read-model contract before queries or future exports can be trusted | Medium | Define node labels, relation types, ID format, required properties and invariants in docs and TypeScript types. Keep it smaller than a full ontology. |
| Namespaced canonical graph IDs | Compiled IDs collide across semantic types (`amber`, `leathery`, `vanilla` can be both subfamily and descriptor IDs) | Medium | Use type-prefixed IDs such as `family:floral`, `subfamily:floral_white`, `descriptor:ylang_ylang`, `alias:ylang ylang`. Preserve `source_id` separately. This is mandatory for Neo4J readiness and endpoint safety. |
| Family nodes | Families are the top-level taxonomy containers in `taxonomy.json` | Low | 10 current nodes. Properties: `id`, `name`, `source_artifact_version`. |
| Subfamily nodes | Similarity stats and edge endpoints are subfamily-level in current artifacts | Low | 18 current nodes. Properties: `id`, `name`, `family_id`; edges connect to Family and to Descriptor. |
| Descriptor nodes | Descriptors are the primary semantic terms future agents will traverse | Medium | 341 current nodes. Preserve `source`, `frequency`, `status`, `review_required`, `corpus_derived`, `family_id`, `subfamily_id`. Do not upgrade candidates to curated truth. |
| Alias nodes | Query proofs must show resolved aliases without changing alias seeds | Low | 18 current nodes. Use `ALIAS_OF`/`RESOLVES_TO` from alias node to descriptor node. Validate every target exists in descriptor nodes. |
| Subfamily similarity relations | `similarity_matrix.json` is already a sparse subfamily graph and is a key read-model value | Medium | Create `SUBFAMILY_SIMILAR_TO` edges only between `Subfamily` nodes. Preserve `score`, `final_score`, `dimensions`, `evidence`, `threshold`. Treat as undirected in query helpers but export deterministically once per source/target pair. |
| Hierarchy relations | Graph traversal needs explicit paths | Low | Relations: `FAMILY_HAS_SUBFAMILY`, `SUBFAMILY_HAS_DESCRIPTOR`, `ALIAS_RESOLVES_TO`, `SUBFAMILY_SIMILAR_TO`. Avoid redundant transitive edges in v2.11. |
| Deterministic builder | GKG-02 requires read-only deterministic export | Medium | Builder reads compiled artifacts, produces stable node/edge ordering and stable JSON. Avoid wall-clock `generated_at` unless injected/frozen; include source artifact metadata/hashes instead. |
| Separated export location | Protects official compiled baseline | Low | Export must not live in or overwrite `data/compiled/v2/*`. Use an explicit read-model/experimental location and document that it is derived output, not taxonomy publication. |
| Graph validation | GKG-03 requires integrity proofs | Medium | Validate unique graph IDs, endpoint existence, endpoint labels, relation cardinality expectations, alias target existence, similarity endpoint type, duplicate edges, deterministic rebuild and protected-file preservation. |
| Query proof helpers | GKG-04 asks for useful graph queries without runtime infrastructure | Medium | Pure TypeScript functions or scripts over the static export are sufficient. No database, server or UI. |
| Query proof fixtures/results | Demonstrates the read model is actually useful | Low | Commit sample query outputs or tests for descriptors by family, alias resolution, similarity neighborhoods, hubs and descriptor-to-family paths. |
| Documentation | Future consumers need contract and boundaries | Low | Include schema docs, builder usage, validation commands, query examples, protected boundaries, and future Neo4J mapping. |
| Boundary audit proof | Milestone safety depends on proving non-mutation | Low | Tests or scripts should prove `data/taxonomy/*`, `data/compiled/v2/*`, `graphify-out/**` remain untouched by graph generation. |

## Recommended v2.11 Node Types

| Node Type | Include in v2.11? | Source | Cardinality Now | Required Properties | Rationale |
|-----------|-------------------|--------|-----------------|---------------------|-----------|
| `Family` | Yes | `taxonomy.json.families[]` | 10 | `graph_id`, `id`, `name`, `version` | Foundational hierarchy root. Low risk. |
| `Subfamily` | Yes | `taxonomy.json.families[].subfamilies[]` | 18 | `graph_id`, `id`, `name`, `family_id`, `version` | Similarity edges are subfamily-level; required for graph neighborhoods. |
| `Descriptor` | Yes | `subfamilies[].descriptors[]` | 341 | `graph_id`, `id`, `source`, `frequency`, `status`, `review_required`, `corpus_derived`, `family_id`, `subfamily_id` | Core semantic terms for agent/RAG traversal. Preserve review/candidate status honestly. |
| `Alias` | Yes | `descriptor_aliases.json.aliases` | 18 | `graph_id`, `alias`, `target_descriptor_id`, `version` | Needed for alias resolution proofs and future canonicalization. |
| `GraphExport` / metadata envelope | Yes, as envelope not semantic node | All input artifacts | 1 | source paths, versions, counts, hashes, build contract version | Enables auditability and determinism without polluting domain graph. |
| `ReviewItem` | Defer | `similarity_matrix.json.review_queue` | 257 | n/a | Review queue is curation workflow evidence, not stable semantic truth. In v2.11, preserve descriptor `review_required` and document queue counts; do not model every review item as graph truth. |
| `Material` | Defer by default; optional only with explicit audit | `data/enriched_materials.json` / `CorpusMaterial` | Large/gitignored corpus | n/a | See Material decision below. High risk for scope creep, performance and boundary ambiguity. |
| `SimilarityDimension` | Defer as node; include as edge property | `similarity_matrix.json.dimensions` | 4 | n/a | Dimensions explain edge scores but do not need separate nodes in a first static graph. Keep edge `dimensions` object and metadata list. |

## Recommended v2.11 Relation Types

| Relation Type | Include in v2.11? | Endpoint Types | Source | Required Properties | Notes |
|---------------|-------------------|----------------|--------|---------------------|-------|
| `FAMILY_HAS_SUBFAMILY` | Yes | `Family -> Subfamily` | `taxonomy.json` nesting | `family_id`, `subfamily_id` | Direction follows containment. Query helpers may traverse reverse in memory. |
| `SUBFAMILY_HAS_DESCRIPTOR` | Yes | `Subfamily -> Descriptor` | `taxonomy.json` nesting | `subfamily_id`, `descriptor_id`, optionally descriptor status snapshot | Do not add direct `Family -> Descriptor`; derive via traversal. |
| `ALIAS_RESOLVES_TO` | Yes | `Alias -> Descriptor` | `descriptor_aliases.json.aliases` | `alias`, `target_descriptor_id` | Validate target descriptor exists. Current baseline should resolve 18/18. |
| `SUBFAMILY_SIMILAR_TO` | Yes | `Subfamily -> Subfamily` | `similarity_matrix.json.edges` | `score`, `final_score`, `dimensions`, `evidence`, `threshold`, `source_id`, `target_id` | Subfamily-level only. Do not create descriptor similarity edges from this artifact. |
| `FAMILY_HAS_DESCRIPTOR` | Defer | `Family -> Descriptor` | Derived | n/a | Redundant; increases validation burden and can hide path logic. |
| `DESCRIPTOR_SIMILAR_TO` | Defer | `Descriptor -> Descriptor` | Not present in current artifacts | n/a | Not supported by `similarity_matrix.json`; would invent semantics. |
| `MATERIAL_HAS_DESCRIPTOR` | Defer | `Material -> Descriptor` | Corpus input | n/a | Requires material-node scope and corpus boundary audit. |
| `REVIEW_ITEM_AFFECTS_DESCRIPTOR` | Defer | `ReviewItem -> Descriptor` | Review queue | n/a | Useful later for curation dashboards, but v2.11 is not a curation milestone. |

## Builder / Export Feature Requirements

| Feature | v2.11 Priority | Acceptance Signal |
|---------|----------------|-------------------|
| Read compiled artifacts from explicit input paths | P0 | Builder accepts/uses `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json` without invoking compile or seed loaders. |
| Pure transformation from artifacts to graph | P0 | No writes to protected inputs; no mutation of parsed objects; no hidden dependency on corpus files. |
| Stable node and edge ordering | P0 | Two consecutive runs produce byte-identical JSON, or tests compare deep equality plus stable serialization. |
| Type-prefixed graph IDs | P0 | Colliding raw IDs do not collide in graph output; validation catches any unprefixed endpoint. |
| Export envelope with counts and provenance | P0 | Output includes source artifact versions, counts and ideally content hashes. |
| Separate read-model output path | P0 | Generated graph is clearly outside `data/compiled/v2/*`; docs state it is a derived read model. |
| Optional machine-readable schema | P1 | A local TypeScript type/schema or JSON schema exists for graph export validation. Keep zero-heavy-dependency. |
| Optional CSV/Neo4J import shape | Defer/P2 | Document mapping only in v2.11; generate CSV later after contract stabilizes. |

## Validation Feature Requirements

| Validation | Why It Matters | Severity If Missing |
|------------|----------------|---------------------|
| Unique node IDs globally | Raw IDs collide across types; graph databases require identity clarity | Critical |
| Unique edge identity | Prevents accidental duplicate hierarchy or similarity edges | Critical |
| Edge endpoint existence | Avoids dangling graph export | Critical |
| Edge endpoint type constraints | Ensures similarity edges are subfamily-level, alias edges target descriptors, hierarchy edges preserve containment | Critical |
| Alias target integrity | Carries forward v2.10 integrity guarantees into graph export | Critical |
| Similarity endpoint validation against subfamilies | Current similarity artifact stats and observed endpoints are subfamily-level; descriptor interpretation would be wrong | Critical |
| Descriptor placement integrity | Every Descriptor node must have exactly one parent Subfamily in v2.11 | High |
| Family/subfamily containment integrity | Every Subfamily belongs to exactly one Family matching `family_id` | High |
| Candidate/review status preservation | Prevents graph export from silently curating corpus candidates | High |
| Deterministic rebuild proof | Required for audit-friendly static export | High |
| Protected-boundary preservation | Ensures no seed/compiled/Graphify mutation | High |
| Count reconciliation | Export counts should match 10 families, 18 subfamilies, 341 descriptors, 18 aliases, 13 similarity edges | Medium |

## Query Proofs to Include

These should be static proofs over exported JSON, implemented as tests or scripts. They are not product APIs.

| Query Proof | Example / Expected Use | Why Table-Stakes |
|-------------|------------------------|------------------|
| Descriptors by family | `floral -> floral_rose/floral_white -> descriptors`, filter `status=curated` or `review_required=false` | Demonstrates basic taxonomy traversal. |
| Descriptors by subfamily | `floral_white -> elderflower, freesia, jasmine, ylang_ylang, ...` | Verifies core adjacency and future agent retrieval pattern. |
| Descriptor-to-family path | `descriptor:ylang_ylang -> subfamily:floral_white -> family:floral` | Shows canonical term context and path traversal. |
| Alias resolution | `alias:ylang ylang -> descriptor:ylang_ylang`; `alias:musky -> descriptor:musk` | Proves aliases are represented without mutating alias seeds. |
| Similarity neighborhood | `subfamily:floral_rose -> floral_white, woody_dry, woody_mossy` with scores/evidence | Shows sparse subfamily graph utility. |
| Cross-family bridge discovery | Similarity edges where source/target families differ, e.g. floral/citrus/woody bridges | Useful for future accord/RAG exploration while preserving current score semantics. |
| Hub / degree ranking | Degree over `SUBFAMILY_SIMILAR_TO` edges | Simple graph-native proof of value without new scoring. |
| Boundary/count proof | Export counts reconcile with source artifacts and protected files unchanged | Turns safety constraints into verifiable outputs. |

## Material Nodes Decision

**Recommendation:** Defer `Material` nodes from the committed v2.11 core. Treat them as optional future scope only after an explicit boundary audit.

Why:

1. The committed v2.11 inputs are the compiled artifacts: `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`. `.planning/PROJECT.md` says `data/enriched_materials.json` may be considered only with explicit boundary audit and test coverage.
2. `src/types/corpus.ts` shows material records contain identity, classification, olfactory, usage and molecular fields. That is materially broader than a minimal taxonomy read model and risks pulling Layer 2/3/product concerns into Layer 1.
3. `.planning/PROJECT.md` notes `data/enriched_materials.json` is about 70MB and gitignored. Including it would expand export size, performance concerns, privacy/provenance questions and test fixture requirements.
4. Material-to-descriptor edges would require canonicalization choices over raw corpus descriptors. That could accidentally reopen curation and alias semantics, which v2.11 explicitly avoids.

Safe compromise for v2.11: document a future `Material` node shape and relation (`MATERIAL_HAS_DESCRIPTOR`) in the Neo4J-readiness section, but do not generate Material nodes or material edges in the core export.

## Differentiators

Features not strictly required for a static graph, but valuable if they fit after P0/P1 requirements.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Provenance hashes per source artifact | Makes graph export auditable and future CI-friendly | Medium | Hashing source JSON is safe and read-only. |
| Contract versioning | Allows future graph contract evolution without confusing taxonomy artifact version | Low | Use a separate `graph_schema_version` from taxonomy `version`. |
| Human-readable graph summary | Helps roadmap/review: counts, edge types, top hubs, warnings | Low | Can be generated from export and committed as proof. |
| Neo4J label/relationship mapping doc | Reduces future migration friction | Low | Documentation only; no Neo4J dependency. |
| Query result fixtures | Makes graph behavior reviewable without running code | Low | Store small JSON or Markdown outputs for representative queries. |

## Anti-Features

Features to explicitly not build in v2.11.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Mutating `data/taxonomy/*` seeds | Violates protected boundary and reopens curation | Read compiled artifacts only. |
| Mutating/publishing `data/compiled/v2/*` | v2.11 is a derived read model, not official taxonomy publication | Write graph output to a separate read-model location. |
| Treating similarity edges as descriptor-level | Repo evidence indicates `similarity_matrix` is subfamily-level; endpoint ID collisions make descriptor interpretation unsafe | Validate endpoints against Subfamily nodes and prefix graph IDs. |
| Material graph in core v2.11 | Requires large gitignored corpus and curation/normalization decisions | Defer; document future shape only. |
| Review queue as semantic graph truth | Review items are curation workflow evidence, not curated ontology | Preserve `review_required` properties and queue counts; defer ReviewItem nodes. |
| Neo4J/Docker/database runtime | Explicitly outside milestone | Provide static JSON export and future mapping docs. |
| Graphify integration or output changes | Explicit protected boundary | Keep this graph read model separate from Graphify. |
| New scoring or similarity inference | Would alter Layer 4 semantics and exceed read-model scope | Preserve existing scores/dimensions/evidence as properties. |
| UI, MVP, SaaS API, RAG runtime | Product/runtime layers are future milestones | Demonstrate query proofs as tests/scripts only. |
| Automatic candidate promotion | Violates no FUT-01/FUT-02 curation boundary | Preserve status and `review_required`; do not change taxonomy truth. |

## Feature Dependencies

```text
Schema contract
  -> Type-prefixed graph IDs
  -> Builder/export
  -> Validation
  -> Query proofs
  -> Documentation / Neo4J-readiness mapping

Compiled taxonomy input
  -> Family/Subfamily/Descriptor nodes
  -> FAMILY_HAS_SUBFAMILY and SUBFAMILY_HAS_DESCRIPTOR relations
  -> Descriptor-by-family and descriptor-to-family query proofs

Descriptor aliases input
  -> Alias nodes
  -> ALIAS_RESOLVES_TO relations
  -> Alias integrity validation
  -> Alias resolution query proof

Similarity matrix input
  -> SUBFAMILY_SIMILAR_TO relations
  -> Similarity endpoint validation
  -> Neighborhood, cross-family bridge and hub query proofs

Protected-boundary rule
  -> Separate export location
  -> No compile invocation required
  -> Boundary audit proof
```

## MVP Recommendation

Prioritize in this order:

1. **Graph schema and ID contract** — including type-prefixed IDs and edge endpoint rules. This prevents the most dangerous ambiguity in the current artifacts.
2. **Deterministic builder/export from compiled artifacts** — generate Family, Subfamily, Descriptor and Alias nodes plus hierarchy, alias and subfamily-similarity relations.
3. **Validation suite** — unique IDs, endpoint integrity, alias integrity, subfamily-level similarity enforcement, deterministic output and protected-boundary preservation.
4. **Query proofs** — descriptors by family/subfamily, alias resolution, descriptor-to-family paths, similarity neighborhoods, hubs and cross-family bridges.
5. **Documentation** — schema contract, usage, example queries, deferred scope and future Neo4J mapping.

Defer:

- `Material` nodes and `MATERIAL_HAS_DESCRIPTOR` edges: high scope/boundary risk.
- `ReviewItem` graph nodes: useful later for curation tooling, not stable semantic truth for this read model.
- Descriptor-level similarity: not supported by current similarity artifact evidence.
- Neo4J CSV/import implementation: document now, implement after the static contract survives use.
- Runtime APIs, UI, RAG integration and SaaS work: future product layers.

## Sources

- `.planning/PROJECT.md` — Active GKG-01 through GKG-05 requirements, protected boundaries, current v2.11 goal and architecture constraints. Confidence: HIGH.
- `.planning/MILESTONES.md` — v2.10 shipped baseline and integrity gate context. Confidence: HIGH.
- `.planning/ROADMAP.md` — Previous milestone structure and current absence of v2.11 phase breakdown. Confidence: HIGH.
- `src/types/taxonomy.ts` — Compiled taxonomy type contract. Confidence: HIGH.
- `src/types/similarity.ts` — Sparse similarity graph type contract and subfamily stats. Confidence: HIGH.
- `src/types/corpus.ts` — Material/corpus type scope and risk signal. Confidence: HIGH.
- `data/compiled/v2/taxonomy.json` — Current 10/18/341 taxonomy baseline. Confidence: HIGH.
- `data/compiled/v2/descriptor_aliases.json` — Current 18-alias baseline. Confidence: HIGH.
- `data/compiled/v2/similarity_matrix.json` — Current 13-edge sparse subfamily similarity graph and review queue evidence. Confidence: HIGH.
