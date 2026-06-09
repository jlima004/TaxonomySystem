# Architecture Research — v2.11 Olfactory Knowledge Graph Read Model

**Project:** Olfactory Taxonomy System  
**Milestone:** v2.11 Olfactory Knowledge Graph Read Model  
**Researched:** 2026-06-08  
**Mode:** Architecture integration research  
**Overall confidence:** HIGH — based on current project planning files, compiler/CLI source, live compiled v2 artifacts, and existing Vitest patterns.

## Executive Recommendation

Build the graph read model as a **standalone read-only pipeline after compilation**, not as another stage inside `compileAll()` and not as a mutation of `data/compiled/v2/*`. The safe integration point is:

```text
data/compiled/v2/taxonomy.json
data/compiled/v2/descriptor_aliases.json
data/compiled/v2/similarity_matrix.json
        ↓ read-only JSON loading
existing source artifact validation
        ↓
pure graph builder
        ↓
graph validation + query proof generation
        ↓
boundary audit snapshot/proof
        ↓
data/read_models/olfactory_graph/v2/* or /tmp verification output
```

Do **not** modify `src/compiler/compile_all.ts`, `src/compiler/write_outputs.ts`, or the normal `npm run compile` path for this milestone. v2.11 should add a narrow module family under `src/graph_read_model/`, one standalone CLI under `src/cli/graph_read_model.ts`, and focused Vitest coverage. This preserves the current architecture: functional pure core, tiny side-effect edge at the CLI/writer, deterministic JSON, TypeScript strict, zero runtime dependencies.

The read model should model **taxonomy hierarchy**, **alias resolution**, and **subfamily similarity** only. Do not add Neo4J, Graphify coupling, material nodes from `data/enriched_materials.json`, runtime APIs, scoring redesign, or curation resolution. The compiled artifacts already contain the authoritative v2.11 inputs: 10 families, 18 subfamilies, 341 descriptors, 18 compiled aliases, and 13 similarity edges in the current baseline.

## Existing Boundaries That Should Stay Intact

| Boundary | Current Evidence | v2.11 Recommendation |
|----------|------------------|----------------------|
| Compiler | `compileAll()` returns only `taxonomy`, `aliases`, `similarity`; `writeCompileResults()` atomically writes exactly three official files. | Leave unchanged. Graph reads those outputs after the fact. |
| Normal compile CLI | `runCompileCli()` loads seeds/corpus/inference inputs, compiles, validates, writes `data/compiled/v2`. | Do not add graph generation to normal compile. Avoid heavier everyday compile. |
| Source artifact validators | `validateAllOutputs()` validates compiled taxonomy, aliases and similarity schema. | Reuse before graph build to reject invalid compiled inputs. |
| Alias integrity | `validateAliasTargetIntegrity()` and `alias_integrity` CLI prove seed aliases target compiled descriptors. | Keep as separate integrity hook; graph builder validates compiled alias edges internally. |
| Protected files | `.planning/PROJECT.md` forbids mutation of `data/taxonomy/*`, `data/compiled/v2/*`, and `graphify-out/**`. | Add runtime boundary audit and tests proving these paths are unchanged. |

## Recommended Module Layout

Minimal new modules, all snake_case, no broad refactors:

```text
src/
├── graph_read_model/
│   ├── types.ts                 # Graph node/edge/export/proof/audit types
│   ├── build_graph.ts           # Pure compiled artifacts -> graph export
│   ├── validate_graph.ts        # Pure graph/source/query validation
│   ├── queries.ts               # Pure query helpers and deterministic query proofs
│   ├── boundary_audit.ts        # Protected path hashing/comparison helpers
│   └── write_graph_outputs.ts   # Atomic JSON writer for graph/proofs only
├── cli/
│   └── graph_read_model.ts      # Standalone read-model CLI
└── tests/
    ├── graph_read_model/
    │   ├── build_graph.test.ts
    │   ├── validate_graph.test.ts
    │   ├── queries.test.ts
    │   ├── boundary_audit.test.ts
    │   └── live_compiled_graph.test.ts
    └── cli/
        └── graph_read_model.test.ts
```

### Why This Layout

- `src/graph_read_model/` makes the boundary explicit: this is not the compiler and not Graphify.
- `build_graph.ts`, `validate_graph.ts`, and `queries.ts` stay pure and cheap to unit test.
- `write_graph_outputs.ts` is the only graph-specific write module; mirror the atomic temp-file/rename pattern from `src/compiler/write_outputs.ts` instead of refactoring compiler utilities.
- `src/cli/graph_read_model.ts` can reuse existing CLI ergonomics (`runXxxCli(argv)`, `--help`, `--json`, temp fixtures) without touching `parseCompileArgs()`.

