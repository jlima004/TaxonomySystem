# Phase 45: Batch 2 Candidate Selection - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Select a bounded 40-candidate batch from the eligible low_support inventory with evidence-backed rationale, without mutating the taxonomy or making formal dispositions yet.

</domain>

<decisions>
## Implementation Decisions

### Batch Size
- **D-01:** Exactly 40 candidates for Batch 2. This captures the full high-frequency signal tier while leaving one slot for a semantically valuable moderate-frequency candidate.

### Selection Criteria
- **D-02:** Evidence priority filtered by semantic clarity. Use candidate_frequency and placement evidence to rank candidates, but select only those worth decision-matrix review based on olfactive relevance, low polysemy, fit to existing taxonomy, and curation value. Frequency is prioritization evidence only, never approval evidence.

### Evidence Weighting
- **D-03:** Use a weighted evidence model: evidence priority 35%, semantic clarity 25%, curation value 20%, low polysemy/risk 15%, and batch diversity 5%. Apply penalties for corpus artifacts, generic terms, suspicious inferred placement, food/off-note noise, new-subfamily requirements, and near-duplicates. Select by weighted score plus manual sanity review.

### Exclusion/Deferral Policy
- **D-04:** Exclude candidates that are too ambiguous, generic, noisy, malformed, weakly evidenced, likely corpus artifacts, near-duplicates, require external reference, or require new taxonomy structure. This is an exclusion from Batch 2, not a final disposition. Record not-selected candidates with closed reason codes (e.g., insufficient_evidence, high_polysemy, likely_corpus_artifact, generic_non_olfactive, etc.).

### Treatment of Food/Off-note/Noise Candidates
- **D-05:** Tiered caution policy: Food candidates may be selected if they are recognizable olfactive notes/materials with curation value. Off-notes may be selected in limited numbers for formal disposition. Noise, generic terms, and corpus artifacts must be excluded unless reserved for a noise-policy milestone. Food/off-note status is never promotion evidence.

### Output Artifact Format
- **D-06:** Parseable Markdown artifact named `45-BATCH2-SELECTION.md` containing scope, selection policy, weighted evidence model, exactly 40 selected candidates in a normalized table, a summarized not-selected section with closed reason codes, and a final selection summary. The artifact must be selection-only (no dispositions, no mutation_allowed flags).

### Zero-Mutation Boundary
- **D-07:** Phase 45 is strictly selection-only. Only Phase 45 planning/selection artifacts may be created/modified. Must not assign formal dispositions, set mutation_allowed, approve targets, mutate taxonomy seeds, aliases, compiled artifacts, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI. Must not reopen seed_corpus_conflict items.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definitions
- `.planning/PROJECT.md` — Project context and core constraints
- `.planning/REQUIREMENTS.md` — Formal requirements (SEL-01, SEL-02)

### Phase Scope
- `.planning/ROADMAP.md` — Phase boundaries and success criteria
- `.planning/STATE.md` — Current execution state

No external specs — requirements fully captured in decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Established Patterns
- **No-mutation rule:** Curation selections happen purely in Markdown artifacts before phase 47 executes the actual mutations.

</code_context>

<specifics>
## Specific Ideas

- Ensure EXACTLY 40 candidates are selected.
- Reason codes for non-selection: insufficient_evidence, high_polysemy, likely_corpus_artifact, generic_non_olfactive, needs_external_reference, requires_new_taxonomy_structure, duplicate_or_near_duplicate, low_current_priority, out_of_scope_food_or_offnote.
- Output file exactly named `45-BATCH2-SELECTION.md`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 45-Batch 2 Candidate Selection*
*Context gathered: 2026-06-03*
