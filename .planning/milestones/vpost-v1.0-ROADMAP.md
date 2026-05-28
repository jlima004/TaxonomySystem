# Milestone Archive Template

# Milestone vpost-v1.0: Post-v1.0 Validation, Safety and Curation

**Status:** ✅ SHIPPED 2026-05-28
**Phases:** 13-37.1
**Total Plans:** 25+

## Overview

Stabilization of taxonomy seed v2, permanent safety guards implementation, microcuration expansion (Petitgrain, Cedarwood, Ambergris, Rosewood), conflict stopwords filter, and comprehensive Nyquist verification coverage.

## Phases

### Phase 13: Taxonomy v2 Post-Promotion Stabilization & Consumer Adoption

**Goal:** Validate and stabilize the project after the Phase 12 promotion of taxonomy seed v2 to default, ensuring consumers, docs, CLI behavior, explicit v1 fallback, versioned artifacts and graphify artifact policy are coherent before any future curation or expansion work.
**Requirements**: POST-01, POST-02, POST-03, POST-04, POST-05, POST-06, POST-07, POST-08
**Depends on:** Phase 12
**Status:** complete / closed
**Plans:** 4 plans

Initial context-gathering artifacts:

- [x] 13-DISCUSSION-LOG.md — Discussion log for post-promotion stabilization scope
- [x] 13-CONTEXT.md — Initial canonical context and boundaries
- [x] 13-PREFLIGHT.md — Non-executable preflight boundary for Phase 13

Plans:

- [x] Plan 1: Verify consumers and default v2 smoke test
- [x] Plan 2: Verify explicit v1 fallback
- [x] Plan 3: Docs consistency and graphify artifact policy
- [x] Plan 4: Phase 14 backlog boundary and closure



### Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning

**Goal:** Gather context and decide which post-Phase 13 backlog areas should be prioritized for a future Taxonomy v2.1 evolution, without executing curation or altering taxonomy data/artifacts.
**Requirements**: TRIAGE-01, TRIAGE-02, TRIAGE-03, TRIAGE-04, TRIAGE-05, TRIAGE-06, TRIAGE-07, TRIAGE-08, TRIAGE-09
**Depends on:** Phase 13
**Status:** complete / closed / read-only report-only
**Plans:** 3/3 report-only plans complete

Initial context-gathering artifacts:

- [x] 14-DISCUSSION-LOG.md — Initial discussion log and scope queue for v2.1 backlog triage
- [x] 14-PREFLIGHT.md — Non-executable preflight boundary for Phase 14 context gathering
- [x] 14-CONTEXT.md — Canonical context from BACKLOG-D-01 through BACKLOG-D-225
- [x] 14-RESEARCH.md — Read-only planning research and baseline metrics
- [x] 14-PATTERNS.md — Report-only patterns and protected-path gates
- [x] 14-VALIDATION.md — Validation contract and closure status

Report-only execution artifacts:

- [x] 14-01-PLAN.md — Full-backlog matrix plan
- [x] 14-02-PLAN.md — Review queue triage plan
- [x] 14-03-PLAN.md — Optional pack/shortlist gate plan
- [x] 14-BACKLOG-MATRIX.md — Full backlog matrix
- [x] 14-REVIEW-QUEUE-TRIAGE.md — Dedicated review queue triage
- [x] 14-DOCS-HELP-SHORTLIST.md — Non-authorizing docs/help shortlist
- [x] 14-SAFETY-AUTOMATION-SHORTLIST.md — Non-authorizing safety automation shortlist
- [x] 14-01-SUMMARY.md — Plan 14-01 summary
- [x] 14-02-SUMMARY.md — Plan 14-02 summary
- [x] 14-03-SUMMARY.md — Plan 14-03 summary
- [x] 14-CLOSURE.md — Phase 14 closure

Not created because not justified:

- [x] Alias manual-review pack absent by design.
- [x] Curation manual-review pack absent by design.



### Phase 15: Post-Triage Safety Guards & Current-State Docs Cleanup

**Goal:** Transform a small, safe subset of Phase 14 outputs into controlled post-v2-default execution planning, prioritizing non-mutating operational safety guards before any docs/help cleanup or taxonomy curation work.
**Requirements**: SAFETY-01, SAFETY-02, SAFETY-03, DOCS-01
**Depends on:** Phase 14
**Status:** complete / closed / local proof-only safety guard validation
**Plans:** 2/2 plans complete

