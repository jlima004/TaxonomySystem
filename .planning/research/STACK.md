# Technology Stack — v2.11 Olfactory Knowledge Graph Read Model

**Project:** Olfactory Taxonomy System  
**Milestone:** v2.11 Olfactory Knowledge Graph Read Model  
**Researched:** 2026-06-08  
**Overall recommendation:** **No new package dependencies. Keep the milestone zero-dependency.**

## Answer

For a deterministic static graph read model/export and query proofs, the existing stack is sufficient: Node.js + ESM TypeScript strict + Vitest + built-in `node:fs/promises`, `node:path`, and optionally `node:crypto` for source-artifact hashing. Do **not** add Neo4J, graph libraries, RDF tooling, CSV tooling, CLI parsers, schema validators, or runtime databases in v2.11.

The needed additions are internal source modules and npm scripts only:

- `src/types/graph.ts` — graph node/edge/export/query-proof types.
- `src/graph/build_graph.ts` — pure artifact-to-read-model builder.
- `src/graph/validate_graph.ts` — endpoint, uniqueness, alias target, and determinism invariants.
- `src/graph/query_proofs.ts` — static proof queries over the exported graph.
- `src/graph/write_graph_outputs.ts` or reuse the existing deterministic writer pattern from `src/compiler/write_outputs.ts`.
- `src/cli/export_graph.ts` and optionally `src/cli/verify_graph.ts` — separate CLIs, not changes to normal compile behavior.
- `src/tests/graph/*` — graph contract, export determinism, protected-boundary, and query-proof tests.

Output should **not** live in `data/compiled/v2/` and should **not** touch `graphify-out/**`. Recommended default output:

```text
data/read-models/olfactory-graph/v2.11/
  graph.json
  query_proofs.json
  manifest.json
  README.md
```

This path makes the artifact clearly derived/read-only instead of an official compiled taxonomy publication. `manifest.json` should explicitly name source artifacts (`data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`), source stats (`341` descriptors, `18` aliases, `13` similarity edges), and a warning such as `artifact_kind: derived_read_model_not_official_compiled_artifact`.

## Repository Evidence

