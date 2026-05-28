# Phase 35 — Preflight: v2.5 Review Queue Rebaseline

**Phase:** 35
**Status:** planning_only / read_only
**Goal:** Recalcular e inventariar o estado atual da review queue pós-v2.5.0, sem curadoria, para decidir a próxima frente com dados frescos.

## Scope
- Inventariar review_queue atual (similarity_matrix.json v2.5.0).
- Separar `seed_corpus_conflict` vs `corpus_candidate_low_support`.
- Identificar pendências antigas que desapareceram (Phase 22 baseline vs current).
- Listar novos conflitos introduzidos.
- Priorizar a próxima frente de curadoria/trabalho.

## Execution Rules
- **READ ONLY:** Nenhuma curadoria, alteração em data/taxonomy/* ou data/compiled/* é permitida nesta phase.
- Nenhum script de build, Graphify ou publication será executado.

## Checkpoints
- [x] Phase 35 directory created
- [x] 35-CONTEXT.md written with inventory data
- [x] 35-DISCUSSION-LOG.md written with prioritization
