# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Context

> **Canonical context document.** Downstream researcher and planner agents must use this as the authoritative Phase 14 decision source.

**Gathered:** 2026-05-26  
**Phase:** 14-taxonomy-v2-1-backlog-triage-curation-planning  
**Status:** context_captured  
**Execution readiness:** not_ready_for_execution  
**Decision count:** 225 (`BACKLOG-D-01` through `BACKLOG-D-225`)

---

## Phase Boundary

Phase 14 is a triage-first, risk-first planning phase for the post-Phase 13 v2.1 backlog. It classifies backlog items, defines evidence and validation expectations, and may later choose one small controlled execution front only after research, patterns, validation, a specific approved plan and any required persisted approval exist.

Phase 14 context capture does not authorize implementation, curation, data mutation, artifact regeneration or executable planning.

Protected by default during and after context capture unless a future explicit plan says otherwise:

- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/inference/curated_relations.v2.json`
- `data/inference/accord_map.v2.json`
- `data/compiled/v1/**`
- `data/compiled/v2/**`
- `src/cli/parse_args.ts`
- `graphify-out/*`

Not authorized by this context:

- Descriptor promotion.
- Alias add/remove/remap.
- Relation or accord add/remove/score change.
- Official artifact regeneration or overwrite.
- `DEFAULT_PATHS` change.
- Graphify regeneration, cleanup, revert, staging or commit.
- `14-RESEARCH.md`, `14-PATTERNS.md`, `14-VALIDATION.md` or `14-01-PLAN.md` creation during context capture.

---

## Implementation Decisions

### Boundary & Priority Model

- `BACKLOG-D-01`: Phase 14 uses triage-first before any execution.
- `BACKLOG-D-02`: Backlog items must be classified by impact, risk, evidence, mutation type, protected paths, approval, validation, suggested phase and disposition.
- `BACKLOG-D-03`: No taxonomy mutation is authorized during context gathering.
- `BACKLOG-D-04`: Curatorial items require persisted approval before execution.
- `BACKLOG-D-05`: Phase 14 may choose one future execution front only after triage.
- `BACKLOG-D-06`: `graphify-out/*` remains protected/plan-gated.
- `BACKLOG-D-07`: Phase 14 may execute one small front after triage only if `14-CONTEXT.md`, `14-RESEARCH.md`, `14-PATTERNS.md`, `14-VALIDATION.md`, a specific executable plan, required persisted approval, protected diff gates and rollback/restore policy exist.
- `BACKLOG-D-08`: Broad cleanup is prohibited.
- `BACKLOG-D-09`: If no small safe front is found, Phase 14 closes with strategy/backlog and moves execution to Phase 15+.
- `BACKLOG-D-10`: Curatorial execution in Phase 14 requires persisted approval and explicit file allowlist.
- `BACKLOG-D-11`: `data/compiled/v1`, `data/compiled/v2`, `DEFAULT_PATHS` and `graphify-out/*` remain protected by default.
- `BACKLOG-D-12`: Priority is risk-first when impact and risk conflict.
- `BACKLOG-D-13`: Low mutation, clear validation, small scope and artifact protection outrank high impact.
- `BACKLOG-D-14`: High-impact/high-risk items defer to Phase 15+ unless they are true blockers.
- `BACKLOG-D-15`: First potential execution should favor small, reversible, evidence-clear items.
- `BACKLOG-D-16`: Official artifacts, `DEFAULT_PATHS` and `graphify-out/*` remain protected by default.
- `BACKLOG-D-17`: Primary triage artifact is `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-18`: The matrix must cover the full known backlog, not only executable candidates.
- `BACKLOG-D-19`: Each matrix item must classify impact, risk, evidence, mutation type, approval, validation, suggested phase and disposition.
- `BACKLOG-D-20`: The matrix applies the Phase 14 risk-first policy.
- `BACKLOG-D-21`: An execution shortlist may be derived from the matrix but does not replace it.
- `BACKLOG-D-22`: The matrix does not authorize execution; it guides research, planning and future approval.

Required matrix fields:

- `id`
- `area`
- `item`
- `source_evidence`
- `impact`
- `risk`
- `risk_reason`
- `required_evidence`
- `mutation_type`
- `protected_paths_touched`
- `approval_required`
- `validation_required`
- `dependencies`
- `suggested_phase`
- `disposition`
- `rationale`

Allowed top-level dispositions:

- `candidate_for_phase_14`
- `defer_phase_15`
- `follow_up_later`
- `accepted_with_policy`
- `not_in_scope`
- `blocker_if_unresolved`

### Review Queue Reduction

Current official v2 `review_queue` facts from `data/compiled/v2/similarity_matrix.json`:

- Total: 317.
- `corpus_candidate_low_support`: 284.
- `seed_corpus_conflict`: 33.
- Severity: all `medium`.

Decisions:

- `BACKLOG-D-23`: Primary objective for v2.1 review queue work is actionability-first.
- `BACKLOG-D-24`: Raw numeric queue reduction is not the initial primary metric.
- `BACKLOG-D-25`: The 317 items must be classified and grouped before any executable promote/reject/defer.
- `BACKLOG-D-26`: `seed_corpus_conflict` is an attention group, not an auto-blocker or auto-fix.
- `BACKLOG-D-27`: `corpus_candidate_low_support` should be grouped by recurrence, likely family/subfamily and evidence without auto-promotion.
- `BACKLOG-D-28`: Any future real queue reduction requires persisted approval, rationale/evidence and before/after validation.
- `BACKLOG-D-29`: Phase 14 should plan a dedicated `14-REVIEW-QUEUE-TRIAGE.md` report.
- `BACKLOG-D-30`: `14-BACKLOG-MATRIX.md` contains only a summarized review_queue entry pointing to the dedicated report.
- `BACKLOG-D-31`: The review_queue report must separate `seed_corpus_conflict` from `corpus_candidate_low_support`.
- `BACKLOG-D-32`: The report must include metrics, groupings, samples, suggested dispositions and guardrails.
- `BACKLOG-D-33`: The report authorizes no promotion, rejection, seed mutation, alias mutation, relation/accord mutation or artifact mutation.
- `BACKLOG-D-34`: Review queue triage quality is validated by consistent metrics, traceable groupings and representative samples.
- `BACKLOG-D-35`: Full line-by-line classification of all 317 items is not required for first triage.
- `BACKLOG-D-36`: Numeric reduction targets are not the primary quality gate.
- `BACKLOG-D-37`: Samples must cover both `corpus_candidate_low_support` and `seed_corpus_conflict`.
- `BACKLOG-D-38`: Any future shortlist must derive from traceable groupings.
- `BACKLOG-D-39`: Human review is desired before execution, but does not replace evidence traceability.
- `BACKLOG-D-40`: The review_queue front is report-only-first in Phase 14.
- `BACKLOG-D-41`: Phase 14 may generate a shortlist and manual-review packs, but no curatorial mutation by default.
- `BACKLOG-D-42`: Real queue reduction via promote/reject/defer goes to Phase 15+ by default.
- `BACKLOG-D-43`: A minimal Phase 14 curatorial exception requires persisted approval, specific plan, allowlist and before/after validation.
- `BACKLOG-D-44`: Review_queue shortlist must distinguish review packs, Phase 15 candidates, Phase 14 exceptions, insufficient-evidence items and non-actionable items.

Review queue report must include:

- Summary metrics.
- `seed_corpus_conflict` triage.
- `corpus_candidate_low_support` triage.
- Traceable sample rows.
- Recommendations.
- Guardrails.

### Soft Findings Disposition / Cleanup

Soft findings to reclassify include at least:

- `ylang ylang -> ylang_ylang` legacy alias exception.
- Low graph density.
- Inherited zero-frequency seeds.
- `review_queue` 317.
- Increased `seed_corpus_conflict`.
- Pending/deferred candidates.
- Absent-target aliases where applicable.
- Documented relation/accord gaps.
- Any soft finding accepted by Phase 11/12 policy.

Decisions:

- `BACKLOG-D-45`: Phase 14 performs explicit re-disposition of Phase 11/12 accepted soft findings.
- `BACKLOG-D-46`: Accepted soft findings do not become automatic blockers and do not remain accepted without re-evaluation.
- `BACKLOG-D-47`: Each soft finding must appear in `14-BACKLOG-MATRIX.md` with source evidence, risk, impact, mutation type, approval, validation and disposition.
- `BACKLOG-D-48`: Small, clear, low-risk items may become `candidate_for_phase_14`; broad or ambiguous items defer.
- `BACKLOG-D-49`: `accepted_with_policy` remains allowed when prior policy is still safe and justified.
- `BACKLOG-D-50`: No soft finding is resolved by automatic mutation during context gathering.
- `BACKLOG-D-51`: Soft findings are reclassified as a section of `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-52`: No dedicated soft findings artifact is created at this stage.
- `BACKLOG-D-53`: Each soft finding matrix entry must include source evidence, current policy, risk, impact, mutation type, approval, validation and disposition.
- `BACKLOG-D-54`: A dedicated soft findings artifact is only considered later if the matrix shows need for deeper analysis.
- `BACKLOG-D-55`: The soft findings matrix section does not authorize execution or mutation.
- `BACKLOG-D-56`: Phase 14 uses a conservative initial map for known soft findings.
- `BACKLOG-D-57`: `ylang ylang -> ylang_ylang`, pending/deferred candidates and real review_queue reduction are initially deferred to Phase 15+.
- `BACKLOG-D-58`: Low graph density and zero-frequency seeds may remain `accepted_with_policy` when prior policy remains safe.
- `BACKLOG-D-59`: `seed_corpus_conflict` is initially `needs_more_evidence`, not auto-fix or auto-blocker.
- `BACKLOG-D-60`: Researcher/planner may revise initial dispositions only with traceable evidence.
- `BACKLOG-D-61`: Soft findings become `blocker_if_unresolved` only when they affect integrity, artifact/default safety, rollback, schema, determinism or future validation.
- `BACKLOG-D-62`: Perceived semantic quality alone does not make a soft finding a blocker.
- `BACKLOG-D-63`: Repeated findings do not become blockers automatically.
- `BACKLOG-D-64`: Every `blocker_if_unresolved` must identify rationale, evidence and the compromised gate/guarantee.
- `BACKLOG-D-65`: Non-critical soft findings use `accepted_with_policy`, `needs_more_evidence`, `defer_phase_15`, `follow_up_later` or `candidate_for_phase_14`.

### Alias Cleanup

Read-only alias audit found:

- `descriptor_aliases.seed.json` has 11 aliases.
- Absent targets in v2 seed:
- `ylang ylang -> ylang_ylang`.
- `petit grain -> petitgrain`.
- 9 aliases point to present targets.

Decisions:

- `BACKLOG-D-66`: Alias triage covers all aliases with targets absent from v2 seed.
- `BACKLOG-D-67`: `ylang ylang -> ylang_ylang` is treated as the known legacy case.
- `BACKLOG-D-68`: `petit grain -> petitgrain` is treated as a new discovery to classify.
- `BACKLOG-D-69`: Aliases with present targets are not reviewed deeply by default in this front.
- `BACKLOG-D-70`: No alias may be added, removed or remapped without persisted approval and target integrity validation.
- `BACKLOG-D-71`: Absent-target aliases use an evidence-first analysis order.
- `BACKLOG-D-72`: Phase 14 must check whether the target should exist before proposing add/remap/remove.
- `BACKLOG-D-73`: Remap is considered only if an existing target is semantically equivalent.
- `BACKLOG-D-74`: Alias removal requires rationale; target absence alone is insufficient.
- `BACKLOG-D-75`: Keeping an alias as `accepted_with_policy` remains allowed when legacy policy and controlled risk are documented.
- `BACKLOG-D-76`: No alias cleanup action executes without persisted approval and target integrity validation.
- `BACKLOG-D-77`: Alias cleanup is represented in `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-78`: Phase 14 may create `14-ALIAS-MANUAL-REVIEW-PACK.md` if triage shows need.
- `BACKLOG-D-79`: No dedicated `14-ALIAS-CLEANUP-TRIAGE.md` is created at this stage.
- `BACKLOG-D-80`: Alias manual-review pack authorizes no mutation; it only prepares future human decision.
- `BACKLOG-D-81`: Any executable alias cleanup requires persisted approval and target integrity validation.
- `BACKLOG-D-82`: Future alias cleanup requires a target integrity gate.
- `BACKLOG-D-83`: Before/after must prove aliases point to present targets or explicit accepted exceptions.
- `BACKLOG-D-84`: Compile passing alone is insufficient for alias cleanup validation.
- `BACKLOG-D-85`: Human approval does not replace technical alias target integrity validation.
- `BACKLOG-D-86`: Any alias add/remap/remove requires persisted approval, rationale, evidence and allowlist.
- `BACKLOG-D-87`: Executable alias cleanup in Phase 14 is a minimal exception; default is Phase 15+.

Evidence-first alias analysis order:

1. Confirm alias, target, absent target, compiled presence and prior exception policy.
2. Check whether the target should exist as canonical descriptor.
3. Check whether a semantically equivalent target already exists.
4. Review legacy policy and rationale.
5. Evaluate impact on schema, compile, alias integrity, usage, review_queue and future curation.
6. Only then choose `add_target_to_seed`, `remap_to_existing_target`, `remove_alias`, `keep_accepted_with_policy`, `defer_phase_15` or `needs_more_evidence`.

### Graph Density / Graph Coverage

Current official v2 graph facts:

- Subfamilies: 18.
- Edges: 13.
- Density: approximately 0.085.
- `isolated_subfamilies = 0` per Phase 11/12 readiness policy.

Decisions:

- `BACKLOG-D-88`: Graph quality remains coverage-first, not density-first.
- `BACKLOG-D-89`: Low density remains accepted with policy while no subfamilies are isolated and gaps have rationale.
- `BACKLOG-D-90`: Phase 14 does not set a density target as primary gate.
- `BACKLOG-D-91`: New relations/accords may not be created only to increase density.
- `BACKLOG-D-92`: Any new relation/accord requires existing endpoints, manual score, rationale, persisted approval and before/after validation.
- `BACKLOG-D-93`: Documented gaps may remain `accepted_with_policy` with explicit rationale.
- `BACKLOG-D-94`: Graph quality is represented as a section of `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-95`: Phase 14 does not create a dedicated graph coverage report at this stage.
- `BACKLOG-D-96`: Edge, gap and new connection details are handled in Relations/accords.
- `BACKLOG-D-97`: Low density remains `accepted_with_policy` while `isolated_subfamilies = 0` and gaps have rationale.
- `BACKLOG-D-98`: A dedicated graph report is only considered if problematic gaps/edges or a concrete expansion proposal emerges.
- `BACKLOG-D-99`: Any future graph/relation/accord change requires graph gates.
- `BACKLOG-D-100`: Endpoints must exist in v2 seed before any persisted relation/accord.
- `BACKLOG-D-101`: Scores must be manual, in `[0,1]`, with rationale; placeholder `0` is prohibited.
- `BACKLOG-D-102`: Every new relation/accord requires persisted approval and source evidence.
- `BACKLOG-D-103`: Graph changes require before/after metrics and artifact-safe compile to `/tmp`.
- `BACKLOG-D-104`: Compile passing alone is insufficient for graph changes.
- `BACKLOG-D-105`: Artificial edges to increase density remain prohibited.
- `BACKLOG-D-106`: Graph/relation/accord execution in Phase 14 is a minimal exception, not default.
- `BACKLOG-D-107`: Default executable graph improvements move to Phase 15+.
- `BACKLOG-D-108`: Phase 14 exception requires persisted approval, specific plan, allowlist and complete graph gates.
- `BACKLOG-D-109`: Clear but non-urgent graph opportunities become `defer_phase_15`.
- `BACKLOG-D-110`: Low density without concrete gap remains `accepted_with_policy`.

Graph gates include endpoint validity, score validity, rationale/evidence, approval, before/after graph metrics, `/tmp` compile, protected diff checks and no official artifact/default/Graphify mutation.

### Future Curation Candidates / Descriptor Promotions

Decisions:

- `BACKLOG-D-111`: Phase 14 creates a candidate inventory for future curation candidates and descriptor promotions.
- `BACKLOG-D-112`: Descriptor promotion is not executed by default in Phase 14.
- `BACKLOG-D-113`: Candidates are classified in `14-BACKLOG-MATRIX.md` by evidence, risk, mutation type, dependencies, approval and validation.
- `BACKLOG-D-114`: Phase 14 may prepare manual-review packs for future candidates.
- `BACKLOG-D-115`: Real promotions move to Phase 15+ by default.
- `BACKLOG-D-116`: Exceptional Phase 14 promotion requires persisted approval, specific plan, allowlist and before/after validation.
- `BACKLOG-D-117`: Candidate inventory prioritizes candidates fitting existing family/subfamily endpoints.
- `BACKLOG-D-118`: High corpus frequency is support signal, not absolute priority.
- `BACKLOG-D-119`: Soft-finding-linked candidates are registered but not automatically prioritized when high-mutation.
- `BACKLOG-D-120`: Candidates requiring new taxonomy structure defer to Phase 15+ by default.
- `BACKLOG-D-121`: Existing endpoint fit is the first safety filter for future executable candidates.
- `BACKLOG-D-122`: `14-BACKLOG-MATRIX.md` is the mandatory artifact for future curation candidates.
- `BACKLOG-D-123`: `14-CURATION-MANUAL-REVIEW-PACK.md` is optional and created only if inventory reveals clear candidates.
- `BACKLOG-D-124`: Manual-review pack authorizes no promotion or mutation.
- `BACKLOG-D-125`: Do not create an empty or artificial mandatory pack.
- `BACKLOG-D-126`: Candidates without clear evidence remain in the matrix as `needs_more_evidence` or `defer_phase_15`.
- `BACKLOG-D-127`: Future descriptor promotion requires complete curation gates.
- `BACKLOG-D-128`: Persisted approval, rationale and source evidence are required per promoted descriptor.
- `BACKLOG-D-129`: Seed diff allowlist is required before any `taxonomy-seed.v2.json` change.
- `BACKLOG-D-130`: Before/after compiles must write to `/tmp` with fixed `generated_at`, without overwriting official artifacts.
- `BACKLOG-D-131`: Review_queue impact, alias dependencies and graph dependencies must be assessed before/after.
- `BACKLOG-D-132`: Compile passing alone is insufficient for descriptor promotion.
- `BACKLOG-D-133`: Descriptor promotion in Phase 14 is a minimal exception; Phase 15+ is default.

Candidate inventory priority:

- High priority: existing family, existing subfamily, clear descriptor semantics, no alias cleanup dependency, no relation/accord dependency, no conflict with seed truth, traceable evidence, objective validation.
- Defer: new family, new subfamily, absent-target alias dependency, relation/accord expansion dependency, graph-density dependency, ambiguous corpus evidence, broad semantic review.

### Relations / Accords Quality

Current v2 input facts:

- `data/inference/curated_relations.v2.json`: 14 relations.
- `data/inference/accord_map.v2.json`: 19 accords.
- Total relation/accord records for audit: 33.

Decisions:

- `BACKLOG-D-134`: Relations/accords quality uses audit-quality as initial priority.
- `BACKLOG-D-135`: Phase 14 audits endpoint validity, score validity, rationale/evidence and gaps before proposing expansion.
- `BACKLOG-D-136`: Gap expansion is not the default Phase 14 priority.
- `BACKLOG-D-137`: Score tuning is not done without rationale, evidence and persisted approval.
- `BACKLOG-D-138`: Existing relations/accords may remain `accepted_with_policy` if endpoint/score/rationale checks pass.
- `BACKLOG-D-139`: Any future relation/accord or score change requires complete graph gates.
- `BACKLOG-D-140`: Relations/accords quality is represented as a section of `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-141`: Phase 14 does not create `14-RELATIONS-ACCORDS-AUDIT.md` by default.
- `BACKLOG-D-142`: Relations/accords have their own matrix section, separate from Graph quality but linked when graph-affecting.
- `BACKLOG-D-143`: Dedicated artifact is considered only if audit finds clear problems or enough findings to justify separation.
- `BACKLOG-D-144`: Any future relations/accords change still requires complete graph gates.
- `BACKLOG-D-145`: Relation/accord gaps without sufficient rationale/evidence are `needs_more_evidence`.
- `BACKLOG-D-146`: Gaps with explicit rationale and controlled risk may remain `accepted_with_policy`.
- `BACKLOG-D-147`: Gaps are not filled automatically only because they exist.
- `BACKLOG-D-148`: Clear gap becomes execution candidate only if endpoints exist, rationale is strong and graph gates are defined.
- `BACKLOG-D-149`: Broad, ambiguous or curation-dependent gaps defer to Phase 15+.
- `BACKLOG-D-150`: Relations/accords audit uses sampled gates as minimum planning validation.
- `BACKLOG-D-151`: Counts of 14 relations, 19 accords and 33 total records must match v2 inputs.
- `BACKLOG-D-152`: Endpoint and score checks should be automated where possible.
- `BACKLOG-D-153`: Gaps and findings require explicit disposition.
- `BACKLOG-D-154`: Samples must cover both curated relations and accords.
- `BACKLOG-D-155`: Compile pass alone is insufficient for audit completeness.
- `BACKLOG-D-156`: Full manual audit of all 33 records is not required unless sampled gates reveal problems.

### Docs / Help Cleanup

Decisions:

- `BACKLOG-D-157`: Small current-state docs/help cleanup may be a low-risk Phase 14 execution candidate.
- `BACKLOG-D-158`: Docs/help cleanup must not alter data, artifacts, `DEFAULT_PATHS`, `src/cli/parse_args.ts` or `graphify-out/*`.
- `BACKLOG-D-159`: Broad docs sweep is not default Phase 14 scope.
- `BACKLOG-D-160`: Historical docs are not rewritten only because they record old states correctly.
- `BACKLOG-D-161`: Docs communicating current state incorrectly may become `blocker_if_unresolved`.
- `BACKLOG-D-162`: Help text code changes require relevant CLI tests.
- `BACKLOG-D-163`: Docs/help cleanup is registered in `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-164`: Phase 14 may derive a small docs/help cleanup shortlist if clear candidates exist.
- `BACKLOG-D-165`: No `14-DOCS-HELP-AUDIT.md` is created by default.
- `BACKLOG-D-166`: Direct fixes without intermediate artifact are prohibited.
- `BACKLOG-D-167`: Docs/help shortlist may contain only small, current-state, low-risk changes with no data/artifact/default changes.
- `BACKLOG-D-168`: Docs/help uses the current-state rule to distinguish true inconsistency from legitimate history.
- `BACKLOG-D-169`: Correct historical docs are preserved as audit trail.
- `BACKLOG-D-170`: Current-state docs that are wrong may be Phase 14 candidates or blockers depending on impact.
- `BACKLOG-D-171`: Phase 14 does not sweep old text broadly only because it mentions prior state.
- `BACKLOG-D-172`: Old references in historical context are classified as `legacy_context` or `accepted_with_policy`.
- `BACKLOG-D-173`: Executable docs/help cleanup requires docs gates.
- `BACKLOG-D-174`: Current-state grep/check is required to avoid v1/v2 communication regression.
- `BACKLOG-D-175`: Help-text code changes require relevant CLI tests and typecheck where applicable.
- `BACKLOG-D-176`: Protected diff is mandatory to confirm no data/artifact/default mutation.
- `BACKLOG-D-177`: `graphify-out/*` must remain out of staging/commit in docs/help cleanup.
- `BACKLOG-D-178`: Human review alone is insufficient without minimum technical checks.

Current-state docs to check include `README.md`, CLI help text, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, release/current migration notes and current phase context/preflight when they guide present usage.

### Graphify / Generated Artifact Lifecycle Policy

Decisions:

- `BACKLOG-D-179`: `graphify-out/*` and generated artifacts remain protected by default in Phase 14.
- `BACKLOG-D-180`: Any Graphify regeneration/mutation/commit requires explicit plan, allowlist and diff policy.
- `BACKLOG-D-181`: Preexisting dirty `graphify-out/*` state is not a blocker by itself but remains commit-contamination risk.
- `BACKLOG-D-182`: `graphify-out/*` is not authoritative taxonomy correctness evidence without its own plan.
- `BACKLOG-D-183`: Graphify lifecycle policy is registered in `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-184`: `data/compiled/v1` and `data/compiled/v2` remain protected official artifacts and are not overwritten during Phase 14 triage.
- `BACKLOG-D-185`: Phase 14 records Graphify lifecycle as backlog-first, not an immediate definitive policy decision.
- `BACKLOG-D-186`: Current `protected_plan_gated` policy remains active during Phase 14.
- `BACKLOG-D-187`: Decision between `versioned`, `local_only`, `ignored` or `archive_only` is deferred until triage shows clear need.
- `BACKLOG-D-188`: Graphify lifecycle becomes Phase 14 execution only with proven operational problem and explicit plan.
- `BACKLOG-D-189`: Phase 14 does not alter hooks, `.gitignore`, `graphify-out/*` or generated artifacts during context gathering.
- `BACKLOG-D-190`: Graphify regeneration or commit requires its own plan, diff policy and separate commit.
- `BACKLOG-D-191`: `data/compiled/v1` and `data/compiled/v2` are read-protected official artifacts in Phase 14.
- `BACKLOG-D-192`: All validation, smoke compile or experimental regeneration must write only to `/tmp`.
- `BACKLOG-D-193`: Official artifacts are never Phase 14 output targets.
- `BACKLOG-D-194`: Official `data/compiled/v2` refresh is outside default Phase 14 scope.
- `BACKLOG-D-195`: Detected drift is recorded as finding, not corrected automatically.
- `BACKLOG-D-196`: Official artifact diff is `blocker_if_unresolved` unless an explicit release/artifact publication plan exists.
- `BACKLOG-D-197`: Any future Graphify/generated artifact plan requires complete artifact gates.
- `BACKLOG-D-198`: Explicit allowlist is required before modifying, staging or committing generated artifacts.
- `BACKLOG-D-199`: Generation command, inputs and diff policy must be recorded before execution.
- `BACKLOG-D-200`: Generated artifacts must be committed separately from taxonomy, docs/help or runtime changes.
- `BACKLOG-D-201`: Protected diff and rollback/revert policy are mandatory for generated artifact plans.
- `BACKLOG-D-202`: Graphify/generated artifacts are not authoritative taxonomy truth.
- `BACKLOG-D-203`: Official compiled artifact changes require a release/publication plan, not generated artifact cleanup.

Artifact gates include explicit allowlist, generation command and input record, diff policy, commit separation, protected diff, rollback/revert policy, no taxonomy-truth claims and hook contamination guard.

### CI / Release Process Automation

Decisions:

- `BACKLOG-D-204`: CI/release automation in Phase 14 prioritizes low-risk safety automation.
- `BACKLOG-D-205`: Full CI/release pipeline is not default Phase 14 priority.
- `BACKLOG-D-206`: Candidate automation should protect defaults, artifacts, v1 fallback, generated artifacts and docs current-state.
- `BACKLOG-D-207`: Automation may not alter broad release behavior without explicit plan.
- `BACKLOG-D-208`: Small safety checks may be Phase 14 candidates if scope is clear, validation simple and protected diff clean.
- `BACKLOG-D-209`: Publication, artifact refresh and full release pipeline defer to Phase 15+ or release engineering.
- `BACKLOG-D-210`: CI/release automation is registered in `14-BACKLOG-MATRIX.md`.
- `BACKLOG-D-211`: Phase 14 may derive a small shortlist of low-risk safety checks.
- `BACKLOG-D-212`: No `14-CI-RELEASE-AUTOMATION.md` is created by default.
- `BACKLOG-D-213`: Full CI/release pipeline is deferred until clear need exists.
- `BACKLOG-D-214`: Candidate safety automation may not alter data, official artifacts, `DEFAULT_PATHS`, Graphify or broad release behavior.
- `BACKLOG-D-215`: Strongest Phase 14 safety automation candidates are protected guards.
- `BACKLOG-D-216`: Priority checks are protected diff, tmp-only compile, Graphify staging guard, `DEFAULT_PATHS` v2 assertion and explicit v1 fallback assertion.
- `BACKLOG-D-217`: Data quality guards like alias target integrity and relation/accord endpoint/score checks are important but do not outrank protected guards as first post-v2-default automation.
- `BACKLOG-D-218`: Docs guards may be Phase 14 candidates when current-state issue exists, but are not initial priority over protected/runtime guards.
- `BACKLOG-D-219`: Executable safety automation must be small, deterministic, removable and non-mutating for data/artifacts/defaults.
- `BACKLOG-D-220`: Executable Phase 14 safety checks require local proof.
- `BACKLOG-D-221`: The command/script must run locally, record exit code and avoid undocumented external state.
- `BACKLOG-D-222`: Where possible, safety checks should demonstrate failure in a safe simulated scenario.
- `BACKLOG-D-223`: Every safety check must prove it does not alter protected paths, official artifacts, `DEFAULT_PATHS` or `graphify-out/*`.
- `BACKLOG-D-224`: Versioned safety checks need automated tests where viable or explicit justification if not.
- `BACKLOG-D-225`: Manual documentation without local proof is insufficient for Phase 14 execution.

Priority safety checks:

- Protected diff check.
- Tmp-only compile guard.
- `graphify-out/*` staging/commit guard.
- `DEFAULT_PATHS` v2 assertion.
- Explicit v1 fallback assertion.

---

## Planned / Possible Phase 14 Outputs

Mandatory next planning artifact:

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` — Primary full-backlog triage matrix.

Planned dedicated report:

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md` — Dedicated review_queue triage report.

Optional artifacts only if matrix/research shows clear need:

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-ALIAS-MANUAL-REVIEW-PACK.md`
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CURATION-MANUAL-REVIEW-PACK.md`

Optional shortlists derived from the matrix:

- Docs/help cleanup shortlist.
- Safety automation shortlist.
- Manual review packs.

Not planned by default:

- `14-GRAPH-COVERAGE-TRIAGE.md`
- `14-RELATIONS-ACCORDS-AUDIT.md`
- `14-DOCS-HELP-AUDIT.md`
- `14-CI-RELEASE-AUTOMATION.md`
- `14-ALIAS-CLEANUP-TRIAGE.md`

Do not create during context capture:

- `14-RESEARCH.md`
- `14-PATTERNS.md`
- `14-VALIDATION.md`
- `14-01-PLAN.md`

---

## Canonical References

Downstream agents must read these before planning Phase 14.

### Project State And Phase Boundary

- `.planning/PROJECT.md` — Current project value, v2 default status, constraints, active Phase 14 boundary and key decisions.
- `.planning/REQUIREMENTS.md` — Phase 14 requirements `TRIAGE-01` through `TRIAGE-09`, plus prior phase requirements and traceability.
- `.planning/STATE.md` — Current project state, Phase 14 status and protected/no-execution boundary.
- `.planning/ROADMAP.md` — Phase 14 goal, hard boundaries, dependencies and initial backlog areas.

### Upstream Decisions

- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CONTEXT.md` — Phase 13 stabilization, protected path policy, Graphify policy and Phase 14 backlog boundary.
- `.planning/phases/12-taxonomy-seed-v2-default-switch-execution/12-CONTEXT.md` — Default switch, official v2 artifacts, rollback/fallback and artifact/default protection.
- `.planning/phases/11-taxonomy-seed-v2-promotion-readiness-default-migration/11-CONTEXT.md` — Soft findings policy, alias exception, graph coverage, review_queue readiness and promotion gates.
- `.planning/phases/10-taxonomy-seed-v2-expansion-round-3/curation/v1-v2-comparison.md` — Baseline v2 candidate comparison, review_queue metrics, graph density and soft findings.

### Phase 14 Artifacts

- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-CONTEXT.md` — This canonical context.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-DISCUSSION-LOG.md` — Human audit trail for questions/options/rationale.
- `.planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-PREFLIGHT.md` — Non-executable boundary and allowed next step.

### Data And Generated Artifacts

- `data/compiled/v2/similarity_matrix.json` — Official v2 review_queue and graph stats source.
- `data/compiled/v2/descriptor_aliases.json` — Official compiled v2 aliases artifact.
- `data/taxonomy/descriptor_aliases.seed.json` — Authoritative alias seed input; protected/no-edit by default.
- `data/taxonomy/taxonomy-seed.v2.json` — Authoritative v2 seed input; protected/no-edit by default.
- `data/inference/curated_relations.v2.json` — Authoritative v2 curated relation input; protected/no-edit by default.
- `data/inference/accord_map.v2.json` — Authoritative v2 accord input; protected/no-edit by default.
- `data/compiled/v1/**` — Official v1 baseline/archive artifacts; protected/read-only.
- `data/compiled/v2/**` — Official v2 artifacts; protected/read-only.
- `graphify-out/GRAPH_REPORT.md` — Graphify report read during context; Graphify is supplemental, not taxonomy truth.
- `graphify-out/*` — Protected/plan-gated generated graph artifacts.

### Codebase Maps

- `.planning/codebase/ARCHITECTURE.md` — Functional pipeline/pure computation pattern and no-side-effect expectations.
- `.planning/codebase/CONVENTIONS.md` — TypeScript strict, naming, no semicolons, docs language and error-handling patterns.
- `.planning/codebase/CONCERNS.md` — Known concern context; note that this map is older than current taxonomy implementation and should be treated as historical/scouting context.

---

## Existing Code Insights

### Reusable Assets

- `src/cli/parse_args.ts` — `DEFAULT_PATHS` source of truth for v2 defaults; protected/no-edit in Phase 14 context and triage.
- `src/cli/compile.ts` / compile CLI — Existing path for default v2 and explicit v1 smoke compiles, but Phase 14 validation outputs must go to `/tmp`.
- `src/tests/curation/v1_v2_comparison.test.ts` — Existing v1/v2 determinism and explicit-path validation patterns useful for future safety automation.
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Existing v2 seed/default preservation and curation contract checks.
- `src/tests/cli/compile.test.ts` and CLI parse/compile tests — Useful for help text or CLI behavior validation if future docs/help cleanup touches code.
- `data/compiled/v2/similarity_matrix.json` — Current official review_queue and graph stats.
- `data/taxonomy/descriptor_aliases.seed.json` — Source for absent-target alias triage.
- `data/inference/curated_relations.v2.json` and `data/inference/accord_map.v2.json` — Source for relations/accords audit.

### Established Patterns

- Strict TypeScript, ESM modules and zero-runtime-dependency architecture.
- Pure-function and deterministic compile expectations.
- Curated seed/inference/alias files are authoritative inputs; corpus evidence remains support-only.
- Compiled artifacts are versioned by directory and protected as official artifacts.
- Smoke compiles and before/after validations should write to `/tmp` with fixed `generated_at` when deterministic comparison is needed.
- Soft findings use explicit disposition; they are not silently fixed or silently ignored.
- Protected diff checks are mandatory around any future executable work.

### Integration Points

- `14-BACKLOG-MATRIX.md` is the primary planning handoff for triage.
- `14-REVIEW-QUEUE-TRIAGE.md` is the planned detailed handoff for review_queue.
- Any future executable plan must stage explicit files only and must not include `graphify-out/*` unless a dedicated artifact plan authorizes it.
- `src/package.json` scripts are likely command entry points for typecheck, tests, build and compile from the `src/` package directory.

---

## Specific Ideas

Specific output names locked by discussion:

- `14-BACKLOG-MATRIX.md` — mandatory.
- `14-REVIEW-QUEUE-TRIAGE.md` — planned dedicated report.
- `14-ALIAS-MANUAL-REVIEW-PACK.md` — optional.
- `14-CURATION-MANUAL-REVIEW-PACK.md` — optional.

Specific known backlog facts locked by discussion:

- Official v2 review_queue total is 317.
- Official v2 review_queue has 284 `corpus_candidate_low_support` items.
- Official v2 review_queue has 33 `seed_corpus_conflict` items.
- Official v2 graph has 18 subfamilies, 13 edges and density about 0.085.
- v2 alias seed absent-target cases found during read-only audit are `ylang ylang -> ylang_ylang` and `petit grain -> petitgrain`.
- v2 relation/accord inputs contain 14 curated relations and 19 accords.

---

## Deferred Ideas

These are not authorized by context capture and usually belong to Phase 15+ or a dedicated future plan:

- Real review_queue reduction through promote/reject/defer.
- Descriptor promotion.
- Alias cleanup add/remap/remove.
- Relation/accord expansion or score tuning.
- Graph density expansion.
- Full CI/release pipeline.
- Official artifact publication/refresh.
- Graphify lifecycle final decision or regeneration.
- Broad docs sweep.

---

*Phase: 14-taxonomy-v2-1-backlog-triage-curation-planning*  
*Context gathered: 2026-05-26*