## Graph Contract

Use a small property graph JSON contract that can later be exported to Neo4J, but is database-free now.

### Recommended Top-Level Shape

```typescript
export type OlfactoryGraphExport = {
  readonly schema_version: 'olfactory_graph_read_model.v1'
  readonly artifact_version: string
  readonly generated_at: string
  readonly source_artifacts: readonly SourceArtifactRef[]
  readonly nodes: readonly GraphNode[]
  readonly edges: readonly GraphEdge[]
  readonly stats: GraphStats
}
```

### Node Types

| Node Type | ID Format | Source | Required Properties |
|-----------|-----------|--------|---------------------|
| `family` | `family:${family.id}` | `taxonomy.json.families[]` | `family_id`, `name` |
| `subfamily` | `subfamily:${subfamily.id}` | `taxonomy.json.families[].subfamilies[]` | `subfamily_id`, `family_id`, `name` |
| `descriptor` | `descriptor:${descriptor.id}` | `taxonomy.json...descriptors[]` | `descriptor_id`, `family_id`, `subfamily_id`, `source`, `frequency`, `status`, `review_required`, `corpus_derived` |
| `alias` | `alias:${alias}` | `descriptor_aliases.json.aliases` | `alias`, `target_descriptor_id` |

### Edge Types

| Edge Type | Source → Target | Derived From | Notes |
|-----------|-----------------|--------------|-------|
| `contains_subfamily` | family → subfamily | taxonomy hierarchy | Directed. |
| `contains_descriptor` | subfamily → descriptor | taxonomy hierarchy | Directed. |
| `resolves_to` | alias → descriptor | compiled alias map | Directed; target must exist as descriptor node. |
| `similar_to` | subfamily → subfamily | similarity matrix edges | Treat as undirected in properties, but preserve one deterministic edge record. Include score/dimensions/evidence. |

### ID and Ordering Rules

- Prefix every node ID with its type namespace to avoid family/subfamily/descriptor alias collisions.
- Preserve raw canonical descriptor IDs in properties; do not normalize or curate IDs in the graph builder.
- Sort nodes by `(type, id)` and edges by `(type, source, target, id)` before writing.
- Construct JSON objects with stable field order and write with `JSON.stringify(payload, null, 2) + '\n'`.
- Make `generated_at` deterministic by default: use the source taxonomy artifact `generated_at` unless `--generated-at <iso>` is explicitly provided.

## Data Flow

```text
CLI argv
  ↓
resolve input paths
  defaults:
    taxonomy   data/compiled/v2/taxonomy.json
    aliases    data/compiled/v2/descriptor_aliases.json
    similarity data/compiled/v2/similarity_matrix.json
  ↓
snapshot protected boundary BEFORE writes
  ↓
read JSON inputs
  ↓
validateAllOutputs(taxonomy, aliases, similarity)
  ↓
buildOlfactoryGraph({ taxonomy, aliases, similarity, generatedAt, sourceRefs })
  ↓
validateOlfactoryGraph(graph)
  ↓
buildQueryProofs(graph)
  ↓
validateQueryProofs(graph, proofs)
  ↓
write graph.json, graph_validation.json, query_examples.json
  ↓
snapshot protected boundary AFTER writes
  ↓
write boundary_audit.json and return exit code
```

### Inputs

Use only these by default:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

Do **not** read `data/enriched_materials.json` in v2.11. Material-level graph enrichment is a future phase because the file is large, gitignored, and would expand the contract beyond a compiled-artifact read model.

## Output Directory and File Strategy

### Recommended Output Directory

Use a clearly separated read-model location:

```text
data/read_models/olfactory_graph/v2/
```

This directory is outside `data/compiled/v2`, outside `data/taxonomy`, and outside `graphify-out`. It is therefore suitable for a checked-in read-model export if the phase chooses to publish one.

For verification-only runs, use:

```text
/tmp/v2.11-olfactory-graph
```

### Recommended Files

| File | Purpose | Determinism Requirement |
|------|---------|-------------------------|
| `graph.json` | Main graph read model: metadata, source artifacts, nodes, edges, stats. | Stable with same inputs/generated_at. |
| `graph_validation.json` | Validation proof: status, counts, warnings/errors, source validation summary. | Stable. |
| `query_examples.json` | Deterministic examples for descriptors by family, resolved aliases, similarity neighborhoods, hubs, descriptor-to-family paths. | Stable; sort all arrays. |
| `boundary_audit.json` | SHA-256 before/after proof for protected files plus output path policy. | Stable except timestamps only if explicitly included; prefer no wall-clock timestamp. |

