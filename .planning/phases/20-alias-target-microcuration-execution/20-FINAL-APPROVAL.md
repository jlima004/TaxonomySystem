# Phase 20 Final Approval - Petitgrain Add Target Only

approval_id: phase20-petitgrain-add-target-approval
manual_approval: approved
primary_disposition: promote_to_seed
family_id: citrus
subfamily_id: citrus_fresh
descriptor_id: petitgrain
alias_preserved: petit grain -> petitgrain
ylang_policy: accepted_exception_interim
rationale: Resolve corpus-backed absent alias target by adding canonical descriptor to seed truth.
evidence: compiled v2 candidate frequency 52 in citrus_fresh; absent from seed v2 before Phase 20 execution; existing alias mapping already present.
rollback_plan: pre-mutation snapshot of data/taxonomy/taxonomy-seed.v2.json and exact restore by removing only petitgrain.
publication_boundary: no official data/compiled/v2 publication in Phase 20

## Approved Scope

- Add `petitgrain` only in `data/taxonomy/taxonomy-seed.v2.json` under `citrus` / `citrus_fresh`.
- Preserve `data/taxonomy/descriptor_aliases.seed.json` without changes.
- Preserve `petit grain -> petitgrain` as the existing alias now resolved by seed descriptor presence.
- Preserve `ylang ylang -> ylang_ylang` as `accepted_exception_interim`; no `ylang_ylang` add_target is approved.
- Do not publish, refresh, or regenerate official `data/compiled/v2` artifacts in Phase 20.

## Allowlist

- `.planning/phases/20-alias-target-microcuration-execution/20-FINAL-APPROVAL.md`
- `data/taxonomy/taxonomy-seed.v2.json`
- Phase 20 summary or closure artifacts if needed for execution closure.

## Blocked Paths

- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `data/inference`
- `src/cli/parse_args.ts`
- `scripts/check-safety-guards.sh`
- `src/package.json`
- `graphify-out/*`
