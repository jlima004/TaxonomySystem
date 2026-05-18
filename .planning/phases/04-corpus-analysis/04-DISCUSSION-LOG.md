# Phase 4: Corpus Analysis - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 4-Corpus Analysis
**Areas discussed:** Frequency source, Co-occurrence semantics, String similarity, Alias output (agent's discretion), Semantic stopwords, Persistence, Formalized smaller decisions (alias pool / self-pairs / performance contract)

---

## Area 1 — Frequency Source

### Q1.1 — Fonte primária da contagem de frequência

| Option | Description | Selected |
|--------|-------------|----------|
| olfactory_only | Apenas `olfactory.descriptors` (curado pela pipeline de enriquecimento) | ✓ |
| olfactory_plus_sources | + `descriptor_sources.tgsc` + `descriptor_sources.sf` | |
| all_textual | + `odor_description` tokenizado | |
| other | Outra abordagem | |

**User's choice:** olfactory_only
**Notes:** Formalizado como **ANAL-D-01**: "Descriptor frequency and co-occurrence statistics MUST be computed exclusively from CorpusMaterial.olfactory.descriptors."

### Q1.2 — Tratamento de `identity.aliases`

| Option | Description | Selected |
|--------|-------------|----------|
| ignore | Ignorar (são nomes de materiais, não descriptors olfativos) | ✓ |
| separate | Manter em índice paralelo (material name index) | |
| include | Contar como descriptors normais | |

**User's choice:** ignore
**Notes:** Formalizado como **ANAL-D-02**: identity.aliases NÃO contribui para descriptor stats. São identity metadata do material.

### Q1.3 — Dedup por material

| Option | Description | Selected |
|--------|-------------|----------|
| set_per_material | Set por material — document frequency clássico | ✓ |
| term_freq | Term frequency — todas ocorrências | |
| both | Expor df E tf separadamente | |

**User's choice:** set_per_material
**Notes:** Formalizado como **ANAL-D-03**: descriptors normalizados deduplicados por material antes da contagem.

---

## Area 2 — Co-occurrence Semantics

### Q2.1 — Ponderação de pares

| Option | Description | Selected |
|--------|-------------|----------|
| raw_count | Contagem bruta (+1 por material) | ✓ |
| normalized_pmi | Raw count + PMI/NPMI on demand | |
| jaccard_only | Apenas Jaccard | |
| you_decide | Discrição do Claude | |

**User's choice:** raw_count
**Notes:** Formalizado como **ANAL-D-04**: binary weight +1 per material após dedup. PMI/NPMI/Jaccard como funções derivadas opcionais.

### Q2.2 — Direcionalidade

| Option | Description | Selected |
|--------|-------------|----------|
| symmetric_sorted | Symmetric, lexicographic order | ✓ |
| directed | Directed (A→B e B→A separados) | |
| both | Symmetric + helper para conditionals | |

**User's choice:** symmetric_sorted
**Notes:** **ANAL-D-05**: symmetric + canonical lexicographic order.

### Q2.3 — Representação em memória

| Option | Description | Selected |
|--------|-------------|----------|
| sparse_map | `Map<string, Map<string, number>>` ou `Map<pair_key, count>` | ✓ |
| sparse_pair_list | Array de `{a, b, count}` | |
| dense_matrix | Dense N×N matrix | |

**User's choice:** sparse_map
**Notes:** **ANAL-D-06**: interno = sparse `Map<pair_key, count>`; export = deterministic edge lists. Encoding exato do `pair_key` deferido para PLAN.

### Q2.4 — Threshold mínimo na contagem

| Option | Description | Selected |
|--------|-------------|----------|
| no_threshold | Armazenar tudo, filtering downstream | ✓ |
| min_2 | Descartar pares com count < 2 | |
| configurable | Parâmetro com default 1 | |

**User's choice:** no_threshold
**Notes:** **ANAL-D-07**: nenhum threshold mínimo durante counting.

---

## Area 3 — String Similarity

### Q3.1 — Algoritmo

| Option | Description | Selected |
|--------|-------------|----------|
| jaro_winkler | Jaro-Winkler apenas | |
| levenshtein | Normalized Levenshtein apenas | ✓ |
| both | Ambos expostos | |
| jaro_only | Jaro sem Winkler bonus | |

**User's choice:** levenshtein
**Notes:** **ANAL-D-08**: normalized Levenshtein como métrica lexical primária.

### Q3.2 — Tokenization

| Option | Description | Selected |
|--------|-------------|----------|
| char_full_string | Char-level sobre string completa | |
| token_set | Token-level (split em `_`) | |
| both_layers | Whole-string + token-level combinado | ✓ |
| you_decide | Discrição | |

**User's choice:** both_layers
**Notes:** **ANAL-D-09**: dois sinais combinados (whole-string + token overlap) para multi-token descriptors.

### Q3.3 — Filtering de falsos positivos

| Option | Description | Selected |
|--------|-------------|----------|
| length_ratio | Length ratio guard | |
| edit_distance_min | Min absolute edit distance | |
| combined | Length ratio + threshold + token Jaccard | |
| downstream_filter | Sem filtragem, deixar para revisão manual | |

**User's choice:** (custom) Precision over recall; sem substring containment standalone
**Notes:** **ANAL-D-10**: precision over recall; substring containment NÃO pode ser sinal standalone.

### Q3.4 — Threshold strategy

| Option | Description | Selected |
|--------|-------------|----------|
| constant | UPPER_SNAKE_CASE constant hardcoded | |
| param_with_default | Parâmetro de função com default | |
| per_algo | Constante por algoritmo | |

**User's choice:** (custom) Default high-precision >= 0.90, suggestions only
**Notes:** **ANAL-D-11**: default >= 0.90; apenas sugestões, nunca auto-merge.

---

## Area 4 — Alias Output Structure

**User's choice:** Skipped — agent's discretion
**Notes:** User pulou as questões dessa área. Decisões derivadas das já travadas (D-10, D-11):
- Pool: `frequency >= 2` (consistent com precision)
- Output: array estruturado com score/algo/frequencies/seed_annotation
- Direção canonical: hierarquia seed > frequency > lexicographic
- Family annotation sem constraint duro

---

## Area 5 — Semantic Stopwords

### Q5.1 — Onde implementar

| Option | Description | Selected |
|--------|-------------|----------|
| defer_to_5 | Deferir para Phase 5 | ✓ |
| phase_4_curated | Lista curada hardcoded em Phase 4 | |
| phase_4_statistical | Heurística estatística em Phase 4 | |
| phase_4_optional | Função opcional não aplicada por default | |

**User's choice:** defer_to_5
**Notes:** **ANAL-D-12**: Phase 4 preserva todos os descriptors normalizados válidos. Filtering é Phase 5 inference layer.

---

## Area 6 — Persistence

### Q6.1 — Estratégia de persistência

| Option | Description | Selected |
|--------|-------------|----------|
| in_memory_only | Pure in-memory, sem I/O | |
| in_memory_plus_optional | In-memory canonical + exporter opcional | ✓ |
| always_persist | Sempre persistir em data/analysis/ | |
| test_fixtures_only | Persistência apenas em fixtures de teste | |

**User's choice:** in_memory_plus_optional
**Notes:** **ANAL-D-13**: APIs retornam estruturas puras em memória; persistência opcional e desacoplada.

### Q6.2 — Estrutura de arquivos

| Option | Description | Selected |
|--------|-------------|----------|
| three_files | 3 arquivos separados (frequency, cooccurrence, alias_candidates) | ✓ |
| single_bundle | Bundle único 04-corpus-analysis.json | |
| you_decide | Discrição | |

**User's choice:** three_files (em `data/analysis/`, versionados como `.v1.json`)
**Notes:** **ANAL-D-14**: três arquivos separados em `data/analysis/`, versionados no nome (`descriptor_frequency.v1.json`, `descriptor_cooccurrence.v1.json`, `alias_candidates.v1.json`).

### Q6.3 — Determinismo no export

| Option | Description | Selected |
|--------|-------------|----------|
| sorted_deterministic | Arrays ordenadas, hash estável | ✓ |
| insertion_order | Insertion order | |
| you_decide | Discrição | |

**User's choice:** sorted_deterministic
**Notes:** **ANAL-D-15**: exports DEVEM ser deterministicamente ordenados para diffability + reproducibility.

---

## Smaller Decisions Formalized

### Q7.1 — Alias candidate pool size

| Option | Description | Selected |
|--------|-------------|----------|
| freq_2 | frequency >= 2 | |
| freq_3 | frequency >= 3 | |
| configurable_default_2 | Configurável, default = 2 | ✓ |

**User's choice:** configurable_default_2
**Notes:** **ANAL-D-16**: default frequency >= 2, threshold configurável. Aplicado APENAS em suggestion generation.

### Q7.2 — Self-pairs

| Option | Description | Selected |
|--------|-------------|----------|
| yes_explicit | Contrato formal explícito | ✓ |
| implicit_only | Deixar implícito | |

**User's choice:** yes_explicit
**Notes:** **ANAL-D-17**: self-pairs nunca emitidos; pair generation opera apenas sobre combinações únicas de descriptors distintos.

### Q7.3 — Performance contract

| Option | Description | Selected |
|--------|-------------|----------|
| explicit_benchmark | Threshold de segundos explícito + benchmark via performance.now() | |
| agent_discretion | Planner define threshold após medição real | |
| no_contract | Sem contract formal nesta phase | |

**User's choice:** (custom) Linear complexity contract + CI-safe benchmarks for regression detection
**Notes:** **ANAL-D-18**: complexidade linear sobre o corpus; sem materialização de matrizes densas; benchmarks via `performance.now()` com thresholds CI-safe apenas para regressions severas.

---

## Claude's Discretion

- **Area 4 (alias output structure):** Usuário pulou as questões. Defaults aplicados consistentes com ANAL-D-10/D-11.
- **Pair key encoding** dentro de `Map<pair_key, count>`: detalhe implementacional, decisão pertence ao PLAN.
- **Estrutura interna de `src/analyzer/`** (organização de módulos, nomes exatos de funções).
- **Specifics do benchmark** (thresholds exatos para CI, quantas iterations no smoke test).
- **Quais helpers derivados expor** (PMI, NPMI, Jaccard, conditional probabilities como funções puras opcionais).

## Deferred Ideas

- **Semantic stopwords** → Phase 5 (formalizado em ANAL-D-12).
- **PMI / NPMI / Conditional probabilities como output canônico** → derivadas opcionais, provavelmente úteis na Phase 5.
- **Auto-merge de alias candidates** → out of scope (ANAL-D-11 fixou suggestions only); workflow operacional fica para Phase 6 ou pós-milestone.
- **Cluster detection** → Phase 5 (INFR-02).
- **Pair key encoding format** → decisão de PLAN.

