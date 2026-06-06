---
status: complete
phase: 51-legacy-alias-remediation
source: 51-01-SUMMARY.md
started: 2026-06-06T01:20:00Z
updated: 2026-06-06T01:31:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Alias Integrity Gate PASS
expected: Run `npm --prefix src run alias:integrity`. Command exits 0. Output shows `Alias target integrity: PASS` with 18 seed aliases, 341 compiled descriptors, 18 valid targets, and 0 unresolved targets.
result: pass

### 2. Alias Integrity JSON Output
expected: Run `npm --prefix src run alias:integrity -- --json`. Command exits 0. JSON output includes `status: "PASS"`, `seed_alias_count: 18`, `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`, and an empty `unresolved` array.
result: pass

### 3. Seed Descriptor ylang_ylang
expected: In `data/taxonomy/taxonomy-seed.v2.json`, `ylang_ylang` appears under `floral/floral_white.descriptors`, appended after `linden_flower`. In `data/compiled/v2/taxonomy.json`, `ylang_ylang` exists under `floral_white` with `source: "seed"` and `status: "curated"`.
result: pass

### 4. Alias Map Preserved
expected: `data/taxonomy/descriptor_aliases.seed.json` still has exactly 18 alias entries including `"ylang ylang": "ylang_ylang"`. No alias was remapped, dropped, or excepted.
result: pass

### 5. v2.9.0 Compiled Artifacts
expected: `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json` all report version `2.9.0`. Taxonomy contains 341 descriptors. `ylang` remains a separate corpus candidate distinct from curated seed `ylang_ylang`.
result: pass

### 6. Full Test Suite Green
expected: Run `npm --prefix src test`. All tests pass (56 test files, 389 tests). Live-data alias integrity and inventory tests reflect the resolved 341/18/0 state.
result: pass

### 7. Protected Boundaries Unchanged
expected: `data/taxonomy/alias_target_exceptions.v1.json` has empty `exceptions` array. `src/cli/parse_args.ts` keeps `DEFAULT_PATHS.version` at `2.1.0`. `data/compiled/v1/*` and `data/taxonomy/taxonomy-seed.v1.json` are untouched.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
