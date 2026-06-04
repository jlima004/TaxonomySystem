# Milestones

## v2.8 Low-Support Review Queue Triage Batch 2 (Shipped: 2026-06-04)

**Phases completed:** 5 phases, 5 plans, 12 tasks
**Phases:** 44-48

**Key accomplishments:**

- Inventoried 259 remaining v2.7 `corpus_candidate_low_support` candidates and excluded 10 conflicts + 6 v2.7 decisions (Phase 44, INV-01/02).
- Selected bounded Batch 2 of exactly 40 candidates via weighted evidence model with manual sanity-review verdicts (Phase 45, SEL-01/02).
- Produced 40-row decision matrix: 12 `promote_to_seed`, 0 `add_alias`, 28 non-executable (Phase 46, DEC-01/02/03).
- Applied exactly 12 approved seed mutations (carrot_seed, freesia, cardamom, tangerine, saffron, osmanthus, cubeb, elderflower, mace, linden_flower, agarwood, tolu) with sandbox-validated guardrails (Phase 47, CUR-01/02/03).
- Published aligned v2.8.0 compiled artifacts in `data/compiled/v2/` at version 2.8.0 with 10 families, 18 subfamilies, 61 seed descriptors, 340 compiled, 18 aliases, 13 graph edges, 256 review items (Phase 48, PUB-01/02/03).
- v2.8 closure report measured from published JSON (not /tmp) with pre/post delta vs v2.7.0 (61 vs 49 seed, 340 vs 324 compiled, 256 vs 269 review items).

**Follow-up for next milestone:** inspect `descriptor_aliases` target integrity, especially `ylang ylang -> ylang_ylang`, whose target is not currently present as a compiled taxonomy descriptor. Carried over from Phase 8 and re-surfaced in v2.8 decision matrix row #4 (`cananga`).

---

## v2.6 Stabilization & Closure (Shipped: 2026-05-29)

**Phases completed:** 1 phases, 1 plans, 0 tasks

**Key accomplishments:**

- (none recorded)

---
