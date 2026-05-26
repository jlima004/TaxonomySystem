# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Discussion Log

> **Audit trail only.** Do not use as the sole input to planning, research, or execution agents.
> Decisions are captured in `14-CONTEXT.md`.

**Date:** 2026-05-26  
**Phase:** 14-taxonomy-v2-1-backlog-triage-curation-planning  
**Status:** context_captured  
**Execution readiness:** not_ready_for_execution  
**Decision IDs:** `BACKLOG-D-01` through `BACKLOG-D-225`  
**Areas discussed:** Boundary & Priority Model, Review queue reduction, Soft findings disposition / cleanup, Alias cleanup, Graph density / graph coverage, Future curation candidates / descriptor promotions, Relations/accords quality, Docs/help cleanup, Graphify / generated artifact lifecycle policy, CI/release automation

---

## Boundary & Priority Model

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Phase 14 boundary | Triage-first | One slice, broad cleanup, planning-only, technical stabilization |
| Post-triage execution | Execute one small front only after context/research/patterns/validation/plan/approval | Strategy-only, technical-only |
| Priority model | Risk-first | Impact-first, balanced score, agent discretion |
| Main triage output | `14-BACKLOG-MATRIX.md` | Execution shortlist, policy document, agent discretion |

**Notes:** User explicitly selected triage-first, risk-first. Phase 14 may later execute one small controlled front, but not until `14-CONTEXT.md`, `14-RESEARCH.md`, `14-PATTERNS.md`, `14-VALIDATION.md`, a specific plan and required approvals exist. Broad cleanup is prohibited.

---

## Review Queue Reduction

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Review queue objective | Actionability-first | Count reduction, conflict-first, low-support-first |
| Output | Dedicated `14-REVIEW-QUEUE-TRIAGE.md` report | Matrix-only section, metrics only, agent discretion |
| Validation | Metrics consistency, traceable groupings and representative samples | Full classification, metric thresholds, curator review only |
| Execution posture | Report-only-first | Manual-review pack only, small curation fix, agent discretion |

**Notes:** Official v2 review queue baseline is 317 items: 284 `corpus_candidate_low_support`, 33 `seed_corpus_conflict`, all `medium`. The report may create shortlist/review packs but no mutation by default.

---

## Soft Findings Disposition / Cleanup

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| General rule | Re-disposition | Cleanup drive, policy-only, blocker review |
| Output | Matrix section | Dedicated report, inline context only, agent discretion |
| Initial mapping | Conservative map | Aggressive cleanup, all defer, no pre-map |
| Blocker escalation | Integrity-only | User-visible quality, repeated finding, never in Phase 14 |

**Notes:** Prior accepted soft findings do not automatically become blockers and do not remain accepted without updated rationale. `blocker_if_unresolved` is limited to integrity, artifact/default safety, rollback, schema, determinism or future validation risk.

---

## Alias Cleanup

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Alias triage scope | All absent targets | Ylang only, all aliases, policy only |
| Analysis order | Evidence-first | Add target first, remap first, remove first |
| Output | Matrix plus optional manual-review pack | Dedicated alias report, matrix only, agent discretion |
| Validation | Target integrity gate | Compile only, curator approval only, no Phase 14 execution |

**Notes:** Read-only audit found absent targets `ylang ylang -> ylang_ylang` and `petit grain -> petitgrain`. No add/remap/remove is authorized without persisted approval and target integrity validation.

---

## Graph Density / Graph Coverage

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Graph quality policy | Coverage-first | Density target, confidence audit, defer graph work |
| Output | Matrix section | Dedicated graph report, validation-only, agent discretion |
| Validation | Graph gates | Compile only, curator only, no graph changes |
| Phase 14 execution | Exception only | Yes if clear, no Phase 14, agent discretion |

**Notes:** Official v2 graph has 18 subfamilies, 13 edges and density about 0.085. Low density remains accepted with policy while there are no isolated subfamilies and gaps have rationale. No artificial edges for density.

---

## Future Curation Candidates / Descriptor Promotions

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Phase 14 role | Candidate inventory | Pick one slice, defer all, promote quick wins |
| Candidate priority | Existing endpoint fit | High corpus frequency, soft-finding linked, all equal |
| Output | Optional pack | Dedicated pack, matrix only, agent discretion |
| Validation | Curation gates | Compile only, approval only, no Phase 14 gates |

**Notes:** Phase 14 inventories and classifies candidates, prioritizing candidates that fit existing family/subfamily endpoints. Promotions default to Phase 15+ and require persisted approval, source evidence, seed diff allowlist, before/after `/tmp` compiles and dependency review.

---

## Relations / Accords Quality

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Priority | Audit quality | Gap expansion, score tuning, defer all |
| Output | Matrix section | Dedicated audit, Graph section, agent discretion |
| Gap classification | `needs_more_evidence` by default when rationale/evidence absent | Defer all, candidate fix, not actionable |
| Validation | Sampled gates | Full manual audit, compile pass, curator review |

**Notes:** v2 inputs have 14 relations and 19 accords. Audit should check endpoint validity, score validity, rationale/evidence and gaps. No expansion or tuning by default.

---

## Docs / Help Cleanup

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Treatment | Low-risk candidate | Defer maintenance, broad docs sweep, only blockers |
| Output | Matrix shortlist | Docs audit report, direct fixes, agent discretion |
| Historic/current distinction | Current-state rule | Any outdated text, README/help only, agent discretion |
| Validation | Docs gates | Review only, tests only, no Phase 14 execution |

**Notes:** Small current-state docs/help cleanup may be a Phase 14 candidate. Historical docs that accurately record prior states remain preserved. Help text code changes require relevant CLI tests.

---

## Graphify / Generated Artifact Lifecycle Policy

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Policy | Protected by default | Regenerate now, ignore Graphify, local-only policy |
| Lifecycle decision | Backlog first | Decide now, Phase 14 policy, defer entirely |
| Official artifact outputs | `/tmp` only for validation | Refresh if needed, read-only only, agent discretion |
| Validation | Artifact gates | Diff review, regenerate compare, no future plans |

**Notes:** `graphify-out/*` remains protected/plan-gated and supplemental only. Official `data/compiled/v1` and `data/compiled/v2` are read-protected. Any generated artifact plan needs allowlist, command/input record, diff policy, separate commit and rollback.

---

## CI / Release Process Automation

| Decision Point | Selected | Alternatives Considered |
|---|---|---|
| Automation scope | Safety automation | Full CI pipeline, defer automation, release gates only |
| Output | Matrix shortlist | CI plan doc, validation spec, agent discretion |
| Strongest candidates | Protected guards | Data quality guards, docs guards, no execution |
| Validation | Local proof | Tests only, manual only, no Phase 14 execution |

**Notes:** Strongest candidates are protected diff, tmp-only compile guard, Graphify staging guard, `DEFAULT_PATHS` v2 assertion and explicit v1 fallback assertion. Full CI/release pipeline and artifact publication automation defer to Phase 15+ or release engineering.

---

## Agent Discretion

No implementation discretion was delegated. Researcher/planner may refine dispositions only with traceable evidence and must preserve the protected-path and approval boundaries captured in `14-CONTEXT.md`.

## Deferred Ideas

- Real review_queue reduction.
- Descriptor promotion.
- Alias cleanup mutation.
- Relation/accord expansion or score tuning.
- Graph density expansion.
- Full CI/release pipeline.
- Official artifact refresh/publication.
- Graphify lifecycle final decision or regeneration.
- Broad docs sweep.