### Protected Output Prefix Rejection

The CLI should reject `--out` paths inside protected scopes:

- `data/compiled/`
- `data/taxonomy/`
- `graphify-out/`

This catches accidental publication to official compiled artifacts or Graphify outputs before any write happens.

## Boundary Audit Mechanism

Add `src/graph_read_model/boundary_audit.ts` with pure-ish helpers around file hashing:

```typescript
export type BoundarySnapshotEntry = {
  readonly path: string
  readonly exists: boolean
  readonly sha256?: string
  readonly byte_length?: number
}

export type BoundaryAudit = {
  readonly status: 'PASS' | 'FAIL'
  readonly protected_unchanged: boolean
  readonly output_dir_allowed: boolean
  readonly protected_paths: readonly string[]
  readonly changed_paths: readonly string[]
  readonly before: readonly BoundarySnapshotEntry[]
  readonly after: readonly BoundarySnapshotEntry[]
}
```

Recommended protected path set for v2.11:

```text
data/taxonomy/taxonomy-seed.v2.json
data/taxonomy/descriptor_aliases.seed.json
data/taxonomy/alias_target_exceptions.v1.json
data/compiled/v2/taxonomy.json
data/compiled/v2/descriptor_aliases.json
data/compiled/v2/similarity_matrix.json
```

Also enforce protected output prefix rejection for `graphify-out/**`; directory hashing is not necessary if the CLI refuses to write there and phase verification runs `git diff --exit-code -- graphify-out`.

The CLI sequence should be:

1. Validate `--out` is not protected.
2. Hash protected paths before reading/writing.
3. Write only read-model files to the allowed output directory.
4. Hash protected paths after writing.
5. Fail if any protected hash changed.
6. Emit/write `boundary_audit.json`.

This gives both runtime proof and testable behavior. It also satisfies the milestone requirement to prove protected files unchanged without relying only on developer discipline.

## Validation Strategy

Validation should be layered and all-or-nothing.

### 1. Source Artifact Validation

Before graph building, call existing validators:

```typescript
validateAllOutputs(taxonomy, aliases, similarity)
```

If source validation fails, return non-zero and write no graph output. This reuses the current compiler schema contract and avoids duplicating compiled artifact validation.

### 2. Graph Structural Validation

`validateOlfactoryGraph(graph)` should reject:

- Missing or wrong `schema_version`.
- Deep `null` values.
- Duplicate node IDs.
- Duplicate edge IDs.
- Edge endpoints not found in `nodes`.
- Alias `resolves_to` edge targets that are not descriptor nodes.
- Similarity `similar_to` endpoints that are not subfamily nodes.
- Self-loop `similar_to` edges unless explicitly allowed later; do not allow in v2.11.
- Stats inconsistent with actual node/edge counts.
- Descriptor node duplicates caused by the same canonical descriptor appearing in multiple subfamilies.

### 3. Domain Invariant Validation

Validate graph-specific invariants that the current compiler validators do not fully cover:

- Every subfamily node has exactly one incoming `contains_subfamily` edge.
- Every descriptor node has exactly one incoming `contains_descriptor` edge.
- Every alias node has exactly one outgoing `resolves_to` edge.
- Every compiled alias target exists as a descriptor node.
- Every similarity edge source/target exists in `taxonomy.json` subfamily IDs.
- Graph stats match live baseline expectations in the live fixture test when using current `data/compiled/v2`: 10 families, 18 subfamilies, 341 descriptors, 18 aliases, 13 similarity edges.

### 4. Query Proof Validation

`validateQueryProofs(graph, proofs)` should ensure query examples are not decorative snapshots:

- Every descriptor listed under a family resolves to a descriptor node connected through that family.
- Every resolved alias proof has an alias node, `resolves_to` edge, and descriptor target.
- Every similarity neighborhood references subfamily nodes and existing `similar_to` edges.
- Every descriptor-to-family path is connected by graph edges.
- Hub rankings are sorted deterministically by degree descending, then ID ascending.

## Query Example Strategy

Add `src/graph_read_model/queries.ts` with pure helpers:

```typescript
listDescriptorsByFamily(graph, familyId)
resolveAlias(graph, alias)
similarityNeighborhood(graph, subfamilyId)
topSimilarityHubs(graph, limit)
descriptorToFamilyPath(graph, descriptorId)
buildQueryProofs(graph)
```

