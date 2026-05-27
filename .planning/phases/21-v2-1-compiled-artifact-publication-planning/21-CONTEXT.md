# Phase 21: v2.1 Compiled Artifact Publication Planning - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning / no official refresh executed

<domain>
## Phase Boundary

Phase 21 plans the safe publication path for compiled v2.1 artifacts after Phase 20 added `petitgrain` to `taxonomy-seed.v2.json`. The phase starts with validation-only compilation to `/tmp`; official `data/compiled/v2` publication is allowed only in a later gated plan if the temporary compile passes.

Context gathering does not authorize an official artifact refresh, default compile, curation, relation/accord edits, Graphify changes, or any mutation to `data/compiled/v2`.

</domain>

<decisions>
## Implementation Decisions

### Initial Publication Route
- **PUB21-D-01:** Select option 2 first: run only a future explicit compile to `/tmp` to validate outputs, with no official publication and no mutation to `data/compiled/v2`.
- **PUB21-D-02:** Plan option 1 only after the `/tmp` compile passes: official publication to `data/compiled/v2` requires a separate approval artifact, allowlist, gates, and rollback plan.
- **PUB21-D-03:** Option 3 remains the fallback: if `/tmp` validation fails or produces unexpected diffs/quality results, defer publication and keep compiled v2 stale rather than refreshing official artifacts.

### Versioning
- **PUB21-D-04:** Treat the compiled artifact release as `2.1.0`; the path remains `data/compiled/v2` because this is a v2 artifact line, not a new major artifact directory.
- **PUB21-D-05:** The future official publication plan must decide and document whether `src/cli/parse_args.ts` default `version` moves from `2.0.0` to `2.1.0`. The recommended path is to update the default version only inside the gated publication plan, not during tmp validation.
- **PUB21-D-06:** The release timestamp must be fixed and recorded in the approval artifact before official publication; no official compile should use an implicit ad-hoc `new Date()` timestamp.

### Safety Boundaries
- **PUB21-D-07:** No further curation is in scope. `petitgrain` is the only upstream seed change being materialized; `ylang ylang -> ylang_ylang` remains `accepted_exception_interim`.
- **PUB21-D-08:** `data/compiled/v1`, `data/inference`, `data/taxonomy/descriptor_aliases.seed.json`, `scripts/check-safety-guards.sh`, `src/package.json`, and `graphify-out/*` remain protected from Phase 21 publication work unless explicitly listed in a future approved plan. No Graphify mutation is allowed.
- **PUB21-D-09:** Future compile commands must use explicit `--seed`, `--aliases`, `--corpus`, `--relations`, `--accords`, `--noise`, `--out`, `--version`, and `--generated-at` arguments. Do not use bare `npm run compile` for publication gates.

### the agent's Discretion
- Choose the exact structure of validation and publication reports, as long as they capture command, timestamp, metrics, quality status, diff audit, rollback notes, and PASS/FAIL clearly.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 20 Baseline
- `.planning/phases/20-alias-target-microcuration-execution/20-CLOSURE.md` — Confirms `petitgrain` was added to seed v2 and no official compiled artifact refresh was executed.
- `.planning/phases/20-alias-target-microcuration-execution/20-01-SUMMARY.md` — Records the approved seed mutation, rollback exercise, and no-publication boundary.
- `.planning/phases/20-alias-target-microcuration-execution/20-02-SUMMARY.md` — Records approval traceability fix and targeted tests after microcuration.
- `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md` — Persisted approval for the upstream `petitgrain` add_target only.

### Compile Implementation
- `src/cli/compile.ts` — CLI entry point; supports explicit paths, `--out`, `--version`, `--generated-at`, and `--quality-report`; writes through `writeCompileResults`.
- `src/cli/parse_args.ts` — Current defaults point to v2 inputs, `data/compiled/v2`, and version `2.0.0`.
- `src/compiler/compile_all.ts` — Runs taxonomy, alias, similarity, schema validation, and artifact quality gates before write.
- `src/compiler/write_outputs.ts` — Writes three official artifacts atomically via temp files and refuses invalid compile results.
- `src/compiler/quality_gates.ts` — Enforces artifact quality gates and exposes hard errors vs warnings.
- `src/package.json` — Provides `build`, `typecheck`, `compile`, `compile:quality`, `safety:guard`, and `test` scripts.

### Artifact Inputs And Outputs
- `data/taxonomy/taxonomy-seed.v2.json` — Contains the Phase 20 `petitgrain` seed mutation; source input for v2.1 compile validation.
- `data/taxonomy/descriptor_aliases.seed.json` — Must remain unchanged by Phase 21 publication.
- `data/inference/curated_relations.v2.json` — v2 graph input; not edited in Phase 21.
- `data/inference/accord_map.v2.json` — v2 accord input; not edited in Phase 21.
- `data/inference/semantic_noise.v1.json` — Shared semantic noise input for the compile.
- `data/compiled/v2/taxonomy.json` — Official compiled artifact, stale until gated publication.
- `data/compiled/v2/descriptor_aliases.json` — Official compiled artifact, stale until gated publication.
- `data/compiled/v2/similarity_matrix.json` — Official compiled artifact, stale until gated publication.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `runCompileCli` in `src/cli/compile.ts`: supports explicit safe output to `/tmp` and official output to `data/compiled/v2` when gated.
- `writeCompileResults` in `src/compiler/write_outputs.ts`: atomic temp-file writes and invalid-output refusal are already implemented.
- `runArtifactQualityGates` in `src/compiler/quality_gates.ts`: existing hard/soft quality gate split should be used as the publication gate basis.
- `scripts/check-safety-guards.sh` through `npm run safety:guard`: detects protected staged/dirty paths; useful before official publication and after rollback/no-protected-diff states.

### Established Patterns
- Planning first, then explicit approval before protected data/artifact mutation.
- Compile validation may write to `/tmp`; official `data/compiled/v2` publication requires a separate plan and approval.
- Corpus candidates are not promoted automatically; Phase 21 only materializes the already-approved Phase 20 seed truth.
- The codebase uses pure TypeScript functions, ESM modules, strict typing, and zero runtime dependencies.

### Integration Points
- Future tmp validation should run from `src` after `npm run build`, invoking `node dist/cli/compile.js` with explicit input paths and `--out /tmp/taxonomy-phase21-v2-1-compile`.
- Future official publication should run only after `21-TMP-COMPILE-VALIDATION.md` records PASS and `21-FINAL-APPROVAL.md` exists.

</code_context>

<specifics>
## Specific Ideas

- User supplied the preferred initial route: option 2 first, then option 1 only if the `/tmp` compile passes.
- Publication target remains the official v2 artifact directory: `data/compiled/v2`.
- The planned artifact version is `2.1.0`.

</specifics>

<deferred>
## Deferred Ideas

- Any `ylang_ylang` add_target or additional alias cleanup.
- Any relation/accord quality changes.
- Any Graphify cleanup, rebuild, or publication.
- Any CI/hook integration for publication gates.

</deferred>

---

*Phase: 21-v2-1-compiled-artifact-publication-planning*
*Context gathered: 2026-05-26*
