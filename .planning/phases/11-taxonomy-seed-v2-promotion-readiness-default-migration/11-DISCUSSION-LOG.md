# Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `11-CONTEXT.md` only after discussion produces enough stable decisions.

**Date:** 2026-05-24
**Phase:** 11-taxonomy-seed-v2-promotion-readiness-default-migration
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Areas proposed:** Readiness criteria, remaining soft findings, alias readiness, graph readiness, review queue readiness, default switch strategy, generated artifacts strategy, rollback strategy, validation gates

---

## Phase Boundary

Phase 11 starts from the approved post-Phase 10 state. It evaluates readiness for a possible future `taxonomy-seed.v2.json` promotion and plans a controlled default migration/rollback strategy. It does not execute promotion during initial context gathering.

Phase 11 must NOT:

- Promote v2 to default.
- Alter `DEFAULT_PATHS`.
- Create executable plans before context gathering is complete.
- Implement code changes.
- Change seed/data files.
- Change compiled artifacts.
- Create official `data/compiled/v2` by default.
- Overwrite or remove `data/compiled/v1/`.
- Edit or remove `taxonomy-seed.v1.json`, `curated_relations.v1.json`, or `accord_map.v1.json`.
- Treat corpus/review_queue evidence as curated truth.

---

## Post-Phase 10 Starting Context

Phase 10 is complete and approved. V2 remains candidate-only.

Post-Phase 10 state:

- `taxonomy-seed.v2.json` exists as candidate expanded Round 3.
- `DEFAULT_PATHS` continue pointing to v1.
- `data/compiled/v1/` is preserved.
- No official `data/compiled/v2` artifact exists.
- `taxonomy-seed.v1.json`, `curated_relations.v1.json` and `accord_map.v1.json` are preserved.
- Temporary v1/v2 compiles passed in `/tmp/opencode/taxonomy-phase10-comparison/`.
- Repeated v2 compile was deterministic via `cmp -s`.
- `cd src && npm test -- tests/curation/` passed: 5 files, 28 tests.
- Hard failures: none.

Post-Phase 10 metrics:

| Metric | V1 | V2 Round 3 Candidate |
|--------|----|----------------------|
| Families | 3 | 10 |
| Subfamilies | 6 | 18 |
| Seed descriptors | 21 | 39 |
| Total compiled descriptors | 177 | 303 |
| Review queue | 427 | 317 |
| Input relations | 6 | 14 |
| Input accords | 5 | 19 |
| Compiled graph edges | 6 | 13 |

Known soft findings:

- `ylang ylang -> ylang_ylang` still points to a target absent in v2.
- Graph density is lower in v2, though isolated subfamilies = 0.
- Inherited zero-frequency seeds from v1 remain.
- Review queue still has 317 items.
- `seed_corpus_conflict` increased.
- Some Round 3 candidates remain pending/deferred.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 11: Taxonomy Seed v2 Promotion Readiness & Default Migration Planning? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | All areas | Discuss readiness criteria, soft findings, alias target gaps, graph density, review queue, default switch strategy, generated artifacts strategy, rollback, validation gates and release process. | yes |
| 2 | Readiness criteria | Quais criterios minimos precisam estar satisfeitos antes de v2 virar default. | |
| 3 | Remaining soft findings | Como tratar ylang target ausente, graph density, zero-frequency seeds, review_queue restante e seed_corpus_conflict. | |
| 4 | Alias readiness | Se aliases com targets ausentes bloqueiam promocao ou podem ser aceitos por politica explicita. | |
| 5 | Graph readiness | Qual densidade/cobertura minima o similarity graph precisa atingir antes do default switch. | |
| 6 | Review queue readiness | Qual tamanho/distribuicao da review_queue e aceitavel para promover v2. | |
| 7 | Default switch strategy | Como alterar DEFAULT_PATHS, version, CLI behavior e documentacao. | |
| 8 | Generated artifacts strategy | Se a promocao deve gerar `data/compiled/v2`, substituir `data/compiled/v1`, ou criar outro fluxo versionado. | |
| 9 | Rollback strategy | Como voltar para v1 se a promocao causar regressoes. | |
| 10 | Validation gates | Quais hard gates e soft gates devem ser usados para a promocao. | |
| 11 | Type your own answer | Add another discussion area. | |

**Initial recommendation:** discuss all areas (option 1).

**User selection:** All areas (option 1).

Next discussion order:

