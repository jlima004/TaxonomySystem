---
phase: 60-contract-constants-validation-hardening
plan: 03
subsystem: graph-read-model
tags: [validation-errors, json-safe, typescript, vitest]
requires:
  - phase: 60-02
    provides: graph_id boundary and central parse failures
provides:
  - typed validation error factory surface
  - JSON-safe proof coverage for representative validation payloads
affects: [graph-read-model, validator, cli, query]
tech-stack:
  added: []
  patterns: [named validation factories, contract-bound invariant mapping]
key-files:
  created:
    - src/graph_read_model/validation_errors.ts
  modified:
    - src/tests/graph_read_model/validate_graph.test.ts
key-decisions:
  - "Factories centralizam mensagens, invariantes e payloads sem migrar ainda os ramos do validator."
  - "JSON-safe validation payloads sao provados por teste antes da separacao estrutural/profile-aware."
patterns-established:
  - "Erros observaveis devem nascer de factories nomeadas, nao de strings ad-hoc."
  - "expected/actual devem ser serializaveis e livres de metadata de runtime."
requirements-completed: [GCON-05, GVAL-06]
duration: 6min
completed: 2026-06-16
---

# Phase 60: Contract Constants & Validation Hardening Summary

**Factories centrais de erro de validacao adicionadas com invariantes contract-bound e payloads JSON-safe verificados**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-16T18:48:40Z
- **Completed:** 2026-06-16T18:53:54Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Criei `validation_errors.ts` com a surface genérica e todas as factories nomeadas previstas no plano.
- Mantive o shape compatível de `GraphValidationError` e provei por teste a serialização dos payloads.
- Deixei a migração efetiva do validator para a Wave 4, preservando a ordem planejada.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add central typed validation error factory surface** - `5e7da65` (feat)
2. **Task 2: Prove JSON-safe payloads and compatibility shape** - `5e7da65` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `src/graph_read_model/validation_errors.ts` - Factories tipadas e mapping contrato→invariante.
- `src/tests/graph_read_model/validate_graph.test.ts` - Provas de shape, payload JSON-safe e compatibilidade.

## Decisions Made
- `makeGraphError` permaneceu como wrapper de compatibilidade, enquanto `validation_errors.ts` concentra a surface nomeada para as próximas waves.
- O teste valida JSON safety recursivamente e rejeita padrões de runtime como `Date`, `Map`, `Set`, `BigInt`, `undefined` e campos tipo stack.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed (none)
**Impact on plan:** Nenhum impacto de escopo; a wave preparou a migração do validator sem alterar ainda sua execução.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- A Wave 4 já pode separar validação estrutural, profile-aware e sancionada usando as factories centrais.
- O contrato da Wave 1 e o parser da Wave 2 já cobrem os dados auxiliares que a validação vai consumir.

## Verification
- `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/validate_graph.test.ts`
- `npm --prefix src run typecheck`

## Self-Check: PASSED

---
*Phase: 60-contract-constants-validation-hardening*
*Completed: 2026-06-16*
