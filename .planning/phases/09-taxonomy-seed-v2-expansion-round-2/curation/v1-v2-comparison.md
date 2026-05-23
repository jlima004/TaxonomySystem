# Phase 09 Plan 04: v1 Baseline vs v2 Candidate Comparison

**Status:** PASS — zero hard failures found.  
**Generated:** 2026-05-23  
**Scope:** validation report only; v2 remains an explicit candidate and is not promoted to default.

## Compilation Setup

Both compiles were run with a fixed timestamp to validate determinism and avoid mutating protected baseline artifacts.

| Compile | Seed | Relations | Accords | Output directory | Version | generated_at |
|---|---|---|---|---|---|---|
| v1 baseline | `data/taxonomy/taxonomy-seed.v1.json` | `data/inference/curated_relations.v1.json` | `data/inference/accord_map.v1.json` | `/tmp/opencode/taxonomy-phase9-comparison/v1-baseline` | `1.0.0` | `2026-01-01T00:00:00.000Z` |
| v2 candidate | `data/taxonomy/taxonomy-seed.v2.json` | `data/inference/curated_relations.v2.json` | `data/inference/accord_map.v2.json` | `/tmp/opencode/taxonomy-phase9-comparison/v2-candidate` | `2.0.0` | `2026-01-01T00:00:00.000Z` |

Outputs generated in both temporary directories:

- `taxonomy.json`
- `descriptor_aliases.json`
- `similarity_matrix.json`

Protected/default artifacts were not used as output targets. `data/compiled/v1/**` remains the baseline and was not altered.

## Hard Gate Results

| Hard gate | Result | Evidence |
|---|---:|---|
| Schema invalid | PASS | Both CLI compiles completed with `validation_status=ok` and `quality_gate_status=PASS`. |
| Nondeterminism | PASS | Both compiles used fixed `generated_at=2026-01-01T00:00:00.000Z`; generated metadata matches. |
| Hard/pattern-excludes in taxonomy | PASS | Curation tests passed for `src/tests/curation/`; no hard taxonomy excludes reported. |
| Alias candidate contamination | PASS | Compiles report `0 alias candidates`; alias output count remains 10. |
| Auto-promotion without manual approval | PASS | Seed additions trace to `approval-001` and `r2-approval-001` through `r2-approval-010`. |
| Default drift | PASS | `src/cli/parse_args.ts` defaults still point to v1 seed, v1 relations, v1 accords, and `data/compiled/v1`. |
| Protected artifact mutation | PASS | `git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` returned 0. |
| Curated change without workbook traceability | PASS | New v2 records trace to the workbook's approved Round 2 seed, relation, and accord approval IDs. |

**Hard failures:** none.

## 10 Validation Metrics

### 1. Coverage Counts

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Families | 3 | 7 | +4 |
| Subfamilies | 6 | 13 | +7 |
| Total compiled descriptors | 177 | 288 | +111 |
| Seed descriptors | 21 | 32 | +11 |
| Corpus-derived candidates | 156 | 256 | +100 |
| Candidate/seed ratio | 7.43 | 8.00 | +0.57 |

The v2-expanded candidate now has `green`, `fruity`, and `spicy` family coverage in addition to the v1 families and Phase 8 `gourmand` addition.

### 2. Group Coverage

| Group | v2 subfamilies present | v2 seed descriptors | Status |
|---|---|---|---|
| `green` | `herbal_green`, `leafy_green` | `basil`, `tomato_leaf` | Present; Round 2 target met. |
| `fruity` | `tropical_fruit`, `orchard_fruit`, `red_fruit` | `pineapple`, `banana`, `melon`, `strawberry`, `blackberry` | Present; Round 2 target met. |
| `spicy` | `warm_spice` | `cinnamon`, `clove`, `allspice` | Present through warm-spice coverage. |
| `fresh_spice` | absent | none | Deferred; absent by design because no seed endpoint was approved. |

v2-expanded now has green, fruity, and spicy. `fresh_spice` remains absent/deferred.

### 3. Generic Pressure

