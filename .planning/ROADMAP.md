# Roadmap: Olfactory Taxonomy System

## Milestones

- ✅ **v1.0 MVP** — Phases 1-14 (shipped 2026-05-26)
- ✅ **v2.6 Low-Support Rebaseline** — Phases 38-39 (shipped 2026-05-29)
- ✅ **v2.7 Low-Support Review Queue Triage** — Phases 40-43 (shipped 2026-06-02)
- ✅ **v2.8 Low-Support Review Queue Triage Batch 2** — Phases 44-48 (shipped 2026-06-04)
- ✅ **v2.9 Alias Target Integrity & Descriptor Hygiene** — Phases 49-51 (shipped 2026-06-06)
- 🚧 **v2.10 Integrity Gate Hardening & CI Wiring** — Phases 52-54 (planning)

## Overview

v2.10 closes the formal verification debt from Phase 50, hardens `alias:integrity` as an operational local guardrail, and wires install/typecheck/test/alias integrity into CI without changing taxonomy truth or compiled artifacts.

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

- [x] Phase 40: Low-Support Curation Planning — completed 2026-05-29
- [x] Phase 41: Low-Support Batch Decision Matrix — completed 2026-05-29
- [x] Phase 42: Low-Support Microcuration Execution — completed 2026-06-02
- [x] Phase 43: Taxonomy v2.7 Artifact Publication — completed 2026-06-02

</details>

<details>
<summary>✅ v2.8 Low-Support Review Queue Triage Batch 2 (Phases 44-48) — SHIPPED 2026-06-04</summary>

- [x] Phase 44: Remaining Low-Support Inventory — completed 2026-06-03
- [x] Phase 45: Batch 2 Candidate Selection — completed 2026-06-03
- [x] Phase 46: Batch 2 Decision Matrix — completed 2026-06-03
- [x] Phase 47: Controlled Curation Mutation — completed 2026-06-03
- [x] Phase 48: v2.8 Artifact Publication & Closure — completed 2026-06-04

</details>

<details>
<summary>✅ v2.9 Alias Target Integrity & Descriptor Hygiene (Phases 49-51) — SHIPPED 2026-06-06</summary>

- [x] Phase 49: Alias Target Integrity Inventory — completed 2026-06-05
- [x] Phase 50: Alias Target Integrity Automation — completed 2026-06-06
- [x] Phase 51: Legacy Alias Remediation — completed 2026-06-06

_Full phase details: `.planning/milestones/v2.9-ROADMAP.md`_
</details>

### 🚧 v2.10 Integrity Gate Hardening & CI Wiring (Planning)

**Milestone Goal:** Fechar a dívida formal da Phase 50, fortalecer `alias:integrity` como guardrail operacional e conectá-lo ao fluxo local/CI sem abrir nova curadoria low-support nem mutar artifacts taxonômicos.

- [x] **Phase 52: Retroactive Verification Closure** - Fechar a dívida documental da Phase 50 e tornar HYG-02/HYG-03 formalmente auditáveis. Completed 2026-06-06.
- [x] **Phase 53: Alias Integrity Gate Hardening** - Integrar `alias:integrity` em um guardrail local apropriado, sem quebrar compile normal. (completed 2026-06-09)
- [x] **Phase 54: CI Wiring & Milestone Closure** - Adicionar/verificar GitHub Actions ou CI equivalente, rodar typecheck/test/alias integrity, e fechar v2.10. (2026-06-08)

## Scope Boundaries

v2.10 explicitly excludes: FUT-01, FUT-02, new seed promotion, `data/taxonomy/taxonomy-seed.v2.json` mutation, `data/compiled/v2/*` publication/mutation, Graphify/scoring/UI/MVP/Knowledge Engine work, and adding `alias:integrity` to the normal compile path.

## Phase Details

### Phase 52: Retroactive Verification Closure

