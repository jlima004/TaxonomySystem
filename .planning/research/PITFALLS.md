# Domain Pitfalls

**Domain:** v2.11 static olfactory knowledge graph read model  
**Project:** Olfactory Taxonomy System  
**Researched:** 2026-06-08  
**Overall confidence:** HIGH — based on current planning docs, package scripts, compiler/write guard behavior, alias integrity code/tests, and live `data/compiled/v2` artifact shape.

## Baseline Facts That Should Drive Requirements

- v2.11 is a **read-only graph read model**, not a new taxonomy publication, graph database, Graphify run, runtime, UI, scoring engine, or curation milestone.
- Permitted default inputs are the existing compiled artifacts: `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`.
- Current compiled baseline observed from files: **10 families, 18 subfamilies, 341 descriptors, 62 curated seed descriptors, 279 corpus candidates, 279 review-required descriptors, 18 aliases, 13 similarity edges, 257 review queue items**.
- Alias integrity baseline is protected: **18 aliases / 341 compiled descriptors / 18 valid targets / 0 unresolved targets**.
- The similarity artifact is a **sparse subfamily graph** with threshold `0.25`; it is not a descriptor-to-descriptor matrix and not material-level similarity.
- `data/taxonomy/*`, `data/compiled/v2/*`, `graphify-out/**`, curation queues, Neo4J/Docker/external DBs, scoring, UI, MVP, SaaS runtime, and Knowledge Engine runtime are explicit out-of-scope boundaries.

## Critical Pitfalls

Mistakes that can corrupt the baseline, cause roadmap drift, or force a rewrite.

### Pitfall 1: Mutating protected taxonomy or compiled artifacts while building the read model

**What goes wrong:** The graph builder writes into `data/compiled/v2/*`, regenerates compiled artifacts, edits `data/taxonomy/taxonomy-seed.v2.json`, edits `data/taxonomy/descriptor_aliases.seed.json`, or changes `data/taxonomy/alias_target_exceptions.v1.json` while “just” adding graph export support.  
**Why it happens:** Existing compiler code has an official writer (`writeCompileResults`) that writes deterministic JSON to an output directory, and historical milestones published into `data/compiled/v2`. A graph export can accidentally reuse these paths or run compile commands with the wrong `--out`.  
**Consequences:** Protected `341/18/0` alias baseline becomes unauditable; v2.11 stops being read-only; roadmap expands into curation/publication; CI proofs may pass against a changed baseline that should never have changed.  
**Prevention:**
- Requirement must state: “No changes to `data/taxonomy/**`, `data/inference/**`, `data/compiled/v1/**`, `data/compiled/v2/**`, `src/cli/parse_args.ts`, or `graphify-out/**`.”
- Graph export output must be outside official compiled artifacts, e.g. `.planning/artifacts/v2.11/graph/` for proof artifacts or a clearly named experimental read-model path only if explicitly approved. Never write under `data/compiled/v2/`.
- Add a graph output path validator that rejects any path inside protected directories.
- Run `npm run safety:guard` and `git diff --name-only -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts graphify-out` before verification/closure.
- Capture SHA-256 hashes of the three compiled v2 input files before and after graph build; require equality.
**Detection:** Any git diff under protected paths; changed source file hashes; `data/compiled/v2/*` timestamps/content changing; graph export named as “compiled” or “published” artifact.

### Pitfall 2: Collapsing node namespaces and corrupting canonical identity