Phase artifacts:

- [x] 15-DISCUSSION-LOG.md — Initial priority decision and scope boundary
- [x] 15-PREFLIGHT.md — Non-executable preflight boundary for Phase 15 context gathering
- [x] 15-CONTEXT.md — Canonical context for post-triage safety guard prioritization
- [x] 15-VALIDATION.md — Validation contract and final local proof-only closure state
- [x] 15-CLOSURE.md — Phase 15 final closure

Plans:
- [x] 15-01-PLAN.md — Protected diff and Graphify report_and_fail local proof
- [x] 15-02-PLAN.md — Graphify staged and protected paths staged local proof

Execution summaries:

- [x] 15-01-SUMMARY.md — Protected diff PASS; Graphify REPORT_AND_FAIL accepted_with_policy
- [x] 15-02-SUMMARY.md — Graphify staged PASS; protected paths staged PASS



### Phase 16: Permanent Safety Guard Implementation

**Goal:** Transform Phase 15 safety guard proof results into a small permanent non-mutating local guard implementation that protects staged Graphify and protected-path boundaries before any package wrapper, hook or CI integration.
**Requirements**: GUARD16-01, GUARD16-02, GUARD16-03, GUARD16-04
**Depends on:** Phase 15
**Status:** complete / closed / local script only
**Plans:** 1/1 plans complete

Phase artifacts:

- [x] 16-DISCUSSION-LOG.md — Initial implementation-format decision
- [x] 16-PREFLIGHT.md — Non-executable preflight boundary for context capture
- [x] 16-CONTEXT.md — Canonical context for local script-only safety guard implementation
- [x] 16-RESEARCH.md — Guard design research
- [x] 16-PATTERNS.md — Pattern map for Phase 16
- [x] 16-VALIDATION.md — Nyquist validation contract; status: complete
- [x] 16-CLOSURE.md — Phase 16 final closure

Plans:
- [x] 16-01-PLAN.md — Implement local non-mutating safety guard script with validation proof

Execution summaries:
- [x] 16-01-SUMMARY.md — Real repo PASS proof; /tmp failure simulations SIM 1–4 + BONUS all passed

## Phase 16 Status Note: Permanent Safety Guard Implementation

**Status**: complete / closed; local_script_only.

Phase 16 delivered `scripts/check-safety-guards.sh`, a permanent non-mutating bash script that
blocks staged `graphify-out/*` and staged/dirty protected-path changes at the staging boundary.
The script was implemented without altering any package scripts, Git hooks, CI, `src/package.json`,
protected data/seed/compiled paths, or `graphify-out/*` content.

Completed proof scope:

- Real-repo PASS for both `./scripts/check-safety-guards.sh` and `bash scripts/check-safety-guards.sh`.
- Non-mutation proof: `git status --short` before/after runs was identical.
- /tmp simulations: GRAPHIFY_STAGED, PROTECTED_PATH_STAGED, PROTECTED_DIFF, report_all multi-violation, dirty-working-tree-allowed BONUS.

Known policy state carried forward:

- Dirty `graphify-out/*` in working tree remains `accepted_with_policy`; not blocked by guard.
- No Graphify cleanup, revert, regeneration, staging, commit or remediation was performed.
- Any future package-script wrapper, hook, CI integration, or graphify remediation requires a new phase and separate explicit approval.



### Phase 37: Conflict Stopwords Filter Implementation

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 36
**Plans:** 1/1 plans complete

Plans:
- [x] TBD (run /gsd-plan-phase 37 to break down) (completed 2026-05-28)

---



### Phase 37.1: Close gap: post-v1.0 milestone verification manifests (INSERTED)

**Goal:** Generate VERIFICATION.md manifests retroactively for phases 13-37 based on existing validation evidence, without introducing new tests.
**Requirements**: TBD
**Depends on:** Phase 37
**Status:** complete / closed
**Plans:** 4/4 plans complete

