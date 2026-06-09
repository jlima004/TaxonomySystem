# Roadmap: Olfactory Taxonomy System

## Milestones

- ✅ **v1.0 MVP** — Phases 1-14 (shipped 2026-05-26)
- ✅ **v2.6 Low-Support Rebaseline** — Phases 38-39 (shipped 2026-05-29)
- ✅ **v2.7 Low-Support Review Queue Triage** — Phases 40-43 (shipped 2026-06-02)
- ✅ **v2.8 Low-Support Review Queue Triage Batch 2** — Phases 44-48 (shipped 2026-06-04)
- ✅ **v2.9 Alias Target Integrity & Descriptor Hygiene** — Phases 49-51 (shipped 2026-06-06)
- ✅ **v2.10 Integrity Gate Hardening & CI Wiring** — Phases 52-54 (shipped 2026-06-09)
- 📋 **v2.11 Olfactory Knowledge Graph Read Model** — Phases 55-59 (planned)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-14) — SHIPPED 2026-05-26</summary>

- [x] Phase 1: Foundation — completed 2026-05-13
- [x] Phase 2: Data Loaders — completed 2026-05-13
- [x] Phase 3: Normalization Pipeline — completed 2026-05-17
- [x] Phase 4: Corpus Analysis — completed 2026-05-18
- [x] Phase 5: Inference Engine — completed 2026-05-19
- [x] Phase 6: Compilation & CLI — completed 2026-05-21
- [x] Phase 7: Data Quality & Inference Hardening — completed 2026-05-22
- [x] Phase 8: Taxonomy Seed Expansion & Curation — completed 2026-05-23
- [x] Phase 9: Taxonomy Seed v2 Expansion Round 2 — completed 2026-05-23
- [x] Phase 10: Taxonomy Seed v2 Expansion Round 3 — completed 2026-05-24
- [x] Phase 11: v2 Promotion Readiness & Migration Planning — completed 2026-05-24
- [x] Phase 12: v2 Default Switch Execution — completed 2026-05-25
- [x] Phase 13: Post-Promotion Stabilization & Consumer Adoption — completed 2026-05-25
- [x] Phase 14: v2.1 Backlog Triage & Curation Planning — completed 2026-05-26

</details>

<details>
<summary>✅ v2.6 Low-Support Rebaseline (Phases 38-39) — SHIPPED 2026-05-29</summary>

- [x] Phase 38: Group B Conflict Microcuration — completed 2026-05-29
- [x] Phase 39: Taxonomy v2.6 Stabilization & Closure — completed 2026-05-29

</details>

<details>
<summary>✅ v2.7 Low-Support Review Queue Triage (Phases 40-43) — SHIPPED 2026-06-02</summary>

- [x] Phase 40: Low-Support Curation Planning — completed 2026-05-29
- [x] Phase 41: Low-Support Batch Decision Matrix — completed 2026-05-29
- [x] Phase 42: Low-Support Microcuration Execution — completed 2026-06-02
- [x] Phase 43: Taxonomy v2.7 Artifact Publication — completed 2026-06-02

</details>

<details>
<summary>✅ v2.8 Low-Support Review Queue Triage Batch 2 (Phases 44-48) — SHIPPED 2026-06-04</summary>

- [x] Phase 44: Remaining Low-Support Inventory — completed 2026-06-03
- [x] Phase 45: Batch 2 Candidate Selection — completed 2026-06-03
- [x] Phase 46: Batch 2 Decision Matrix — completed 2026-06-03
- [x] Phase 47: Controlled Curation Mutation — completed 2026-06-03
- [x] Phase 48: v2.8 Artifact Publication & Closure — completed 2026-06-04

</details>

<details>
<summary>✅ v2.9 Alias Target Integrity & Descriptor Hygiene (Phases 49-51) — SHIPPED 2026-06-06</summary>

