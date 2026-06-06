---
phase: 51-legacy-alias-remediation
plan: 01
subsystem: data-curation
tags: [taxonomy, aliases, compile, vitest, v2.9]

requires:
  - phase: 49-alias-target-integrity-inventory
    provides: Confirmed single dangling alias target `ylang ylang -> ylang_ylang`
  - phase: 50-alias-target-integrity-automation
    provides: `alias:integrity` proof gate and exception-policy validation
provides:
  - Safe-fit rationale for `ylang_ylang` under `floral/floral_white`
  - v2 seed target resolving the legacy alias without remapping or exceptions
  - Official v2.9.0 compiled artifacts with 341 descriptors and 18 resolving aliases
  - Updated live-data tests proving the gate now passes
affects: [alias-integrity, taxonomy-v2, compiled-artifacts, curation-tests]

tech-stack:
  added: []
  patterns: [add_target remediation, explicit-version publication, live-data gate proof]

key-files:
  created:
    - .planning/phases/51-legacy-alias-remediation/51-SAFE-FIT-RATIONALE.md
    - .planning/phases/51-legacy-alias-remediation/51-01-SUMMARY.md
  modified:
    - data/taxonomy/taxonomy-seed.v2.json
    - data/compiled/v2/taxonomy.json
    - data/compiled/v2/descriptor_aliases.json
    - data/compiled/v2/similarity_matrix.json
    - src/tests/inventory/alias_target_inventory.test.ts
    - src/tests/cli/alias_integrity.test.ts
    - src/tests/curation/taxonomy_seed_v2.test.ts

key-decisions:
  - "Resolved `ylang ylang -> ylang_ylang` via locked add_target path rather than remap, drop, or exception."
  - "Published v2.9.0 artifacts with explicit `--version 2.9.0` while preserving `DEFAULT_PATHS.version` at `2.1.0`."
  - "Kept corpus candidate `ylang` separate from curated seed descriptor `ylang_ylang`."

patterns-established:
  - "Alias remediation proof sequence: before failing gate, safe-fit rationale, seed append, sandbox compile, official publish, passing gate."
  - "State-locked live-data tests must flip with curated data truth after remediation."

requirements-completed: [HYG-01]

duration: 7min
completed: 2026-06-06
---

# Phase 51 Plan 01: Legacy Alias Remediation Summary

**`ylang ylang -> ylang_ylang` resolved by adding a curated white-floral seed target and publishing v2.9.0 compiled artifacts.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-06T00:05:07Z
- **Completed:** 2026-06-06T00:12:03Z
- **Tasks:** 3 completed
- **Files modified:** 8

## Accomplishments

- Captured the required before-state proof: `alias:integrity --json` exited 1 with exactly one unresolved target, `ylang ylang -> ylang_ylang`, at `340/17/1`.
- Created `51-SAFE-FIT-RATIONALE.md` before mutating seed data, affirming `ylang_ylang` as a legitimate white-floral descriptor under `floral/floral_white`.
- Appended exactly one curated seed descriptor, trailing `"ylang_ylang"` after `"linden_flower"`, without changing aliases, exceptions, v1 artifacts, relation/accord inputs, `DEFAULT_PATHS`, or Graphify outputs.
- Ran the two-step publication flow: sandbox compile to `/tmp/phase51-compile-validate` and official publish via `npm run compile -- --version 2.9.0`.
- Updated live-data tests so inventory and CLI assertions reflect the resolved alias state.
- Verified final gate output: `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0`, and full Vitest suite green (`56 passed`, `389 tests`).

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture before-proof, affirm safe-fit, and append ylang_ylang to seed** - `c202a6f` (feat)
2. **Task 2: Sandbox-compile and officially publish v2.9.0 artifacts** - `0ce2bb0` (feat)
3. **Task 3: Update state-locked tests and prove gate PASS + full suite green** - `7c961a6` (test)

**Plan metadata:** pending final docs commit

## Files Created/Modified