**Goal**: Fechar a dívida documental da Phase 50 e tornar HYG-02/HYG-03 formalmente auditáveis.
**Depends on**: Phase 51
**Requirements**: VER-01, VER-02
**Success Criteria** (what must be TRUE):

  1. Operator can inspect a retroactive `50-VERIFICATION.md` that formally verifies HYG-02 and HYG-03 against the implemented alias integrity automation.
  2. Operator can trace Phase 50 completion metadata from `50-01-SUMMARY.md` or an equivalent planning record without relying on informal audit notes.
  3. Auditor can determine which Phase 50 hygiene requirements were verified and what evidence supports each verification outcome.

**Plans**: 1 plan

Plans:

- [x] 52-01-PLAN.md — Create retroactive Phase 50 verification and metadata trace for VER-01/VER-02.

### Phase 53: Alias Integrity Gate Hardening

**Goal**: Integrar `alias:integrity` em um guardrail local apropriado, sem quebrar compile normal.
**Depends on**: Phase 52
**Requirements**: GATE-01, GATE-02, GATE-03, TEST-01, TEST-02
**Success Criteria** (what must be TRUE):

  1. Developer can run a local quality/safety command that includes `alias:integrity` without adding it to the normal compile path.
  2. Developer can receive machine-readable `alias:integrity -- --json` proof showing `341 compiled / 18 valid alias targets / 0 unresolved`.
  3. Developer sees the local alias integrity guard fail non-zero when unresolved alias targets are introduced.
  4. Developer can maintain alias target inventory coverage through tests that reuse `validateAliasTargetIntegrity` directly where appropriate, with the existing test suite still passing.

**Plans**: 3 plans

Plans:
**Wave 1**

- [x] 53-01-PLAN.md — Wire `verify:integrity` and `compile:quality` while preserving normal compile isolation.
- [x] 53-02-PLAN.md — Refactor inventory regression to reuse `validateAliasTargetIntegrity` without weakening documentary fixture coverage.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 53-03-PLAN.md — Run final Phase 53 proof package, static compile proof, full suite, and boundary diff checks.

### Phase 54: CI Wiring & Milestone Closure

**Goal**: Adicionar/verificar GitHub Actions ou CI equivalente, rodar typecheck/test/alias integrity, e fechar v2.10.
**Depends on**: Phase 53
**Requirements**: CI-01, CI-02, CI-03, CI-04, BOUND-01, BOUND-02, BOUND-03
**Success Criteria** (what must be TRUE):

  1. Maintainer can run GitHub Actions or equivalent CI that installs `src` package dependencies reproducibly.
  2. CI verifies `npm --prefix src run typecheck` and reports pass/fail status.
  3. CI verifies `npm --prefix src test` and reports pass/fail status.
  4. CI verifies `npm --prefix src run alias:integrity -- --json` and exposes the current `341/18/0` baseline proof.
  5. Reviewer can confirm v2.10 closes without changes to `data/taxonomy/taxonomy-seed.v2.json`, without publishing or mutating `data/compiled/v2/*`, and without opening FUT-01/FUT-02/Graphify/scoring/UI/MVP/Knowledge Engine work.

**Plans**: 3/3 complete

- [x] 54-01-PLAN.md — Stabilize analysis stress benchmark for CI-safe test gate.
- [x] 54-02-PLAN.md — Add minimal GitHub Actions CI workflow.
- [x] 54-03-PLAN.md — Final proof package, boundary audit, and milestone closure artifacts.

## Progress

**Execution Order:** Phase 52 → Phase 53 → Phase 54

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 52. Retroactive Verification Closure | v2.10 | 1/1 | Complete    | 2026-06-07 |
| 53. Alias Integrity Gate Hardening | v2.10 | 3/3 | Complete    | 2026-06-09 |
| 54. CI Wiring & Milestone Closure | v2.10 | 4/3 | Complete   | 2026-06-09 |

_For archived milestone details, see `.planning/milestones/`_
