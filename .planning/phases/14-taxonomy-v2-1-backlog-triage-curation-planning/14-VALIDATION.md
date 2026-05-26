---
phase: 14
slug: taxonomy-v2-1-backlog-triage-curation-planning
status: complete_closed
nyquist_compliant: true
wave_0_complete: true
execution_readiness: closed_read_only_report_only_complete
approval: approved_for_read_only_report_only_execution
created: 2026-05-26
closed: 2026-05-26
execution_type: read_only_report_only
---

# Phase 14 - Validation Strategy

> Phase 14 is closed as read-only/report-only execution of `14-01` through `14-03`. It does **not** authorize curation, taxonomy/input mutation, official compiled artifact mutation, `DEFAULT_PATHS` mutation, `graphify-out/*` mutation, descriptor promotion, alias add/remove/remap, relation/accord edits, Graphify regeneration, docs/help fixes, or safety automation implementation.

## Test Infrastructure

| Property | Value |
|---|---|
| **Framework** | Vitest `^3.2.0` plus markdown/source assertions and read-only Node JSON inspection |
| **Config file** | `src/package.json` scripts only; no new dependencies |
| **Quick validation command** | `test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts && git status --short -- graphify-out` |
| **Full validation command** | `node -e "const fs=require('fs'); const sim=JSON.parse(fs.readFileSync('data/compiled/v2/similarity_matrix.json','utf8')); const by=sim.review_queue.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{}); if(sim.review_queue.length!==317||by.corpus_candidate_low_support!==284||by.seed_corpus_conflict!==33) process.exit(1); console.log('review_queue_ok')" && test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "candidate_for_phase_14" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "blocker_if_unresolved" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "seed_corpus_conflict" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts && git status --short -- graphify-out` |
| **Protected diff command** | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts` |
| **Graphify hygiene command** | `git status --short -- graphify-out && git diff --name-only -- graphify-out` |
| **Feedback latency** | Under 60 seconds for markdown/source assertions and read-only JSON checks |

Future compile/smoke commands, if a later plan needs them, must write only to `/tmp/opencode/taxonomy-phase14-smoke/...` and use `--generated-at 2026-01-01T00:00:00.000Z`. They are not mandatory for `14-01` or `14-02`.

## Sampling Rate

- **After each task:** run the relevant markdown/source assertion and the protected diff command.
- **After each wave:** run graphify hygiene and protected diff checks.
- **Before final summary:** confirm only Phase 14 report/planning artifacts and their summaries changed; protected data/artifact/default/Graphify paths remain unmodified.
- **Max feedback latency:** 60 seconds.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|---:|---:|---|---|---|---|---|---|---|
| 14-01-01 | 14-01 | 1 | TRIAGE-01..TRIAGE-09 | T-14-01-matrix-scope | Full backlog matrix covers all required fields/sections and remains report-only | markdown/source assertion | `test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "protected_paths_touched" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "review_queue" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "CI/release safety automation" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` | yes | complete |
| 14-01-02 | 14-01 | 1 | TRIAGE-01, TRIAGE-03, TRIAGE-04, TRIAGE-06 | T-14-01-baseline-facts | Known v2 facts are recorded without mutating official artifacts | read-only Node + markdown assertion | `node -e "const fs=require('fs'); const sim=JSON.parse(fs.readFileSync('data/compiled/v2/similarity_matrix.json','utf8')); const by=sim.review_queue.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{}); if(sim.review_queue.length!==317||by.corpus_candidate_low_support!==284||by.seed_corpus_conflict!==33) process.exit(1); console.log('review_queue_ok')" && grep -q "ylang ylang" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md && grep -q "petit grain" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-BACKLOG-MATRIX.md` | yes | complete |
| 14-02-01 | 14-02 | 2 | TRIAGE-01 | T-14-02-queue-autopromotion | Review queue report groups before sampling and explicitly forbids line-by-line-first classification and mutation | markdown/read-only JSON assertion | `test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "Summary metrics" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "Full line-by-line classification of all 317 items is not required" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md` | yes | complete |
| 14-02-02 | 14-02 | 2 | TRIAGE-01, TRIAGE-05 | T-14-02-sampling | Traceable sample rows cover both queue types and recommendations remain non-authorizing | markdown assertion | `grep -q "Traceable sample rows" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "corpus_candidate_low_support" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "seed_corpus_conflict" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md && grep -q "no promotion" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-REVIEW-QUEUE-TRIAGE.md` | yes | complete |
| 14-03-01 | 14-03 | 3 | TRIAGE-03, TRIAGE-05, TRIAGE-07, TRIAGE-09 | T-14-03-empty-artifacts | Optional packs/shortlists are created only when justified by matrix/report gates | source/doc assertion | `test -f .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-03-SUMMARY.md && grep -Eq "No optional artifacts justified|Optional artifacts created" .planning/phases/14-taxonomy-v2-1-backlog-triage-curation-planning/14-03-SUMMARY.md` | summary yes | complete |
| 14-ALL-01 | all | 3 | TRIAGE-01..TRIAGE-09 | T-14-ALL-protected-boundary | No protected taxonomy/input/artifact/default/Graphify mutation occurs | protected diff + hygiene | `git diff --exit-code -- data/taxonomy data/inference data/compiled/v1 data/compiled/v2 src/cli/parse_args.ts && git status --short -- graphify-out` | n/a | complete with preexisting dirty graphify-out noted |

## Wave 0 Requirements

- [x] `14-CONTEXT.md` exists and records `BACKLOG-D-01` through `BACKLOG-D-225`.
- [x] `14-RESEARCH.md` exists and records read-only baseline metrics and safe command shapes.
- [x] `14-PATTERNS.md` exists and maps report-only patterns and protected-path gates.
- [x] `14-VALIDATION.md` exists and approves only read-only/report-only execution of `14-01` through `14-03`.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Optional-pack justification | TRIAGE-03, TRIAGE-05, TRIAGE-07, TRIAGE-09 | Whether an optional pack/shortlist is worth human attention cannot be proven solely by file existence | Review `14-BACKLOG-MATRIX.md`, `14-REVIEW-QUEUE-TRIAGE.md`, and `14-03-SUMMARY.md`; approve only if each optional artifact has a source row, gate rationale and non-authorization language. |
| Final approval before future curation/mutation | TRIAGE-01..TRIAGE-09 | Phase 14 report-only outputs do not authorize data/artifact/default/Graphify mutation | Before any future curation/mutation phase, verify a separate persisted approval, explicit file allowlist, validation gates and rollback/restore policy exist. |

## Validation Sign-Off

- [x] Validation scope is read-only/report-only for `14-01` through `14-03`.
- [x] Nyquist-compliant automated checks exist for every planned report artifact.
- [x] Protected diff checks cover `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`.
- [x] Graphify hygiene check is included and does not authorize `graphify-out/*` mutation.
- [x] Optional artifacts require justification and may be absent.
- [x] Final human approval remains required before any future curation/mutation.
- [x] `14-01`, `14-02` and `14-03` completed as read-only/report-only execution.
- [x] Created artifacts are limited to Phase 14 reports, shortlists and summaries.
- [x] Alias manual-review pack was not created because it was not justified.
- [x] Curation manual-review pack was not created because it was not justified.
- [x] Phase 15+ receives any real execution backlog.

## Closure Verification

- Protected diff clean for `data/taxonomy`, `data/inference`, `data/compiled/v1`, `data/compiled/v2` and `src/cli/parse_args.ts`.
- `graphify-out/*` remains outside Phase 14 scope and must remain unstaged/uncommitted by closure hygiene.
- No curation, compile/smoke, safety automation implementation or docs/help fixes were executed as part of closure.

**Approval:** closed_read_only_report_only_complete
