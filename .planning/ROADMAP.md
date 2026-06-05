# Roadmap: Olfactory Taxonomy System

## Milestones

- ✅ **v1.0 MVP** — Phases 1-14 (shipped 2026-05-26)
- ✅ **v2.6 Low-Support Rebaseline** — Phases 38-39 (shipped 2026-05-29)
- ✅ **v2.7 Low-Support Review Queue Triage** — Phases 40-43 (shipped 2026-06-02)
- ✅ **v2.8 Low-Support Review Queue Triage Batch 2** — Phases 44-48 (shipped 2026-06-04)
- 🚧 **v2.9 Alias Target Integrity & Descriptor Hygiene** — Phases 49-51

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-14) — SHIPPED 2026-05-26</summary>

- [x] Phase 1: Foundation — completed 2026-05-13
- [x] Phase 2: Data Loaders — completed 2026-05-13
- [x] Phase 3: Normalization Pipeline — completed 2026-05-17
- [x] Phase 4: Corpus Analysis — completed 2026-05-18
- [x] Phase 5: Inference Engine — completed 2026-05-19
- [x] Phase 6: Compilation & CLI — completed 2026-05-21
- [x] Phase 7: Data Quality & Inference Hardening — completed 2026-05-22
- [x] Phase 8: Taxonomy Seed Expansion & Curation — completed 2026-05-23
- [x] Phase 9: Taxonomy Seed v2 Expansion Round 2 — completed 2026-05-23
- [x] Phase 10: Taxonomy Seed v2 Expansion Round 3 — completed 2026-05-24
- [x] Phase 11: v2 Promotion Readiness & Migration Planning — completed 2026-05-24
- [x] Phase 12: v2 Default Switch Execution — completed 2026-05-25
- [x] Phase 13: Post-Promotion Stabilization & Consumer Adoption — completed 2026-05-25
- [x] Phase 14: v2.1 Backlog Triage & Curation Planning — completed 2026-05-26
</details>

<details>
<summary>✅ v2.6 Low-Support Rebaseline (Phases 38-39) — SHIPPED 2026-05-29</summary>

- [x] Phase 38: Group B Conflict Microcuration — completed 2026-05-29
- [x] Phase 39: Taxonomy v2.6 Stabilization & Closure — completed 2026-05-29
</details>

<details>
<summary>✅ v2.7 Low-Support Review Queue Triage (Phases 40-43) — SHIPPED 2026-06-02</summary>

- [x] Phase 40: Low-Support Curation Planning (1 plan) — completed 2026-05-29
- [x] Phase 41: Low-Support Batch Decision Matrix (1 plan) — completed 2026-05-29
- [x] Phase 42: Low-Support Microcuration Execution (2 plans) — completed 2026-06-02
- [x] Phase 43: Taxonomy v2.7 Artifact Publication (1 plan) — completed 2026-06-02
</details>

<details>
<summary>✅ v2.8 Low-Support Review Queue Triage Batch 2 (Phases 44-48) — SHIPPED 2026-06-04</summary>

- [x] **Phase 44: Remaining Low-Support Inventory** - Confirm current v2.7 low_support queue truth and exclude already-decided Batch 1 items unless still unresolved. (completed 2026-06-03)
- [x] **Phase 45: Batch 2 Candidate Selection** - Select a bounded 25-50 candidate batch with evidence-backed selection rationale. (completed 2026-06-03)
- [x] **Phase 46: Batch 2 Decision Matrix** - Produce explicit traceable dispositions for every selected candidate before mutation. (completed 2026-06-03)
- [x] **Phase 47: Controlled Curation Mutation** - Apply only approved safe curation changes while preserving non-promoted outcomes and protected boundaries. (completed 2026-06-03)
- [x] **Phase 48: v2.8 Artifact Publication & Closure** - Sandbox-validate, publish aligned v2.8 artifacts, and report measured closure metrics. (completed 2026-06-04)
</details>

<details open>
<summary>🚧 v2.9 Alias Target Integrity & Descriptor Hygiene (Phases 49-51)</summary>

- [x] **Phase 49: Alias Target Integrity Inventory** - Goal: Auditar `descriptor_aliases.seed.json`, compiled `descriptor_aliases.json` e `taxonomy.json` para listar todos os alias targets que não resolvem para descriptors compilados, começando por `ylang ylang -> ylang_ylang`. Zero mutation. (completed 2026-06-05)
- [ ] **Phase 50: Alias Target Integrity Automation** - Goal: Implementar o gate automatizado e o suporte a policy de exceções para falhar quando um target de alias não existir sem exceção documentada.
- [ ] **Phase 51: Legacy Alias Remediation** - Goal: Resolver `ylang ylang -> ylang_ylang` e qualquer outro dangling target confirmado na Phase 49, usando o gate da Phase 50 como prova.

### Phase 49: Alias Target Integrity Inventory

**Goal**: Auditar `descriptor_aliases.seed.json`, compiled `descriptor_aliases.json` e `taxonomy.json` para listar todos os alias targets que não resolvem para descriptors compilados, começando por `ylang ylang -> ylang_ylang`. Zero mutation.
**Depends on**: Phase 48
**Requirements**: Inventory support for HYG-01, HYG-02, HYG-03
**Plans**: 1 plan

Plans:

- [x] 49-01: Produce evidence-backed alias target integrity inventory with seed-vs-compiled equivalence and dangling target classification.

