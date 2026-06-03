# Phase 46: Batch 2 Decision Matrix - Research

**Researched:** 2026-06-03  
**Domain:** documentation-only taxonomy curation decision matrix  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

Phase 46 is **decide-only**. It assigns formal, evidence-backed dispositions and `mutation_allowed` gates for exactly the 40 candidates selected in Phase 45, producing a parseable decision matrix before any curation mutation. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Phase 46 may create or update Phase 46 planning artifacts (primarily `46-DECISION-MATRIX.md`). It must **not** mutate taxonomy seeds, aliases, compiled artifacts, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI. It must not reopen `seed_corpus_conflict` items. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Use these six disposition values on every matrix row: `promote_to_seed`, `add_alias`, `reject`, `defer_manual_review`, `defer_future_batch`, `needs_external_reference`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

`mutation_allowed=true` only when disposition is `promote_to_seed` or `add_alias`, required targets are complete, target family/subfamily already exist, no stretch placement exists, confidence is `medium_high` or `high`, investigation depth is at least `targeted_check`, rationale/evidence are documented, and `phase47_instruction` is explicit/mechanical. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Rows with `reject`, `defer_manual_review`, `defer_future_batch`, or `needs_external_reference` must always have `mutation_allowed=false`, and rows with `mutation_allowed=false` must have `phase47_instruction` exactly `none`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

No new families or subfamilies may be created, and no weak/stretch placements may be promoted. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Required artifact: `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md`, parseable Markdown with exactly 40 rows, ids `01`-`40`, one per Phase 45 selection rank. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Minimum required columns: `id`, `candidate`, `source_phase45_rank`, `phase45_inferred_subfamily`, `disposition`, `mutation_allowed`, `target_family`, `target_subfamily`, `target_descriptor`, `alias_target`, `confidence`, `investigation_depth`, `rationale`, `evidence`, `phase47_instruction`. Recommended extra columns: `expected_effect`, `notes`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Allowed `confidence` values are exactly `low`, `medium_high`, and `high`; do not use `medium`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Truncated or ambiguous descriptors such as `orri` default to `needs_external_reference`, `mutation_allowed=false`, `deep_check`; do not infer canonical forms from plausibility alone. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

Food-linked candidates are caution-tier; food association alone is never promotion evidence. Off-note/industrial candidates are high-caution; `acrylate` should prefer `needs_external_reference` or `defer_manual_review` unless safe existing fit is proven. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

### the agent's Discretion

