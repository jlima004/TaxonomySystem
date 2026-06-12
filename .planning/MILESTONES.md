# Milestones

## v2.11 Olfactory Knowledge Graph Read Model (Shipped: 2026-06-12)

**Phases completed:** 5 phases, 9 plans, 19 tasks

**Key accomplishments:**

- Static v2.11 olfactory graph contract with locked schema, namespace, input/output boundaries, and Phase 56 invariant handoff
- Pure in-memory `buildOlfactoryGraph` with contract IDs, deterministic ordering, derived stats, and inline Vitest determinism proofs
- Pure `validateOlfactoryGraph` with invariant-coded structured errors, inline failure coverage, and read-only live v2 baseline regression for 10/18/341/18/13
- Typed graph query proof contract with five fs-free hierarchy/alias functions and inline woody-baseline Vitest snapshots
- Three fs-free similarity query functions with inline snapshots, eight-function determinism, and live aggregate regression proving floral_rose hub and five cross-family bridges at v2 baseline scale
- Core file-system aware building blocks ensuring atomic graph writes, directory containment policy enforcement, and SHA-256 pre/post mutation detection for protected inputs.
- Command-line orchestrator exposing graph build, validation, serialization, boundary audit, and GVAL-05 guardrail processes in a single one-shot npm run command.
- Portuguese maintainer guide for the v2.11 olfactory graph read model with test-sourced query examples, derived-artifact disclaimer, and conceptual Neo4J mapping.
- Canonical v2.11 closure artifact and phase verification record completing milestone documentation, boundary evidence, and requirement traceability.

**Phases:** 55-59  
**Timeline:** 2026-06-09 → 2026-06-12 (4 days)  
**Requirements:** 22/22 satisfied (GCON, GBLD, GVAL, GQRY, GDOC)

### Known Tech Debt (accepted at close)

Milestone audit (`v2.11-MILESTONE-AUDIT.md`) status: tech_debt — all requirements satisfied, 7 non-blocking items:

- W-01: CLI integration tests never run non-dry-run path (sanctioned write + boundary audit + guardrails)
- W-02: GVAL-02 baseline stats enforced in regression tests only, not in `validateOlfactoryGraph` runtime
- W-03: `graphify_out_accesses` is declarative 0, not runtime-measured
- W-04/W-05: Invariant codes and ID prefixes hardcoded in validator/builder (drift risk vs contract constants)
- W-06: `query_graph` has no runtime validate-before-query guard
- W-07: Maintainer doc section ordering cosmetic jump (§3 → §9 → §10 → §4)

---

## v2.10 Integrity Gate Hardening & CI Wiring (Shipped: 2026-06-09)

**Phases completed:** 3 phases, 7 plans, 11 tasks

**Key accomplishments:**

- Retroactive Phase 50 verification and metadata trace now make HYG-02 and HYG-03 formally auditable without changing runtime behavior or taxonomy artifacts.
- Added `verify:integrity` as the official local guardrail and wired `compile:quality` to temp-output quality compile plus alias proof while keeping normal `compile` alias-gate-free.
- Refactored alias target inventory test to call `validateAliasTargetIntegrity` directly while preserving Phase 49 documentary fixture assertions.
- All Phase 53 proof commands pass: JSON PASS 341/18/0, compile isolation confirmed, full suite green, protected scopes untouched.
- 5k analysis stress benchmark stabilized with explicit local (1500ms) and CI (3000ms) ceilings — full suite 390/390 green
- Minimal Node 24 GitHub Actions workflow wires CI-01 through CI-04 to existing src npm scripts
- Final CI-equivalent proof and boundary audit pass — closure artifacts record 341/18/0 baseline and milestone audit routing
- GitHub Actions CI wired for install/typecheck/test/integrity proofs — v2.10 ready for milestone audit with 341/18/0 baseline preserved

---

## v2.9 Alias Target Integrity & Descriptor Hygiene (Shipped: 2026-06-06)

**Phases completed:** 3 phases, 3 plans, 4 tasks
**Phases:** 49-51
**Timeline:** 2026-06-05 → 2026-06-06 (2 days)

**Key accomplishments:**

- Evidence-backed alias target inventory: 18/18 alias coverage, 17 valid targets, 1 remediation-required dangling target (`ylang ylang -> ylang_ylang`) — Phase 49.
- Automated `alias:integrity` gate with pure validator and documented empty exception policy (`alias_target_exceptions.v1.json`) — Phase 50, HYG-02/03.
- Resolved `ylang ylang -> ylang_ylang` via `add_target` under `floral/floral_white`; published v2.9.0 artifacts with gate proof `341/18/0` — Phase 51, HYG-01.

### Known Gaps (accepted at close)

Milestone audit (`v2.9-MILESTONE-AUDIT.md`) flagged verification/documentation debt only — all three requirements implemented in code:

- HYG-02, HYG-03: orphaned in formal verification (missing `50-VERIFICATION.md`, SUMMARY lacks `requirements-completed` frontmatter).
- `alias:integrity` gate is opt-in, not wired into default CI.
- FUT-01 (243 low_support) and FUT-02 (13 seed_corpus_conflict) deferred to next milestone.

---

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
