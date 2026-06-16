---
phase: 60-contract-constants-validation-hardening
plan: 01
subsystem: graph-read-model
tags: [contract, validation, typescript, vitest]
requires: []
provides:
  - authoritative validation vocabularies and sanctioned v2.11 profile in contract.ts
  - JSON-safe validation payload types in types.ts
affects: [graph-read-model, validator, query, cli]
tech-stack:
  added: []
  patterns: [static contract literals, typed JSON-safe validation payloads]
key-files:
  created: []
  modified:
    - src/graph_read_model/contract.ts
    - src/graph_read_model/types.ts
    - src/tests/graph_read_model/contract.test.ts
key-decisions:
  - "Mantido contract.ts como modulo import-free e fonte autoritativa para codigos, invariantes e profile sancionado."
  - "GraphValidationError recebeu campos tipados JSON-safe sem quebrar makeGraphError nem o shape base existente."
patterns-established:
  - "Contratos observaveis ficam em arrays/objetos as const com union types derivados."
  - "Payloads expected/actual usam JsonValue explicito em vez de unknown."
requirements-completed: [GCON-05, GVAL-06]
duration: 6min
completed: 2026-06-16
---

# Phase 60: Contract Constants & Validation Hardening Summary

**Contrato autoritativo de validacao e profile sancionado v2.11 centralizados com payloads de erro JSON-safe tipados**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-16T18:37:00Z
- **Completed:** 2026-06-16T18:43:44Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Centralizei o vocabulário autoritativo de erros, invariantes, parse de graph IDs e profiles de validação em `contract.ts`.
- Tipifiquei `GraphValidationError` com `invariant_id`, `expected` e `actual` JSON-safe sem quebrar o helper `makeGraphError`.
- Travei por teste o profile sancionado v2.11 e a superfície tipada necessária para as waves seguintes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Lock authoritative validation vocabularies and sanctioned profile** - `8ffb1f4` (feat)
2. **Task 2: Extend validation types for JSON-safe deterministic payloads** - `8ffb1f4` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `src/graph_read_model/contract.ts` - Exporta códigos, invariantes, parse codes e `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`.
- `src/graph_read_model/types.ts` - Introduz `JsonValue`, `GraphValidationProfile` e payloads tipados para erros.
- `src/tests/graph_read_model/contract.test.ts` - Trava o novo contrato e a compatibilidade estrutural do helper de erro.

## Decisions Made
- Mantive o mapeamento código→invariante opcional e estável em `contract.ts`, sem importar lógica de runtime.
- Preservei o shape base `{ code, path, message, node_id?, edge_id? }` e apenas o enriqueci com campos opcionais tipados.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed (none)
**Impact on plan:** Nenhum impacto de escopo; a wave preparou o boundary compartilhado sem antecipar comportamento de consumo da Phase 61.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `graph_id.ts` pode nascer consumindo apenas constantes e tipos centrais já estabilizados.
- O validator atual ainda usa literais locais; a migração começa nas próximas waves.

## Verification
- `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/contract.test.ts`
- `npm --prefix src run typecheck`

## Self-Check: PASSED

---
*Phase: 60-contract-constants-validation-hardening*
*Completed: 2026-06-16*