1. Readiness criteria
2. Remaining soft findings
3. Alias readiness
4. Graph readiness
5. Review queue readiness
6. Default switch strategy
7. Generated artifacts strategy
8. Rollback strategy
9. Validation gates

---

## Decision Capture Rules

Use decision IDs `PROMO-D-01`, `PROMO-D-02`, `PROMO-D-03`, and so on.

Until `11-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## 1. Readiness Criteria

### Starting Evidence

Phase 10 validated v2 Round 3 as candidate-only with:

- hard failures: none
- deterministic compile
- curation tests passing
- protected v1/default files intact
- v2 not promoted
- review_queue reduced from 427 to 317
- compiled graph edges increased from 6 to 13
- isolated subfamilies = 0

Remaining soft findings:

- `ylang ylang -> ylang_ylang` target absent
- graph density lower
- zero-frequency seeds inherited from v1
- review_queue still has 317 items
- `seed_corpus_conflict` increased
- candidates remain pending/deferred

### Readiness Criteria Selection

Quais criterios minimos devem ser obrigatorios antes de qualquer promocao do v2 para default?

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | Strict readiness checklist | Exigir zero hard failures, determinismo, curation traceability, explicit alias policy, graph coverage sem isolated subfamilies, review_queue aceitavel, zero-frequency policy, migration plan, rollback plan e aprovacao humana final. | yes |
| 2 | Candidate is ready with policy exceptions | Promover v2 se hard failures forem zero e soft findings tiverem politica explicita, mesmo com graph density baixa e review_queue alta. | |
| 3 | More curation required first | Nao considerar promocao ainda; exigir mais uma rodada de curadoria antes de migration planning. | |
| 4 | Technical readiness only | Promover se compile/test/schema/default switch passarem, tratando soft findings como pos-promocao. | |
| 5 | Discussion only | Discutir criterios sem decidir ainda. | |
| 6 | Type your own answer | Add another readiness position. | |

**Initial recommendation:** Strict readiness checklist (option 1).

**User selection:** Strict readiness checklist (option 1).

### Required Readiness Checklist

Before any future v2 default switch, the following criteria are mandatory:

1. Zero hard failures

- schema valid
- compile passes
- tests pass
- quality gates pass
- no hard/pattern-exclude descriptor appears in artifacts
- no auto-promotion without approval

2. Determinism

- repeated compiles with the same `generated_at` produce identical artifacts

3. Complete curation traceability

- every v2 seed/alias/relation/accord must trace to approval, rationale and evidence
- pending/deferred items cannot become authoritative artifacts

4. Alias readiness

- aliases with absent targets must be resolved or accepted by explicit policy
- `ylang ylang -> ylang_ylang` cannot remain implicit; it needs documented disposition

5. Graph readiness

- isolated subfamilies = 0 is mandatory
- low graph density can be a soft finding if approved-or-gap exists per subfamily
- relation/accord coverage must be documented

6. Review queue readiness

- review_queue does not need to be zero, but must be smaller, more actionable and free of unresolved blocker types
- size 317 may be acceptable only if distribution and severity are documented

7. Zero-frequency policy

- inherited or new zero-frequency seeds need rationale, accepted legacy policy or resolution plan
- a new zero-frequency seed without rationale blocks promotion

8. Migration plan required

- default switch must list changed files, commands, expected diffs and versioning strategy

9. Rollback plan required

- a tested/documented path back to v1 is required

10. Final human approval

- promotion requires explicit persisted approval, not only chat approval

### Decisions

- **PROMO-D-01:** Phase 11 will use a strict readiness checklist before any default switch.
- **PROMO-D-02:** Zero hard failures, determinism, curation traceability and final human approval are hard requirements.
- **PROMO-D-03:** Soft findings may be accepted only if they have explicit policy and documented disposition.
- **PROMO-D-04:** Migration plan and rollback plan are mandatory before promoting v2.
- **PROMO-D-05:** Phase 11 must not promote v2 automatically only because Phase 10 passed.

---

## 2. Remaining Soft Findings

### Soft Finding Disposition Policy

**User selection:** Disposition per finding (option 1).

Soft findings do not become blockers automatically, but they also cannot remain implicit. Before any future v2 promotion, every soft finding must receive one of these dispositions:

- `blocker_before_promotion`
- `accepted_with_policy`
- `follow_up_after_promotion`

Disposition criteria:

- A finding can become `blocker_before_promotion` if it affects correctness, reversibility, authoritative aliases, default behavior or traceability.
- A finding can become `accepted_with_policy` if it is known, limited, documented and governed by explicit policy.
- A finding can become `follow_up_after_promotion` if it does not block the default switch but should remain in backlog.

### Finding 1 - `ylang ylang -> ylang_ylang` Target Absent

Preferred disposition: `accepted_with_policy` for Phase 11 readiness, if an explicit legacy alias exception exists; otherwise `blocker_before_promotion`.

Policy:

- The legacy alias may remain only if documented as legacy/deferred.
- Do not add `ylang_ylang` to the seed only to satisfy the alias.
- Do not remove/remap the alias without a floral/ylang alias cleanup phase.
- Before default switch, the promotion report must explicitly declare this absent target as accepted by policy exception.

### Finding 2 - Lower Graph Density

Disposition: `accepted_with_policy`.

Policy:

- Low graph density is a soft warning.
- `isolated_subfamilies > 0` without approved gap is a blocker.
- Approved-or-gap per subfamily is mandatory.
- Do not create artificial edges only to increase density.

### Finding 3 - Zero-Frequency Seeds Inherited From v1

Disposition: `accepted_with_policy`.

Policy:

- A new zero-frequency seed without rationale is a blocker.
- An inherited zero-frequency seed can be accepted by policy.
- The promotion report must list each inherited zero-frequency seed and mark it as accepted legacy.

### Finding 4 - Review Queue Still Has 317 Items

Disposition: `accepted_with_policy` plus `follow_up_after_promotion`.

Policy:

- Review queue does not need to be zero.
- It must be smaller or more actionable than v1.
- It must contain no unresolved blocker types without disposition.
- Remaining items continue as post-promotion curation backlog.

### Finding 5 - `seed_corpus_conflict` Increased

Disposition: `accepted_with_policy`.

Policy:

- `seed_corpus_conflict` does not block by itself.
- Conflict without approval/rationale blocks promotion.
- Conflict with approval/rationale/evidence is accepted by policy.

### Finding 6 - Pending/Deferred Candidates Remain

Disposition: `follow_up_after_promotion`.

Policy:

- Pending/deferred candidates may remain.
- No pending/deferred candidate can enter as seed, alias, relation or accord.
- Remaining backlog must be documented for future phases.

### Final Soft Findings Table Requirement

Before promotion, Phase 11 must produce a final soft findings table with:

- `finding_id`
- `description`
- `affected_area`
- `disposition`
- `rationale`
- `required_policy`
- `promotion_blocker`
- `follow_up_phase`, if applicable

### Decisions

- **PROMO-D-06:** Soft findings require documented disposition before any promotion.
- **PROMO-D-07:** `ylang ylang -> ylang_ylang` target absent will be treated as `accepted_with_policy` only if there is an explicit legacy alias exception; otherwise it becomes `blocker_before_promotion`.
- **PROMO-D-08:** Low graph density can be `accepted_with_policy` if `isolated_subfamilies = 0` and every subfamily has relation/accord coverage or approved gap.
- **PROMO-D-09:** Zero-frequency seeds inherited from v1 do not block promotion if documented as accepted legacy; new zero-frequency seeds without rationale block promotion.
- **PROMO-D-10:** Remaining review queue can be `accepted_with_policy` if it is smaller or more actionable than v1 and has no blocker types without disposition.
- **PROMO-D-11:** Increased `seed_corpus_conflict` is acceptable if caused by curated seed truth with persisted approval/rationale/evidence.
- **PROMO-D-12:** Remaining pending/deferred candidates do not block promotion if they do not contaminate authoritative artifacts and are documented as follow-up.
- **PROMO-D-13:** V2 promotion requires a final soft findings table with explicit disposition.
- **PROMO-D-14:** No soft finding may remain without disposition at the time of default switch.

---

## 3. Alias Readiness

### Alias Target Policy

**User selection:** Legacy exception policy (option 1).

Phase 11 will use a formal legacy exception policy for authoritative aliases with absent targets.

Policy:

- New aliases with absent targets are hard blockers.
- Round 3+ aliases must point to canonical targets present in seed v2.
- Alias candidate/review-only entries must never enter `descriptor_aliases.json`.
- Legacy aliases with absent targets can be accepted only if they are in an explicit, auditable and documented exception list.
- Each legacy exception requires rationale, disposition and follow-up.

### Current Legacy Exception

`ylang ylang -> ylang_ylang` remains a legacy alias exception.

Rules:

- Do not add `ylang_ylang` to seed v2 only to satisfy the alias.
- Do not remove or remap `ylang ylang` automatically.
- Resolving this case requires a future floral/exotic-floral/ylang cleanup phase.

### Default Switch Readiness

The default switch may proceed with `ylang ylang -> ylang_ylang` absent only if:

1. A legacy alias exception list exists.
2. `ylang ylang -> ylang_ylang` is listed in it.
3. The promotion report declares the absent target as `accepted_with_policy`.
4. No new alias with an absent target exists.
5. Tests differentiate accepted legacy aliases from invalid new aliases.

### Hard Blockers

- Any new alias after v2 pointing to an absent target.
- Any alias candidate promoted without approval.
- Any alias without clear canonical target.
- Any absent alias target not listed as a legacy exception.

### Accepted With Policy

- `ylang ylang -> ylang_ylang`, while explicitly listed as a legacy exception.

### Follow-Up

Create a future alias/floral cleanup phase to decide whether `ylang_ylang` enters the seed, whether the alias is remapped, or whether the legacy alias is removed.

### Decisions

- **PROMO-D-15:** Phase 11 will adopt a legacy alias exception policy for authoritative aliases with absent targets.
- **PROMO-D-16:** New aliases with absent targets are hard blockers for promotion.
- **PROMO-D-17:** `ylang ylang -> ylang_ylang` will be accepted only as an explicit and auditable legacy exception.
- **PROMO-D-18:** V2 promotion will not require adding `ylang_ylang` to the seed, removing the alias, or remapping the alias in this phase.
- **PROMO-D-19:** The exception list must differentiate accepted legacy aliases from invalid new aliases.
- **PROMO-D-20:** Resolving `ylang ylang -> ylang_ylang` remains future alias/floral cleanup follow-up.

---

## 4. Graph Readiness

### Graph Readiness Policy

**User selection:** Coverage over density (option 1).

Phase 11 will use graph readiness based on coverage rather than a numeric minimum density.

Policy:

- `isolated_subfamilies = 0` is a hard requirement.
- Every subfamily must have at least one approved relation/accord or an explicit approved gap.
- Low graph density remains a soft finding, not a hard blocker.
- Do not create artificial relations/accords only to increase density.
- Edge quality and traceability matter more than absolute edge volume.

### Minimum Criteria For Default Switch

1. `isolated_subfamilies = 0`.
2. Every subfamily has coverage through an approved relation, approved accord, approved `relation_gap`, or approved `accord_gap`.
3. Every edge has existing source and target endpoints.
4. Every edge has a manual score in `[0,1]`.
5. No placeholder `score: 0` exists.
6. No edge exists without workbook approval/rationale/evidence.
7. Low graph density is documented as a soft finding, if applicable.

### Current State Interpretation

- v1 graph edges: 6.
- v2 graph edges: 13.
- v2 isolated subfamilies: 0.
- v2 graph density dropped because subfamilies increased from 6 to 18.
- This is acceptable as a soft finding if coverage remains complete.

### Hard Blockers

- `isolated_subfamilies > 0` without approved gap.
- Edge with missing endpoint.
- Edge without approval/rationale/evidence.
- Score outside `[0,1]`.
- Placeholder `score: 0`.
- Relation/accord generated by heuristic without curation.

### Soft Findings

- Lower graph density.
- Edge count still low for seed size.
- Pending relation/accord proposals documented.
- Future relation expansion recommended.

### Decisions

- **PROMO-D-21:** Graph readiness will be based on coverage over density.
- **PROMO-D-22:** `isolated_subfamilies = 0` is a hard requirement for default switch.
- **PROMO-D-23:** Every subfamily needs an approved relation/accord or explicit approved gap.
- **PROMO-D-24:** Low graph density is a soft finding if there are no isolated subfamilies and coverage is documented.
- **PROMO-D-25:** Phase 11 must not create artificial edges only to increase density.
- **PROMO-D-26:** Every graph edge needs existing endpoints, manual score in `[0,1]`, approval/rationale/evidence and no placeholder score 0.

---

## 5. Review Queue Readiness

### Review Queue Readiness Policy

**User selection:** Distribution severity gate (option 1).

Phase 11 will use a review queue readiness policy based on distribution, severity and disposition rather than a fixed numeric threshold.

Policy:

- Review queue does not need to be zero.
- Review queue must be smaller or more actionable than v1.
- Distribution by type/severity must be documented.
- No blocker type may remain without disposition.
- Remaining items can become post-promotion backlog if clearly classified.

### Minimum Criteria For Default Switch

1. V2 review_queue total is less than or equal to v1 review_queue total, or there is explicit justification if it is not lower.
2. Severity distribution is documented.
3. Review types are documented.
4. No hard/blocker type remains without disposition.
5. `seed_corpus_conflict` has rationale when linked to curated seed truth.
6. Remaining `corpus_candidate_low_support` can stay as backlog if it does not contaminate authoritative artifacts.
7. Pending/deferred candidates cannot enter seed/alias/relation/accord without approval.
8. Final report separates `blockers_before_promotion`, `accepted_with_policy` and `follow_up_after_promotion`.

### Current State Interpretation

- v1 review_queue: 427.
- v2 review_queue: 317.
- delta: -110.
- `corpus_candidate_low_support` dropped from 410 to 284.
- `seed_corpus_conflict` increased from 17 to 33.
- Increased `seed_corpus_conflict` is acceptable if each conflict is linked to curated seed truth with approval/rationale/evidence.

### Hard Blockers

- Review item indicating schema, quality or artifact corruption.
- Alias contamination.
- Unapproved promotion.
- Hard/pattern-exclude descriptor in artifact.
- Relation/accord endpoint missing.
- Blocker type without disposition.
- Pending/deferred candidate leaking into authoritative artifact.

### Soft Findings

- Queue still high.
- Remaining `corpus_candidate_low_support`.
- Increased `seed_corpus_conflict` with rationale.
- Pending/deferred candidates documented.

### Not Accepted As Policy

- Fixed numeric threshold as the only criterion.
- Near-zero queue requirement.
- Automatic promotion only because queue decreased.

### Decisions

- **PROMO-D-27:** Review queue readiness will be based on distribution/severity gate, not fixed threshold.
- **PROMO-D-28:** Remaining queue can be accepted if it is smaller or more actionable than v1 and has no blocker types without disposition.
- **PROMO-D-29:** Increased `seed_corpus_conflict` can be `accepted_with_policy` when caused by curated seed truth with approval/rationale/evidence.
- **PROMO-D-30:** Remaining `corpus_candidate_low_support` can become `follow_up_after_promotion` if it does not contaminate authoritative artifacts.
- **PROMO-D-31:** No review_queue item classified as blocker may remain without disposition before default switch.

---

## 6. Default Switch Strategy

### Phase Boundary

**User selection:** Separate execution phase (option 1).

Phase 11 will plan readiness and migration/default switch, but will not execute v2 promotion.

Policy:

- Phase 11 does not alter `DEFAULT_PATHS`.
- Phase 11 does not change CLI default behavior.
- Phase 11 does not replace `data/compiled/v1`.
- Phase 11 does not create `data/compiled/v2` as an official artifact, except as a documented proposal.
- Phase 11 does not promote v2 automatically even if all readiness gates pass.
- The real default switch requires a separate future phase/plan with final human approval.

### Strategy

1. Phase 11 produces a readiness audit.
2. Phase 11 produces a migration plan.
3. Phase 11 produces a rollback plan.
4. Phase 11 defines expected diffs for future promotion.
5. Phase 11 defines pre-switch and post-switch validation commands.
6. Phase 11 recommends `ready_for_promotion` or `not_ready`.
7. A future phase executes the switch, if approved.

### Future Execution Scope

A future execution phase may alter:

- `src/cli/parse_args.ts`
- default seed path to `data/taxonomy/taxonomy-seed.v2.json`
- default relations path to `data/inference/curated_relations.v2.json`
- default accords path to `data/inference/accord_map.v2.json`
- default version to `2.0.0`
- output dir to `data/compiled/v2` or another approved versioned output flow
- CLI usage documentation
- release/migration notes

### Files Phase 11 Must Preserve

- `src/cli/parse_args.ts`
- `data/compiled/v1/**`
- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`

### Rollback Documentation Requirement

Before any future execution, Phase 11 must document rollback steps to:

- restore `DEFAULT_PATHS` to v1
- recompile v1 with fixed `generated_at`
- compare artifacts
- guarantee v1 inputs remain preserved
- document commands to validate rollback

### Decisions

- **PROMO-D-32:** Phase 11 is readiness/migration planning only and will not execute default switch.
- **PROMO-D-33:** The real default switch requires a separate phase/plan with final human approval.
- **PROMO-D-34:** Phase 11 must document expected diffs, migration commands, validation commands and rollback commands.
- **PROMO-D-35:** `DEFAULT_PATHS`, CLI behavior and `data/compiled/v1` remain unchanged during Phase 11.
- **PROMO-D-36:** Even if readiness passes, v2 can become default only in a separate future execution.

---

## 7. Generated Artifacts Strategy

### Versioned Artifact Policy

**User selection:** Versioned v2 artifacts (option 1).

Phase 11 will plan a versioned compiled artifacts strategy for future promotion.

Policy:

- A future promotion should create official `data/compiled/v2` artifacts.
- `data/compiled/v1` must be preserved as baseline/archive.
- Promotion must not overwrite `data/compiled/v1`.
- V1 inputs must remain available for rollback.
- Official v2 artifacts are created only in a future default-switch phase, not during Phase 11 context gathering.

### Recommended Strategy

1. Keep `data/compiled/v1` as official historical v1 artifact.
2. Create `data/compiled/v2` as official v2 artifact when promotion is approved.
3. Change `DEFAULT_PATHS` only in the future execution phase, if approved.
4. Define `version: 2.0.0` as default only in the promotion plan.
5. Preserve explicit commands to compile v1 and v2 side by side.
6. Document rollback to restore v1 as default.
7. Validate that v1 and v2 artifacts are reproducible with fixed `generated_at`.

### Future Expected Structure

- `data/compiled/v1/taxonomy.json`
- `data/compiled/v1/descriptor_aliases.json`
- `data/compiled/v1/similarity_matrix.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

### Rules

- `data/compiled/v2` must not be created during Phase 11 context gathering.
- `data/compiled/v2` can be created only in a future phase/plan with final approval.
- `data/compiled/v1` must never be deleted or overwritten during promotion.
- Promotion report must compare `data/compiled/v1` and `data/compiled/v2`.
- Rollback must restore defaults to v1 without manually reconstructing historical artifacts.

### Rejected Approaches

Do not replace `data/compiled/v1` because it:

- increases operational risk
- makes diff/rollback harder
- erases official baseline
- mixes logical versioning with physical path

Do not rely only on temporary compiles because:

- promoted v2 needs official versioned artifacts
- temporary compiles are useful for validation, not release/default publication

### Decisions

- **PROMO-D-37:** The recommended future strategy is to publish official artifacts in `data/compiled/v2`.
- **PROMO-D-38:** `data/compiled/v1` will be preserved as baseline/archive and must not be overwritten.
- **PROMO-D-39:** Phase 11 will not create `data/compiled/v2`; it will only document the strategy.
- **PROMO-D-40:** Creating `data/compiled/v2` requires a future phase/plan with final human approval.
- **PROMO-D-41:** Future promotion must keep explicit commands to compile v1 and v2 side by side.
- **PROMO-D-42:** Rollback must restore defaults to v1 and validate preserved v1 artifacts.

---

## 8. Rollback Strategy

### Rollback Requirement

**User selection:** Documented tested rollback (option 1).

Phase 11 will require documented and validatable rollback before any v2 promotion.

Policy:

- Git-only rollback is not sufficient.
- Rollback needs clear commands.
- Rollback must restore v1 defaults.
- Rollback must validate that v1 inputs and artifacts remain preserved.
- Rollback must be testable before default switch.
- No v2 promotion may happen without an approved rollback plan.

### Required Rollback Coverage

1. `DEFAULT_PATHS`

- restore `seedPath` to `data/taxonomy/taxonomy-seed.v1.json`
- restore `relationsPath` to `data/inference/curated_relations.v1.json`
- restore `accordsPath` to `data/inference/accord_map.v1.json`
- restore `outputDir` to `data/compiled/v1`
- restore `version` to `1.0.0`

2. Preserved v1 inputs

- `data/taxonomy/taxonomy-seed.v1.json`
- `data/inference/curated_relations.v1.json`
- `data/inference/accord_map.v1.json`
- `data/compiled/v1/**`

3. Artifact validation

- confirm `data/compiled/v1/taxonomy.json` exists
- confirm `data/compiled/v1/descriptor_aliases.json` exists
- confirm `data/compiled/v1/similarity_matrix.json` exists
- validate v1 artifacts remain reproducible with fixed `generated_at`

4. Commands

The future promotion plan must include rollback commands to:

- restore `DEFAULT_PATHS` to v1
- run typecheck
- run tests
- compile v1 into a temporary path
- compare temporary artifacts with expected baseline
- confirm `data/compiled/v2` is not used when rollback is active

5. Validation

Rollback is valid only if:

- v1 compile passes
- tests pass
- `DEFAULT_PATHS` point to v1
- v1 artifacts exist
- v2 is no longer default
- no protected v1 file was deleted

### Hard Blockers

- Rollback not documented.
- Rollback without verifiable commands.
- V1 inputs removed.
- `data/compiled/v1` overwritten without archive.
- `DEFAULT_PATHS` not restorable.
- Rollback depends only on git revert.
- Rollback not tested.

### Accepted Support

- Git revert may be an auxiliary tool, but it is not sufficient as the rollback strategy.

### Decisions

- **PROMO-D-43:** Phase 11 will require documented and validatable rollback before any default switch.
- **PROMO-D-44:** Git-only rollback is not accepted as the primary strategy.
- **PROMO-D-45:** Rollback must restore `DEFAULT_PATHS` to v1 and validate preserved v1 inputs/artifacts.
- **PROMO-D-46:** Future promotion can execute only if the plan includes rollback commands and rollback validation.
- **PROMO-D-47:** `data/compiled/v1` and v1 inputs must remain available for rollback.

---

## 9. Validation Gates

### Gate Set Selection

**User selection:** Full hard/soft gate set (option 1).

A future v2 promotion must use a full hard/soft gate set covering technical validation, curation, aliases, graph, review queue, protected files, migration, rollback and human approval.

### Hard Gates

#### 1. Technical Gates

- typecheck passes
- tests pass
- build passes
- v2 compile passes
- schema validation passes
- quality gates pass
- deterministic compile passes with fixed `generated_at`
- repeated compile produces identical artifacts

Hard failure if typecheck, tests, build, compile or repeated-artifact comparison fails.

#### 2. Curation Traceability Gates

- every v2 seed has approval/rationale/evidence or is inherited from accepted baseline
- every new alias has approved `add_alias`
- every relation/accord has its own approval
- pending/deferred items cannot enter authoritative artifacts
- corpus/review_queue cannot promote anything by itself

Hard failure if curated change lacks workbook traceability, auto-promotion occurs, or candidate/review-only evidence leaks into authoritative artifacts.

#### 3. Alias Gates

- new aliases with absent targets block promotion
- alias candidates cannot enter `descriptor_aliases.json`
- aliases without clear canonical targets block promotion
- absent alias target is allowed only if listed in explicit legacy exception list

Hard failure if a new alias points to an absent target, a legacy absent target lacks exception policy, or `ylang ylang -> ylang_ylang` lacks documented disposition/exception.

#### 4. Graph Gates

- `isolated_subfamilies = 0`
- every subfamily has approved relation/accord or approved gap
- every edge has existing endpoints
- every score is in `[0,1]`
- no placeholder `score: 0`
- no heuristic edge without approval

Hard failure if subfamily is isolated without approved gap, relation/accord endpoint is missing, score is invalid, or edge lacks approval/rationale/evidence.

#### 5. Review Queue Gates

- review queue is smaller or more actionable than v1
- distribution by severity/type is documented
- no blocker type remains without disposition
- `seed_corpus_conflict` has rationale when linked to curated seed truth

Hard failure if blocker item lacks disposition, unapproved promotion is indicated by queue, or artifact contamination is detected.

#### 6. Protected Files / Default Drift Gates

- v1 inputs remain preserved
- `data/compiled/v1` remains preserved as baseline/archive
- default changes occur only inside approved migration plan
- no protected file is removed

Hard failure if `taxonomy-seed.v1.json`, `curated_relations.v1.json`, `accord_map.v1.json` or `data/compiled/v1` are removed/altered improperly, or `DEFAULT_PATHS` changes outside migration plan.

#### 7. Migration Gates

- expected diffs are documented
- files that change are listed
- promotion commands are defined
- post-promotion commands validate v2 default
- official versioned artifact strategy is clear

Hard failure if default switch lacks expected diff, validation commands, clear data/compiled strategy, or clear version/output dir strategy.

#### 8. Rollback Gates

- rollback is documented
- rollback is testable
- rollback commands are defined
- v1 defaults are restorable
- v1 artifacts are preserved
- rollback does not depend only on git revert

Hard failure if rollback is absent, not verifiable, v1 is not restorable, or v1 artifacts are absent.

#### 9. Human Approval Gate

- promotion requires final persisted human approval
- chat approval is not enough
- readiness report must declare `approved_for_default_switch`

Hard failure if default switch is executed without final persisted approval.

### Soft Gates

Soft findings do not block automatically, but each requires disposition:

- low graph density
- review_queue still high
- increased `seed_corpus_conflict`
- inherited zero-frequency seeds
- remaining pending/deferred candidates
- legacy alias exceptions
- future curation backlog

Each soft finding requires:

- `finding_id`
- `description`
- `affected_area`
- `disposition`
- `rationale`
- `promotion_blocker`
- `follow_up`, if applicable

Allowed dispositions:

- `blocker_before_promotion`
- `accepted_with_policy`
- `follow_up_after_promotion`

No soft finding may remain without disposition at default switch time.

### Required Release Checklist

Before promotion:

1. readiness report approved
2. hard gates = pass
3. soft findings have disposition
4. migration plan approved
5. rollback plan approved
6. expected diffs reviewed
7. v1/v2 artifacts compared
8. v1 baseline preserved
9. `data/compiled/v2` strategy defined
10. final human approval persisted

### Decisions

- **PROMO-D-48:** Future v2 promotion requires a full hard/soft gate set.
- **PROMO-D-49:** Technical gates are necessary but insufficient without curation, alias, graph, migration and rollback gates.
- **PROMO-D-50:** No soft finding may remain without disposition before default switch.
- **PROMO-D-51:** Validatable rollback and final human approval are hard gates.
- **PROMO-D-52:** Expected diffs and migration commands are mandatory before altering `DEFAULT_PATHS`.
- **PROMO-D-53:** Promotion can occur only when hard gates pass and soft gates are explicitly accepted, blocked or assigned follow-up.

---

## Discussion Summary

**Date:** 2026-05-24
**Areas discussed:** 9/9 complete
**Decisions captured:** PROMO-D-01 through PROMO-D-53

| Area | Decisions | Key Outcomes |
|------|-----------|--------------|
| Readiness criteria | PROMO-D-01 to PROMO-D-05 | Strict readiness checklist required before any default switch |
| Remaining soft findings | PROMO-D-06 to PROMO-D-14 | Every soft finding requires explicit disposition |
| Alias readiness | PROMO-D-15 to PROMO-D-20 | Legacy alias exception policy; new absent targets block promotion |
| Graph readiness | PROMO-D-21 to PROMO-D-26 | Coverage over density; no isolated subfamilies; approved-or-gap required |
| Review queue readiness | PROMO-D-27 to PROMO-D-31 | Distribution/severity gate rather than fixed threshold |
| Default switch strategy | PROMO-D-32 to PROMO-D-36 | Phase 11 planning only; execution requires future approved phase |
| Generated artifacts strategy | PROMO-D-37 to PROMO-D-42 | Future official `data/compiled/v2`; preserve `data/compiled/v1` |
| Rollback strategy | PROMO-D-43 to PROMO-D-47 | Documented and validatable rollback required; git-only is insufficient |
| Validation gates | PROMO-D-48 to PROMO-D-53 | Full hard/soft gate set and release checklist required |

**Next step:** Create `11-CONTEXT.md` from these 53 decisions. Do not create executable plans yet.

---

## Recommended Direction for Phase 11

### A. Readiness Audit

Candidate criteria:

- hard failures = none
- deterministic compile
- protected files auditable
- no unapproved curation
- aliases with absent targets resolved or explicitly accepted
- graph coverage acceptable
- review_queue acceptable
- zero-frequency seeds justified
- migration/rollback documented
- final human approval

### B. Migration Plan

Plan, but do not execute automatically:

- whether `DEFAULT_PATHS` changes to v2
- whether default `version` changes to `2.0.0`
- whether `data/compiled/v1` remains as archive
- whether official `data/compiled/v2` is created
- whether CLI compiles v2 by default
- how breaking changes are documented
- how artifacts are compared before and after

### C. Rollback Plan

Plan:

- how to restore `DEFAULT_PATHS` to v1
- how to preserve v1 inputs
- how to keep compiled v1 reproducible
- how to detect regressions after switch
- which commands validate rollback

---

## Deferred Until Discussion/Context Approval

- `11-CONTEXT.md`.
- `11-01-PLAN.md`.
- `11-RESEARCH.md`.
- `11-PATTERNS.md`.
- `11-VALIDATION.md`.
- Code changes.
- Seed/data changes.
- Compiled artifact changes.
- `DEFAULT_PATHS` changes.
- Official `data/compiled/v2` creation.
- v2 default promotion.