- Exact literal strings for mechanical `phase47_instruction` values (planner aligns with Phase 42 parser conventions). [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DEC-01 | Curator can produce a decision matrix for every selected candidate before mutation. | Use the exact 40 Phase 45 rows listed below; verify row count and 1:1 mapping before closure. [CITED: .planning/REQUIREMENTS.md] |
| DEC-02 | Curator can assign each selected candidate an explicit disposition: safe seed addition, alias, reject, defer, or manual_review. | Use locked enum: `promote_to_seed`, `add_alias`, `reject`, `defer_manual_review`, `defer_future_batch`, `needs_external_reference`; map roadmap wording to this closed enum. [CITED: .planning/REQUIREMENTS.md; .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| DEC-03 | Curator can document rationale and evidence for each disposition so downstream mutation is traceable. | Require row-level `rationale` and `evidence`; Phase 47 may execute only explicit target fields and mechanical instructions, not inferred rationale. [CITED: .planning/REQUIREMENTS.md; .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

No `AGENTS.md` file exists at repository root, so no additional AGENTS directives were found. [VERIFIED: repository glob]

## Summary

Phase 46 should be planned as a single documentation-only curation decision task: create `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` and do not edit taxonomy, aliases, compiled JSON, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI files. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

The planner must make the executor read Phase 45's selected table as the sole candidate set. The artifact contains exactly 40 selected candidates, and Phase 45 verification confirmed all selected candidates map back to the Phase 44 inventory and that Phase 45 introduced no dispositions or `mutation_allowed` fields. [CITED: .planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md; .planning/phases/45-batch-2-candidate-selection/45-VERIFICATION.md]

The main planning risk is over-promoting from weak inherited placement evidence. Every selected candidate is absent from current compiled v2.7 taxonomy descriptors, and none of the 40 candidates is currently an alias key or alias target in `descriptor_aliases.json`; therefore any executable `promote_to_seed` or `add_alias` row requires deliberate target proof against existing seed subfamilies, not inferred placement or frequency. [VERIFIED: data/compiled/v2/taxonomy.json; data/compiled/v2/descriptor_aliases.json]

**Primary recommendation:** Plan one read-only matrix construction task plus a verification task that parses the table and enforces row count, candidate mapping, enum, target completeness, mutation gate, and protected-boundary invariants. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Decision matrix authoring | Planning docs | — | Phase 46 deliverable is a Markdown planning artifact, not runtime code or data mutation. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| Candidate evidence lookup | Compiled data (read-only) | Planning docs | Evidence comes from Phase 45 selection and compiled v2.7 review queue/taxonomy/aliases; Phase 46 must only read these files. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| Downstream execution authorization | Planning docs | Phase 47 executor | Phase 47 may consume only `mutation_allowed=true` rows with explicit mechanical instructions. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |

## Standard Stack

No external packages or runtime libraries should be introduced. Phase 46 is documentation-only and should use existing repository files plus lightweight parser checks via the already-available Python runtime if desired. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md; VERIFIED: repository inspection]

### Core
| Library / Tool | Version | Purpose | Why Standard |
|---|---:|---|---|
| Markdown table | N/A | Matrix artifact format | Existing curation phases use parseable Markdown matrices before mutation. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md; .planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-DECISION-MATRIX.md] |
| Python 3 | system runtime | Optional validation parser | Adequate for local table/count/enum invariant checks without adding dependencies. [VERIFIED: local command availability during research] |

### Supporting
| Data source | Version / status | Purpose | When to Use |
|---|---|---|---|
| `data/compiled/v2/taxonomy.json` | `2.7.0` | Existing family/subfamily/seed target validation | Read-only before any executable row gets target fields. [VERIFIED: data/compiled/v2/taxonomy.json] |
| `data/compiled/v2/descriptor_aliases.json` | `2.7.0` | Existing alias state and alias target validation | Read-only before any `add_alias` row. [VERIFIED: data/compiled/v2/descriptor_aliases.json] |
| `data/compiled/v2/similarity_matrix.json` | `2.7.0` | Review queue evidence (`support`, `placement_score`, reason) | Use for row evidence, not approval. [VERIFIED: data/compiled/v2/similarity_matrix.json] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|---|---|---|
| Markdown table | JSON/YAML decision artifact | Do not use; context locks parseable Markdown matrix and v2.7 precedent is Markdown. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| Existing files + Python parser | New TypeScript utility | Do not add; Phase 46 should not mutate source code and needs no package/code changes. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |

**Installation:** none.

## Package Legitimacy Audit

No external packages should be installed for Phase 46; package legitimacy gate is not applicable. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## Exact Phase 45 Candidate Set

The matrix must contain these exact rows, ids `01`-`40`, aligned to Phase 45 selection rank. [CITED: .planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md]

| id | candidate | phase45_inferred_subfamily | frequency | weighted_score | source identifier |
|---:|---|---|---:|---:|---|
| 01 | `hay` | `amber` | 112 | 66.02 | Phase 45 selected row 1 |
| 02 | `coffee` | `vanilla` | 116 | 65.01 | Phase 45 selected row 2 |
| 03 | `orri` | `amber` | 75 | 61.93 | Phase 45 selected row 3 |
| 04 | `cananga` | `floral_white` | 9 | 61.57 | Phase 45 selected row 4 |
| 05 | `carrot_seed` | `warm_spice` | 7 | 61.49 | Phase 45 selected row 5 |
| 06 | `orchid` | `floral_rose` | 31 | 61.37 | Phase 45 selected row 6 |
| 07 | `cornmint` | `fresh_spice` | 6 | 61.33 | Phase 45 selected row 7 |
| 08 | `pennyroyal` | `warm_spice` | 12 | 61.15 | Phase 45 selected row 8 |
| 09 | `asparagus` | `leafy_green` | 15 | 60.87 | Phase 45 selected row 9 |
| 10 | `freesia` | `floral_rose` | 8 | 60.80 | Phase 45 selected row 10 |
| 11 | `cardamom` | `warm_spice` | 14 | 60.76 | Phase 45 selected row 11 |
| 12 | `malty` | `warm_spice` | 18 | 60.37 | Phase 45 selected row 12 |
| 13 | `butterscotch` | `tropical_fruit` | 7 | 60.26 | Phase 45 selected row 13 |
| 14 | `tangerine` | `citrus_fresh` | 29 | 60.04 | Phase 45 selected row 14 |
| 15 | `saffron` | `floral_rose` | 14 | 59.98 | Phase 45 selected row 15 |
| 16 | `hazelnut` | `tropical_fruit` | 46 | 57.25 | Phase 45 selected row 16 |
| 17 | `forest` | `woody_dry` | 11 | 57.13 | Phase 45 selected row 17 |
| 18 | `cascarilla` | `amber` | 4 | 57.10 | Phase 45 selected row 18 |
| 19 | `sesame` | `balsamic_resin` | 3 | 56.82 | Phase 45 selected row 19 |
| 20 | `osmanthus` | `floral_white` | 4 | 56.66 | Phase 45 selected row 20 |
| 21 | `cubeb` | `warm_spice` | 2 | 56.59 | Phase 45 selected row 21 |
| 22 | `elderflower` | `floral_white` | 3 | 56.57 | Phase 45 selected row 22 |
| 23 | `macadamia` | `vanilla` | 2 | 56.45 | Phase 45 selected row 23 |
| 24 | `marzipan` | `vanilla` | 2 | 56.45 | Phase 45 selected row 24 |
| 25 | `quince` | `orchard_fruit` | 3 | 56.40 | Phase 45 selected row 25 |
| 26 | `curry` | `woody_dry` | 6 | 56.36 | Phase 45 selected row 26 |
| 27 | `humus` | `amber` | 17 | 56.31 | Phase 45 selected row 27 |
| 28 | `davana` | `leathery` | 7 | 55.92 | Phase 45 selected row 28 |
| 29 | `mace` | `citrus_bitter` | 7 | 55.85 | Phase 45 selected row 29 |
| 30 | `linden_flower` | `floral_white` | 7 | 55.57 | Phase 45 selected row 30 |
| 31 | `pomegranate` | `tropical_fruit` | 7 | 54.44 | Phase 45 selected row 31 |
| 32 | `agarwood` | `amber` | 5 | 52.74 | Phase 45 selected row 32 |
| 33 | `hibiscus` | `amber` | 4 | 52.65 | Phase 45 selected row 33 |
| 34 | `orange_rind` | `citrus_bitter` | 2 | 52.26 | Phase 45 selected row 34 |
| 35 | `balsam` | `amber` | 7 | 51.56 | Phase 45 selected row 35 |
| 36 | `beeswax` | `amber` | 7 | 51.56 | Phase 45 selected row 36 |
| 37 | `tolu` | `amber` | 7 | 51.56 | Phase 45 selected row 37 |
| 38 | `acrylate` | `tropical_fruit` | 10 | 45.03 | Phase 45 selected row 38 |
| 39 | `tea_green_tea` | `floral_white` | 11 | 38.56 | Phase 45 selected row 39 |
| 40 | `kumquat` | `amber` | 2 | 35.70 | Phase 45 selected row 40 |

## Existing Taxonomy and Alias State

Current compiled v2 taxonomy is version `2.7.0` with 10 families, 18 subfamilies, and 324 descriptors. [VERIFIED: data/compiled/v2/taxonomy.json]

| Family | Existing subfamilies |
|---|---|
| `amber_resinous` | `amber`, `balsamic_resin` |
| `animalic` | `leathery`, `musky` |
| `citrus` | `citrus_bitter`, `citrus_fresh` |
| `floral` | `floral_rose`, `floral_white` |
| `fresh_spice` | `fresh_spice` |
| `fruity` | `orchard_fruit`, `red_fruit`, `tropical_fruit` |
| `gourmand` | `vanilla` |
| `green` | `herbal_green`, `leafy_green` |
| `spicy` | `warm_spice` |
| `woody` | `woody_dry`, `woody_mossy` |

Seed targets available in selected candidates' inferred subfamilies are limited; examples include `amber`/`ambergris` under `amber`, `benzoin`/`labdanum`/`opoponax` under `balsamic_resin`, `peppermint`/`spearmint` under `fresh_spice`, `vanilla` under `vanilla`, and `allspice`/`caraway`/`cinnamon`/`clove`/`cumin` under `warm_spice`. [VERIFIED: data/compiled/v2/taxonomy.json]

None of the 40 selected candidate ids currently exists as a descriptor in `data/compiled/v2/taxonomy.json`. [VERIFIED: data/compiled/v2/taxonomy.json]

`descriptor_aliases.json` has 18 alias entries in version `2.7.0`, and none of the 40 selected candidates is currently an alias key or alias target. [VERIFIED: data/compiled/v2/descriptor_aliases.json]

## Review Queue Evidence Snapshot

Use this as evidence text, not as approval evidence. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

| id | candidate | queue_subfamily | support | placement_score | queue_reason |
|---:|---|---|---:|---:|---|
| 01 | `hay` | `amber` | 5 | 0.367 | `normalized_support_below_threshold` |
| 02 | `coffee` | `vanilla` | 3 | 0.219 | `normalized_support_below_threshold` |
| 03 | `orri` | `amber` | 4 | 0.320 | `placement_score_below_threshold` |
| 04 | `cananga` | `floral_white` | 2 | 0.420 | `support_below_threshold` |
| 05 | `carrot_seed` | `warm_spice` | 2 | 0.420 | `support_below_threshold` |
| 06 | `orchid` | `floral_rose` | 3 | 0.325 | `placement_score_below_threshold` |
| 07 | `cornmint` | `fresh_spice` | 2 | 0.420 | `support_below_threshold` |
| 08 | `pennyroyal` | `warm_spice` | 2 | 0.370 | `support_below_threshold` |
| 09 | `asparagus` | `leafy_green` | 2 | 0.320 | `support_below_threshold` |
| 10 | `freesia` | `floral_rose` | 2 | 0.420 | `support_below_threshold` |
| 11 | `cardamom` | `warm_spice` | 2 | 0.334 | `support_below_threshold` |
| 12 | `malty` | `warm_spice` | 2 | 0.287 | `support_below_threshold` |
| 13 | `butterscotch` | `tropical_fruit` | 2 | 0.420 | `support_below_threshold` |
| 14 | `tangerine` | `citrus_fresh` | 2 | 0.223 | `support_below_threshold` |
| 15 | `saffron` | `floral_rose` | 2 | 0.334 | `support_below_threshold` |
| 16 | `hazelnut` | `tropical_fruit` | 2 | 0.185 | `support_below_threshold` |
| 17 | `forest` | `woody_dry` | 2 | 0.393 | `support_below_threshold` |
| 18 | `cascarilla` | `amber` | 2 | 0.420 | `support_below_threshold` |
| 19 | `sesame` | `balsamic_resin` | 1 | 0.360 | `support_below_threshold` |
| 20 | `osmanthus` | `floral_white` | 1 | 0.360 | `support_below_threshold` |
| 21 | `cubeb` | `warm_spice` | 1 | 0.360 | `support_below_threshold` |
| 22 | `elderflower` | `floral_white` | 1 | 0.360 | `support_below_threshold` |
| 23 | `macadamia` | `vanilla` | 1 | 0.360 | `support_below_threshold` |
| 24 | `marzipan` | `vanilla` | 1 | 0.360 | `support_below_threshold` |
| 25 | `quince` | `orchard_fruit` | 1 | 0.360 | `support_below_threshold` |
| 26 | `curry` | `woody_dry` | 1 | 0.310 | `support_below_threshold` |
| 27 | `humus` | `amber` | 2 | 0.296 | `support_below_threshold` |
| 28 | `davana` | `leathery` | 1 | 0.274 | `support_below_threshold` |
| 29 | `mace` | `citrus_bitter` | 1 | 0.274 | `support_below_threshold` |
| 30 | `linden_flower` | `floral_white` | 1 | 0.274 | `support_below_threshold` |
| 31 | `pomegranate` | `tropical_fruit` | 1 | 0.274 | `support_below_threshold` |
| 32 | `agarwood` | `amber` | 1 | 0.360 | `support_below_threshold` |
| 33 | `hibiscus` | `amber` | 1 | 0.360 | `support_below_threshold` |
| 34 | `orange_rind` | `citrus_bitter` | 1 | 0.360 | `support_below_threshold` |
| 35 | `balsam` | `amber` | 1 | 0.274 | `support_below_threshold` |
| 36 | `beeswax` | `amber` | 1 | 0.274 | `support_below_threshold` |
| 37 | `tolu` | `amber` | 1 | 0.274 | `support_below_threshold` |
| 38 | `acrylate` | `tropical_fruit` | 2 | 0.420 | `support_below_threshold` |
| 39 | `tea_green_tea` | `floral_white` | 2 | 0.393 | `support_below_threshold` |
| 40 | `kumquat` | `amber` | 0 | 0.000 | `support_below_threshold` |

## Architecture Patterns

### System Architecture Diagram

```text
Phase 45 selected table (40 rows)
        |
        v
Read-only evidence checks
  - current taxonomy families/subfamilies/seeds
  - current descriptor aliases
  - current review_queue support/placement evidence
        |
        v
Row-by-row disposition decision
  - locked enum
  - confidence enum
  - investigation depth
  - mutation_allowed gate
        |
        v
46-DECISION-MATRIX.md
        |
        +--> mutation_allowed=false rows -> Phase 47 instruction: none
        |
        +--> mutation_allowed=true rows -> explicit mechanical Phase 47 instruction only
```

### Recommended Project Structure

```text
.planning/phases/46-batch-2-decision-matrix/
├── 46-CONTEXT.md           # locked user decisions, already present
├── 46-RESEARCH.md          # this research artifact
├── 46-01-PLAN.md           # planner output
├── 46-DECISION-MATRIX.md   # executor output, primary deliverable
├── 46-01-SUMMARY.md        # optional closure summary
└── 46-VERIFICATION.md      # optional verification report
```

### Pattern 1: Matrix Before Mutation
**What:** A Markdown table acts as the sole authorization layer before later curation mutation. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md]  
**When to use:** Use for every selected Phase 45 candidate before Phase 47 can mutate seeds/aliases. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]  
**Example:**

