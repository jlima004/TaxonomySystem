# Requirements: Olfactory Taxonomy System v2.13

**Defined:** 2026-06-19  
**Milestone:** v2.13 PRD Canonicalization & Core Data Bridge  
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v2.13 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### PRD Canonicalization

- [x] **PRD-01**: Maintainer can identify one canonical, versioned Alquem.io technical PRD reference for this repository, with explicit status, scope note, and relation to existing Layer 1 boundaries.
- [x] **PRD-02**: Maintainer can inspect how the canonical PRD constrains TaxonomySystem planning artifacts, including what parts are normative for this repository and what remains external/future-system context.

### PostgreSQL Core Data Bridge

- [ ] **PGBR-01**: Maintainer can inspect a documented `TaxonomySystem -> PostgreSQL` core data contract covering canonical entities, stable logical IDs, and which compiled/read-model fields are eligible to cross the boundary.
- [ ] **PGBR-02**: Maintainer can distinguish source-of-truth ownership across compiled taxonomy artifacts, derived graph artifacts, and future PostgreSQL records without ambiguity about which layer is authoritative for semantic truth.
- [ ] **PGBR-03**: Maintainer can inspect explicit non-goals stating that v2.13 defines bridge contracts only and does not implement schemas, migrations, persistence, or runtime/database queries.

### Neo4j Projection Rules

- [ ] **N4J-01**: Maintainer can inspect future Neo4j projection rules derived from the sanctioned graph read model, including node/edge mapping boundaries and shared-ID expectations.
- [ ] **N4J-02**: Maintainer can distinguish what should project from existing `family/subfamily/descriptor/alias` graph semantics versus what remains out of scope until future milestones reopen materials, substitutions, applications, or runtime traversals.
- [ ] **N4J-03**: Maintainer can inspect documented constraints that prevent Neo4j planning from bypassing `asValidatedGraph`, `createValidatedQueryConsumer`, or the existing proof-envelope contract as future trust boundaries evolve.

### Consumer-Readiness Debt Reduction

- [ ] **CDOC-01**: Maintainer can inspect corrected and aligned consumer-readiness documentation/examples for selected v2.12 debt items without changing the stable query-proof contract.
- [ ] **CDOC-02**: Maintainer can see a consolidated statement of accepted vs reduced v2.12 debt so future product/runtime milestones inherit an accurate readiness baseline.

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Database Implementation

- **DBIM-01**: Future systems can implement PostgreSQL schema, migrations, and persistence based on the v2.13 bridge contract after an explicit database milestone opens.
- **DBIM-02**: Future systems can materialize Neo4j nodes/edges and validate import workflows after a separate tooling/runtime decision.

### Runtime & Agent Integration

- **GRUN-01**: Alquem.io runtime can expose typed tools backed by PostgreSQL, pgvector, and Neo4j after repository boundaries, auth, and execution policies are defined in a future milestone.
- **GRAG-01**: Alquem.io agent/RAG can consume TaxonomySystem-derived evidence in production after trust, provenance, and persistence boundaries are operationalized beyond documentation.

### Expanded Knowledge Graph Scope

- **GMAT-01**: Future milestones can extend graph planning to Material-level entities and relations after corpus-size, normalization, and ownership boundaries are approved explicitly.
- **GSUB-01**: Future milestones can model substitution/application/restriction subgraphs after those semantics exist in canonical sources rather than PRD aspirations only.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Runtime agent execution, orchestration, or chat flows | v2.13 aligns contracts and docs only; product runtime remains external to this repository. |
| PostgreSQL schema creation, migrations, SQL queries, or persistence code | The milestone defines the bridge contract, not the database implementation. |
| Neo4j database setup, drivers, Cypher, CSV export, or import tooling | Neo4j remains planned/future-facing; this milestone stops at projection rules and boundaries. |
| pgvector retrieval design or embeddings work | The current milestone focuses on Layer 1 semantic data and graph/provenance planning only. |
| New graph node kinds beyond `family/subfamily/descriptor/alias` | Future product semantics must not silently expand the sanctioned read-model contract. |
| Mutating `data/taxonomy/**` or publishing new `data/compiled/v2/*` artifacts | v2.13 is documentation/contract alignment, not curation or publication. |
| Reading from or writing to `graphify-out/**` | Graphify remains out of scope and isolated from sanctioned planning/workflows. |
| Changing the stable proof envelope `{ query_kind, params, result, path? }` | Consumer-readiness debt reduction must preserve the existing contract hardened in v2.12. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRD-01 | Phase 64 | Complete |
| PRD-02 | Phase 64 | Complete |
| PGBR-01 | Phase 65 | Pending |
| PGBR-02 | Phase 65 | Pending |
| PGBR-03 | Phase 65 | Pending |
| N4J-01 | Phase 66 | Pending |
| N4J-02 | Phase 66 | Pending |
| N4J-03 | Phase 66 | Pending |
| CDOC-01 | Phase 67 | Pending |
| CDOC-02 | Phase 67 | Pending |

**Coverage:**

- v2.13 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-06-19*  
*Last updated: 2026-06-19 after initial definition*