**Details:**
- Confirmed seed and compiled alias maps are identical at exactly 18 entries each.
- Verified 340 compiled descriptor IDs, 17 valid alias targets, and one dangling target: `ylang ylang -> ylang_ylang`.
- Classified `ylang ylang -> ylang_ylang` as `remediation_required`, not an exception candidate.
- Preserved zero-mutation scope: no taxonomy, alias, compiled artifact, or source-code changes.
- Created `.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md` for downstream Phase 50 and Phase 51.
- Completed: 2026-06-05.

### Phase 50: Alias Target Integrity Automation

**Goal**: Implementar o gate automatizado e o suporte a policy de exceções para falhar quando um target de alias não existir sem exceção documentada.
**Depends on**: Phase 49
**Requirements**: HYG-02, HYG-03
**Plans**: 1 plan

Plans:

- [x] 50-01: Implement automated alias target integrity gate and documented exception policy support.

**Details:**
- Must consume Phase 49's inventory finding that `ylang ylang -> ylang_ylang` is the only confirmed dangling alias target.
- Gate must validate every target in `data/taxonomy/descriptor_aliases.seed.json` against compiled taxonomy descriptor IDs.
- Gate must fail when an alias target does not resolve and is not covered by an explicit documented exception.
- Exception mechanism must allow an empty list and require rationale for any permanent non-resolving alias.
- Scope excludes remediating `ylang ylang -> ylang_ylang`; that mutation/decision belongs to Phase 51.

### Phase 51: Legacy Alias Remediation

**Goal**: Resolver `ylang ylang -> ylang_ylang` e qualquer outro dangling target confirmado na Phase 49, usando o gate da Phase 50 como prova.
**Depends on**: Phase 50
**Requirements**: HYG-01
**Plans**: 1 plan

Plans:

- [ ] 51-01: Resolve confirmed dangling alias targets and prove the Phase 50 integrity gate passes.

**Details:**
- Must resolve `ylang ylang -> ylang_ylang` by an explicit decision: add a curated target, drop the alias with rationale, or document a permanent exception.
- Must use the automated Phase 50 gate as proof that no unresolved alias target remains without documented exception.
- Scope remains alias target hygiene only; no Batch 3 low-support curation or unrelated descriptor promotion.
</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|---------------|--------|-----------|
| 1. Foundation | v1.0 | 1/1 | Complete | 2026-05-13 |
| 2. Data Loaders | v1.0 | 1/1 | Complete | 2026-05-13 |
| 3. Normalization Pipeline | v1.0 | 1/1 | Complete | 2026-05-17 |
| 4. Corpus Analysis | v1.0 | 1/1 | Complete | 2026-05-18 |
| 5. Inference Engine | v1.0 | 1/1 | Complete | 2026-05-19 |
| 6. Compilation & CLI | v1.0 | 1/1 | Complete | 2026-05-21 |
| 7. Data Quality & Inference Hardening | v1.0 | 1/1 | Complete | 2026-05-22 |
| 8. Taxonomy Seed Expansion & Curation | v1.0 | 1/1 | Complete | 2026-05-23 |
| 9. Taxonomy Seed v2 Expansion Round 2 | v1.0 | 4/4 | Complete | 2026-05-23 |
| 10. Taxonomy Seed v2 Expansion Round 3 | v1.0 | 4/4 | Complete | 2026-05-24 |
| 11. v2 Promotion Readiness & Migration Planning | v1.0 | 5/5 | Complete | 2026-05-24 |
| 12. v2 Default Switch Execution | v1.0 | 1/1 | Complete | 2026-05-25 |
| 13. Post-Promotion Stabilization | v1.0 | 1/1 | Complete | 2026-05-25 |
| 14. v2.1 Backlog Triage & Curation Planning | v1.0 | 1/1 | Complete | 2026-05-26 |
| 38. Group B Conflict Microcuration | v2.6 | 1/1 | Complete | 2026-05-29 |
| 39. Taxonomy v2.6 Stabilization & Closure | v2.6 | 1/1 | Complete | 2026-05-29 |
| 40. Low-Support Curation Planning | v2.7 | 1/1 | Complete | 2026-05-29 |
| 41. Low-Support Batch Decision Matrix | v2.7 | 1/1 | Complete | 2026-05-29 |
| 42. Low-Support Microcuration Execution | v2.7 | 2/2 | Complete | 2026-06-02 |
| 43. Taxonomy v2.7 Artifact Publication | v2.7 | 1/1 | Complete | 2026-06-02 |
| 44. Remaining Low-Support Inventory | v2.8 | 1/1 | Complete | 2026-06-03 |
| 45. Batch 2 Candidate Selection | v2.8 | 1/1 | Complete | 2026-06-03 |
| 46. Batch 2 Decision Matrix | v2.8 | 1/1 | Complete | 2026-06-03 |
| 47. Controlled Curation Mutation | v2.8 | 1/1 | Complete | 2026-06-03 |
| 48. v2.8 Artifact Publication & Closure | v2.8 | 1/1 | Complete | 2026-06-04 |
| 49. Alias Target Integrity Inventory | v2.9 | 1/1 | Complete | 2026-06-05 |
| 50. Alias Target Integrity Automation | v2.9 | 1/1 | Complete   | 2026-06-05 |
| 51. Legacy Alias Remediation | v2.9 | 0/1 | Pending | — |

_For archived milestone details, see `.planning/milestones/`_