- `.planning/phases/51-legacy-alias-remediation/51-SAFE-FIT-RATIONALE.md` - before-mutation proof and safe-fit rationale.
- `data/taxonomy/taxonomy-seed.v2.json` - appended `ylang_ylang` under `floral/floral_white.descriptors`.
- `data/compiled/v2/taxonomy.json` - official v2.9.0 compiled taxonomy with `ylang_ylang` as `source: "seed"`.
- `data/compiled/v2/descriptor_aliases.json` - regenerated v2.9.0 alias artifact with the unchanged 18-entry alias map.
- `data/compiled/v2/similarity_matrix.json` - regenerated v2.9.0 similarity artifact.
- `src/tests/inventory/alias_target_inventory.test.ts` - flipped live-data counts to 341 descriptors, 18 valid targets, 0 dangling.
- `src/tests/cli/alias_integrity.test.ts` - flipped live-data CLI expectations to exit 0 / PASS / empty unresolved list.
- `src/tests/curation/taxonomy_seed_v2.test.ts` - linked Phase 51 safe-fit rationale into seed traceability assertions.

## Decisions Made

- Used the locked `add_target` remediation path and preserved `descriptor_aliases.seed.json` unchanged.
- Kept `alias_target_exceptions.v1.json` empty; no permanent exception was added.
- Published v2.9.0 by explicit CLI flag only; `src/cli/parse_args.ts` defaults were not changed.
- Preserved `ylang` as a distinct corpus candidate; `ylang_ylang` is the curated resolving target.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added Phase 51 traceability to seed curation contract**
- **Found during:** Task 3 (Update state-locked tests and prove gate PASS + full suite green)
- **Issue:** Full `npm --prefix src test` failed because `src/tests/curation/taxonomy_seed_v2.test.ts` required every v2 seed addition to have an approval/traceability entry, and the plan did not list this existing state-locked test as needing a Phase 51 approval source.
- **Fix:** Linked `51-SAFE-FIT-RATIONALE.md` as the traceability source for `floral/floral_white/ylang_ylang` in the existing curation contract test.
- **Files modified:** `src/tests/curation/taxonomy_seed_v2.test.ts`
- **Verification:** `npm --prefix src test` passed with 56 files and 389 tests.
- **Committed in:** `7c961a6` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** The deviation was required to satisfy the plan's full-suite success criterion while preserving seed traceability. No product/runtime scope was expanded.

## Issues Encountered

- Initial full-suite verification surfaced one additional state-locked traceability assertion outside the two tests named in Task 3. It was resolved by wiring the Phase 51 safe-fit rationale into the existing curation test.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None.

## Threat Flags

None.

## Verification

- `cd src && npm run alias:integrity -- --json` before mutation: exit 1, `340/17/1`, only `ylang ylang -> ylang_ylang` unresolved.
- `git show c202a6f -- data/taxonomy/taxonomy-seed.v2.json`: exactly one trailing `"ylang_ylang"` append after `"linden_flower"`.
- `npm run compile -- --version 2.9.0 --out /tmp/phase51-compile-validate --generated-at 2026-06-05T00:00:00Z`: passed.
- `npm run compile -- --version 2.9.0`: passed and wrote official `data/compiled/v2` artifacts.
- `npm --prefix src run alias:integrity -- --json`: exit 0 with `341/18/0`.
- `npm --prefix src test`: passed (`56` test files, `389` tests).
- Protected surfaces unchanged: `descriptor_aliases.seed.json`, `alias_target_exceptions.v1.json`, `src/cli/parse_args.ts`, `data/compiled/v1/*`, `data/taxonomy/taxonomy-seed.v1.json`.

## Self-Check: PASSED

- Found created rationale file: `.planning/phases/51-legacy-alias-remediation/51-SAFE-FIT-RATIONALE.md`.
- Found summary file: `.planning/phases/51-legacy-alias-remediation/51-01-SUMMARY.md`.
- Found task commits: `c202a6f`, `0ce2bb0`, `7c961a6`.
- Verified final alias integrity metrics: `compiled_descriptor_count=341`, `valid_target_count=18`, `unresolved_target_count=0`.

## Next Phase Readiness

Phase 51 is complete. v2.9 alias target hygiene is ready for verification and milestone closure.

---
*Phase: 51-legacy-alias-remediation*
*Completed: 2026-06-06*
