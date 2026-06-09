# Project Research Summary

**Project:** Olfactory Taxonomy System  
**Milestone:** v2.11 Olfactory Knowledge Graph Read Model  
**Domain:** Static read-only olfactory knowledge graph over compiled taxonomy artifacts  
**Researched:** 2026-06-08  
**Confidence:** HIGH

## Executive Summary

v2.11 should deliver a deterministic, database-free **static graph read model** for the existing olfactory taxonomy. Experts should build this as a small property-graph export from trusted compiled artifacts, not as a graph database deployment, not as a Graphify integration, and not as a new taxonomy publication. The authoritative inputs are `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`; the current baseline is 10 families, 18 subfamilies, 341 descriptors, 18 aliases, and 13 sparse subfamily-similarity edges.

The recommended approach is zero new runtime dependencies: keep Node.js + strict ESM TypeScript + Vitest, add narrow first-party modules for graph types, pure building, validation, query proofs, boundary auditing, and one standalone CLI/script path. The graph must use type-prefixed canonical IDs (`family:*`, `subfamily:*`, `descriptor:*`, `alias:*`) because raw IDs collide across artifact scopes.

The main risks are scope creep and artifact corruption: writing into `data/compiled/v2`, treating subfamily similarity as descriptor/material similarity, promoting review-required candidates, pulling in material/corpus data, or adding Neo4J/Docker/runtime layers. Mitigate with an explicit separated output path, protected-path rejection, before/after hash or git-diff boundary proof, deterministic serialization, and validation that checks unique IDs, endpoint types, alias targets, similarity semantics, and protected baseline preservation.

## Key Findings

### Recommended Stack

No new package dependencies are justified for v2.11. The graph is small enough for first-party maps/arrays and deterministic JSON serialization, and the existing repository already has strict TypeScript, Vitest, compiler validation conventions, and atomic JSON writing patterns.

**Core technologies:**
- **Node.js**: CLI execution and built-in `fs/path/crypto` support — enough for reading artifacts, hashing protected files, and writing deterministic outputs.
- **TypeScript 5.x strict ESM**: graph contract, builder, validators, query helpers — matches the repo’s existing source style and type-safety requirements.
- **Vitest**: unit, integration, determinism, CLI, and live-artifact regression tests — already established in the project.
- **Built-in JSON + optional `node:crypto` hashing**: stable serialization and source/protected artifact hashes — avoids schema, CSV, graph, RDF, or DB dependencies.

**Do not add:** Neo4J drivers, Docker, graph libraries, RDF/JSON-LD tooling, CSV tooling, CLI parser packages, Zod/AJV, runtime APIs, UI frameworks, or Graphify coupling.

### Expected Features

**Must have (table stakes):**
- Minimal graph schema contract with node kinds, edge kinds, properties, invariants, and schema version.
- Namespaced graph IDs to prevent known family/subfamily/descriptor/alias collisions.
- Family, Subfamily, Descriptor, and Alias nodes derived from compiled artifacts only.
- Hierarchy edges, alias-resolution edges, and subfamily-similarity edges only.
- Descriptor metadata preservation: `source`, `frequency`, `status`, `review_required`, `corpus_derived`, `family_id`, `subfamily_id`.
- Deterministic builder/export with stable sorting, no fresh wall-clock content, and stable JSON formatting.
- Graph validation for duplicate IDs, endpoint existence/type, alias targets, similarity endpoint type, stats, determinism, and protected-boundary preservation.
- Query proofs for descriptors by family/subfamily, alias resolution, descriptor-to-family paths, similarity neighborhoods, cross-family bridges, hubs, and boundary/count reconciliation.
- Documentation describing the schema, usage, query examples, boundaries, and future Neo4J mapping.

**Should have (valuable differentiators):**
- Source artifact provenance and SHA-256 hashes.
- Separate `graph_schema_version` / contract versioning.
- Human-readable graph summary or validation proof.
- Generated query proof fixtures/results, not hand-written snapshots.
- Documentation-only Neo4J label/relationship mapping.

**Defer:**
- Material nodes and `MATERIAL_HAS_DESCRIPTOR` edges.
- ReviewItem nodes and curation workflow graphing.
- Descriptor-level similarity, material similarity, new scoring, or inferred taxonomy changes.
- Neo4J CSV/import implementation, Docker, database drivers, runtime APIs, UI, RAG/SaaS/agent runtime.
- Any FUT-01/FUT-02 curation, low-support triage, conflict cleanup, candidate promotion, alias remediation, or seed expansion.

### Architecture Approach

Build the read model as a **standalone read-only pipeline after compilation**, not inside `compileAll()` and not as part of normal `npm run compile`. Add a narrow module family under a graph-read-model namespace, keep pure transformation and validation code separate from CLI/writer side effects, and reuse existing validation and deterministic writing conventions without broad refactors.

