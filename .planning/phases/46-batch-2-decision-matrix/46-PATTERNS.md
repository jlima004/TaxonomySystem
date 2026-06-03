# Phase 46: Batch 2 Decision Matrix - Pattern Map

**Mapped:** 2026-06-03  
**Files analyzed:** 3  
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` | planning artifact / data contract | batch transform, matrix-gated authorization | `src/tests/fixtures/curation/41-DECISION-MATRIX.md` | exact |
| `.planning/phases/46-batch-2-decision-matrix/46-VERIFICATION.md` | verification artifact | batch validation / parse assertions | `.planning/phases/46-batch-2-decision-matrix/46-VALIDATION.md` + `src/tests/curation/taxonomy_seed_v2.test.ts` | role-match |
| `.planning/phases/46-batch-2-decision-matrix/46-01-SUMMARY.md` | summary artifact | reporting / aggregate counts | `src/tests/fixtures/curation/41-DECISION-MATRIX.md` execution summary | role-match |

## Pattern Assignments

### `.planning/phases/46-batch-2-decision-matrix/46-DECISION-MATRIX.md` (planning artifact, batch transform)

**Primary analog:** `src/tests/fixtures/curation/41-DECISION-MATRIX.md`  
**Secondary analog:** `.planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/38-DECISION-MATRIX.md`  
**Input source:** `.planning/phases/45-batch-2-candidate-selection/45-BATCH2-SELECTION.md`

**Execution summary pattern** (`src/tests/fixtures/curation/41-DECISION-MATRIX.md` lines 3-11):

```markdown
## Execution Summary for Phase 42
- promote_to_seed: 6
- add_alias: 0
- reject: 4
- defer_manual_review: 19
- defer_future_batch: 0
- needs_external_reference: 1
- **mutation_allowed=true**: 6
- **mutation_allowed=false**: 24
```

Copy this count block shape, but rename for Phase 46 and reconcile against exactly 40 rows.

**Matrix header pattern** (`src/tests/fixtures/curation/41-DECISION-MATRIX.md` lines 13-16; adapt to Phase 46 locked schema):

```markdown
## Decision Matrix

| id | candidate | phase40_group | investigation_depth | disposition | target_family | target_subfamily | target_descriptor | mutation_allowed | rationale | evidence | expected_effect | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
```

Phase 46 must use the richer locked column order from `46-CONTEXT.md` lines 57-60:

```markdown
| id | candidate | source_phase45_rank | phase45_inferred_subfamily | disposition | mutation_allowed | target_family | target_subfamily | target_descriptor | alias_target | confidence | investigation_depth | rationale | evidence | phase47_instruction | expected_effect | notes |
```

**Executable promote row pattern** (`src/tests/fixtures/curation/41-DECISION-MATRIX.md` lines 22-31):

```markdown
| 06 | peppermint | high_value | targeted | promote_to_seed | fresh_spice | fresh_spice | peppermint | true | Clear note with exact fit in fresh_spice. | freq: 56 | Add peppermint seed | |
| 07 | rosemary | high_value | targeted | promote_to_seed | green | herbal_green | rosemary | true | Clear herbal note fitting herbal_green perfectly. | freq: 54 | Add rosemary seed | |
| 10 | cumin | high_value | targeted | promote_to_seed | spicy | warm_spice | cumin | true | Clear spice note fitting warm_spice. | freq: 40 | Add cumin seed | |
```

Phase 46 executable rows must add `alias_target`, `confidence`, and `phase47_instruction`. Use `targeted_check` or `deep_check`, `confidence` of `medium_high`/`high`, complete targets, and mechanical instructions such as `add_seed target_family=<family> target_subfamily=<subfamily> descriptor=<descriptor>`.

**Non-executable defer/external-reference pattern** (`src/tests/fixtures/curation/41-DECISION-MATRIX.md` lines 17-20, 24, 28):

```markdown
| 01 | nutty | high_value | targeted | defer_manual_review | | | | false | Real olfactive descriptor but no safe existing subfamily (vanilla is loosely-related). | freq: 271 | Pending new subfamily (e.g. nutty) | D-36 enforced |
| 02 | coffee | high_value | targeted | defer_manual_review | | | | false | Missing natural subfamily (gourmand/coffee). | freq: 116 | Pending new subfamily | D-29, D-36 enforced |
| 03 | hay | high_value | targeted | defer_manual_review | | | | false | Lacks direct subfamily (fougere/hay missing). Amber or herbal_green are stretches. | freq: 112 | Pending new subfamily | |
| 04 | orri | high_value | deep | needs_external_reference | | | | false | Likely alias/truncation for orris, but orris is not in taxonomy seed. | freq: 75 | Clarify canonical name | |
| 08 | hazelnut | high_value | targeted | defer_manual_review | | | | false | Real descriptor but no nutty/gourmand subfamily fits besides vanilla (stretch). | freq: 46 | Pending new subfamily | |
| 12 | orchid | high_value | targeted | defer_manual_review | | | | false | Vague floral, needs expert review to place in white or rose or other. | freq: 31 | Clarify floral facet | |
```

For Phase 46, every non-executable row must keep target fields empty, set `mutation_allowed` to `false`, set `phase47_instruction` exactly to `none`, and use `baseline_check`, `targeted_check`, or `deep_check` per risk.

**Older compact decision matrix precedent** (`38-DECISION-MATRIX.md` lines 5-8, 17-19):

```markdown
| Descriptor | Seed Conflict | Conflict Type | Proposed Disposition | Mutation Allowed | Rationale | Expected Effect |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `banana_peel` | `banana` | semantic_overlap | `defer_manual_review` | `false` | Legitimate botanical part. Needs curation to decide if it's an alias or distinct seed note. | Remains in review_queue. |
| `banana_ripe_banana` | `banana` | semantic_overlap | `alias_to_seed` | `true` | Ripe banana is just banana. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
| `orange_bitter_orange` | `bitter_orange` | semantic_overlap | `alias_to_seed` | `true` | Clearly bitter orange. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
| `rose_red_rose` | `rose` | semantic_overlap | `alias_to_seed` | `true` | Red rose is just rose in perfumery context. Safe to alias. | Added to descriptor_aliases.seed.json. Removed from conflict queue. |
```

Use only the structural idea: row-level rationale + mutation gate + expected effect. Do **not** reuse deprecated Phase 38 disposition strings (`alias_to_seed`, `add_to_conflict_stopwords`) because Phase 46 locks six different disposition values.

**Phase 45 candidate input pattern** (`45-BATCH2-SELECTION.md` lines 30-34 and 70-73):

```markdown
## Selected Candidates