Plans:
- [x] 37.1-01-PLAN.md — Generate VERIFICATION.md for phases 13-18 (completed 2026-05-28)
- [x] 37.1-02-PLAN.md — Generate VERIFICATION.md for phases 19-24 (completed 2026-05-28)
- [x] 37.1-03-PLAN.md — Generate VERIFICATION.md for phases 25-30 (completed 2026-05-28)
- [x] 37.1-04-PLAN.md — Generate VERIFICATION.md for phases 31-37 (completed 2026-05-28)



### Phase 17: Safety Guard Usability Wrapper

**Goal:** Transform the script `scripts/check-safety-guards.sh` into an easy-to-run package script wrapper without modifying hooks, CI, data, compiled artifacts or Graphify.
**Requirements**: WRAPPER17-01, WRAPPER17-02
**Depends on:** Phase 16
**Status:** ✅ Complete / Closed
**Plans:** 1 plan complete

Phase artifacts:

- [x] 17-DISCUSSION-LOG.md — Priority decision and scope boundary
- [x] 17-PREFLIGHT.md — Non-executable preflight boundary for context capture
- [x] 17-CONTEXT.md — Canonical context for safety guard usability wrapper
- [x] 17-01-PLAN.md — Usability Wrapper plan
- [x] 17-01-SUMMARY.md — Usability Wrapper execution summary
- [x] 17-VALIDATION.md — Usability Wrapper Nyquist validation contract
- [x] 17-CLOSURE.md — Phase 17 closure report

Plans:

- [x] 17-01: Usability Wrapper Implementation



### Phase 18: Phase 18 — Docs/Help Current-State Cleanup

**Goal**: Revisar e corrigir a documentação e ajuda que descreve o estado atual do projeto (README.md), integrando informações sobre v1.0.0, v2 default, o safety guard local e seu wrapper npm.
**Depends on**: Phase 17
**Requirements**: DOCS18-01, DOCS18-02, DOCS18-03
**Status**: ✅ Complete / Closed
**Plans**: 1 plan complete

Plans:

- [x] 18-01: Current-state docs/help audit and cleanup



### Phase 19: Taxonomy v2.1 Curation Planning

**Goal:** Planejamento de curadoria v2.1 com foco em alias cleanup e absent targets, produzindo documentos de análise e plano de execução sem executar curadoria ou mutação de dados.
**Requirements**: CUR21-01, CUR21-02
**Depends on:** Phase 18
**Status:** ✅ Complete / Closed / Planning only / Read-only report-only
**Plans:** 1/1 plan (planning_only — no executable curation performed)

Phase artifacts:

- [x] 19-PREFLIGHT.md — Non-executable preflight boundary
- [x] 19-CONTEXT.md — Canonical context and scope decisions
- [x] 19-DISCUSSION-LOG.md — Discussion log for curation planning
- [x] 19-RESEARCH.md — Alias analysis research and baseline data
- [x] 19-PATTERNS.md — Pattern map for alias cleanup planning
- [x] 19-VALIDATION.md — Nyquist validation contract
- [x] 19-CLOSURE.md — Phase 19 closure

Plans:

- [x] 19-01-PLAN.md — Alias cleanup and absent target curation plan (deferred to Phase 20+)

Analysis results:

- 11 aliases analisados
- 2 absent targets confirmados: ylang ylang → ylang_ylang, petit grain → petitgrain
- Disposition recomendada: accepted_exception interino (ylang ylang), forte candidato add_target futuro (petit grain)
- Execução real diferida para Phase 20+ com allowlist, approval persistido, rollback e validação

## Phase 19 Status Note: Taxonomy v2.1 Curation Planning

**Status**: complete / closed; planning_only / read_only_report_only.

Phase 19 completed curation planning for the v2.1 alias cleanup / absent targets priority. No curation, compilation, code change, data mutation, artifact refresh or Graphify update was performed.

Mutation audit:

- `descriptor_aliases.seed.json`: zero changes.
- `taxonomy-seed.v2.json`: zero changes.
- `data/compiled/v1/`: zero changes.
- `data/compiled/v2/`: zero changes.
- `data/inference/`: zero changes.
- `graphify-out/*`: zero changes.

Findings:

- 11 aliases analisados no `descriptor_aliases.seed.json`.
- 2 absent targets confirmados: `ylang ylang` → `ylang_ylang` e `petit grain` → `petitgrain`.
- Disposition recomendada: `ylang ylang` → `ylang_ylang` como accepted_exception interino (candidato a add_target futuro); `petit grain` → `petitgrain` como forte candidato a add_target futuro.
- Execução real deve ir para Phase 20 ou fase posterior, com allowlist, approval persistido, rollback e validação.



