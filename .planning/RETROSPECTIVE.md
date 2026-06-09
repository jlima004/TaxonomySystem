# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v2.10 — Integrity Gate Hardening & CI Wiring

**Shipped:** 2026-06-09
**Phases:** 3 | **Plans:** 7 | **Sessions:** N/A

### What Was Built
- Retroactive Phase 50 verification (`50-VERIFICATION.md`, `50-METADATA-TRACE.md`) closing HYG-02/HYG-03 documentation debt.
- Local guardrails: `verify:integrity` and `compile:quality` wired without polluting normal `compile`.
- Inventory tests refactored to reuse `validateAliasTargetIntegrity` directly.
- GitHub Actions CI (Node 24) for install, typecheck, 390/390 tests, and dual alias integrity JSON proofs.
- Protected 341/18/0 baseline preserved — no seed or compiled artifact mutations.

### What Worked
- Documentation-only Phase 52 unblocked guardrail work without touching runtime or taxonomy truth.
- Three-phase pipeline (verification → local guardrails → CI) kept scope bounded and auditable.
- Environment-aware stress benchmark ceilings (1500ms local / 3000ms CI) stabilized the test gate without weakening CI proof.

### What Was Inefficient
- Guardrail naming drift between Phase 52 docs (`alias:integrity`) and Phase 53 scripts (`verify:integrity`) — minor documentation debt accepted at audit.
- Local `npm test` without `CI=true` may fail on stress benchmark; developers need CI env or accept the local ceiling limitation.
- Duplicate precompile in CI (alias:integrity + verify:integrity) adds latency only.

### Patterns Established
- Retroactive verification ledgers can cite live proof commands when implementation exists but formal verification is missing.
- Integrity gates belong in quality/safety/CI flows, not the normal compile path.
- Post-proof state updates only after command and boundary evidence collected (Phase 54 closure pattern).

### Key Lessons
1. Implementation-complete ≠ verification-complete — retroactive verification prevents audit gaps at milestone close (v2.9 debt resolved in v2.10).
2. CI wiring should consume existing npm scripts rather than inventing parallel proof paths.
3. Boundary audits (no seed/compiled/deferred-scope changes) are essential for infrastructure-only milestones.

### Cost Observations
- Model mix: N/A (mixed sessions across planning and execution)
- Notable: Small focused milestone (3 phases, 7 plans) closed v2.9 verification debt and added CI in ~3 days.

---

## Milestone: v2.6 — Stabilization & Closure

**Shipped:** 2026-05-29
**Phases:** 2 | **Plans:** 2 | **Sessions:** N/A

### What Was Built
- Microcuration of 18 Group B conflicts, resolving 10 and deferring 8 to manual review.
- Validation and compilation of the taxonomy v2.6 artifacts with zero errors.
- Stable baseline established with a review queue of 283 items (275 low_support + 8 remaining conflicts).

### What Worked
- Separating microcuration (Phase 38) from compilation and stabilization (Phase 39) made validation highly deterministic.
- Formal decision matrix mapping for every conflict explicitly tracked resolution logic.

### What Was Inefficient
- Deferring 8 conflicts due to ambiguous meaning or complex cross-references indicates that some items inherently resist algorithmic or simple manual alignment without deeper expert context.

### Patterns Established
- Explicit two-wave curation: decision matrix wave followed by safe mutation wave.
- Non-mutating stabilization phases for artifact release.

### Key Lessons
1. Microcuration is safer when executed under strict isolation from the compilation process.
2. Group B conflict resolution is best handled incrementally, accepting deferred items over forced merges.

### Cost Observations
- Model mix: 100% Gemini 3.1 Pro (High)
- Notable: Fast artifact validation due to automated invariant checks.

---

## Milestone: v2.9 — Alias Target Integrity & Descriptor Hygiene

**Shipped:** 2026-06-06
**Phases:** 3 | **Plans:** 3 | **Sessions:** N/A

### What Was Built
- Read-only alias target integrity inventory proving 18 aliases, 17 valid targets, 1 dangling target (`ylang ylang -> ylang_ylang`).
- Automated `alias:integrity` gate with pure validator, empty exception policy, and opt-in CLI proof surface.
- `ylang_ylang` curated seed target under `floral/floral_white`; v2.9.0 artifacts published with gate proof `341/18/0`.

### What Worked
- Strict three-phase pipeline: inventory → automation → remediation kept scope bounded and auditable.
- Before/after gate proof (`340/17/1` → `341/18/0`) made remediation verifiable without touching default compile flows.
- `add_target` path preserved the legacy alias map and empty exception policy — no remap/drop/exception needed.

