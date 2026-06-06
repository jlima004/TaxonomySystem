---
phase: 51-legacy-alias-remediation
verified: 2026-06-06T00:32:01Z
status: passed
score: 6/6 must-haves verified
overrides_applied: 0
---

# Phase 51: Legacy Alias Remediation Verification Report

**Phase Goal:** Resolve `ylang ylang -> ylang_ylang` and any other dangling target confirmed in Phase 49, using the Phase 50 alias integrity gate as proof.
**Verified:** 2026-06-06T00:32:01Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Pre-remediation state had exactly one dangling target, `ylang ylang -> ylang_ylang`. | ✓ VERIFIED | Independent git-state check against `c202a6f^` found 340 compiled descriptors, 18 aliases, and one unresolved pair: `["ylang ylang","ylang_ylang"]`. |
| 2 | `ylang_ylang` exists as a curated seed descriptor under `floral/floral_white`, appended after `linden_flower`, and is compiled as `source: seed`. | ✓ VERIFIED | `data/taxonomy/taxonomy-seed.v2.json:16-27` ends `elderflower`, `linden_flower`, `ylang_ylang`; `git show c202a6f` shows exactly the one-line append. `data/compiled/v2/taxonomy.json:1130-1213` contains `ylang_ylang` under `floral_white` with `source: "seed"`, `status: "curated"`. |
| 3 | Alias map remains `ylang ylang -> ylang_ylang`; exceptions remain empty; `ylang` remains a separate corpus candidate. | ✓ VERIFIED | `data/taxonomy/descriptor_aliases.seed.json:19` maps `"ylang ylang": "ylang_ylang"`; `data/taxonomy/alias_target_exceptions.v1.json:4` has `exceptions: []`; `data/compiled/v2/taxonomy.json:1351-1356` keeps `ylang` as `source: "corpus"`, `status: "candidate"`. |
| 4 | Official v2.9.0 publish exists while `DEFAULT_PATHS.version` remains `2.1.0`. | ✓ VERIFIED | Node artifact check reported all three compiled v2 artifacts at version `2.9.0`; `src/cli/parse_args.ts:16-25` keeps `DEFAULT_PATHS.version: '2.1.0'`. |
| 5 | Phase 50 alias integrity gate passes with 341 compiled descriptors, 18 valid targets, and 0 unresolved targets. | ✓ VERIFIED | Ran `npm --prefix src run alias:integrity -- --json`; exit 0 and JSON output: `status: PASS`, `seed_alias_count: 18`, `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`, `unresolved: []`. |
| 6 | Full suite proof and code-review gate are clean. | ✓ VERIFIED | Ran `npm --prefix src test`; exit 0, `Test Files 56 passed (56)`, `Tests 389 passed (389)`. `.planning/phases/51-legacy-alias-remediation/51-REVIEW.md:14-19` reports 0 findings and `status: clean`. |