`query_examples.json` should be generated from the graph, not hand-written. Use stable, useful examples from current artifacts, such as:

- descriptors by `floral` or all families summarized with descriptor counts;
- alias resolution for `ylang ylang -> ylang_ylang`;
- similarity neighborhood for `floral_white` or `citrus_fresh`;
- top similarity hubs over all subfamilies;
- descriptor-to-family path for `ylang_ylang`, `rose`, or another existing descriptor.

Prefer compact proofs over exhaustive dumps: enough to prove utility for future agent/RAG work without creating a second official taxonomy artifact.

## CLI and Script Ergonomics

### CLI

Add `src/cli/graph_read_model.ts` with the existing style:

```text
Olfactory Graph Read Model CLI

Usage: npm run graph:read-model -- [options]

Options:
  --taxonomy <path>       Compiled taxonomy JSON (default: data/compiled/v2/taxonomy.json)
  --aliases <path>        Compiled descriptor aliases JSON (default: data/compiled/v2/descriptor_aliases.json)
  --similarity <path>     Compiled similarity matrix JSON (default: data/compiled/v2/similarity_matrix.json)
  --out <dir>             Output directory (default: data/read_models/olfactory_graph/v2)
  --generated-at <iso>    Deterministic UTC timestamp ending in Z; defaults to taxonomy.generated_at
  --json                  Print compact JSON status/proof summary
  --help                  Show help
```

Use a local parser in this file or a new `src/cli/graph_parse_args.ts`; do not overload `parseCompileArgs()` because the compile CLI has different defaults and curation inputs.

### Package Scripts

Add only narrow scripts:

```json
{
  "graph:read-model": "npm run precompile && node dist/cli/graph_read_model.js",
  "verify:graph": "npm run precompile && node dist/cli/graph_read_model.js --out /tmp/v2.11-olfactory-graph --generated-at 2026-06-09T00:00:00.000Z --json"
}
```

Do not wire graph generation into `compile`, `compile:quality`, `test`, or `verify:integrity`. Keep existing alias integrity proof separate and composable.

## Test Strategy

### Unit Tests

| Test File | Assertions |
|-----------|------------|
| `src/tests/graph_read_model/build_graph.test.ts` | Tiny inline fixture builds expected family/subfamily/descriptor/alias nodes and hierarchy/alias/similarity edges; IDs and sorting are deterministic. |
| `src/tests/graph_read_model/validate_graph.test.ts` | Rejects duplicate nodes, duplicate edges, missing endpoints, bad alias target, bad similarity endpoint, descriptor duplicate across subfamilies, and stat mismatch. |
| `src/tests/graph_read_model/queries.test.ts` | Pure query helpers return expected descriptors by family, alias target, similarity neighborhood, top hubs, and descriptor path. |
| `src/tests/graph_read_model/boundary_audit.test.ts` | Hash snapshots detect changes; unchanged protected files pass; protected output prefixes are rejected. |

### CLI Tests

Follow `src/tests/cli/compile.test.ts` and `src/tests/cli/alias_integrity.test.ts` patterns:

- Use `mkdtemp()` fixtures.
- Write tiny compiled artifact fixtures with `writeFile()`.
- Mock/spyon console output only.
- Assert successful run writes exactly `graph.json`, `graph_validation.json`, `query_examples.json`, and `boundary_audit.json`.
- Assert invalid source artifacts return non-zero and write no graph files.
- Assert `--out data/compiled/v2` or `--out graphify-out/...` is rejected before writes.
- Assert `--json` output includes status, graph counts, validation status, and boundary audit status.

### Live Artifact Regression Test

Add one live test against current `data/compiled/v2` artifacts:

- Build graph from live artifacts.
- Validate graph passes.
- Assert current baseline counts: 10 families, 18 subfamilies, 341 descriptors, 18 aliases, 13 similarity edges.
- Assert alias `ylang ylang` resolves to descriptor `ylang_ylang`.
- Assert all 13 similarity edges connect existing subfamily nodes.

This is acceptable because v2.11 explicitly targets the current compiled v2 baseline. If a future milestone intentionally republishes compiled artifacts, it should update this regression in that milestone.

### Determinism Tests

- Build the same graph twice with the same generated timestamp and compare full JSON strings.
- Build query proofs twice and compare full JSON strings.
- Run CLI twice to different temp directories and compare `graph.json` plus `query_examples.json`; exclude `boundary_audit.json` only if it includes output-dir-specific fields.

### Verification Commands

