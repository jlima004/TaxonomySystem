---
phase: 05
slug: inference-engine
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-19
---

# Phase 05 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| curated seed/corpus analysis → inference functions | Inputs may contain malformed descriptors, very frequent generic terms, or corpus evidence that conflicts with curated seed truth. | `TaxonomySeed`, `CorpusAnalysis` (frequency/cooccurrence maps, alias candidates) |
| sparse co-occurrence maps → cluster builder | Pair maps can become large; implementation must not materialize dense descriptor matrices. | `ReadonlyMap<string, number>` co-occurrence pairs |
| curated relation/accord JSON → scoring calculators | Malformed curated inputs can create invalid scores or hidden hardcoded domain assumptions. | `CuratedRelationsInput`, `AccordMapInput` |
| score dimension inputs → calculators | Invalid or missing optional dimensions can create out-of-range scores or accidental penalties. | Normalized `[0,1]` dimension scores |
| dimension calculator outputs → final score helpers | Invalid or missing optional dimensions can create out-of-range scores or accidental penalties. | Separated dimension scores with evidence |
| final score helpers → sparse graph builder | Incorrect threshold comparison can emit too many edges or drop eligible edges. | `final_score`, edge eligibility |
| corpus-derived evidence → graph edges | Corpus evidence must not obscure curated tradition/accord priorities or become unreviewable. | Compact edge evidence, `review_queue` |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-05-01 | Tampering | `buildSeedCorpusProfiles` | mitigate | Seed descriptors preserved as `source: 'seed'`, corpus-only as `source: 'corpus'`/`status: 'candidate'`/`corpus_derived: true`. No mutation of input `TaxonomySeed` or `CorpusAnalysis` maps. Tests assert immutability. | closed |
| T-05-02 | DoS | `buildDescriptorClusters` | mitigate | Sparse co-occurrence iteration via `decodePairKey` (`descriptor_clusters.ts:32-43`). No dense matrix materialization. Deterministic sorted pair iteration. | closed |
| T-05-03 | Tampering | `scoreSemanticNoise` | mitigate | Curated noise downweighted to configurable value (default 0.35). Seed-owned noise terms keep weight 1 with `seed_exception: true` and audit review record (`noise.ts:38-44`). | closed |
| T-05-04 | Tampering | `computeTraditionScore` / `computeAccordCompatibility` | mitigate | Curated relation/accord data accepted as explicit function inputs, not hardcoded. IDs validated. Returns `undefined` for missing optional dimensions (`tradition_score.ts:39`, `accord_compatibility.ts:15`). | closed |
| T-05-05 | Tampering | dimension calculators | mitigate | All dimension scores clamped to `[0,1]` via `clamp01` helper. Missing optional dimensions return `undefined` (`semantic_overlap.ts:37`, `tradition_score.ts:43`, `accord_compatibility.ts:19`, `alias_evidence.ts:32`). | closed |
| T-05-06 | Information Disclosure | similarity edge evidence | accept | Evidence contains descriptor IDs and aggregate scores only. No secrets or PII processed in Phase 5. | closed |
| T-05-07 | Tampering | dimension calculator outputs | mitigate | Same as T-05-05 — clamp/validate to `[0,1]`, `undefined` for absent dimensions so downstream renormalization works correctly. | closed |
| T-05-08 | Tampering | `buildSimilarityGraph` evidence | mitigate | Separated dimension keys (`semantic_overlap`, `tradition`, `accord_compatibility`, `alias_evidence`) preserved in edge output. Compact evidence object with distinct fields (`shared_descriptors`, `cooccurrence_support`, `curated_relation`, `accord_reference`, `alias_evidence`). No opaque score collapse (`build_similarity_graph.ts:137-149, 207-229`). | closed |
| T-05-09 | DoS | `buildSimilarityGraph` pair generation | mitigate | Unique sorted subfamily pairs generated via nested loop (`build_similarity_graph.ts:191-235`). Only sparse edges emitted after `shouldKeepEdge(final_score, threshold)` filter. No dense matrix returned. | closed |
| T-05-10 | Information Disclosure | similarity edge evidence | accept | Evidence contains descriptor IDs and aggregate scores only. No secrets or PII processed in Phase 5. | closed |
| T-05-11 | Tampering | `combineScores` | mitigate | Dimension scores clamped to `[0,1]` before weighting (`final_score.ts:21-24`). Renormalizes over available dimensions — undefined dimensions excluded from numerator and denominator (`final_score.ts:35-36`). Returns `0` when no dimensions available (`final_score.ts:42-44`). | closed |
| T-05-12 | Tampering | `shouldKeepEdge` | mitigate | Strict `finalScore > threshold` comparison (`final_score.ts:49`), not `>=`. Thresholding outside individual dimension calculators. Tests prove exact `0.25` exclusion. | closed |
| T-05-SC | Tampering | npm installs | accept | No package installs planned. Zero runtime dependency constraint enforced. All Phase 5 code uses existing project dependencies only. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-05-01 | T-05-06 | Similarity edge evidence contains only descriptor IDs and aggregate similarity scores. No secrets, credentials, or PII are processed anywhere in Phase 5 inference pipeline. | plan | 2026-05-19 |
| AR-05-02 | T-05-10 | Same as AR-05-01 — graph-level edge evidence is descriptor-level aggregate data only. | plan | 2026-05-19 |
| AR-05-03 | T-05-SC | Phase 5 introduces zero new npm dependencies. All inference code uses existing project TypeScript/Vitest stack. Package legitimacy audit gate not triggered. | plan | 2026-05-19 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-19 | 13 | 13 | 0 | gsd-secure-phase (automated) |

### Security Audit 2026-05-19

| Metric | Count |
|--------|-------|
| Threats found | 13 |
| Closed | 13 |
| Open | 0 |

**Verification details:**
- T-05-01: `seed_profile.ts:107-112` (seed source), `seed_profile.ts:139-144` (corpus candidate), tests assert no mutation
- T-05-02: `descriptor_clusters.ts:1,32-43` (sparse `decodePairKey` iteration)
- T-05-03: `noise.ts:38-44` (seed_exception weight 1, downweight otherwise)
- T-05-04: `tradition_score.ts:39`, `accord_compatibility.ts:15` (undefined for missing, explicit inputs)
- T-05-05: `semantic_overlap.ts:37`, `tradition_score.ts:43`, `accord_compatibility.ts:19`, `alias_evidence.ts:32` (clamp01)
- T-05-06: `build_similarity_graph.ts:137-149` (descriptor IDs + aggregate scores only)
- T-05-07: Same evidence as T-05-05
- T-05-08: `build_similarity_graph.ts:207-229` (separated dimensions, compact evidence)
- T-05-09: `build_similarity_graph.ts:191-235` (sparse iteration + shouldKeepEdge filter)
- T-05-10: Same evidence as T-05-06
- T-05-11: `final_score.ts:21-46` (clamp, renormalize, no-dimensions zero)
- T-05-12: `final_score.ts:49` (strict `>` comparison)
- T-05-SC: No new dependencies in Phase 5 commits

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-19
