# Phase 6: Compilation & CLI - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Compile the existing taxonomy seed, corpus analysis outputs, and inference outputs into the final v1 JSON artifact set that downstream intelligence layers can consume. This phase delivers exactly three generated artifacts by default: `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`, plus an executable CLI entry point to produce them. It also validates the generated payloads against strict schemas before writing them.

Phase 6 does not add runtime APIs, visual reports, curation workflows, or automatic promotion of corpus-derived suggestions into curated truth. It materializes the Layer 1 taxonomy builder output using the decisions and contracts established by prior phases.

</domain>

<decisions>
## Implementation Decisions

### Artifact Boundary
- **COMP-D-01:** `taxonomy.json` is a hybrid compiled hierarchy. It includes curated seed descriptors and corpus/inferred descriptors when available, but every descriptor must remain explicitly marked with source/status metadata so corpus-derived items are never silently promoted to curated truth.
- **COMP-D-02:** The manual seed remains the source of curated truth. Corpus/inferred descriptors can be materialized as non-curated entries only; they must not overwrite seed descriptors, seed hierarchy, or canonical curated decisions.
- **COMP-D-03:** `similarity_matrix.json` includes sparse edges with `final_score`, dimension scores, compact evidence, and `review_queue`. Existing `SimilarityGraph` support for `evidence` and `review_queue` should be preserved in the public artifact.
- **COMP-D-04:** `descriptor_aliases.json` is an authoritative alias map only. Weak alias candidates from analysis or inference must not be promoted into the alias map automatically.
- **COMP-D-05:** Phase 6 emits exactly the three required artifacts by default: `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`. Do not add review/diagnostic sidecar files in v1; review data must either fit the approved artifact contracts or remain internal.

### CLI Contract
- **COMP-D-06:** The CLI uses conventional project paths by default and supports overrides for input and output paths. Defaults should cover seed, corpus/analysis, curated inference inputs, and output directory.
- **COMP-D-07:** The primary user-facing entry point is an npm script, e.g. `npm run compile`, rather than a global binary or direct `node` file invocation.
- **COMP-D-08:** If the three generated output files already exist, the CLI overwrites those known generated files deterministically. It should not create timestamped output directories by default.
- **COMP-D-09:** Successful CLI output should be concise: generated file paths, key counts/stats, warning count, and validation status. Detailed content remains in the JSON artifacts.

### Validation Behavior
- **COMP-D-10:** Validation is all-or-nothing. The compiler builds all three payloads and validates them before writing; if any artifact fails validation, write nothing and exit non-zero.
- **COMP-D-11:** Output schemas are strict: no `undefined`, and no `null` unless a schema explicitly allows it. Optional fields are omitted rather than serialized as `null`.
- **COMP-D-12:** Validation errors should be structured with artifact name, JSON path, error code, and message. The CLI prints a concise grouped summary.
- **COMP-D-13:** Warnings and review signals do not fail schema validation. Low-confidence evidence, review queue items, and curation suggestions are non-fatal as long as the artifact schemas are valid.

### Versioning & Determinism
- **COMP-D-14:** The `version` field represents the shared taxonomy release version across all three artifacts, so the files are consumed as one coherent compiled set.
- **COMP-D-15:** `generated_at` is explicit/injectable. Tests and reproducible runs can fix it; the CLI may pass current UTC when desired.
- **COMP-D-16:** JSON output must be fully deterministic: stable sorting for families, subfamilies, descriptors, aliases, edges, review items, and any nested arrays where order could otherwise vary. Output should be pretty-printed with a trailing newline.
- **COMP-D-17:** The default output directory is `data/compiled/v1`, keeping generated v1 artifacts separate from seeds, analysis inputs, and inference input data.

### Agent's Discretion
- Exact CLI flag names and internal argument parser shape, provided they preserve defaults plus overrides and zero runtime dependencies.
- Exact compiler module/file organization, provided it follows existing functional, ESM, strict TypeScript patterns.
- Exact schema validator helper names and error code taxonomy, provided errors include artifact, JSON path, code, and message.
- Exact implementation of atomic writes/temp files, provided the all-or-nothing validation contract is preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Requirements
- `.planning/ROADMAP.md` section `Phase 6: Compilation & CLI` - goal, dependencies, success criteria, and planned split: schema validation, JSON generators, and CLI.
- `.planning/REQUIREMENTS.md` section `Compilation & Output` - COMP-01 through COMP-04: `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`, and schema validation.
- `.planning/PROJECT.md` sections `Active`, `Out of Scope`, `Constraints`, and `Key Decisions` - builder-first scope, three compiled outputs, zero runtime dependencies, pure functional architecture, sparse similarity graph, and no runtime APIs.

### Prior Phase Decisions
- `.planning/phases/05-inference-engine/05-CONTEXT.md` - seed authority, corpus/inferred candidate boundaries, similarity dimensions, review queue, compact evidence, sparse graph threshold, and explicit hand-off that Phase 6 decides final public artifact boundary.
- `.planning/phases/04-corpus-analysis/04-CONTEXT.md` - frequency/co-occurrence/alias candidate contracts; alias candidates are suggestions only and never automatic merges.
- `.planning/phases/03-normalization-pipeline/03-CONTEXT.md` - descriptor normalization contracts: idempotency, canonical charset, empty output handling, and canonical pipeline order.

