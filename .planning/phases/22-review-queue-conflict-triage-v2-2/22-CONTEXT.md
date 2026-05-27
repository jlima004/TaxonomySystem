# Phase 22 Context — Review Queue Conflict Triage for v2.2

> **Canonical context document.** Downstream agents must use this as the authoritative Phase 22 decision source.
> Context gathered 2026-05-27. Execution readiness: `not_ready_for_execution`.

## Phase Boundary

Phase 22 triages the remaining review queue after v2.1.0 release. Primary focus: `seed_corpus_conflict` items (34). Secondary front: `corpus_candidate_low_support` (282) after conflict matrix is complete.

**Mode:** `planning_only` / `read_only_triage`. No curation, no mutation, no compile, no publication.

### Protected Paths (read-only)

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/inference/semantic_noise.v1.json`
- `data/compiled/v1/**`
- `data/compiled/v2/**`
- `src/cli/parse_args.ts`
- `scripts/check-safety-guards.sh`
- `src/package.json`
- `graphify-out/*`

### Not Authorized

- Descriptor promotion or rejection
- Alias add/remove/remap
- Relation or accord mutation
- Official artifact regeneration or overwrite
- `DEFAULT_PATHS` change
- Graphify run
- Curatorial execution of any kind

## v2.1.0 Closure Summary

- `petitgrain` promoted to seed v2 under `citrus/citrus_fresh`
- Compiled v2 artifacts published with version 2.1.0
- `ylang ylang -> ylang_ylang` remains `accepted_exception_interim`
- `petit grain -> petitgrain` alias now target-valid (resolved in Phase 20)
- Review queue: 316 items (was 317 pre-v2.1)
- Full tests: 53 / 373 PASS

## Review Queue Current State

Source: `data/compiled/v2/similarity_matrix.json` review_queue.

| metric | value |
|---|---|
| Total | 316 |
| `corpus_candidate_low_support` | 282 |
| `seed_corpus_conflict` | 34 |
| Severity: medium | 316 |

### `seed_corpus_conflict` (34 items)

All items have `confidence: 0.5`, reason `"corpus descriptor overlaps a seed descriptor but remains review-only"`.

| family | subfamily | seed_descriptor | corpus_descriptor | corpus_count |
|---|---|---|---|---|
| amber_resinous | amber | `amber` | `ambergri` | 46 |
| citrus | citrus_bitter | `bitter_orange` | `bitter` | 78 |
| citrus | citrus_bitter | `bitter_orange` | `orange_bitter_orange` | 6 |
| citrus | citrus_bitter | `bitter_orange` | `orange` | 149 |
| citrus | citrus_fresh | `grapefruit` | `fruit` | 52 |
| citrus | citrus_fresh | `petitgrain` | `grain` | 14 |
| citrus | citrus_fresh | `grapefruit` | `grape` | 76 |
| citrus | citrus_fresh | `grapefruit` | `grapefruit_peel` | 8 |
| citrus | citrus_fresh | `lemon` | `lemon_peel` | 24 |
| citrus | citrus_fresh | `lemon` | `lemongrass` | 24 |
| citrus | citrus_fresh | `sweet_orange` | `sweet` | 1459 |
| floral | floral_rose | `rose` | `boi_de_rose` | 33 |
| floral | floral_rose | `rose` | `rose_dried_rose` | 3 |
| floral | floral_rose | `rose` | `rose_red_rose` | 19 |
| floral | floral_rose | `rose` | `rose_tea_rose` | 9 |
| floral | floral_rose | `rose` | `rosemary` | 54 |
| floral | floral_white | `lily_of_the_valley` | `lily` | 51 |
| fruity | orchard_fruit | `melon` | `melon_rind` | 11 |
| fruity | orchard_fruit | `melon` | `melon_unripe_melon` | 3 |
| fruity | orchard_fruit | `melon` | `watermelon_rind` | 2 |
| fruity | orchard_fruit | `melon` | `watermelon` | 14 |
| fruity | red_fruit | `blackberry` | `berry` | 227 |
| fruity | red_fruit | `blackberry` | `black` | 35 |
| fruity | red_fruit | `strawberry` | `raw` | 17 |
| fruity | tropical_fruit | `pineapple` | `apple` | 205 |
| fruity | tropical_fruit | `banana` | `banana_peel` | 4 |
| fruity | tropical_fruit | `banana` | `banana_ripe_banana` | 4 |
| fruity | tropical_fruit | `banana` | `banana_unripe_banana` | 11 |
| fruity | tropical_fruit | `pineapple` | `pine` | 120 |
| green | leafy_green | `tomato_leaf` | `leaf` | 12 |
| green | leafy_green | `tomato_leaf` | `tomato` | 39 |
| spicy | warm_spice | `clove` | `clover` | 13 |
| woody | woody_dry | `cedarwood` | `cedar` | 83 |
| woody | woody_dry | `cedarwood` | `wood` | 25 |

### `corpus_candidate_low_support` (282 items)

Distribution by subfamily:

| subfamily | count | dominant reason |
|---|---|---|
| amber | 109 | support_below_threshold |
| tropical_fruit | 28 | support_below_threshold |
| floral_rose | 24 | support_below_threshold |
| citrus_fresh | 23 | support_below_threshold |
| orchard_fruit | 20 | support_below_threshold |
| vanilla | 15 | support_below_threshold |
| floral_white | 12 | support_below_threshold |
| warm_spice | 12 | support_below_threshold |
| fresh_spice | 10 | support_below_threshold |
| red_fruit | 9 | support_below_threshold |
| leathery | 5 | support_below_threshold |
| musky | 4 | support_below_threshold |
| leafy_green | 3 | support_below_threshold |
| woody_mossy | 3 | support_below_threshold |
| citrus_bitter | 3 | support_below_threshold |
| balsamic_resin | 2 | support_below_threshold |

Reason distribution:

| reason | count |
|---|---|
| support_below_threshold | 266 |
| placement_score_below_threshold | 8 |
| normalized_support_below_threshold | 8 |

## Aliases State (v2.1.0)

- 11 aliases in `descriptor_aliases.seed.json`
- 9 point to present seed targets
- `ylang ylang -> ylang_ylang`: `accepted_exception_interim` (no add_target in v2.1)
- `petit grain -> petitgrain`: target-valid since Phase 20 (petitgrain added to seed)

## Key Decisions from Upstream Phases

1. **Phase 14**: Actionability-first review queue triage. `seed_corpus_conflict` is an attention group, not auto-blocker or auto-fix. Full line-by-line classification not required for first triage.
2. **Phase 14, RQ-REC-01**: `seed_corpus_conflict` groups for `rose`, `melon`, `banana`, `bitter_orange`, `grapefruit` need semantic judgment before any disposition.
3. **Phase 14, RQ-REC-04**: `accepted_with_policy` — conflicts are visible but do not invalidate curated seed truth.
4. **Phase 20**: `petitgrain` add_target only; `ylang_ylang` explicitly not added; no compile executed.
5. **Phase 21**: Official v2.1 publication complete; review queue at 316.
6. **Phase 21 compile validation**: 3 warnings (seed_corpus_conflict, corpus_candidate_low_support) — all non-blocking, accepted by governance.

## Phase 22 Scope

### Primary: `seed_corpus_conflict` triage

For each of the 34 items (grouped by seed anchor and subfamily):

- Classify risk level (semantic mismatch vs. valid variant vs. corpus noise)
- Assess evidence strength (corpus_count, confidence, frequency)
- Determine possible actions (add_target, alias remap, accepted_with_policy, non_actionable)
- Identify v2.2 candidates vs. deferrals

### Secondary: `corpus_candidate_low_support` triage

- Group by subfamily and reason
- Identify items that share seeds/anchors with conflict groups
- Classify by actionability (insufficient_evidence, manual_review_pack, phase_15_candidate)

### Deliverable

Matriz de triagem (decision matrix) for v2.2 — no mutation, no execution.

## Constraints

- Não alterar `data/taxonomy/*`.
- Não alterar `data/inference/*`.
- Não alterar `data/compiled/v1/*`.
- Não alterar `data/compiled/v2/*`.
- Não alterar `src/cli/parse_args.ts`.
- Não alterar `scripts/check-safety-guards.sh`.
- Não alterar `src/package.json`.
- Não alterar, limpar, regenerar, stagear ou commitar `graphify-out/*`.
- Não executar curadoria.
- Não publicar artifacts.
- Não rodar compile oficial.
- Não rodar Graphify.
