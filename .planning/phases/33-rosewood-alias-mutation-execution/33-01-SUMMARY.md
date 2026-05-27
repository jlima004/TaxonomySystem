# Phase 33-01 — Rosewood Alias Mutation Execution: Summary

## Resumo
A execução primária da mutação dos aliases de `rosewood` foi concluída. Os termos `boi_de_rose` e `bois_de_rose` foram oficialmente mapeados para o descritor raiz `rosewood`. A compilação foi executada em ambiente temporário (`/tmp`) e os artefatos foram publicados oficialmente após a validação bem-sucedida das invariantes e integração dos novos critérios de testes estruturais criados durante a fase 33-02 (Scope Expansion).

## Alterações Realizadas
- `data/curation/v2/descriptor_aliases.seed.json`: Adicionadas chaves de mapeamento:
  - `boi_de_rose` → `rosewood`
  - `bois_de_rose` → `rosewood`
- Artefatos compilados na versão 2.5.0 (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`) foram gerados na pasta `/tmp`, inspecionados para validar ausência de `boi_de_rose` na lista de candidatos e publicados oficialmente em `data/compiled/v2/`.

## Restrições Mantidas
- **Nenhuma alteração nos Workbooks originais** do "Round 3".
- **Sem mapeamento de `boi` ou `pau_rosa`** para manter segurança semântica (defer/manual review).
- **Sem mutação** em `taxonomy-seed.v2.json`.

## Validação
As Invariantes INV-6 e INV-7 foram validadas com sucesso (status `PASS` em `33-VALIDATION.md`). A bateria completa de testes passou sem erros após a correção introduzida pela fase 33-02, permitindo o avanço ao encerramento formal da fase 33.