### Phase 20: Alias Target Microcuration Execution

**Goal:** Executar uma microcuradoria controlada baseada na Phase 19 para adicionar `petitgrain` como descriptor curado no seed v2 em `citrus` / `citrus_fresh`, preservando `ylang ylang -> ylang_ylang` como `accepted_exception` interino.
**Requirements:** CUR20-01, CUR20-02, CUR20-03, CUR20-04, CUR20-05, CUR20-06, CUR20-07
**Depends on:** Phase 19
**Status:** ✅ Complete / Closed / Petitgrain add_target only
**Plans:** 2/2 plans complete

Phase artifacts:

- [x] 20-PREFLIGHT.md — Non-executable preflight boundary for Phase 20 planning
- [x] 20-CONTEXT.md — Canonical context for petitgrain add_target-only planning
- [x] 20-DISCUSSION-LOG.md — Discussion log for approved planning scope
- [x] 20-RESEARCH.md — Option 1 microcuration research and validation architecture
- [x] 20-PATTERNS.md — Pattern map for approval, seed-only mutation, rollback and validation
- [x] 20-VALIDATION.md — Nyquist validation record and final results
- [x] 20-FINAL-APPROVAL.md — Persisted approval for `petitgrain` add_target only
- [x] 20-CLOSURE.md — Phase 20 closure

Plans:

- [x] 20-01-PLAN.md — Petitgrain add_target-only execution gate plan
- [x] 20-02-PLAN.md — Modern approval traceability fix

Execution summaries:

- [x] 20-01-SUMMARY.md — `petitgrain` add_target applied, rollback exercised, aliases preserved
- [x] 20-02-SUMMARY.md — Approval traceability resolved and targeted tests passed

Execution results:

- Added `petitgrain` as a curated seed v2 descriptor.
- Target family: `citrus`.
- Target subfamily: `citrus_fresh`.
- Kept `descriptor_aliases.seed.json` unchanged.
- Kept `ylang ylang -> ylang_ylang` as `accepted_exception_interim`.
- Resolved approval traceability by teaching `taxonomy_seed_v2.test.ts` to recognize `20-FINAL-APPROVAL.md`.
- Targeted tests passed: 6 files / 26 tests.
- Final safety guard returns expected `PROTECTED_DIFF` for `taxonomy-seed.v2.json` because the protected seed mutation was approved.

Hard boundaries:

- No new curation beyond the approved `petitgrain` add_target.
- Do not alter `data/taxonomy/descriptor_aliases.seed.json`; it was preserved unchanged.
- Do not add `ylang_ylang`; it remains `accepted_exception_interim`.
- Do not alter or publish `data/compiled/v1` or `data/compiled/v2`; both remained unchanged.
- Do not alter `data/inference`; it remained unchanged.
- Do not alter `src/cli/parse_args.ts`, `scripts/check-safety-guards.sh`, or `src/package.json`.
- Keep `graphify-out/*` outside Phase 20 scope and outside commit scope.
- Do not execute official compile, artifact refresh, Graphify, or additional curation as part of closure.



### Phase 21: v2.1 Compiled Artifact Publication Planning

**Goal:** Planejar a publicação segura dos artifacts compilados v2.1 após a microcuradoria `petitgrain`, validando primeiro um compile explícito em `/tmp` e permitindo publicação oficial em `data/compiled/v2` somente após gates e aprovação persistida.
**Requirements:** PUB21-01, PUB21-02, PUB21-03, PUB21-04, PUB21-05, PUB21-06
**Depends on:** Phase 20
**Status:** ✅ Complete / Closed
**Plans:** 2 plans executed

Phase artifacts:

- [x] 21-CONTEXT.md — Canonical context for tmp-first v2.1 artifact publication planning
- [x] 21-DISCUSSION-LOG.md — Discussion log for the initial publication decision
- [x] 21-TMP-COMPILE-VALIDATION.md — Plan 21-01 output
- [x] 21-FINAL-APPROVAL.md — Plan 21-02 gate
- [x] 21-CLOSURE.md — Phase 21 closure report

Plans:

