---
phase: 57-query-proofs
reviewed: 2026-06-10T12:15:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - src/graph_read_model/types.ts
  - src/graph_read_model/query_graph.ts
  - src/tests/graph_read_model/query_graph.test.ts
  - src/tests/graph_read_model/query_live_baseline.test.ts
  - src/tests/graph_read_model/live_artifact_baseline.test.ts
findings:
  critical: 0
  warning: 5
  info: 2
  total: 7
status: issues_found
---

# Phase 57: Code Review Report

**Reviewed:** 2026-06-10T12:15:00Z  
**Depth:** standard  
**Files Reviewed:** 5  
**Status:** issues_found

## Summary

Phase 57 adds a fs-free query proof layer over `OlfactoryGraph` with typed `{ query_kind, params, result, path }` envelopes, eight named query functions, inline snapshot tests, and live baseline aggregate regression. Implementation aligns with locked context decisions (raw IDs in params, bidirectional 1-hop neighborhoods, cross-family bridge semantics, hub degree tie-break, validate-before-query in tests only). All 41 `graph_read_model` tests pass.

No blockers were found for the current v2 baseline (13 directed similarity edges, no self-loops, no reciprocal pairs). Several robustness gaps remain in `query_graph.ts` around neighborhood deduplication, numeric coercion, and type projection on graphs that are structurally valid but property-inconsistent—relevant because production queries intentionally skip re-validation (D-02).

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Self-loop `similar_to` edges produce duplicate neighborhood entries

**File:** `src/graph_read_model/query_graph.ts:347-359`  
**Issue:** `getSimilarityNeighborhood` handles outbound (`edge.source === subfamilyGraphId`) and inbound (`edge.target === subfamilyGraphId`) in separate branches without `continue` after the outbound match. When `source === target` (self-loop), both branches push the same `neighbor_id` twice in one iteration—once as `outbound`, once as `inbound`. That inflates neighbor count and violates the 1-hop neighbor semantics consumers expect.  
**Fix:** After handling the outbound branch, `continue` the loop, or dedupe by `(neighbor_id, direction)` / merge same-neighbor edges before sort:

```typescript
if (edge.source === subfamilyGraphId) {
  neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.target, 'outbound'))
  continue
}
if (edge.target === subfamilyGraphId) {
  neighbors.push(toSimilarityNeighborhoodEntry(edge, edge.source, 'inbound'))
}
```

### WR-02: Reciprocal edge pairs duplicate the same neighbor in neighborhoods

**File:** `src/graph_read_model/query_graph.ts:347-359`  
**Issue:** If both `A→B` and `B→A` `similar_to` edges exist, querying subfamily `A` yields two entries with the same `neighbor_id` (`B`)—one `outbound`, one `inbound`. The v2 baseline has no reciprocal pairs today, but future similarity artifacts or manual graphs could. Downstream agent/RAG proofs may double-count neighbors or rank duplicates unpredictably after sort.  
**Fix:** Either document that each edge is a separate neighborhood entry, or collapse entries by `neighbor_id` (keeping highest `(final_score ?? score)` and a stable direction label). Add an inline fixture with reciprocal edges if collapse is chosen.

### WR-03: Descriptor proof projection uses unchecked type assertions

**File:** `src/graph_read_model/query_graph.ts:37-44`  
**Issue:** `toDescriptorProof` casts `node.properties.status` and `node.properties.source` with `as` and coerces booleans via `Boolean()`. On a graph that passes structural validation but has wrong property values (validator does not check descriptor enum fields), proofs silently emit values that violate `DescriptorProofItem` at runtime while TypeScript still types them as `'curated' | 'candidate' | ...`. That undermines GQRY-05 static inspectability for malformed inputs.  
**Fix:** Narrow with explicit guards (mirror builder/contract allowed values) or return a sentinel / omit invalid fields. At minimum, validate against known unions before casting:

```typescript
const status = node.properties.status
if (status !== 'curated' && status !== 'candidate' && status !== 'inferred') {
  // handle or skip
}
```

### WR-04: Similarity score coercion can produce `NaN` and unstable sort order

**File:** `src/graph_read_model/query_graph.ts:258-259`, `287-292`, `316-317`  
**Issue:** `Number(edge.properties.score)` and `Number(edge.properties.final_score)` are used without `Number.isFinite` checks. Missing or non-numeric scores become `NaN` in proof payloads; `compareSimilarityNeighborhoodEntries` then returns `NaN` from the comparator when scores tie-break, making sort order implementation-defined in JavaScript. Structural validation does not validate numeric edge properties.  
**Fix:** Default or reject non-finite scores explicitly:

```typescript
const score = Number(edge.properties.score)
const safeScore = Number.isFinite(score) ? score : 0
```

Apply the same guard in bridge projection and document the fallback in proof types if needed.

### WR-05: Path traversal uses first inbound edge only—nondeterministic on ambiguous graphs

**File:** `src/graph_read_model/query_graph.ts:71-75`, `134`, `152`, `198`, `216`  
**Issue:** `findInboundEdge` uses `Array.find`, returning the first matching `contains_descriptor` / `contains_subfamily` edge in graph array order. If a descriptor were linked to multiple subfamilies (validator does not forbid duplicate inbound edges to the same target), `resolveAliasPath` and `getDescriptorToFamilyPath` would follow whichever edge sorts first—not necessarily the canonical hierarchy. Built baseline graphs are consistent; this is a latent correctness hole for hand-built or future graphs.  
**Fix:** Prefer resolving via descriptor node `properties.subfamily_id` / `family_id` (already on nodes per contract) for path queries, or select inbound edges with deterministic tie-break (e.g., lexicographic edge id) and add a validator invariant for at-most-one inbound `contains_descriptor` per descriptor.

## Info

### IN-01: Live aggregate regression omits build-twice determinism (D-28)

**File:** `src/tests/graph_read_model/query_live_baseline.test.ts:50-149`  
**Issue:** Phase context D-28 requires build+validate+query twice → deep equal. Inline tests cover this for all eight functions; the live baseline test builds once and never compares repeated proof outputs at catalog scale. A determinism regression in live-scale queries would not be caught.  
**Fix:** Build the graph twice from the same compiled inputs and assert deep equality for a representative subset (or all families/aliases/neighborhood keys) of proof outputs.

### IN-02: Live regression does not assert similarity neighborhood sort contract

**File:** `src/tests/graph_read_model/query_live_baseline.test.ts:108-114`  
**Issue:** Live tests check `neighbors.length > 0` but not D-19 ordering (`final_score ?? score` descending, then `neighbor_id` lexicographic). A sort regression in `compareSimilarityNeighborhoodEntries` would pass live tests while failing inline snapshots only for exemplar subfamilies.  
**Fix:** Add a helper asserting monotonic non-increasing effective score across each neighborhood list in the live loop (similar to existing `isSortedById` for descriptors).

---

_Reviewed: 2026-06-10T12:15:00Z_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_
