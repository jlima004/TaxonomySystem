# Phase 24 — Discussion Log: v2.3 Alias Candidate Planning

**Phase:** 24 — v2.3 Alias Candidate Planning
**Discussion Date:** 2026-05-27
**Status:** Complete — context captured

---

## Discussion Summary

A discussão da Phase 24 focou em três áreas-chave: seleção de candidatos de alias para v2.3, natureza da curadoria do candidato principal, e formato de execução da fase.

---

## Area 1 — GR-01: Escopo de Candidatos

**Contexto apresentado:**
Da matrix da Phase 22, havia 3 potenciais candidatos para v2.3:
- `cedar → cedarwood` (alias_candidate, HIGH evidence, corpus_count 83)
- `clover → clove` (alias_candidate, MEDIUM evidence, corpus_count 13, "debatível")
- `ambergri → ambergris` (valid_variant, MEDIUM evidence, corpus_count 46, "possível alias candidate v2.3+")

**Opções apresentadas:**
1. Apenas os 2 alias_candidate formais (cedar + clover)
2. cedar + ambergri (maior frequência e evidência mais sólida)
3. Todos os 3 (cedar, clover, ambergri)

**Decisão do usuário:** Apenas `cedar → cedarwood`

**Razão explicitada pelo usuário:** "candidato mais forte; corpus_count 83; possível forma curta comum de cedarwood; target seed já existe"

**Itens deferidos:**
- `clover` → investigação semântica (misspelling vs. descritor distinto) exige pesquisa separada — Phase 26+
- `ambergri` → suporte moderado mas não urgente — Phase 26+

---

## Area 2 — GR-02: Natureza da Curadoria para cedar

**Contexto apresentado:**
Duas hipóteses para `cedar`:
- (a) Alias curado: `cedar` é forma curta de `cedarwood` → mutation em `descriptor_aliases.seed.json`
- (b) Add_target: `cedar` é descritor distinto que precisa existir no seed separadamente

**Opções apresentadas:**
1. Adicionar alias curado (cedar → cedarwood) em descriptor_aliases.seed.json
2. *(Recomendada)* Investigar primeiro se cedar precisa de add_target antes de decidir
3. Ambas: adicionar alias E investigar se seria add_target

**Decisão do usuário:** Capturou explicitamente 4 sub-decisões (CEDAR24-D-01 a D-04):
- `cedar` tratado como alias candidate para `cedarwood`, não como add_target inicial
- Ação preferida: planejar alias mutation `"cedar": "cedarwood"` em `descriptor_aliases.seed.json`
- Não adicionar `cedar` como seed descriptor separado sem evidência forte de uso como nota distinta
- Execução futura exige prova de equivalência semântica, alias integrity check, allowlist e approval persistida

---

## Area 3 — GR-04: Formato de Execução

**Contexto apresentado:**
- Planning-only (padrão Phase 22): produzir documentos de pesquisa e plano sem executar curadoria
- Execução real já na Phase 24 (padrão Phase 23): pesquisa + mutação + compilação oficial v2.3

**Opções apresentadas:**
1. *(Recomendada)* Planning-only — mesmo padrão da Phase 22
2. Execução real já na Phase 24 — mesmo padrão da Phase 23

**Decisão do usuário:** Planning-only — mesmo padrão da Phase 22

---

## Decisões Capturadas (CEDAR24-D-01 a D-07)

| ID | Decisão |
|---|---|
| CEDAR24-D-01 | Escopo restrito a `cedar → cedarwood` apenas |
| CEDAR24-D-02 | `clover` e `ambergri` fora do escopo da Phase 24 |
| CEDAR24-D-03 | Tratar `cedar` como alias candidate, não add_target |
| CEDAR24-D-04 | Ação planejada: alias mutation `"cedar": "cedarwood"` em `descriptor_aliases.seed.json` |
| CEDAR24-D-05 | Não adicionar `cedar` como seed descriptor sem evidência de nota distinta |
| CEDAR24-D-06 | Execução futura exige: prova de equivalência, integrity check, allowlist, approval persistida |
| CEDAR24-D-07 | Formato planning-only; nenhuma mutação, compilação ou publicação autorizada nesta fase |

---

## Deferred Ideas

| Item | Motivo |
|---|---|
| `clover → clove` | Investigação semântica separada necessária (Phase 26+) |
| `ambergri → ambergris` | Suporte moderado, não urgente (Phase 26+) |
| `cedar` como add_target | Descartado; reavaliável se pesquisa revelar nota distinta |
| Compilação e publicação v2.3 | Gated até Phase 25+ após execução real aprovada |

---

*Gerado após discussão interativa em 2026-05-27*
