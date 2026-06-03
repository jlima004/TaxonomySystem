# Phase 46: Batch 2 Decision Matrix - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Amended:** 2026-06-03 (post-CONTEXT persistence)
**Phase:** 46-batch-2-decision-matrix
**Areas discussed:** disposition enum, mutation_allowed gate, new-family/subfamily policy, matrix schema, target completeness, disposition criteria, investigation depth, food/off-note/industrial treatment, ambiguous candidates, Phase 47 execution contract, zero-mutation boundary, confidence & row count

---

## Scope Selection (Opening Response)

**User's choice:** Discuss final disposition enum, mutation_allowed gate, new-family/subfamily policy, `46-DECISION-MATRIX.md` schema, criteria for each disposition, investigation-depth model, treatment of food/off-note/noise selected candidates, and Phase 47 execution contract.

**Notes:** Phase 46 is decide-only — may assign formal dispositions and `mutation_allowed` gates; must not mutate taxonomy, aliases, compiled artifacts, code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI.

---

## Disposition Enum

| Option | Description | Selected |
|--------|-------------|----------|
| DEC-02 canonical labels | safe_seed_addition, add_alias, reject, defer, manual_review | |
| v2.7 six-value set | promote_to_seed, add_alias, reject, defer_manual_review, defer_future_batch, needs_external_reference | ✓ |
| Hybrid | DEC-02 + legacy alias column | |

**User's choice:** Disposition enum locked to six values with explicit meanings:
- `promote_to_seed` — new seed under existing family/subfamily
- `add_alias` — alias to existing seed
- `reject` — noise/artifact/generic/unsafe
- `defer_manual_review` — valid, needs expert review
- `defer_future_batch` — valid, not actionable this milestone
- `needs_external_reference` — external validation required before safe decision

**Notes:** `needs_external_reference` is first-class, distinct from defer types; always `mutation_allowed=false`; Phase 47 must not execute.

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

**User's choice:** Carry forward D-36 — if no existing subfamily safely fits, assign `defer_manual_review` or `defer_future_batch`, never create structure, never force-fit. Stretch `promote_to_seed` forbidden; valuable unresolved → defer with `mutation_allowed=false`. Phase 47 must not execute weak or forced placements.

---

## Matrix Schema & Deliverable

| Option | Description | Selected |
|--------|-------------|----------|
| 46-DECISION-MATRIX.md in phase dir | primary required deliverable | ✓ |
| BATCH2 naming variant | | |
| Fixture mirror | optional later | |

**User's choice:** `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` as sole required deliverable; optional `46-01-SUMMARY.md` and `46-VERIFICATION.md` at closure only.

**Deliverable block (verbatim):**
```
Phase 46 deliverable:
- File: 46-DECISION-MATRIX.md
- Location: .planning/phases/46-batch-2-decision-matrix/
- Type: parseable Markdown decision matrix
- Scope: exactly 40 rows, one per selected candidate from Phase 45
- Purpose: assign explicit evidence-backed dispositions before Phase 47 mutation
- Boundary: decide-only, no taxonomy/alias/compiled artifact/source mutations
```

**Required columns (beyond id + candidate):** `source_phase45_rank`, `phase45_inferred_subfamily`, `disposition`, `mutation_allowed`, `target_family`, `target_subfamily`, `target_descriptor`, `alias_target`, `confidence`, `investigation_depth`, `rationale`, `evidence`, `phase47_instruction`. `phase45_inferred_subfamily` is inherited evidence only. If `mutation_allowed=false` → `phase47_instruction=none`; if `true` → instruction must be explicit and mechanical.

---

## Investigation Depth

| Option | Description | Selected |
|--------|-------------|----------|
| baseline / targeted / deep | three tiers with defined scope | ✓ |
| two-tier | | |
| disposition-implied | | |

**User's choice:** Three tiers — `baseline_check` (all 40: source/rationale + obvious semantic risk), `targeted_check` (promote/alias path: target fit, duplicate/alias, executable fields), `deep_check` (ambiguous, food high-risk, industrial/off-note, truncated, external uncertainty, stretch-risk, new-structure). `mutation_allowed=true` requires ≥ `targeted_check` plus complete fields, medium_high/high confidence, rationale/evidence, mechanical instruction. `baseline_check` alone never sufficient for executable rows.

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

**User's choice:** Phase 47 may consume only rows where `mutation_allowed=true` and disposition is `promote_to_seed` or `add_alias`; execute only explicit target fields and mechanical `phase47_instruction`; ignore all defer/reject/external-reference rows.

**Phase 47 must not:** execute false rows; execute reject/defer/ext-ref; infer from rationale/evidence/Phase 45 inferred subfamily/score/selection text; reinterpret Phase 46; create families/subfamilies; stretch-place; reopen seed_corpus_conflict; mutate compiled artifacts, Graphify, scoring, MVP/SaaS, Knowledge Engine, UI, or unrelated source.

---

## Disposition Criteria (UI skipped → default locked post-CONTEXT)

| Option | Description | Selected |
|--------|-------------|----------|
| strict_six | All six promote criteria including confidence + targeted_check+ | ✓ |
| five_no_conf | | |
| expert_exception | | |

| Option | Description | Selected |
|--------|-------------|----------|
| split_locked | reject / defer_manual_review / defer_future_batch split | ✓ |
| defer_default | | |
| reject_aggressive | | |

**Notes:** Persisted as D-46-36 and D-46-37 in `46-CONTEXT.md` after initial CONTEXT write. User did not re-answer via UI; recommended defaults applied per user request to persist post-CONTEXT decisions.

---

## confidence & Row Count (UI skipped → default locked post-CONTEXT)

| Option | Description | Selected |
|--------|-------------|----------|
| three | low \| medium_high \| high | ✓ |
| four | | |
| binary | | |

| Option | Description | Selected |
|--------|-------------|----------|
| exact_40 | 40 rows, ids 01-40, 1:1 Phase 45 | ✓ |
| candidate_key | | |
| flexible | | |

**Notes:** Persisted as D-46-38 and D-46-39. Amended 2026-06-03: closed enum — `medium` is **forbidden**; use `medium_high` instead of a four-tier `low | medium | high` model.

---

## Phase 46 Zero-Mutation Boundary

**User's choice (opening brief):** Phase 46 decide-only — may assign dispositions and mutation_allowed gates; must not mutate taxonomy, aliases, compiled artifacts, code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI.

---

## the agent's Discretion

- `phase47_instruction` literal strings (align with Phase 42 parser in planning).
- Optional `expected_effect` / `notes` columns for v2.7 parity.

## Deferred Ideas

None.
