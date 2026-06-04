# Phase 48: v2.8 Artifact Publication & Closure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 48-v2-8-artifact-publication-closure
**Areas discussed:** Closure report metrics & structure; Version string & DEFAULT_PATHS policy; Sandbox-vs-publish flow shape; Plan structure & protected-boundary assertion; Pre-publication stability gate (WR-01 from Phase 47); Closure report location; WR-01 handling choice.

---

## Closure Report Metrics & Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Minimum v2.5-style counts | Family/subfamily/seed/descriptor/alias/edge counts only | |
| v2.7-style review_queue breakdown | Counts + review_queue by type/severity + quality_gate_status + validation_status | ✓ |
| Full pre/post delta v2.7→v2.8 | Above + delta table v2.7.0 → v2.8.0 for every metric | ✓ |

**User's choice:** v2.8 closure report measured from the **published** `data/compiled/v2` JSON, not from /tmp. Mandatory metrics: seed descriptor count, compiled descriptor count, review_queue total + breakdown, graph edge count, quality_gate_status, validation_status, pre/post deltas v2.7 → v2.8.

**Notes:** This decision locks the closure report's metric set (D-48-CR04) and its source (D-48-CR03). The pre/post delta table is the user-facing signature of milestone v2.8 and is required by success criterion 4 ("curator can confirm publication did not change milestone-excluded boundaries or defaults outside the approved v2.8 artifact scope").

---

## Version String & DEFAULT_PATHS Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Change DEFAULT_PATHS.version to 2.8.0 | Flip the CLI default; matches the v2 promotion pattern | |
| Explicit --version 2.8.0 only | Match v2.6/v2.7 publication precedent; do not touch DEFAULT_PATHS | ✓ |

**User's choice:** Use explicit `--version 2.8.0` at official publish; do NOT change `DEFAULT_PATHS.version` in `src/cli/parse_args.ts` (stays at `2.1.0`).

**Notes:** Matches Phase 39 (v2.6 publication) and Phase 43 (v2.7 publication) precedent exactly. The CLI default version is decoupled from the published artifact version — explicit flag carries the version, default stays put. D-48-V01 / D-48-V02.

---

## Sandbox-vs-Publish Flow Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Two-step (Phase 43 pattern) | /tmp sandbox first → assert zero hard failures → official publish to data/compiled/v2/ | ✓ |
| Single-step | One compile directly to data/compiled/v2/ | |

**User's choice:** Two-step Phase 43 pattern. Do not use single-step publication.

**Notes:** The /tmp artifacts are validation-only and discarded. The published `data/compiled/v2/` JSON is the source of truth for the closure report. D-48-F01 / D-48-F02 / D-48-F03.

---

## Plan Structure & Protected-Boundary Assertion

| Option | Description | Selected |
|--------|-------------|----------|
| Single 48-01 plan | One plan covering sandbox validation, official publication, published-artifact verification, closure report, safety guards, protected-boundary assertions | ✓ |
| Split 48-01 + 48-02 | Validation in 48-01, publication+closure in 48-02 | |

**User's choice:** Single 48-01 plan.

**Notes:** The 7-step flow (D-48-P02) is: pre-publication WR-01 gate → sandbox compile → official compile → published-artifact verification → protected-boundary hash/diff assertions → full test suite → closure report + bookkeeping. Protected-boundary assertion uses both `git diff --name-only` allow-list and `sha256sum` byte-identical checks. D-48-P01 / D-48-P02 / D-48-PB01 / D-48-PB03.

---

## Pre-Publication Stability Gate — WR-01 (additional area)

| Option | Description | Selected |
|--------|-------------|----------|
| Add fixture | Commit Phase 46 decision matrix as test fixture so source-only checkouts work | ✓ (already done in Phase 47) |
| Add archived fixture too | Copy 46-DECISION-MATRIX.md to a stable archived location pre-publication | |

**User's choice:** Fixture path only. The Phase 46 decision matrix fixture is at `src/tests/fixtures/curation/46-DECISION-MATRIX.md`. Phase 48's publication gate is "full test suite passes". v2.8 archived fallback is a milestone-archival concern, not a pre-publication blocker.

**Notes:** Phase 47 already committed the fixture and the test resolves it first via `resolveExistingPath`. Phase 48's gate is a confirmation that `vitest run` exits 0. The v2.8-phases archive will be created at milestone archival, not now. D-48-WR01 / D-48-WR02 / D-48-WR03.

---

## Closure Report Location

| Option | Description | Selected |
|--------|-------------|----------|
| Release pattern | `.planning/releases/v2.8.0-CLOSURE.md` (v1.0/v2.1-v2.5 pattern) | ✓ |
| Phase pattern | `.planning/phases/48-.../48-CLOSURE.md` (v2.6 pattern) | |
| Both | Brief release closure + fuller phase closure | |

**User's choice:** Release pattern at `.planning/releases/v2.8.0-CLOSURE.md`. Phase 48 may still produce `48-VERIFICATION.md` and `48-01-SUMMARY.md` in the phase dir.

**Notes:** The release closure describes the official published v2.8.0 artifacts. Phase-dir artifacts are GSD audit trail only. D-48-CR01 / D-48-CR02.

---

## WR-01 Handling at Publication Time

| Option | Description | Selected |
|--------|-------------|----------|
| Fixture path only (Recommended) | Fixture already committed; test resolves fixture first; gate is "vitest passes" | ✓ |
| Add archived fixture too | Copy 46-DECISION-MATRIX.md to `.planning/milestones/v2.8-phases/46-...` now | |

**User's choice:** Fixture path only. The Phase 46 decision matrix fixture is committed at `src/tests/fixtures/curation/46-DECISION-MATRIX.md` and the test resolves it first. Phase 48's publication gate is "full test suite passes". v2.8 archived fallback is a milestone-archival concern.

**Notes:** Same as the WR-01 area above — locked. D-48-WR01 / D-48-WR02 / D-48-WR03.

---

## the agent's Discretion

- Exact wording of the closure report's narrative sections (mandatory metrics in D-48-CR04 are non-negotiable; prose around them is free).
- Whether to capture `--quality-report` artifacts in `48-VERIFICATION.md` (D-48-CR04 does not require them but they're useful audit evidence).
- Exact Python/Node.js snippet for re-parsing the published JSON and computing pre/post delta (must produce D-48-CR04 metrics and D-48-PB03 hash assertions, otherwise free).
- Whether to commit published artifacts + bookkeeping in one plan-level commit or two (D-48-P04).

---

## Deferred Ideas

None — discussion stayed within phase scope. The four user-selected areas plus the additional WR-01 pre-publication gate are all captured in CONTEXT.md as D-48-F01 through D-48-PB04.

The 28 non-executable Phase 46 matrix rows remain on the review queue and are not part of Phase 48. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).

The v2.8 archived fallback path (`.planning/milestones/v2.8-phases/...`) is a milestone-archival concern and is not a Phase 48 deliverable. The 10 remaining `seed_corpus_conflict` items are out of scope for v2.8 and remain on the review queue.
