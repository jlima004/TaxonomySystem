---
status: read_only_triage
non_authorizing: true
phase: 22
slug: review-queue-conflict-triage-v2-2
created: 2026-05-27
protected_paths_touched: none
execution_readiness: not_ready_for_execution
---

# Phase 22 — Patterns: Review Queue Conflict Triage for v2.2

## Pattern Map

Este documento identifica os padrões semânticos, de decisão e de proteção aplicáveis à triagem de `seed_corpus_conflict` para v2.2.

---

## P-01: Semantic Conflict Classification

Cada item `seed_corpus_conflict` deve ser classificado em **exatamente um** dos seguintes padrões semânticos primários:

| Pattern | Tag | Descrição | Exemplo |
|---------|-----|-----------|---------|
| Valid Variant | `valid_variant` | Corpus descriptor é uma variação legítima do seed descriptor (composto, específico). | `banana_peel`↔`banana`, `lemon_peel`↔`lemon` |
| Semantic Mismatch | `semantic_mismatch` | Corpus descriptor tem significado diferente, mas houve overlap algorítmico. | `rosemary`↔`rose`, `pine`↔`pineapple` |
| Overly Broad Corpus Token | `overly_broad` | Corpus descriptor é um termo genérico de alta frequência. | `sweet` (1459), `berry` (227), `fruit` (52) |
| Substring / Noise Artifact | `substring_noise` | Overlap é puramente por substring; sem relação semântica. | `grain`↔`petitgrain`, `raw`↔`strawberry` |
| Possible Alias Candidate | `alias_candidate` | Corpus descriptor pode ser um misspelling ou variante aliasável. | `clover`↔`clove`, `cedar`↔`cedarwood` |
| Possible Add Target Candidate | `add_target_candidate` | Corpus descriptor merece consideration como novo seed descriptor. | `grapefruit_peel`, `lemon_peel`, `rose_red_rose` |
| Accepted With Policy | `accepted_with_policy` | Conflito é esperado, não bloqueador, aceito por política. | `sweet`↔`sweet_orange`, `grain`↔`petitgrain` |
| Defer | `defer` | Evidência insuficiente para classificação definitiva. | `banana_peel` (corpus_count 4) |

### Application Rules

1. Every item must receive exactly **one primary** pattern tag.
2. May receive **secondary** tags if relevant (e.g., `valid_variant` that is also `defer` due to low corpus count).
3. An item tagged `accepted_with_policy` requires no further action unless new evidence emerges.
4. An item tagged `add_target_candidate` requires additional evidence before being recommended for promotion.

---

## P-02: Decision Matrix Schema

Para cada anchor group, a matriz de decisão deve conter:

| Field | Description | Values |
|-------|-------------|--------|
| `anchor_id` | Seed descriptor anchor | Seed descriptor name |
| `item_count` | Number of conflict items in this group | Integer |
| `risk_level` | Semantic risk assessment | `HIGH` / `MEDIUM` / `LOW` |
| `primary_patterns` | Dominant semantic pattern(s) | Per P-01 |
| `v2.2_candidates` | Items recommended for v2.2 action | List of corpus descriptors |
| `v2.2_action` | Recommended action type | `accepted_with_policy` / `add_target` / `alias_remap` / `defer` / `non_actionable` |
| `evidence_quality` | Corpus evidence strength | `HIGH` (count≥50) / `MEDIUM` (10-49) / `LOW` (<10) |
| `phase_14_crossref` | Reference to Phase 14 finding | RQ-REC code or "none" |
| `rationale` | Triagem rationale | Free text |

---

## P-03: Anchor Risk Classification

| Risk Level | Criteria | Action |
|------------|----------|--------|
| 🔴 HIGH | ≥3 conflict items, or ≥1 semantic mismatch with high corpus_count | Requires explicit semantic judgment; candidate for v2.2 manual review pack |
| 🟡 MEDIUM | 2-3 conflict items, primarily valid variants or overly broad tokens | Document and tag; may be deferred |
| 🟢 LOW | 1 item, clearly noise/overly broad/substring artifact | Tag `accepted_with_policy`; no further action |

---

## P-04: Evidence Strength Criteria

