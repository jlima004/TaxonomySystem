# Phase 10: Taxonomy Seed v2 Expansion Round 3 - Context

> **Canonical decisions document.** Extracted from `10-DISCUSSION-LOG.md` after all 8 discussion areas were covered.
> This document is the authoritative input for future research, planning and execution agents.

**Date:** 2026-05-23
**Phase:** 10-taxonomy-seed-v2-expansion-round-3
**Status:** context_captured
**Execution readiness:** not_ready_for_execution
**Decision count:** 52 (R3-D-01 through R3-D-52)

---

## Phase Boundary

Phase 10 is a third curated expansion round for `taxonomy-seed.v2.json`, using post-Phase 09 v2-expanded as the baseline. Phase 10 focuses on `amber_resinous`, `animalic` and conditional `fresh_spice` review while keeping v2 candidate-only.

### Hard Constraints

- v2 remains candidate seed only; no promotion to default.
- `taxonomy-seed.v1.json` must not be edited.
- `data/compiled/v1/` must not be overwritten.
- `DEFAULT_PATHS` must not be altered.
- `curated_relations.v1.json` and `accord_map.v1.json` must not be altered.
- Corpus/review_queue/frequency/generic pressure must not be auto-promoted.
- No aliases/relations/accords without approval/rationale/evidence in the workbook.
- Approval in chat/transcript is not sufficient; approval must be persisted in the workbook.
- No official `data/compiled/v2` sidecar artifact is created by default.

### Post-Phase 09 Baseline

| Metric | V1 | V2 post-Phase 09 |
|--------|----|------------------|
| Families | 3 | 7 |
| Subfamilies | 6 | 13 |
| Seed descriptors | 21 | 32 |
| Review queue | 427 | 331 |
| Input relation_count | 6 | 11 |
| Input accord_count | 5 | 10 |
| Compiled graph edges | 6 | 10 |

Known carried-forward findings:
- `fresh_spice` remains absent/deferred.
- `ylang ylang -> ylang_ylang` remains legacy alias soft finding/deferred cleanup.
- v2 remains explicit candidate and is not default.

---

## 1. Expansion Scope

**Decision:** Round 3 focuses on `amber_resinous`, `animalic` and conditional `fresh_spice` review.

- R3-D-01: Phase 10 Round 3 will focus on `amber_resinous`, `animalic` and conditional `fresh_spice` review.
- R3-D-02: `amber_resinous` and `animalic` are real promotion scopes for this round.
- R3-D-03: `fresh_spice` may be created only if a concrete descriptor such as `anise` is approved; it must not be created empty.
- R3-D-04: Additional gourmand review is deferred to a future round, except as support evidence or explicit defer notes.
- R3-D-05: `ylang ylang -> ylang_ylang` remains deferred alias cleanup in this round unless a later explicit decision opens floral/ylang cleanup.

---

## 2. Amber/Resinous

**Decision:** Model `amber_resinous` with two candidate subfamilies: `amber` and `balsamic_resin`.

Candidate review:

| Subfamily | Candidates | Caution |
|-----------|------------|---------|
| `amber` | `amber` | Avoid duplicating family/subfamily/descriptor semantics without explicit rationale |
| `balsamic_resin` | `resinous`, `labdanum`, `benzoin`, `balsamic` | `resinous` and `balsamic` may be generic; defer/support if unclear |

- R3-D-06: Phase 10 Round 3 will include `amber_resinous` as a real promotion scope.
- R3-D-07: `amber_resinous` will be modeled with two candidate subfamilies: `amber` and `balsamic_resin`.
- R3-D-08: `amber` will be reviewed as a descriptor candidate inside the `amber` subfamily, with no automatic promotion.
- R3-D-09: `resinous`, `labdanum`, `benzoin` and `balsamic` will be reviewed as candidates for `balsamic_resin`.
- R3-D-10: `balsamic` and `resinous` require caution due to possible genericity; if there is no consensus, they remain defer/support.
- R3-D-11: No amber/resinous subfamily will be created empty.
- R3-D-12: Relations/accords involving `amber`, `balsamic_resin`, `vanilla`, `woody_dry` and `warm_spice` require their own approval.

---

## 3. Animalic

**Decision:** Model `animalic` with two candidate subfamilies: `musky` and `leathery`.

Candidate review:

