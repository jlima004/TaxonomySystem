# Phase 45 Batch 2 Selection

**Date:** 2026-06-03  
**Phase:** 45-batch-2-candidate-selection  
**Source:** `../44-remaining-low-support-inventory/44-LOW-SUPPORT-INVENTORY.md`

## Scope

Selection-only artifact for the 259 `corpus_candidate_low_support` inventory items from Phase 44. Exactly 40 candidates are selected for downstream Phase 46 decision-matrix work, and the remaining 219 are recorded with closed reason codes only.

## Selection Policy

- Applied D-02 through D-05: evidence priority filtered by semantic clarity, curation value, ambiguity risk, and bounded batch diversity.
- Frequency and placement evidence were used for prioritization, never as approval by themselves.
- Manual sanity review was applied to the highest-ranked pool before locking the final 40.
- This file is selection-only: no dispositions, no mutation flags, no taxonomy edits.

## Weighted Evidence Model

| Dimension | Weight | Application |
|---|---:|---|
| Evidence priority | 35% | `candidate_frequency` plus `placement_score`, normalized across the 259-item pool |
| Semantic clarity | 25% | Rewards clear olfactive descriptors; penalizes generic/process/noise terms |
| Curation value | 20% | Rewards perfumery/flavor materials and descriptors that improve coverage |
| Low polysemy / risk | 15% | Penalizes ambiguous terms and likely corpus artifacts |
| Batch diversity | 5% | Slight preference for subfamilies not already over-represented |

**Penalty rules applied:** corpus-artifact compounds, generic non-olfactive terms, food/off-note noise without standalone olfactive identity, near-duplicates of stronger candidates, and moderate penalties for candidates that would require new taxonomy structure.

## Selected Candidates

| # | Candidate | Inferred Subfamily | Frequency | Weighted Score | Selection Rationale |
|---:|---|---|---:|---:|---|
| 1 | `hay` | `amber` | 112 | 66.02 | Score 66.02 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — environmental note remains interpretable as a stable olfactive descriptor rather than generic prose |
| 2 | `coffee` | `vanilla` | 116 | 65.01 | Score 65.01 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 3 | `orri` | `amber` | 75 | 61.93 | Score 61.93 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 4 | `cananga` | `floral_white` | 9 | 61.57 | Score 61.57 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 5 | `carrot_seed` | `warm_spice` | 7 | 61.49 | Score 61.49 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 6 | `orchid` | `floral_rose` | 31 | 61.37 | Score 61.37 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 7 | `cornmint` | `fresh_spice` | 6 | 61.33 | Score 61.33 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 8 | `pennyroyal` | `warm_spice` | 12 | 61.15 | Score 61.15 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 9 | `asparagus` | `leafy_green` | 15 | 60.87 | Score 60.87 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 10 | `freesia` | `floral_rose` | 8 | 60.80 | Score 60.80 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 11 | `cardamom` | `warm_spice` | 14 | 60.76 | Score 60.76 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 12 | `malty` | `warm_spice` | 18 | 60.37 | Score 60.37 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 13 | `butterscotch` | `tropical_fruit` | 7 | 60.26 | Score 60.26 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 14 | `tangerine` | `citrus_fresh` | 29 | 60.04 | Score 60.04 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 15 | `saffron` | `floral_rose` | 14 | 59.98 | Score 59.98 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 16 | `hazelnut` | `tropical_fruit` | 46 | 57.25 | Score 57.25 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 17 | `forest` | `woody_dry` | 11 | 57.13 | Score 57.13 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — environmental note remains interpretable as a stable olfactive descriptor rather than generic prose |
| 18 | `cascarilla` | `amber` | 4 | 57.10 | Score 57.10 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 19 | `sesame` | `balsamic_resin` | 3 | 56.82 | Score 56.82 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 20 | `osmanthus` | `floral_white` | 4 | 56.66 | Score 56.66 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 21 | `cubeb` | `warm_spice` | 2 | 56.59 | Score 56.59 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 22 | `elderflower` | `floral_white` | 3 | 56.57 | Score 56.57 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 23 | `macadamia` | `vanilla` | 2 | 56.45 | Score 56.45 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 24 | `marzipan` | `vanilla` | 2 | 56.45 | Score 56.45 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — food-linked term still functions as a recognizable odor note with clear olfactive identity |
| 25 | `quince` | `orchard_fruit` | 3 | 56.40 | Score 56.40 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 26 | `curry` | `woody_dry` | 6 | 56.36 | Score 56.36 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 27 | `humus` | `amber` | 17 | 56.31 | Score 56.31 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — environmental note remains interpretable as a stable olfactive descriptor rather than generic prose |
| 28 | `davana` | `leathery` | 7 | 55.92 | Score 55.92 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 29 | `mace` | `citrus_bitter` | 7 | 55.85 | Score 55.85 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognized spice/aromatic material with clear perfumery or flavor relevance |
| 30 | `linden_flower` | `floral_white` | 7 | 55.57 | Score 55.57 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 31 | `pomegranate` | `tropical_fruit` | 7 | 54.44 | Score 54.44 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 32 | `agarwood` | `amber` | 5 | 52.74 | Score 52.74 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 33 | `hibiscus` | `amber` | 4 | 52.65 | Score 52.65 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established floral material/note with clear semantic identity |
| 34 | `orange_rind` | `citrus_bitter` | 2 | 52.26 | Score 52.26 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 35 | `balsam` | `amber` | 7 | 51.56 | Score 51.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 36 | `beeswax` | `amber` | 7 | 51.56 | Score 51.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 37 | `tolu` | `amber` | 7 | 51.56 | Score 51.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 38 | `acrylate` | `tropical_fruit` | 10 | 45.03 | Score 45.03 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — industrial/solvent-like odor term is recognizable and distinct, kept as a limited off-profile but clear olfactive descriptor |
| 39 | `tea_green_tea` | `floral_white` | 11 | 38.56 | Score 38.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 40 | `kumquat` | `amber` | 2 | 35.70 | Score 35.70 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |

