---
phase: 56-pure-builder-structural-validation
reviewed: 2026-06-09T22:45:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - src/graph_read_model/types.ts
  - src/graph_read_model/build_graph.ts
  - src/graph_read_model/validate_graph.ts
  - src/tests/graph_read_model/build_graph.test.ts
  - src/tests/graph_read_model/validate_graph.test.ts
  - src/tests/graph_read_model/live_artifact_baseline.test.ts
findings:
  critical: 1
  warning: 5
  info: 2
  total: 8
status: issues_found
---

# Phase 56: Code Review Report

**Reviewed:** 2026-06-09T22:45:00Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Phase 56 delivers a coherent pure builder and structural validator aligned with the Phase 55 contract. Production modules are fs-free, deterministic sorting is implemented and tested, and the live v2 baseline regression passes (14/14 tests). The implementation is sound for graphs emitted by `buildOlfactoryGraph` on sanctioned artifacts.

The primary defect is in `validateOlfactoryGraph`: an unknown `edge.kind` causes a runtime `TypeError` instead of a structured validation result, violating the phase's no-throw contract for structural failures. Several secondary gaps involve redundant error emission, contract drift on stats error codes, and validator scope that does not enforce baseline counts or `schema_version`.

## Critical Issues

### CR-01: Validator throws on unknown edge kind

**File:** `src/graph_read_model/validate_graph.ts:122-125`
**Issue:** `validateWrongEndpointKinds` indexes `GRAPH_EDGE_ENDPOINT_KINDS[edge.kind]` without a guard. When `edge.kind` is not one of the four contract kinds (e.g. deserialized JSON, hand-crafted test graphs, or future contract extension drift), `expectedKinds` is `undefined` and accessing `expectedKinds.source` throws a `TypeError`. This breaks the documented `{ ok, errors, warnings }` contract that structural failures must not throw (56-02-SUMMARY).
**Fix:**
```typescript
const expectedKinds = GRAPH_EDGE_ENDPOINT_KINDS[edge.kind as keyof typeof GRAPH_EDGE_ENDPOINT_KINDS]
if (!expectedKinds) {
  errors.push(
    makeGraphError(
      'wrong_endpoint_kinds',
      `${path}.kind`,
      `unknown edge kind: ${edge.kind}`,
      { edge_id: edge.id },
    ),
  )
  return
}
```

## Warnings

### WR-01: Overlapping errors for single structural faults

**File:** `src/graph_read_model/validate_graph.ts:79-216`
**Issue:** Several invariant passes emit duplicate errors for the same underlying defect. Examples: a `resolves_to` edge with a missing target triggers both `missing_edge_endpoints` and `invalid_alias_targets`; a `similar_to` edge with a missing subfamily triggers `missing_edge_endpoints` and `invalid_subfamily_similarity_endpoints`; a `resolves_to` edge pointing at a non-descriptor node triggers both `wrong_endpoint_kinds` and `invalid_alias_targets`. Consumers counting unique faults or mapping one-error-per-invariant will over-report.
**Fix:** Either short-circuit specialized passes when `missing_edge_endpoints` already fired for that edge, or document that overlapping codes are intentional and dedupe in downstream consumers.

### WR-02: Stats error code absent from contract invariant list

**File:** `src/graph_read_model/validate_graph.ts:234` and `src/graph_read_model/contract.ts:62-69`
**Issue:** `validateStatsReconciliation` emits code `inconsistent_stats`, which is not listed in `GRAPH_PHASE_56_INVARIANTS`. The 56-02 plan and summaries describe invariant-coded errors mapped to that constant; tooling or tests filtering on `GRAPH_PHASE_56_INVARIANTS` will miss stats failures.
**Fix:** Add `stats_reconciliation` (or `inconsistent_stats`) to `GRAPH_PHASE_56_INVARIANTS` and `contract.test.ts`, or rename the emitted code to match a listed invariant.

### WR-03: Validator does not enforce baseline stats counts

**File:** `src/graph_read_model/validate_graph.ts:226-243`
**Issue:** `validateStatsReconciliation` only compares `graph.stats` to array-derived counts. Per 56-CONTEXT D-13 ("Stats must reconcile exactly with contract baseline counts"), a graph that is internally consistent but has e.g. `families: 5` passes validation. Baseline `10/18/341/18/13` is only asserted in the live regression test, not by `validateOlfactoryGraph`. Downstream phases calling validate without the live regression cannot assume baseline counts.
**Fix:** Add an optional baseline pass (or always-on when `schema_version` matches) comparing derived stats to `GRAPH_EXPECTED_BASELINE_STATS`, or document explicitly that baseline proof requires the live regression test.

### WR-04: No schema_version validation

**File:** `src/graph_read_model/validate_graph.ts:245-259`
**Issue:** `validateOlfactoryGraph` never checks `graph.schema_version === GRAPH_SCHEMA_VERSION`. A graph with wrong or missing schema version passes all structural checks, allowing version drift to go undetected until a downstream consumer fails.
**Fix:**
```typescript
const validateSchemaVersion = (graph: OlfactoryGraph): GraphValidationResult => {
  if (graph.schema_version !== GRAPH_SCHEMA_VERSION) {
    return {
      ok: false,
      errors: [makeGraphError('invalid_schema_version', '$.schema_version', `expected ${GRAPH_SCHEMA_VERSION}, got ${graph.schema_version}`)],
      warnings: [],
    }
  }
  return { ok: true, errors: [], warnings: [] }
}
```

### WR-05: Malformed graph root can throw instead of returning errors

**File:** `src/graph_read_model/validate_graph.ts:245-258`
**Issue:** Unlike `validateCompiledTaxonomy` (which guards `unknown` at the root), the validator assumes a well-formed `OlfactoryGraph`. If `graph.nodes`, `graph.edges`, or `graph.stats` is `undefined`/`null` (e.g. JSON deserialized without typing), `forEach` or property access throws. This is inconsistent with the compiler validator's defensive pattern and the phase's structured-error contract for externally sourced graphs.
**Fix:** Add a root-shape guard at the top of `validateOlfactoryGraph` returning `makeGraphError` entries for missing or non-array `nodes`/`edges` and missing `stats`.

## Info

### IN-01: Plan 56-02 Test 3 baseline mismatch not covered in validator tests

**File:** `src/tests/graph_read_model/validate_graph.test.ts:265-273`
**Issue:** 56-02-PLAN.md Test 3 requires "Stats mismatch between arrays and `GRAPH_EXPECTED_BASELINE_STATS` returns structured failures." The test only documents the constant value; it does not assert that the validator rejects a graph whose derived counts differ from baseline. This matches the implementation gap in WR-03 but leaves the plan behavior untested.
**Fix:** Add a test that mutates a graph to have correct internal stats but wrong absolute counts vs baseline, if baseline enforcement is added; otherwise update the plan acceptance criteria to reflect the intentional scope split.

### IN-02: build_graph minimal fixture omits similarity target subfamily

**File:** `src/tests/graph_read_model/build_graph.test.ts:17-72`
**Issue:** The minimal taxonomy fixture has only `bright_citrus`, but the similarity edge targets `fresh_floral`. The resulting graph would fail `missing_edge_endpoints` if validated. This is acceptable for builder-only tests (builder does not enforce endpoints) but differs from the validate_graph fixture that includes both subfamilies.
**Fix:** No change required for builder tests; optionally add a comment noting endpoint validation is deferred to `validateOlfactoryGraph`.

---

_Reviewed: 2026-06-09T22:45:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
