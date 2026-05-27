# Phase 27 Context

## Histórico
A Phase 26 investigou o candidato `ambergri` para mapeá-lo como alias de `ambergris`. O preflight detectou que `ambergris` não existe como um target válido na taxonomia atual (seed v2). O target deve existir na taxonomia antes de ser possível mapear aliases para ele.

- **Phase 26 Decisão (AMBERGRIS26-D-02):** A estratégia aprovada foi realizar `add_target` de `ambergris` primeiro.
- **Phase 26 Decisão (AMBERGRIS26-D-03):** A classificação aprovada para inserção é `family = amber_resinous`, `subfamily = amber`.

## Escopo da Phase 27
Adicionar `ambergris` oficialmente como seed descriptor no sistema, debaixo de `amber_resinous / amber`. Esta fase NÃO executará o mapeamento de alias de fato; ela visa unicamente a criação da âncora (seed) para preparar o terreno.

O status inicial da fase é `context_gathering` e `not_ready_for_execution`, requerendo aprovação persistida formal antes de passar ao planejamento e execução técnica.