## Not-Selected Summary

| Reason Code | Count | Example candidates |
|---|---:|---|
| `insufficient_evidence` | 52 | `toasted`, `popcorn`, `rubbery`, `mustard`, `tallow` |
| `high_polysemy` | 6 | `nut`, `passion`, `chip`, `marshmallow`, `bread` |
| `likely_corpus_artifact` | 37 | `currant_bud_black_currant_bud`, `meaty_roasted_meaty`, `coffee_roasted_coffee`, `almond_bitter_almond`, `onion_green_onion` |
| `generic_non_olfactive` | 20 | `cooked`, `fried`, `needle`, `seed`, `baked` |
| `needs_external_reference` | 12 | `tagette`, `galanga`, `asafetida`, `boronia`, `reseda` |
| `requires_new_taxonomy_structure` | 10 | `sulfurous`, `roasted`, `alliaceous`, `bready`, `marine` |
| `duplicate_or_near_duplicate` | 6 | `nutty`, `nut_skin`, `peanut`, `walnut`, `filbert` |
| `low_current_priority` | 29 | `fir_needle`, `maple`, `brandy`, `pepper`, `marjoram` |
| `out_of_scope_food_or_offnote` | 47 | `meaty`, `buttery`, `garlic`, `fishy`, `potato` |

## Not-Selected Full List

