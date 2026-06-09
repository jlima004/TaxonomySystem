---
phase: 53-alias-integrity-gate-hardening
plan: 01
subsystem: testing
tags: [npm-scripts, alias-integrity, vitest]

requires: []
provides:
  - verify:integrity local guardrail script
  - compile:quality with temp output and alias proof
  - Extended CLI script wiring regression tests
affects: [phase-54-ci-wiring]

tech-stack:
  added: []
  patterns:
    - "verify:integrity as forwarding-safe direct alias_integrity.js proof"
    - "compile:quality writes to /tmp/phase53-compile-quality then runs alias proof"

key-files:
  created: []
  modified:
    - src/package.json
    - src/tests/cli/alias_integrity.test.ts

key-decisions:
  - "verify:integrity uses npm run precompile && node dist/cli/alias_integrity.js (same as alias:integrity base)"
  - "compile:quality uses --out /tmp/phase53-compile-quality to avoid mutating data/compiled/v2"
  - "compile remains exactly node dist/cli/compile.js"
  - "safety:guard unchanged and separate"

patterns-established:
  - "Official local guardrail is verify:integrity; alias:integrity remains base proof command"

requirements-completed: [GATE-01, GATE-02, GATE-03]

duration: 8min
completed: 2026-06-08
---

# Phase 53 Plan 01: Alias Integrity Script Wiring

**Added `verify:integrity` as the official local guardrail and wired `compile:quality` to temp-output quality compile plus alias proof while keeping normal `compile` alias-gate-free.**

## Performance

- **Duration:** 8 min
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments

- Added `verify:integrity` script (`npm run precompile && node dist/cli/alias_integrity.js`)
- Updated `compile:quality` to `--out /tmp/phase53-compile-quality` + `node dist/cli/alias_integrity.js`
- Preserved `compile` as `node dist/cli/compile.js` and `safety:guard` unchanged
- Extended `alias_integrity.test.ts` with script wiring assertions for all guardrail scripts

## Verification

- `npm --prefix src test -- tests/cli/alias_integrity.test.ts` — PASS
- `npm --prefix src run verify:integrity -- --json` — PASS 341/18/0
- `npm --prefix src run compile:quality` — exit 0, writes to `/tmp/phase53-compile-quality`
- `npm --prefix src run typecheck` — PASS

## Self-Check: PASSED
