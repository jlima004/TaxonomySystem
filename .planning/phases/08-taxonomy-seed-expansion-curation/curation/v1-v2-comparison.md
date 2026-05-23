# V1 vs V2 Curation Comparison Report

**Phase:** 08-taxonomy-seed-expansion-curation
**Plan:** 08-05
**Generated:** 2026-05-23
**Comparison directories:**
- Baseline: `/tmp/opencode/taxonomy-phase8-comparison/v1-baseline`
- Candidate: `/tmp/opencode/taxonomy-phase8-comparison/v2-candidate`

**Compile commands:**
- Baseline: `npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase8-comparison/v1-baseline --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z`
- Candidate: `npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase8-comparison/v2-candidate --version 2.0.0 --generated-at 2026-01-01T00:00:00.000Z`

---

## Hard failures

**None.** Both v1 baseline and v2 candidate compile exit 0 with `quality_gate_status=PASS` and `validation_status=ok`. No schema invalid, nondeterminism, hard/pattern-exclude descriptor, alias contamination, or auto-promotion detected.

---

## Soft curation warnings

All soft warnings are expected and documented. No soft warning constitutes a build failure.

### Alias quality

Legacy aliases in `descriptor_aliases.seed.json` point to targets absent from minimal seed v2.
Soft warning only; do not remove aliases or add descriptors without curation approval.

Specifically, `ylang ylang -> ylang_ylang` targets a descriptor not present in either v1 or v2 seed. This is a pre-existing legacy alias that was already present before Phase 8 and remains valid as an authoritative alias mapping for corpus canonicalization. No corrective action is taken in this plan.

### Graph coverage

Vanilla is a new v2 subfamily but has no curated relation/accord score yet.
This is acceptable because `relation_gap`/`accord_gap` were explicitly recorded.

The `vanilla` subfamily has no edge in the similarity graph (6 edges, none involving `vanilla`). This is documented in `candidate-review.md` under `relation-gap-approval-001-vanilla` and `accord-gap-approval-001-vanilla`. Missing relation/accord remains neutral/undefined, not score 0.

### Sparse v2 expansion

v2 is intentionally minimal: only `gourmand` / `vanilla` / `vanilla` was added.

This follows CUR-D-01 (minimal expansion strategy) and approval-001 in the candidate review workbook. Future curation waves may expand coverage.

---

## Regressions with rationale

**No regressions detected.**

| Metric | V1 Baseline | V2 Candidate | Delta | Rationale |
|--------|-------------|--------------|-------|-----------|
| Families | 3 | 4 | +1 | Approved `gourmand` family added |
| Subfamilies | 6 | 7 | +1 | Approved `vanilla` subfamily added |
| Descriptors | 177 | 201 | +24 | 1 new seed descriptor (`vanilla`) + 23 corpus descriptors routed to new `vanilla` subfamily |
| Seed descriptors | 21 | 22 | +1 | `vanilla` added via approval-001 |
| Corpus descriptors | 156 | 179 | +23 | Corpus descriptors now routed to `vanilla` subfamily |
| Aliases | 10 | 10 | 0 | No aliases added or removed in Phase 8 |
| Edges | 6 | 6 | 0 | Same curated relation/accord inputs; `vanilla` has no approved relation/accord |
| Review queue | 427 | 403 | -24 | 24 corpus descriptors moved from `floral_rose` review queue to `vanilla` subfamily seed/corpus |
| Edge density | 0.400 | 0.286 | -0.114 | Density decreases because subfamily count increased (7 vs 6) while edge count stays at 6 |

All deltas are explained by the approved minimal seed expansion. No unexpected regressions.

---

## Coverage

| Metric | V1 Baseline | V2 Candidate |
|--------|-------------|--------------|
| Families | 3 | 4 |
| Subfamilies | 6 | 7 |
| Total descriptors | 177 | 201 |
| Seed descriptors | 21 | 22 |
| Corpus descriptors | 156 | 179 |
| Curated aliases | 10 | 10 |

V2 adds the `gourmand` family with a single `vanilla` subfamily containing 1 seed descriptor and 23 corpus-routed descriptors. The seed expansion is minimal and intentional per CUR-D-01.

---

## Generic pressure

Top corpus descriptors by frequency in v2, showing generic placement pressure:

| Descriptor | Frequency | Routed Subfamily |
|------------|-----------|------------------|
| `fruity` | 1564 | `floral_rose` |
| `green` | 1517 | `floral_rose` |
| `floral` | 1487 | `floral_rose` |
| `sweet` | 1459 | `floral_rose` |
| `woody` | 1329 | `woody_dry` |
| `herbal` | 1183 | `floral_rose` |
| `spicy` | 978 | `floral_rose` |
| `citrus` | 695 | `citrus_fresh` |
| `fresh` | 629 | `citrus_fresh` |
| `balsamic` | 626 | `floral_rose` |

Generic pressure on `floral_rose` remains high. The v2 expansion partially relieves pressure by routing gourmand-related corpus descriptors (e.g., `caramellic` freq=165, `creamy` freq=244, `vanilla` freq=131) to the new `vanilla` subfamily. Future curation waves targeting `spicy`, `green`, `fruity`, `amber_resinous`, and `animalic` would further reduce generic pressure.

---

## Zero-frequency seeds

