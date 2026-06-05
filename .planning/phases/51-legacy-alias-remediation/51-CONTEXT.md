# Phase 51: Legacy Alias Remediation - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 51 resolves HYG-01 by remediating the single confirmed dangling alias target from Phase 49: `ylang ylang -> ylang_ylang`.

The phase delivers an explicit remediation decision, the minimum seed/data mutations required to make the alias target resolve, official compiled artifact publication when seed changes, and before/after proof via the Phase 50 `alias:integrity` gate.

Phase 51 is alias-target hygiene only. It must not open Batch 3 low-support curation, remap aliases to corpus candidates, approve permanent exceptions for this pair, or touch relations/accords.

</domain>

<decisions>
## Implementation Decisions

### Remediation Path

- **D-51-01:** Primary remediation path is `add_target`: add `ylang_ylang` as a curated seed descriptor so the existing alias `ylang ylang -> ylang_ylang` resolves without changing the alias map.
- **D-51-02:** Do not remap `ylang ylang` to `ylang`. `ylang` is a corpus candidate (`source: "corpus"`, `status: "candidate"`, `review_required: true`) and is semantically distinct from the expected target `ylang_ylang`.
- **D-51-03:** Do not approve a permanent exception for `ylang ylang -> ylang_ylang` in `data/taxonomy/alias_target_exceptions.v1.json`. Phase 49 classified this pair as `remediation_required`, not `possible_exception_candidate`.
- **D-51-04:** Do not drop/remove the alias unless curation concludes there is no safe target. The user preference is to preserve the alias and add the missing curated target.
- **D-51-05:** `descriptor_aliases.seed.json` should remain unchanged in the happy path. The alias already points to the correct intended target; remediation is by making that target exist.

### Taxonomy Placement

- **D-51-06:** Strong preferred placement lock: add `ylang_ylang` under existing `floral/floral_white`, appended to the current descriptors list, alongside peers such as `jasmine`, `tuberose`, `orange_blossom`, `gardenia`, `lily_of_the_valley`, `freesia`, `osmanthus`, `elderflower`, and `linden_flower`.
- **D-51-07:** Placement is allowed only if the executor confirms safe semantic fit with the existing white-floral family context. Do not use stretch placement.
- **D-51-08:** Do not place `ylang_ylang` under or via the corpus candidate `ylang`.
- **D-51-09:** Do not create a new family or subfamily for `ylang_ylang`.

### Safe-Fit Criteria

Before promoting `ylang_ylang`, the executor must verify all of the following:

- **D-51-10:** `ylang_ylang` is a legitimate olfactory descriptor, not alias noise or mechanical alias repair.
- **D-51-11:** There is safe semantic fit in an existing family/subfamily; preferred lock is `floral/floral_white`.
- **D-51-12:** Remediation does not require a new family/subfamily.
- **D-51-13:** Remediation is not achieved by promoting or inferring from the corpus candidate `ylang`.
- **D-51-14:** Remediation does not rely on an exception entry in `alias_target_exceptions.v1.json`.
- **D-51-15:** The executor must document the safe-fit rationale in phase artifacts before mutating seed data.

### No-Safe-Fit Fallback

- **D-51-16:** If the executor concludes there is no safe fit in any existing subfamily, halt Phase 51 before mutation and produce a manual-review checkpoint.
- **D-51-17:** In the no-safe-fit case, do not remap to `ylang`, do not add an exception, do not drop the alias, do not create a new family/subfamily, and do not force weak placement.
- **D-51-18:** In the no-safe-fit case, HYG-01 remains unresolved and the v2.9 milestone cannot close until the operator explicitly chooses one of the fallback remediation paths.

### Publication and Proof

- **D-51-19:** Required proof sequence:

