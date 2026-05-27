# Phase 24: V2.3 Alias Candidate Planning - Research

## Contexto da Pesquisa
Esta pesquisa responde às questões levantadas para a viabilidade da mutação de alias de `cedar` para `cedarwood`.

### 1. `cedar` no corpus é semanticamente equivalente a `cedarwood`?
**Sim.** No contexto de taxonomia olfativa e perfumaria, "cedar" e "cedarwood" (cedro e madeira de cedro) remetem ao mesmo perfil e mesma nota olfativa (amadeirado seco). Não há distinção técnica relevante no corpus que justifique manter ambos como conceitos separados.

### 2. `cedarwood` existe e permanece seed em `woody/woody_dry`?
**Sim.** Conforme verificado em `data/taxonomy/taxonomy-seed.v2.json` e também em `data/compiled/v2/taxonomy.json`, `cedarwood` está explicitamente definido como uma *seed* ("status": "curated", "source": "seed") dentro da subfamília `woody_dry` sob a família `woody`. Possui uma frequência direta associada de 17.

### 3. `cedar` já existe como seed, alias ou candidate compilado?
**Existe como candidate compilado.**
- Não está em `taxonomy-seed.v2.json`.
- Não está listado como alias em `descriptor_aliases.seed.json` (apenas `cedar wood` mapeia para `cedarwood`).
- Em `data/compiled/v2/taxonomy.json`, `cedar` aparece como um candidato derivado do corpus ("source": "corpus", "status": "candidate", "review_required": true) com uma frequência expressiva de **83** ocorrências sob a subfamília `woody_dry`.

### 4. `cedar` → `cedarwood` reduziria o review_queue sem duplicar conceito?
**Sim.** Criar o alias `cedar` → `cedarwood` fará com que as 83 ocorrências de `cedar` identificadas no corpus sejam normalizadas para `cedarwood` (já consolidado e não exigindo revisão). Isso removerá `cedar` da fila de revisão (review queue), consolidando as frequências (passando a ter uma volumetria de 100) e evitando a duplicação do mesmo conceito na árvore.

### 5. Quais invariantes devem validar a futura alias mutation?
Para garantir uma mutação segura na Fase 25+, as seguintes invariantes devem ser implementadas e respeitadas na compilação:
- **Invariante de Destino Válido (Target Validity):** O destino do alias (`cedarwood`) deve obrigatoriamente existir como *seed* validada no `taxonomy-seed.v2.json`.
- **Invariante de Unicidade do Alias (Alias Uniqueness):** O novo termo (`cedar`) não pode estar mapeado para múltiplos destinos diferentes no `descriptor_aliases.seed.json`.
- **Invariante de Exclusão Mútua (Mutual Exclusion):** Um termo não pode existir simultaneamente como um alias (em `descriptor_aliases.seed.json`) e como um nó/seed independente (em `taxonomy-seed.v2.json`).
