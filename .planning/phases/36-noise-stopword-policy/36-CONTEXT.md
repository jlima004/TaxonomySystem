# Phase 36 — Context: Formal Noise/Stopword Policy for Substring Conflict Matching

**Date:** 2026-05-28
**Baseline:** Post-v2.5.0 / Phase 35 complete
**Status:** Complete / policy_design finalized

<domain>
## Phase Boundary

Definir uma política formal e segura para tratar falsos positivos de `seed_corpus_conflict` causados por substring matching com tokens unigramas hipergenéricos. A política opera como filtro contextual no escopo de conflict matching, sem executar expurgo global e sem corromper semântica legítima da base.

**Input primário:** Grupo A da Phase 35 — 13 candidatos a noise/stopword contextual.
</domain>

<decisions>
## Implementation Decisions

### Problema Raiz — Substring Matching sem Filtro

O mecanismo de detecção de conflitos em `src/inference/seed_profile.ts:175` usa:
```
inferred.descriptor.includes(ref.descriptor) || ref.descriptor.includes(inferred.descriptor)
```

Este check bidirecional gera falsos positivos quando tokens unigramas genéricos do corpus (ex: `sweet`, `fruit`, `wood`) são substrings de seed descriptors compostos (ex: `sweet_orange`, `grapefruit`, `cedarwood`), ou quando seed descriptors são substrings de corpus tokens.

### Mecanismo Existente vs Proposto

**Mecanismo existente:** `data/inference/semantic_noise.v1.json`
- Opera no **scoring/downweight** de descriptors durante inferência
- NÃO filtra conflitos de substring — um token pode ser downweighted E ainda gerar `seed_corpus_conflict`
- Escopo: `hard_exclude`, `pattern_exclude`, `downweight` (com valores 0.25–0.35)
- Já contém `sweet` como downweight (0.25), mas `sweet` ainda gera conflito com `sweet_orange`

**Mecanismo proposto:** nova config de filtro contextual para substring conflict matching
- Escopo limitado: aplicável APENAS na detecção de conflitos (linha 175 de `seed_profile.ts`)
- NÃO altera scoring, NÃO remove tokens do corpus, NÃO altera taxonomia
- Resultado: tokens listados NÃO geram `seed_corpus_conflict` review items quando o conflito é puro substring

### Grupo A — 13 Candidatos a Noise/Stopword Contextual

| Token | Conflita com (seed) | Tipo de Falso Positivo | Valor Semântico Fora de Conflito |
|---|---|---|---|
| `sweet` | `sweet_orange` | qualificador genérico é substring de composto | sim — qualificador de sabor/odor |
| `fruit` | `grapefruit` | categoria genérica é substring de composto | sim — família olfativa |
| `berry` | `blackberry` | categoria genérica é substring de composto | sim — família de notas |
| `wood` | `cedarwood` | material genérico é substring de composto | sim — família olfativa |
| `peel` | `lemon_peel` | parte genérica é substring de composto | sim — descritor de textura |
| `leaf` | `tomato_leaf` | parte genérica é substring de composto | sim — descritor botânico |
| `grain` | `petitgrain` | parte genérica é substring de composto | sim — descritor de textura |
| `raw` | `strawberry` | qualificador genérico é substring de composto | sim — descritor de estado |
| `black` | `blackberry` | qualificador genérico é substring de composto | sim — qualificador de variedade |
| `bitter` | `bitter_orange` | qualificador genérico é substring de composto | sim — descritor de sabor |
| `orange` | `bitter_orange`, `sweet_orange` | target legítimo é substring de compostos | **ATENÇÃO** — `orange` pode ser descritor legítimo próprio |
| `apple` | `pineapple` | target legítimo é substring de composto | **ATENÇÃO** — `apple` pode ser descritor legítimo próprio |
| `pine` | `pineapple` | target legítimo é substring de composto | **ATENÇÃO** — `pine` pode ser descritor legítimo próprio |

### Classificação por Risco

**Categoria 1 — Safe Noise (baixo risco):** Tokens que são puramente partes/qualificadores genéricos e NÃO são descritores olfativos independentes válidos no contexto do sistema.
- `raw` (substring de `strawberry` — incidental, sem relação semântica)
- `grain` (substring de `petitgrain` — incidental, sem relação semântica)
- `black` (substring de `blackberry` — qualificador de cor, não descritor olfativo)
- `peel` (substring de `lemon_peel` — parte botânica genérica)
- `leaf` (substring de `tomato_leaf` — parte botânica genérica)