**Major components:**
1. **Graph types/schema** — defines export envelope, node/edge contracts, ID conventions, stats, validation/proof types.
2. **Source artifact loader/validator** — reads only compiled v2 artifacts and reuses existing compiled-output validation before graph building.
3. **Pure graph builder** — converts taxonomy, aliases, and similarity artifacts into sorted nodes/edges without mutation or inference.
4. **Graph validator** — enforces ID uniqueness, endpoint existence/kind, alias integrity, subfamily-similarity semantics, stats, and domain invariants.
5. **Query proof helpers** — generate deterministic proof outputs from the graph for traversal, aliases, neighborhoods, hubs, paths, and counts.
6. **Writer/CLI/boundary audit** — writes only read-model artifacts, rejects protected output prefixes, and proves protected paths are unchanged.

### Output Path Decision

Researchers agreed the graph output must be outside `data/compiled/v2/` and outside `graphify-out/**`, but proposed different naming conventions:

- `STACK.md`: `data/read-models/olfactory-graph/v2.11/`
- `ARCHITECTURE.md`: `data/read_models/olfactory_graph/v2/`
- `PITFALLS.md`: cautions against official compiled output and suggests proof/experimental paths unless explicitly approved

**Decision for roadmap:** use `data/read-models/olfactory-graph/v2.11/` as the default milestone deliverable path. It is version-specific, clearly separated from compiled taxonomy publication, and reads as a derived read model rather than compiler output. The CLI may also support `/tmp/v2.11-olfactory-graph` for verification-only runs. Requirements should explicitly reject `data/compiled/**`, `data/taxonomy/**`, and `graphify-out/**` as output prefixes.

Recommended files:
- `graph.json`
- `query_proofs.json`
- `graph_validation.json` or validation section in `manifest.json`
- `boundary_audit.json`
- `manifest.json`
- `README.md`

### Critical Pitfalls

1. **Mutating protected taxonomy or compiled artifacts** — reject protected output paths, never write under `data/compiled/v2`, snapshot/hash protected files before and after, and run safety/git-diff guards.
2. **Collapsing node namespaces** — require type-prefixed graph IDs and tests for known collisions such as `family:floral` vs `descriptor:floral` and `subfamily:amber` vs `descriptor:amber`.
3. **Misinterpreting similarity edges** — model `similarity_matrix.json` as sparse subfamily-to-subfamily relations only; preserve score/dimensions/evidence and document that missing edges are not negative knowledge.
4. **Promoting candidates or review queue items into truth** — preserve descriptor status/review metadata and summarize review counts only; do not resolve curation queues.
5. **Adding material/corpus graph scope** — exclude `Material`, molecule, PubChem, volatility/tenacity, and material similarity from v2.11 unless a future milestone performs a separate boundary audit.
6. **Neo4J/runtime/Graphify scope creep** — keep future Neo4J as mapping documentation only; do not add drivers, Docker, DB tests, API routes, UI, or Graphify output changes.
7. **Nondeterministic outputs** — sort all graph/proof arrays, avoid fresh timestamps by default, use stable JSON formatting, and add byte-identical rebuild tests.

## Explicit Out of Scope

- Mutating `data/taxonomy/**`, `data/inference/**`, `data/compiled/v1/**`, `data/compiled/v2/**`, `graphify-out/**`, or normal compiler defaults.
- Writing graph outputs under `data/compiled/v2` or treating them as official compiled taxonomy artifacts.
- Running Graphify or changing Graphify artifacts.
- Neo4J, Docker, database provisioning, database drivers, Cypher import jobs, runtime APIs, UI, MVP, SaaS, RAG, agent runtime, or Knowledge Engine runtime.
- New graph/RDF/schema/CLI/scoring dependencies.
- Material, Molecule, PubChem, chemical, volatility/tenacity, material-descriptor, or material-similarity nodes/edges.
- ReviewItem nodes, low-support/conflict curation, candidate promotion, alias remediation, seed expansion, or similarity/scoring redesign.
- Descriptor-level similarity inferred from subfamily similarity edges.

## Implications for Roadmap

Suggested phase structure:

### Phase 1: Graph Contract and Boundary Decisions
**Rationale:** ID namespace and output-path decisions must precede builder work; they prevent the highest-risk ambiguity and baseline corruption.  
**Delivers:** TypeScript graph types, schema version, node/edge contracts, ID format rules, output path policy, out-of-scope contract, and fixture expectations.  
**Addresses:** Minimal schema, namespaced IDs, separated output location, explicit anti-features.  
**Avoids:** Raw ID collisions, material scope creep, compiled-artifact publication ambiguity.

### Phase 2: Pure Builder and Structural Validation
**Rationale:** The graph should be proven correct in memory before any writer or CLI can touch the filesystem.  
**Delivers:** Pure compiled-artifact-to-graph builder; validation for duplicate IDs, endpoint existence/kind, alias targets, similarity endpoints, descriptor placement, stats, and deterministic ordering.  
**Uses:** Node.js + strict TypeScript only; existing compiled-output validators where appropriate.  
**Avoids:** Similarity semantic drift, candidate promotion, hidden corpus reads, dependency bloat.

