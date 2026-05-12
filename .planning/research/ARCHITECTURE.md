# Architecture Research — Olfactory Taxonomy System

> Researched: 2026-05-12

## Padrão Recomendado: Pipeline Funcional com Stages

Alinhado com a arquitetura funcional pura do engine existente.

```
Seed JSON ──┐
             ├─→ [Load] → [Normalize] → [Analyze] → [Infer] → [Compile] → JSON outputs
Corpus JSON ─┘
```

## Pipeline Stages

### Stage 1: Load
- Carregar taxonomy seed (manual hierarchy)
- Stream-parse `enriched_materials.json` (70MB) — extrair apenas campos relevantes (odor descriptors, usage categories)
- Não carregar tudo em memória — usar streaming

### Stage 2: Normalize
- Aplicar normalization pipeline em cada descriptor
- Regras: lowercase → trim → remove punctuation → singularize → normalize whitespace
- Output: Set de descriptors normalizados

### Stage 3: Analyze
- **Frequency**: Contar ocorrências de cada descriptor normalizado
- **Co-occurrence**: Matriz de co-ocorrência entre descriptors (quais aparecem juntos em materiais)
- **Alias detection**: Para cada par de descriptors com alta string-similarity → marcar como alias candidato

### Stage 4: Infer
- **Merge**: Combinar seed taxonomy com dados do corpus
- **Cluster**: Agrupar descriptors por co-ocorrência + string similarity
- **Similarity**: Computar similaridade entre subfamilies usando 4 dimensões

### Stage 5: Compile
- Gerar `taxonomy.json` — hierarchy final
- Gerar `descriptor_aliases.json` — alias map
- Gerar `similarity_matrix.json` — sparse graph
- Validar schemas
- Gerar relatório de cobertura

## Estrutura de Diretórios Proposta

```
src/
├── types/                    # Type definitions
│   ├── taxonomy.ts           # TaxonomyFamily, Subfamily, Descriptor types
│   ├── corpus.ts             # CorpusMaterial, CorpusDescriptor types
│   └── similarity.ts         # SimilarityEdge, SparseGraph types
├── seed/                     # Manual taxonomy seed
│   └── taxonomy-seed.json    # Initial hierarchy definition
├── loader/                   # Data loading (Stage 1)
│   ├── seed-loader.ts        # Load and validate seed JSON
│   └── corpus-loader.ts      # Stream-parse enriched_materials.json
├── normalizer/               # Descriptor normalization (Stage 2)
│   ├── pipeline.ts           # Main normalization pipeline
│   ├── rules.ts              # Individual normalization rules
│   └── string-utils.ts       # Levenshtein, Jaro-Winkler, singularize
├── analyzer/                 # Corpus analysis (Stage 3)
│   ├── frequency.ts          # Descriptor frequency counting
│   ├── cooccurrence.ts       # Co-occurrence matrix
│   └── alias-detector.ts     # Alias candidate detection
├── inference/                # Taxonomy inference (Stage 4)
│   ├── merger.ts             # Seed + corpus merge
│   ├── clusterer.ts          # Descriptor clustering
│   └── similarity.ts         # Multi-dimensional similarity computation
├── compiler/                 # Output compilation (Stage 5)
│   ├── taxonomy-compiler.ts  # Generate taxonomy.json
│   ├── alias-compiler.ts     # Generate descriptor_aliases.json
│   ├── similarity-compiler.ts # Generate similarity_matrix.json
│   └── validator.ts          # Schema validation
├── cli/                      # CLI entry point
│   └── build.ts              # Main build command
└── tests/
    ├── normalizer.test.ts
    ├── analyzer.test.ts
    ├── inference.test.ts
    └── compiler.test.ts
```

## Sparse Similarity Graph — Implementação

### Formato: Adjacency List (JSON)
```json
{
  "floral_white::floral_powdery": { "score": 0.7, "dimensions": { "semantic": 0.8, "accord": 0.6, "tradition": 0.7, "overlap": 0.65 } },
  "woody_dry::woody_smoky": { "score": 0.8, "dimensions": { "semantic": 0.75, "accord": 0.85, "tradition": 0.9, "overlap": 0.7 } }
}
```

### Threshold: >0.25
- Com ~100 subfamilies → ~5000 pares possíveis
- Com threshold 0.25 → estimativa ~500-1500 edges (sparse enough)
- Brute-force O(N²) é aceitável para N=100

### Algoritmo de Similaridade
```
similarity(a, b) = w1 * semantic_sim(a, b)
                 + w2 * accord_compat(a, b)
                 + w3 * tradition_sim(a, b)
                 + w4 * descriptor_overlap(a, b)
```

Onde:
- `semantic_sim` = Jaccard similarity dos descriptor sets
- `accord_compat` = Lookup table manual (perfumery knowledge)
- `tradition_sim` = Distância no Fragrance Wheel (adjacência circular)
- `descriptor_overlap` = Descriptors compartilhados / total

## Streaming do Corpus (70MB)

### Abordagem: readline + JSON.parse incremental
```typescript
// Pseudo-code
const stream = createReadStream('enriched_materials.json')
// Parse JSON array incrementally — extract only odor fields
// Avoid loading 70MB into memory
```

### Campos necessários do corpus
- `odor_descriptions` ou equivalente — texto descritivo de odor
- `usage_categories` — categorias de uso
- `name` — nome do material

## Key Observations

1. **N é pequeno** (~100 subfamilies) → não precisa de ANN/vector DB
2. **Pipeline é batch** → roda uma vez, gera JSONs, não precisa ser real-time
3. **70MB corpus** → streaming é necessário, mas é o único ponto de escala
4. **Zero-dep é viável** → string similarity é trivial, JSON streaming com Node.js nativo

## Confidence

- **Alta** — Arquitetura pipeline funcional é o padrão natural para este tipo de sistema
- **Média** — Estrutura de diretórios pode evoluir durante implementação