- [x] 21-01-PLAN.md — Tmp compile validation
- [x] 21-02-PLAN.md — Official `data/compiled/v2` publication gated on Plan 21-01 PASS



### Phase 22: Review Queue Conflict Triage for v2.2

**Goal:** Triagem dos 34 conflitos seed_corpus do review queue, classificação semântica e determinação de prioridades para a curadoria v2.2.
**Depends on:** Phase 21
**Status:** ✅ Complete / Closed / planning_only / read_only_triage
**Plans:** 1 plan executed

Phase artifacts:
- [x] 22-PREFLIGHT.md — Non-executable preflight boundary
- [x] 22-CONTEXT.md — Canonical context and phase boundary
- [x] 22-DISCUSSION-LOG.md — Discussion log for conflict triage scope
- [x] 22-RESEARCH.md — Full conflict inventory and semantic analysis
- [x] 22-PATTERNS.md — Classification schema and decision patterns
- [x] 22-01-PLAN.md — Seed corpus conflict decision matrix
- [x] 22-VALIDATION.md — Validation contract with totals reconciliation
- [x] 22-CLOSURE.md — Phase 22 closure report

Plans:
- [x] 22-01-PLAN.md — Seed corpus conflict decision matrix



### Phase 23: v2.2 Microcuration Candidate Selection

**Goal:** Executar a microcuradoria controlada de `lemon_peel` como `add_target` em `citrus/citrus_fresh` com base nas decisões da Phase 22 e no precedente da Phase 20, validando os 7 invariantes definidos.
**Depends on:** Phase 22
**Status:** ✅ Complete / Closed
**Plans:** 1 plan executed

Phase artifacts:
- [x] 23-PREFLIGHT.md — Non-executable preflight boundary
- [x] 23-CONTEXT.md — Canonical context and phase boundary
- [x] 23-DISCUSSION-LOG.md — Discussion log for approved planning scope
- [x] 23-RESEARCH.md — Option 1 microcuration research and validation architecture
- [x] 23-PATTERNS.md — Pattern map for approval, seed-only mutation, rollback and validation
- [x] 23-VALIDATION.md — Validation record and final results
- [x] 23-01-PLAN.md — execution plan with allowlist, waves, persisted approval gate
- [x] 23-CLOSURE.md — Phase 23 closure report

Plans:
- [x] 23-01-PLAN.md — `lemon_peel add_target` execution plan



### Phase 24: v2.3 Alias Candidate Planning

**Goal:** Investigar `cedar → cedarwood` como alias candidate para v2.3: prova de equivalência semântica, design de invariantes de validação e plano formal de alias mutation — sem executar nenhuma mutação de dados, compile ou publicação de artefatos.
**Depends on:** Phase 23
**Status:** ✅ Complete / Closed / planning_only
**Plans:** 1 plan executed

Phase artifacts:
- [x] 24-PREFLIGHT.md — Non-executable preflight boundary
- [x] 24-CONTEXT.md — Canonical context and phase boundary
- [x] 24-DISCUSSION-LOG.md — Discussion log for alias candidate scope
- [x] 24-RESEARCH.md — Semantic evidence research for `cedar`
- [x] 24-PATTERNS.md — Alias mutation patterns and invariant design
- [x] 24-VALIDATION.md — Validation contract for future execution phase
- [x] 24-01-PLAN.md — Formal alias candidate planning document
- [x] 24-CLOSURE.md — Phase 24 closure report

Plans:
- [x] 24-01-PLAN.md — `cedar → cedarwood` alias candidate investigation plan



### Phase 25: Cedar Alias Mutation Execution

**Goal:** Implementar a mutação em `descriptor_aliases.seed.json` para `cedar → cedarwood`, validando primeiro em `/tmp` antes de ser publicada oficialmente como V2.3.
**Depends on:** Phase 24
**Status:** ✅ Complete / Closed
**Plans:** 1 plan executed



### Phase 26: Ambergri Alias Candidate

**Goal:** Investigar e planejar a viabilidade do alias candidate `ambergri → ambergris`.
**Depends on:** Phase 25
**Status:** ✅ Complete / Closed / pivot_planning_complete
**Plans:** 1 plan executed

