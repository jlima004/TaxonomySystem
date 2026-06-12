# Requirements: Olfactory Taxonomy System v2.11

**Defined:** 2026-06-09  
**Milestone:** v2.11 Olfactory Knowledge Graph Read Model  
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v2.11 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### Graph Contract

- [x] **GCON-01**: Maintainer can inspect a documented olfactory graph schema contract that defines graph schema version, node kinds, edge kinds, required properties, ID namespace rules and invariants.
- [x] **GCON-02**: Maintainer can see the exact allowed read-only input artifacts for v2.11 graph generation: `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json` and `data/compiled/v2/similarity_matrix.json`.
- [x] **GCON-03**: Maintainer can verify that raw taxonomy IDs are converted to type-prefixed graph IDs such as `family:*`, `subfamily:*`, `descriptor:*` and `alias:*` to prevent cross-kind collisions.
- [x] **GCON-04**: Maintainer can identify the sanctioned graph output location as `data/read-models/olfactory-graph/v2.11/`, with `/tmp` allowed for verification-only runs, and protected output prefixes explicitly forbidden.

### Read-Only Builder

- [x] **GBLD-01**: Maintainer can build a deterministic in-memory graph containing Family, Subfamily, Descriptor and Alias nodes derived only from allowed compiled artifacts.
- [x] **GBLD-02**: Maintainer can build hierarchy edges from the compiled taxonomy: Family contains Subfamily and Subfamily contains Descriptor.
- [x] **GBLD-03**: Maintainer can build Alias resolves-to Descriptor edges from the compiled alias artifact without changing alias seeds or compiled aliases.
- [x] **GBLD-04**: Maintainer can build Subfamily similar-to Subfamily edges from `similarity_matrix.json`, preserving score, dimensions and evidence without reinterpreting them as descriptor or material similarity.
- [x] **GBLD-05**: Maintainer can generate graph output with stable ordering and deterministic JSON formatting, avoiding fresh wall-clock metadata unless explicitly injected.

### Validation & Boundary Audit

- [x] **GVAL-01**: Maintainer can run graph validation that fails on duplicate node IDs, duplicate edge IDs, missing edge endpoints, wrong endpoint kinds, invalid alias targets or invalid subfamily-similarity endpoints.
- [x] **GVAL-02**: Maintainer can verify graph stats against the protected v2 baseline, including 10 families, 18 subfamilies, 341 descriptors, 18 aliases and 13 subfamily-similarity edges.
- [x] **GVAL-03**: Maintainer can prove graph generation does not mutate `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/taxonomy/alias_target_exceptions.v1.json` or `data/compiled/v2/*`.
- [x] **GVAL-04**: Maintainer can prove the graph workflow does not read from or write to `graphify-out/**` and remains separate from existing Graphify artifacts.
- [x] **GVAL-05**: Maintainer can run the existing guardrails after graph work: `npm --prefix src run typecheck`, `npm --prefix src test`, `npm --prefix src run alias:integrity -- --json` and `npm --prefix src run verify:integrity -- --json`.

### Query Proofs

- [x] **GQRY-01**: Maintainer can generate deterministic query proofs for descriptors by family/subfamily, including descriptor status and review metadata.
- [x] **GQRY-02**: Maintainer can generate deterministic query proofs for alias resolution paths from Alias to Descriptor.
- [x] **GQRY-03**: Maintainer can generate deterministic query proofs for descriptor-to-family paths and related descriptors through shared family/subfamily context.
- [x] **GQRY-04**: Maintainer can generate deterministic query proofs for subfamily similarity neighborhoods, cross-family bridges and graph hubs based only on existing similarity edges.
- [x] **GQRY-05**: Maintainer can inspect query proof outputs that are useful for a future Alquem.io AI agent/RAG layer without implementing agent runtime, SaaS runtime or API endpoints.

### Documentation & Future Export

- [x] **GDOC-01**: Maintainer can read documentation explaining the graph schema, input artifacts, output artifacts, validation workflow, protected boundaries and query proof examples.
- [x] **GDOC-02**: Maintainer can read a future Neo4J mapping note that maps node labels and relationship types conceptually without adding Neo4J, Docker, drivers, Cypher import jobs or database tests.
- [x] **GDOC-03**: Maintainer can see a clear disclaimer that v2.11 graph outputs are derived read models, not official compiled taxonomy publication artifacts and not curation truth upgrades.

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Material Graph Scope