| Descriptor | Subfamily | Present In |
|------------|-----------|------------|
| `bitter_orange` | `citrus_bitter` | V1, V2 |
| `sweet_orange` | `citrus_fresh` | V1, V2 |
| `tree_moss` | `woody_mossy` | V1, V2 |

No new zero-frequency seeds introduced in v2. The `vanilla` seed descriptor has frequency=131 from corpus evidence. The three existing zero-frequency seeds are unchanged from Phase 7 baseline.

---

## Graph coverage

| Metric | V1 Baseline | V2 Candidate |
|--------|-------------|--------------|
| Edges | 6 | 6 |
| Edge density | 0.400 | 0.286 |
| Curated relations | 6 | 6 |
| Curated accords | 5 | 5 |

Edge endpoints in v2: `citrus_bitter <-> citrus_fresh`, `citrus_fresh <-> floral_white`, `floral_rose <-> floral_white`, `floral_rose <-> woody_dry`, `floral_rose <-> woody_mossy`, `woody_dry <-> woody_mossy`.

The `vanilla` subfamily has no graph edges because no curated relation or accord score has been approved for it. This is documented as an explicit `relation_gap`/`accord_gap` in the candidate review workbook. Edge density decreases from 0.400 to 0.286 because the possible edge count grows with the new subfamily (from 15 to 21 possible pairs) while actual edges remain at 6.

---

## Review queue quality

| Metric | V1 Baseline | V2 Candidate |
|--------|-------------|--------------|
| Total review items | 427 | 403 |
| `corpus_candidate_low_support` | 410 | 386 |
| `seed_corpus_conflict` | 17 | 17 |
| Severity `medium` | 427 | 403 |

The review queue shrinks by 24 items because corpus descriptors that were previously review items routed to `floral_rose` are now placed in the new `vanilla` subfamily. The `seed_corpus_conflict` count is unchanged (17) because no seed descriptors were modified. All review items remain `medium` severity; no `high` severity items exist.

---

## Alias quality

| Metric | V1 Baseline | V2 Candidate |
|--------|-------------|--------------|
| Curated aliases | 10 | 10 |
| Aliases added in Phase 8 | — | 0 |
| Aliases removed in Phase 8 | — | 0 |

Alias target analysis against v2 seed descriptors:

| Alias | Target | In V1 Seed | In V2 Seed |
|-------|--------|------------|------------|
| `jasmin` | `jasmine` | ✓ | ✓ |
| `orange flower` | `orange_blossom` | ✓ | ✓ |
| `orange blossom` | `orange_blossom` | ✓ | ✓ |
| `orangeflower` | `orange_blossom` | ✓ | ✓ |
| `oak moss` | `oakmoss` | ✓ | ✓ |
| `ylang ylang` | `ylang_ylang` | ✗ | ✗ |
| `petit grain` | `petitgrain` | ✓ | ✓ |
| `patchouly` | `patchouli` | ✓ | ✓ |
| `cedar wood` | `cedarwood` | ✓ | ✓ |
| `sandal wood` | `sandalwood` | ✓ | ✓ |

One legacy alias (`ylang ylang -> ylang_ylang`) targets a descriptor absent from both v1 and v2 seeds. This is a pre-existing condition from before Phase 8 and is not introduced by the v2 expansion. No aliases were added or removed during Phase 8 because no approved `add_alias` disposition exists in the candidate review workbook.

---

## Determinism/schema

| Check | Result |
|-------|--------|
| V1 baseline exit code | 0 |
| V2 candidate exit code | 0 |
| V1 `generated_at` | `2026-01-01T00:00:00.000Z` (deterministic) |
| V2 `generated_at` | `2026-01-01T00:00:00.000Z` (deterministic) |
| V1 `version` | `1.0.0` |
| V2 `version` | `2.0.0` |
| Schema validation | PASS (both) |
| Quality gate status | PASS (both) |
| Default CLI paths | V1 (unchanged) |
| `parse_args.ts` modified | No |
| `data/compiled/v1/` modified | No |

Both compiles use explicit `--generated-at 2026-01-01T00:00:00.000Z` for deterministic output. Repeated compiles with the same inputs produce byte-identical output (verified by `v1_v2_comparison.test.ts` determinism assertion). Default CLI paths in `src/cli/parse_args.ts` remain pointed at v1 inputs and output.

---

## Curation Test Results

| Test File | Tests | Status |
|-----------|-------|--------|
| `tests/curation/taxonomy_seed_v2.test.ts` | 5 | PASS |
| `tests/curation/review_dispositions.test.ts` | 5 | PASS |
| `tests/curation/alias_seed_v2.test.ts` | 6 | PASS |
| `tests/curation/relation_accord_v2.test.ts` | 4 | PASS |
| `tests/curation/v1_v2_comparison.test.ts` | 5 | PASS |
| **Total** | **25** | **ALL PASS** |

---

## Validation Outcome

- **Hard failures:** None.
- **Soft warnings:** 3 documented (alias quality, graph coverage, sparse expansion) — all acceptable per curation policy.
- **Regressions:** None.
- **Nyquist compliant:** Yes — all Wave 0 curation tests exist and pass.
- **Wave 0 complete:** Yes — all five curation test files pass.
- **Default switch:** No — `parse_args.ts` defaults remain v1.
- **Promotion status:** V2 remains a candidate; no automatic promotion occurred.