| # | Candidate | Inferred Subfamily | Frequency | Weighted Score | Selection Rationale |
|---:|---|---|---:|---:|---|
| 1 | `hay` | `amber` | 112 | 66.02 | Score 66.02 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — environmental note remains interpretable as a stable olfactive descriptor rather than generic prose |
...
| 37 | `tolu` | `amber` | 7 | 51.56 | Score 51.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — established resinous/woody material with direct curation value |
| 38 | `acrylate` | `tropical_fruit` | 10 | 45.03 | Score 45.03 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — industrial/solvent-like odor term is recognizable and distinct, kept as a limited off-profile but clear olfactive descriptor |
| 39 | `tea_green_tea` | `floral_white` | 11 | 38.56 | Score 38.56 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
| 40 | `kumquat` | `amber` | 2 | 35.70 | Score 35.70 qualified because evidence and placement remained competitive while semantic clarity/curation value stayed above the cutoff for Batch 2. Sanity: pass — recognizable olfactive term with bounded ambiguity and useful curation value |
```

Rows in `46-DECISION-MATRIX.md` must preserve this rank order as ids `01`-`40`, with `source_phase45_rank` equal to the Phase 45 `#` and `phase45_inferred_subfamily` copied from Phase 45 `Inferred Subfamily`.

---

### `.planning/phases/46-batch-2-decision-matrix/46-VERIFICATION.md` (verification artifact, batch validation)

**Analog:** `.planning/phases/46-batch-2-decision-matrix/46-VALIDATION.md`  
**Parser precedent:** `src/tests/curation/taxonomy_seed_v2.test.ts`

**Validation map pattern** (`46-VALIDATION.md` lines 37-44):

```markdown
| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 46-01-01 | 01 | 1 | DEC-01 | T-46-01 | Matrix exists and has exactly the 40 Phase 45 selected candidates | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-02 | 01 | 1 | DEC-02 | T-46-01 | Locked disposition enum and mutation invariants are enforced | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-03 | 01 | 1 | DEC-03 | T-46-02 | Evidence/rationale fields are present and non-mutating rows instruct `none` | parser | `python3 - <<'PY' ... PY` | No - Wave 0 | pending |
| 46-01-04 | 01 | 1 | DEC-01, DEC-02, DEC-03 | T-46-02 | No protected taxonomy, alias, compiled, source, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI mutations occur | CLI diff | `git diff --name-only` | Yes | pending |
```

**Existing TypeScript parser pattern** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 275-288):