- [x] Phase 49: Alias Target Integrity Inventory — completed 2026-06-05
- [x] Phase 50: Alias Target Integrity Automation — completed 2026-06-06
- [x] Phase 51: Legacy Alias Remediation — completed 2026-06-06

_Full phase details: `.planning/milestones/v2.9-ROADMAP.md`_
</details>

<details>
<summary>✅ v2.10 Integrity Gate Hardening & CI Wiring (Phases 52-54) — SHIPPED 2026-06-09</summary>

- [x] Phase 52: Retroactive Verification Closure — completed 2026-06-06
- [x] Phase 53: Alias Integrity Gate Hardening — completed 2026-06-09
- [x] Phase 54: CI Wiring & Milestone Closure — completed 2026-06-09

_Full phase details: `.planning/milestones/v2.10-ROADMAP.md`_
</details>

### 📋 v2.11 Olfactory Knowledge Graph Read Model (Planned)

**Milestone Goal:** Maintainers can generate and verify a static, read-only, deterministic olfactory knowledge graph read model from existing compiled artifacts at `data/read-models/olfactory-graph/v2.11/`, while preserving protected taxonomy, compiled, Graphify and runtime boundaries.

- [ ] **Phase 55: Graph Contract & Boundary Decisions** - Lock the schema contract, ID namespace rules, allowed inputs and read-model output boundary before graph construction.
- [ ] **Phase 56: Pure Builder & Structural Validation** - Build and validate the in-memory graph from allowed compiled artifacts only, with deterministic structure and baseline stats.
- [ ] **Phase 57: Query Proofs** - Demonstrate deterministic graph query value for future agent/RAG use without runtime, API or database scope.
- [ ] **Phase 58: CLI, Writer & Boundary Audit** - Add the side-effect boundary for writing read-model artifacts and proving protected paths remain untouched.
- [ ] **Phase 59: Live Artifact Regression, Documentation & Milestone Closure** - Prove the read model against live v2 artifacts, document usage/future Neo4J mapping and close the milestone.

_For archived milestone details, see `.planning/milestones/`_

## Phase Details

### Phase 55: Graph Contract & Boundary Decisions
**Goal**: Maintainers have a fixed graph schema, ID and boundary contract that safely constrains every v2.11 graph read-model artifact.
**Depends on**: Phase 54
**Requirements**: GCON-01, GCON-02, GCON-03, GCON-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can inspect a graph contract that defines schema version, node kinds, edge kinds, required properties, ID namespace rules and invariants.
  2. Maintainer can identify the only allowed read-only inputs as `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json` and `data/compiled/v2/similarity_matrix.json`.
  3. Maintainer can verify type-prefixed graph IDs such as `family:*`, `subfamily:*`, `descriptor:*` and `alias:*` are required to prevent cross-kind collisions.
  4. Maintainer can confirm `data/read-models/olfactory-graph/v2.11/` is the sanctioned source-of-truth output path, with protected output prefixes forbidden and `/tmp` limited to verification-only support.
**Plans**: 1 plan
Plans:
- [ ] 55-01-PLAN.md — Lock static graph contract constants, executable contract tests, and maintainer boundary documentation for GCON-01 through GCON-04.

### Phase 56: Pure Builder & Structural Validation
**Goal**: Maintainers can build and validate a deterministic in-memory graph from allowed compiled artifacts only, before any write-capable workflow exists.
**Depends on**: Phase 55
**Requirements**: GBLD-01, GBLD-02, GBLD-03, GBLD-04, GBLD-05, GVAL-01, GVAL-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can build Family, Subfamily, Descriptor and Alias nodes plus hierarchy, alias-resolution and subfamily-similarity edges from allowed compiled artifacts only.
  2. Maintainer can verify graph output order and JSON formatting are deterministic and do not depend on fresh wall-clock metadata unless explicitly injected.
  3. Maintainer can run structural validation that fails on duplicate IDs, duplicate edges, missing endpoints, wrong endpoint kinds, invalid alias targets or invalid similarity endpoints.
  4. Maintainer can reconcile graph stats with the protected v2 baseline: 10 families, 18 subfamilies, 341 descriptors, 18 aliases and 13 subfamily-similarity edges.
  5. Maintainer can see that subfamily similarity preserves existing score, dimension and evidence semantics without reinterpreting them as descriptor or material similarity.