Phase artifacts:
- [x] 26-PREFLIGHT.md — Non-executable preflight boundary
- [x] 26-CONTEXT.md — Canonical context and phase boundary
- [x] 26-DISCUSSION-LOG.md — Discussion log
- [x] 26-RESEARCH.md — Semantic evidence research
- [x] 26-PATTERNS.md — Alias mutation patterns
- [x] 26-VALIDATION.md — Validation contract
- [x] 26-01-PLAN.md — Pivot plan
- [x] 26-CLOSURE.md — Phase 26 closure report

Plans:
- [x] 26-01-PLAN.md — Pivot plan confirming target absence

Pivot results:
- Alias direto `ambergri → ambergris` está bloqueado (target ausente).
- Estratégia aprovada: `add_target ambergris` primeiro.
- Classificação aprovada: `family = amber_resinous`, `subfamily = amber`.
- Mutação deferida para Phase 27+.



### Phase 35: v2.5 Review Queue Rebaseline

**Goal:** Recalcular e inventariar o estado atual da review queue pós-v2.5.0 para decidir a próxima frente de trabalho com dados frescos, sem curadoria.
**Depends on:** Phase 34
**Status:** ✅ Complete / Closed / planning_only / read_only
**Plans:** 0/0 plans complete

Phase artifacts:
- [x] 35-PREFLIGHT.md — Scope e execution rules (read_only)
- [x] 35-CONTEXT.md — Inventário completo: 309 itens, tracking de conflitos resolvidos/novos, separação em Grupo A (noise) e Grupo B (microcuradoria)
- [x] 35-DISCUSSION-LOG.md — Priorização de 3 opções: Noise Pipeline (alto ROI, com guardrails), Low-Support Bulk Triage, Resíduos de Microcuradoria

Key findings:
- Review queue total: 309 (era 316 na Phase 22, queda líquida de 7)
- 278 `corpus_candidate_low_support` (cauda longa)
- 31 `seed_corpus_conflict` separados em:
  - **Grupo A** (13 tokens): noise/stopword artifacts (`sweet`, `fruit`, `berry`, `wood`, `peel`, `leaf`, `grain`, `raw`, `black`, `bitter`, `orange`, `apple`, `pine`)
  - **Grupo B** (18 itens): resíduos que merecem microcuradoria ou decisão explícita
- 4 conflitos resolvidos desde Phase 22 (`ambergri`, `cedar`, `boi_de_rose`, `lemon_peel`)
- 1 novo conflito introduzido (`peel` vs `lemon_peel`, noise artifact)

Hard boundaries:
- READ ONLY: Nenhuma curadoria, alteração em `data/taxonomy/*`, `data/compiled/*`, build, Graphify ou publication.



### Phase 36: Formal Noise/Stopword Policy for Substring Conflict Matching

**Goal:** Definir uma política formal e segura para tratar falsos positivos de `seed_corpus_conflict` causados por substring matching com tokens unigramas hipergenéricos, sem executar expurgo global e sem corromper semântica legítima da base.
**Depends on:** Phase 35
**Status:** ◆ Planning
**Plans:** 1/1 plans complete

Phase artifacts:
- [x] 36-PREFLIGHT.md — Scope e execution rules (policy_design)
- [x] 36-CONTEXT.md — Análise completa dos 13 tokens do Grupo A, mecanismo de conflito, classificação por risco
- [x] 36-POLICY-DRAFT.md — Política formal: critérios de inclusão, classificação, formato de config, guardrails, riscos
- [x] 36-DISCUSSION-LOG.md — Pesquisa do mecanismo, classificação, impacto projetado

Plans:
- [x] 36-01-PLAN.md — Substring Conflict Stopword Policy Definition

Key deliverables:
- 4 critérios cumulativos de inclusão definidos
- 13 tokens classificados: 5 safe_noise, 5 moderate_noise, 3 caution
- Schema JSON para `conflict_stopwords.v1.json` desenhado
- Impacto projetado: 14 de 31 conflitos eliminados (45%)
- Zero mutação de dados, código ou artefatos

Hard boundaries:
- POLICY DESIGN ONLY: Nenhuma mutação em data/taxonomy/*, data/compiled/*, data/inference/*, src/**/*.ts, graphify-out/*
- Nenhum build, compile ou teste executado
- Grupo B (18 itens) permanece fora do escopo


---

_For current project status, see .planning/ROADMAP.md_