```typescript
const parsePhase41DecisionMatrixApprovedSeedEntries = (matrix: string): ApprovedSeedEntry[] => matrix
  .split('\n')
  .filter(line => /^\| \d+ \|/.test(line))
  .map(line => line.slice(1, -1).split('|').map(cell => cell.trim()))
  .filter(cells => cells[4] === 'promote_to_seed' && cells[8] === 'true')
  .map(cells => ({
    approvalId: `phase41-row-${cells[0] ?? ''}`,
    round: undefined,
    familyId: cells[5] ?? '',
    subfamilyId: cells[6] ?? '',
    descriptorId: cells[7] ?? '',
    rationale: cells[9] ?? '',
    evidence: cells[10] ?? '',
  }))
```

For Phase 46, adapt indexes to the final schema and verify: row count 40, candidate sequence equals Phase 45, dispositions are locked enum, confidence is only `low`/`medium_high`/`high`, non-executable rows have empty targets and `phase47_instruction=none`, executable rows have complete targets and valid confidence/depth.

**Traceability assertion pattern** (`src/tests/curation/taxonomy_seed_v2.test.ts` lines 407-416):

```typescript
it('derives Phase 42 seed approvals from the Phase 41 decision matrix', async () => {
  const phase41DecisionMatrix = await readFile(phase41DecisionMatrixPath, 'utf8')
  const approvedPaths = parsePhase41DecisionMatrixApprovedSeedEntries(phase41DecisionMatrix).map(
    entry => `${entry.familyId}/${entry.subfamilyId}/${entry.descriptorId}`,
  )

  expect(approvedPaths).toEqual([...APPROVED_PHASE_42_SEED_PATHS])
  NON_APPROVED_PHASE_41_CANDIDATES.forEach(candidate => {
    expect(approvedPaths.some(seedPath => seedPath.endsWith(`/${candidate}`)), `non-approved Phase 41 candidate authorized: ${candidate}`).toBe(false)
  })
})
```

Use this as the mental model for Phase 47: derive executable work only from `mutation_allowed=true` rows with `promote_to_seed`/`add_alias`, and assert non-approved candidates are not authorized.

---

### `.planning/phases/46-batch-2-decision-matrix/46-01-SUMMARY.md` (summary artifact, reporting)

**Analog:** `src/tests/fixtures/curation/41-DECISION-MATRIX.md` execution summary and `45-BATCH2-SELECTION.md` summary.

**Selection summary pattern** (`45-BATCH2-SELECTION.md` lines 313-318):

```markdown
## Selection Summary

- Selected candidates: **40**
- Not-selected candidates: **219**
- Total accounted for: **259**
- Selected subfamily distribution: `amber`=10, `balsamic_resin`=1, `citrus_bitter`=2, `citrus_fresh`=1, `floral_rose`=3, `floral_white`=5, `fresh_spice`=1, `leafy_green`=1, `leathery`=1, `orchard_fruit`=1, `tropical_fruit`=4, `vanilla`=3, `warm_spice`=5, `woody_dry`=2
```

If created, `46-01-SUMMARY.md` should report final disposition counts, mutation true/false counts, high-risk candidates resolved to non-executable rows, and zero-mutation confirmation.

## Shared Patterns

### Zero-Mutation Boundary

**Source:** `46-CONTEXT.md` lines 10-14 and 21-23  
**Apply to:** All Phase 46 artifacts

```markdown
Phase 46 is **decide-only**. It assigns formal, evidence-backed dispositions and `mutation_allowed` gates for exactly the 40 candidates selected in Phase 45, producing a parseable decision matrix before any curation mutation.

Phase 46 may create or update Phase 46 planning artifacts (primarily `46-DECISION-MATRIX.md`). It must **not** mutate taxonomy seeds, aliases, compiled artifacts, source code, Graphify, scoring, MVP/SaaS, Knowledge Engine, or UI. It must not reopen `seed_corpus_conflict` items.
```

### Locked Disposition and Mutation Gate

**Source:** `46-CONTEXT.md` lines 25-45  
**Apply to:** Every matrix row

```markdown
- `promote_to_seed` — candidate may become a new seed descriptor under an **existing** family/subfamily.
- `add_alias` — candidate may become an alias to an **existing** seed descriptor.
- `reject` — do not promote or alias (noise, artifact, generic, semantically unsafe, or out-of-scope for fragrance taxonomy).
- `defer_manual_review` — may be valid but requires expert/manual review before action.
- `defer_future_batch` — may be valid but not actionable this milestone or needs broader taxonomy work.
- `needs_external_reference` — external/literature/reference validation required before a safe decision; distinct from both defer types.

Set `mutation_allowed=true` **only** when disposition is `promote_to_seed` or `add_alias`, required target fields are complete, target family/subfamily already exist, placement is not weak/stretch, confidence is `medium_high` or `high`, investigation depth is at least `targeted_check`, rationale/evidence are documented, and `phase47_instruction` is explicit and mechanical.
```

