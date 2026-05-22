---
phase: 08
slug: taxonomy-seed-expansion-curation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-22
---

# Phase 08 - Validation Strategy

Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest (`^3.2.0`) |
| Config file | `src/vitest.config.ts` |
| Quick run command | `cd src && npm test -- tests/seed_validator.test.ts tests/compiler/quality_gates.test.ts` |
| Full suite command | `cd src && npm run typecheck && npm test && npm run build` |
| Estimated runtime | TBD by executor on first run |

---

## Sampling Rate

- After every task commit: run the fastest changed-file or focused Vitest command listed in the task.
- After every plan wave: run `cd src && npm run typecheck && npm test && npm run build`.
- Before `/gsd-verify-work`: full suite must be green and v1-vs-v2 compile comparison must be documented. Baseline comparison compiles must always pass explicit `--out /tmp/opencode/taxonomy-phase8-comparison/v1-baseline`; never run default `npm run compile -- --generated-at ...` for Phase 8 validation because the default output path is `data/compiled/v1`.
- Max feedback latency: executor must report actual runtime after first focused and full runs.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | CUR-01, CUR-03 | T-08-01 | Curation records require explicit manual approval, rationale, and evidence before seed edits. | unit/data | `cd src && npm test -- tests/curation/taxonomy_seed_v2.test.ts` | No - W0 | pending |
| 08-01-02 | 01 | 1 | CUR-04 | T-08-02 | Review queue evidence remains review-only and dispositions do not mutate curated truth. | unit/data | `cd src && npm test -- tests/curation/review_dispositions.test.ts` | No - W0 | pending |
| 08-02-01 | 02 | 2 | CUR-02 | T-08-03 | `taxonomy-seed.v1.json` is preserved; v2 compiles only through explicit CLI paths. | integration/CLI | `cd src && npm test -- tests/cli/parse_args.test.ts tests/cli/compile.test.ts tests/curation/taxonomy_seed_v2.test.ts` | Partial - W0 | pending |
| 08-03-01 | 03 | 3 | CUR-05 | T-08-04 | Approved aliases map only to clear canonical v2 descriptors and never become primary descriptors. | unit/data | `cd src && npm test -- tests/compiler/compile_aliases.test.ts tests/curation/alias_seed_v2.test.ts` | Partial - W0 | pending |
| 08-04-01 | 04 | 3 | CUR-06 | T-08-05 | Manual relation/accord scores stay normalized in [0,1]; missing relation/accord remains neutral/undefined. | unit/integration | `cd src && npm test -- tests/inference/tradition_score.test.ts tests/inference/accord_compatibility.test.ts tests/curation/relation_accord_v2.test.ts` | Partial - W0 | pending |
| 08-05-01 | 05 | 4 | CUR-07 | T-08-06 | v1-vs-v2 comparison separates hard failures from soft curation warnings without overwriting tracked v1 artifacts. | integration/smoke | `cd src && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v1.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v1.json --accords ../data/inference/accord_map.v1.json --out /tmp/opencode/taxonomy-phase8-comparison/v1-baseline --version 1.0.0 --generated-at 2026-01-01T00:00:00.000Z && npm run compile -- --seed ../data/taxonomy/taxonomy-seed.v2.json --aliases ../data/taxonomy/descriptor_aliases.seed.json --relations ../data/inference/curated_relations.v2.json --accords ../data/inference/accord_map.v2.json --out /tmp/opencode/taxonomy-phase8-comparison/v2-candidate --version 2.0.0 --generated-at 2026-01-01T00:00:00.000Z` | Partial - W0 | pending |

---

## Wave 0 Requirements

- [ ] `src/tests/curation/taxonomy_seed_v2.test.ts` - covers CUR-01, CUR-02, CUR-03.
- [ ] `src/tests/curation/review_dispositions.test.ts` - covers CUR-04.
- [ ] `src/tests/curation/alias_seed_v2.test.ts` - covers CUR-05.
- [ ] `src/tests/curation/relation_accord_v2.test.ts` - covers CUR-06.
- [ ] `src/tests/curation/v1_v2_comparison.test.ts` or an equivalent documented CLI smoke procedure - covers CUR-07.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Approve initial descriptor/subfamily/family set for `gourmand`, `spicy`, `green`, `fruity`, `amber_resinous`, and `animalic`. | CUR-01, CUR-03 | The project explicitly requires manual curation; corpus evidence is not sufficient. | Review curation sidecar entries and confirm every promoted entry has approval, rationale, and evidence. |
| Approve alias canonical ownership. | CUR-05 | Ambiguous aliases require human semantic judgment. | Confirm each alias points to one clear canonical v2 descriptor and does not duplicate a primary descriptor. |
| Approve relation/accord gaps or manual scores. | CUR-06 | Missing relation/accord is neutral unless a curator chooses a score. | Review every new subfamily's relation/accord block and confirm either a manual score in [0,1] or an explicit gap rationale. |
| Review soft warnings from v1-vs-v2 comparison. | CUR-07 | Soft findings guide curation but do not fail by default. | Confirm regressions, zero-frequency seeds, sparse graph findings, and deferred gaps are documented with rationale. |

---

> Phase 8 may execute from 08-01 because Wave 0 dependencies are created inside the executable plans.
> `nyquist_compliant: true` and `wave_0_complete: true` must only be set by 08-05 after all curation tests and the v1-v2 comparison pass.

## Validation Sign-Off

- [ ] All tasks have automated verify commands or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verification.
- [ ] Wave 0 covers all missing test references.
- [ ] No watch-mode flags.
- [ ] Feedback latency recorded after first focused/full runs.
- [ ] `nyquist_compliant: true` set in frontmatter after Wave 0 tests exist and pass.

Approval: approved_for_execution_with_wave0_dependencies
