# Requirements: Olfactory Taxonomy System v2.10

**Defined:** 2026-06-06
**Milestone:** v2.10 Integrity Gate Hardening & CI Wiring
**Core Value:** Produzir um sistema semântico olfativo normalizado e computacionalmente útil — a Layer 1 (taxonomia pura) que serve de fundação para todas as camadas superiores de inteligência de fragrâncias.

## v2.10 Requirements

Requirements for the v2.10 milestone. Each maps to exactly one roadmap phase.

### Verification Closure

- [x] **VER-01**: Operator can inspect a retroactive `50-VERIFICATION.md` that formally verifies Phase 50 HYG-02 and HYG-03 against the implemented alias integrity automation.
- [x] **VER-02**: Operator can trace Phase 50 completion metadata from `50-01-SUMMARY.md` or an equivalent planning record without relying on informal audit notes.

### Local Guardrails

- [x] **GATE-01**: Developer can run a local quality/safety command that includes `alias:integrity` without adding it to the normal compile path.
- [x] **GATE-02**: Developer can receive machine-readable `alias:integrity -- --json` proof showing the current baseline remains `341 compiled / 18 valid alias targets / 0 unresolved`.
- [x] **GATE-03**: Developer can rely on the local alias integrity guard to fail non-zero if unresolved alias targets are introduced.

### Test Refactor

- [x] **TEST-01**: Developer can maintain alias target inventory coverage through tests that reuse `validateAliasTargetIntegrity` directly where appropriate instead of duplicating validator logic.
- [x] **TEST-02**: Developer can run the existing test suite after the refactor with equivalent or stronger regression coverage for alias target integrity.

### CI Wiring

- [x] **CI-01**: Maintainer can run GitHub Actions or equivalent CI that installs `src` package dependencies reproducibly.
- [x] **CI-02**: CI verifies `npm --prefix src run typecheck`.
- [x] **CI-03**: CI verifies `npm --prefix src test`.
- [x] **CI-04**: CI verifies `npm --prefix src run alias:integrity -- --json`.

### Scope Protection

- [x] **BOUND-01**: Reviewer can confirm v2.10 makes no changes to `data/taxonomy/taxonomy-seed.v2.json`.
- [x] **BOUND-02**: Reviewer can confirm v2.10 does not publish or mutate `data/compiled/v2/*`.
- [x] **BOUND-03**: Reviewer can confirm v2.10 does not open FUT-01, FUT-02, Graphify, scoring, UI, MVP or Knowledge Engine work.

## Future Requirements

Deferred to a future milestone; not in the v2.10 roadmap.

### Curation Backlog

- **FUT-01**: Curate the 243 remaining `corpus_candidate_low_support` items.
- **FUT-02**: Curate the 13 remaining `seed_corpus_conflict` items.

## Out of Scope

Explicitly excluded from v2.10 to prevent scope creep.

| Feature | Reason |
|---------|--------|
| `data/taxonomy/taxonomy-seed.v2.json` mutation | v2.10 is gate/documentation/CI hardening only; no taxonomy truth changes are authorized. |
| `data/compiled/v2/*` publication or mutation | Current `341/18/0` state is a protected baseline, not a target for republishing in this milestone. |
| FUT-01 low-support curation | Deferred; opening Batch 3 would mix curation with infrastructure hardening. |
| FUT-02 seed/corpus conflict curation | Deferred; v2.10 does not perform new manual curation. |
| Adding `alias:integrity` to the normal compile path | The guard belongs in quality/safety/CI flows so everyday compile remains lightweight. |
| Graphify, scoring, UI, MVP or Knowledge Engine work | Reserved for future milestones and unrelated to alias integrity operational hardening. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| VER-01 | Phase 52 | Complete |
| VER-02 | Phase 52 | Complete |
| GATE-01 | Phase 53 | Complete |
| GATE-02 | Phase 53 | Complete |
| GATE-03 | Phase 53 | Complete |
| TEST-01 | Phase 53 | Complete |
| TEST-02 | Phase 53 | Complete |
| CI-01 | Phase 54 | Complete |
| CI-02 | Phase 54 | Complete |
| CI-03 | Phase 54 | Complete |
| CI-04 | Phase 54 | Complete |
| BOUND-01 | Phase 54 | Complete |
| BOUND-02 | Phase 54 | Complete |
| BOUND-03 | Phase 54 | Complete |

**Coverage:**
- v2.10 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-06-06*
*Last updated: 2026-06-06 after Phase 52 execution*
