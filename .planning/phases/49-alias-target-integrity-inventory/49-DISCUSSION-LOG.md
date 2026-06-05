# Phase 49: Alias Target Integrity Inventory - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 49-alias-target-integrity-inventory
**Areas discussed:** Escopo do relatório, Critério de candidato a exceção, Confirmação de completude

---

## Escopo do Relatório (49-ALIAS-TARGET-INVENTORY.md)

| Opção | Descrição | Selecionada |
|-------|-----------|-------------|
| Relatório mínimo (counts + tabela) | Só counts e tabela de aliases | |
| Relatório evidence-heavy com seções estruturadas | Sources, Method, Counts, Equivalence, Valid Table, Dangling Table, Near-match, Classification, Completeness Proof, Zero-Mutation Statement, Handoff | ✓ |

**Escolha do usuário:** Relatório evidence-heavy com 11 seções estruturadas (listadas acima).
**Notas:** O usuário quer cada claim numérico fundado diretamente nos dados. Seção "Near-match" deve explicar por que `ylang` (corpus candidate) não é equivalente ao `ylang_ylang` esperado.

---

## Critério de Candidato a Exceção

| Categoria | Definição | Aplicável ao ylang ylang |
|-----------|-----------|--------------------------|
| `remediation_required` | Alias válido semanticamente, target ausente → fix necessário | ✓ |
| `possible_exception_candidate` | Target ausente com razão conhecida e documentada | (não aplicável sem evidência) |
| `invalid_or_noise_candidate` | Ruído sem valor semântico | |

**Escolha do usuário:** `remediation_required` para `ylang ylang → ylang_ylang`.
**Notas:** Phase 49 classifica mas não aprova exceções. Aprovação pertence às fases 50/51 após existir gate formal. `ylang` existe como corpus candidate mas é semanticamente distinto de `ylang_ylang`.

---

## Confirmação de Completude

| Opção | Descrição | Selecionada |
|-------|-----------|-------------|
| Afirmação narrativa | Texto afirmando que todos foram revisados | |
| Prova numérica explícita | Tabela de asserções: 18 seed, 18 compiled, seed==compiled, 340 IDs, 17 OK, 1 dangling, 0 mutations | ✓ |

**Escolha do usuário:** Prova numérica explícita com a tabela de asserções listada acima.
**Notas:** O relatório deve declarar explicitamente "Nenhuma decisão de remediação é tomada nesta fase."

---

## Escopo da Busca (não selecionado para discussão aprofundada, mas decidido in-context)

**Decisão registrada:** Escopo restrito às três fontes definidas. Verificação narrow permitida em `taxonomy-seed.v2.json` apenas para confirmar ausência de `ylang_ylang`. Sem expansão para low_support, conflict matrices, scoring ou graphify.

---

## Agente — Achados pré-discussão

O agente executou análise real dos arquivos antes da discussão e confirmou:
- Seed e compiled são idênticos: 18 entradas, mesmo dict `{alias: target}`
- 340 descriptor IDs no compiled taxonomy
- 17 aliases com targets válidos
- 1 dangling: `ylang ylang → ylang_ylang`
- `ylang_ylang` ausente em todas as fontes (seed v2 e compiled)
- `ylang` presente apenas como corpus candidate (`status: "candidate"`, `review_required: true`)

## Deferred Ideas

- Busca ampla em outros arquivos seed → fora do escopo da Phase 49
- Aprovação de exceção para `ylang ylang → ylang_ylang` → Phase 50/51
- Decisão de add_target vs. correção de alias → Phase 51 (Legacy Alias Remediation)
