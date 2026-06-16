---
phase: 60-contract-constants-validation-hardening
plan: 04
subsystem: graph-read-model
tags: [validation, sanctioned-profile, graph-id, typescript, vitest]
requires:
  - phase: 60-03
    provides: validation factories and JSON-safe payload coverage
provides:
  - structural validation entrypoint
  - profile-aware validation wrapper
  - sanctioned v2.11 validation wrapper
affects: [graph-read-model, validator, cli]
tech-stack:
  added: []
  patterns: [named validation factories, structural-vs-profile split, sanctioned wrapper]
key-files:
  created: []
  modified:
    - src/graph_read_model/types.ts
    - src/graph_read_model/validate_graph.ts
    - src/tests/graph_read_model/validate_graph.test.ts
key-decisions:
  - "A validacao estrutural virou entrypoint de primeira classe e o alias compatível foi preservado."
  - "Falhas de profile so rodam depois da estrutura passar, evitando ruído sobre grafos invalidos."
patterns-established:
  - "Graph IDs devem ser validados pelo boundary central antes de qualquer comparacao de kinds/endpoints."
  - "O baseline sancionado v2.11 deve ser acessado via wrapper nomeado, nao por flags locais."
requirements-completed: [GCON-05, GCON-06, GVAL-06]
duration: 8min
completed: 2026-06-16
---

# Phase 60: Contract Constants & Validation Hardening Summary

**Validacao estrutural/profile-aware/sancionada separada com graph IDs centralizados e falhas deterministicas**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-16T18:51:00Z
- **Completed:** 2026-06-16T18:59:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Separei `validateOlfactoryGraphStructure`, `validateOlfactoryGraphAgainstProfile` e `validateSanctionedV211Graph`, mantendo `validateOlfactoryGraph` como alias de compatibilidade.
- Migrei a validacao para factories nomeadas e reuso de `parseGraphId`/type guards do boundary central.
- Provei em teste as falhas de graph ID, o short-circuit estrutural e o baseline mismatch sancionado.

## Task Commits

Wave retomada a partir de working tree ja verde; o fechamento foi consolidado no commit final da Phase 60, sem retroinventar commits por task.

## Files Created/Modified
- `src/graph_read_model/types.ts` - `GraphValidationProfile.expected_stats` alinhado ao shape de `GraphStats`.
- `src/graph_read_model/validate_graph.ts` - split estrutural/profile-aware/sancionado e reuso do boundary de graph IDs.
- `src/tests/graph_read_model/validate_graph.test.ts` - cobrindo D-04, D-09, D-10, D-11, D-12 e D-13.

## Decisions Made
- O validator estrutural nao compara baseline sancionado; esse passo ficou restrito ao wrapper profile-aware.
- Erros observaveis seguem vindo de factories e preservam payloads JSON-safe.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed (none)
**Impact on plan:** Nenhum impacto de escopo; a separacao de superficies manteve Phase 61 fora desta wave.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- A Wave 5 pode consumir o wrapper sancionado e os helpers centrais sem precisar duplicar prefixes ou regras locais.
- O baseline protegido `10/18/341/18/13` segue acessivel via profile nomeado.

## Verification
- `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts`
- `npm --prefix src run typecheck`

## Self-Check: PASSED

---
*Phase: 60-contract-constants-validation-hardening*
*Completed: 2026-06-16*