**What goes wrong:** Raw IDs are used as globally unique graph node IDs, causing collisions between families, subfamilies, descriptors, and aliases. Examples in the current data make this likely: `fresh_spice` is both a family and subfamily; `floral` and `citrus` are family IDs and descriptor IDs; `amber` is a subfamily and descriptor.  
**Why it happens:** Compiled artifacts are internally scoped by position, but graph stores usually require globally unique node IDs.  
**Consequences:** Edges attach to the wrong node kind; descriptor queries return families; future Neo4J import would require ID migration; graph proofs can falsely pass if they only check raw string uniqueness per array.  
**Prevention:**
- Roadmap must require explicit namespaced canonical graph IDs: `family:<id>`, `subfamily:<id>`, `descriptor:<id>`, `alias:<stable-alias-id>`.
- Preserve raw taxonomy IDs as properties (`taxonomy_id`, `label`, `source_id`) rather than using them as graph-global IDs.
- Add tests that intentionally assert known collision cases stay distinct: `family:fresh_spice` ≠ `subfamily:fresh_spice`; `family:floral` ≠ `descriptor:floral`; `subfamily:amber` ≠ `descriptor:amber`.
**Detection:** Duplicate graph node IDs; edge endpoint kind mismatches; query counts lower than expected because collisions merged nodes.

### Pitfall 3: Misinterpreting similarity edges as descriptor/material similarity or curated truth

**What goes wrong:** `similarity_matrix.json.edges` are modeled as descriptor-to-descriptor or material-to-material similarity, treated as complete neighborhood truth, or used to infer new taxonomy placements.  
**Why it happens:** The filename says “matrix”, but the artifact is actually a sparse adjacency list over **subfamily IDs**. Scores combine dimensions such as tradition and accord compatibility; in the current 13 edges, `semantic_overlap` is often `0`, so “similarity” does not necessarily mean lexical/semantic overlap.  
**Consequences:** Query proofs become misleading; downstream AI/RAG consumers overstate evidence; roadmap drifts into scoring/intelligence; curation queues are implicitly resolved without approval.  
**Prevention:**
- Model edges as `SUBFAMILY_RELATED_TO_SUBFAMILY`, not descriptor/material similarity.
- Store and expose `final_score`, `score`, `threshold`, dimension breakdown, and evidence fields; never collapse to a boolean “similar”.
- Treat the edge set as sparse and thresholded: absence of an edge means “below threshold or not emitted,” not “unrelated.”
- Define directionality explicitly. Recommended: store one canonical undirected edge with sorted endpoint key; query helpers may return symmetric neighborhoods without duplicating persisted edges.
- Roadmap must forbid using similarity edges to promote descriptors, resolve low-support candidates, or add aliases.
**Detection:** Graph contains `SIMILAR_TO` edges between descriptors/materials derived directly from subfamily edges; edge count doubles without documented symmetric projection; code reads `review_queue` as graph edges.

### Pitfall 4: Turning corpus candidates and review queue items into curated graph truth

**What goes wrong:** The read model hides `source`, `status`, `review_required`, and `corpus_derived`, making 279 corpus candidates look equivalent to 62 curated seed descriptors. Or it turns 257 review queue items into nodes/edges that imply accepted taxonomy.  
**Why it happens:** Graph visualizations and query examples often favor simple nodes/edges and drop uncertainty metadata.  
**Consequences:** Future agent/RAG work learns uncurated noise as ground truth; low-support/conflict curation is reopened by accident; v2.11 violates the protected taxonomy baseline while not changing files.  
**Prevention:**
- Descriptor nodes must carry `source`, `status`, `review_required`, `corpus_derived`, `frequency`, `family_id`, and `subfamily_id` where available.
- Query examples must distinguish “curated descriptors” from “candidate descriptors”.
- Review queue items may be summarized as metadata/proof counts, but must not be converted into accepted taxonomy edges or remediation tasks.
- Requirements should explicitly say: “No low_support/conflict curation and no candidate promotion in this milestone.”
**Detection:** Graph schema lacks review metadata; query proof says “all descriptors in X are curated”; roadmap phase names mention low-support triage, conflict cleanup, or promotion.

### Pitfall 5: Adding Material nodes from `enriched_materials.json` by default

