# Phase 36 — Policy Draft: Substring Conflict Stopword Policy

**Version:** 1.0.0-draft
**Date:** 2026-05-28
**Status:** DRAFT — Aguardando aprovação antes de qualquer implementação

---

## 1. Definição da Política

### 1.1 Objetivo

Estabelecer uma lista curada e versionada de tokens que devem ser **ignorados durante a detecção de `seed_corpus_conflict`** quando o conflito detectado é resultado de substring matching incidental (um token genérico do corpus que é substring de um seed descriptor composto, ou vice-versa), sem ambiguidade semântica real entre os dois termos.

### 1.2 Escopo de Aplicação

A política aplica-se **EXCLUSIVAMENTE** a:
- A função `buildSeedCorpusProfiles()` em `src/inference/seed_profile.ts`
- Especificamente ao trecho que detecta conflitos (linha 175):
  ```typescript
  const anchor = seedRefs.find(ref =>
    inferred.descriptor.includes(ref.descriptor) ||
    ref.descriptor.includes(inferred.descriptor)
  )
  ```

A política **NÃO** aplica-se a:
- Scoring/downweight de noise (`noise.ts`)
- Taxonomia seed (`taxonomy-seed.v2.json`)
- Descriptor aliases (`descriptor_aliases.seed.json`)
- Compilação de artefatos (`data/compiled/*`)
- Qualquer remoção ou exclusão de tokens de qualquer artefato

### 1.3 Princípio Fundamental

> **Filtrar conflitos ≠ Deletar conhecimento.**
>
> Um token na stopword list continua existindo no corpus, continua aparecendo nos artefatos compilados, continua participando do scoring e do downweight. O único efeito é que ele **não gera um review item do tipo `seed_corpus_conflict`** quando o motivo da detecção é puro substring match.

---

## 2. Critérios de Inclusão

Um token é elegível para inclusão na stopword list de conflitos de substring SE E SOMENTE SE **todos** os seguintes critérios forem satisfeitos:

### Critério 1 — Substring Incidental
O match de substring entre o token e o seed descriptor é **incidental** (não existe relação semântica direta entre os dois):
- `raw` ⊂ `strawberry` → incidental ✓ (raw = cru, strawberry = morango)
- `grain` ⊂ `petitgrain` → incidental ✓ (grain = grão, petitgrain = nome próprio botânico)
- `pine` ⊂ `pineapple` → **parcialmente incidental** ⚠ (pine = pinus, pineapple = abacaxi, mas ambos são notas olfativas)

### Critério 2 — Token é Unigrama Genérico
O token é um unigrama (palavra única) que funciona como **parte, qualificador, adjetivo ou categoria genérica**, não como um nome de nota olfativa específica que deveria existir como seed descriptor independente:
- `sweet` → adjetivo/qualificador ✓
- `wood` → categoria genérica ✓
- `orange` → **nome de nota olfativa específica** ⚠ (pode ser descritor legítimo)

### Critério 3 — Nenhum Seed Descriptor com o Mesmo ID
O token NÃO existe como seed descriptor no `taxonomy-seed.v2.json`. Se existir, o conflito pode ser legítimo:
- `sweet` não é seed descriptor → elegível ✓
- `orange` não é seed descriptor (apenas `bitter_orange` e `sweet_orange`) → elegível com cautela ⚠

### Critério 4 — Ausência de Evidência de Promoção
Não existe no backlog, nas discussões ou nos dados históricos uma proposta ativa ou pendente de promoção do token como seed descriptor. Se houver, o conflito detectado pode ser um sinal válido.

---

## 3. Classificação dos 13 Candidatos do Grupo A

### 3.1 Categoria 1 — APROVADO para Stopword (Safe Noise)

Tokens que satisfazem **todos os 4 critérios** sem ressalvas.