```markdown
| id | candidate | phase45_inferred_subfamily | investigation_depth | disposition | target_family | target_subfamily | target_descriptor | alias_target | mutation_allowed | confidence | rationale | evidence | expected_effect | phase47_instruction | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 03 | `orri` | `amber` | deep_check | needs_external_reference | | | | | false | low | Truncated/ambiguous descriptor; do not infer canonical form. | Phase 45 freq 75; review_queue support 4, placement_score 0.320. | No mutation. | none | D-46-27 default. |
```

### Pattern 2: Non-Executable Rows Have Empty Targets
**What:** For `reject`, `defer_manual_review`, `defer_future_batch`, and `needs_external_reference`, target fields should be empty and `phase47_instruction` must be `none`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]  
**When to use:** Use whenever safe target proof is incomplete or mutation is forbidden. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

### Anti-Patterns to Avoid
- **Frequency approval:** Do not approve because a row has high frequency or high Phase 45 weighted score; these are prioritization evidence only. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
- **Inherited placement approval:** Do not treat `phase45_inferred_subfamily` as a safe target. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
- **Stretch placement:** Do not force `coffee`/`hazelnut`/`macadamia`/`marzipan` into `vanilla` or `tropical_fruit` merely because the compiler inferred those paths. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md; .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
- **New structure in Phase 46:** Do not create or imply new gourmand/nutty/coffee/aquatic/coniferous/off-note structure. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Candidate selection | New scoring or selector | Phase 45 selected table | Phase 46 must decide exactly the selected 40, not re-rank or replace them. [CITED: .planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md] |
| Taxonomy discovery | New taxonomy families/subfamilies | Existing compiled v2.7 taxonomy only | New structure is forbidden in Phase 46. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| Mutation authorization | Free-text rationale inference | Explicit columns and `phase47_instruction` | Phase 47 may not infer targets from rationale/evidence. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| Validation | Manual eyeballing only | Small parser assertion over Markdown | Acceptance criteria require exact count/enums/invariants. [CITED: user acceptance criteria] |

