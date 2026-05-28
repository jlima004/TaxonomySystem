# Phase 36 — Discussion Log

**Phase:** 36 — Formal Noise/Stopword Policy for Substring Conflict Matching
**Date:** 2026-05-28

## Discussão 1: Pesquisa do Mecanismo de Conflito

### Achados Técnicos

1. **Ponto de conflito único:** `seed_profile.ts:175` — match bidirecional `includes()` entre corpus descriptor e seed descriptor.

2. **Mecanismo de noise existente é ortogonal:** `semantic_noise.v1.json` opera no **scoring** (downweight de peso), não na detecção de conflitos. Um token pode ser downweighted (ex: `sweet` = 0.25) E AINDA gerar `seed_corpus_conflict`. São dois sistemas independentes.

3. **A config de conflitos não existe:** Não há atualmente nenhum mecanismo para filtrar/suprimir conflitos de substring. Cada match de substring gera automaticamente um `seed_corpus_conflict` review item.

4. **O compile pipeline passa tudo:** `compile_all.ts` monta o `review_queue` concatenando todos os review items de `profileResult.review_queue`, `compiledTaxonomy.placement_review_queue` e `similarityBase.review_queue`. Não há filtro pós-detecção.

### Decisão de Design

A separação entre `semantic_noise.v1.json` (scoring) e `conflict_stopwords.v1.json` (conflict detection) é fundamental para:
- Evitar mistura de responsabilidades
- Permitir que ambos operem independentemente
- Manter backward compatibility (se o conflict_stopwords não existir, o sistema funciona como antes)

## Discussão 2: Classificação dos 13 Tokens

### Critérios Aplicados

Quatro critérios cumulativos foram definidos:
1. Substring incidental (sem relação semântica)
2. Token é unigrama genérico (parte/qualificador/categoria)
3. Token NÃO é seed descriptor
4. Nenhuma proposta ativa de promoção

### Resultado da Classificação

- **5 Safe Noise:** `raw`, `grain`, `black`, `peel`, `leaf` — satisfazem todos os 4 critérios sem ressalvas
- **5 Moderate Noise:** `sweet`, `bitter`, `fruit`, `berry`, `wood` — satisfazem os critérios, mas têm valor semântico reconhecido como categorias olfativas
- **3 Caution:** `orange`, `apple`, `pine` — podem ser notas olfativas independentes legítimas, incluídos condicionalmente com flag `requires_review: true`

### Ponto de Debate: orange, apple, pine

Esses 3 tokens estão na fronteira entre noise e sinal legítimo:
- **Argumento para incluir:** atualmente NÃO são seed descriptors, NÃO têm proposta de promoção, e os conflitos de substring são puramente incidentais (`pineapple` ≠ `pine` + `apple`; `bitter_orange` e `sweet_orange` são compostos com significado próprio)
- **Argumento contra incluir:** na perfumaria, `orange`, `apple` e `pine` são notas olfativas reconhecidas que poderiam merecer promoção futura a seed descriptors
- **Decisão:** incluir com `requires_review: true` para sinalizar reavaliação periódica

## Discussão 3: Impacto Projetado

### Antes da Política (baseline v2.5.0)
- 31 `seed_corpus_conflict` na review queue
- 13 são artefatos de substring matching (Grupo A)
- 18 requerem decisão semântica (Grupo B)

### Após Implementação da Política (projetado)
- **17 `seed_corpus_conflict`** na review queue (31 - 14 = 17)
- Nota: 14 conflitos eliminados (não 13) porque `orange` conflita com dois seeds (`bitter_orange` e `sweet_orange`), gerando 2 review items
- Os 17 restantes são **todos do Grupo B** — conflitos legítimos que requerem decisão semântica

### ROI
- 45% de redução na fila de conflitos
- Zero mutação de dados
- Zero alteração de scoring
- Config declarativa e auditável
- Totalmente reversível
