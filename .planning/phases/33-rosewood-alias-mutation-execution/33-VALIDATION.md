# Phase 33: Rosewood High-Confidence Alias Mutation Execution - Validation

## Matriz de Invariantes

| ID | Descrição | Status | Método de Verificação |
|---|---|---|---|
| INV-1 | `rosewood` existe como seed em `woody / woody_dry`. | PASS | Existe no JSON e integrado parse do 31-FINAL-APPROVAL.md nos testes (Phase 33-02). |
| INV-2 | `descriptor_aliases.seed.json` contém `boi_de_rose` → `rosewood` exatamente uma vez. | PASS | Chave adicionada ao JSON. |
| INV-3 | `descriptor_aliases.seed.json` contém `bois_de_rose` → `rosewood` exatamente uma vez. | PASS | Chave adicionada ao JSON. |
| INV-4 | `boi` permanece sem alias e em defer/manual_review. | PASS | Verificado. |
| INV-5 | `pau_rosa` permanece sem mutação. | PASS | Verificado. |
| INV-6 | `compile /tmp` remove `boi_de_rose` como candidate/review item. | PASS | `npm run compile` completado com sucesso. `boi_de_rose` não aparece na lista de candidatos. |
| INV-7 | `compiled v2` oficial só é publicado se `/tmp` PASS. | PASS | Testes passaram (373 testes em 53 arquivos) e build temporária finalizada com sucesso. |

## Relatório de Falha (Scope Expansion Trigger)
A execução falhou durante os testes (`npm test`), especificamente nas validações estruturais de curadoria:

1. **`tests/curation/alias_seed_v2.test.ts`**:
   - Falha: O contrato de curadoria v2 verifica se os aliases mapeados correspondem ao que está previamente aprovado no "Round 3 add_alias workbook blocks". Os novos aliases (`boi_de_rose` e `bois_de_rose`) não estão lá, logo o teste falha no comparativo de deep equal.

2. **`tests/curation/taxonomy_seed_v2.test.ts`**:
   - Falha: Reclama da ausência de uma entrada de aprovação no workbook para a semente `woody/woody_dry/rosewood` ("missing approved workbook entry for woody/woody_dry/rosewood").

De acordo com as regras de aprovação recebidas:
> *"Se aparecer necessidade de alterar normalizer, testes estruturais ou scripts, pare e trate como scope expansion antes de continuar."*

O pipeline foi pausado imediatamente na sub-fase 33-01.

## Atualização Phase 33-02 (Scope Expansion Resolvida)
Na Phase 33-02, a rastreabilidade estrutural dos testes foi atualizada:
- `taxonomy_seed_v2.test.ts` agora suporta `31-FINAL-APPROVAL.md`.
- `alias_seed_v2.test.ts` agora suporta `33-FINAL-APPROVAL.md`.

Todos os 373 testes em 53 arquivos passaram. 
Os status de bloqueio (INV-6 e INV-7) podem agora progredir conforme a execução original do 33-01 é retomada.