| Subfamily | Candidates | Caution |
|-----------|------------|---------|
| `musky` | `musk`, `musky`, `ambrette` | `musk` vs `musky` requires canonical/alias decision |
| `leathery` | `leathery` | `leather`, if present, is alias investigation only |
| review/defer | `animal`, `civet` | `animal` is broad/generic; `civet` is sensitive/ambiguous without explicit approval |

- R3-D-13: Phase 10 Round 3 will include `animalic` as a real promotion scope.
- R3-D-14: `animalic` will be modeled with two candidate subfamilies: `musky` and `leathery`.
- R3-D-15: `musk`, `musky` and `ambrette` will be reviewed as candidates for `musky`.
- R3-D-16: `leathery` will be reviewed as a candidate for `leathery`.
- R3-D-17: `animal` will be treated as broad support signal by default, not an automatic descriptor.
- R3-D-18: `civet` will be treated as sensitive/ambiguous candidate and requires explicit approval before any promotion.
- R3-D-19: `musk` vs `musky` requires canonical/alias decision; they cannot be promoted as duplicates without rationale.
- R3-D-20: Relations/accords involving `musky`, `leathery`, `floral_rose`, `woody_dry`, `amber`, `balsamic_resin` and `vanilla` require their own approval.

---

## 4. Fresh Spice Gap

**Decision:** Review `fresh_spice` conditionally, with `anise` as the primary concrete candidate.

| Candidate | Disposition |
|-----------|-------------|
| `anise` | Primary candidate for `fresh_spice` |
| `anisic` | review/defer by default |
| `minty` | out of scope for this round |
| `wintergreen` | out of scope for this round |

- R3-D-21: Phase 10 Round 3 will review `fresh_spice` conditionally.
- R3-D-22: `fresh_spice` will be created only if a concrete descriptor is approved.
- R3-D-23: `anise` will be the primary candidate for `fresh_spice`.
- R3-D-24: `anisic` will be treated as review/defer by default.
- R3-D-25: `minty` and `wintergreen` remain outside `fresh_spice` scope in this round unless a later explicit decision changes that.
- R3-D-26: If `anise` is not approved, `fresh_spice` remains absent/deferred.
- R3-D-27: Relations/accords involving `fresh_spice` can be applied only if the endpoint exists in `taxonomy-seed.v2.json`.

---

## 5. Alias Cleanup

**Decision:** Use targeted alias cleanup only for Round 3 scope.

Alias investigation scope:
- `musk` vs `musky`
- `leather` vs `leathery`, if `leather` appears
- `ambery`, if it appears
- direct aliases for `labdanum`, `benzoin`, `balsamic`, `resinous`, if evidence is clear

Out of scope:
- `ylang ylang -> ylang_ylang`
- broad floral/exotic-floral cleanup
- aliases unrelated to `amber_resinous`, `animalic` or `fresh_spice`
- aliases without a clear canonical target in seed v2

- R3-D-28: Phase 10 will use alias cleanup targeted to Round 3 scope.
- R3-D-29: Alias investigation will cover `musk`/`musky`, `leather`/`leathery` and relevant amber/resinous variants.
- R3-D-30: `ylang ylang -> ylang_ylang` remains a legacy alias soft finding/deferred cleanup in this round.
- R3-D-31: No new alias will be added without `manual_approval: approved`, `primary_disposition: add_alias`, clear canonical target, rationale and evidence.
- R3-D-32: Alias candidates, corpus frequency and string similarity remain support only.
- R3-D-33: No legacy alias will be removed or remapped automatically.

---

## 6. Relation/Accord Expansion

**Decision:** Use approved-or-gap policy for each new subfamily.

Rules:
- Every new subfamily needs at least one approved relation/accord or explicit relation_gap/accord_gap.
- Scores are manual and in [0,1].
- Corpus/co-occurrence/review_queue are support only.
- Endpoints must exist in `taxonomy-seed.v2.json`.
- No placeholder `score: 0`.
- Missing remains neutral/undefined.

Priority candidates:

| Area | Candidate relation/accord | Suggested score |
|------|---------------------------|-----------------|
| Amber/resinous | `amber` ↔ `balsamic_resin` | 0.85 |
| Amber/resinous | `balsamic_resin` ↔ `vanilla` | 0.70 |
| Amber/resinous | `amber` ↔ `vanilla` | 0.70 |
| Amber/resinous | `balsamic_resin` ↔ `woody_dry` | 0.65 |
| Amber/resinous | `amber` ↔ `warm_spice` | 0.65 |
| Animalic | `musky` ↔ `leathery` | 0.80 |
| Animalic | `musky` ↔ `floral_rose` | 0.65 |
| Animalic | `musky` ↔ `vanilla` | 0.60 |
| Animalic | `leathery` ↔ `woody_dry` | 0.70 |
| Animalic | `leathery` ↔ `balsamic_resin` | 0.60 |
| Fresh spice | `fresh_spice` ↔ `warm_spice` | 0.80 |
| Fresh spice | `fresh_spice` ↔ `citrus_fresh` | 0.65 |

