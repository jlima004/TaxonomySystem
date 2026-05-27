# Phase 22 — Research: Review Queue Conflict Triage for v2.2

**Researched:** 2026-05-27
**Domain:** Taxonomy v2.2 seed_corpus_conflict triage
**Confidence:** HIGH (data sourced from `data/compiled/v2/similarity_matrix.json` review_queue, live at v2.1.0)

---

## Research Boundaries

- **Read-only** inspection of `data/compiled/v2/similarity_matrix.json` review_queue.
- **316 total items:** 34 `seed_corpus_conflict`, 282 `corpus_candidate_low_support`.
- **Line-by-line triage of 282 low-support items is out of scope** (per Phase 14 precedent).
- **No mutation, no curation, no compile, no Graphify.**

---

## Current Review Queue State (v2.1.0 compiled)

| Metric | Value |
|--------|-------|
| Total review queue | 316 |
| `seed_corpus_conflict` | 34 |
| `corpus_candidate_low_support` | 282 |
| Severity | 316 × medium |

**Delta from Phase 14 baseline (v2.0.0):**
- Total: 317 → 316 (−1, `petitgrain` promoted to seed)
- `seed_corpus_conflict`: 33 → 34 (+1, new `petitgrain↔grain`)
- `corpus_candidate_low_support`: 284 → 282 (−2, `petitgrain` removed from low-support + 1 other)

---

## Seed Corpus Conflict — Full Inventory (34 items)

All items share:
- `confidence: 0.5`
- `reason`: "corpus descriptor overlaps a seed descriptor but remains review-only"
- `suggested_action`: "review_corpus_candidate_against_seed_anchor"

### Grouped by Seed Anchor

#### Anchor: `amber` (1 item)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `ambergri` | 46 | amber | amber_resinous |

**Pattern:** `valid variant` — close orthographic variant of "ambergris". Low risk.

#### Anchor: `bitter_orange` (3 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `bitter` | 78 | citrus_bitter | citrus |
| `orange_bitter_orange` | 6 | citrus_bitter | citrus |
| `orange` | 149 | citrus_bitter | citrus |

**Pattern:** `overly broad corpus token` (bitter, orange) + `valid variant` (orange_bitter_orange).
- `bitter`: generic quality, 78 hits — noise artifact
- `orange`: generic citrus, 149 hits — overly broad
- `orange_bitter_orange`: compound variant, 6 hits — valid variant

#### Anchor: `grapefruit` (3 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `fruit` | 52 | citrus_fresh | citrus |
| `grape` | 76 | citrus_fresh | citrus |
| `grapefruit_peel` | 8 | citrus_fresh | citrus |

**Pattern:** `overly broad corpus token` (fruit, grape) + `valid variant` (grapefruit_peel).
- `fruit`: generic, 52 hits — noise artifact
- `grape`: different fruit, 76 hits — semantic mismatch / substring overlap
- `grapefruit_peel`: valid variant, 8 hits — possible add_target candidate

#### Anchor: `petitgrain` (1 item) ⚠️ NEW
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `grain` | 14 | citrus_fresh | citrus |

**Pattern:** `substring/noise artifact`. "grain" is a substring of "petitgrain" and a generic token.
- Created by the Phase 20 add_target: `petitgrain` is now a seed descriptor, so its substring "grain" (which was a corpus descriptor) now triggers a conflict.
- `grain` (14 hits) is likely a generic/non-specific descriptor in context of perfumery — a noise artifact.
- **Primary candidate for `accepted_with_policy`** — grain is a common word that happens to overlap the new seed descriptor.

#### Anchor: `lemon` (2 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `lemon_peel` | 24 | citrus_fresh | citrus |
| `lemongrass` | 24 | citrus_fresh | citrus |

**Pattern:** `valid variant` (lemon_peel) + `semantic mismatch` (lemongrass).
- `lemon_peel`: legitimate specific variant of lemon — possible add_target candidate
- `lemongrass`: different plant (Cymbopogon), not a citrus — semantic mismatch

#### Anchor: `sweet_orange` (1 item)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `sweet` | 1459 | citrus_fresh | citrus |

**Pattern:** `overly broad corpus token`. "sweet" is a generic quality descriptor with very high corpus frequency (1459). Noise artifact. Clear `accepted_with_policy`.

#### Anchor: `rose` (5 items) 🔴 HIGH PRESSURE
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `boi_de_rose` | 33 | floral_rose | floral |
| `rose_dried_rose` | 3 | floral_rose | floral |
| `rose_red_rose` | 19 | floral_rose | floral |
| `rose_tea_rose` | 9 | floral_rose | floral |
| `rosemary` | 54 | floral_rose | floral |

