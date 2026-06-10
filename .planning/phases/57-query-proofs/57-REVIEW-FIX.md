---
phase: 57-query-proofs
fixed_at: 2026-06-10T12:33:30Z
review_path: .planning/phases/57-query-proofs/57-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 4
skipped: 1
status: partial
---

# Phase 57: Code Review Fix Report

**Fixed at:** 2026-06-10T12:33:30Z
**Source review:** .planning/phases/57-query-proofs/57-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 5
- Fixed: 4
- Skipped: 1

## Fixed Issues

### WR-02: Reciprocal edge pairs duplicate the same neighbor in neighborhoods

**Files modified:** `src/graph_read_model/query_graph.ts`, `src/tests/graph_read_model/query_graph.test.ts`
**Commit:** d4aa9ab
**Applied fix:** Added `collapseNeighborhoodEntries` to merge duplicate `neighbor_id` entries, keeping the highest effective score and lexicographically stable direction tie-break. Added inline test with reciprocal `woody_dry ↔ floral_rose` edges.

### WR-03: Descriptor proof projection uses unchecked type assertions

**Files modified:** `src/graph_read_model/query_graph.ts`
**Commit:** 36e7852
**Applied fix:** Added `isDescriptorStatus` / `isDescriptorSource` guards; `toDescriptorProof` returns `null` for invalid enum values and `collectDescriptors` filters them out.

### WR-04: Similarity score coercion can produce `NaN` and unstable sort order

**Files modified:** `src/graph_read_model/query_graph.ts`
**Commit:** 3b689c8
**Applied fix:** Added `toFiniteNumber` helper with `Number.isFinite` guard; applied to neighborhood entries, bridge items, and sort comparator via `effectiveNeighborhoodScore`.

### WR-05: Path traversal uses first inbound edge only—nondeterministic on ambiguous graphs

**Files modified:** `src/graph_read_model/query_graph.ts`
**Commit:** 18e6428
**Applied fix:** Replaced `findInboundEdge` traversal with `resolveDescriptorHierarchyNodes`, resolving subfamily/family nodes from descriptor `properties.subfamily_id` and `properties.family_id`.

## Skipped Issues

### WR-01: Self-loop `similar_to` edges produce duplicate neighborhood entries

**File:** `src/graph_read_model/query_graph.ts:352-354`
**Reason:** Fix already present in codebase — outbound branch uses `continue` after push, preventing self-loop double-count.
**Original issue:** Self-loop edges could push the same neighbor twice (outbound + inbound) without a loop `continue`.

---

**Tests:** 42/42 `graph_read_model` tests pass (including new reciprocal-edge collapse test).

_Fixed: 2026-06-10T12:33:30Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