```text
1. Before mutation: npm run alias:integrity exits non-zero with exactly ylang ylang -> ylang_ylang
2. Add ylang_ylang as curated seed target (happy path)
3. Sandbox compile with --version 2.9.0
4. Official compile/publish to data/compiled/v2 with --version 2.9.0
5. After publication: npm run alias:integrity exits 0
6. Full test suite passes
```

- **D-51-20:** If `taxonomy-seed.v2.json` is mutated, Phase 51 must sandbox-compile and officially publish v2.9.0 artifacts to `data/compiled/v2` using explicit `--version 2.9.0`. The gate validates against compiled taxonomy IDs, so publication is required for PASS proof.
- **D-51-21:** Do not change `DEFAULT_PATHS` or default version policy in `src/cli/parse_args.ts`. Follow v2.7/v2.8 precedent: explicit version flag for publication, defaults unchanged.
- **D-51-22:** `npm run alias:integrity` is the deterministic before/after proof command from Phase 50. JSON output via `--json` is available for deterministic assertions.

### Relations and Accords

- **D-51-23:** Do not add, remove, or modify relations or accords in Phase 51. Missing relation/accord coverage for the new descriptor remains neutral/undefined.

### Non-Remediation Boundary

- **D-51-24:** Phase 51 may change only remediation surfaces: `data/taxonomy/taxonomy-seed.v2.json` (happy path), official `data/compiled/v2/*` publication when seed changes, phase planning/verification/summary docs, and proof/test execution.
- **D-51-25:** Phase 51 must not change low_support matrices, seed_corpus_conflict handling, scoring, Graphify outputs, MVP/SaaS, Knowledge Engine, or UI surfaces.
- **D-51-26:** Phase 51 must not promote or mutate the corpus candidate `ylang` as part of alias remediation.
- **D-51-27:** Phase 51 must resolve only dangling targets confirmed in Phase 49. Current inventory shows exactly one dangling pair.

### the agent's Discretion

- Exact approval-traceability artifact format and filename are planner discretion, as long as the add_target decision is evidence-backed and auditable.
- Exact sandbox `/tmp` compile path and publication command sequencing are planner discretion within the proof sequence above.
- Minor test additions beyond alias-integrity proof are planner discretion if they strengthen HYG-01 verification without expanding scope.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements

- `.planning/ROADMAP.md` — Phase 51 goal, dependency on Phase 50, and remediation boundary.
- `.planning/REQUIREMENTS.md` — HYG-01 mapped to Phase 51.
- `.planning/PROJECT.md` — v2.9 milestone goal and alias hygiene scope.
- `.planning/STATE.md` — Phase 49/50 completion state and locked dangling-target finding.
- `.planning/v2.9-MILESTONE-AUDIT.md` — current milestone gap: Phase 51 absent, gate still failing on live data.

### Phase 49 Handoff (inventory source of truth)

- `.planning/phases/49-alias-target-integrity-inventory/49-CONTEXT.md` — `remediation_required` classification and near-match rationale.
- `.planning/phases/49-alias-target-integrity-inventory/49-ALIAS-TARGET-INVENTORY.md` — evidence-backed inventory: 18 aliases, 17 valid targets, 1 dangling target.

### Phase 50 Handoff (proof gate)

- `.planning/phases/50-alias-target-integrity-automation/50-CONTEXT.md` — `alias:integrity` proof command, exception-policy boundary, non-remediation rules.
- `.planning/phases/50-alias-target-integrity-automation/50-01-SUMMARY.md` — delivered validator, CLI, and npm script.
- `src/cli/alias_integrity.ts` — focused proof command implementation.
- `src/compiler/alias_target_integrity.ts` — reusable validator logic.
- `src/package.json` — `alias:integrity` npm script entrypoint.

### Live Data Sources