### Phase 3: Query Proofs
**Rationale:** Query proofs demonstrate graph utility after structural correctness, without prematurely creating runtime/API expectations.  
**Delivers:** Pure query helpers and generated `query_proofs.json` for descriptors by family/subfamily, alias resolution, descriptor-to-family paths, similarity neighborhoods, cross-family bridges, hubs, and count proofs.  
**Addresses:** Table-stakes query proofs and future agent/RAG traversal evidence.  
**Avoids:** Decorative hand-written snapshots, overclaiming sparse similarity, hiding candidate/review status.

### Phase 4: CLI, Writer, and Boundary Audit
**Rationale:** File writes should arrive only after contract, builder, validator, and proofs are tested.  
**Delivers:** Standalone graph CLI/script, deterministic writer, protected output prefix rejection, before/after boundary audit, `graph.json`, `manifest.json`, validation/proof artifacts, and verification-only `/tmp` mode.  
**Implements:** Side-effect edge of the architecture while leaving `compile`, `compile:quality`, and alias gates unchanged.  
**Avoids:** Protected file mutation, nondeterministic artifacts, accidental Graphify/compiled output writes.

### Phase 5: Live Artifact Regression and Documentation
**Rationale:** The deliverable must be proven against the current v2 compiled baseline and documented for downstream use/future Neo4J mapping.  
**Delivers:** Live tests for 10/18/341/18/13 counts, alias resolution, subfamily-similarity integrity, README/contract docs, output status disclaimer, future Neo4J mapping notes, and final safety verification.  
**Addresses:** Documentation, query examples, boundary/count proof, future path readiness.  
**Avoids:** Calling the read model official taxonomy publication or implementing Neo4J prematurely.

### Phase Ordering Rationale

- Schema, ID, and output-location decisions come first because they constrain every downstream artifact and avoid the most expensive rewrites.
- Pure builder/validator work precedes CLI/writer work to keep protected files safe until invariants pass.
- Query proofs come before publishing outputs so usefulness is verified from graph truth, not hand-authored examples.
- Boundary audit and live regression close the milestone by proving the existing compiled baseline remains untouched.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4:** Output artifact policy and boundary audit details may need repo-specific confirmation, especially final file list and whether generated read-model outputs should be committed.
- **Phase 5:** Neo4J mapping docs may need light targeted research if the team wants stronger future-import conventions, but implementation remains out of scope.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Well-supported by project requirements and all four research files.
- **Phase 2:** Standard pure TypeScript builder/validator patterns already exist in the repo.
- **Phase 3:** Small in-memory query helpers over JSON; no external ecosystem research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Direct inspection supports zero-dependency Node/TypeScript/Vitest implementation; graph size is small and requirements exclude heavy dependencies. |
| Features | HIGH | Table-stakes features map directly to v2.11 GKG requirements and live compiled artifact shape. Future Neo4J readiness is MEDIUM because it is intentionally documentation-only. |
| Architecture | HIGH | Existing compiler/CLI/test patterns clearly support a standalone read-only pipeline after compilation. |
| Pitfalls | HIGH | Risks are strongly evidenced by protected boundaries, current scripts, live artifacts, and known raw-ID collisions. |

**Overall confidence:** HIGH

### Gaps to Address

- **Final output naming convention:** Researchers differed on hyphen vs underscore and `v2.11` vs `v2`; roadmap should standardize on `data/read-models/olfactory-graph/v2.11/` unless project maintainers prefer repo-local underscore conventions.
- **Commit generated read-model artifacts or verification-only outputs:** Research recommends a separated read-model path, but planning should decide whether generated artifacts are committed or produced in `/tmp` during verification.
- **Manifest vs separate validation files:** Decide whether validation/boundary details live in dedicated JSON files, `manifest.json`, or both.
- **`generated_at` policy:** Prefer deterministic source-derived or explicitly injected timestamps; planning should lock the exact metadata field behavior before implementation.
- **Future Neo4J mapping depth:** Keep implementation out of scope, but decide how detailed the documentation-only mapping needs to be.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — stack, dependency, scripts, deterministic export, and output path recommendations.
- `.planning/research/FEATURES.md` — table-stakes features, anti-features, query proofs, material decision, and dependencies.
- `.planning/research/ARCHITECTURE.md` — standalone pipeline, module layout, data flow, validation, CLI/writer, boundary audit, tests, and phase order.
- `.planning/research/PITFALLS.md` — protected-boundary risks, ID collisions, similarity semantics, material/Neo4J scope creep, nondeterminism, guardrails.
- `.planning/PROJECT.md` — v2.11 GKG requirements and protected boundaries cited by all researchers.
- `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json` — live baseline counts and artifact semantics cited by researchers.
- Existing source/test patterns: compiler validation/writing, alias integrity, CLI tests, safety guard, strict TypeScript/Vitest setup.

---
*Research completed: 2026-06-08*  
*Ready for roadmap: yes*