| Overloaded / new subfamily | v1 corpus candidates | v2 corpus candidates | Interpretation |
|---|---:|---:|---|
| `floral_rose` | 76 | 54 | Reduced by 22 after fruity/spicy/green split-outs. |
| `citrus_fresh` | 33 | 26 | Reduced by 7. |
| `woody_dry` | 16 | 15 | Slightly reduced. |
| `herbal_green` | — | 7 | New specific bucket for green pressure. |
| `leafy_green` | — | 0 | New curated seed-only leafy endpoint. |
| `tropical_fruit` | — | 63 | New specific bucket receiving tropical fruit pressure. |
| `orchard_fruit` | — | 22 | New specific bucket receiving orchard fruit pressure. |
| `red_fruit` | — | 8 | New specific bucket receiving red-fruit pressure. |
| `warm_spice` | — | 20 | New specific bucket receiving warm-spice pressure. |

Generic/overloaded pressure decreased in the original overloaded subfamilies while new specific v2 subfamilies absorbed relevant corpus candidates.

### 4. Review Queue Quality

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Review queue total | 427 | 331 | -96 |
| Medium severity items | 427 | 331 | -96 |
| `corpus_candidate_low_support` | 410 | 299 | -111 |
| `seed_corpus_conflict` | 17 | 32 | +15 |

Review queue total is substantially lower. The seed-corpus-conflict count increases because v2 intentionally adds curated zero/low-frequency seeds that remain acceptable soft findings with manual rationale.

### 5. Graph Coverage

| Metric | v1 baseline | v2 candidate | Delta |
|---|---:|---:|---:|
| Input relation_count | 6 | 11 | +5 |
| Input accord_count | 5 | 10 | +5 |
| Compiled graph edges | 6 | 10 | +4 |
| Graph density | 0.4000 | 0.1282 | -0.2718 |
| Isolated subfamilies | 0 | 0 | 0 |

Expected v2 input `relation_count` is 11 and expected v2 input `accord_count` is 10; both are confirmed. Density decreases because the candidate adds seven subfamilies faster than graph edges, but all subfamilies remain connected through at least one compiled graph edge.

### 6. Vanilla Gap Status

The vanilla gap was partially resolved via `warm_spice`:

- Relation: `vanilla -> warm_spice`, `cross_family_tradition_bridge`, score `0.65`, evidence `manual_approval`.
- Accord: `warm_spice -> vanilla`, `strong_accord_pair`, score `0.75`, reference `manual_approval`.

This is a partial resolution because it adds explicit manual relation/accord coverage for the Phase 8 vanilla endpoint, but future gourmand expansion may still require more complete gourmand-specific relation and accord review.

### 7. Alias Quality

| Metric | v1 baseline | v2 candidate | Status |
|---|---:|---:|---|
| Alias mappings | 10 | 10 | Unchanged. |
| Alias candidates generated by compile | 0 | 0 | No contamination. |
| Round 2 alias additions | 0 | 0 | Aliases still have no Round 2 additions. |
| Legacy `ylang ylang -> ylang_ylang` | target absent in minimal v2 | target absent in expanded v2 | Soft finding/deferred cleanup. |

`ylang ylang -> ylang_ylang` remains a legacy alias soft finding/deferred cleanup. It is not a hard failure and was not fixed automatically.

### 8. Zero-Frequency Seeds

| v2 zero-frequency seed | Origin | Status |
|---|---|---|
| `citrus/citrus_bitter/bitter_orange` | inherited v1 seed | Soft finding retained. |
| `citrus/citrus_fresh/sweet_orange` | inherited v1 seed | Soft finding retained. |
| `woody/woody_mossy/tree_moss` | inherited v1 seed | Soft finding retained. |

No new Round 2 zero-frequency seed was introduced in the compiled candidate output.

### 9. Determinism and Schema

| Check | v1 baseline | v2 candidate | Result |
|---|---|---|---|
| Fixed timestamp | `2026-01-01T00:00:00.000Z` | `2026-01-01T00:00:00.000Z` | PASS |
| CLI compile exit code | 0 | 0 | PASS |
| Validation status | `ok` | `ok` | PASS |
| Quality gate status | `PASS` | `PASS` | PASS |
| Curation tests | `cd src && npm test -- tests/curation/` | all curation suites pass | PASS |

