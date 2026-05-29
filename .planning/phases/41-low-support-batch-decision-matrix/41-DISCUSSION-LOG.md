# Phase 41: Low-Support Batch Decision Matrix - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-29
**Phase:** 41-low-support-batch-decision-matrix
**Areas discussed:** Formato e estrutura da matriz, Critérios de decisão por disposition, Granularidade do batch, Escopo da análise por candidato, Contrato de execução Phase 42, Política de subfamílias, Critérios de aprovação da matriz

---

## Formato e Estrutura da Matriz

| Option | Description | Selected |
|--------|-------------|----------|
| Tabela Markdown com colunas fixas | Simples, legível, fácil de revisar | |
| JSON estruturado com schema formal | Processamento automático fácil, revisão humana menos intuitiva | |
| Formato misto: Markdown + JSON companion | Tabela para revisão + JSON para consumíveis | |

**User's choice:** Markdown como artefato principal, com estrutura quase tabular/parseável para Phase 42 consumir sem ambiguidade. Campos normalizados para execution (`id`, `candidate`, `disposition`, `target_family`, `target_subfamily`, `target_descriptor`, `mutation_allowed`). Free text só em `rationale`, `evidence`, `expected_effect`, `notes`.
**Notes:** Definiu `mutation_allowed=true` como válido somente para `promote_to_seed`/`add_alias` com todos os target fields completos. Obrigatório incluir `## Execution Summary for Phase 42` com contagens por disposition.

---

## Critérios de Decisão por Disposition

| Option | Description | Selected |
|--------|-------------|----------|
| Critérios baseados em domínio olfativo | promote se nota clássica com família clara; reject se culinário | |
| Critérios baseados em evidência | promote se freq ≥ 30 + placement_score não-nulo | |
| Você decide | Usar melhor julgamento | |

**User's choice:** Critérios detalhados por disposition com regra central: frequência nunca qualifica promotion sozinha. Definiu 6 dispositions com critérios mínimos explícitos, exemplos prováveis do batch, e 7 regras globais de segurança.
**Notes:** `promote_to_seed` exige confidence=high ou medium_high. `add_alias` exige canonical target existente. Reject para culinários/vegetais. `defer_manual_review` como melhor fallback para itens olfativos mas perigosos. Diferenciação explícita entre `defer_manual_review` (precisa de especialista) e `defer_future_batch` (pode esperar outro ciclo).

---

## Granularidade do Batch

| Option | Description | Selected |
|--------|-------------|----------|
| Matriz única com todos os 30 de uma vez | Um artefato, um passe de revisão | |
| Subdividir por grupo de risco | Grupo 1→2→3 com seções separadas no mesmo artefato | ✓ |
| Subdividir com aprovação intermediária | 3 ciclos separados de decisão | |

**User's choice:** Group-batched microcuration: processar em 3 blocos por grupo de risco da Phase 40, com decisão individual por candidato, tudo no mesmo artefato. Block A pode gerar promote/alias; Block B default defer; Block C default reject/defer.
**Notes:** Phase 42 só executa rows com `mutation_allowed=true` e campos target completos.

---

## Escopo da Análise por Candidato

| Option | Description | Selected |
|--------|-------------|----------|
| Análise rápida | Verificar nome + família provável + decidir. Sem lookup externo | |
| Análise média | Verificar seed + review_queue + similarity_matrix | |
| Análise profunda | Buscar referências externas (IFRA, etc.) para cada um | |

**User's choice:** Modelo de investigação em camadas: Nível 0 (rejeição rápida para óbvios), Nível 1 (baseline obrigatório para todos), Nível 2 (targeted para mutation candidates), Nível 3 (deep só para alias/normalization uncertainty e ambiguidades de alta consequência).
**Notes:** mutation_allowed=true exige pelo menos targeted_check. add_alias com spelling/normalization exige deep_check. reject/defer pode ser decidido com baseline_check quando rationale é claro. Campo `investigation_depth` na matriz registra o nível aplicado.

---

## Contrato de Execução Phase 42, Política de Subfamílias, Critérios de Aprovação

**User's choice (bloco adicional):** Adicionou 3 áreas finais antes de fechar:
1. Phase 42 pode APENAS mutar rows com mutation_allowed=true, promote/add_alias, target fields completos, rationale presente, confidence >= medium_high.
2. Para v2.7, promote_to_seed deve preferir famílias/subfamílias existentes. Candidatos que exigem nova subfamília defaultam para defer.
3. Matriz está execution-ready quando todos os 30 têm disposition não-TBD, mutation rows têm targets completos, e zero mutations foram aplicadas na Phase 41.

---

## Agent's Discretion

Nenhuma área foi delegada ao agente. Todas as decisões foram explicitamente fornecidas pelo usuário.

## Deferred Ideas

Nenhuma — discussão permaneceu dentro do escopo da fase.