### Existing Types & Inputs
- `src/types/taxonomy.ts` - existing `CompiledTaxonomy`, `TaxonomyFamily`, `TaxonomySubfamily`, `CanonicalDescriptor`, and `DescriptorAliasMap` output types.
- `src/types/similarity.ts` - existing `SimilarityGraph`, `SimilarityEdge`, compact `evidence`, `review_queue`, dimensions, stats, and threshold shape.
- `src/types/alias.ts` - existing alias seed/map type reference.
- `src/types/analysis.ts` - corpus analysis output types consumed by inference and compilation.
- `src/types/inference.ts` - inference evidence/review types used by similarity graph construction.
- `src/types/seed.ts` - manual taxonomy seed shape and curated hierarchy input.

### Existing Code Assets
- `src/inference/build_similarity_graph.ts` - current sparse graph builder, deterministic edge sorting, evidence creation, review queue creation, default threshold, and injectable `generatedAt` precedent.
- `src/inference/index.ts` - inference module barrel exports available to the compiler.
- `src/analyzer/analyze_corpus.ts` - top-level corpus analysis API feeding frequency, co-occurrence, and alias candidates.
- `src/analyzer/export.ts` - deterministic JSON writer pattern for generated analysis artifacts, including directory creation and pretty JSON with trailing newline.
- `src/loader/seed_loader.ts` - parameterized seed loader.
- `src/loader/alias_loader.ts` - parameterized curated alias loader.
- `src/loader/corpus_loader.ts` - parameterized corpus loader for the raw dataset.
- `src/package.json` - current npm scripts and package constraints; Phase 6 adds the primary compile script here.

### Data Files
- `data/taxonomy/taxonomy-seed.v1.json` - curated seed hierarchy input.
- `data/taxonomy/descriptor_aliases.seed.json` - curated alias input; compiled alias map must not auto-merge weak candidates.
- `data/enriched_materials.json` - raw corpus input, large and gitignored; compiler should access it through existing loader/analysis APIs or generated analysis data, not hardcoded assumptions.
- `data/compiled/v1` - default output directory for the three compiled v1 artifacts.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/taxonomy.ts` already models the public `taxonomy.json` and `descriptor_aliases.json` shapes, including `CanonicalDescriptor.source` with `seed | corpus | inferred`.
- `src/types/similarity.ts` already models `similarity_matrix.json` as a sparse graph with dimensions, evidence, stats, and `review_queue`.
- `src/inference/build_similarity_graph.ts` already builds deterministic sparse graph output and accepts injectable `generatedAt`, which matches the Phase 6 determinism decision.
- `src/analyzer/export.ts` provides a precedent for deterministic JSON writing with `JSON.stringify(payload, null, 2)` plus trailing newline and recursive directory creation.
- Existing loaders are parameterized by path, supporting the CLI default-plus-overrides decision.

### Established Patterns
- ESM modules, strict TypeScript, zero runtime dependencies.
- Pure functional core: functions receive explicit inputs and return deterministic outputs; filesystem I/O belongs at CLI/export boundaries.
- Type-only imports, `type` aliases, readonly structures, snake_case file names, camelCase functions, PascalCase types, UPPER_SNAKE_CASE constants.
- Tests are organized by concern under `src/tests/<concern>/`.
- Deterministic sorting is already expected for generated artifacts and tests.
- Missing optional inference dimensions remain neutral/undefined and must not serialize as null.

### Integration Points
- Add compiler/generator code under `src/compiler/` or equivalent, with a barrel export if public functions are exposed.
- Add CLI entry code under a clear CLI path, wired through `src/package.json` as the primary npm script.
- Compiler consumes seed, alias seed, analysis outputs, and inference graph builder outputs rather than duplicating Phase 2-5 logic.
- Validator functions should return structured validation results compatible with CLI grouped reporting and all-or-nothing writes.
- Default output directory is `data/compiled/v1`, but CLI path overrides must allow alternate output directories for tests and reproducible runs.

### Gotchas
- The current seed is intentionally small, while the v1 taxonomy target is much larger. `taxonomy.json` may need corpus/inferred descriptors to satisfy the hybrid taxonomy goal without promoting them to curated seed truth.
- Alias candidates from analysis are weak evidence only. Accidentally merging them into `descriptor_aliases.json` violates prior phase decisions.
- `generated_at` must be injectable to avoid noisy diffs in tests and reproducible builds.
- All-or-nothing validation means filesystem writes must happen after all payloads validate, or use a safe temp/rename strategy that preserves the same user-visible guarantee.

</code_context>

<specifics>
## Specific Ideas

- Official run style should be an npm script such as `npm run compile -- --out data/compiled/v1`, with default paths available when flags are omitted.
- `taxonomy.json` should preserve the distinction between `source: 'seed'`, `source: 'corpus'`, and `source: 'inferred'`.
- `descriptor_aliases.json` should remain an authoritative map, not a candidate-review document.
- `similarity_matrix.json` should keep compact evidence and `review_queue` because that review data was explicitly approved as part of the public artifact contract.
- CLI success output should be summary-level: files written, counts/stats, warning count, validation passed.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 6-Compilation & CLI*
*Context gathered: 2026-05-19*