**Key insight:** Phase 46 value is the hard gate between evidence and mutation; any ambiguity should become a non-executable row rather than an inferred mutation. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Re-litigating Phase 45 Selection
**What goes wrong:** Executor changes the 40-candidate set or row order.  
**Why it happens:** The not-selected list is nearby and tempting to reconsider.  
**How to avoid:** Plan a parser check that matrix ids/candidates equal Phase 45 selected rows exactly. [CITED: .planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md]  
**Warning signs:** Extra rows, missing ids, split rows, or a candidate not in Phase 45 selected table.

### Pitfall 2: Stretch Placement from Compiler Inference
**What goes wrong:** `coffee`, `hazelnut`, `macadamia`, or `marzipan` are promoted into weak `vanilla`/fruit targets.  
**Why it happens:** `phase45_inferred_subfamily` is mistaken for approval evidence.  
**How to avoid:** Require target proof against existing seed taxonomy and use defer dispositions where structure is missing. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md; src/tests/fixtures/curation/41-DECISION-MATRIX.md]

### Pitfall 3: Wrong `phase47_instruction` on Non-Executable Rows
**What goes wrong:** A defer/reject/external-reference row contains a future action text.  
**Why it happens:** Notes and downstream instructions get conflated.  
**How to avoid:** Enforce exactly `none` whenever `mutation_allowed=false`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

