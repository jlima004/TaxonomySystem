# Phase 60: Contract Constants & Validation Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 60-contract-constants-validation-hardening
**Areas discussed:** Graph ID boundary, validation error contract, validation surfaces and profiles, structured error payloads

---

## Graph ID Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Helpers funcionais minimos | Construir IDs e fazer parse/strip sem type guards completos. | |
| Helpers + type guards | Superficie minima mais guards por kind. | |
| Helpers + parser discriminado completo | Boundary oficial com builders, strip, guards e `parseGraphId` deterministico sem throws genericos. | ✓ |

**User's choice:** Helpers + parser discriminado completo.
**Notes:** `contract.ts` permanece normativo; um modulo central como `graph_id.ts` deve consumir apenas prefixes autoritativos. Builder, validator e query nao podem mais espalhar templates `family:${id}`, regex ou `replace`.

---

## Validation Error Contract

| Option | Description | Selected |
|--------|-------------|----------|
| `code` e `invariant_id` coincidem sempre que possivel | Modelo simples, com pouca separacao semantica. | |
| `code` generico e `invariant_id` especifico | Contrato mais abstrato, reduzindo granularidade do erro observavel. | |
| Modelo hibrido | Preserva codigos atuais observaveis como contrato estavel e adiciona `invariant_id` quando houver regra normativa explicita. | ✓ |

**User's choice:** Modelo hibrido.
**Notes:** O contrato deve exportar `GRAPH_VALIDATION_ERROR_CODES`, `GRAPH_INVARIANT_IDS`, union types derivados e uma associacao opcional entre ambos. Nada de substituir os codigos atuais por uma categoria generica como `invalid_graph_structure`.

---

## Validation Surfaces And Profiles

| Option | Description | Selected |
|--------|-------------|----------|
| Funcao unica com opcoes | `validateOlfactoryGraph(graph, { profile })`. | |
| Duas funcoes explicitas | Estrutural e strict separadas, sem wrapper sancionado dedicado. | |
| Estrutural + wrapper sancionado | `validateOlfactoryGraphStructure`, `validateOlfactoryGraphAgainstProfile` e `validateSanctionedV211Graph`. | ✓ |

**User's choice:** Estrutural + wrapper sancionado.
**Notes:** Validacao estrutural nao pode congelar o baseline `10/18/341/18/13`; o profile sancionado e obrigatorio para CLI, live regression e para o future consumer-facing query boundary da Phase 61.

---

## Structured Error Payloads

| Option | Description | Selected |
|--------|-------------|----------|
| `unknown` para `expected`/`actual` | Flexivel, mas pouco seguro e menos previsivel para consumidores. | |
| `JsonValue` explicito | Payload base seguro para JSON, sem factories tipadas extras. | |
| Union extensa por codigo | Maxima tipagem por erro, com complexidade alta nesta fase. | |
| Hibrido | Base comum com `JsonValue` e factories funcionais tipadas para erros criticos. | ✓ |

**User's choice:** Hibrido.
**Notes:** O shape base de erro permanece pequeno e estavel, mas erros como schema version, graph ID invalido, endpoint ausente, mismatch de profile/baseline e `graph_not_validated` devem nascer de factories centrais deterministicas.

---

## the agent's Discretion

Nenhuma.

## Deferred Ideas

Nenhuma.