**Score:** 6/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.planning/phases/51-legacy-alias-remediation/51-SAFE-FIT-RATIONALE.md` | Evidence-backed safe-fit affirmation for `ylang_ylang` in `floral_white` | ✓ VERIFIED | Exists and substantive; lines 16-46 document legitimacy, placement, no alias remap, no exception, and add-target decision. |
| `data/taxonomy/taxonomy-seed.v2.json` | Curated seed with `ylang_ylang` appended to `floral_white.descriptors` | ✓ VERIFIED | Lines 16-27 show the trailing append after `linden_flower`; node check counted one seed occurrence of `ylang_ylang`. |
| `data/taxonomy/descriptor_aliases.seed.json` | Preserved 18-entry alias map including `ylang ylang -> ylang_ylang` | ✓ VERIFIED | Lines 1-20 show 18 aliases; line 19 preserves the legacy alias target. |
| `data/taxonomy/alias_target_exceptions.v1.json` | Empty exception policy | ✓ VERIFIED | Lines 1-5 show `exceptions: []`. |
| `data/compiled/v2/taxonomy.json` | Published v2.9.0 taxonomy with `ylang_ylang` as seed descriptor | ✓ VERIFIED | Version `2.9.0`; 341 unique descriptors; `ylang_ylang` under `floral_white` as `source: seed`. |
| `data/compiled/v2/descriptor_aliases.json` | Published v2.9.0 aliases, 18 entries, same ylang alias | ✓ VERIFIED | Version `2.9.0`; node check found 18 aliases and `ylang ylang -> ylang_ylang`. |
| `data/compiled/v2/similarity_matrix.json` | Published v2.9.0 similarity artifact | ✓ VERIFIED | Version `2.9.0`; contains seed/corpus relation evidence for `ylang_ylang`/`ylang`. |
| `src/cli/parse_args.ts` | Protected default version remains `2.1.0` | ✓ VERIFIED | Lines 16-25 show unchanged `DEFAULT_PATHS.version: '2.1.0'`. |
| `src/tests/inventory/alias_target_inventory.test.ts` | Live-data inventory assertions updated to 341/18/0 | ✓ VERIFIED | Grep found assertions for 341 descriptors, 18 aliases/valid targets, and `ylang_ylang` present in seed and compiled sources. |
| `src/tests/cli/alias_integrity.test.ts` | CLI live-data gate assertions updated to exit 0 / PASS | ✓ VERIFIED | Lines 77-86 and 150-162 assert exit 0, PASS, 341/18/0. |
| `src/tests/curation/taxonomy_seed_v2.test.ts` | Traceability for Phase 51 seed addition | ✓ VERIFIED | Line 511 references `descriptorId: 'ylang_ylang'`; full suite confirms traceability contract passes. |

GSD artifact verifier also returned `all_passed: true` for all five PLAN-declared artifacts.

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `data/taxonomy/taxonomy-seed.v2.json` | `data/compiled/v2/taxonomy.json` | `npm run compile -- --version 2.9.0` | ✓ VERIFIED | Compiled taxonomy contains the seed descriptor under `floral_white` and all compiled v2 artifact versions are `2.9.0`. |
| `data/compiled/v2/taxonomy.json` | `src/cli/alias_integrity.ts` | `validateAliasTargetIntegrity` reads compiled descriptor IDs | ✓ VERIFIED | `src/cli/alias_integrity.ts:51-68` reads compiled taxonomy, builds descriptor ID set, and calls `validateAliasTargetIntegrity(...)`. |
| `data/taxonomy/descriptor_aliases.seed.json` | `npm run alias:integrity` | Preserved alias resolves when target exists | ✓ VERIFIED | Gate command exited 0 with `valid_target_count: 18` and `unresolved_target_count: 0`. |

GSD key-link verifier also returned `all_verified: true` for all three PLAN-declared links.

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/cli/alias_integrity.ts` | `descriptorIds`, `aliasSeed`, `exceptionPolicy` | Files resolved from `DEFAULT_PATHS` and `data/taxonomy/alias_target_exceptions.v1.json` | Yes | ✓ FLOWING — command reads live JSON files and returns live counts 341/18/0. |
| `data/compiled/v2/taxonomy.json` | `families[].subfamilies[].descriptors[]` | Official compiled artifact generated from seed/corpus | Yes | ✓ FLOWING — `ylang_ylang` is present as seed; alias gate consumes this file successfully. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Alias integrity gate proves all targets resolve | `npm --prefix src run alias:integrity -- --json` | Exit 0; PASS; 341 compiled descriptors, 18 valid targets, 0 unresolved | ✓ PASS |
| Full test suite remains green | `npm --prefix src test` | Exit 0; 56 files / 389 tests passed | ✓ PASS |
| Artifact invariant check | `node - <<'NODE' ...` checking seed tail, alias counts, exceptions, compiled versions, descriptor IDs | Reported seed tail `elderflower,linden_flower,ylang_ylang`, exception count 0, compiled descriptor count 341, all v2 versions `2.9.0` | ✓ PASS |

### Probe Execution

No phase-specific `probe-*.sh` scripts were declared or required for this data-curation phase. The behavioral gate command is the Phase 50 alias integrity proof and was executed above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HYG-01 | `51-01-PLAN.md` frontmatter (`requirements: [HYG-01]`) | Resolver o alias dangling `ylang ylang -> ylang_ylang`, decidindo explicitamente entre adicionar um target curado, remover/drop do alias com rationale, ou registrar exceção permanente documentada. | ✓ SATISFIED | The implementation chose the explicit `add_target` path: `ylang_ylang` is now a curated seed descriptor under `floral_white`; alias map is unchanged; exceptions remain empty; alias integrity gate passes with 0 unresolved targets. |

Note: At verification time, HYG-01 was satisfied by Phase 51 artifacts and gate output; the phase-completion tracking update marks it complete in `.planning/REQUIREMENTS.md`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | No blocking debt markers (`TBD`, `FIXME`, `XXX`) or implementation-stub patterns found in Phase 51 modified files. Test-helper `return []` and benchmark `console.log` matches are pre-existing/non-user-visible test code, not stubs. |

### Human Verification Required

None. This phase is data/CLI/test verification only; all must-haves are programmatically verifiable and were checked.

### Gaps Summary

No gaps found. The confirmed Phase 49 dangling alias is remediated by a curated seed target, compiled v2.9.0 artifacts publish the target, the alias map and empty exception policy are preserved, and the Phase 50 integrity gate passes on live data.

---

_Verified: 2026-06-06T00:32:01Z_
_Verifier: the agent (gsd-verifier)_