### Pitfall 4: `medium` Confidence Label
**What goes wrong:** Matrix uses `medium`, which is not an allowed enum.  
**Why it happens:** Prior curation language used looser confidence terms.  
**How to avoid:** Allow only `low`, `medium_high`, `high`; parser should fail `medium`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## High-Risk Candidate Flags for Planning

| Candidate(s) | Risk | Planning guidance |
|---|---|---|
| `orri` | Truncated/ambiguous canonical form | Default `needs_external_reference`, `deep_check`, `mutation_allowed=false`, `phase47_instruction=none`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| `acrylate` | Industrial/off-profile, inferred `tropical_fruit` likely unsafe | Prefer `needs_external_reference` or `defer_manual_review` unless safe existing fit is proven. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| `coffee`, `hazelnut`, `macadamia`, `marzipan`, `butterscotch`, `sesame` | Food-linked/gourmand/nutty candidates may need absent structure | Do not promote from food identity or weak `vanilla`/fruit/resin fits; defer if no exact existing subfamily. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md; src/tests/fixtures/curation/41-DECISION-MATRIX.md] |
| `tea_green_tea`, `kumquat` | Candidate text/inferred placement mismatch risk | Preserve inferred subfamily but only target safe existing taxonomy if proven; otherwise non-executable. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| `hay` | v2.7 precedent deferred it due missing hay/fougere structure | Do not force into `amber`; likely defer unless new evidence proves exact existing fit. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md] |
| `orchid` | v2.7 precedent deferred vague floral needing expert review | Use manual review unless exact white/rose floral target is justified. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md] |