### What Was Inefficient
- Phases 49 and 50 shipped without `VERIFICATION.md`, leaving HYG-02/HYG-03 formally orphaned despite working implementation.
- The dangling alias had persisted since Phase 8 and blocked curation decisions (v2.8 `cananga` row) — structural debt that should have been a dedicated milestone earlier.

### Patterns Established
- Alias remediation proof sequence: before failing gate → safe-fit rationale → seed append → sandbox compile → official publish → passing gate.
- Opt-in integrity gates separate from default compile/test pipeline (proof commands, not pipeline blockers).

### Key Lessons
1. Alias target integrity should be gated before low-support curation batches, not deferred as a soft warning in decision matrices.
2. Implementation-complete ≠ verification-complete — retroactive `VERIFICATION.md` for automation phases prevents audit gaps at milestone close.

### Cost Observations
- Model mix: N/A (mixed sessions across planning and execution)
- Notable: Small focused milestone (3 phases) closed a long-standing structural gap in 2 days.

---

## Milestone: v2.8 — Low-Support Review Queue Triage Batch 2

**Shipped:** 2026-06-04
**Phases:** 5 | **Plans:** 5 | **Sessions:** N/A

### What Was Built
- Bounded Batch 2 low-support triage: 259 candidates inventoried → 40 selected → 12 promoted to seed (carrot_seed, freesia, cardamom, tangerine, saffron, osmanthus, cubeb, elderflower, mace, linden_flower, agarwood, tolu).
- Parser-checked 40-row decision matrix with strict 12/28 mutation gate; Phase 47 received exactly 12 promote_to_seed instructions and zero add_alias.
- v2.8.0 compiled artifacts published with closure metrics measured from published JSON (not /tmp).

### What Worked
- Strict decision-matrix-as-mutation-authorization-gate pattern: Phase 47 ignored all non-executable rows mechanically.
- Two-step publication (sandbox in /tmp, then official to data/compiled/v2) caught issues before they could pollute the canonical artifact set.
- Published-JSON closure metrics: re-parsing the compiled JSON to compute deltas is auditable and reproducible.

### What Was Inefficient
- Phase 48 had a partial run that committed Tasks 1-4 but stopped before writing 48-01-SUMMARY.md; closeout had to resume from committed state. (Auto-fixed; not a blocker.)
- The legacy `ylang ylang -> ylang_ylang` alias target gap keeps re-surfacing in curation decisions and was again deferred to the next milestone. This is a structural debt that should be resolved before further low-support triage.

### Patterns Established
- Closure phases measure metrics from the published `data/compiled/v2/*.json`, not from `/tmp` validation output. (Phase 48 established this; reuse in v2.9+.)
- "Resume from committed artifact state if SUMMARY.md is missing" pattern for publication phases (avoids duplicate publication commits).

### Key Lessons
1. Selection-yield ratios (12/40 = 30%) are a useful input to bound future batches — high decision friction for non-promote_to_seed rows is expected.
2. Alias target integrity must be checked before the next low-support batch, not as a soft warning during decision matrix work.

### Cost Observations
- Model mix: 100% Gemini 3.1 Pro (High) for the curation/planning phases.
- Notable: parser-verified decision matrix reduced subjective review load on Phase 47 execution.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v2.6      | -        | 2      | Two-wave decision matrix and microcuration separation. |
| v2.8      | -        | 5      | Closure metrics from published JSON; resume-from-committed-state for publication phases. |
| v2.9      | -        | 3      | Alias integrity inventory → gate → remediation pipeline; opt-in proof CLI. |
| v2.10     | -        | 3      | Retroactive verification; local guardrails; GitHub Actions CI for integrity proofs. |

### Cumulative Quality

| Milestone |            Tests           |Zero-Dep Additions |
|-----------|----------------------------|-------------------|
| v2.6      | Test Files: 53 passed / 53 | 0                 |
|           | Tests: 375 passed / 375    |                   |
| v2.8      | Test Files: 53 passed / 53 | 0                 |
|           | Tests: 376 passed / 376    |                   |
| v2.10     | Tests: 390 passed / 390  | 0                 |

### Top Lessons (Verified Across Milestones)

1. Curation and compilation must remain separate architectural phases.
2. Schema invariants and safety guards are the foundation of taxonomy confidence.
3. Closure metrics must be measured from the canonical published artifact, not from sandbox validation output.
4. Integrity gates belong in quality/safety/CI flows — not the normal compile path.
5. Retroactive verification closes documentation debt without blocking operational hardening.
