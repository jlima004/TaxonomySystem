# Phase 56: Pure Builder & Structural Validation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-09
**Phase:** 56-Pure Builder & Structural Validation
**Areas discussed:** Scope boundaries, API builder/validador, Representação in-memory, Determinismo, Estratégia de testes

---

## Scope Boundaries (operator pre-lock)

| Option | Description | Selected |
|--------|-------------|----------|
| Builder + validation only | Pure in-memory build/validate; no I/O modules | ✓ |
| Include CLI/writer/query proofs | Pull forward later-phase capabilities | |
| Include Neo4J/Graphify/Material | Expand graph node model | |

**User's choice:** Builder puro + structural validation em memória apenas. Sem CLI, writer, data/read-models output, boundary audit hashing, Neo4J, Graphify, Material nodes, query proofs. Provar stats `10/18/341/18/13` e invariantes Phase 55.
**Notes:** Limits stated upfront before gray-area selection; treated as non-negotiable phase boundary.

---

## API Builder/Validador

| Option | Description | Selected |
|--------|-------------|----------|
| Módulos separados | `build_graph.ts`, `validate_graph.ts`, optional `types.ts` | ✓ |
| Builder integrado com validação | Single module builds and validates | |
| Path-based API | Functions accept filesystem paths | |
| In-memory input API | Functions accept loaded artifact objects | ✓ |
| Throw on validation failure | Exceptions for structural errors | |
| Structured GraphValidationResult | `ok`, `errors`, optional `warnings`; coded errors | ✓ |

**User's choice:** `buildOlfactoryGraph(input): OlfactoryGraph` and `validateOlfactoryGraph(graph): GraphValidationResult`. Errors with `code`, `path`, `message`, optional `node_id`/`edge_id`. Throw only for programmer errors. Follow repo validation pattern.
**Notes:** No file read/write in Phase 56 production modules.

---

## Representação In-Memory

| Option | Description | Selected |
|--------|-------------|----------|
| Array-based GraphNode/GraphEdge | `{ id, kind, properties }` / `{ id, kind, source, target, properties }` | ✓ |
| Persisted index maps on graph | Map by id for O(1) lookup on final object | |
| Extended node kinds | Material, Molecule, etc. | |

**User's choice:** `OlfactoryGraph` with `schema_version`, `nodes`, `edges`, `stats`. No persisted indexes on final graph. Stats reconcile contract baseline. Contract node/edge kinds only.
**Notes:** Internal temporary indexes allowed during build/validate.

---

## Determinismo

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit sort rules | kind→id for nodes; kind→source→target→id for edges | ✓ |
| Wall-clock metadata | Date.now() / new Date() in output | |
| Injectable or omitted metadata | No fresh timestamps in Phase 56 | ✓ |
| In-memory JSON.stringify tests | Byte-identical serialization without disk write | ✓ |

**User's choice:** Contract edge ID format; preserve similarity score/dimensions/evidence/final_score; subfamily→subfamily only.
**Notes:** Phase 56 does not serialize to disk.

---

## Estratégia de Testes

| Option | Description | Selected |
|--------|-------------|----------|
| Fixtures only | All tests use inline minimal data | |
| Live artifacts only | All tests read real v2 compiled JSON | |
| Híbrido | Inline fixtures for invariants + live v2 for baseline regression | ✓ |

**User's choice:** Inline fixtures cover construction, all six invariants, determinism double-build. Live regression reads three v2 compiled files once for stats, alias resolution, similarity endpoint checks. No disk writes; no enriched_materials or graphify-out reads.
**Notes:** Reinforced no mutation of protected paths.

---

## Agent Discretion

- Input typing for `buildOlfactoryGraph` (exact artifact types vs records)
- Whether to populate `warnings` in Phase 56
- Internal helper module naming (e.g., ID formatting helpers)

## Deferred Ideas

- CLI, writer, boundary audit — Phase 58
- Query proofs — Phase 57
- Neo4J docs — Phase 59
- Material/Molecule/PubChem nodes — future milestone
- Graphify as input/output — permanently out of v2.11 production contract
