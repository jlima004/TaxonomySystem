# Features Research — Olfactory Taxonomy System

> Researched: 2026-05-12

## Table Stakes (Mínimo Viável)

Features que todo sistema de taxonomia olfativa computacional precisa:

1. **Hierarquia family → subfamily → descriptors** — Estrutura base (Michael Edwards Fragrance Wheel como referência)
2. **Descriptor normalization** — Lowercase, sem pontuação, deduplicação
3. **Alias map** — Plural/singular, frases invertidas, variantes ortográficas
4. **Similarity scoring** — Algum mecanismo de proximidade entre subfamilies
5. **JSON output** — Machine-readable, versionável

## Referência: Michael Edwards Fragrance Wheel

O padrão da indústria usa 4 macro-families com subfamilies circulares:

| Macro-Family | Subfamilies |
|-------------|-------------|
| Floral | Floral, Soft Floral, Floral Oriental |
| Amber (Oriental) | Soft Amber, Amber, Woody Amber |
| Woody | Woods, Mossy Woods, Dry Woods |
| Fresh | Aromatic, Citrus, Water, Green, Fruity |

**Para nosso sistema**: Expandimos para 12-20 families (mais granular que Edwards) porque precisamos de resolução suficiente para similarity scoring e accord generation. Edwards é bom para consumidores mas insuficiente para IA.

## Features do Builder — Priorizadas

### P0 (Crítico)

| Feature | Descrição |
|---------|-----------|
| Manual taxonomy seed loading | Carregar definição manual da hierarquia base |
| Corpus descriptor extraction | Extrair descriptors do `enriched_materials.json` |
| Descriptor normalization pipeline | lowercase, trim, remove punctuation, dedup |
| Alias detection (rule-based) | Plural→singular, inverted phrases, spelling variants |
| Taxonomy JSON compilation | Gerar `taxonomy.json` final |
| Alias JSON compilation | Gerar `descriptor_aliases.json` final |

### P1 (Importante)

| Feature | Descrição |
|---------|-----------|
| Frequency analysis | Contar ocorrências de cada descriptor no corpus |
| Cluster suggestion | Agrupar descriptors semanticamente similares |
| Similarity inference | Computar similaridade entre subfamilies |
| Similarity JSON compilation | Gerar `similarity_matrix.json` (sparse) |
| Schema validation | Validar outputs contra schemas definidos |

### P2 (Nice-to-have v1)

| Feature | Descrição |
|---------|-----------|
| Coverage report | % de materiais cobertos pela taxonomia |
| Orphan descriptor detection | Descriptors no corpus sem mapping na taxonomia |
| Taxonomy statistics | Counts por family/subfamily, distribution charts |
| Diff report | Comparar versões da taxonomia |

## Abordagem Híbrida — Detalhes

### Eixo Manual (Seed)
- Definição de families e subfamilies pela expertise perfumística
- Canonical descriptors atribuídos manualmente a cada subfamily
- Serve como "esqueleto" da taxonomia

### Eixo Estatístico (Corpus)
- **Frequency**: Quais descriptors aparecem mais? → priorizar na taxonomia
- **Co-occurrence**: Quais descriptors aparecem juntos? → mesma subfamily?
- **Alias detection**: "fresh green" e "green fresh" são o mesmo? → heurísticas de string similarity
- **Gap detection**: Descriptors frequentes no corpus que não estão no seed → sugerir adição

## Dimensões de Similaridade

A pesquisa confirma que similaridade multi-dimensional é o approach correto:

1. **Semântica** — Overlap de descriptors entre subfamilies
2. **Compatibilidade de acordes** — Tradição perfumística (quais subfamilies combinam em acordes)
3. **Tradição perfumística** — Proximidade no Fragrance Wheel (subfamilies adjacentes são mais similares)
4. **Descriptor overlap** — Jaccard similarity dos sets de descriptors

## Confidence

- **Alta** para P0/P1 — features bem definidas pelo prompt.md
- **Média** para dimensões de similaridade — a combinação de pesos entre dimensões precisará de tuning
