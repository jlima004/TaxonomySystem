---
phase: 05-inference-engine
reviewed: 2026-05-19T16:57:22Z
depth: standard
files_reviewed: 31
files_reviewed_list:
  - src/types/inference.ts
  - src/types/index.ts
  - src/types/similarity.ts
  - src/inference/index.ts
  - src/inference/types.ts
  - src/inference/noise.ts
  - src/inference/seed_profile.ts
  - src/inference/descriptor_clusters.ts
  - src/inference/semantic_overlap.ts
  - src/inference/curated_input_validation.ts
  - src/inference/tradition_score.ts
  - src/inference/accord_compatibility.ts
  - src/inference/alias_evidence.ts
  - src/inference/final_score.ts
  - src/inference/build_similarity_graph.ts
  - data/inference/semantic_noise.v1.json
  - data/inference/curated_relations.v1.json
  - data/inference/accord_map.v1.json
  - src/tests/inference/seed_profile.test.ts
  - src/tests/inference/noise.test.ts
  - src/tests/inference/descriptor_clusters.test.ts
  - src/tests/inference/semantic_overlap.test.ts
  - src/tests/inference/tradition_score.test.ts
  - src/tests/inference/accord_compatibility.test.ts
  - src/tests/inference/alias_evidence.test.ts
  - src/tests/inference/final_score.test.ts
  - src/tests/inference/build_similarity_graph.test.ts
  - src/tests/fixtures/inference/seed_corpus_conflict.json
  - src/tests/fixtures/inference/noise_and_clusters.json
  - src/tests/fixtures/inference/scoring_dimensions.json
  - src/tests/fixtures/inference/sparse_graph_threshold.json
findings:
  critical: 2
  warning: 2
  info: 0
  total: 4
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-05-19T16:57:22Z
**Depth:** standard
**Files Reviewed:** 31
**Status:** issues_found

## Summary

Reviewed the Phase 05 inference-engine source, tests, and explicit inference data files under `src/` and `data/inference/`. The implementation has functional correctness issues in corpus-native clustering and alias evidence, plus robustness gaps around malformed curated inputs and non-finite score handling. Several of these are not covered by the submitted tests.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Corpus-native clusters cannot be formed by similarity-only evidence

**File:** `src/inference/descriptor_clusters.ts:145-169`

**Issue:** `makeCorpusNativeClusters` only iterates `analysis.cooccurrence` and immediately skips pairs below `minCoOccurrence`. That means two corpus-only descriptors that meet the `minSimilarity` threshold but have no sparse co-occurrence entry can never produce a `corpus_native` cluster, even though Phase 05 requires corpus-native clusters from co-occurrence **or** similarity evidence. The test suite only asserts a co-occurrence-backed native cluster and misses the similarity-only path.

**Fix:** Generate deterministic pairs from eligible inferred descriptors and accept the pair when either co-occurrence or similarity meets its threshold; record the actual membership signals. Add a test with two corpus-only descriptors whose co-occurrence is absent/below threshold but similarity is above threshold.

```ts
const eligible = [...inferredSet].sort(sortLex)
for (let i = 0; i < eligible.length - 1; i++) {
  for (let j = i + 1; j < eligible.length; j++) {
    const a = eligible[i]
    const b = eligible[j]
    const count = getPairCount(analysis, a, b)
    const similarity = descriptorSimilarity(a, b)
    const signals = [
      ...(count >= options.minCoOccurrence ? ['cooccurrence' as const] : []),
      ...(similarity >= options.minSimilarity ? ['similarity' as const] : []),
    ]
    if (signals.length === 0) continue
    // emit corpus_native cluster with signals and support values
  }
}
```

### CR-02: Alias evidence is credited to unrelated subfamily pairs

**File:** `src/inference/alias_evidence.ts:15-18`

**Issue:** `computeAliasEvidence` builds one union of left+right descriptors and matches an alias candidate when either side of that candidate appears anywhere in the union. An alias wholly inside the left profile, or between a left descriptor and a descriptor absent from the right profile, is treated as evidence for the left/right edge. Because `buildSimilarityGraph` includes this dimension in final scoring, unrelated subfamily pairs can receive false alias support and may cross the sparse-edge threshold. The tests only cover a positive alias case and do not assert that aliases must bridge left to right.

**Fix:** Match only candidates where one endpoint belongs to the left profile and the other endpoint belongs to the right profile. Add negative tests for left-only/right-only aliases.

```ts
const leftDescriptors = descriptorSet(leftProfile)
const rightDescriptors = descriptorSet(rightProfile)
const matched = aliasCandidates.filter(candidate => {
  return (leftDescriptors.has(candidate.a) && rightDescriptors.has(candidate.b))
    || (leftDescriptors.has(candidate.b) && rightDescriptors.has(candidate.a))
})
```

## Warnings

### WR-01: Curated input validation can throw raw TypeErrors for malformed array entries

**File:** `src/inference/curated_input_validation.ts:41-47`, `src/inference/curated_input_validation.ts:58-64`

**Issue:** The top-level curated relation/accord inputs are validated, but each array entry is assumed to be an object before accessing fields. JSON inputs such as `{ "version": "1", "relations": [null] }` or `{ "version": "1", "accords": [42] }` will crash with a raw property-access `TypeError` rather than the intended validation error. This weakens the explicit curated-input trust boundary and is not covered by the validation tests.

**Fix:** Validate every entry with `isRecord` before reading properties, and add tests for null/non-object relation and accord entries.

### WR-02: `combineScores` does not handle `NaN` dimension scores

**File:** `src/inference/final_score.ts:21-36`

**Issue:** `clampScore` clamps finite out-of-range values but leaves `NaN` as `NaN`. A single malformed upstream dimension can make the final score `NaN`; `shouldKeepEdge(NaN)` then silently drops the edge. The robustness tests cover `-1` and `1.2` but not `NaN`.

**Fix:** Treat non-finite or `NaN` inputs as invalid before clamping, either by returning `0` for that dimension or throwing a validation error. Add a test for `combineScores({ semantic_overlap: Number.NaN })`.

---

_Reviewed: 2026-05-19T16:57:22Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