- **GMAT-01**: Maintainer can include Material nodes and Material has Descriptor edges from `data/enriched_materials.json` after a separate corpus-size, normalization and boundary audit.
- **GMAT-02**: Maintainer can prove material-profile overlap queries for shared olfactive descriptors after Material nodes are explicitly scoped.

### Graph Database Export

- **GDB-01**: Maintainer can export graph artifacts to Neo4J-compatible CSV or Cypher import files after the static graph contract is stable.
- **GDB-02**: Maintainer can run graph database import validation in a future environment with explicit database tooling approval.

### Runtime & Product Usage

- **GRUN-01**: Alquem.io runtime can query the graph through an API or Knowledge Engine layer after read-model semantics are stable.
- **GRAG-01**: Alquem.io agent/RAG can consume graph query outputs through a runtime integration after query proof value is verified.

### Curation Graph Scope

- **GCUR-01**: Maintainer can model review_queue items, evidence and curation workflows as graph nodes after curation scope is reopened explicitly.
- **GSIM-01**: Maintainer can add descriptor-level or material-level similarity only after a dedicated scoring/semantic model decision.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Mutating `data/taxonomy/taxonomy-seed.v2.json` | Source taxonomy is protected; v2.11 is read-only read-model work. |
| Mutating `data/taxonomy/descriptor_aliases.seed.json` | Alias seed curation is outside this milestone. |
| Mutating `data/taxonomy/alias_target_exceptions.v1.json` | Exception policy remains protected; current alias target integrity is already 18/18/0. |
| Mutating or publishing `data/compiled/v2/*` | Official compiled artifacts are the protected baseline, not v2.11 outputs. |
| Writing graph outputs under `data/compiled/**` | Would blur read-model output with official taxonomy publication. |
| Reading from or writing to `graphify-out/**` | v2.11 graph read model is separate from existing Graphify artifacts. |
| FUT-01 low_support curation | Deferred curation queue remains deferred. |
| FUT-02 seed/corpus conflict curation | Deferred conflict queue remains deferred. |
| Material, Molecule, PubChem, volatility or tenacity nodes | Requires a separate corpus and Layer 2/3 scope decision. |
| Descriptor-level or material-level similarity | Current similarity artifact is subfamily-level; reinterpretation would be misleading. |
| Neo4J, Docker, database drivers or database tests | v2.11 starts with a static graph read model only. |
| Runtime APIs, UI, MVP, SaaS, RAG or agent runtime | Query proofs prepare future usage without implementing product/runtime layers. |
| New graph/RDF/schema/CLI/scoring dependencies | Zero-dependency TypeScript is sufficient for this milestone and preserves repo conventions. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| GCON-01 | Phase 55 | Complete |
| GCON-02 | Phase 55 | Complete |
| GCON-03 | Phase 55 | Complete |
| GCON-04 | Phase 55 | Complete |
| GBLD-01 | Phase 56 | Complete |
| GBLD-02 | Phase 56 | Complete |
| GBLD-03 | Phase 56 | Complete |
| GBLD-04 | Phase 56 | Complete |
| GBLD-05 | Phase 56 | Complete |
| GVAL-01 | Phase 56 | Complete |
| GVAL-02 | Phase 56 | Complete |
| GVAL-03 | Phase 58 | Complete |
| GVAL-04 | Phase 58 | Complete |
| GVAL-05 | Phase 58 | Complete |
| GQRY-01 | Phase 57 | Complete |
| GQRY-02 | Phase 57 | Complete |
| GQRY-03 | Phase 57 | Complete |
| GQRY-04 | Phase 57 | Complete |
| GQRY-05 | Phase 57 | Complete |
| GDOC-01 | Phase 59 | Complete |
| GDOC-02 | Phase 59 | Complete |
| GDOC-03 | Phase 59 | Complete |

**Coverage:**
- v2.11 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-06-09*  
*Last updated: 2026-06-12 after Phase 59 completion*
