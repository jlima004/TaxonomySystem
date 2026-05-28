# Phase 34: Pau Rosa Semantic Investigation - Context

## Motivação
Na fase 32/33 (Rosewood Alias Mutation), identificamos que `pau_rosa` é uma tradução direta para o português de "rosewood". Devido ao potencial de ambiguidade semântica e polissemia em português (outras madeiras também chamadas de pau-rosa), e ao fato de não estar presente nas bases de dados v2 atuais, o termo foi deixado fora da release v2.5.0 aguardando uma investigação estruturada.

## Objetivo
Investigar se `pau_rosa` deve ser tratado futuramente como:
1. alias de `rosewood`;
2. descritor distinto;
3. termo regional ambíguo;
4. defer / manual_review.

## Status e Constraints
- **Status:** context_gathering, not_ready_for_execution, planning_only
- **Constraints Ativas:**
  - NÃO alterar `data/taxonomy/*`
  - NÃO alterar `descriptor_aliases.seed.json`
  - NÃO alterar `data/compiled/*`
  - NÃO executar `compile`
  - NÃO rodar `Graphify`
  - NÃO publicar artifacts

Esta fase produzirá apenas documentação para fundamentar a decisão arquitetural sobre `pau_rosa`.
