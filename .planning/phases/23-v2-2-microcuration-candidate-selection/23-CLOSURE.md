# Phase 23 Closure — v2.2 Microcuration Candidate Selection (`lemon_peel` add_target)

status: complete_closed
closed_at: 2026-05-27
phase: 23-v2-2-microcuration-candidate-selection

## Closure Summary

A Phase 23 está completa e fechada.

O Plan 23-01 executou a microcuradoria para promover `lemon_peel` a seed descriptor. O descritor foi adicionado a `data/taxonomy/taxonomy-seed.v2.json` sob a família `citrus`, subfamília `citrus_fresh`.

A compilação e publicação dos artefatos oficiais na pasta `data/compiled/v2/` foram executadas após a validação completa de todos os invariantes exigidos.

## Estado Final e Mudanças

- `lemon_peel` adicionado como seed descriptor em `citrus/citrus_fresh` no arquivo `data/taxonomy/taxonomy-seed.v2.json`.
- Os artefatos oficiais em `data/compiled/v2/` (`taxonomy.json`, `descriptor_aliases.json` e `similarity_matrix.json`) foram compilados e atualizados.
- `lemon_peel` foi removido do `review_queue` (conflito seed_corpus resolvido).
- `lemongrass` permaneceu inalterado como candidato de corpus no `review_queue` com o anchor `lemon`.
- `peel` (freq=70) gerou um novo conflito esperado `seed_corpus_conflict` com `lemon_peel`, de acordo com a regra `INV-6` (count=1 ≤ threshold=2), resultando em um aviso aceito (`WARN-PAT03`).

## Validação dos Invariantes

A validação foi realizada com sucesso pelo script [validate_phase23.py](file:///home/jlima/Projetos/TaxonomySystem/scripts/validate_phase23.py) apresentando o resultado **ALL PASS**:

* **INV-1 (lemon_peel a seed):** PASS (`source=seed, status=curated`)
* **INV-2 (lemon_peel removido do review_queue):** PASS (0 instâncias como item principal)
* **INV-3 (lemon permanece seed):** PASS (`source=seed, status=curated`)
* **INV-4 (seeds em citrus_fresh = 6):** PASS (`['bergamot', 'grapefruit', 'lemon', 'lemon_peel', 'petitgrain', 'sweet_orange']`)
* **INV-5 (seeds pré-existentes intactos):** PASS (todos os 5 anteriores permanecem intactos)
* **INV-6 (novos conflitos pós-add ≤ 2):** PASS (apenas 1 novo conflito esperado: `peel`)
* **INV-7 (lemongrass no review_queue):** PASS (permanece na fila de revisão)

## Artefatos Fechados nesta Fase

* [23-CONTEXT.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-CONTEXT.md)
* [23-RESEARCH.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-RESEARCH.md)
* [23-PATTERNS.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-PATTERNS.md)
* [23-VALIDATION.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-VALIDATION.md)
* [23-01-PLAN.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-01-PLAN.md)
* [23-DISCUSSION-LOG.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-DISCUSSION-LOG.md)
* [23-CLOSURE.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/23-v2-2-microcuration-candidate-selection/23-CLOSURE.md) (este documento)
