# Phase 28 Research — Ambergri Alias Mutation

## Contexto
O Phase 27 adicionou `ambergris` como um target (seed) válido sob `amber_resinous / amber`. O objetivo desta Phase 28 é adicionar o mapeamento de alias `ambergri` → `ambergris`, validando a alteração e publicando a taxonomia v2.4.0.

## Verificação do Estado Atual
- **taxonomy-seed.v2.json**: `ambergris` existe sob `amber_resinous / amber`. `ambergri` não existe como seed.
- **descriptor_aliases.seed.json**: `ambergri` ainda não existe mapeado para `ambergris`.
- **Artifacts compilados (v2.3.0)**: `ambergri` aparece como candidate com frequência 46 e flag `review_required: true`. `ambergris` não aparece como curated pois os artifacts ainda não foram compilados com as mudanças da Phase 27.

## Invariantes de Pesquisa (Pre-flight)
- [x] INV-1: ambergris existe como seed em amber_resinous / amber.
- [x] INV-2: ambergri não existe como seed.
