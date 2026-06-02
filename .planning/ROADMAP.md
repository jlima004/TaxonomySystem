# Roadmap: Olfactory Taxonomy System

## Milestones

- ✅ **v1.0 MVP** — Phases 1-14 (shipped 2026-05-26)
- ✅ **v2.6 Low-Support Rebaseline** — Phases 38-39 (shipped 2026-05-29)
- ✅ **v2.7 Low-Support Review Queue Triage** — Phases 40-43 (shipped 2026-06-02)
- 📋 **v2.8 Low-Support Review Queue Triage Batch 2** — Phases 44-48 (planned)

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

<details open>
<summary>📋 v2.8 Low-Support Review Queue Triage Batch 2 (Phases 44-48) — PLANNED</summary>

- [ ] **Phase 44: Remaining Low-Support Inventory** - Confirm current v2.7 low_support queue truth and exclude already-decided Batch 1 items unless still unresolved.
- [ ] **Phase 45: Batch 2 Candidate Selection** - Select a bounded 25-50 candidate batch with evidence-backed selection rationale.
- [ ] **Phase 46: Batch 2 Decision Matrix** - Produce explicit traceable dispositions for every selected candidate before mutation.
- [ ] **Phase 47: Controlled Curation Mutation** - Apply only approved safe curation changes while preserving non-promoted outcomes and protected boundaries.
- [ ] **Phase 48: v2.8 Artifact Publication & Closure** - Sandbox-validate, publish aligned v2.8 artifacts, and report measured closure metrics.
</details>

## Phase Details

### Phase 44: Remaining Low-Support Inventory
**Goal**: Curator knows the exact current unresolved low_support candidate pool for v2.8 Batch 2 without reopening already-resolved v2.7 decisions.
**Depends on**: Phase 43
**Requirements**: INV-01, INV-02
**Success Criteria** (what must be TRUE):
  1. Curator can inspect the current compiled v2.7 review_queue and confirm the low_support candidate count before any Batch 2 selection.
  2. Curator can identify and exclude candidates already explicitly decided in v2.7 unless they still appear unresolved as low_support in the current compiled v2.7 review_queue.
  3. Curator can use the resulting inventory as the only eligible source for Batch 2 selection, preserving the no all-259 curation guardrail.
**Plans**: TBD

### Phase 45: Batch 2 Candidate Selection
**Goal**: Curator has a bounded, justified Batch 2 candidate set ready for detailed decisions.
**Depends on**: Phase 44
**Requirements**: SEL-01, SEL-02
**Success Criteria** (what must be TRUE):
  1. Curator can select a Batch 2 of 25-50 candidates from the eligible low_support inventory.
  2. Curator can explain why each selected candidate belongs in Batch 2 using evidence priority, semantic clarity, low polysemy, and curation value.
  3. Curator can confirm non-selected low_support candidates remain deferred for future milestones rather than silently curated.
**Plans**: TBD

### Phase 46: Batch 2 Decision Matrix
**Goal**: Every selected Batch 2 candidate has an explicit evidence-backed disposition before any curation mutation occurs.
**Depends on**: Phase 45
**Requirements**: DEC-01, DEC-02, DEC-03
**Success Criteria** (what must be TRUE):
  1. Curator can review a decision matrix containing every selected Batch 2 candidate before mutation.
  2. Curator can see one explicit disposition for each selected candidate: safe seed addition, alias, reject, defer, or manual_review.
  3. Curator can trace each disposition to documented rationale and evidence.
  4. Curator can confirm no candidate is promoted from frequency alone.
**Plans**: TBD

### Phase 47: Controlled Curation Mutation
**Goal**: Approved Batch 2 decisions are applied safely without automatic promotion or protected-boundary drift.
**Depends on**: Phase 46
**Requirements**: CUR-01, CUR-02, CUR-03
**Success Criteria** (what must be TRUE):
  1. Curator can verify that only decision-matrix-approved safe seed additions or aliases were applied.
  2. Curator can verify rejects, defers, and manual_review outcomes remain non-promoted decisions.
  3. Curator can verify protected boundaries remain unchanged, including conflict reopening, productization, knowledge-engine, Graphify, and scoring redesign work.
  4. Curator can confirm no v2.7 explicit decision was reconsidered unless it remained unresolved as current low_support evidence.
**Plans**: TBD

### Phase 48: v2.8 Artifact Publication & Closure
**Goal**: v2.8 compiled artifacts are validated, published, version-aligned, and closed with metrics measured from published JSON outputs.
**Depends on**: Phase 47
**Requirements**: PUB-01, PUB-02, PUB-03
**Success Criteria** (what must be TRUE):
  1. Curator can validate v2.8 compilation in a sandbox before any official artifact publication.
  2. Curator can publish v2.8 compiled artifacts with updated taxonomy, aliases, similarity graph, review_queue metrics, and aligned artifact version.
  3. Curator can read a v2.8 closure report whose metrics are measured from the published compiled JSON artifacts.
  4. Curator can confirm publication did not change milestone-excluded boundaries or defaults outside the approved v2.8 artifact scope.
**Plans**: TBD

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
| 44. Remaining Low-Support Inventory | v2.8 | 0/1 | Not started | - |
| 45. Batch 2 Candidate Selection | v2.8 | 0/1 | Not started | - |
| 46. Batch 2 Decision Matrix | v2.8 | 0/1 | Not started | - |
| 47. Controlled Curation Mutation | v2.8 | 0/1 | Not started | - |
| 48. v2.8 Artifact Publication & Closure | v2.8 | 0/1 | Not started | - |

_For archived milestone details, see `.planning/milestones/`_
