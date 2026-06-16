---
phase: 60-contract-constants-validation-hardening
plan: 05
subsystem: graph-read-model
tags: [graph-id, query, cli, docs, typescript, vitest]
requires:
  - phase: 60-04
    provides: sanctioned validation wrapper and structural/profile split
provides:
  - builder/query migration to graph_id boundary
  - CLI migration to sanctioned validation wrapper
  - maintainer docs aligned to sanctioned v2.11 validation
affects: [graph-read-model, query, cli, docs]
tech-stack:
  added: []
  patterns: [central graph-id makers, sanctioned CLI boundary, scope-fenced query migration]
key-files:
  created: []
  modified:
    - src/graph_read_model/build_graph.ts
    - src/graph_read_model/query_graph.ts
    - src/cli/graph_read_model.ts
    - docs/olfactory_graph_read_model.md
key-decisions:
  - "A query manteve o envelope `{ query_kind, params, result, path }` sem antecipar fail-closed da Phase 61."
  - "A CLI sancionada agora valida pelo wrapper v2.11 nomeado, nao por superficie estrutural implicita."
patterns-established:
  - "Builder/query devem importar makers e stripping do boundary central de graph IDs."
  - "Mudancas de query nesta fase sao apenas de consumo de helpers, nao de semantica."
requirements-completed: [GCON-06, GVAL-06]
duration: 6min
completed: 2026-06-16
---

# Phase 60: Contract Constants & Validation Hardening Summary

**Builder, query, CLI e docs migrados para superficies centrais sem alterar o contrato das proofs**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-16T18:59:00Z
- **Completed:** 2026-06-16T19:05:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Removi helpers locais de graph ID em `build_graph.ts` e `query_graph.ts`, migrando para `graph_id.ts`.
- Corrigi a retomada exata do handoff em `query_graph.ts`, substituindo as referencias restantes por `makeSubfamilyGraphId` e `makeDescriptorGraphId`.
- Troquei a CLI e a documentacao para `validateSanctionedV211Graph`, mantendo o comportamento de build/validacao dentro do escopo da Phase 60.

## Task Commits

Wave retomada a partir de working tree parcialmente migrado; o fechamento foi consolidado no commit final da Phase 60.

## Files Created/Modified
- `src/graph_read_model/build_graph.ts` - makers centrais para `family`, `subfamily`, `descriptor` e `alias`.
- `src/graph_read_model/query_graph.ts` - makers centrais e `stripGraphIdPrefix`, sem alterar envelopes de sucesso.
- `src/cli/graph_read_model.ts` - wrapper sancionado no boundary de validacao da CLI.
- `docs/olfactory_graph_read_model.md` - workflow documentado com `validateSanctionedV211Graph` e `SANCTIONED_V2_11_GRAPH_VALIDATION_PROFILE`.

## Decisions Made
- O stripping de prefixo passou para `stripGraphIdPrefix` com fallback seguro para preservar a saida atual em IDs validos.
- Nenhuma mudanca foi feita em `GraphQueryProof` nem no shape `{ query_kind, params, result, path }`.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed (none)
**Impact on plan:** Nenhum impacto de escopo; o fence da Phase 61 foi preservado durante toda a migracao.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- A Wave 6 pode travar drift e compatibilidade por teste sem novas mudancas de producao.
- O caminho sancionado da CLI ja usa o wrapper esperado pelos baselines live.

## Verification
- `env TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/build_graph.test.ts tests/graph_read_model/query_graph.test.ts tests/cli/graph_read_model.test.ts`
- `npm --prefix src run typecheck`

## Self-Check: PASSED

---
*Phase: 60-contract-constants-validation-hardening*
*Completed: 2026-06-16*
