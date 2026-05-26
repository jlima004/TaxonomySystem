# Phase 17 — Preflight Gates

**Status:** Context Gathering / Not Ready for Execution

Este documento define os gates de preflight e restrições antes da Phase 17 entrar em execução.

## Preflight Configuration

```yaml
phase: 17
slug: safety-guard-usability-wrapper
execution_readiness: not_ready_for_execution
priority_selected: 1 (package script wrapper)
```

## Mandatory Boundaries

1. **Sem alteração em dados taxonômicos:** `data/taxonomy` e `data/inference` devem permanecer intocados.
2. **Sem alteração em artefatos oficiais:** `data/compiled/v1` e `data/compiled/v2` não podem ser alterados ou gerados novamente nesta fase.
3. **Sem alteração no CLI Core:** O arquivo `src/cli/parse_args.ts` está protegido e não deve ser modificado.
4. **Sem alteração no Graphify:** Nenhuma limpeza, reversão ou regeneração de `graphify-out/*`.
5. **Sem alteração em hooks/CI:** A menos que haja um plano explícito posterior com aprovação do usuário, os hooks e CI não serão configurados ou mutados.

## Readiness Checklist

- [x] Contexto inicial coletado e registrado em `17-CONTEXT.md`
- [x] Discussão de priorização documentada em `17-DISCUSSION-LOG.md`
- [ ] Plano de implementação (`17-01-PLAN.md` ou similar) criado
- [ ] Aprovação explícita do usuário obtida para a execução
