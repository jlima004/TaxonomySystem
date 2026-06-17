# Phase 63: Consumer Readiness Documentation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-17
**Phase:** 63-consumer-readiness-documentation
**Areas discussed:** ordem do guia, tabela do envelope, exemplos canonicos e antipatrones, fences de nao-escopo

---

## Ordem do guia

| Option | Description | Selected |
|--------|-------------|----------|
| Escopo e fences -> graph:build -> validacao -> consumer -> envelope -> erros | Ensina primeiro o workflow operacional e so depois a fronteira de consumo. | |
| Escopo e fences -> validacao -> consumer -> envelope -> graph:build -> erros | Prioriza a integracao futura antes do workflow operacional. | |
| Escopo e fences -> duas trilhas paralelas | Separa `graph:build`/boundary audit e `validacao`/consumer como fluxos paralelos. | |
| Ordem precisa com ciclo de vida completo | `Escopo, audiencia e fences -> Mapa do fluxo completo -> Workflow operacional graph:build -> Validacao sancionada -> ValidatedGraph -> Consumer fail-closed -> Envelope seguro -> Erros e missing targets -> Exemplos e antipatrones -> Referencias normativas e provas automatizadas`. | ✓ |

**User's choice:** Ordem precisa com ciclo de vida completo.
**Notes:** O usuario travou que o guia deve ensinar primeiro o ciclo de vida do artefato, depois a fronteira de confianca e so entao o consumo, para evitar leitura de `graph:build`, `graph.json` ou do consumer como runtime, API ou servico publico.

---

## Tabela do envelope

| Option | Description | Selected |
|--------|-------------|----------|
| `query_kind` seguro/estavel; `params` seguro com cautela; `result` seguro/principal; `path` seguro condicional de proveniencia | Permite uso de `path` quando presente, mas so como trilha explicativa e de rastreabilidade. | ✓ |
| `path` interno/proveniencia apenas | Leitura mais conservadora, desencorajando consumo de `path`. | |
| `params` totalmente estavel | Leitura mais forte de `params` como parte consumivel do contrato. | |

**User's choice:** `query_kind` seguro/estavel; `params` seguro com cautela; `result` seguro/principal; `path` seguro condicional de proveniencia.
**Notes:** O usuario adicionou regras normativas: o consumidor discrimina primeiro por `query_kind`; `result` vazio ou `null` e resposta valida; `path` nao define confianca, ranking, autorizacao ou completude; nenhum campo pode ser reinterpretado silenciosamente; e metadados futuros exigem mudanca explicita de contrato.

---

## Exemplos canonicos e antipatrones

| Option | Description | Selected |
|--------|-------------|----------|
| Canonicos 1-5 | `graph:build --dry-run`, `graph:build` non-dry-run, `asValidatedGraph` com sucesso e erro, `createValidatedQueryConsumer`, query feliz, `graph_not_validated` e missing target. | ✓ |
| Antipatrones curtos | Nao tratar `graph.json` cru como pronto, nao expor query pela CLI, nao exigir `path`, nao inferir fatos so de `path`, nao tratar `result` vazio como falha. | ✓ |
| Antipatrones adicionais | Nao fabricar `ValidatedGraph`; nao usar `query_graph.ts` diretamente em integracoes agent/RAG. | ✓ |

**User's choice:** Canonicos obrigatorios `1, 2, 3, 4 e 5`; antipatrones obrigatorios com redacao normativa curta.
**Notes:** O usuario travou a ordem dos exemplos no ciclo completo: `graph:build --dry-run`; `graph:build` non-dry-run e boundary audit; leitura do `graph.json` cru; `asValidatedGraph` com sucesso; `asValidatedGraph` com erro de validacao; `createValidatedQueryConsumer`; query feliz interpretada por `query_kind`; tentativa de contorno com `graph_not_validated`; missing target com proof valida vazia ou nula. Tambem pediu para marcar cada trecho como `Canonico`, `Ilustrativo` ou `Proibido`.

---

## Fences de nao-escopo

| Option | Description | Selected |
|--------|-------------|----------|
| Fence global + reforcos locais obrigatorios | Abre com um fence forte e repete notas curtas nas secoes de maior risco de interpretacao como runtime/superficie publica. | ✓ |
| Fence global unico + recapitulação final | Mais enxuto, mas facil de pular ou reinterpretar localmente. | |
| Fence por secao sem abertura forte | Muito redundante e menos claro como declaracao inicial de escopo. | |

**User's choice:** Fence global de abertura com reforcos locais obrigatorios.
**Notes:** O usuario travou o texto-base dos fences locais em `graph:build`, `graph.json`, `ValidatedGraph`, consumer, envelope agent/RAG, `path` e exemplos, alem de uma checklist final proibindo leitura do guia como runtime/API/DB/Neo4J/Graphify/publicacao.

---

## the agent's Discretion

Nenhuma area relevante foi delegada para decisao livre do agente.

## Deferred Ideas

None.
