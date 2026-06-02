# Phase 43 Research: Taxonomy v2.7 Artifact Publication

## Domain Summary

Phase 43 is the artifact publication and closure phase for the v2.7 low-support triage milestone. Phase 42 added 6 approved seed descriptors but intentionally did **not** compile official artifacts. Phase 43 owns:
1. Compiling official v2.7 artifacts to `data/compiled/v2/`
2. Validating taxonomy invariants (strict — fail on any error)
3. Producing a formal v2.7 closure report with dynamically measured metrics

## Current State (Pre-Phase 43)

### Seed Inputs (post-Phase 42)
- **Families:** 10
- **Subfamilies:** 18
- **Seed descriptors:** 49 (43 baseline + 6 Phase 42 additions)
- **Phase 42 additions:** peppermint, rosemary, cumin, spearmint, caraway, opoponax

### Published Artifacts (stale — still v2.1.0)
- `data/compiled/v2/taxonomy.json` — version 2.1.0, 308 descriptors, generated 2026-05-29
- `data/compiled/v2/descriptor_aliases.json` — 18 mappings
- `data/compiled/v2/similarity_matrix.json` — 13 edges, review_queue: 283 items (275 low_support + 8 conflict)

### Dry-Run Compilation Results (v2.7.0 to /tmp)
Compilation PASS with:
- **Descriptors:** 324 (up from 308)
- **Aliases:** 18 (unchanged)
- **Edges:** 13 (unchanged)
- **Review queue:** 269 items (259 low_support + 10 seed_corpus_conflict)
- **Validation:** ok
- **Quality gate:** PASS
- **Quality warnings:** 2

### Key Metric Deltas (v2.1.0 → v2.7.0)
| Metric | Before (v2.1.0) | After (v2.7.0) | Delta |
|--------|-----------------|-----------------|-------|
| Seed descriptors | 43 | 49 | +6 |
| Compiled descriptors | 308 | 324 | +16 |
| Review queue total | 283 | 269 | -14 |
| low_support count | 275 | 259 | -16 |
| seed_corpus_conflict | 8 | 10 | +2 |
| Aliases | 18 | 18 | 0 |
| Graph edges | 13 | 13 | 0 |

Note: compiled descriptors increase by 16 (not just 6) because the 6 new seed descriptors also promoted corpus candidates that were previously in `low_support` to official status. The 2 new `seed_corpus_conflict` entries arise from the new descriptors matching existing corpus items with different categorization.

## Compilation Pipeline

### CLI Entry Point
`src/cli/compile.ts` → `runCompileCli()`

### Key Commands
- **Build:** `cd src && npm run build` (TypeScript → dist/)
- **Compile:** `cd src && npm run compile -- [--version X.Y.Z] [--out dir] [--quality-report]`
- **Default output:** `data/compiled/v2/` (resolved to `../data/compiled/v2/` when run from `src/`)
- **Default version:** `2.1.0` (hardcoded in `parse_args.ts:25`)

### Compile Flow
1. Load inputs: seed, aliases, corpus, relations, accords, noise, stopwords
2. Analyze corpus
3. `compileAll()` — produces taxonomy, aliases, similarity matrix + validation
4. If `!result.ok` → print validation errors and exit 1 (strict)
5. `writeCompileResults()` — atomic write with temp files → rename
6. Outputs: `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`

### Validation Behavior
- `compileAll()` returns `result.ok = false` if any schema validation error exists
- `writeCompileResults()` throws `CompileWriteError` if `result.ok` is false
- No "soft warning" path — compilation either fully succeeds or fails

### Version Pinning
The `DEFAULT_PATHS.version` is currently `2.1.0`. Phase 43 must pass `--version 2.7.0` explicitly to the CLI. The default in `parse_args.ts` should NOT be changed (that would affect all future compilations).

## Closure Report Requirements (from CONTEXT.md)

The closure report `v2.7-closure-report.md` must include:
1. **Starting State:** v2.6 baseline (43 curated, 275 low_support, 8 conflict)
2. **Triage Batch Details:** 30 selected candidates from Phase 40
3. **Decision Matrix Summary:** from Phase 41 (6 promote_to_seed, 4 reject, 19 defer, 1 needs_external_reference)
4. **Final Metrics:** dynamically measured from compiler output (NOT hardcoded)

Source artifacts for the report:
- `.planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md`
- `.planning/phases/41-low-support-batch-decision-matrix/41-DECISION-MATRIX.md`
- `.planning/phases/42-low-support-microcuration-execution/42-SUMMARY.md`
- Compiler output (runtime metrics)

## Existing Test Coverage

### Curation Tests
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Phase 42 traceability, approved paths
- `src/tests/curation/review_dispositions.test.ts` — disposition validation
- `src/tests/curation/alias_seed_v2.test.ts` — alias seed invariants
- `src/tests/curation/relation_accord_v2.test.ts` — relation/accord invariants
- `src/tests/curation/v1_v2_comparison.test.ts` — v1/v2 side-by-side

### Safety Guard
- `scripts/check-safety-guards.sh` — validates no staged graphify-out, no protected path staging, no protected diff boundary violations

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Compilation fails on validation | LOW (dry-run passed) | Strict error → exit 1 per CONTEXT.md policy |
| Metrics hardcoded instead of measured | MEDIUM | Plan must extract from compiler stdout, not constants |
| Overwrite v2 artifacts without validation | HIGH | Compile to /tmp first, validate, then compile to official path |
| DEFAULT_PATHS.version changed | HIGH | Do NOT modify parse_args.ts — use --version flag only |
| graphify-out dirty files | LOW | accepted_with_policy — not Phase 43 scope |

## Package Legitimacy Audit

No new packages are required. Phase 43 uses only existing project tooling:
- `npm run build` (tsc)
- `npm run compile` (node dist/cli/compile.js)
- `npm run test` (vitest)
- `npm run safety:guard` (bash script)

## RESEARCH COMPLETE

Phase 43 is a well-bounded artifact publication phase. The dry-run confirms compilation succeeds with PASS. The plan should:
1. Compile to /tmp first for validation evidence
2. Compile to official `data/compiled/v2/` with `--version 2.7.0`
3. Run existing tests to confirm invariants
4. Generate the closure report from compiler output + prior phase artifacts