**Pattern:** `valid variant` (rose_dried_rose, rose_red_rose, rose_tea_rose) + `overly broad` (boi_de_rose is Portuguese "rose wood") + `semantic mismatch` (rosemary).
- 3 compound rose descriptors: valid variants, possible add_target candidates
- `boi_de_rose`: is "bois de rose" — different from a rose note, semantic mismatch
- `rosemary`: herb, not a rose — clear semantic mismatch

#### Anchor: `lily_of_the_valley` (1 item)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `lily` | 51 | floral_white | floral |

**Pattern:** `substring/noise artifact` / `overly broad corpus token`. "lily" is a substring of "lily_of_the_valley". Also `lily` is a different flower genus. `accepted_with_policy` or possible alias candidate.

#### Anchor: `melon` (4 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `melon_rind` | 11 | orchard_fruit | fruity |
| `melon_unripe_melon` | 3 | orchard_fruit | fruity |
| `watermelon_rind` | 2 | orchard_fruit | fruity |
| `watermelon` | 14 | orchard_fruit | fruity |

**Pattern:** `valid variant` (melon_rind, melon_unripe_melon, watermelon_rind) + `semantic mismatch` (watermelon).
- `watermelon` vs. `melon`: distinct fruits, but both in orchard_fruit; low support (14). Debatable.
- Compound variants: low corpus count, valid variants — possible add_target candidates if evidence strengthens.

#### Anchor: `blackberry` (2 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `berry` | 227 | red_fruit | fruity |
| `black` | 35 | red_fruit | fruity |

**Pattern:** `overly broad corpus token`. "berry" and "black" are generic descriptors with high frequency. Noise artifacts. Clear `accepted_with_policy`.

#### Anchor: `strawberry` (1 item)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `raw` | 17 | red_fruit | fruity |

**Pattern:** `substring/noise artifact`. "raw" is a substring of "strawberry", generic. Noise artifact. `accepted_with_policy`.

#### Anchor: `pineapple` (2 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `apple` | 205 | tropical_fruit | fruity |
| `pine` | 120 | tropical_fruit | fruity |

**Pattern:** `overly broad corpus token` (apple) + `semantic mismatch` (pine).
- `apple`: generic fruit, 205 hits — substring overlap, noise
- `pine`: tree, not a fruit — semantic mismatch

#### Anchor: `banana` (3 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `banana_peel` | 4 | tropical_fruit | fruity |
| `banana_ripe_banana` | 4 | tropical_fruit | fruity |
| `banana_unripe_banana` | 11 | tropical_fruit | fruity |

**Pattern:** `valid variant`. All three are legitimate banana-specific descriptors. Low corpus counts. Possible add_target candidates if evidence warrants, but low frequency suggests `defer`.

#### Anchor: `tomato_leaf` (2 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `leaf` | 12 | leafy_green | green |
| `tomato` | 39 | leafy_green | green |

**Pattern:** `overly broad corpus token` (leaf) + `substring/noise artifact` (tomato).
- `leaf`: generic, 12 hits — noise artifact
- `tomato`: fruit, while seed is `tomato_leaf` — potential add_target candidate if tomato as fruit note is valid

#### Anchor: `clove` (1 item)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `clover` | 13 | warm_spice | spicy |

**Pattern:** `possible alias candidate`. "clover" is orthographically close to "clove" (1-char substitution). Could be a misspelling or a real descriptor for a different plant. Semantic mismatch likely.

#### Anchor: `cedarwood` (2 items)
| corpus_descriptor | corpus_count | subfamily | family |
|---|---|---|---|
| `cedar` | 83 | woody_dry | woody |
| `wood` | 25 | woody_dry | woody |

**Pattern:** `overly broad corpus token` (wood) + `possible alias candidate` (cedar).
- `wood`: generic, 25 hits — noise
- `cedar`: could be an alias/short form of `cedarwood` — possible alias candidate

---

## Aggregate Pattern Summary

| Pattern | Count | Items |
|---------|-------|-------|
| `valid variant` | ~13 | banana_peel, banana_ripe_banana, banana_unripe_banana, grapefruit_peel, lemon_peel, melon_rind, melon_unripe_melon, orange_bitter_orange, rose_dried_rose, rose_red_rose, rose_tea_rose, watermelon_rind |
| `semantic mismatch` | ~6 | clover, lemongrass, pine, rosemary, watermelon, boi_de_rose |
| `overly broad corpus token` | ~11 | apple, berry, bitter, black, fruit, leaf, orange, sweet, wood, cedar, grain |
| `substring/noise artifact` | ~4 | grain, lily, raw, tomato |
| `possible alias candidate` | ~2 | cedar↔cedarwood, clover↔clove |
| `possible add_target candidate` | ~4 | grapefruit_peel, lemon_peel, rose_dried_rose, rose_red_rose (debatable) |
| `accepted_with_policy` | ~12 | berry, black, bitter, fruit, grain, orange, raw, sweet, wood, leaf, apple, pine |
| `defer` | ~6 | banana_peel, banana_ripe_banana, banana_unripe_banana, melon_rind, melon_unripe_melon, watermelon_rind |

