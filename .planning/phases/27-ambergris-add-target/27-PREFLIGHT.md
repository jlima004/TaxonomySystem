# Phase 27 Preflight

## Objetivo
Configurar a base para a adição de `ambergris` como um novo seed (add_target) na família `amber_resinous`, subfamília `amber`. Isso é pré-requisito para posteriormente mapear o alias `ambergri → ambergris` (decisão da Phase 26).

## Constraints
- **Execution Readiness:** `not_ready_for_execution` (Requer aprovação persistida antes de realizar mutações).
- Não alterar `descriptor_aliases.seed.json`.
- Não adicionar o alias `ambergri → ambergris` ainda.
- Não alterar `data/compiled/v2`.
- Não executar `compile`.
- Não rodar Graphify.
- Não commitar `graphify-out/*`.

## Dependências
- `data/taxonomy/taxonomy-seed.v2.json` (arquivo onde o seed será inserido)