**What goes wrong:** v2.11 adds `Material` nodes, material-descriptor edges, PubChem properties, molecular identifiers, volatility/tenacity features, or material similarity edges from `data/enriched_materials.json`.  
**Why it happens:** Material nodes are attractive for future RAG/SaaS/agent use, and `PROJECT.md` says the enriched corpus may be considered with explicit boundary audit. But it is ~70MB, gitignored, and belongs closer to future runtime/intelligence layers than the minimal static taxonomy graph contract.  
**Consequences:** Scope balloons into Knowledge Engine/runtime; graph size and memory behavior change drastically; tests become environment-dependent because the corpus may be absent; chemical/scoring layers leak into Layer 1; output may expose raw material data that was not approved for publication.  
**Prevention:**
- Default v2.11 graph schema should **exclude `Material` nodes**.
- If Material nodes are mentioned, put them in a “future extension” section only, with explicit gates: separate phase, corpus availability check, privacy/publication decision, size budget, streaming plan, and protected-boundary audit.
- Do not read `data/enriched_materials.json` in default graph builder/tests. If a proof needs materials, use tiny fixtures only and document it as non-production.
- For roadmap: make “Material nodes” an anti-feature for v2.11, not an optional task.
**Detection:** Graph schema has `Material`, `Molecule`, `CID`, `SMILES`, `XLogP`, volatility, tenacity, or material-material similarity fields; CI fails when `data/enriched_materials.json` is absent; graph export size grows unexpectedly.

### Pitfall 6: Letting static read model work creep into Neo4J, Docker, Graphify, UI, scoring, or runtime APIs

**What goes wrong:** The milestone starts installing graph DB clients, writing Cypher import jobs, touching `graphify-out/**`, adding API endpoints, adding UI, or designing scoring/agent runtime.  
**Why it happens:** “Knowledge graph” often implies database/runtime infrastructure, and the repo has existing Graphify outputs that may be confused with this read model.  
**Consequences:** Heavy dependencies violate the zero-dependency TypeScript approach; CI becomes slower/flakier; protected dirty Graphify state may be staged; roadmap loses the static-contract sequencing.  
**Prevention:**
- Roadmap language should be “static graph JSON read model + proof queries”, not “deploy graph database”.
- `src/package.json` should not gain Neo4J, Docker, graph DB, Graphify, UI, or runtime API dependencies/scripts for this milestone.
- Future Neo4J work is documentation-only: schema mapping notes and export-path design, no driver, DB, Docker Compose, or import command.
- Keep `graphify-out/**` completely untouched and unstaged; rely on `scripts/check-safety-guards.sh`.
**Detection:** New dependencies beyond existing TypeScript/Vitest stack; files under `graphify-out/**`; Docker/Neo4J config; HTTP server/API routes; UI assets; scripts named `neo4j:*` that execute imports.

### Pitfall 7: Nondeterministic graph exports and brittle proof artifacts

**What goes wrong:** Graph output changes between runs due to timestamps, insertion order, unsorted edge arrays, object key ordering, or environment-specific paths.  
**Why it happens:** Compiled artifacts contain `generated_at`; builders often add their own generated timestamp; JS object iteration can be stable but still reflect input/order assumptions that tests do not lock down.  
**Consequences:** CI snapshots churn; protected-hash checks become noisy; future consumers cannot tell semantic changes from rebuild noise.  
**Prevention:**
- Graph export must sort nodes and edges by canonical ID/type.
- Avoid a fresh `generated_at` in deterministic artifacts; if metadata is needed, record source artifact hashes/counts and an explicit schema version.
- Add a determinism test: build twice from the same fixtures/live compiled inputs and compare byte-identical JSON serialization.
- Reuse deterministic JSON formatting conventions (`JSON.stringify(payload, null, 2) + '\n'`) but do not reuse official compiled output paths.
**Detection:** Consecutive graph builds produce diffs; snapshots fail only on ordering/timestamp; graph metadata records local absolute paths.

## Moderate Pitfalls

### Pitfall 1: Alias nodes creating false descriptors or losing raw alias text

