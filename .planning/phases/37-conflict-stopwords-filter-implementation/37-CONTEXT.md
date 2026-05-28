# Phase 37 — Context: Conflict Stopwords Filter Implementation

**Date:** 2026-05-28
**Baseline:** Post-Phase 36 Policy Design
**Status:** Complete / ready for planning

<domain>
## Phase Boundary

Implementar o filtro de stopwords de conflito de substring definido na `36-POLICY-DRAFT.md`. A Phase 36 projetou a política e classificou 13 tokens; a Phase 37 executa essa política em código (data, engine, CLI e testes).
</domain>

<decisions>
## Implementation Decisions

**D-01:** Todos os detalhes de implementação já foram decididos na Phase 36. Não existem gray areas adicionais a discutir. O plano de execução deve seguir rigidamente o documento de política.

**D-02:** O arquivo `conflict_stopwords.v1.json` deve ser criado exatamente como especificado no schema aprovado.

**D-03:** A integração no código não pode afetar as demais funcionalidades (taxonomia, aliases, artefatos compilados, scoring). Apenas a detecção de conflitos (linha 174-179 de `seed_profile.ts`) é afetada, com bypass para tokens da lista de stopwords.

**D-04:** A CLI deve receber o caminho para a configuração de stopwords (opcional, fallback default para o arquivo criado, opção `--conflict-stopwords`).

**D-05:** Devem ser criados/atualizados os cenários de testes garantindo a funcionalidade correta do filtro e preservação do comportamento sem arquivo de stopwords.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Política de Origem
- `.planning/phases/36-noise-stopword-policy/36-POLICY-DRAFT.md` — Especificação da política, json schema, restrições e integração arquitetural.

### Código Envolvido
- `data/inference/conflict_stopwords.v1.json` (novo arquivo)
- `src/inference/types.ts`
- `src/inference/seed_profile.ts`
- `src/cli/parse_args.ts`
- `src/cli/compile.ts`
- `src/compiler/compile_all.ts`
- `src/inference/seed_profile.test.ts`
</canonical_refs>

---

*Phase: 37-conflict-stopwords-filter-implementation*
*Context gathered: 2026-05-28*
