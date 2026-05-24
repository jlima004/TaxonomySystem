---
phase: 11
slug: taxonomy-seed-v2-promotion-readiness-default-migration
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-24
---

# Phase 11 - Validation Strategy

> Per-phase validation contract for readiness and migration planning only.

Phase 11 validation must prove that the phase creates auditable planning documents without executing a v2 default switch, changing `DEFAULT_PATHS`, creating official `data/compiled/v2`, or altering code/data/artifacts.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest `^3.2.0` for existing curation/default-path tests; markdown/source assertions for Phase 11 docs |
| **Config file** | none detected beyond `src/package.json` scripts |
| **Quick run command** | `git diff --exit-code data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` |
| **Full suite command** | `test ! -d data/compiled/v2 && git diff --exit-code code/data/artifacts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` |
| **Estimated runtime** | ~5 seconds for source/protected-path assertions; curation tests are optional future dry-run only |

---

## Sampling Rate

- **After every task commit:** Run protected-path diff assertion and confirm only Phase 11 planning docs changed.
- **After every plan wave:** Confirm all required Phase 11 documents exist and no official `data/compiled/v2` directory exists.
- **Before `/gsd-verify-work`:** All five planning outputs must exist, all PROMO requirements must be mapped, and protected paths must be clean.
- **Max feedback latency:** 30 seconds for documentation/source assertions.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | PROMO-01, PROMO-02 | T-11-01 | Readiness audit remains planning-only and does not authorize default switch | source/doc assertion | `test -f .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-readiness-audit.md` | W0 | pending |
| 11-02-01 | 02 | 1 | PROMO-03, PROMO-04 | T-11-02 | Soft findings and legacy alias exception policy are explicit without alias JSON mutation | source/doc assertion | `test -f .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md` | W0 | pending |
| 11-03-01 | 03 | 1 | PROMO-05, PROMO-06 | T-11-03 | Graph/review readiness is documented without artificial edges, relation/accord edits, or review_queue mutation | source/doc assertion | `test -f .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-graph-review-readiness.md` | W0 | pending |
| 11-04-01 | 04 | 2 | PROMO-07, PROMO-08 | T-11-04 | Migration/default switch is proposal-only; `DEFAULT_PATHS` and official artifact paths remain unchanged | protected diff | `git diff --exit-code src/cli/parse_args.ts data/compiled/v1 && test ! -d data/compiled/v2` | W0 | pending |
| 11-05-01 | 05 | 2 | PROMO-09, PROMO-10 | T-11-05 | Rollback/release gate documents validatable rollback and final human approval without executing rollback or switch | source/doc assertion | `test -f .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-rollback-validation-release-gates.md` | W0 | pending |
| 11-ALL-01 | all | 2 | PROMO-01..PROMO-10 | T-11-01..T-11-05 | No code/data/artifact drift; no official v2 artifacts; Phase 11 outputs remain planning docs only | protected diff | `test ! -d data/compiled/v2 && git diff --exit-code code/data/artifacts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json src/cli/parse_args.ts` | yes | pending |

---

## Wave 0 Requirements

- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-readiness-audit.md` - readiness checklist and recommendation state for PROMO-01/PROMO-02.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md` - soft findings table and legacy alias exception policy for PROMO-03/PROMO-04.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-graph-review-readiness.md` - graph coverage and review queue readiness for PROMO-05/PROMO-06.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-migration-default-switch-proposal.md` - future migration/default-switch proposal for PROMO-07/PROMO-08.
- [ ] `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-rollback-validation-release-gates.md` - rollback, validation, release and human approval gates for PROMO-09/PROMO-10.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Final future promotion approval | PROMO-01, PROMO-10 | Phase 11 cannot grant promotion approval; context requires final persisted human approval in a separate future phase | Verify Phase 11 docs say approval remains future/persisted and no plan claims promotion is executed |
| Soft finding acceptance | PROMO-03, PROMO-04 | User must accept whether documented soft finding dispositions are sufficient for a future switch | Review `11-soft-findings-alias-policy.md` and confirm each disposition/rationale/promotion_blocker field is acceptable |
| Future rollback runbook approval | PROMO-09 | Rollback commands are documented but must not be executed in Phase 11 | Review `11-rollback-validation-release-gates.md` and confirm rollback validation is concrete before any future promotion phase |

---

## Validation Sign-Off

- [ ] All tasks have automated source/doc assertions or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without protected-path or document-existence verification.
- [ ] Wave 0 covers all missing Phase 11 planning artifacts.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 30s.
- [ ] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