| Strength | Criteria | Example |
|----------|----------|---------|
| HIGH | corpus_count ≥ 50, reasonable semantic match | `orange` (149)↔`bitter_orange` |
| MEDIUM | corpus_count 10-49, debatable semantic match | `lemongrass` (24)↔`lemon` |
| LOW | corpus_count < 10, weak/ambiguous semantic match | `banana_peel` (4)↔`banana` |

**Cross-cutting rule:** Evidence strength alone does not determine action. A HIGH-count item like `sweet` (1459) is still `accepted_with_policy` because it's overly broad. A LOW-count item like `banana_peel` (4) may still be tagged `valid_variant` but deferred due to insufficient evidence.

---

## P-05: v2.2 Recommendation Categories

| Category | Meaning | Gate Required |
|----------|---------|---------------|
| `accepted_with_policy` | No action needed; conflict is acceptable noise | None |
| `add_target_candidate` | Candidate for seed promotion in v2.2 | Persisted approval, evidence review, family/subfamily fit check |
| `alias_candidate` | Candidate for alias add/remap in v2.2 | Semantic equivalence proof, alias integrity check |
| `manual_review_pack` | Needs human semantic judgment | Approval from domain expert |
| `defer` | Defer to v2.3+ | None |
| `non_actionable` | Not actionable; algorithmic artifact | None |

---

## P-06: Protected Triage Boundary

Pattern applied from Phase 14 and Phase 19:

```
data/taxonomy/*           → read-only, never touched
data/inference/*          → read-only, never touched
data/compiled/v1/*        → read-only, never touched
data/compiled/v2/*        → read-only, never touched
src/cli/parse_args.ts     → read-only, never touched
scripts/check-safety-guards.sh → read-only, never touched
src/package.json          → read-only, never touched
graphify-out/*            → read-only, never touched
```

**Allowed writes:**
- `.planning/phases/22-review-queue-conflict-triage-v2-2/*` only

**Explicitly not authorized:**
- No descriptor promotion, rejection, or remap
- No alias add, remove, or remap
- No relation or accord mutation
- No official compile or artifact publication
- No Graphify run

---

## P-07: Phase 14 Cross-Reference Pattern

```
Phase 14 Finding → Phase 22 Status → Delta Description
```

| Phase 14 Finding | Phase 22 Status | Delta |
|------------------|-----------------|-------|
| RQ-REC-01 (rose, melon, banana, bitter_orange, grapefruit need judgment) | Confirmed, prioritized | All 5 anchors re-evaluated; rose upgraded to 🔴 HIGH, banana downgraded to 🟡 MEDIUM |
| RQ-REC-04 (accepted_with_policy) | Expanded | Applied to 12 items in Phase 22 vs. conceptual-only in Phase 14 |
| 33 seed_corpus_conflict | 34 | +1 petitgrain↔grain from Phase 20 add_target |

---

## P-08: Petitgrain Conflict Aftermath Pattern

When a corpus-candidate descriptor is promoted to seed, it may create new `seed_corpus_conflict` items if:
1. The promoted seed descriptor contains a substring that also exists as a corpus descriptor.
2. The promoted seed descriptor shares a stem/root with a corpus descriptor.

**Mitigation:** New conflicts from add_target are expected and should be tagged `accepted_with_policy` unless the corpus descriptor is a valid olfactory note.

**Expected pattern for future add_target operations:** Each new seed descriptor may create 0-2 new `seed_corpus_conflict` items. Planning for add_target should include a post-conflict triage step.

---

## P-09: `corpus_candidate_low_support` Triage Boundary (Future)

The 282 `corpus_candidate_low_support` items share subfamilies with conflict groups:

| Conflict Anchor | Shared Subfamilies | Low-Support Items in Subfamily |
|-----------------|-------------------|-------------------------------|
| rose | floral_rose | 24 |
| melon | orchard_fruit | 20 |
| banana | tropical_fruit | 28 |
| bitter_orange | citrus_bitter | 3 |
| grapefruit, lemon, sweet_orange, petitgrain | citrus_fresh | 23 |

**Triage rule:** Do not triage low-support items in Phase 22. This pattern documents the cross-subfamily overlap for future triage planning.