### 10. Curation Traceability

| Change area | Traceability |
|---|---|
| Phase 8 `gourmand/vanilla/vanilla` | `approval-001` |
| Round 2 seed descriptors | `r2-approval-001` through `r2-approval-010` |
| Round 2 relations written to v2 | `r2-relation-001`, `r2-relation-002`, `r2-relation-003`, `r2-relation-004`, `r2-relation-006` |
| Round 2 accords written to v2 | `r2-accord-001`, `r2-accord-002`, `r2-accord-003`, `r2-accord-004`, `r2-accord-006` |
| Deferred fresh-spice relation/accord proposals | `r2-relation-005`, `r2-accord-005` remain pending/deferred because `fresh_spice` is absent. |
| Deferred legacy alias cleanup | `r2-alias-cleanup-01` |

All candidate v2 Round 2 additions have persisted workbook approval IDs or explicit deferred ledger entries.

## Protected File and Default-Drift Checks

| Constraint | Result |
|---|---|
| `data/compiled/v1/**` was not altered | PASS |
| `data/taxonomy/taxonomy-seed.v1.json` was not altered | PASS |
| `data/inference/curated_relations.v1.json` was not altered | PASS |
| `data/inference/accord_map.v1.json` was not altered | PASS |
| `src/cli/parse_args.ts` still points defaults to v1 | PASS |
| v2 remains candidate, not default | PASS |

`DEFAULT_PATHS` still use:

- `seedPath: data/taxonomy/taxonomy-seed.v1.json`
- `relationsPath: data/inference/curated_relations.v1.json`
- `accordsPath: data/inference/accord_map.v1.json`
- `outputDir: data/compiled/v1`
- `version: 1.0.0`

## Soft Findings

| Finding | Severity | Disposition |
|---|---|---|
| `ylang ylang -> ylang_ylang` alias target absent in v2 | Soft | Deferred legacy alias cleanup; no automatic alias removal or seed addition. |
| `fresh_spice` absent | Soft | Deferred because `fresh_spice` has no approved seed endpoint; related relation/accord proposals remain pending. |
| Graph density lower in v2 | Soft | Expected from adding subfamilies; no isolated subfamilies remain. |
| Some inherited zero-frequency seeds remain | Soft | Inherited v1 seed issue; no new Round 2 zero-frequency seeds introduced. |

## Future Promotion Readiness Criteria Only

Phase 09 does not promote v2. A future default switch must satisfy all of these criteria in a separate plan:

| # | Criterion | Required future proof |
|---:|---|---|
| 1 | Coverage minimum | Curator accepts the v2 family/subfamily/descriptor coverage as default-ready. |
| 2 | Curation traceability | Every curated entry maps to approval ID, rationale, and evidence. |
| 3 | Alias quality | No absent alias targets unless explicitly accepted by policy. |
| 4 | Graph coverage | Every subfamily has relation/accord coverage or an approved gap rationale. |
| 5 | Review queue improvement | Queue remains reduced and more actionable than v1. |
| 6 | Generic pressure reduction | Overloaded v1 buckets remain relieved by specific curated subfamilies. |
| 7 | Zero hard failures | Compile, schema, tests, protected file checks, and default-drift checks pass. |
| 8 | Soft warnings acceptable | All warnings are documented with explicit disposition. |
| 9 | Deterministic migration plan | Future plan includes diff, default switch, rollback, and v1 archival strategy. |
| 10 | Human approval final | Curator explicitly approves the default switch. |

## Conclusion

The v2-expanded candidate passes Phase 09 validation as a candidate-only expansion. It adds green, fruity, and spicy coverage, partially resolves the vanilla relation/accord gap via `warm_spice`, keeps `fresh_spice` deferred, makes no Round 2 alias additions, preserves the legacy `ylang ylang -> ylang_ylang` soft finding, confirms v2 input `relation_count=11` and `accord_count=10`, and reports zero hard failures without changing v1 defaults or protected v1 artifacts.
