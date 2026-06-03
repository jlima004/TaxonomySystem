# Phase 46: Batch 2 Decision Matrix - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 46-batch-2-decision-matrix
**Areas discussed:** disposition enum, mutation_allowed gate, new-family/subfamily policy, matrix schema, disposition criteria, investigation depth, food/off-note/industrial treatment, ambiguous candidates, Phase 47 execution contract, zero-mutation boundary

---

## Disposition Enum

| Option | Description | Selected |
|--------|-------------|----------|
| DEC-02 canonical labels | safe_seed_addition, add_alias, reject, defer, manual_review | |
| v2.7 six-value set | promote_to_seed, add_alias, reject, defer_manual_review, defer_future_batch, needs_external_reference | ✓ |
| Hybrid | DEC-02 + legacy alias column | |

**User's choice:** Locked v2.7 six-value disposition enum with explicit meanings per value.
**Notes:** `needs_external_reference` remains first-class, distinct from defer types; always non-executable in Phase 47.

---

## mutation_allowed Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Strict promote/alias only | true only with complete targets, existing structure, confidence, targeted_check+ | ✓ |
| Promote only | aliases separate track | |
| Explicit override | any disposition with notes override | |

**User's choice:** `mutation_allowed=true` only for `promote_to_seed`/`add_alias` with complete targets, existing family/subfamily, no new structure, medium_high/high confidence, rationale/evidence, mechanical phase47_instruction. All defer/reject/external-ref rows false. Phase 47 must not infer from free text.

---

## New Family / Subfamily Policy

| Option | Description | Selected |
|--------|-------------|----------|
| D-36 defer | defer_manual_review or defer_future_batch, no force-fit | ✓ |
| defer_future only for milestone block | | |
| reject aggressive | | |

**User's choice:** Carry forward D-36 — no new family/subfamily in Phase 46; no stretch placements; valuable unresolved → defer with mutation_allowed=false.

---

## Matrix Schema & Deliverable

| Option | Description | Selected |
|--------|-------------|----------|
| 46-DECISION-MATRIX.md in phase dir | primary required deliverable | ✓ |
| BATCH2 naming variant | | |
| Fixture mirror | optional later | |

**User's choice:** `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` as sole required deliverable; optional 46-01-SUMMARY.md and 46-VERIFICATION.md at closure. Required columns: source_phase45_rank, phase45_inferred_subfamily, disposition, mutation_allowed, targets, alias_target, confidence, investigation_depth, rationale, evidence, phase47_instruction.

---

## Investigation Depth

| Option | Description | Selected |
|--------|-------------|----------|
| baseline / targeted / deep | three tiers with defined scope | ✓ |
| two-tier | | |
| disposition-implied | | |

**User's choice:** `baseline_check` (all 40), `targeted_check` (promote/alias candidates), `deep_check` (ambiguous/food/off-note/truncated/external). mutation_allowed=true requires at least targeted_check.

---

## Food / Off-Note / Industrial

| Option | Description | Selected |
|--------|-------------|----------|
| Caution tier — promote only with safe existing fit | | ✓ |
| Default defer all food | | |
| reject off-scope | | |

**User's choice:** Food-linked: not auto-reject/promote; promote only with safe existing fit and confidence. Off-note/industrial: high caution; acrylate prefers needs_external_reference or defer_manual_review unless safe fit proven.

---

## Ambiguous / Truncated Candidates

| Option | Description | Selected |
|--------|-------------|----------|
| needs_external_reference default | no canonical inference | ✓ |
| alias if seed exists | | |
| reject truncation | | |

**User's choice:** e.g. orri → needs_external_reference, deep_check, mutation_allowed=false; no orri→orris inference without evidence. phase45_inferred_subfamily advisory only.

---

## Phase 47 Execution Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Execute mut_true promote/alias only | no inference, no new structure | ✓ |
| Matrix + selection context | still execute mut_true only | |
| Parser fixture | optional | |

**User's choice:** Phase 47 consumes only executable matrix rows; full guardrail list — no defer/reject/ext-ref execution, no stretch, no seed_corpus_conflict reopen, no out-of-scope mutations.

---

## Phase 46 Zero-Mutation Boundary

**User's choice (opening brief):** Phase 46 decide-only — may assign dispositions and mutation_allowed gates; must not mutate taxonomy, aliases, compiled artifacts, code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI.

---

## the agent's Discretion

- `phase47_instruction` literal strings (align with Phase 42 parser in planning).
- Optional `expected_effect` / `notes` columns for v2.7 parity.

## Deferred Ideas

None.
