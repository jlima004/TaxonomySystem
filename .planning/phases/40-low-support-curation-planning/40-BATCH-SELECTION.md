# Phase 40: BATCH SELECTION (low_support)

## 1. Inventário e Resumo dos 275 `low_support` (v2.6)
O sistema identificou um total de **275 candidatos** classificados como `corpus_candidate_low_support` na `similarity_matrix.json` (gerada pela v2.6). 
Esses candidatos representam descritores que não atingiram os limiares rigorosos de suporte (`support < 3`), pontuação normalizada ou `placement_score`, mas que ainda possuem uma frequência de corpus expressiva, indicando uso ativo no vocabulário olfativo, embora com baixo consenso semântico no grafo ou com dados insuficientes.

## 2. Critérios de Ranking e Seleção
Para evitar a curadoria manual e excessiva de 275 itens na mesma phase e reduzir os riscos à estabilidade do modelo atual, os seguintes critérios foram adotados para filtrar um **batch controlado de 30 candidatos**:
1. **Evidence Priority:** Foram priorizados descritores com as maiores frequências absolutas no corpus (`candidate_frequency`), desde que acompanhados de um `placement_score` não-nulo.
2. **Semantic Clarity:** Descritores claros e bem definidos no universo das fragrâncias (ingredientes e facetas clássicas como "coffee", "rosemary", "eucalyptus", "nutty").
3. **Baixa Polissemia:** Termos mais específicos em oposição a termos amplos ou descrições ambíguas (evitamos adjetivos subjetivos demais).
4. **Boa Aderência a Famílias/Subfamílias Existentes:** Selecionados itens com alta possibilidade lógica de serem fixados no grafo em famílias maduras.
5. **Expected Curation Value:** Potencial de agregar ingredientes úteis para a futura taxonomia do MVP.

> [!WARNING]
> **Importante sobre os Mappings Iniciais (Guardrail de Curadoria):**
> Os mappings de "candidato -> subfamília" exibidos abaixo representam **APENAS placement/inferência inicial** computada pelo pipeline atual. Eles **NÃO** são targets aprovados nem recomendações finais de curadoria.
> - **A Phase 41 deve decidir target/disposition do zero para cada item.**
> - **Nenhum target sugerido na Phase 40 pode ser tratado como aprovado.**
> - **Itens culinários / off-note / sulfurados / vegetais devem ser avaliados com cautela** e podem receber `reject` ou `defer` mesmo com alta frequência.

## 3. Batch Selecionado (30 Candidatos)

O batch foi dividido em três grupos de risco/potencial para guiar a matriz de decisão na Phase 41:

### Grupo 1: High-value likely curation candidates
*(Total de 15 candidatos. Itens com alto potencial utilitário no domínio olfativo)*
- **nutty** (freq: 271) -> *vanilla*
- **coffee** (freq: 116) -> *vanilla*
- **hay** (freq: 112) -> *amber*
- **orri** (freq: 75) -> *amber* *(Observação para Phase 41: deve entrar como normalization/alias investigation, provavelmente relacionado a "orris", não como seed direto sem revisão)*
- **eucalyptus** (freq: 68) -> *citrus_fresh*
- **peppermint** (freq: 56) -> *fresh_spice*
- **rosemary** (freq: 54) -> *woody_dry*
- **hazelnut** (freq: 46) -> *tropical_fruit*
- **fir_needle** (freq: 45) -> *amber*
- **cumin** (freq: 40) -> *warm_spice*
- **maple** (freq: 34) -> *red_fruit*
- **orchid** (freq: 31) -> *floral_rose*
- **spearmint** (freq: 31) -> *citrus_fresh*
- **caraway** (freq: 25) -> *citrus_fresh*
- **opoponax** (freq: 22) -> *amber*

### Grupo 2: Caution / expert-review candidates
*(Total de 8 candidatos. Facetas qualitativas que requerem revisão cuidadosa devido a nuances e cruzamentos de subfamílias)*
- **sulfurous** (freq: 226) -> *citrus_fresh*
- **roasted** (freq: 170) -> *leathery*
- **buttery** (freq: 95) -> *tropical_fruit*
- **mentholic** (freq: 60) -> *warm_spice*
- **savory** (freq: 57) -> *warm_spice*
- **bready** (freq: 52) -> *leathery*
- **marine** (freq: 39) -> *amber*
- **alcoholic** (freq: 34) -> *tropical_fruit*

### Grupo 3: Likely defer/reject unless strong olfactive rationale
*(Total de 7 candidatos. Elementos muito específicos (culinários/vegetais) onde alta frequência não implica valor imediato em taxonomia de perfumaria fina)*
- **meaty** (freq: 155) -> *orchard_fruit*
- **garlic** (freq: 85) -> *tropical_fruit*
- **alliaceous** (freq: 73) -> *tropical_fruit*
- **fishy** (freq: 42) -> *musky*
- **potato** (freq: 39) -> *citrus_fresh*
- **cabbage** (freq: 32) -> *tropical_fruit*
- **radish** (freq: 24) -> *tropical_fruit*

## 4. Rationale de Inclusão
Estes 30 itens estão no topo de frequência e representam uma mescla de notas clássicas ("Coffee", "nutty", "rosemary") com anomalias estatísticas que precisam ser decididas e não ignoradas ("meaty", "garlic"). O processamento direto (via reject, defer, ou target map na Phase 41) tem **alto valor** estratégico para limpar ou enriquecer o MVP.

## 5. Rationale de Deferral dos Demais (245 Candidatos)
Os outros 245 candidatos foram temporariamente deferidos desta phase. A maioria possui frequências de corpus muito baixas (ex: < 15) indicando baixa utilidade imediata, ou são compostos demasiadamente complexos (ex: "onion_green_onion"). O deferral automático em massa os mantém no status `corpus_candidate_low_support`, permitindo processamento em batches futuros.

## 6. Confirmação de Mutabilidade
**CONFIRMADO: ZERO mutações foram aplicadas.**
Esta phase (Phase 40) agiu em modo de estrito inventário e discussão (leitura apenas).
- Os 275 descritores não foram alterados;
- O arquivo `taxonomy.json` não sofreu mutações;
- Nenhuma alteração foi realizada nas funções de "scoring" ou no pipeline Graphify/Knowledge Engine;
- Os 8 `seed_corpus_conflict` não foram reabertos ou promovidos.
