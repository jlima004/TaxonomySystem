# Phase 30 — Boi de Rose Manual Review Pack : Preflight

## Status
- **Current State:** context_gathering
- **Execution State:** not_ready_for_execution
- **Mode:** planning_only

## Objective
Investigar semanticamente `boi_de_rose` para decidir se ele é:
1. erro/variante de `bois_de_rose`;
2. candidato a alias;
3. candidato a descriptor próprio;
4. corpus artifact;
5. defer/manual_review.

## Constraints
- NÃO alterar `data/taxonomy/*`
- NÃO alterar `data/compiled/*`
- NÃO alterar `data/inference/*`
- NÃO executar `compile`
- NÃO executar `Graphify`
- NÃO publicar artifacts
- NÃO commitar `graphify-out/*`

## Mandatory Base Documents
- `.planning/phases/22-review-queue-conflict-triage-v2-2/22-CLOSURE.md`
- `.planning/phases/22-review-queue-conflict-triage-v2-2/22-01-PLAN.md`
- `.planning/phases/29-clover-clove-semantic-investigation/29-CLOSURE.md`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/similarity_matrix.json`
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