| Evidence | Source | Implication |
|----------|--------|-------------|
| Existing package is private ESM with scripts for build/typecheck/test/compile/integrity only. Runtime dependencies are absent; dev deps are `@types/node`, `typescript`, `vitest`. | `src/package.json` | Add no dependencies. Keep new graph work as first-party TypeScript. |
| Compiler defaults publish official outputs to `data/compiled/v2`. | `src/cli/parse_args.ts` | Graph export must use a different default output path. |
| Normal compile is `node dist/cli/compile.js`; alias integrity is separate (`alias:integrity`, `verify:integrity`) and `compile:quality` is the heavier local guardrail. | `src/package.json` | Preserve normal compile alias-gate-free behavior; add graph scripts separately. |
| Deterministic JSON writer already exists with 2-space `JSON.stringify` + trailing newline and temp-file atomic writes. | `src/compiler/write_outputs.ts` | Reuse this convention for `graph.json` and proofs instead of adding serialization libraries. |
| TypeScript compiler is strict with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`; output target is ES2022. | `src/tsconfig.json` | Graph code should follow existing strict typing, immutable readonly types, and pure functions. |
| Current source artifacts expose enough structure: taxonomy families/subfamilies/descriptors, aliases, sparse similarity edges and review queue. | `src/types/taxonomy.ts`, `src/types/similarity.ts`, compiled JSON | No corpus read or database is required for v2.11. |
| Current baseline is protected: 341 compiled descriptors, 18 aliases, 0 unresolved alias targets; current milestone explicitly forbids official artifact mutation and graph database coupling. | `.planning/PROJECT.md`, `data/compiled/v2/*` | Treat compiled artifacts as read-only inputs and verify they remain unchanged. |

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | Existing CI runtime, documented as Node 24 | Execute CLIs and tests | Already validated by project CI; built-in file/path/crypto APIs are enough. |
| TypeScript | Existing `^5.8.0` | Graph schema, builder, validation, queries | Strict types are already the project contract; no schema package needed for controlled internal JSON inputs. |
| ESM | Existing package module mode | Module system | Matches current source and compiled CLI style. |
| Vitest | Existing `^3.2.0` | Unit, integration, determinism, query-proof tests | Already established; no separate graph testing tool needed. |

### Runtime Dependencies

| Package | Recommendation | Rationale |
|---------|----------------|-----------|
| Neo4J driver | Do not add | v2.11 is static read model/export only; future Neo4J path should be documentation/contract only. |
| Graph libraries (`graphology`, `cytoscape`, `ngraph`, etc.) | Do not add | Required queries are small and deterministic: descriptor lookup, aliases, neighborhoods, hubs, paths. Simple arrays/maps are enough. |
| RDF/JSON-LD tooling | Do not add | This milestone needs a pragmatic JSON read model, not semantic-web publication. |
| CLI parser (`commander`, `yargs`) | Do not add | Existing compile CLI uses manual `process.argv` parsing; graph CLI can follow that convention. |
| Schema validator (`zod`, `ajv`) | Do not add | Inputs are internal compiled artifacts with existing TypeScript types and validation conventions; graph-specific type guards are enough. |
| CSV/Parquet/export packages | Do not add | JSON is the native artifact format in this repo; defer alternate export formats until a consumer requires them. |

### Internal Graph Model

Recommended minimal node kinds:

| Kind | ID convention | Source |
|------|---------------|--------|
| `family` | `family:<family_id>` | `taxonomy.json.families[]` |
| `subfamily` | `subfamily:<subfamily_id>` | `taxonomy.json.families[].subfamilies[]` |
| `descriptor` | `descriptor:<descriptor_id>` | `taxonomy.json...descriptors[]` |
| `alias` | `alias:<normalized_alias>` | `descriptor_aliases.json.aliases` |

Recommended minimal edge kinds:

| Kind | Direction | Source |
|------|-----------|--------|
| `family_contains_subfamily` | family → subfamily | Taxonomy hierarchy |
| `subfamily_has_descriptor` | subfamily → descriptor | Taxonomy hierarchy |
| `alias_resolves_to` | alias → descriptor | Alias map; target must exist as descriptor |
| `subfamily_similar_to` | subfamily ↔ subfamily | `similarity_matrix.json.edges`; store once with canonical sorted endpoint pair or emit two directed edges only if query contract requires it. |

The graph should preserve descriptor properties already present in compiled artifacts: `source`, `frequency`, `status`, `review_required`, and `corpus_derived`. It should not promote candidates, resolve review queue items, or infer new curation truth.

## Determinism Requirements

Use first-party code and tests for determinism:

1. Read only the three compiled v2 artifacts unless a later phase explicitly approves another input.
2. Do not call `Date.now()` or `new Date()` for graph content. Either omit wall-clock timestamps or accept `--generated-at` only for a fixed, testable metadata field. Prefer source artifact timestamps in provenance.
3. Sort all families, subfamilies, descriptors, aliases, nodes, edges, proof result rows, and manifest source lists lexicographically by stable IDs before writing.
4. Serialize with the existing repo convention: `JSON.stringify(payload, null, 2)` plus trailing newline.
5. Write through temp files and atomic rename, matching `writeCompileResults`.
6. If hashes are needed, use built-in `node:crypto`; do not add a hashing dependency.

## Package Script Recommendations

Add graph scripts only if implementation phases need command entry points. Do **not** change `compile`, `precompile`, `compile:quality`, `alias:integrity`, or `verify:integrity` semantics.

Recommended script names:

| Script | Purpose | Notes |
|--------|---------|-------|
| `graph:export` | Build static graph read-model files from compiled v2 artifacts. | Should run `precompile` then a dedicated graph CLI. Must not invoke normal `compile`. |
| `graph:verify` | Validate graph invariants and optionally compare a generated temp export. | Should prove endpoint integrity, duplicate-free IDs, alias targets, deterministic re-export, and protected boundaries. |
| `graph:queries` or `graph:proofs` | Generate query proof artifact from graph export. | Useful for descriptors by family, resolved aliases, similarity neighborhoods, hubs, and descriptor-to-family paths. |

Keep these separate from `compile:quality`. If later desired, CI may run graph scripts after existing integrity checks, but normal compile must remain alias-gate-free and graph-free.

## Verification Commands to Preserve

These commands should remain part of local/CI verification for v2.11 work:

```bash
npm run typecheck
npm run test
npm run alias:integrity -- --json
npm run verify:integrity -- --json
npm run compile:quality
```

Recommended additional graph-specific verification, once scripts exist:

```bash
npm run graph:export -- --out data/read-models/olfactory-graph/v2.11
npm run graph:verify -- --graph data/read-models/olfactory-graph/v2.11/graph.json
npm run graph:queries -- --graph data/read-models/olfactory-graph/v2.11/graph.json --out data/read-models/olfactory-graph/v2.11/query_proofs.json
```

Protected-boundary tests should also verify that these paths are unchanged after graph export:

```text
data/taxonomy/taxonomy-seed.v2.json
data/taxonomy/descriptor_aliases.seed.json
data/taxonomy/alias_target_exceptions.v1.json
data/compiled/v2/taxonomy.json
data/compiled/v2/descriptor_aliases.json
data/compiled/v2/similarity_matrix.json
graphify-out/**
```

## Output Location Decision

**Use:** `data/read-models/olfactory-graph/v2.11/`

**Do not use:**

- `data/compiled/v2/` — official taxonomy artifacts live here; adding graph outputs here creates publication ambiguity.
- `graphify-out/**` — protected and semantically reserved for Graphify output, not this read model.
- `/tmp` as the only output — good for tests and dry-runs, but not enough for a versioned milestone deliverable.
- `.planning/` as the graph artifact location — planning files are for research/plans, not product data artifacts.

The read-model directory should contain a README or manifest field making the status explicit: derived, read-only, experimental/static, generated from existing compiled artifacts, and not an official compiled taxonomy publication.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Graph storage | Static JSON arrays | Neo4J | Future runtime concern; adds database, Docker or driver complexity outside scope. |
| Graph processing | First-party maps/arrays | `graphology`/similar | Overkill for 341 descriptors, 18 subfamilies, 18 aliases, 13 similarity edges. |
| Validation | Type guards + invariant functions | Zod/AJV | Existing repo favors first-party validation and zero runtime dependencies. |
| CLI parsing | Existing manual style | Commander/Yargs | Graph flags are simple; no dependency justified. |
| Export format | JSON | RDF/JSON-LD/CSV | JSON matches official artifact style and is enough for query proofs. |
| Output location | `data/read-models/olfactory-graph/v2.11/` | `data/compiled/v2/graph.json` | Avoids confusing derived graph output with official compiled artifacts. |

## Sources and Confidence

| Finding | Confidence | Basis |
|---------|------------|-------|
| No new dependencies needed | HIGH | Direct `src/package.json` inspection; small graph size in compiled artifacts; project zero-dependency decision in `.planning/PROJECT.md`. |
| Preserve normal compile alias-gate-free | HIGH | Existing scripts separate `compile`, `alias:integrity`, `verify:integrity`, and `compile:quality`; v2.10/v2.11 project notes explicitly protect this. |
| Output must avoid `data/compiled/v2` | HIGH | `parse_args.ts` defines `data/compiled/v2` as compiler output; milestone context marks compiled v2 files protected and not to be republished. |
| Static JSON read model is sufficient for v2.11 | HIGH | Current artifacts already provide hierarchy, aliases, and sparse similarity edges; milestone explicitly excludes Neo4J/runtime infrastructure. |
| Future Neo4J path should remain documentation-only | HIGH | `.planning/PROJECT.md` active requirement GKG-05 says future Neo4J/export path while keeping this milestone database-free and zero-heavy-dependency. |