| Token | Seed Conflitante | Tipo de Substring | Relação Semântica | Decisão |
|---|---|---|---|---|
| `raw` | `strawberry` | `raw` ⊂ `strawberry` | Nenhuma (raw = cru, não morango) | ✅ APROVADO |
| `grain` | `petitgrain` | `grain` ⊂ `petitgrain` | Nenhuma (grão ≠ petitgrain) | ✅ APROVADO |
| `black` | `blackberry` | `black` ⊂ `blackberry` | Cor, não descritor olfativo | ✅ APROVADO |
| `peel` | `lemon_peel` | `peel` ⊂ `lemon_peel` | Parte genérica de fruto | ✅ APROVADO |
| `leaf` | `tomato_leaf` | `leaf` ⊂ `tomato_leaf` | Parte genérica de planta | ✅ APROVADO |

**Resultado:** 5 tokens, 5 conflitos eliminados.

### 3.2 Categoria 2 — APROVADO com Justificativa (Moderate Noise)

Tokens que satisfazem os critérios mas cujo valor semântico como categoria olfativa é reconhecido. A inclusão é justificada porque o conflito de substring é puramente incidental.

| Token | Seed Conflitante | Tipo de Substring | Justificativa | Decisão |
|---|---|---|---|---|
| `sweet` | `sweet_orange` | `sweet` ⊂ `sweet_orange` | `sweet` é adjetivo. O conflito com `sweet_orange` é incidental — o token não afirma que `sweet` = `sweet_orange`. Já é downweighted (0.25) no noise config de scoring. | ✅ APROVADO |
| `bitter` | `bitter_orange` | `bitter` ⊂ `bitter_orange` | `bitter` é adjetivo. Mesmo padrão que `sweet`. | ✅ APROVADO |
| `fruit` | `grapefruit` | `fruit` ⊂ `grapefruit` | `fruit` é substring incidental de `grapefruit` (toranja). Nenhuma relação semântica fruit→grapefruit. | ✅ APROVADO |
| `berry` | `blackberry` | `berry` ⊂ `blackberry` | `berry` é categoria genérica, substring incidental de `blackberry`. | ✅ APROVADO |
| `wood` | `cedarwood` | `wood` ⊂ `cedarwood` | `wood` é categoria genérica, substring incidental de `cedarwood`. Já é downweighted via `woody` (0.25). | ✅ APROVADO |

**Resultado:** 5 tokens, 5 conflitos eliminados.

### 3.3 Categoria 3 — CONDICIONAL (Caution — Requer Avaliação Adicional)

Tokens que falham parcialmente nos critérios e cuja inclusão pode suprimir sinais legítimos.

| Token | Seed Conflitante | Questão Aberta | Recomendação |
|---|---|---|---|
| `orange` | `bitter_orange`, `sweet_orange` | `orange` como nota olfativa independente é legítimo na perfumaria. Suprimir o conflito pode mascarar um sinal de que `orange` deveria ser promovido a seed. Porém, atualmente `orange` NÃO é seed e NÃO tem proposta de promoção. | ⚠ INCLUIR CONDICIONALMENTE — com flag `requires_review: true` no config |
| `apple` | `pineapple` | `apple` como nota olfativa é legítimo (nota frutada de maçã). O conflito com `pineapple` é incidental (abacaxi ≠ maçã). Porém, `apple` pode merecer promoção futura. | ⚠ INCLUIR CONDICIONALMENTE — com flag `requires_review: true` |
| `pine` | `pineapple` | `pine` (pinus) é nota olfativa legítima. O conflito com `pineapple` é incidental. Porém, `pine` pode merecer promoção futura (nota amadeirada/resinosa). | ⚠ INCLUIR CONDICIONALMENTE — com flag `requires_review: true` |

**Resultado:** 3 tokens, 4 conflitos eliminados condicionalmente (orange conflita com `bitter_orange` e `sweet_orange`). Esses tokens devem ser reavaliados se houver proposta de promoção a seed no futuro.

### 3.4 Resumo de Impacto

| Categoria | Tokens | Conflitos Eliminados | Risco |
|---|---|---|---|
| Safe Noise | 5 (`raw`, `grain`, `black`, `peel`, `leaf`) | 5 | Baixo |
| Moderate Noise | 5 (`sweet`, `bitter`, `fruit`, `berry`, `wood`) | 5 | Médio-baixo |
| Caution | 3 (`orange`, `apple`, `pine`) | 4 | Médio |
| **Total** | **13** | **14** de 31 conflitos | — |

