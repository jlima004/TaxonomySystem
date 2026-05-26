# Phase 19 — Preflight Gates

**Status:** Context Gathering / Not Ready for Execution

Este documento define os gates de preflight e restrições antes da Phase 19 entrar em execução.

## Preflight Configuration

```yaml
phase: 19
slug: taxonomy-v2-1-curation-planning
execution_readiness: not_ready_for_execution
priority_selected: 1 (Alias cleanup / absent targets)
```

## Mandatory Boundaries

Durante a fase de levantamento de contexto (context gathering) e planejamento, aplicam-se as seguintes restrições rígidas:

1. **Sem alteração em dados taxonômicos:** O diretório `data/taxonomy` e o arquivo `data/taxonomy/descriptor_aliases.seed.json` não podem ser alterados nesta etapa.
2. **Sem alteração em arquivos de inferência:** `data/inference/curated_relations.v2.json` e `data/inference/accord_map.v2.json` devem permanecer intocados.
3. **Sem alteração em artefatos oficiais compilados:** `data/compiled/v1` e `data/compiled/v2` não podem ser modificados ou regerados.
4. **Sem alteração no CLI Core:** O arquivo `src/cli/parse_args.ts` está protegido e não sofrerá modificações.
5. **Sem alteração no script de guarda de segurança:** O arquivo `scripts/check-safety-guards.sh` está sob proteção e não será mutado.
6. **Sem alteração em package.json:** O arquivo `src/package.json` está protegido contra mutações nesta fase.
7. **Sem alteração em artefatos do Graphify:** Nenhuma limpeza, reversão, regeneração, staging ou commit será feito em arquivos sob o diretório `graphify-out/*`.
8. **Sem execuções bloqueantes:** Não rodar compilação (`compile`), testes, smoke tests, typechecking (`typecheck`) ou builds do sistema de taxonomia durante a fase de `context_gathering`.
9. **Sem execução de curadoria:** Nenhuma curadoria prática de dados será executada antes das etapas de pesquisa (`research`), validação (`validation`) e aprovação explícita do plano de execução pelo usuário.

## Readiness Checklist

- [x] Contexto inicial coletado e registrado em [19-CONTEXT.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-CONTEXT.md)
- [x] Discussão de priorização documentada em [19-DISCUSSION-LOG.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-DISCUSSION-LOG.md)
- [x] Pesquisa detalhada realizada e documentada em [19-RESEARCH.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-RESEARCH.md)
- [x] Padrões de curadoria identificados e registrados em [19-PATTERNS.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-PATTERNS.md)
- [x] Critérios de validação definidos em [19-VALIDATION.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-VALIDATION.md)
- [x] Plano de implementação criado em [19-01-PLAN.md](file:///home/jlima/Projetos/TaxonomySystem/.planning/phases/19-taxonomy-v2-1-curation-planning/19-01-PLAN.md)
- [ ] Aprovação explícita do usuário obtida para a execução