## Code Examples

### Parser-style Verification Command

The planner should include a task to run a parser check similar to this after `46-DECISION-MATRIX.md` is drafted. [ASSUMED]

```bash
python3 - <<'PY'
import re, sys
from pathlib import Path
matrix = Path('.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md').read_text()
selection = Path('.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md').read_text()

selected = []
for line in selection.splitlines():
    m = re.match(r'\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|', line)
    if m:
        selected.append((f'{int(m.group(1)):02d}', m.group(2)))

rows = []
for line in matrix.splitlines():
    if re.match(r'\|\s*\d{2}\s*\|', line):
        cols = [c.strip() for c in line.strip().strip('|').split('|')]
        rows.append(cols)

assert len(rows) == 40, len(rows)
assert [(r[0], r[1].strip('`')) for r in rows] == selected

allowed_disp = {'promote_to_seed','add_alias','reject','defer_manual_review','defer_future_batch','needs_external_reference'}
for r in rows:
    # Adjust indexes to final schema; enforce disposition/mutation/phase47/confidence invariants.
    pass
PY
```

## State of the Art / Precedent

| Precedent | Current Phase 46 Adaptation | Impact |
|---|---|---|
| Phase 38 used a compact matrix with descriptor, disposition, mutation allowed, rationale, expected effect. [CITED: .planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-DECISION-MATRIX.md] | Phase 46 uses richer schema with target fields, confidence, investigation depth, and phase47 instruction. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] | Keep matrix parseable and explicit. |
| Phase 41 v2.7 fixture has execution summary counts and a decision matrix. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md] | Phase 46 should include execution summary counts for the six locked dispositions plus mutation true/false counts. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] | Planner should include count reconciliation in verification. |
| Phase 41 deferred `coffee`, `hay`, `hazelnut`, and `orchid` rather than forcing weak placements. [CITED: src/tests/fixtures/curation/41-DECISION-MATRIX.md] | Same D-36 logic applies to Batch 2 rows with missing natural subfamily or vague floral identity. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] | Avoid stretch promotions. |

**Deprecated/outdated:** Phase 38 disposition strings such as `alias_to_seed` and `add_to_conflict_stopwords` must not be reused in Phase 46 because the Phase 46 enum is locked to six different values. [CITED: .planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-DECISION-MATRIX.md; .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | The sample Python parser will need column-index adjustment to the final matrix schema. | Code Examples | Low; planner can define exact schema before validation. |

## Open Questions (RESOLVED)

1. **How many rows should ultimately be executable?**
   - What we know: `mutation_allowed=true` is allowed only for `promote_to_seed`/`add_alias` rows meeting strict criteria. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
   - RESOLVED: Research does not pre-decide a target count. The executor decides row-by-row under the locked criteria in D-46-05, D-46-17, D-46-18, D-46-23, D-46-24, D-46-33, D-46-34, D-46-36, and D-46-42. Any row without complete existing-target proof, non-stretch evidence, non-frequency approval evidence, and `medium_high`/`high` confidence remains non-executable with `mutation_allowed=false` and `phase47_instruction=none`.

2. **Exact `phase47_instruction` wording for executable rows**
   - What we know: It must be explicit and mechanical, and non-executable rows must use exactly `none`. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
   - RESOLVED: Executable rows must use one of these mechanical grammars exactly: `add_seed target_family=<family> target_subfamily=<subfamily> descriptor=<descriptor>` for `promote_to_seed`, or `add_alias alias=<candidate> target=<existing_seed>` for `add_alias`. Non-executable rows must use exactly `none`. The parser must reject any other executable instruction shape.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| Python 3 | Optional parser validation | ✓ | Available during research | Manual table review, but parser is preferred. [VERIFIED: local command availability] |
| Node/GSD tooling | Optional graph/status helpers | not required | — | Not needed; no graph exists at `.planning/graphs/graph.json`. [VERIFIED: repository glob] |

**Missing dependencies with no fallback:** none.  
**Missing dependencies with fallback:** none.

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | Documentation parser assertions via Python 3; no new test framework needed. [ASSUMED] |
| Config file | none |
| Quick run command | `python3 - <<'PY' ... PY` parser embedded in plan |
| Full suite command | Same parser plus `git diff --name-only` protected-boundary check |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| DEC-01 | Matrix exists, has exactly 40 rows, ids/candidates match Phase 45 selected rows | parser/smoke | Python Markdown parser comparing `46-DECISION-MATRIX.md` to `45-BATCH2-SELECTION.md` | ❌ Wave 0 |
| DEC-02 | Every row has one locked disposition enum and valid mutation gate | parser/smoke | Python enum/invariant parser | ❌ Wave 0 |
| DEC-03 | Every row has non-empty rationale/evidence and non-executable rows have `phase47_instruction=none` | parser/smoke | Python required-field parser | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** parser assertions over `46-DECISION-MATRIX.md`.
- **Per wave merge:** same parser plus protected-boundary diff check.
- **Phase gate:** parser green and only Phase 46 planning/decision artifacts changed.

### Wave 0 Gaps
- [ ] Create `46-DECISION-MATRIX.md` with required schema and execution summary.
- [ ] Add one-off parser command in plan verification steps; no committed script required.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | no | Documentation-only artifact; no auth surface. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| V3 Session Management | no | Documentation-only artifact; no sessions. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| V4 Access Control | no | No runtime access-control change. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |
| V5 Input Validation | yes | Validate Markdown table fields via parser before Phase 47 consumes it. [ASSUMED] |
| V6 Cryptography | no | No cryptographic behavior. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Unauthorized mutation authorization via malformed row | Tampering | Parse and enforce enum/mutation/target invariants. [ASSUMED] |
| Scope creep into protected files | Tampering | Verify changed files are limited to Phase 46 artifacts. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md` — locked decisions, schema, disposition enum, mutation gate, phase boundary.
- `.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md` — exact 40 selected candidates.
- `.planning/phases/45-batch-2-candidate-selection/45-VERIFICATION.md` — Phase 45 selection integrity verification.
- `data/compiled/v2/taxonomy.json` — current v2.7 taxonomy family/subfamily/descriptor state.
- `data/compiled/v2/descriptor_aliases.json` — current v2.7 alias state.
- `data/compiled/v2/similarity_matrix.json` — current review queue evidence.

### Secondary (MEDIUM confidence)
- `src/tests/fixtures/curation/41-DECISION-MATRIX.md` — v2.7 matrix precedent and D-36-style deferrals.
- `.planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-DECISION-MATRIX.md` — older matrix precedent; useful for structure, not enum reuse.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — phase is explicitly documentation-only and no package installs are needed. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
- Architecture: HIGH — phase chain and zero-mutation boundary are locked. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md]
- Pitfalls: HIGH — derived from locked decisions plus v2.7 matrix precedent. [CITED: .planning/phases/46-batch-2-decision-matrix/46-CONTEXT.md; src/tests/fixtures/curation/41-DECISION-MATRIX.md]

**Research date:** 2026-06-03  
**Valid until:** 2026-07-03 or until `data/compiled/v2/*` changes, whichever comes first.