**Plans**: TBD

### Phase 57: Query Proofs
**Goal**: Maintainers can inspect deterministic graph query proofs that demonstrate future agent/RAG value without implementing runtime infrastructure.
**Depends on**: Phase 56
**Requirements**: GQRY-01, GQRY-02, GQRY-03, GQRY-04, GQRY-05
**Success Criteria** (what must be TRUE):
  1. Maintainer can generate deterministic proof outputs for descriptors by family/subfamily, including descriptor status and review metadata.
  2. Maintainer can inspect alias-to-descriptor resolution paths and descriptor-to-family paths derived from graph edges.
  3. Maintainer can inspect related descriptors through shared family/subfamily context without adding new similarity scoring.
  4. Maintainer can inspect subfamily similarity neighborhoods, cross-family bridges and graph hubs based only on existing similarity edges.
  5. Maintainer can use the proof outputs as static evidence for future Alquem.io agent/RAG exploration without API, SaaS, database or runtime implementation.
**Plans**: TBD

### Phase 58: CLI, Writer & Boundary Audit
**Goal**: Maintainers can write v2.11 read-model artifacts through a guarded workflow that proves protected sources, compiled artifacts and Graphify outputs remain untouched.
**Depends on**: Phase 57
**Requirements**: GVAL-03, GVAL-04, GVAL-05
**Success Criteria** (what must be TRUE):
  1. Maintainer can run graph generation to the sanctioned read-model path `data/read-models/olfactory-graph/v2.11/` while protected output prefixes are rejected.
  2. Maintainer can inspect a boundary audit proving `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/taxonomy/alias_target_exceptions.v1.json` and `data/compiled/v2/*` were not mutated.
  3. Maintainer can verify the graph workflow neither reads from nor writes to `graphify-out/**` and remains detached from Graphify artifacts.
  4. Maintainer can run existing guardrails after graph work: `npm --prefix src run typecheck`, `npm --prefix src test`, `npm --prefix src run alias:integrity -- --json` and `npm --prefix src run verify:integrity -- --json`.
**Plans**: TBD

### Phase 59: Live Artifact Regression, Documentation & Milestone Closure
**Goal**: Maintainers can trust, understand and close the v2.11 graph read model as a documented derived artifact, not an official taxonomy publication or runtime/database integration.
**Depends on**: Phase 58
**Requirements**: GDOC-01, GDOC-02, GDOC-03
**Success Criteria** (what must be TRUE):
  1. Maintainer can read documentation explaining the graph schema, allowed inputs, generated output artifacts, validation workflow, protected boundaries and query proof examples.
  2. Maintainer can inspect live-artifact regression evidence that the generated read model still matches the protected v2 baseline and deterministic query proofs.
  3. Maintainer can read a future Neo4J mapping note that maps labels and relationship types conceptually without adding Neo4J, Docker, drivers, import jobs or database tests.
  4. Maintainer can see a clear disclaimer that v2.11 graph outputs are derived read models, not official compiled taxonomy publication artifacts and not curation truth upgrades.
  5. Maintainer can verify milestone closure records boundary audit results and keeps the graph read model zero-dependency, read-only, static and detached from runtime systems.
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 55. Graph Contract & Boundary Decisions | v2.11 | 0/TBD | Not started | - |
| 56. Pure Builder & Structural Validation | v2.11 | 0/TBD | Not started | - |
| 57. Query Proofs | v2.11 | 0/TBD | Not started | - |
| 58. CLI, Writer & Boundary Audit | v2.11 | 0/TBD | Not started | - |
| 59. Live Artifact Regression, Documentation & Milestone Closure | v2.11 | 0/TBD | Not started | - |
