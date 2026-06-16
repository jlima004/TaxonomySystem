# Phase 61: Fail-Closed Query Consumption - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 61-fail-closed-query-consumption
**Areas discussed:** Boundary architecture and validation proof, error model, public consumer surface

---

## Boundary Architecture And Validation Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Consumer object only | Criar apenas `createValidatedQueryConsumer(...)` como superficie principal, sem um handle validado explicito. | |
| Validated handle + funcoes consumidoras | `asValidatedGraph(graph)` devolve um handle validado e wrappers separados executam as queries. | |
| Duas camadas finas | `ValidatedGraph` como artefato-base validado e `createValidatedQueryConsumer(validatedGraph)` como superficie ergonomica por cima. | ✓ |

**User's choice:** Duas camadas finas.
**Notes:** A Phase 61 deve criar uma fronteira explicita entre grafo cru e grafo validado. `query_graph.ts` continua puro e de baixo nivel; o caminho sancionado deve validar primeiro com `validateSanctionedV211Graph(graph)`, produzir um `ValidatedGraph` reutilizavel e permitir query proofs apenas a partir dele.

---

## Error Model

| Option | Description | Selected |
|--------|-------------|----------|
| Resultado tipado sem throw | `ok/error` como unico fluxo, sem helpers ergonomicos com excecao. | |
| Throw tipado no boundary | O boundary sancionado lanca erros deterministivos como fluxo principal. | |
| Hibrido | `ok/error` como caminho oficial, com helpers opcionais `OrThrow` para conveniencia controlada. | ✓ |

**User's choice:** Hibrido.
**Notes:** `asValidatedGraph(graph)` e `createValidatedQueryConsumer(...)` devem usar `ok/error` no caminho principal. Helpers como `assertValidatedGraph(graph)` e `createValidatedQueryConsumerOrThrow(...)` sao permitidos como conveniencia secundaria. `graph_not_validated` permanece distinto de erros detalhados de validacao estrutural/profile. Missing target continua proof vazio, nao erro.

---

## Public Consumer Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Duas entradas publicas explicitas | `asValidatedGraph(graph)` e `createValidatedQueryConsumer(validatedGraph)` mais atalho principal para grafo cru. | |
| `ValidatedGraph` como centro | Primeiro obter `ValidatedGraph`; depois criar o consumer como segunda etapa obrigatoria. | ✓ |
| Consumer-first | `createValidatedQueryConsumer(graph)` como porta principal, com `ValidatedGraph` relegado a reuso avancado. | |

**User's choice:** `ValidatedGraph` como centro.
**Notes:** O contrato recomendado deve ser explicitamente em duas etapas: validar e obter `ValidatedGraph`, depois criar o consumer. Nao promover `createValidatedQueryConsumer(graph)` a atalho principal, para nao enfraquecer a fronteira semantica entre grafo cru e grafo validado.

---

## the agent's Discretion

Nenhuma.

## Deferred Ideas

Nenhuma.