Containment: prioritize internal family relations and one or two high-confidence cross-family accords per group; do not approve the full set automatically.

- R3-D-34: Phase 10 will use approved-or-gap policy for each new subfamily.
- R3-D-35: Every new subfamily needs an approved relation/accord or explicit gap.
- R3-D-36: Scores will be manual and in [0,1], with rationale/evidence; corpus is support only.
- R3-D-37: There will be no placeholder `score: 0`; missing remains neutral/undefined.
- R3-D-38: Relations/accords can use only endpoints that exist in `taxonomy-seed.v2.json`.
- R3-D-39: Round 3 will prioritize internal family relations and a small number of high-confidence cross-family accords.
- R3-D-40: `fresh_spice` will receive relations/accords only if created with an approved descriptor.

---

## 7. Validation Gates

**Decision:** Maintain Phase 9 hard/soft gates and add Round 3 metrics.

Hard gates:
- schema invalid
- nondeterminism
- hard/pattern-excludes
- alias contamination
- auto-promotion
- default drift
- protected artifact mutation
- curated change without workbook traceability

Soft gates:
- zero-frequency seeds
- sparse graph / density drop
- high review_queue
- deferred gaps
- ambiguous candidates
- legacy alias target absent

Mandatory metrics:
- coverage counts
- amber/resinous coverage
- animalic coverage
- fresh spice status
- approved-or-gap traceability
- graph coverage
- generic pressure
- review queue quality
- alias targeted cleanup quality
- zero-frequency seeds
- determinism/schema/defaults
- curation traceability

- R3-D-41: Phase 10 will maintain Phase 9 hard/soft gates.
- R3-D-42: Phase 10 will add metrics specific to `amber_resinous`, `animalic`, `fresh_spice`, targeted alias cleanup and approved-or-gap traceability.
- R3-D-43: Every new Round 3 subfamily needs approved relation/accord or explicit gap.
- R3-D-44: Any seed/alias/relation/accord change without approval or gap persisted in the workbook is a hard failure.
- R3-D-45: Empty `fresh_spice` or relation/accord with nonexistent endpoint is a hard failure.
- R3-D-46: New alias without approved `add_alias` is a hard failure.
- R3-D-47: Promotion readiness remains documented only as future criteria, not an active promotion gate.

---

## 8. Promotion Boundaries

**Decision:** No promotion; criteria only.

Permitted:
- Expand `taxonomy-seed.v2.json` as candidate.
- Update `curated_relations.v2.json` and `accord_map.v2.json` as candidate inputs.
- Update `descriptor_aliases.seed.json` only if approved `add_alias` exists.
- Generate comparison outputs under `/tmp/opencode/...`.
- Document soft findings and future readiness criteria.

Out of scope:
- default switch
- executable migration plan
- executable rollback plan
- official v2 publication
- changing `src/cli/parse_args.ts` to v2
- altering `data/compiled/v1`
- removing or replacing v1

- R3-D-48: Phase 10 will not promote v2 to default.
- R3-D-49: Phase 10 will not alter `DEFAULT_PATHS`, `data/compiled/v1` or official v1 artifacts.
- R3-D-50: Phase 10 may update promotion readiness criteria only as future documentation.
- R3-D-51: Any default switch requires a separate future phase with explicit human approval, migration plan and rollback plan.
- R3-D-52: The expected Phase 10 outcome is v2-round-3 expanded candidate, not default.

---

## Expected Phase 10 Outcome

After future approved execution, Phase 10 should produce a v2-round-3 expanded candidate, not default. Expected changes are conditional on persisted workbook approvals.

Potential candidate changes:
- `taxonomy-seed.v2.json`: add approved `amber_resinous`, `animalic` and possibly `fresh_spice` entries.
- `descriptor_aliases.seed.json`: add only approved `add_alias` records.
- `curated_relations.v2.json`: add approved Round 3 relations or document gaps.
- `accord_map.v2.json`: add approved Round 3 accords or document gaps.
- Validation comparison: generated under `/tmp/opencode/...`, not under protected official artifacts.

No execution is authorized until a plan is created and approved.
