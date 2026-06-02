# Phase 44 Low-Support Inventory

**Generated:** 2026-06-02
**Source of truth:** `data/compiled/v2/similarity_matrix.json`
**Source version:** `2.7.0`
**Source generated_at:** `2026-06-02T20:49:04.282Z`
**Scope:** current `corpus_candidate_low_support` review_queue items only

## Summary Metrics

| Metric | Value |
|---|---:|
| Total review_queue items | 269 |
| corpus_candidate_low_support | 259 |
| seed_corpus_conflict | 10 |
| Inventory candidate count | 259 |
| Excluded seed_corpus_conflict count | 10 |
| Graph edge count | 13 |

## Zero-Mutation Confirmation

- No taxonomy seed files were changed.
- No descriptor alias files were changed.
- No compiled artifacts were changed or regenerated.
- No Graphify, scoring, MVP, SaaS, Knowledge Engine, UI, runtime API, or product work was performed.
- `seed_corpus_conflict` items were counted only for exclusion context and were not inventoried or touched.

## Exclusion Policy And Proof

- Inventory target is only current unresolved `corpus_candidate_low_support` items in the official v2.7 compiled artifact.
- v2.7 decisions are not reopened.
- Known v2.7 promoted descriptors are explicitly checked against the current low_support queue.
- If a prior decided candidate still appears unresolved as current low_support, current artifact truth controls eligibility for future phases; Phase 44 still does not select or decide it.

| v2.7 promoted descriptor | Still unresolved low_support? |
|---|---|
| `peppermint` | no |
| `rosemary` | no |
| `cumin` | no |
| `spearmint` | no |
| `caraway` | no |
| `opoponax` | no |

**Result:** none of the six documented v2.7 promoted descriptors remain unresolved as low_support.

## Non-Selecting Readiness Groups

These groups are inventory metadata for downstream planning. They are not Batch 2 selections, approval evidence, promotion decisions, rejection decisions, alias decisions, defer decisions, or manual_review decisions.

| Readiness group | Rule | Count |
|---|---|---:|
| `baseline_frequency_signal` | `candidate_frequency < 10` | 181 |
| `high_frequency_signal` | `candidate_frequency >= 20` | 39 |
| `moderate_frequency_signal` | `candidate_frequency` from 10 to 19 | 39 |

## Review Reasons

| Reason | Count |
|---|---:|
| `support_below_threshold` | 244 |
| `normalized_support_below_threshold` | 8 |
| `placement_score_below_threshold` | 7 |

## Candidate Count By Inferred Subfamily

| Inferred subfamily | Count |
|---|---:|
| `amber` | 101 |
| `tropical_fruit` | 30 |
| `citrus_fresh` | 18 |
| `floral_rose` | 17 |
| `orchard_fruit` | 17 |
| `vanilla` | 13 |
| `floral_white` | 12 |
| `fresh_spice` | 11 |
| `red_fruit` | 9 |
| `warm_spice` | 9 |
| `balsamic_resin` | 5 |
| `citrus_bitter` | 4 |
| `musky` | 4 |
| `woody_dry` | 3 |
| `leafy_green` | 2 |
| `leathery` | 2 |
| `herbal_green` | 1 |
| `woody_mossy` | 1 |

## Ordering

The full inventory below is sorted deterministically by:

1. `candidate_frequency` descending
2. `placement_score` descending
3. `candidate` ascending

Frequency is prioritization evidence only, not approval evidence.

## Full Low-Support Inventory

