---
phase: 40
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
autonomous: true
requirements:
  - TRI-01
  - TRI-02
  - TRI-03
---

# Phase 40: Low-Support Curation Planning — Plan 01

<objective>
Inventory all 275 low_support candidates from v2.6, select a bounded batch of 30, group by risk/potential, mark all candidate→subfamily mappings as initial inferred placement only, and confirm zero mutations. The output is 40-BATCH-SELECTION.md.
</objective>

<tasks>

## Task 1: Inventory 275 low_support candidates

<read_first>
- data/compiled/v2/similarity_matrix.json
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Analyze the `similarity_matrix.json` from v2.6 compiled output. Extract all items classified as `corpus_candidate_low_support`. Confirm exactly 275 candidates exist. Document in Section 1 of 40-BATCH-SELECTION.md with total count and status summary.
</action>

<acceptance_criteria>
- 40-BATCH-SELECTION.md Section 1 states "275 candidatos"
- The count matches the actual corpus_candidate_low_support items in similarity_matrix.json
- TRI-01 is satisfied
</acceptance_criteria>

---

## Task 2: Apply selection criteria and select 30 candidates

<read_first>
- data/compiled/v2/similarity_matrix.json
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Apply five selection criteria (Evidence Priority, Semantic Clarity, Baixa Polissemia, Boa Aderência a Famílias Existentes, Expected Curation Value) to rank the 275 candidates. Select exactly 30 candidates. Document selection criteria in Section 2 and the 30 selected candidates in Section 3 of 40-BATCH-SELECTION.md.
</action>

<acceptance_criteria>
- Section 2 documents 5 explicit selection criteria
- Section 3 lists exactly 30 candidates with descriptor name, frequency, and inferred placement
- TRI-02 is satisfied (bounded batch within 25–50 range)
</acceptance_criteria>

---

## Task 3: Group selected batch by risk/potential

<read_first>
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Organize the 30 selected candidates into three groups:
- Grupo 1: High-value likely curation candidates (15 items)
- Grupo 2: Caution / expert-review candidates (8 items)
- Grupo 3: Likely defer/reject unless strong olfactive rationale (7 items)

Each entry includes descriptor name, corpus frequency, and inferred subfamily placement.
</action>

<acceptance_criteria>
- 40-BATCH-SELECTION.md Section 3 contains exactly 3 subgroups
- Group counts sum to 30 (15 + 8 + 7 = 30)
- Each group has a clear risk/potential label
</acceptance_criteria>

---

## Task 4: Mark all candidate→subfamily mappings as inferred placement only

<read_first>
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Add a prominent WARNING callout in Section 2 (before the candidate listing) explicitly stating that all candidate→subfamily mappings shown are ONLY initial inferred placements computed by the pipeline — NOT approved targets or final curation recommendations. Phase 41 must decide target/disposition from scratch for each item.
</action>

<acceptance_criteria>
- 40-BATCH-SELECTION.md contains a `> [!WARNING]` block with guardrail language
- The warning explicitly states mappings are "placement/inferência inicial" only
- The warning states Phase 41 must decide disposition from zero
- The warning states no suggested target from Phase 40 can be treated as approved
</acceptance_criteria>

---

## Task 5: Record selection rationale and deferral reasons

<read_first>
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Document in Section 4 (Rationale de Inclusão) why the 30 items were selected — top frequency, mix of classic notes and statistical anomalies, strategic value for MVP. Document in Section 5 (Rationale de Deferral) why the remaining 245 candidates were deferred — low frequency (<15), compound/complex descriptors, low immediate utility.
</action>

<acceptance_criteria>
- Section 4 explains inclusion rationale for the batch
- Section 5 explains deferral rationale for the 245 remaining candidates
- TRI-03 is satisfied
</acceptance_criteria>

---

## Task 6: Confirm zero mutations

<read_first>
- .planning/phases/40-low-support-curation-planning/40-BATCH-SELECTION.md
</read_first>

<action>
Add Section 6 (Confirmação de Mutabilidade) explicitly confirming: zero mutations applied, 275 descriptors unchanged, taxonomy.json unaltered, no scoring/pipeline/Graphify changes, 8 seed_corpus_conflict items not reopened.
</action>

<acceptance_criteria>
- Section 6 states "ZERO mutações foram aplicadas"
- Section 6 confirms taxonomy.json, scoring, pipeline, Graphify unchanged
- Section 6 confirms 8 seed_corpus_conflict not reopened
</acceptance_criteria>

</tasks>

<verification>
1. `40-BATCH-SELECTION.md` exists with all 6 sections
2. Section 1 inventories exactly 275 low_support candidates
3. Section 3 contains exactly 30 selected candidates
4. The 30 candidates are organized in 3 groups by risk/potential (15 + 8 + 7 = 30)
5. WARNING callout marks all candidate→subfamily mappings as initial inferred placement only
6. Section 6 confirms zero mutations
7. Phase 41 is referenced as responsible for final per-item disposition
</verification>

<success_criteria>
- 40-BATCH-SELECTION.md exists and inventories 275 low_support candidates ✓
- Selected batch contains exactly 30 candidates ✓
- The 30 candidates are grouped by risk/potential ✓
- All candidate→subfamily mappings are explicitly marked as initial inferred placement only ✓
- No mutations were applied ✓
- Phase 41 is responsible for final per-item disposition ✓
</success_criteria>

<must_haves>
## truths
- 275 low_support candidates from v2.6 are inventoried completely
- Batch size is exactly 30 candidates
- All mappings are inferred placement only — Phase 41 decides final disposition
- Zero mutations were applied in Phase 40
- 8 seed_corpus_conflict items remain untouched

## risks
- Accepting inferred placements as approved targets (MITIGATED by WARNING callout)
- Processing more than the selected 30 candidates (MITIGATED by explicit batch boundary)
- Accidental taxonomy mutation (MITIGATED by read-only execution mode)
</must_haves>
