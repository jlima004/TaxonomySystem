---
status: read_only_report_only
non_authorizing: true
phase: 14-taxonomy-v2-1-backlog-triage-curation-planning
created: 2026-05-26
protected_paths_touched: none
---

# Phase 14 Backlog Matrix

This matrix is a read-only planning handoff. It does not authorize curation, taxonomy data mutation, alias add/remove/remap, relation or accord changes, official artifact regeneration, `DEFAULT_PATHS` edits, Graphify regeneration, staging, cleanup or commit.

It satisfies the matrix-first requirement from BACKLOG-D-01 through BACKLOG-D-22 and covers TRIAGE-01 through TRIAGE-09. Any future execution requires a separate approved plan, explicit allowlist, required approval and validation gates.

## Boundary / Protected Policy

Protected paths:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1`
- `data/compiled/v2`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Allowed dispositions exactly:

- `candidate_for_phase_14`
- `defer_phase_15`
- `follow_up_later`
- `accepted_with_policy`
- `not_in_scope`
- `blocker_if_unresolved`

Allowed mutation types exactly:

- `none_report_only`
- `docs_only`
- `test_or_guard_only`
- `seed_descriptor`
- `alias_add_remove_remap`
- `relation_accord`
- `official_artifact`
- `graphify_generated`
- `default_path`
- `mixed_or_unknown`

Required row fields exactly:

| field |
|---|
| `id` |
| `area` |
| `item` |
| `source_evidence` |
| `impact` |
| `risk` |
| `risk_reason` |
| `required_evidence` |
| `mutation_type` |
| `protected_paths_touched` |
| `approval_required` |
| `validation_required` |
| `dependencies` |
| `suggested_phase` |
| `disposition` |
| `rationale` |

## Baseline Facts

| fact | value | source_evidence |
|---|---:|---|
| review_queue total | 317 | `14-CONTEXT.md`, `14-RESEARCH.md`, `data/compiled/v2/similarity_matrix.json` read-only inspection |
| review_queue `corpus_candidate_low_support` | 284 | `14-CONTEXT.md`, `14-RESEARCH.md` |
| review_queue `seed_corpus_conflict` | 33 | `14-CONTEXT.md`, `14-RESEARCH.md` |
| graph subfamilies | 18 | `14-CONTEXT.md`, `14-RESEARCH.md` |
| graph edges | 13 | `14-CONTEXT.md`, `14-RESEARCH.md` |
| graph density | about 0.085 | `14-CONTEXT.md`, `14-RESEARCH.md`; exact research value `0.08496732026143791` |
| absent alias target | `ylang ylang -> ylang_ylang` | `14-CONTEXT.md`, `alias_seed_v2.test.ts` legacy exception pattern |
| absent alias target | `petit grain -> petitgrain` | `14-CONTEXT.md`, `alias_seed_v2.test.ts` existing approved alias list |
| curated relations | 14 | `14-CONTEXT.md`, `14-RESEARCH.md`, `data/inference/curated_relations.v2.json` |
| accord records | 19 | `14-CONTEXT.md`, `14-RESEARCH.md`, `data/inference/accord_map.v2.json` |
| relation/accord total records | 33 | `14-CONTEXT.md`, `14-RESEARCH.md` |

## review_queue summary

TRIAGE-01 and BACKLOG-D-23 through BACKLOG-D-44 require actionability-first review queue triage. BACKLOG-D-29 and BACKLOG-D-30 require this matrix to summarize the queue and point to a future `14-REVIEW-QUEUE-TRIAGE.md`, not classify all 317 items line-by line.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RQ-01 | review_queue | Dedicated review queue triage report | `review_queue` has 317 items: 284 `corpus_candidate_low_support`, 33 `seed_corpus_conflict`; BACKLOG-D-29..D-44 | high | low | Report-only grouping is safe; mutation risk starts only if promote/reject/defer is executed | Future `14-REVIEW-QUEUE-TRIAGE.md` with metrics, groupings, representative samples and guardrails | none_report_only | none | plan_approval | traceable grouping, representative samples, no protected diff | none | phase_14_report_only | candidate_for_phase_14 | This is the safest actionability-first next artifact and explicitly avoids line-by-line curation or queue reduction. |
| RQ-02 | review_queue | Real numeric queue reduction | Same 317-item baseline; BACKLOG-D-28, D-36, D-42, D-43 | high | high | Real reduction implies seed, alias, relation/accord or artifact mutation and could silently promote corpus evidence | Persisted curatorial approval, explicit allowlist, before/after queue metrics, protected diff | mixed_or_unknown | `data/taxonomy/taxonomy-seed.v2.json`, `data/taxonomy/descriptor_aliases.seed.json`, `data/inference/curated_relations.v2.json`, `data/inference/accord_map.v2.json`, `data/compiled/v2` | persisted_curatorial_approval | protected diff, target integrity if aliases, graph gates if relations, `/tmp` compile only, official artifact protection | RQ-01 | phase_15 | defer_phase_15 | Numeric reduction is not the first quality gate; grouped actionability and approval must come first. |
| RQ-03 | review_queue | `seed_corpus_conflict` attention group | 33 medium-severity items; BACKLOG-D-26, D-31, D-37, D-44 | medium | medium | Conflicts could be mistaken as proof seed truth is wrong | Type-separated samples with seed descriptor, corpus evidence and reason | none_report_only | none | plan_approval | traceable samples, no seed mutation | RQ-01 | phase_14_report_only | candidate_for_phase_14 | A report can make conflicts actionable without treating them as blockers or auto-fixes. |
| RQ-04 | review_queue | `corpus_candidate_low_support` grouping | 284 items; research groups include `amber` 111, `tropical_fruit` 28, `floral_rose` 24 | medium | medium | High volume creates pressure to promote weak corpus candidates | Group by subfamily, reason, recurrence and representative evidence | none_report_only | none | plan_approval | deterministic sorting/grouping, no promotion | RQ-01 | phase_14_report_only | candidate_for_phase_14 | Grouping and sampling reduce ambiguity while preserving review-only status. |

## soft findings

TRIAGE-02 and BACKLOG-D-45 through BACKLOG-D-65 require explicit re-disposition of accepted soft findings. Findings become `blocker_if_unresolved` only when integrity, artifact/default safety, rollback, schema, determinism or future validation is compromised.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SOFT-01 | soft_findings | Low graph density | Graph has 18 subfamilies, 13 edges, density about 0.085; isolated subfamilies = 0 policy from BACKLOG-D-88..D-110 | medium | low | Density alone can drive artificial relation/accord edits | Confirm no isolated subfamilies and gaps have rationale | none_report_only | none | none | graph coverage notes, relation/accord audit linkage | RA-01 | phase_14_report_only | accepted_with_policy | Coverage-first remains safe; no density target is authorized. |
| SOFT-02 | soft_findings | Inherited zero-frequency seeds | Known inherited zero-frequency seeds include `bitter_orange`, `sweet_orange`, `tree_moss` | low | low | Removing or promoting based on frequency alone would mutate curated truth | Current-state evidence and future semantic rationale if changed | seed_descriptor | `data/taxonomy/taxonomy-seed.v2.json` | persisted_curatorial_approval | seed diff allowlist, `/tmp` compile, protected diff | none | later | accepted_with_policy | Frequency alone does not invalidate curated descriptors; keep policy-managed until evidence changes. |
| SOFT-03 | soft_findings | Review queue 317 remains open | Official v2 review queue has 317 items | high | medium | Queue volume can be mistaken for a hard quality failure | RQ-01 report with actionability groups | none_report_only | none | plan_approval | grouped report, no mutation | RQ-01 | phase_14_report_only | candidate_for_phase_14 | Make it explicit and actionable as a report before any execution. |
| SOFT-04 | soft_findings | Increased `seed_corpus_conflict` | 33 conflict items; BACKLOG-D-59 says needs more evidence, not auto-fix | medium | medium | Misclassification could undermine curated seed authority | Samples showing conflict mechanics and seed/corpus tension | none_report_only | none | plan_approval | type-separated samples, no seed mutation | RQ-01 | phase_14_report_only | candidate_for_phase_14 | Treat as attention group requiring evidence, not a blocker. |
| SOFT-05 | soft_findings | Pending/deferred candidates | Phase 10/13 backlog includes future candidate groups and deferred ideas | medium | medium | Candidate pressure may lead to broad curation in the wrong phase | Candidate inventory against existing endpoint and validation filters | none_report_only | none | plan_approval | traceable candidate rules, no promotion | CUR-01 | phase_14_report_only | candidate_for_phase_14 | Inventory belongs in matrix/reporting; real promotion defers. |

## alias cleanup

TRIAGE-03 and BACKLOG-D-66 through BACKLOG-D-87 require evidence-first alias target analysis and prohibit alias add/remove/remap without persisted approval and target integrity validation.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ALIAS-01 | alias_cleanup | `ylang ylang -> ylang_ylang` absent-target legacy exception | `14-CONTEXT.md`; `alias_seed_v2.test.ts` preserves existing approved aliases | medium | medium | Add/remap/remove would touch alias or seed truth and may invalidate legacy policy | Target should-exist review, equivalent target search, prior policy review, impact assessment | alias_add_remove_remap | `data/taxonomy/descriptor_aliases.seed.json`, `data/taxonomy/taxonomy-seed.v2.json` | persisted_curatorial_approval | alias target integrity, seed descriptor presence or documented exception, protected diff | none | phase_15 | defer_phase_15 | Keep evidence-first; do not mutate under the matrix plan. |
| ALIAS-02 | alias_cleanup | `petit grain -> petitgrain` absent-target alias | `14-CONTEXT.md`; `alias_seed_v2.test.ts` existing approved alias list | medium | medium | New discovery needs classification before any alias action | Target should-exist review, semantic equivalent target search, usage evidence | alias_add_remove_remap | `data/taxonomy/descriptor_aliases.seed.json`, `data/taxonomy/taxonomy-seed.v2.json` | persisted_curatorial_approval | alias target integrity, protected diff, `/tmp` compile if executed | none | phase_15 | defer_phase_15 | Target absence alone is insufficient for add/remap/remove; defer until approval. |
| ALIAS-03 | alias_cleanup | Alias manual review pack if row-level triage is insufficient | BACKLOG-D-78..D-81 optional pack rules | medium | low | Report-only pack is safe; mutation risk begins if treated as approval | Evidence-first alias pack with options, risks and no mutation | none_report_only | none | plan_approval | no alias mutation, no protected diff | ALIAS-01, ALIAS-02 | phase_14_report_only | follow_up_later | Create only if matrix/report shows human semantic decisions cannot be captured row-level. |

## graph quality

TRIAGE-04 and BACKLOG-D-88 through BACKLOG-D-110 keep graph quality coverage-first. New edges require existing endpoints, manual scores, rationale/evidence, persisted approval and artifact-safe validation.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GRAPH-01 | graph_quality | Coverage-first policy and low density disposition | 18 subfamilies, 13 edges, density about 0.085; BACKLOG-D-88..D-110 | medium | low | Artificial density work would degrade semantic quality | Confirm no isolated subfamilies and link concrete gaps to relation/accord audit | none_report_only | none | none | graph metrics, relation/accord evidence | RA-01 | phase_14_report_only | accepted_with_policy | Low density remains acceptable while coverage and gap rationale hold. |
| GRAPH-02 | graph_quality | Future graph expansion opportunity | BACKLOG-D-92..D-108 graph gates | high | high | Relation/accord edits affect graph semantics and official artifacts if compiled | Existing endpoints, manual score, rationale, approval, before/after graph metrics | relation_accord | `data/inference/curated_relations.v2.json`, `data/inference/accord_map.v2.json`, `data/compiled/v2` | persisted_curatorial_approval | endpoint validity, score [0,1], rationale/evidence, `/tmp` compile, protected diff | RA-01 | phase_15 | defer_phase_15 | No concrete approved edge is identified here; real graph changes belong after audit and approval. |

## future curation candidates

TRIAGE-05 and BACKLOG-D-111 through BACKLOG-D-133 require candidate inventory, not promotion. High-mutation promotions defer unless they satisfy existing family, existing subfamily, clear semantics, no alias dependency, no relation/accord dependency, no seed conflict, traceable evidence and objective validation.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CUR-01 | curation_candidates | Candidate inventory rules | BACKLOG-D-111..D-126 and research strategy | high | low | Report-only inventory is safe and clarifies future shortlist | Existing endpoint fit, semantic clarity, no dependency conflicts, traceable evidence | none_report_only | none | plan_approval | no seed mutation, candidate rules applied consistently | RQ-01 | phase_14_report_only | candidate_for_phase_14 | A report-only inventory can safely prepare future decisions. |
| CUR-02 | curation_candidates | Descriptor promotion execution | BACKLOG-D-127..D-133 complete curation gates | high | high | Seed descriptor mutation changes curated truth and downstream artifacts | Persisted approval, rationale, evidence, seed diff allowlist, before/after comparison | seed_descriptor | `data/taxonomy/taxonomy-seed.v2.json`, `data/compiled/v2` | persisted_curatorial_approval | seed diff allowlist, `/tmp` compile, review_queue impact, graph/alias dependency checks, protected diff | CUR-01 | phase_15 | defer_phase_15 | Promotion is intentionally out of this matrix plan and defaults to Phase 15+. |
| CUR-03 | curation_candidates | Optional curation manual review pack | BACKLOG-D-123..D-125 optional pack rules | medium | low | Empty packs create process noise; report-only pack is safe only with clear candidates | Clear candidate set fitting existing endpoint and evidence rules | none_report_only | none | plan_approval | no seed mutation, non-authorizing pack language | CUR-01 | phase_14_report_only | follow_up_later | Create only if candidate inventory reveals clear human-review candidates. |

## relations/accords quality

TRIAGE-06 and BACKLOG-D-134 through BACKLOG-D-156 prioritize audit quality over score tuning or gap filling. Current inputs have 14 curated relations, 19 accords and 33 total records.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RA-01 | relations_accords | Audit existing 14 relations and 19 accords | `14-CONTEXT.md`, `relation_accord_v2.test.ts` endpoint/score/rationale patterns | medium | low | Report-only sampled audit is safe; mutation risk starts with score/gap changes | Endpoint validity, score validity, rationale/evidence samples, explicit gap disposition | none_report_only | none | plan_approval | endpoint/score/rationale audit, no tuning | none | phase_14_report_only | candidate_for_phase_14 | A grouped audit can validate quality without touching relation/accord inputs. |
| RA-02 | relations_accords | Relation/accord score tuning or gap filling | BACKLOG-D-137..D-149, existing relation/accord gates | high | high | Score/gap edits can create artificial graph edges or unapproved semantic links | Persisted approval, rationale/evidence, existing endpoint, before/after graph metrics | relation_accord | `data/inference/curated_relations.v2.json`, `data/inference/accord_map.v2.json`, `data/compiled/v2` | persisted_curatorial_approval | endpoint validity, score [0,1], rationale/evidence, `/tmp` compile, protected diff | RA-01 | phase_15 | defer_phase_15 | Audit first; no tuning or gap filling is authorized by Phase 14 matrix work. |

## docs/help cleanup

TRIAGE-07 and BACKLOG-D-157 through BACKLOG-D-178 allow only small current-state docs/help candidates. Historical docs are preserved when they accurately record past state.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DOC-01 | docs_help | Current-state docs/help inconsistency shortlist | BACKLOG-D-157..D-178; Phase 13 noted small follow-ups like CLI help title wording | medium | low | Docs-only or help-text work is lower risk if current-state and bounded | Current-state grep/check across README, CLI help, planning current-state docs and release notes | docs_only | none | plan_approval | docs current-state grep, CLI tests if help code changes, protected diff | none | phase_14_candidate_exception | candidate_for_phase_14 | This is a plausible small Phase 14 execution front if evidence identifies concrete current-state errors. |
| DOC-02 | docs_help | Broad historical docs sweep | BACKLOG-D-159..D-172 | low | medium | Rewriting historical audit trail can erase useful context | Evidence that text guides current usage incorrectly, not merely mentions old state | docs_only | none | plan_approval | current-state rule, limited diff | DOC-01 | later | not_in_scope | Broad cleanup is not Phase 14 scope; preserve legitimate historical records. |

## Graphify/generated artifacts

TRIAGE-08 and BACKLOG-D-179 through BACKLOG-D-203 keep `graphify-out/*` and official generated artifacts protected. Graphify is supplemental and not taxonomy truth.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GEN-01 | graphify_artifacts | Graphify lifecycle remains protected/plan-gated | BACKLOG-D-179..D-190, D-202 | medium | medium | Generated outputs can contaminate commits or be mistaken for taxonomy truth | Concrete operational problem, artifact allowlist, generation command and diff policy | graphify_generated | `graphify-out/*` | artifact_plan_approval | Graphify status guard, commit separation, rollback/revert policy | none | later | follow_up_later | Keep backlog-first; no lifecycle decision or mutation is needed for this matrix. |
| GEN-02 | graphify_artifacts | Official compiled artifact refresh | BACKLOG-D-184..D-203 | high | high | Official artifact changes need release/publication policy and could overwrite v1/v2 baselines | Release/publication plan, `/tmp` comparison, protected diff, rollback | official_artifact | `data/compiled/v1`, `data/compiled/v2` | release_plan_approval | `/tmp` compile, deterministic comparison, protected diff, commit separation | none | phase_15 | defer_phase_15 | Official artifact refresh is outside default Phase 14 scope. |
| GEN-03 | graphify_artifacts | Dirty or preexisting Graphify output state | BACKLOG-D-181 and protected path policy | low | medium | Preexisting changes are not a taxonomy blocker but are a commit contamination risk | `git status --short -- graphify-out` before staging/commit | graphify_generated | `graphify-out/*` | artifact_plan_approval | staging guard, explicit allowlist if ever committed | none | phase_14_report_only | accepted_with_policy | Existing Graphify dirtiness does not block report-only work, but must remain out of this commit. |

## CI/release safety automation

TRIAGE-09 and BACKLOG-D-204 through BACKLOG-D-225 prioritize small deterministic non-mutating guards before broad CI/release work.

| id | area | item | source_evidence | impact | risk | risk_reason | required_evidence | mutation_type | protected_paths_touched | approval_required | validation_required | dependencies | suggested_phase | disposition | rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CI-01 | ci_release | Protected diff and Graphify staging guard | BACKLOG-D-215..D-223 priority safety checks | high | low | Non-mutating guard is low risk and protects future plans | Local command proof, exit code, no protected path mutation | test_or_guard_only | none | plan_approval | local proof, protected diff, Graphify status guard | none | phase_14_candidate_exception | candidate_for_phase_14 | Strong candidate for a small reversible Phase 14 execution front if separately planned. |
| CI-02 | ci_release | Tmp-only compile guard | BACKLOG-D-192, D-216, D-220..D-225 | high | medium | Guard must ensure no official artifact writes and avoid undocumented state | Local simulated proof that compile output uses `/tmp` only | test_or_guard_only | none | plan_approval | `/tmp` output proof, protected diff after command | none | phase_14_candidate_exception | candidate_for_phase_14 | Useful guard, but needs exact local proof before execution. |
| CI-03 | ci_release | `DEFAULT_PATHS` v2 assertion and explicit v1 fallback assertion | BACKLOG-D-216, Phase 12/13 post-promotion state | high | medium | Code-level assertions touch tests or scripts and must not change defaults | Existing CLI/default behavior evidence and relevant tests | test_or_guard_only | none | plan_approval | typecheck/test, protected diff for `src/cli/parse_args.ts` | none | phase_14_candidate_exception | candidate_for_phase_14 | Safety automation can protect post-v2 default behavior without curation. |
| CI-04 | ci_release | Full release pipeline | BACKLOG-D-205, D-209, D-213 | high | high | Broad automation may alter release behavior or artifact publication policy | Release engineering scope, artifact policy, rollout/rollback plan | mixed_or_unknown | `data/compiled/v1`, `data/compiled/v2`, `graphify-out/*` | release_plan_approval | release gates, artifact plan, protected diff, rollback | CI-01, CI-02, CI-03 | later | follow_up_later | Defer broad release automation until small guards prove value and scope is clear. |

## Non-Authorization Statement

Rows marked `candidate_for_phase_14` are candidates for later planning only. They are not approval to edit source, data, compiled artifacts, `DEFAULT_PATHS` or Graphify outputs. Curatorial rows and high-mutation rows require persisted approval and future validation before execution.