**Categoria 2 — Moderate Noise (risco médio):** Tokens que são categorias olfativas genéricas e teriam valor como descritores independentes, mas cujo conflito de substring é puramente incidental.
- `sweet` (substring de `sweet_orange` — adjetivo, não nome de nota)
- `bitter` (substring de `bitter_orange` — adjetivo, não nome de nota)
- `fruit` (substring de `grapefruit` — incidental, grape≠fruit)
- `berry` (substring de `blackberry` — incidental, berry como categoria é legítimo)
- `wood` (substring de `cedarwood` — incidental, wood como categoria é legítimo)

**Categoria 3 — Caution (risco alto):** Tokens que SÃO ou PODEM SER descritores olfativos independentes legítimos e cujo conflito de substring pode representar ambiguidade real.
- `orange` — pode ser nota olfativa independente (laranja como descritor)
- `apple` — pode ser nota olfativa independente (maçã como descritor)
- `pine` — pode ser nota olfativa independente (pinus como descritor)

### Decisões de Design

**D-01:** A política opera EXCLUSIVAMENTE como filtro no escopo de substring conflict matching em `seed_profile.ts:175`. Nenhuma outra parte do sistema é afetada.

**D-02:** O formato de configuração será um arquivo JSON versionado separado do `semantic_noise.v1.json`, para evitar confusão entre downweight de scoring e filtro de conflitos.

**D-03:** Tokens da Categoria 1 e 2 são candidatos diretos para inclusão no filtro. Tokens da Categoria 3 (`orange`, `apple`, `pine`) devem ser avaliados com critérios adicionais antes de inclusão.

**D-04:** A política deve ser opt-in (o sistema funciona sem ela, como hoje) e reversível (remover um token da lista restaura o comportamento original de detecção de conflito).

**D-05:** Nenhuma implementação de código ocorre nesta fase. O deliverable é a especificação da política, formato de configuração e critérios.

**D-06:** A config de conflict stopwords deve conter metadados de justificativa por token (rationale) para auditoria.

### Agent's Discretion

- Formato exato do arquivo JSON (nome, estrutura dos campos) — agente define durante planejamento
- Critérios heurísticos para avaliação dos tokens Categoria 3 — agente propõe
- Estrutura interna do POLICY-DRAFT.md — agente organiza

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Mecanismo de Substring Conflict
- `src/inference/seed_profile.ts` — Linha 175: substring matching bidirectional
- `src/inference/noise.ts` — Scoring/downweight existente (escopo diferente)
- `src/inference/types.ts` — `SeedCorpusProfileOptions` type
- `src/types/inference.ts` — `ReviewQueueItem`, `NoiseDecision` types

### Configuração Existente
- `data/inference/semantic_noise.v1.json` — Noise config de scoring (NÃO de conflitos)

### Contexto de Fases Anteriores
- `.planning/phases/35-v2-5-review-queue-rebaseline/35-CONTEXT.md` — Inventário dos 31 conflitos e separação em Grupo A/B
- `.planning/phases/35-v2-5-review-queue-rebaseline/35-DISCUSSION-LOG.md` — Priorização e guardrails
- `.planning/phases/22-review-queue-conflict-triage-v2-2/` — Triagem original de conflitos

</canonical_refs>

<specifics>
## Specific Ideas

### Formato de Configuração Proposto (draft)
```json
{
  "version": "1.0.0",
  "scope": "substring_conflict_matching",
  "description": "Tokens to suppress from seed_corpus_conflict detection when conflict is pure substring match",
  "tokens": {
    "raw": { "category": "safe_noise", "rationale": "Incidental substring of strawberry, no semantic relation" },
    "grain": { "category": "safe_noise", "rationale": "Incidental substring of petitgrain, no semantic relation" }
  }
}
```

### Pontos de Integração (para fase futura de implementação)
1. Novo arquivo: `data/inference/conflict_stopwords.v1.json`
2. Nova opção em `SeedCorpusProfileOptions`: `conflictStopwords?: readonly string[]`
3. Filtro na linha 175 de `seed_profile.ts`: skip conflito se `inferred.descriptor` está na stopword list
4. Testes: cenários que validam que tokens na stopword list NÃO geram `seed_corpus_conflict`

</specifics>

<deferred>
## Deferred Ideas

- Implementação de código (fase separada)
- Tokens do Grupo B (18 itens — microcuradoria posterior)
- Avaliação detalhada de `orange`, `apple`, `pine` como descritores independentes (pode requerer análise de corpus)
- Integração com o downweight scoring existente (combinar ambos os mecanismos)
- Low-support bulk triage (278 itens — fase separada)
</deferred>

---

*Phase: 36-noise-stopword-policy*
*Context gathered: 2026-05-28*
