# Requirements: Olfactory Taxonomy System v2.12

**Defined:** 2026-06-12  
**Milestone:** v2.12 Graph Read Model Hardening & Agent Consumption Prep  
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v2.12 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### Validation & Contract

- [ ] **GCON-05**: Maintainer can inspect one authoritative contract/source module for graph ID prefixes, invariant identifiers, baseline validation expectations, and other shared graph-read-model constants that downstream modules consume where practical.
- [ ] **GCON-06**: Maintainer can verify builder, validator, and query-consumption code paths no longer depend on duplicated hardcoded graph ID prefixes or invariant identifiers where a shared authoritative constant already exists.
- [ ] **GVAL-06**: Maintainer can run graph validation and receive deterministic structured failures tied to contract-defined expectations for schema, structural invariants, and baseline stat reconciliation.
- [ ] **GVAL-07**: Maintainer can prevent query-proof generation from invalid or unvalidated graphs through fail-closed guardrails in the consumer-facing query path.

### Consumer Proof Contract

- [ ] **GQRY-06**: Maintainer can rely on the existing proof envelope shape `{ query_kind, params, result, path }` as the stable agent-facing contract across all current query-proof functions.
- [ ] **GQRY-07**: Maintainer can see documented safe-consumption boundaries for each proof envelope field, including what is safe for future Alquem.io agent/RAG consumption and what remains provenance-only or internal.
- [ ] **GQRY-08**: Maintainer can observe deterministic typed invalid-graph error behavior for query consumers instead of best-effort proofs from broken graph inputs.

### CLI & Boundary Proofs

- [ ] **GVAL-08**: Maintainer can run an automated sandboxed proof of the sanctioned non-dry-run graph workflow, including graph write, boundary audit, and post-write guardrails, without mutating protected taxonomy or compiled inputs.
- [ ] **GVAL-09**: Maintainer can inspect measured evidence from sanctioned tests that the graph workflow remains isolated from `graphify-out/**`, rather than relying only on declarative zero-access reporting.
- [ ] **GVAL-10**: Maintainer can inspect deterministic boundary-audit proof outputs covering protected-file integrity, sanctioned output destination, and forbidden-path rejection behavior for misuse scenarios.

### Docs Cleanup

- [ ] **GDOC-04**: Maintainer can read a reordered operational guide that explains the safe build -> validate -> query workflow, fail-closed behavior, and protected-scope boundaries without jumping across sections.
- [ ] **GDOC-05**: Maintainer can read explicit consumer-readiness guidance for future Alquem.io agent/RAG usage that stays limited to the existing read-only graph artifact and proof envelopes, without adding runtime, API, database, or execution scope.

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Consumer Helpers

- **GQRY-09**: Maintainer can use dedicated consumer wrapper helpers around proof queries after the proof-envelope contract is stable and verified in practice.
- **GQRY-10**: Maintainer can persist query-proof artifacts for offline agent workflows after a separate artifact/versioning decision.

### Graph Database Export

- **GDB-01**: Maintainer can export graph artifacts to Neo4J-compatible CSV or Cypher import files after the static graph contract is stable.
- **GDB-02**: Maintainer can run graph database import validation in a future environment with explicit database tooling approval.

### Runtime & Product Usage

- **GRUN-01**: Alquem.io runtime can query the graph through an API or Knowledge Engine layer after read-model semantics are stable.
- **GRAG-01**: Alquem.io agent/RAG can consume graph query outputs through a runtime integration after the proof-envelope contract is accepted as trustworthy substrate.

### Expanded Graph Scope

- **GMAT-01**: Maintainer can include Material nodes and Material has Descriptor edges from `data/enriched_materials.json` after a separate corpus-size, normalization and boundary audit decision.
- **GCUR-01**: Maintainer can model review queue items, evidence and curation workflows as graph nodes after curation scope is reopened explicitly.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Runtime agent execution or orchestration | v2.12 prepares future consumers without implementing runtime behavior. |
| SaaS/API endpoints for graph access | Consumer-readiness stops at library/contract hardening, not product surface area. |
| Neo4J, Docker, database drivers, Cypher or CSV export | Database materialization is deferred until after contract hardening. |
| Material, molecule, PubChem or other new node kinds | v2.12 stays inside the existing `family/subfamily/descriptor/alias` read-model scope. |
| Mutating `data/taxonomy/**` | Source taxonomy remains protected; this milestone is hardening only. |
| Mutating or publishing `data/compiled/v2/*` | Official compiled artifacts remain the protected baseline. |
| New taxonomy publication under `data/read-models/` or `data/compiled/` | v2.12 proves and hardens the existing read model; it does not publish new taxonomy truth. |
| Reading from or writing to `graphify-out/**` | Graphify remains isolated from the graph read-model workflow. |
| New external graph/query/runtime dependencies | Zero-dependency TypeScript remains sufficient for this hardening milestone. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| GCON-05 | Phase 60 | Pending |
| GCON-06 | Phase 60 | Pending |
| GVAL-06 | Phase 60 | Pending |
| GVAL-07 | Phase 61 | Pending |
| GQRY-06 | Phase 61 | Pending |
| GQRY-08 | Phase 61 | Pending |
| GVAL-08 | Phase 62 | Pending |
| GVAL-09 | Phase 62 | Pending |
| GVAL-10 | Phase 62 | Pending |
| GQRY-07 | Phase 63 | Pending |
| GDOC-04 | Phase 63 | Pending |
| GDOC-05 | Phase 63 | Pending |

**Coverage:**

- v2.12 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-06-12*  
*Last updated: 2026-06-12 after roadmap creation*
