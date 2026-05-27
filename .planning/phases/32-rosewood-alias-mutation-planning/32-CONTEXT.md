# Phase 32 — Rosewood Alias Mutation Planning : Context

## Objetivo
Planejar a mutação dos aliases para o alvo `rosewood`, recém-criado na Fase 31, utilizando uma abordagem em camadas baseada em confiança de equivalência semântica.

## Estratégia Baseada em Confiança

1. **Alta Confiança (Foco Inicial):**
   - `boi_de_rose` → `rosewood`
   - `bois_de_rose` → `rosewood`

2. **Média Confiança (Exige Validação Adicional):**
   - `pau_rosa` → `rosewood` (se houver evidência nos dados de similaridade/uso)

3. **Baixa Confiança (Não Recomendado / Fora de Escopo):**
   - `boi` → Manter como `defer/manual_review`
   - *Motivo*: O termo "boi" é demasiadamente truncado e apresenta um alto risco de causar colisões semânticas no sistema, perdendo a ligação clara com "bois de rose".

## Artefatos Base de Leitura (Somente Leitura)
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/similarity_matrix.json`
- Fechamento de fases anteriores (.planning/phases/30... e 31...)
