# Phase 35 — Discussion Log & Prioritization

**Topic:** O que priorizar após o rebaseline da v2.5.0?

## Análise do Estado Atual
O trabalho focado das últimas fases de microcuradoria, alias mutation e add_target foi extremamente bem-sucedido em mitigar os problemas de mais alta prioridade (os casos semânticos reais). 
Entretanto, o progresso absoluto nos números pareceu modesto (de 34 para 31 conflitos) porque a maioria dos remanescentes não são verdadeiros conflitos perfumísticos, mas sim artefatos sistêmicos.

A review queue agora contém:
- **31 `seed_corpus_conflict`**: A vasta maioria já está identificada como "noise artifact" (ex: `sweet`, `fruit`, `berry`, `wood`, `peel`, `leaf`, `grain`, `raw`, `black`, `bitter`, `apple`, `pine`, `orange`). Tratá-los via curadoria manual um a um gera baixo valor.
- **278 `corpus_candidate_low_support`**: A cauda longa persistente de descriptors raros.

## Opções para a Próxima Frente

1. **Formal Noise/Stopword Pipeline (Recomendado):** 
   Muitos dos 31 conflitos são tokens unigramas hipergenéricos. Se formalizarmos uma expansão da "noise config" ou estabelecermos uma `stopword list` definitiva para purgar tokens isolados como `sweet`, `wood` e `fruit`, limparíamos dezenas de falsos conflitos de uma só vez, com segurança total.
   
2. **Low-Support Bulk Triage (Manual Review Pack):**
   A fila de low-support (278 itens) não precisa de design complexo, mas sim de trabalho de dados. Podemos exportar essa lista inteira como um CSV para que os taxonomistas (o Human in the loop) possam aprovar/rejeitar e mapear tudo rapidamente, retornando com um artefato curado pronto para ingestão em lote.

3. **Resíduos de Curadoria (Alias e Target Gaps):**
   Ainda temos `clover` (vs clove), `lemongrass` (vs lemon) e compostos legítimos (`grapefruit_peel`, `banana_peel`, `melon_rind`). Podemos executar uma última fase de microcuradoria pontual para esses casos específicos.

## Decisão Pendente
As documentações desta Phase 35 estão prontas para revisão. O próximo passo de execução deve escolher um dos caminhos acima. A Opção 1 (Noise Pipeline) oferece o maior ROI imediato de engenharia para limpar o compilador de falsos positivos.
