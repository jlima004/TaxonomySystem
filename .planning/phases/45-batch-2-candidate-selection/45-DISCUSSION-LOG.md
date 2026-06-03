# Phase 45: Batch 2 Candidate Selection - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 45-Batch 2 Candidate Selection
**Areas discussed:** Batch Size, Selection Criteria, Evidence Weighting, Exclusion/Deferral Policy, Treatment of Food/Off-note/Noise Candidates, Output Artifact Format, Zero-Mutation Boundary

---

## Batch Size

| Option | Description | Selected |
|--------|-------------|----------|
| 25 candidates | | |
| 30 candidates | | |
| 40 candidates | | ✓ |
| (Recommended) 50 candidates | | |

**User's choice:** Write-in response specifying exactly 40 candidates.
**Notes:** "Use exactly 40 candidates for Batch 2. This size captures the full high-frequency signal tier from the Phase 44 inventory while leaving one slot for a semantically valuable moderate-frequency candidate. It remains within the required 25–50 range and is still small enough for careful decision-matrix review."

---

## Selection Criteria

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Highest occurrence frequency among remaining candidates | | |
| Semantic clarity and lowest polysemy | | |
| Easiest/quickest to resolve (low hanging fruit) | | |
| Highest curation value to the graph | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Primary criterion: evidence priority filtered by semantic clarity. Use candidate_frequency and placement evidence to rank candidates, but select only candidates that are worth decision-matrix review based on olfactive relevance, low polysemy, fit to existing taxonomy, and curation value. Frequency is prioritization evidence only, never approval evidence."

---

## Evidence Weighting

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Corpus occurrence frequency > Literature/Standard definitions | | |
| Literature/Standard definitions > Corpus occurrence frequency | | |
| Equal weighting | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Use a weighted evidence model: evidence priority 35%, semantic clarity 25%, curation value 20%, low polysemy/risk 15%, and batch diversity 5%. Apply penalties for corpus artifacts, generic terms, suspicious inferred placement, food/off-note noise, new-subfamily requirements, and near-duplicates. Frequency is prioritization evidence only, never approval evidence. Select exactly 40 candidates by weighted score plus manual sanity review, not by raw frequency alone."

---

## Exclusion/Deferral Policy

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Defer strictly to future milestones; do not force a decision now | | |
| Reject them entirely to remove from queue | | |
| Attempt a best-effort alias | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Exclude candidates from Batch 2 when they are too ambiguous, generic, noisy, malformed, weakly evidenced, likely corpus artifacts, near-duplicates, require external reference, or require new taxonomy structure. This exclusion is not a final curation disposition; it only means not selected for this batch. Phase 46 remains responsible for formal reject/defer/manual_review decisions. Record not-selected candidates with closed reason codes such as insufficient_evidence, high_polysemy, likely_corpus_artifact, generic_non_olfactive, needs_external_reference, requires_new_taxonomy_structure, duplicate_or_near_duplicate, low_current_priority, or out_of_scope_food_or_offnote."

---

## Treatment of Food/Off-note/Noise Candidates

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Exclude from Batch 2 and defer to a dedicated domain-specific batch | | |
| Include them if they meet the general frequency threshold | | |
| Reject immediately | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Treat food/off-note/noise candidates with a tiered caution policy. Food candidates may be selected when they are recognizable olfactive notes or materials with curation value. Off-notes may be selected in limited numbers only when they are high-impact and useful for formal Phase 46 disposition. Noise, generic terms, and corpus artifacts should be excluded from Batch 2 unless explicitly reserved for a future noise-policy milestone. Food/off-note status is never promotion evidence; it only controls selection caution and downstream review priority."

---

## Output Artifact Format

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Markdown table (candidates + rationale) in the plan execution output | | |
| JSON list of candidates | | |
| CSV file for external review | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Use a parseable Markdown artifact named 45-BATCH2-SELECTION.md. It must contain scope, selection policy, weighted evidence model, exactly 40 selected candidates in a normalized table, a summarized not-selected section with closed reason codes, and a final selection summary. The artifact must be selection-only: no dispositions, no mutation_allowed flags, no approved targets, and no taxonomy/alias/compiled artifact mutations."

---

## Zero-Mutation Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) STRICT: No mutation of taxonomy source data during Phase 45; only selection and justification | | |
| Soft: Minor typo fixes allowed during selection | | |
| Write-in | | ✓ |

**User's choice:** Write-in response.
**Notes:** "Phase 45 zero-mutation boundary: only Phase 45 planning/selection artifacts may be created or modified. The phase may produce 45-BATCH2-SELECTION.md with exactly 40 selected candidates and selection rationale, but it must not assign formal dispositions, set mutation_allowed, approve targets, mutate taxonomy seeds, aliases, compiled artifacts, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI. It must not reopen seed_corpus_conflict items. Phase 45 is selection-only; Phase 46 decides, Phase 47 mutates, Phase 48 publishes."

---

## the agent's Discretion

None

## Deferred Ideas

None
