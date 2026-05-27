# Phase 28 — Summary

## Execução
A mutação do alias `ambergri` → `ambergris` foi concluída conforme o `28-01-PLAN.md`.

## Modificações Realizadas
- `data/taxonomy/descriptor_aliases.seed.json`: Adicionado o mapeamento `"ambergri": "ambergris"`.
- `src/normalizer/singularize.ts`: Adicionado `ambergris` à lista `NON_PLURAL_TERMINALS` para evitar que o normalizador truncasse o `'s'` final (um bug que transformava a semente novamente em `ambergri`).
- `src/tests/normalization/singularize.test.ts`: Adicionado caso de teste para `ambergris`.
- `src/tests/curation/alias_seed_v2.test.ts`: Adicionado `ambergri` à lista de aliases aprovados `existingApprovedAliases` para testes de contrato.

## Resultado da Compilação (v2.4.0)
- Taxonomy descriptors: 307
- Aliases mappings: 13
- Similarity edges: 13
- Quality Gates: PASS
