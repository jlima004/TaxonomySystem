# Roadmap: Olfactory Taxonomy System

## Milestones

- ◆ **v2.12 Graph Read Model Hardening & Agent Consumption Prep** — Phases 60-63 (planned)
- ✅ **v1.0 MVP** — Phases 1-14 (shipped 2026-05-26)
- ✅ **v2.6 Low-Support Rebaseline** — Phases 38-39 (shipped 2026-05-29)
- ✅ **v2.7 Low-Support Review Queue Triage** — Phases 40-43 (shipped 2026-06-02)
- ✅ **v2.8 Low-Support Review Queue Triage Batch 2** — Phases 44-48 (shipped 2026-06-04)
- ✅ **v2.9 Alias Target Integrity & Descriptor Hygiene** — Phases 49-51 (shipped 2026-06-06)
- ✅ **v2.10 Integrity Gate Hardening & CI Wiring** — Phases 52-54 (shipped 2026-06-09)
- ✅ **v2.11 Olfactory Knowledge Graph Read Model** — Phases 55-59 (shipped 2026-06-12)

## Phases

<details open>
<summary>◆ v2.12 Graph Read Model Hardening & Agent Consumption Prep (Phases 60-63) — PLANNED</summary>

- [ ] Phase 60: Contract Constants & Validation Hardening
  Goal: centralize contract-defined constants and make validation expectations deterministic and drift-resistant.
  Requirements: GCON-05, GCON-06, GVAL-06
  Success criteria:
  1. Builder/validator/query-consumption code uses shared authoritative graph constants wherever practical instead of duplicated literal prefixes or invariant identifiers.
  2. Validation returns deterministic structured failures tied to contract-defined expectations for schema, invariants, and baseline stat reconciliation.
  3. Tests prove contract drift reduction and preserve the protected `10/18/341/18/13` baseline expectation.
  Plans: 6 plans
  - [x] 60-01-PLAN.md — Authoritative contract, types and validation vocabularies.
  - [x] 60-02-PLAN.md — Central graph ID construction, guards, stripping and parsing boundary.
  - [ ] 60-03-PLAN.md — Typed validation error factories and JSON-safe payload checks.
  - [ ] 60-04-PLAN.md — Structural/profile/sanctioned validation surface split.
  - [ ] 60-05-PLAN.md — Builder, query, CLI and docs migration to central surfaces.
  - [ ] 60-06-PLAN.md — Drift, live baseline and compatibility tests.

- [ ] Phase 61: Fail-Closed Query Consumption
  Goal: make query proofs safer for future consumers by rejecting invalid or unvalidated graphs before proof generation.
  Requirements: GVAL-07, GQRY-06, GQRY-08
  Success criteria:
  1. Consumer-facing query path fails closed on invalid or unvalidated graph inputs.
  2. Existing proof envelope shape `{ query_kind, params, result, path }` remains stable across all current query functions.
  3. Invalid-graph query attempts produce deterministic typed error behavior rather than partial or misleading proofs.

- [ ] Phase 62: Sanctioned CLI Boundary Proofs
  Goal: prove the sanctioned non-dry-run write path, boundary audit, and Graphify isolation flow in a safe sandboxed test path.
  Requirements: GVAL-08, GVAL-09, GVAL-10
  Success criteria:
  1. Automated tests execute the sanctioned non-dry-run graph workflow in a sandbox without mutating protected taxonomy or compiled inputs.
  2. Boundary-audit outputs provide deterministic proof of protected-file integrity and sanctioned output destination.
  3. Graphify isolation is backed by measured test evidence, not only declarative zero-access reporting.

- [ ] Phase 63: Consumer Readiness Documentation
  Goal: document the safe build-validate-query workflow and lock the proof-envelope boundary for future Alquem.io agent/RAG consumption.
  Requirements: GQRY-07, GDOC-04, GDOC-05
  Success criteria:
  1. Maintainer guide follows a coherent section order for scope, workflow, validation, proofs, and future-consumer boundaries.
  2. Documentation states which proof-envelope fields are safe for future agent/RAG consumption and which are provenance-only or internal.
  3. Docs preserve explicit non-scope boundaries: no runtime/API, database export, new graph domains, or taxonomy publication.

</details>

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

<details>
<summary>✅ v2.10 Integrity Gate Hardening & CI Wiring (Phases 52-54) — SHIPPED 2026-06-09</summary>

- [x] Phase 52: Retroactive Verification Closure — completed 2026-06-06
- [x] Phase 53: Alias Integrity Gate Hardening — completed 2026-06-09
- [x] Phase 54: CI Wiring & Milestone Closure — completed 2026-06-09

_Full phase details: `.planning/milestones/v2.10-ROADMAP.md`_
</details>

<details>
<summary>✅ v2.11 Olfactory Knowledge Graph Read Model (Phases 55-59) — SHIPPED 2026-06-12</summary>

- [x] Phase 55: Graph Contract & Boundary Decisions — completed 2026-06-09
- [x] Phase 56: Pure Builder & Structural Validation — completed 2026-06-10
- [x] Phase 57: Query Proofs — completed 2026-06-10
- [x] Phase 58: CLI, Writer & Boundary Audit — completed 2026-06-10
- [x] Phase 59: Live Artifact Regression, Documentation & Milestone Closure — completed 2026-06-12

_Full phase details: `.planning/milestones/v2.11-ROADMAP.md`_
</details>

_For archived milestone details, see `.planning/milestones/`_
