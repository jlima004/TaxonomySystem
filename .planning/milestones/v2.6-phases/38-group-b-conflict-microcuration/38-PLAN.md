# Phase 38: Group B Conflict Microcuration - Plan

## Objective
Triage and resolve the 18 remaining Group B `seed_corpus_conflict` items from Phase 35. This phase strictly executes in two waves to ensure safety, generating a decision matrix before applying any taxonomy mutation.

## Sequence

### Wave 1 — Decision Matrix Only
- listar os 18 conflitos;
- classificar cada um por tipo;
- registrar disposição explícita;
- separar safe mutations de deferred/manual_review;
- nenhum arquivo de taxonomia alterado ainda.

### Wave 2 — Safe Mutations Only
- aplicar apenas mutações classificadas como seguras;
- manter defer/manual_review intacto;
- rodar compile;
- validar métricas;
- gerar resumo de impacto.

## Rules
- Every one of the 18 Group B conflicts must have an explicit disposition before any mutation is applied.
- Any item with uncertainty or non-trivial semantic complexity must be deferred (`manual_review`) instead of risking an unsafe mutation.

## Acceptance Criteria
- `38-DECISION-MATRIX.md` criado com os 18 conflitos.
- Cada conflito contém: `descriptor`, `seed_conflict`, `conflict_type`, `proposed_disposition`, `mutation_allowed`, `rationale`, `expected_effect`.
- Nenhum arquivo de taxonomia/alias é alterado durante Wave 1.
- Wave 2 só aplica itens com `mutation_allowed=true`.
- Itens `defer/manual_review` permanecem documentados e não são mutados.
- Compile deve passar após Wave 2.
- `38-SUMMARY.md` deve registrar mutações aplicadas, itens deferidos e impacto na `review_queue`.

## Target Conflicts (18 items)
Para evitar que a execução avalie uma fila dinâmica ou processe `low_support` inadvertidamente, os únicos itens a serem curados nesta fase são:
- banana_peel
- banana_ripe_banana
- banana_unripe_banana
- clover
- grape
- grapefruit_peel
- lemongrass
- lily
- melon_rind
- melon_unripe_melon
- orange_bitter_orange
- rose_dried_rose
- rose_red_rose
- rose_tea_rose
- rosemary
- tomato
- watermelon
- watermelon_rind
