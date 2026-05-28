# Phase 34: Pau Rosa Semantic Investigation - Closure

## Status Final
- **Status:** Complete / Closed
- **Readiness:** planning_only (não houve execução)

## Resumo das Descobertas
- O termo `pau_rosa` (com underline) está **ausente** no dataset atual (frequência 0).
- O termo `pau-rosa` (com hífen) também está **ausente** no dataset atual.

## Decisão e Disposition
- **Alias Preventivo Rejeitado:** A hipótese de criar antecipadamente o alias `pau_rosa → rosewood` foi rejeitada. Devido à polissemia de "pau-rosa" em português (que pode referir-se a várias madeiras além da *Aniba rosaeodora* usada na perfumaria), um mapeamento automático às cegas corre o risco de introduzir falsos positivos no futuro.
- **Disposition:** `defer / manual_review`.
- **Diretriz Futura:** Se o termo surgir no corpus em builds futuras, ele não deve ser mapeado automaticamente. Ele deve ser tratado com a flag `needs_review` para que a curadoria valide o contexto (se é nota de perfumaria ou menção botânica genérica) antes de aprová-lo como alias de `rosewood`.

## Invariantes e Constraints Respeitadas
- [x] Nenhuma mutação de dados foi executada em `data/taxonomy/` ou `data/inference/`.
- [x] Nenhum comando `compile` foi executado.
- [x] Nenhum comando `Graphify` foi executado (a working tree de graphify segue com dirty policy).
- [x] Nenhum artifact oficial (`data/compiled/`) foi publicado ou alterado.
- [x] Todos os `protected paths` permanecem inalterados e intactos.

## Próximos Passos
A transição desta fase pode ser concluída. A Phase 35 só será necessária para este contexto se o termo vier a aparecer no corpus e demandar a criação de uma `manual_review queue`, ou se uma frente maior de `low-support queue triage` for aberta. No momento, o ciclo sobre `pau_rosa` está finalizado.
