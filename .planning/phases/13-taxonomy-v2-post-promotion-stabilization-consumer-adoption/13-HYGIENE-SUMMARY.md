# Phase 13 Post-Promotion Hygiene Summary

This document summarizes the hygiene actions taken to finalize Phase 13 and synchronize the project state after the promotion of taxonomy seed v2 to default.

## Arquivos Alterados

- `.planning/STATE.md`: Atualizado para refletir Phase 13 `complete`, Phase 14 `backlog_only`, e v2 default `active/stable`.
- `.planning/ROADMAP.md`: Atualizado o status da Phase 13 para `closed/complete`, 4/4 planos. Registrada Phase 14 como backlog boundary.
- `.planning/REQUIREMENTS.md`: Requisitos POST-01 a POST-08 marcados como concluídos após estabilização validada.
- `.planning/phases/13-taxonomy-v2-post-promotion-stabilization-consumer-adoption/13-CLOSURE.md`: Atualizado para consolidar e confirmar que `STATE.md` e `ROADMAP.md` foram devidamente processados durante a higiene.
- `README.md`: Wording público atualizado de "Taxonomy Builder v1" para "Taxonomy Builder — v2 Default" para eliminar ambiguidades sobre o status de produção atual.
- `src/cli/compile.ts`: Wording do CLI help text ajustado de "Taxonomy Compiler v1" para "Taxonomy Compiler — v2 default".

## O que foi corrigido

1. Sincronização do status GSD em relação à finalização da Phase 13, limpando as antigas referências `context_gathering` ou `not_ready_for_execution`.
2. O texto oficial tanto no README quanto na saída do CLI reflete formalmente a promoção do v2 para default, preservando a claridade de que a infraestrutura v1 permanece intocada como baseline.
3. Criação de `13-GRAPHIFY-POLICY.md` contendo a política mandatória sobre os artefatos em `graphify-out/*`.

## Resultado do Protected Diff

A verificação de integridade dos paths protegidos (sementes taxonômicas v1/v2, artefatos compilados, parse_args.ts e mapeamentos de relações/aliases) concluiu com sucesso (`exit code 0`). Nenhuma mutação de curadoria foi realizada.

## Testes Executados

Como houve alteração de texto em `src/cli/compile.ts`, foi executado o build/typecheck seguido da bateria de testes correspondente à CLI:
```bash
npm run typecheck && npm test -- tests/cli/parse_args.test.ts tests/cli/compile.test.ts
```
**Resultado:** Todos os testes (`parse_args` e `compile`) rodaram e passaram com sucesso (17 testes ao todo), garantindo que a alteração de string não corrompeu o funcionamento da interface.

## Confirmações de Restrição

- **Graphify:** Confirma-se que os arquivos em `graphify-out/*` permanecem sujos ("dirty") apenas localmente e NÃO foram stagados nem commitados, honrando a política descrita.
- **Phase 14:** Confirma-se que nenhuma curadoria da Phase 14 ou qualquer alteração estrutural de dados da taxonomia foi executada. O status de Phase 14 permanece restrito a `backlog_only`.