**ROI projetado:** Eliminação de **14 dos 31** conflitos atuais (45% da fila de conflitos) com uma config declarativa e zero mutação de dados.

---

## 4. Formato de Configuração

### 4.1 Arquivo

**Nome proposto:** `data/inference/conflict_stopwords.v1.json`

**Localização:** ao lado de `semantic_noise.v1.json`, seguindo o mesmo padrão de versionamento.

**Motivo para arquivo separado:** Evitar confusão entre dois mecanismos distintos:
- `semantic_noise.v1.json` = downweight de scoring (afeta cálculo de peso)
- `conflict_stopwords.v1.json` = filtro de detecção de conflitos (afeta review queue)

### 4.2 Schema

```json
{
  "version": "1.0.0",
  "scope": "substring_conflict_matching",
  "description": "Tokens curated to suppress false-positive seed_corpus_conflict items when the conflict source is incidental substring matching. Does NOT affect scoring, taxonomy, aliases, or any compiled artifact.",
  "approved_date": "2026-05-28",
  "tokens": {
    "raw": {
      "category": "safe_noise",
      "seed_conflict": "strawberry",
      "rationale": "Incidental substring. raw (cru) has no semantic relation to strawberry (morango).",
      "approved": true,
      "requires_review": false
    },
    "grain": {
      "category": "safe_noise",
      "seed_conflict": "petitgrain",
      "rationale": "Incidental substring. grain (grão) has no semantic relation to petitgrain (botanical proper name).",
      "approved": true,
      "requires_review": false
    },
    "black": {
      "category": "safe_noise",
      "seed_conflict": "blackberry",
      "rationale": "Color qualifier, not an olfactory descriptor. Incidental substring of blackberry.",
      "approved": true,
      "requires_review": false
    },
    "peel": {
      "category": "safe_noise",
      "seed_conflict": "lemon_peel",
      "rationale": "Generic botanical part. Incidental substring of lemon_peel.",
      "approved": true,
      "requires_review": false
    },
    "leaf": {
      "category": "safe_noise",
      "seed_conflict": "tomato_leaf",
      "rationale": "Generic botanical part. Incidental substring of tomato_leaf.",
      "approved": true,
      "requires_review": false
    },
    "sweet": {
      "category": "moderate_noise",
      "seed_conflict": "sweet_orange",
      "rationale": "Adjective/qualifier, not a note name. Incidental substring of sweet_orange. Already downweighted (0.25) in semantic_noise.v1.json.",
      "approved": true,
      "requires_review": false
    },
    "bitter": {
      "category": "moderate_noise",
      "seed_conflict": "bitter_orange",
      "rationale": "Adjective/qualifier, not a note name. Incidental substring of bitter_orange.",
      "approved": true,
      "requires_review": false
    },
    "fruit": {
      "category": "moderate_noise",
      "seed_conflict": "grapefruit",
      "rationale": "Generic category. Incidental substring of grapefruit (no semantic relation fruit→grapefruit).",
      "approved": true,
      "requires_review": false
    },
    "berry": {
      "category": "moderate_noise",
      "seed_conflict": "blackberry",
      "rationale": "Generic category. Incidental substring of blackberry.",
      "approved": true,
      "requires_review": false
    },
    "wood": {
      "category": "moderate_noise",
      "seed_conflict": "cedarwood",
      "rationale": "Generic material category. Incidental substring of cedarwood. Already covered indirectly by woody (0.25) downweight.",
      "approved": true,
      "requires_review": false
    },
    "orange": {
      "category": "caution",
      "seed_conflict": "bitter_orange,sweet_orange",
      "rationale": "Legitimate olfactory note (orange/laranja), but NOT a current seed descriptor. Conflict with bitter_orange and sweet_orange is incidental substring match. Include conditionally — revisit if orange is proposed for seed promotion.",
      "approved": true,
      "requires_review": true
    },
    "apple": {
      "category": "caution",
      "seed_conflict": "pineapple",
      "rationale": "Legitimate olfactory note (apple/maçã), but NOT a current seed descriptor. Conflict with pineapple is incidental (pineapple = abacaxi ≠ maçã). Include conditionally — revisit if apple is proposed for seed promotion.",
      "approved": true,
      "requires_review": true
    },
    "pine": {
      "category": "caution",
      "seed_conflict": "pineapple",
      "rationale": "Legitimate olfactory note (pine/pinus), but NOT a current seed descriptor. Conflict with pineapple is incidental. Include conditionally — revisit if pine is proposed for seed promotion.",
      "approved": true,
      "requires_review": true
    }
  }
}
```

