---
phase: 06-compilation-cli
reviewed: 2026-05-21T00:00:00Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - src/compiler/index.ts
  - src/compiler/types.ts
  - src/compiler/validate_output.ts
  - src/compiler/compile_taxonomy.ts
  - src/compiler/compile_aliases.ts
  - src/compiler/compile_all.ts
  - src/compiler/write_outputs.ts
  - src/cli/compile.ts
  - src/cli/index.ts
  - src/cli/parse_args.ts
  - src/types/taxonomy.ts
  - src/tests/compiler/validate_output.test.ts
  - src/tests/compiler/compile_taxonomy.test.ts
  - src/tests/compiler/compile_aliases.test.ts
  - src/tests/compiler/compile_all.test.ts
  - src/tests/cli/parse_args.test.ts
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
resolved_findings:
  critical: 1
  warning: 2
  info: 0
  total: 3
fix_report: .planning/phases/06-compilation-cli/06-REVIEW-FIX.md
status: clean
---

# Phase 06: Code Review Report

**Reviewed:** 2026-05-21T00:00:00Z  
**Depth:** standard  
**Files Reviewed:** 16  
**Status:** clean after fixes

## Summary

Reviewed the Phase 06 compiler, CLI, shared output types, and compiler/CLI tests against the phase plans. The review found three issues, all fixed in `fd64bb8` and documented in `06-REVIEW-FIX.md`. The gate status is clean after fixes.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Similarity validator accepts malformed edges and missing required review queue

**File:** `src/compiler/validate_output.ts:402-420`  
**Issue:** `validateSimilarityGraph()` only validates `edge.dimensions` when it is present and object-like, and only rejects `review_queue` when it is present but not an array. Both fields are required by `SimilarityGraph` (`dimensions` on each edge and top-level `review_queue`) and by the Phase 06 plan. As written, `{ edge: { source, target, score } }` and a graph with no `review_queue` can validate successfully, allowing invalid `similarity_matrix.json` to be written despite the all-or-nothing validation gate. Dimension values that are non-numeric strings also pass because only numeric values are range-checked.

**Fix:** Require the fields and reject non-numeric dimension values, with tests for missing `review_queue`, missing `edge.dimensions`, non-object dimensions, and non-number dimension scores.

```ts
if (!eObj['dimensions'] || typeof eObj['dimensions'] !== 'object' || Array.isArray(eObj['dimensions'])) {
  errors.push(makeCompilerError(A, 'MISSING_FIELD', `${ep}.dimensions`, 'edge dimensions must be an object'))
} else {
  const dims = eObj['dimensions'] as Record<string, unknown>
  for (const dimId of Object.keys(dims)) {
    const dv = dims[dimId]
    if (typeof dv !== 'number' || Number.isNaN(dv)) {
      errors.push(makeCompilerError(A, 'INVALID_TYPE', `${ep}.dimensions.${dimId}`, 'dimension score must be a number'))
    } else if (dv < 0 || dv > 1) {
      errors.push(makeCompilerError(A, 'INVALID_VALUE', `${ep}.dimensions.${dimId}`, `dimension score must be in [0, 1], got ${dv}`))
    }
  }
}

if (!Array.isArray(obj['review_queue'])) {
  errors.push(makeCompilerError(A, 'INVALID_TYPE', '$.review_queue', 'review_queue must be an array'))
}
```

## Warnings

### WR-01: Null-path reporting is not valid JSONPath for alias/object keys that need quoting

**File:** `src/compiler/types.ts:80-88`; `src/tests/compiler/validate_output.test.ts:248-253`  
**Issue:** `findNullsDeep()` always appends object keys with dot notation, so an alias like `{ "orange flower": null }` reports `$.aliases.orange flower` instead of the plan-required `$.aliases["orange flower"]`. The test currently codifies the looser `$.aliases.key` behavior even though Phase 06 explicitly requires bracket notation for alias keys. This makes structured errors ambiguous or invalid for real alias keys containing spaces, punctuation, or dots.

**Fix:** Escape object keys that are not simple identifiers, or always use bracket notation below `aliases`, and update the test expectation to the planned path format.

### WR-02: CLI entrypoint behavior is untested beyond argument parsing

**File:** `src/cli/compile.ts:80-127`; `src/tests/cli/parse_args.test.ts:4-57`  
**Issue:** The tests cover `parseCompileArgs()` but not the actual compiled CLI path-resolution and I/O path in `compile.ts`: fallback from `data/...` to `../data/...`, loading relations/accord/noise JSON, validation-failure exit behavior, and successful writes via `writeCompileResults()`. A regression in the default path compatibility fix or in CLI wiring would not be caught by the current CLI test suite.

**Fix:** Add a CLI integration test that runs the built entrypoint (or a testable exported `main(argv, env)` wrapper) against temp fixture files, asserting success writes all three outputs, validation failure exits non-zero without writes, and default-path resolution is covered.

---

_Reviewed: 2026-05-21T00:00:00Z_  
_Reviewer: the agent (gsd-code-reviewer)_  
_Depth: standard_