**What goes wrong:** Aliases such as `"ylang ylang" -> "ylang_ylang"` are converted into descriptor nodes, normalized into IDs that collide with descriptor IDs, or stripped of raw display text.  
**Prevention:** Represent aliases as `Alias` nodes or alias properties with namespaced IDs and `ALIAS_OF -> descriptor:<target>`. Preserve the raw alias string as a property. Require alias target integrity proof to pass (`18/341/18/0`) after graph build.

### Pitfall 2: Confusing artifact version labels with milestone/version truth

**What goes wrong:** Graph metadata trusts the internal `version` field alone even though current planning refers to v2.9/v2.10 baseline while live compiled artifact fields may still show `2.1.0`.  
**Prevention:** Graph metadata should record source paths, source SHA-256 hashes, source `generated_at`, observed counts, and graph schema version. Do not call graph output “v2.11 compiled taxonomy”.

### Pitfall 3: Overfitting query proofs to current tiny edge count

**What goes wrong:** Query examples assume exactly 13 similarity edges or hardcode endpoint IDs, making future compiled baselines painful to consume.  
**Prevention:** Tests may assert current baseline counts in boundary proofs, but query helpers should be data-driven and fixture-tested. Separate “current baseline proof” from reusable graph logic tests.

### Pitfall 4: Accidentally modifying normal compile semantics

**What goes wrong:** Graph verification is bolted into `compile` or the compiler path, making everyday compilation heavier or changing alias gate behavior.  
**Prevention:** Add separate scripts such as `graph:build`/`graph:verify` if needed. Keep `compile` and `compile:quality` semantics stable unless a phase explicitly authorizes changes.

## Minor Pitfalls

### Pitfall 1: Over-naming the artifact as a product API

**What goes wrong:** Documentation calls the read model a “Knowledge Engine”, “agent memory”, or “SaaS backend,” inviting runtime expectations.  
**Prevention:** Use “static graph read model” consistently; put future agent/RAG/Neo4J notes under “future path”.

### Pitfall 2: Missing negative tests for path safety

**What goes wrong:** The builder works for the happy path but no test proves it refuses `data/compiled/v2` output.  
**Prevention:** Add tests that assert protected output paths throw before any write attempt.

### Pitfall 3: Treating graph edge absence as negative knowledge

**What goes wrong:** Query examples say subfamilies without similarity edges are unrelated.  
**Prevention:** Document sparse threshold semantics: absence means “not emitted by current thresholded artifact.”

## Test and CI Guardrail Recommendations

| Guardrail | What it proves | Where it should run |
|-----------|----------------|---------------------|
| Protected path hash proof | `data/taxonomy/**`, `data/compiled/v2/**`, and other protected paths are unchanged before/after graph build | Phase verification and CI if graph build writes artifacts |
| Output path rejection test | Graph builder refuses protected output paths such as `data/compiled/v2` and `graphify-out` | Unit tests |
| Graph ID uniqueness test | Namespaced IDs prevent family/subfamily/descriptor/alias collisions | Unit tests |
| Edge endpoint integrity test | Hierarchy edges target existing nodes; similarity edges target subfamily nodes only; alias edges target descriptor nodes only | Unit tests |
| Similarity semantics test | Similarity edges preserve score/dimensions/evidence and are not converted into descriptor/material edges | Unit tests |
| Alias integrity reuse | Existing `validateAliasTargetIntegrity` remains PASS (`18/341/18/0`) for graph inputs | Unit/integration tests and `verify:integrity` |
| Determinism test | Two builds from same inputs produce byte-identical output | Unit/integration tests |
| Material exclusion test | Default schema/export contains no `Material`/molecular/scoring nodes or fields | Unit tests |
| Safety guard | No staged/dirty protected paths and no staged Graphify files | `npm run safety:guard`, CI/closure |
| Scope dependency check | No Neo4J/Docker/external DB/heavy deps introduced | Review checklist / package diff |

## Phase-Specific Warnings for Roadmap