### 4.3 Invariantes do Schema

1. **`version`**: semver, incrementa a cada alteração
2. **`scope`**: sempre `"substring_conflict_matching"` — impede uso indevido
3. **`tokens`**: mapa de token → metadados. Cada entry deve ter:
   - `category`: `safe_noise` | `moderate_noise` | `caution`
   - `seed_conflict`: seed descriptor(es) contra o qual conflita
   - `rationale`: justificativa textual (auditável)
   - `approved`: booleano (false = draft, não aplicar)
   - `requires_review`: booleano (true = reavaliação periódica)
4. **Nenhum token pode ser adicionado** sem satisfazer os 4 critérios da Seção 2
5. **Nenhum token com `approved: false`** pode ser usado para filtrar conflitos

---

## 5. Guardrails de Implementação (para fase futura)

### 5.1 Ponto de Integração

Na fase de implementação (Phase 37+), o filtro deve ser aplicado na **linha 175 de `seed_profile.ts`**, adicionando uma condição de bypass:

```typescript
// Pseudocódigo — NÃO implementar nesta fase
const isStopword = conflictStopwords.has(inferred.descriptor)
if (!isStopword) {
  // existing conflict detection logic
}
```

### 5.2 Regras de Implementação

1. O arquivo `conflict_stopwords.v1.json` deve ser passado como **input explícito** via `SeedCorpusProfileOptions`, não importado como constante hard-coded
2. A ausência do arquivo ou uma lista vazia deve resultar em **comportamento idêntico ao atual** (zero conflitos filtrados)
3. Apenas tokens com `approved: true` devem ser usados para filtrar
4. O filtro deve ser **testável**: cenários que verificam que tokens na list NÃO geram review items, e que tokens FORA da list continuam gerando review items
5. Nenhuma remoção de tokens do corpus, da taxonomia ou de artefatos compilados

### 5.3 Critérios de Revalidação

Tokens com `requires_review: true` devem ser reavaliados se:
1. O token for proposto para promoção a seed descriptor
2. A taxonomia seed for expandida com um descriptor que matcharia o token
3. Uma auditoria periódica identificar que o token deveria ser descritor independente

---

## 6. Riscos Conhecidos

| Risco | Mitigação |
|---|---|
| Token filtrado mascarando conflito legítimo futuro | `requires_review: true` flag + revalidação em promoções |
| Config desatualizada após expansão do seed | Vincular revalidação ao processo de `add_target` |
| Confusão entre noise config e conflict stopwords | Arquivos separados + campo `scope` explícito |
| Implementação futura ultrapassando escopo do filtro | Guardrails documentados + testes de escopo |
| Tokens de Categoria 3 gerando falsos negativos | Flag `requires_review` + avaliação de corpus antes de inclusão definitiva |

---

## 7. Próximos Passos (Pós-Aprovação)

1. **Phase 37 (implementação):** Criar `conflict_stopwords.v1.json`, adicionar opção em `SeedCorpusProfileOptions`, implementar filtro em `seed_profile.ts`, testes
2. **Compilação v2.6:** Compilar com a nova config e verificar que os 14 conflitos não aparecem mais
3. **Grupo B:** Seguir para microcuradoria dos 18 itens restantes (fase separada)
4. **Revalidação periódica:** Incluir no checklist de `add_target` a verificação de conflito com stopwords