| # | Candidate | Inferred subfamily | Readiness group | Frequency | Support | Normalized support | Placement score | Threshold support | Threshold normalized | Threshold placement | Noise penalty | Reason | Severity | Source | Suggested action |
|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|---|
| 1 | `nutty` | `vanilla` | `high_frequency_signal` | 271 | 11 | 0.04059 | 0.660886 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 2 | `sulfurous` | `citrus_fresh` | `high_frequency_signal` | 226 | 8 | 0.035398 | 0.533097 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 3 | `roasted` | `balsamic_resin` | `high_frequency_signal` | 170 | 2 | 0.011765 | 0.137647 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 4 | `meaty` | `orchard_fruit` | `high_frequency_signal` | 155 | 3 | 0.019355 | 0.209032 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 5 | `coffee` | `vanilla` | `high_frequency_signal` | 116 | 3 | 0.025862 | 0.218793 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 6 | `hay` | `amber` | `high_frequency_signal` | 112 | 5 | 0.044643 | 0.366964 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 7 | `buttery` | `tropical_fruit` | `high_frequency_signal` | 95 | 4 | 0.042105 | 0.303158 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 8 | `garlic` | `tropical_fruit` | `high_frequency_signal` | 85 | 3 | 0.035294 | 0.232941 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 9 | `orri` | `amber` | `high_frequency_signal` | 75 | 4 | 0.053333 | 0.32 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 10 | `alliaceous` | `tropical_fruit` | `high_frequency_signal` | 73 | 3 | 0.041096 | 0.241644 | 3 | 0.05 | 0.35 | 0 | `normalized_support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 11 | `bready` | `balsamic_resin` | `high_frequency_signal` | 52 | 2 | 0.038462 | 0.177692 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 12 | `cooked` | `tropical_fruit` | `high_frequency_signal` | 51 | 2 | 0.039216 | 0.178824 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 13 | `hazelnut` | `tropical_fruit` | `high_frequency_signal` | 46 | 2 | 0.043478 | 0.185217 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 14 | `fir_needle` | `amber` | `high_frequency_signal` | 45 | 3 | 0.066667 | 0.28 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 15 | `fishy` | `musky` | `high_frequency_signal` | 42 | 2 | 0.047619 | 0.191429 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 16 | `marine` | `amber` | `high_frequency_signal` | 39 | 3 | 0.076923 | 0.295385 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 17 | `potato` | `citrus_fresh` | `high_frequency_signal` | 39 | 2 | 0.051282 | 0.196923 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 18 | `alcoholic` | `tropical_fruit` | `high_frequency_signal` | 34 | 3 | 0.088235 | 0.312353 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 19 | `maple` | `red_fruit` | `high_frequency_signal` | 34 | 2 | 0.058824 | 0.208235 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 20 | `cabbage` | `tropical_fruit` | `high_frequency_signal` | 32 | 2 | 0.0625 | 0.21375 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 21 | `orchid` | `floral_rose` | `high_frequency_signal` | 31 | 3 | 0.096774 | 0.325161 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 22 | `nut` | `floral_rose` | `high_frequency_signal` | 31 | 2 | 0.064516 | 0.216774 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 23 | `nut_skin` | `tropical_fruit` | `high_frequency_signal` | 30 | 3 | 0.1 | 0.33 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 24 | `currant_bud_black_currant_bud` | `citrus_fresh` | `high_frequency_signal` | 29 | 3 | 0.103448 | 0.335172 | 3 | 0.05 | 0.35 | 0 | `placement_score_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 25 | `brothy` | `orchard_fruit` | `high_frequency_signal` | 29 | 2 | 0.068966 | 0.223448 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 26 | `tangerine` | `citrus_fresh` | `high_frequency_signal` | 29 | 2 | 0.068966 | 0.223448 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 27 | `toasted` | `amber` | `high_frequency_signal` | 29 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 28 | `meaty_roasted_meaty` | `citrus_fresh` | `high_frequency_signal` | 25 | 1 | 0.04 | 0.12 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 29 | `radish` | `tropical_fruit` | `high_frequency_signal` | 24 | 2 | 0.083333 | 0.245 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 30 | `coffee_roasted_coffee` | `citrus_fresh` | `high_frequency_signal` | 24 | 1 | 0.041667 | 0.1225 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 31 | `rancid` | `tropical_fruit` | `high_frequency_signal` | 23 | 2 | 0.086957 | 0.250435 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 32 | `almond_bitter_almond` | `fresh_spice` | `high_frequency_signal` | 21 | 2 | 0.095238 | 0.262857 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 33 | `peanut` | `woody_dry` | `high_frequency_signal` | 21 | 2 | 0.095238 | 0.262857 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 34 | `popcorn` | `amber` | `high_frequency_signal` | 21 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 35 | `beefy` | `citrus_fresh` | `high_frequency_signal` | 20 | 2 | 0.1 | 0.27 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 36 | `brandy` | `tropical_fruit` | `high_frequency_signal` | 20 | 2 | 0.1 | 0.27 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 37 | `rubbery` | `floral_rose` | `high_frequency_signal` | 20 | 2 | 0.1 | 0.27 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 38 | `corn` | `leathery` | `high_frequency_signal` | 20 | 1 | 0.05 | 0.135 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 39 | `onion_green_onion` | `amber` | `high_frequency_signal` | 20 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 40 | `ammoniacal` | `amber` | `moderate_frequency_signal` | 19 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 41 | `mustard` | `amber` | `moderate_frequency_signal` | 19 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 42 | `malty` | `warm_spice` | `moderate_frequency_signal` | 18 | 2 | 0.111111 | 0.286667 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 43 | `humus` | `amber` | `moderate_frequency_signal` | 17 | 2 | 0.117647 | 0.296471 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 44 | `walnut` | `balsamic_resin` | `moderate_frequency_signal` | 16 | 1 | 0.0625 | 0.15375 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 45 | `tagette` | `amber` | `moderate_frequency_signal` | 16 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 46 | `asparagus` | `leafy_green` | `moderate_frequency_signal` | 15 | 2 | 0.133333 | 0.32 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 47 | `tallow` | `orchard_fruit` | `moderate_frequency_signal` | 15 | 2 | 0.133333 | 0.32 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 48 | `fenugreek` | `balsamic_resin` | `moderate_frequency_signal` | 15 | 1 | 0.066667 | 0.16 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 49 | `eggy` | `amber` | `moderate_frequency_signal` | 15 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 50 | `cardamom` | `warm_spice` | `moderate_frequency_signal` | 14 | 2 | 0.142857 | 0.334286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 51 | `fried` | `floral_rose` | `moderate_frequency_signal` | 14 | 2 | 0.142857 | 0.334286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 52 | `saffron` | `floral_rose` | `moderate_frequency_signal` | 14 | 2 | 0.142857 | 0.334286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 53 | `pepper` | `citrus_fresh` | `moderate_frequency_signal` | 14 | 1 | 0.071429 | 0.167143 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 54 | `valerian_root` | `amber` | `moderate_frequency_signal` | 14 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 55 | `artichoke` | `floral_rose` | `moderate_frequency_signal` | 13 | 2 | 0.153846 | 0.350769 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 56 | `passion` | `citrus_fresh` | `moderate_frequency_signal` | 13 | 2 | 0.153846 | 0.350769 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 57 | `cereal` | `orchard_fruit` | `moderate_frequency_signal` | 13 | 1 | 0.076923 | 0.175385 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 58 | `wasabi` | `fresh_spice` | `moderate_frequency_signal` | 13 | 1 | 0.076923 | 0.175385 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 59 | `pennyroyal` | `warm_spice` | `moderate_frequency_signal` | 12 | 2 | 0.166667 | 0.37 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 60 | `marjoram` | `citrus_bitter` | `moderate_frequency_signal` | 12 | 1 | 0.083333 | 0.185 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 61 | `parsley` | `floral_rose` | `moderate_frequency_signal` | 12 | 1 | 0.083333 | 0.185 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 62 | `corn_chip` | `amber` | `moderate_frequency_signal` | 12 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 63 | `hazelnut_roasted_hazelnut` | `amber` | `moderate_frequency_signal` | 12 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 64 | `onion_cooked_onion` | `amber` | `moderate_frequency_signal` | 12 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 65 | `peanut_roasted_peanut` | `amber` | `moderate_frequency_signal` | 12 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 66 | `wormwood` | `amber` | `moderate_frequency_signal` | 12 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 67 | `forest` | `woody_dry` | `moderate_frequency_signal` | 11 | 2 | 0.181818 | 0.392727 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 68 | `tea_green_tea` | `floral_white` | `moderate_frequency_signal` | 11 | 2 | 0.181818 | 0.392727 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 69 | `galanga` | `warm_spice` | `moderate_frequency_signal` | 11 | 1 | 0.090909 | 0.196364 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 70 | `molass` | `floral_rose` | `moderate_frequency_signal` | 11 | 1 | 0.090909 | 0.196364 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 71 | `turmeric` | `amber` | `moderate_frequency_signal` | 11 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 72 | `acrylate` | `tropical_fruit` | `moderate_frequency_signal` | 10 | 2 | 0.2 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 73 | `pepper_black_pepper` | `warm_spice` | `moderate_frequency_signal` | 10 | 2 | 0.2 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 74 | `fir` | `citrus_fresh` | `moderate_frequency_signal` | 10 | 1 | 0.1 | 0.21 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 75 | `hop` | `vanilla` | `moderate_frequency_signal` | 10 | 1 | 0.1 | 0.21 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 76 | `needle` | `citrus_fresh` | `moderate_frequency_signal` | 10 | 1 | 0.1 | 0.21 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 77 | `sugar_burnt_sugar` | `red_fruit` | `moderate_frequency_signal` | 10 | 1 | 0.1 | 0.21 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 78 | `pork` | `amber` | `moderate_frequency_signal` | 10 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 79 | `cananga` | `floral_white` | `baseline_frequency_signal` | 9 | 2 | 0.222222 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 80 | `flesh` | `floral_rose` | `baseline_frequency_signal` | 9 | 2 | 0.222222 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 81 | `root_beer` | `fresh_spice` | `baseline_frequency_signal` | 9 | 2 | 0.222222 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 82 | `sugar_brown_sugar` | `red_fruit` | `baseline_frequency_signal` | 9 | 2 | 0.222222 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 83 | `acetic` | `citrus_fresh` | `baseline_frequency_signal` | 9 | 1 | 0.111111 | 0.226667 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 84 | `algae` | `amber` | `baseline_frequency_signal` | 9 | 1 | 0.111111 | 0.226667 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 85 | `seashore` | `amber` | `baseline_frequency_signal` | 9 | 1 | 0.111111 | 0.226667 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 86 | `truffle` | `citrus_bitter` | `baseline_frequency_signal` | 9 | 1 | 0.111111 | 0.226667 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 87 | `chip` | `amber` | `baseline_frequency_signal` | 9 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 88 | `cherry_maraschino_cherry` | `vanilla` | `baseline_frequency_signal` | 8 | 2 | 0.25 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 89 | `freesia` | `floral_rose` | `baseline_frequency_signal` | 8 | 2 | 0.25 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 90 | `styrene` | `amber` | `baseline_frequency_signal` | 8 | 2 | 0.25 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 91 | `costus` | `amber` | `baseline_frequency_signal` | 8 | 1 | 0.125 | 0.2475 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 92 | `goaty` | `amber` | `baseline_frequency_signal` | 8 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 93 | `butterscotch` | `tropical_fruit` | `baseline_frequency_signal` | 7 | 2 | 0.285714 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 94 | `carrot_seed` | `warm_spice` | `baseline_frequency_signal` | 7 | 2 | 0.285714 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 95 | `seed` | `musky` | `baseline_frequency_signal` | 7 | 2 | 0.285714 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 96 | `baked` | `red_fruit` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 97 | `balsam` | `amber` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 98 | `barley_roasted_barley` | `vanilla` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 99 | `beeswax` | `amber` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 100 | `davana` | `leathery` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 101 | `fig` | `floral_rose` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 102 | `linden_flower` | `floral_white` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 103 | `mace` | `citrus_bitter` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 104 | `pomegranate` | `tropical_fruit` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 105 | `prune` | `orchard_fruit` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 106 | `tolu` | `amber` | `baseline_frequency_signal` | 7 | 1 | 0.142857 | 0.274286 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 107 | `asafetida` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 108 | `boronia` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 109 | `immortelle` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 110 | `moldy` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 111 | `potato_baked_potato` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 112 | `seafood` | `amber` | `baseline_frequency_signal` | 7 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 113 | `cornmint` | `fresh_spice` | `baseline_frequency_signal` | 6 | 2 | 0.333333 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 114 | `urine` | `musky` | `baseline_frequency_signal` | 6 | 2 | 0.333333 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 115 | `acetone` | `fresh_spice` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 116 | `curry` | `woody_dry` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 117 | `fresh_outdoor` | `floral_white` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 118 | `grilled` | `floral_rose` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 119 | `maraschino` | `vanilla` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 120 | `painty` | `floral_white` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 121 | `potato_raw_potato` | `leafy_green` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 122 | `reseda` | `floral_rose` | `baseline_frequency_signal` | 6 | 1 | 0.166667 | 0.31 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 123 | `lamb` | `amber` | `baseline_frequency_signal` | 6 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 124 | `fruit_ripe_fruit` | `tropical_fruit` | `baseline_frequency_signal` | 5 | 2 | 0.4 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 125 | `mahogany` | `amber` | `baseline_frequency_signal` | 5 | 2 | 0.4 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 126 | `sappy` | `warm_spice` | `baseline_frequency_signal` | 5 | 2 | 0.4 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 127 | `woody_burnt_wood` | `amber` | `baseline_frequency_signal` | 5 | 2 | 0.4 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 128 | `agarwood` | `amber` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 129 | `bell` | `citrus_fresh` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 130 | `bread_baked` | `red_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 131 | `cheese` | `orchard_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 132 | `chocolate_dark_chocolate` | `floral_rose` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 133 | `cider` | `tropical_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 134 | `citrus_rind` | `orchard_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 135 | `durian` | `red_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 136 | `gooseberry` | `floral_rose` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 137 | `grain_toasted_grain` | `vanilla` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 138 | `mutton` | `orchard_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 139 | `origanum` | `citrus_fresh` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 140 | `skunk` | `citrus_fresh` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 141 | `soft` | `floral_white` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 142 | `soup` | `citrus_fresh` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 143 | `sweet_pea` | `floral_rose` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 144 | `taco` | `tropical_fruit` | `baseline_frequency_signal` | 5 | 1 | 0.2 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 145 | `acorn` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 146 | `beefy_roasted_beefy` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 147 | `mastic` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 148 | `sarsaparilla` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 149 | `scallion` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 150 | `umami` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 151 | `zedoary` | `amber` | `baseline_frequency_signal` | 5 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 152 | `autumn` | `floral_white` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 153 | `cascarilla` | `amber` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 154 | `fat` | `orchard_fruit` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 155 | `licorice_black_licorice` | `fresh_spice` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 156 | `loganberry` | `tropical_fruit` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 157 | `pear_skin` | `tropical_fruit` | `baseline_frequency_signal` | 4 | 2 | 0.5 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 158 | `almond_roasted_almond` | `tropical_fruit` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 159 | `banana_peel` | `orchard_fruit` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 160 | `bread_crust` | `vanilla` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 161 | `chicken_coup` | `orchard_fruit` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 162 | `genet` | `citrus_fresh` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 163 | `hay_new_mown_hay` | `fresh_spice` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 164 | `hibiscus` | `amber` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 165 | `lettuce` | `tropical_fruit` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 166 | `osmanthus` | `floral_white` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 167 | `spruce` | `citrus_fresh` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 168 | `tea_black_tea` | `red_fruit` | `baseline_frequency_signal` | 4 | 1 | 0.25 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 169 | `buttermilk` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 170 | `chicory` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 171 | `dark` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 172 | `deertongue` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 173 | `hyssop` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 174 | `leek` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 175 | `marigold` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 176 | `peanut_butter` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 177 | `shellfish` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 178 | `turnup` | `amber` | `baseline_frequency_signal` | 4 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 179 | `elderberry` | `tropical_fruit` | `baseline_frequency_signal` | 3 | 2 | 0.666667 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 180 | `graham_cracker` | `vanilla` | `baseline_frequency_signal` | 3 | 2 | 0.666667 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 181 | `marshmallow` | `vanilla` | `baseline_frequency_signal` | 3 | 2 | 0.666667 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 182 | `alfalfa` | `orchard_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 183 | `apple_cooked_apple` | `floral_rose` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 184 | `bouillon` | `fresh_spice` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 185 | `bread_rye_bread` | `fresh_spice` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 186 | `calamus` | `warm_spice` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 187 | `cookie` | `floral_white` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 188 | `egg` | `tropical_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 189 | `elderflower` | `floral_white` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 190 | `melon_unripe_melon` | `orchard_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 191 | `nog` | `tropical_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 192 | `potato_chip` | `musky` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 193 | `pumpkin` | `orchard_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 194 | `quince` | `orchard_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 195 | `salty` | `red_fruit` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 196 | `sandy` | `woody_mossy` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 197 | `sesame` | `balsamic_resin` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 198 | `starfruit` | `floral_white` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 199 | `substantivity` | `floral_white` | `baseline_frequency_signal` | 3 | 1 | 0.333333 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 200 | `beef_juice` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 201 | `bloody` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 202 | `broccoli` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 203 | `chervil` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 204 | `clam` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 205 | `horehound` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 206 | `jonquil` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 207 | `limburger` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 208 | `nut_flesh` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 209 | `odorless` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 210 | `praline` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 211 | `salmon` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 212 | `tansy` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 213 | `vinegar` | `amber` | `baseline_frequency_signal` | 3 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 214 | `spike` | `herbal_green` | `baseline_frequency_signal` | 2 | 2 | 1 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 215 | `watermelon_rind` | `orchard_fruit` | `baseline_frequency_signal` | 2 | 2 | 1 | 0.42 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 216 | `arrack` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 217 | `bleu` | `orchard_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 218 | `bread` | `red_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 219 | `caper` | `amber` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 220 | `cubeb` | `warm_spice` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 221 | `egg_nog` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 222 | `isopropyl` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 223 | `macadamia` | `vanilla` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 224 | `marzipan` | `vanilla` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 225 | `mown` | `fresh_spice` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 226 | `new` | `fresh_spice` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 227 | `orange_rind` | `citrus_bitter` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 228 | `palmitate` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 229 | `petroleum` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 230 | `plum_skin` | `tropical_fruit` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 231 | `sausage_smoked_sausage` | `vanilla` | `baseline_frequency_signal` | 2 | 1 | 0.5 | 0.36 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 232 | `and_or` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 233 | `boysenberry` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 234 | `butter` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 235 | `cauliflower` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 236 | `cheesy_bleu_cheese` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 237 | `cheesy_parmesan_cheese` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 238 | `chocolate_milk_chocolate` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 239 | `cucumber_skin` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 240 | `date` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 241 | `description` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 242 | `filbert` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 243 | `flavor` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 244 | `fougere` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 245 | `found` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 246 | `from` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 247 | `heather` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 248 | `kumquat` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 249 | `lavender_spike_lavender` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 250 | `odor` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 251 | `other` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 252 | `pecan` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 253 | `rooibo` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 254 | `sauerkraut` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 255 | `spinach` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 256 | `tequila` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 257 | `tolu_balsam` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 258 | `tuna` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |
| 259 | `yogurt` | `amber` | `baseline_frequency_signal` | 2 | 0 | 0 | 0 | 3 | 0.05 | 0.35 | 0 | `support_below_threshold` | `medium` | `corpus` | `review_candidate_placement` |

---

*Phase 44 inventory artifact. This file is read-only planning evidence for Phase 45 and does not authorize curation mutation.*