| Phase Topic | Likely Pitfall | Mitigation to Put in Requirements |
|-------------|----------------|-----------------------------------|
| Graph schema contract | Raw ID collisions; Material nodes sneaking in | Require node kind namespace and explicitly exclude Material/Molecule/scoring nodes from v2.11 |
| Builder/export implementation | Writes to `data/compiled/v2` or embeds nondeterministic timestamps | Require protected path rejection, output outside compiled artifacts, sorted deterministic serialization |
| Integrity validation | Only validates schema shape, not endpoint kind or protected baseline | Require ID uniqueness, endpoint existence/kind checks, alias integrity reuse, source hash preservation |
| Query proofs | Query examples overstate candidates/similarity as truth | Require curated-vs-candidate filters and sparse similarity disclaimers in proof docs |
| Future Neo4J path | Implementation creeps into DB/Docker/client deps | Documentation-only mapping; no runtime import, Docker, driver, or DB dependency |
| Closure/CI | Existing guardrails not run after graph build | Require `npm test`, `npm run verify:integrity`, `npm run safety:guard`, and protected hash proof in closure |

## Explicit Anti-Scope-Creep Boundaries

Do **not** include in v2.11 roadmap phases unless a later milestone reopens scope explicitly:

- Mutating `data/taxonomy/taxonomy-seed.v2.json`.
- Mutating `data/taxonomy/descriptor_aliases.seed.json` or `data/taxonomy/alias_target_exceptions.v1.json`.
- Mutating or publishing `data/compiled/v2/*`.
- Opening FUT-01/FUT-02, low-support curation, conflict curation, candidate promotion, alias remediation, or seed expansion.
- Touching `graphify-out/**` or running Graphify as part of this read model.
- Adding Neo4J, Docker, external DBs, graph DB clients, or heavy graph dependencies.
- Adding Material nodes, molecule nodes, PubChem fields, volatility/tenacity/scoring features, runtime APIs, UI, MVP, SaaS, agent runtime, or Knowledge Engine runtime.
- Changing normal `compile` behavior or making everyday compile heavier.

## Sources

- `.planning/PROJECT.md` — v2.11 active requirements, protected boundaries, architecture decisions, out-of-scope list.
- `.planning/MILESTONES.md` — v2.10 CI/integrity closure and protected baseline history.
- `.planning/ROADMAP.md` — shipped phase sequence and current milestone context.
- `src/package.json` — current scripts: `compile`, `compile:quality`, `safety:guard`, `alias:integrity`, `verify:integrity`.
- `src/compiler/write_outputs.ts` — deterministic compiler writer and risk of wrong output directory reuse.
- `src/compiler/alias_target_integrity.ts` — reusable alias target integrity validator.
- `src/tests/inventory/alias_target_inventory.test.ts` — live `341/18/0` alias baseline and `ylang_ylang` integrity assertions.
- `scripts/check-safety-guards.sh` — non-mutating protected path and Graphify staging guard.
- `data/compiled/v2/taxonomy.json` — current family/subfamily/descriptor shape and candidate metadata.
- `data/compiled/v2/descriptor_aliases.json` — current 18 alias mappings.
- `data/compiled/v2/similarity_matrix.json` — current sparse subfamily similarity edges, dimensions, evidence, and review queue.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Protected-file mutation risk | HIGH | Directly supported by v2.11 planning boundaries and safety guard implementation. |
| Similarity edge interpretation | HIGH | Directly supported by `similarity_matrix.json`: endpoints are subfamily IDs, sparse threshold `0.25`, dimensions/evidence included. |
| Material node risk | HIGH | Project explicitly says enriched materials may be considered only with boundary audit; constraints note large/gitignored corpus and out-of-scope runtime/scoring. |
| Test/CI recommendations | HIGH | Based on existing npm scripts, alias validator/tests, and safety guard. |
| Future Neo4J path | MEDIUM | Boundary is explicit; detailed future import design is intentionally out of scope. |