- `data/taxonomy/descriptor_aliases.seed.json` — alias map; happy path keeps `ylang ylang -> ylang_ylang` unchanged.
- `data/taxonomy/taxonomy-seed.v2.json` — curated seed mutation surface for `add_target`.
- `data/taxonomy/alias_target_exceptions.v1.json` — exception policy; must remain without `ylang ylang` approval in happy path.
- `data/compiled/v2/taxonomy.json` — compiled descriptor ID lookup source for gate proof.
- `data/compiled/v2/descriptor_aliases.json` — compiled alias artifact; must continue reflecting seed alias map after compile.

### Curation Precedents

- `.planning/phases/20-alias-target-microcuration-execution/` — `petitgrain` add_target precedent under `citrus/citrus_fresh`; alias preserved while target was added.
- `.planning/phases/23-v2-2-microcuration-candidate-selection/` — `lemon_peel` add_target precedent.
- `.planning/phases/48-v2-8-artifact-publication-closure/48-CONTEXT.md` — explicit-version publication pattern without changing CLI defaults.

### Tests and Verification Surfaces

- `src/tests/cli/alias_integrity.test.ts` — live-data proof expectations for gate behavior.
- `src/tests/inventory/alias_target_inventory.test.ts` — locked near-match evidence for `ylang` vs absent `ylang_ylang`.
- `.planning/phases/50-alias-target-integrity-automation/50-VALIDATION.md` — combined proof expectations for build/compile/test vs alias gate.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `validateAliasTargetIntegrity` in `src/compiler/alias_target_integrity.ts` is the deterministic before/after proof engine.
- `runAliasIntegrityCli` in `src/cli/alias_integrity.ts` exposes human and JSON output for Phase 51 verification.
- `compileAliases` and the existing compile CLI can regenerate compiled artifacts after seed mutation.
- `floral_white` in `data/taxonomy/taxonomy-seed.v2.json` already hosts white-floral peers (`jasmine`, `tuberose`, `orange_blossom`, etc.), making it the natural placement candidate.

### Established Patterns

- Alias remediation in prior phases solved absent targets by `add_target`, not by remapping aliases (`petitgrain`, `lemon_peel`, `ambergris`, `rosewood`).
- Corpus candidates remain review-required evidence and must not be promoted implicitly during alias cleanup.
- Official artifact publication uses explicit `--version` and leaves `DEFAULT_PATHS` unchanged.
- Validation commands are side-effect free; publication is a separate explicit step.

### Integration Points

- Phase 51 happy path mutates `taxonomy-seed.v2.json`, then recompiles to `data/compiled/v2`, then reruns `npm run alias:integrity` against live compiled taxonomy IDs.
- The dangling alias already exists in seed and compiled alias maps; only the target descriptor is missing from compiled taxonomy/seed.
- `ylang` already exists in compiled taxonomy as a corpus candidate and must remain separate from curated `ylang_ylang`.

</code_context>

<specifics>
## Specific Ideas

- User preference stated upfront: prefer `add_target` of `ylang_ylang`; avoid remap to `ylang`, exception approval, or alias removal unless curation finds no safe target.
- Strong preferred lock to `floral/floral_white` when semantic fit is confirmed.
- Publication is not optional when seed changes: sandbox compile plus official `v2.9.0` publish are required because the integrity gate reads compiled taxonomy IDs.
- If safe fit cannot be confirmed, stop before mutation and force explicit operator choice rather than auto-selecting remap, exception, or drop.

</specifics>

<deferred>
## Deferred Ideas

- Wire `alias:integrity` into default `npm test` or normal compile as a permanent hard gate after v2.9 closure.
- Bootstrap relations/accords for `ylang_ylang` — belongs to a future curation phase if desired.
- Promote or reconcile the corpus candidate `ylang` with curated `ylang_ylang` — out of scope for alias hygiene.
- Batch 3 low-support curation and unrelated descriptor promotion — explicitly excluded from v2.9.

None from prior phases beyond the above — discussion stayed within phase scope.

</deferred>

---

*Phase: 51-Legacy-Alias-Remediation*
*Context gathered: 2026-06-05*