Phase verification should run:

```bash
npm run typecheck
npm test
npm run verify:integrity -- --json
npm run verify:graph
git diff --exit-code -- data/taxonomy data/compiled/v2 graphify-out
```

The last command is the Git-level backstop for the runtime boundary audit.

## Nyquist-Compliant Phase Build Order

Order phases so every layer is validated before the next layer depends on it. Do not build the CLI before the pure graph contract is tested.

1. **Contract and fixture phase**
   - Add `types.ts` and tiny fixture-oriented tests describing node/edge/schema expectations.
   - Verification hooks: typecheck; failing/pending tests prove the expected contract before implementation.
   - Nyquist rationale: sample the schema boundary before amplifying into builder/export code.

2. **Pure builder and validator phase**
   - Implement `build_graph.ts` and `validate_graph.ts` from inline fixtures.
   - Reuse `validateAllOutputs()` at the source boundary.
   - Verification hooks: builder tests, validator tests, determinism test.
   - Avoids: writing files or touching protected data before core invariants pass.

3. **Query proof phase**
   - Implement `queries.ts` and `buildQueryProofs()`.
   - Verification hooks: query tests plus proof validation tests.
   - Nyquist rationale: prove graph usefulness after structural correctness, before export/publication.

4. **CLI, writer, and boundary audit phase**
   - Implement `graph_read_model.ts`, `write_graph_outputs.ts`, and `boundary_audit.ts`.
   - Add `graph:read-model` and `verify:graph` scripts.
   - Verification hooks: CLI temp tests, protected output prefix rejection, boundary hash unchanged proof.
   - Avoids: broad compile CLI refactors and accidental official artifact mutation.

5. **Live artifact proof and documentation phase**
   - Add live compiled v2 regression test and generate/read `query_examples.json` proof.
   - Document future Neo4J export as a mapping from `graph.json` nodes/edges only; do not implement Neo4J.
   - Verification hooks: full `npm test`, `npm run verify:integrity -- --json`, `npm run verify:graph`, and `git diff --exit-code -- data/taxonomy data/compiled/v2 graphify-out`.

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Do Instead |
|--------------|---------|------------|
| Add graph generation to `compileAll()` | Makes normal compile heavier and blurs official artifact boundary. | Standalone read-model CLI after compile. |
| Write graph files under `data/compiled/v2` | Can be mistaken for official compiled taxonomy publication. | Use `data/read_models/olfactory_graph/v2` or `/tmp`. |
| Read `data/enriched_materials.json` | Expands scope and introduces large/gitignored corpus behavior. | Use compiled artifacts only. |
| Create Neo4J/Docker/export dependency now | Violates milestone constraint and adds operational burden. | Keep JSON property graph; document future mapping. |
| Hand-write query examples | Can drift from graph truth. | Generate query proof JSON from pure query helpers. |
| Rely only on “we did not edit protected files” | Not auditable. | Hash protected paths before/after and run Git diff backstop. |

## Future Neo4J Export Boundary

The v2.11 graph contract should be Neo4J-friendly without implementing Neo4J:

- `GraphNode.type` maps to labels like `Family`, `Subfamily`, `Descriptor`, `Alias`.
- `GraphEdge.type` maps to relationship types like `CONTAINS_SUBFAMILY`, `CONTAINS_DESCRIPTOR`, `RESOLVES_TO`, `SIMILAR_TO`.
- `GraphNode.properties` and `GraphEdge.properties` are JSON-serializable property maps.
- `graph.json` is the only input a future exporter should need.

Do not add Cypher generation, Docker, a database driver, migrations, or graph database tests in v2.11.

## Sources Inspected

- `.planning/PROJECT.md` — current v2.11 requirements, protected boundaries, active decisions.
- `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `TESTING.md` — established functional, zero-dependency, Vitest architecture.
- `src/compiler/compile_all.ts` — current all-output compiler boundary.
- `src/compiler/write_outputs.ts` — deterministic/atomic official artifact writer pattern.
- `src/compiler/validate_output.ts` — reusable compiled artifact validation.
- `src/compiler/alias_target_integrity.ts` and `src/cli/alias_integrity.ts` — existing integrity proof model.
- `src/cli/compile.ts`, `src/cli/parse_args.ts` — current CLI ergonomics and defaults.
- `src/tests/cli/compile.test.ts`, `src/tests/cli/alias_integrity.test.ts`, `src/tests/inventory/alias_target_inventory.test.ts` — temp fixture, live fixture, and integrity test patterns.
- `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json` — live baseline shape and counts.
