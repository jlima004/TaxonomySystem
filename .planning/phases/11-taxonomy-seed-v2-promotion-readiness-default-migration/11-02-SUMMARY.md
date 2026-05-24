---
phase: 11-taxonomy-seed-v2-promotion-readiness-default-migration
plan: "02"
title: Soft findings and legacy alias exception policy
status: completed
type: documentation-only
requirements:
  - PROMO-03
  - PROMO-04
files_changed:
  - .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md
  - .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-02-SUMMARY.md
---

# Phase 11 Plan 02: Soft findings and legacy alias exception policy Summary

Defined a complete, auditable soft-findings disposition ledger and legacy-alias exception policy for promotion readiness without mutating any code/data/default paths.

## Completed Objectives

- Produced `11-soft-findings-alias-policy.md` with required sections and disposition vocabulary.
- Added the final soft findings table with required columns and exactly six known findings:
  - `legacy_ylang_alias_absent_target`
  - `lower_graph_density`
  - `inherited_zero_frequency_seeds`
  - `review_queue_317`
  - `increased_seed_corpus_conflict`
  - `pending_deferred_candidates`
- Captured PROMO-04 legacy alias exception policy and explicit exception row for:
  - `ylang ylang -> ylang_ylang`
- Documented guardrails forbidding Phase 11 remediations (no add/remove/remap for this alias in this phase).

## Verification Results

| Check | Command | Result |
|---|---|---|
| Task 1 file and required terms | `test -f .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'PROMO-03' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'legacy_ylang_alias_absent_target' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'pending_deferred_candidates' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md` | PASS |
| Task 2 policy and protected diff | `grep -q 'PROMO-04' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'New aliases with absent targets are hard blockers' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'ylang ylang' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && grep -q 'must not add \`ylang_ylang\`' .planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-soft-findings-alias-policy.md && git diff --exit-code data/taxonomy/descriptor_aliases.seed.json data/taxonomy/taxonomy-seed.v2.json` | PASS |
| Protected files + no compiled v2 | `test ! -d data/compiled/v2 && git diff --exit-code -- src/cli/parse_args.ts data/compiled/v1 data/taxonomy/taxonomy-seed.v1.json data/inference/curated_relations.v1.json data/inference/accord_map.v1.json` | PASS |

## Deviations from Plan

None - plan executed exactly as written.

## Notes

- Documentation-only execution respected.
- No code/data changes were made.
- No commits were created per execution constraint.
