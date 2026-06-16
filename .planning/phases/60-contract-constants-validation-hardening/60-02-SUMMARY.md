---
phase: 60-contract-constants-validation-hardening
plan: 02
subsystem: graph-read-model
tags: [graph-id, parsing, typescript, vitest]
requires:
  - phase: 60-01
    provides: validation contract constants and JsonValue payload types
provides:
  - central graph_id boundary with makers, guards, strip helper and parseGraphId
affects: [graph-read-model, builder, query, validator]
tech-stack:
  added: []
  patterns: [authoritative-prefix parsing, deterministic readonly parse results]
key-files:
  created:
    - src/graph_read_model/graph_id.ts
    - src/tests/graph_read_model/graph_id.test.ts
  modified: []
key-decisions:
  - "parseGraphId falha com objetos JSON-safe e nunca com throws genericos."
  - "Guards e strip helper reutilizam o mesmo parser central para evitar drift."
patterns-established:
  - "Toda identificacao de graph IDs deve passar por graph_id.ts."
  - "Tokens ambiguos de prefixo sao tratados como formato invalido tipado."
requirements-completed: [GCON-05, GCON-06, GVAL-06]
duration: 5min
completed: 2026-06-16
---

# Phase 60: Contract Constants & Validation Hardening Summary

**Boundary central de graph IDs criado com parsing deterministico, guards stricts e falhas JSON-safe**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-16T18:44:00Z
- **Completed:** 2026-06-16T18:48:32Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Criei `graph_id.ts` com makers, guards, `stripGraphIdPrefix` e `parseGraphId`.
- Reusei apenas os prefixes e códigos de parse vindos do contrato central.
- Travei por teste os cenários válidos, prefixo desconhecido, raw ID vazio e formato ambíguo.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add graph_id makers, guards and strip helper** - `a58c666` (feat)
2. **Task 2: Add deterministic parseGraphId union and JSON-safe failures** - `a58c666` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `src/graph_read_model/graph_id.ts` - Surface oficial de construção, parsing e stripping de graph IDs.
- `src/tests/graph_read_model/graph_id.test.ts` - Provas de sucesso e falha tipada cobrindo D-01 a D-04.

## Decisions Made
- `stripGraphIdPrefix` retorna `null` para IDs inválidos em vez de tentar corrigir entrada malformada.
- O parse trata prefixos embutidos no raw ID como `ambiguous_graph_id_format`, preparando a cerca para consumidores futuros sem implementar fail-closed da Phase 61.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed (none)
**Impact on plan:** Sem scope creep; a wave introduziu só o boundary de IDs requerido para migrações posteriores.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- As próximas waves já podem trocar strings/regex locais por `graph_id.ts`.
- O validator agora pode consumir factories centrais sem reinventar payloads.

## Verification
- `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/graph_id.test.ts`
- `npm --prefix src run typecheck`

## Self-Check: PASSED

---
*Phase: 60-contract-constants-validation-hardening*
*Completed: 2026-06-16*