**Note:** Items may fit multiple patterns — classification is per primary semantic risk.

---

## Seed Anchor Risk Heat Map

| Risk Level | Anchor | Count | Rationale |
|------------|--------|-------|-----------|
| 🔴 HIGH | `rose` | 5 | Largest anchor group; 2 semantic mismatches (rosemary, boi_de_rose) + 3 compounds. Needs semantic judgment per Phase 14 RQ-REC-01. |
| 🔴 HIGH | `bitter_orange` | 3 | Generic overlaps (bitter, orange) create noise; `orange` (149) is high-impact. |
| 🟡 MEDIUM | `melon` | 4 | Watermelon vs. melon debate; 4 items with compound variants. |
| 🟡 MEDIUM | `grapefruit` | 3 | Generic overlap (fruit, grape) + 1 valid variant. |
| 🟡 MEDIUM | `pineapple` | 2 | Strong overlap from apple (205) and pine (120) — both generic. |
| 🟡 MEDIUM | `banana` | 3 | 3 valid variants with low corpus count; no urgency. |
| 🟢 LOW | `petitgrain` | 1 | New conflict, clear `accepted_with_policy`. |
| 🟢 LOW | `sweet_orange` | 1 | Generic "sweet" — clear noise. |
| 🟢 LOW | `lemon` | 2 | One valid variant, one semantic mismatch. |
| 🟢 LOW | `blackberry` | 2 | Generic berry/black — clear noise. |
| 🟢 LOW | `strawberry` | 1 | Substring "raw" — clear noise. |
| 🟢 LOW | `tomato_leaf` | 2 | Generic leaf/tomato — low risk. |
| 🟢 LOW | `clove` | 1 | Possible alias candidate. |
| 🟢 LOW | `cedarwood` | 2 | Overly broad + possible alias. |
| 🟢 LOW | `lily_of_the_valley` | 1 | Substring overlap. |
| 🟢 LOW | `amber` | 1 | Valid variant. |

---

## New Conflict Highlight: `petitgrain ↔ grain`

| Field | Value |
|-------|-------|
| Seed descriptor | `petitgrain` |
| Corpus descriptor | `grain` |
| Corpus count | 14 |
| Subfamily | citrus_fresh |
| Family | citrus |
| Introduced by | Phase 20 add_target (petitgrain promoted to seed) |

**Semantic assessment:** "grain" as a perfumery descriptor is highly generic — could refer to texture, a type of note, or be unrelated. The overlap is purely substring-based. This is a textbook `accepted_with_policy` item.

**Cross-reference with Phase 20:** Phase 20's `petitgrain` add_target was correctly executed. The `grain` corpus descriptor was already in the corpus before the promotion — it only became a conflict after `petitgrain` became a seed descriptor. This is expected behavior: adding a seed descriptor can surface new substring conflicts. No action needed.

---

## Cross-Reference with Phase 14

| Phase 14 Finding | Phase 22 Status |
|-----------------|-----------------|
| RQ-REC-01: `rose`, `melon`, `banana`, `bitter_orange`, `grapefruit` need semantic judgment | Confirmed. Rose (5) and bitter_orange (3) remain highest risk. |
| RQ-REC-04: `accepted_with_policy` — conflicts are visible but do not invalidate curated seed truth | Confirmed. Applied to ~12 items in Phase 22 analysis. |
| Phase 14 baseline: 33 seed_corpus_conflict | Now 34 (+1 petitgrain↔grain). |
| Phase 14: full-line-by-line not required for first triage | Honored. 282 low-support items not triaged. |
| Phase 14: grouped by subfamily and seed anchor | Expanded grouping includes semantic pattern classification. |

---

## Assumptions

1. The corpus descriptor `grain` in `citrus_fresh` is a generic token unrelated to petitgrain (trigonometric substring overlap). If `grain` is actually a valid perfumery note in citrus context, this needs reclassification.
2. `boi_de_rose` is intended as "bois de rose" (rosewood), not a rose note. If the corpus incorrectly classifies it as floral_rose, the placement may need correction.
3. Compounds like `lemon_peel`, `grapefruit_peel` are legitimate olfactory descriptors. If corpus usage shows they're extraction artifacts rather than intentional notes, reclassification may be needed.