### Existing Taxonomy Target Validation

**Source:** `46-RESEARCH.md` lines 151-172  
**Apply to:** Any row considered for `promote_to_seed` or `add_alias`

```markdown
Current compiled v2 taxonomy is version `2.7.0` with 10 families, 18 subfamilies, and 324 descriptors.

| Family | Existing subfamilies |
|---|---|
| `amber_resinous` | `amber`, `balsamic_resin` |
| `animalic` | `leathery`, `musky` |
| `citrus` | `citrus_bitter`, `citrus_fresh` |
| `floral` | `floral_rose`, `floral_white` |
| `fresh_spice` | `fresh_spice` |
| `fruity` | `orchard_fruit`, `red_fruit`, `tropical_fruit` |
| `gourmand` | `vanilla` |
| `green` | `herbal_green`, `leafy_green` |
| `spicy` | `warm_spice` |
| `woody` | `woody_dry`, `woody_mossy` |

None of the 40 selected candidate ids currently exists as a descriptor in `data/compiled/v2/taxonomy.json`.

`descriptor_aliases.json` has 18 alias entries in version `2.7.0`, and none of the 40 selected candidates is currently an alias key or alias target.
```

### Investigation Depth and Confidence

**Source:** `46-CONTEXT.md` lines 70-87  
**Apply to:** Every matrix row

```markdown
- `baseline_check` — source/rationale review plus obvious semantic risk screening (required for all 40 rows).
- `targeted_check` — validate existing target fit, duplicate/alias status, executable field completeness (required for any `promote_to_seed` or `add_alias` candidate).
- `deep_check` — required for ambiguous, food-linked high-risk, off-note/industrial, truncated, externally uncertain, alias-risk, stretch-placement, or new-structure candidates.

Allowed `confidence` values are **exactly three**: `low`, `medium_high`, `high`. Do **not** use `medium`, `verified`, or any other label.
```

### High-Risk Candidate Handling

**Source:** `46-RESEARCH.md` lines 316-325  
**Apply to:** `orri`, `acrylate`, food/gourmand/nutty rows, weak placement rows

```markdown
| `orri` | Truncated/ambiguous canonical form | Default `needs_external_reference`, `deep_check`, `mutation_allowed=false`, `phase47_instruction=none`. |
| `acrylate` | Industrial/off-profile, inferred `tropical_fruit` likely unsafe | Prefer `needs_external_reference` or `defer_manual_review` unless safe existing fit is proven. |
| `coffee`, `hazelnut`, `macadamia`, `marzipan`, `butterscotch`, `sesame` | Food-linked/gourmand/nutty candidates may need absent structure | Do not promote from food identity or weak `vanilla`/fruit/resin fits; defer if no exact existing subfamily. |
| `tea_green_tea`, `kumquat` | Candidate text/inferred placement mismatch risk | Preserve inferred subfamily but only target safe existing taxonomy if proven; otherwise non-executable. |
| `hay` | v2.7 precedent deferred it due missing hay/fougere structure | Do not force into `amber`; likely defer unless new evidence proves exact existing fit. |
| `orchid` | v2.7 precedent deferred vague floral needing expert review | Use manual review unless exact white/rose floral target is justified. |
```

## No Analog Found

No Phase 46 deliverable lacks an analog. The strongest analogs are:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| N/A | N/A | N/A | Matrix, summary, and verification patterns all have Phase 41 / Phase 38 / Phase 46 validation precedents. |

## Metadata

**Analog search scope:** `.planning/phases/45-batch-2-candidate-selection/`, `.planning/milestones/v2.6-phases/38-group-b-conflict-microcuration/`, `src/tests/fixtures/curation/`, `src/tests/curation/`, `.planning/phases/46-batch-2-decision-matrix/`  
**Files scanned/read:** 9 primary files (`46-CONTEXT.md`, `46-RESEARCH.md`, `45-BATCH2-SELECTION.md`, `38-DECISION-MATRIX.md`, `41-DECISION-MATRIX.md`, `46-VALIDATION.md`, `taxonomy_seed_v2.test.ts`, `review_dispositions.test.ts`, optional AGENTS probe)  
**Pattern extraction date:** 2026-06-03