| Candidate | Reason Code |
|---|---|
| `acetic` | `low_current_priority` |
| `acetone` | `insufficient_evidence` |
| `acorn` | `insufficient_evidence` |
| `alcoholic` | `requires_new_taxonomy_structure` |
| `alfalfa` | `insufficient_evidence` |
| `algae` | `low_current_priority` |
| `alliaceous` | `requires_new_taxonomy_structure` |
| `almond_bitter_almond` | `likely_corpus_artifact` |
| `almond_roasted_almond` | `likely_corpus_artifact` |
| `ammoniacal` | `out_of_scope_food_or_offnote` |
| `and_or` | `likely_corpus_artifact` |
| `apple_cooked_apple` | `likely_corpus_artifact` |
| `arrack` | `out_of_scope_food_or_offnote` |
| `artichoke` | `out_of_scope_food_or_offnote` |
| `asafetida` | `needs_external_reference` |
| `autumn` | `generic_non_olfactive` |
| `baked` | `generic_non_olfactive` |
| `banana_peel` | `low_current_priority` |
| `barley_roasted_barley` | `likely_corpus_artifact` |
| `beef_juice` | `out_of_scope_food_or_offnote` |
| `beefy` | `out_of_scope_food_or_offnote` |
| `beefy_roasted_beefy` | `likely_corpus_artifact` |
| `bell` | `generic_non_olfactive` |
| `bleu` | `insufficient_evidence` |
| `bloody` | `out_of_scope_food_or_offnote` |
| `boronia` | `needs_external_reference` |
| `bouillon` | `insufficient_evidence` |
| `boysenberry` | `insufficient_evidence` |
| `brandy` | `low_current_priority` |
| `bread` | `high_polysemy` |
| `bread_baked` | `insufficient_evidence` |
| `bread_crust` | `low_current_priority` |
| `bread_rye_bread` | `likely_corpus_artifact` |
| `bready` | `requires_new_taxonomy_structure` |
| `broccoli` | `out_of_scope_food_or_offnote` |
| `brothy` | `out_of_scope_food_or_offnote` |
| `butter` | `out_of_scope_food_or_offnote` |
| `buttermilk` | `insufficient_evidence` |
| `buttery` | `out_of_scope_food_or_offnote` |
| `cabbage` | `out_of_scope_food_or_offnote` |
| `calamus` | `needs_external_reference` |
| `caper` | `insufficient_evidence` |
| `cauliflower` | `out_of_scope_food_or_offnote` |
| `cereal` | `insufficient_evidence` |
| `cheese` | `out_of_scope_food_or_offnote` |
| `cheesy_bleu_cheese` | `likely_corpus_artifact` |
| `cheesy_parmesan_cheese` | `likely_corpus_artifact` |
| `cherry_maraschino_cherry` | `likely_corpus_artifact` |
| `chervil` | `insufficient_evidence` |
| `chicken_coup` | `likely_corpus_artifact` |
| `chicory` | `insufficient_evidence` |
| `chip` | `high_polysemy` |
| `chocolate_dark_chocolate` | `likely_corpus_artifact` |
| `chocolate_milk_chocolate` | `likely_corpus_artifact` |
| `cider` | `low_current_priority` |
| `citrus_rind` | `low_current_priority` |
| `clam` | `out_of_scope_food_or_offnote` |
| `coffee_roasted_coffee` | `likely_corpus_artifact` |
| `cooked` | `generic_non_olfactive` |
| `cookie` | `low_current_priority` |
| `corn` | `out_of_scope_food_or_offnote` |
| `corn_chip` | `insufficient_evidence` |
| `costus` | `low_current_priority` |
| `cucumber_skin` | `insufficient_evidence` |
| `currant_bud_black_currant_bud` | `likely_corpus_artifact` |
| `dark` | `generic_non_olfactive` |
| `date` | `high_polysemy` |
| `deertongue` | `needs_external_reference` |
| `description` | `generic_non_olfactive` |
| `durian` | `insufficient_evidence` |
| `egg` | `out_of_scope_food_or_offnote` |
| `egg_nog` | `insufficient_evidence` |
| `eggy` | `out_of_scope_food_or_offnote` |
| `elderberry` | `low_current_priority` |
| `fat` | `insufficient_evidence` |
| `fenugreek` | `insufficient_evidence` |
| `fig` | `low_current_priority` |
| `filbert` | `duplicate_or_near_duplicate` |
| `fir` | `low_current_priority` |
| `fir_needle` | `low_current_priority` |
| `fishy` | `out_of_scope_food_or_offnote` |
| `flavor` | `generic_non_olfactive` |
| `flesh` | `out_of_scope_food_or_offnote` |
| `fougere` | `requires_new_taxonomy_structure` |
| `found` | `generic_non_olfactive` |
| `fresh_outdoor` | `generic_non_olfactive` |
| `fried` | `generic_non_olfactive` |
| `from` | `generic_non_olfactive` |
| `fruit_ripe_fruit` | `likely_corpus_artifact` |
| `galanga` | `needs_external_reference` |
| `garlic` | `out_of_scope_food_or_offnote` |
| `genet` | `needs_external_reference` |
| `goaty` | `insufficient_evidence` |
| `gooseberry` | `low_current_priority` |
| `graham_cracker` | `low_current_priority` |
| `grain_toasted_grain` | `likely_corpus_artifact` |
| `grilled` | `insufficient_evidence` |
| `hay_new_mown_hay` | `likely_corpus_artifact` |
| `hazelnut_roasted_hazelnut` | `likely_corpus_artifact` |
| `heather` | `insufficient_evidence` |
| `hop` | `insufficient_evidence` |
| `horehound` | `needs_external_reference` |
| `hyssop` | `insufficient_evidence` |
| `immortelle` | `insufficient_evidence` |
| `isopropyl` | `insufficient_evidence` |
| `jonquil` | `needs_external_reference` |
| `lamb` | `out_of_scope_food_or_offnote` |
| `lavender_spike_lavender` | `likely_corpus_artifact` |
| `leek` | `insufficient_evidence` |
| `lettuce` | `out_of_scope_food_or_offnote` |
| `licorice_black_licorice` | `likely_corpus_artifact` |
| `limburger` | `out_of_scope_food_or_offnote` |
| `loganberry` | `low_current_priority` |
| `mahogany` | `requires_new_taxonomy_structure` |
| `maple` | `low_current_priority` |
| `maraschino` | `low_current_priority` |
| `marigold` | `insufficient_evidence` |
| `marine` | `requires_new_taxonomy_structure` |
| `marjoram` | `low_current_priority` |
| `marshmallow` | `high_polysemy` |
| `mastic` | `insufficient_evidence` |
| `meaty` | `out_of_scope_food_or_offnote` |
| `meaty_roasted_meaty` | `likely_corpus_artifact` |
| `melon_unripe_melon` | `likely_corpus_artifact` |
| `molass` | `likely_corpus_artifact` |
| `moldy` | `insufficient_evidence` |
| `mown` | `generic_non_olfactive` |
| `mustard` | `insufficient_evidence` |
| `mutton` | `out_of_scope_food_or_offnote` |
| `needle` | `generic_non_olfactive` |
| `new` | `generic_non_olfactive` |
| `nog` | `out_of_scope_food_or_offnote` |
| `nut` | `high_polysemy` |
| `nut_flesh` | `insufficient_evidence` |
| `nut_skin` | `duplicate_or_near_duplicate` |
| `nutty` | `duplicate_or_near_duplicate` |
| `odor` | `generic_non_olfactive` |
| `odorless` | `out_of_scope_food_or_offnote` |
| `onion_cooked_onion` | `likely_corpus_artifact` |
| `onion_green_onion` | `likely_corpus_artifact` |
| `origanum` | `insufficient_evidence` |
| `other` | `generic_non_olfactive` |
| `painty` | `insufficient_evidence` |
| `palmitate` | `insufficient_evidence` |
| `parsley` | `insufficient_evidence` |
| `passion` | `high_polysemy` |
| `peanut` | `duplicate_or_near_duplicate` |
| `peanut_butter` | `out_of_scope_food_or_offnote` |
| `peanut_roasted_peanut` | `likely_corpus_artifact` |
| `pear_skin` | `low_current_priority` |
| `pecan` | `duplicate_or_near_duplicate` |
| `pepper` | `low_current_priority` |
| `pepper_black_pepper` | `likely_corpus_artifact` |
| `petroleum` | `out_of_scope_food_or_offnote` |
| `plum_skin` | `low_current_priority` |
| `popcorn` | `insufficient_evidence` |
| `pork` | `out_of_scope_food_or_offnote` |
| `potato` | `out_of_scope_food_or_offnote` |
| `potato_baked_potato` | `likely_corpus_artifact` |
| `potato_chip` | `insufficient_evidence` |
| `potato_raw_potato` | `likely_corpus_artifact` |
| `praline` | `insufficient_evidence` |
| `prune` | `insufficient_evidence` |
| `pumpkin` | `insufficient_evidence` |
| `radish` | `out_of_scope_food_or_offnote` |
| `rancid` | `out_of_scope_food_or_offnote` |
| `reseda` | `needs_external_reference` |
| `roasted` | `requires_new_taxonomy_structure` |
| `rooibo` | `likely_corpus_artifact` |
| `root_beer` | `low_current_priority` |
| `rubbery` | `insufficient_evidence` |
| `salmon` | `out_of_scope_food_or_offnote` |
| `salty` | `insufficient_evidence` |
| `sandy` | `insufficient_evidence` |
| `sappy` | `low_current_priority` |
| `sarsaparilla` | `low_current_priority` |
| `sauerkraut` | `out_of_scope_food_or_offnote` |
| `sausage_smoked_sausage` | `likely_corpus_artifact` |
| `scallion` | `insufficient_evidence` |
| `seafood` | `out_of_scope_food_or_offnote` |
| `seashore` | `low_current_priority` |
| `seed` | `generic_non_olfactive` |
| `shellfish` | `out_of_scope_food_or_offnote` |
| `skunk` | `out_of_scope_food_or_offnote` |
| `soft` | `generic_non_olfactive` |
| `soup` | `out_of_scope_food_or_offnote` |
| `spike` | `generic_non_olfactive` |
| `spinach` | `out_of_scope_food_or_offnote` |
| `spruce` | `low_current_priority` |
| `starfruit` | `insufficient_evidence` |
| `styrene` | `insufficient_evidence` |
| `substantivity` | `generic_non_olfactive` |
| `sugar_brown_sugar` | `likely_corpus_artifact` |
| `sugar_burnt_sugar` | `likely_corpus_artifact` |
| `sulfurous` | `requires_new_taxonomy_structure` |
| `sweet_pea` | `insufficient_evidence` |
| `taco` | `out_of_scope_food_or_offnote` |
| `tagette` | `needs_external_reference` |
| `tallow` | `insufficient_evidence` |
| `tansy` | `needs_external_reference` |
| `tea_black_tea` | `likely_corpus_artifact` |
| `tequila` | `out_of_scope_food_or_offnote` |
| `toasted` | `insufficient_evidence` |
| `tolu_balsam` | `insufficient_evidence` |
| `truffle` | `low_current_priority` |
| `tuna` | `out_of_scope_food_or_offnote` |
| `turmeric` | `insufficient_evidence` |
| `turnup` | `likely_corpus_artifact` |
| `umami` | `insufficient_evidence` |
| `urine` | `out_of_scope_food_or_offnote` |
| `valerian_root` | `requires_new_taxonomy_structure` |
| `vinegar` | `out_of_scope_food_or_offnote` |
| `walnut` | `duplicate_or_near_duplicate` |
| `wasabi` | `out_of_scope_food_or_offnote` |
| `watermelon_rind` | `low_current_priority` |
| `woody_burnt_wood` | `likely_corpus_artifact` |
| `wormwood` | `requires_new_taxonomy_structure` |
| `yogurt` | `out_of_scope_food_or_offnote` |
| `zedoary` | `needs_external_reference` |

## Selection Summary

- Selected candidates: **40**
- Not-selected candidates: **219**
- Total accounted for: **259**
- Selected subfamily distribution: `amber`=10, `balsamic_resin`=1, `citrus_bitter`=2, `citrus_fresh`=1, `floral_rose`=3, `floral_white`=5, `fresh_spice`=1, `leafy_green`=1, `leathery`=1, `orchard_fruit`=1, `tropical_fruit`=4, `vanilla`=3, `warm_spice`=5, `woody_dry`=2

## Zero-Mutation Confirmation

- No dispositions were assigned in this artifact.
- No mutation flag fields are present.
- No taxonomy, alias, compiled artifact, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI files were modified.
- Output is limited to Phase 45 selection documentation for downstream Phase 46 review.
