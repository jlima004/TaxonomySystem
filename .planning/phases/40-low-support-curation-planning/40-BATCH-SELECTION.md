# Phase 40: BATCH SELECTION (low_support)

## 1. Inventário e Resumo dos 275 `low_support` (v2.6)
O sistema identificou um total de **275 candidatos** classificados como `corpus_candidate_low_support` na `similarity_matrix.json` (gerada pela v2.6). 
Esses candidatos representam descritores que não atingiram os limiares rigorosos de suporte (`support < 3`), pontuação normalizada ou `placement_score`, mas que ainda possuem uma frequência de corpus expressiva, indicando uso ativo no vocabulário olfativo, embora com baixo consenso semântico no grafo ou com dados insuficientes.

## 2. Critérios de Ranking e Seleção
Para evitar a curadoria manual e excessiva de 275 itens na mesma phase e reduzir os riscos à estabilidade do modelo atual, os seguintes critérios foram adotados para filtrar um **batch controlado de 30 candidatos**:
1. **Evidence Priority:** Foram priorizados descritores com as maiores frequências absolutas no corpus (`candidate_frequency`), desde que acompanhados de um `placement_score` não-nulo.
2. **Semantic Clarity:** Descritores claros e bem definidos no universo das fragrâncias (ingredientes e facetas clássicas como "coffee", "rosemary", "eucalyptus", "nutty").
3. **Baixa Polissemia:** Termos mais específicos em oposição a termos amplos ou descrições ambíguas (evitamos adjetivos subjetivos demais).
4. **Boa Aderência a Famílias/Subfamílias Existentes:** Selecionados itens com alta possibilidade lógica de serem fixados no grafo em famílias maduras (ex: *vanilla, amber, tropical_fruit, citrus_fresh*).
5. **Expected Curation Value:** Potencial de agregar ingredientes úteis para a futura taxonomia do MVP.

## 3. Batch Selecionado (30 Candidatos)
Foram selecionados 30 candidatos com os maiores potenciais:

1. **nutty** (freq: 271) -> *vanilla*
2. **sulfurous** (freq: 226) -> *citrus_fresh*
3. **roasted** (freq: 170) -> *leathery*
4. **meaty** (freq: 155) -> *orchard_fruit*
5. **coffee** (freq: 116) -> *vanilla*
6. **hay** (freq: 112) -> *amber*
7. **buttery** (freq: 95) -> *tropical_fruit*
8. **garlic** (freq: 85) -> *tropical_fruit*
9. **orri** (freq: 75) -> *amber*
10. **alliaceous** (freq: 73) -> *tropical_fruit*
11. **eucalyptus** (freq: 68) -> *citrus_fresh*
12. **mentholic** (freq: 60) -> *warm_spice*
13. **savory** (freq: 57) -> *warm_spice*
14. **peppermint** (freq: 56) -> *fresh_spice*
15. **rosemary** (freq: 54) -> *woody_dry*
16. **bready** (freq: 52) -> *leathery*
17. **hazelnut** (freq: 46) -> *tropical_fruit*
18. **fir_needle** (freq: 45) -> *amber*
19. **fishy** (freq: 42) -> *musky*
20. **cumin** (freq: 40) -> *warm_spice*
21. **marine** (freq: 39) -> *amber*
22. **potato** (freq: 39) -> *citrus_fresh*
23. **alcoholic** (freq: 34) -> *tropical_fruit*
24. **maple** (freq: 34) -> *red_fruit*
25. **cabbage** (freq: 32) -> *tropical_fruit*
26. **orchid** (freq: 31) -> *floral_rose*
27. **spearmint** (freq: 31) -> *citrus_fresh*
28. **caraway** (freq: 25) -> *citrus_fresh*
29. **radish** (freq: 24) -> *tropical_fruit*
30. **opoponax** (freq: 22) -> *amber*

## 4. Rationale de Inclusão
Estes 30 itens estão no topo de frequência (todos > 20 menções no corpus) e representam notas clássicas que certamente melhorarão o modelo se forem curadas adequadamente para a taxonomia formal. "Coffee", "nutty", "rosemary", "peppermint" e "eucalyptus" são excelentes notas e seu processamento direto tem **alto valor** estratégico para o MVP. A seleção focou em itens com evidência quantitativa (frequência, placement_score inicial) e utilidade pragmática.

## 5. Rationale de Deferral dos Demais (245 Candidatos)
Os outros 245 candidatos foram temporariamente deferidos desta phase. A maioria possui frequências de corpus muito baixas (ex: < 15) indicando baixa utilidade imediata, alta polissemia, ou são compostos demasiadamente complexos (ex: "onion_green_onion"). O deferral os mantém seguros no status `corpus_candidate_low_support`, permitindo que reapareçam naturalmente em batches futuros ou recebam boost semântico à medida que novas fontes textuais expandirem o corpus.

## 6. Confirmação de Mutabilidade
**CONFIRMADO: ZERO mutações foram aplicadas.**
Esta phase (Phase 40) agiu em modo de estrito inventário e discussão (leitura apenas).
- Os 275 descritores não foram alterados;
- O arquivo `taxonomy.json` não sofreu mutações;
- Nenhuma alteração foi realizada nas funções de "scoring" ou no pipeline Graphify/Knowledge Engine;
- Os 8 `seed_corpus_conflict` não foram reabertos ou promovidos.
