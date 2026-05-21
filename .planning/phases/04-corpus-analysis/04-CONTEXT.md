# Phase 4: Corpus Analysis - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Extrair as estatísticas analíticas fundamentais sobre os descriptors normalizados do corpus (~33.742 materiais em `enriched_materials.json`) e gerar **sugestões** de aliases lexicais candidatos. Esta phase produz a camada de sinais estatísticos que alimenta o Inference Engine (Phase 5): frequência, co-ocorrência sparse e candidatos a alias. A camada é **puramente analítica** — não aplica filtragem semântica, não infere similaridade multi-dimensional, não materializa merges no seed.

**Separação fundamental:**
- `normalization (Phase 3)` → produz strings canônicas
- `corpus analysis (Phase 4)` → produz **estatísticas + candidatos lexicais** sobre essas strings
- `inference (Phase 5)` → aplica filtragem semântica, clustering, similaridade multi-dimensional

Phase 4 NÃO resolve aliases, NÃO faz merge no `descriptor_aliases.seed.json`, NÃO aplica stopwords semânticos.

</domain>

<decisions>
## Implementation Decisions

### Frequency Source & Scope
- **ANAL-D-01:** Descriptor frequency e co-occurrence statistics DEVEM ser computadas exclusivamente de `CorpusMaterial.olfactory.descriptors`. Outros campos textuais do material (`odor_description`, `descriptor_sources.tgsc`, `descriptor_sources.sf`) ficam FORA do scope desta phase.
- **ANAL-D-02:** `identity.aliases` NÃO contribui para estatísticas de descriptors, co-occurrence matrices ou geração de candidatos a alias. São metadata de identidade do MATERIAL, não descriptors olfativos.
- **ANAL-D-03:** Descriptors normalizados DEVEM ser deduplicados por material (descriptor-set) antes da contagem de frequência e da construção de pares de co-occurrence. Document frequency, não term frequency.
- **Implícito:** Outputs vazios do normalizer (`""`, conforme Phase 3 D-21) são descartados antes da contagem — descriptors inválidos não poluem estatísticas.

### Co-occurrence Semantics
- **ANAL-D-04:** Cada par de descriptors no mesmo material contribui com weight binário **+1** (após dedup do descriptor-set). Não há ponderação por frequência local, posição, ou outro fator.
- **ANAL-D-05:** Pares são **symmetric** e DEVEM ser armazenados em **ordem lexicográfica canônica** (`a < b` por string compare). Half-matrix sparse, única entrada por par.
- **ANAL-D-06:** Representação interna: sparse `Map<pair_key, count>`. Export determinístico como **edge list** (`Array<{a, b, count}>`). NÃO usar dense matrix N×N.
- **ANAL-D-07:** Threshold de frequência mínima NÃO é aplicado durante a contagem de co-occurrence. Filtering é responsabilidade downstream (Phase 5 ou consumidores específicos).
- **ANAL-D-17:** Self-pairs (`(A,A)`) NUNCA são emitidos. Pair generation opera apenas sobre combinações únicas de descriptors distintos dentro do descriptor-set deduplicado do material.

### String Similarity & Alias Detection
- **ANAL-D-08:** Alias candidate generation DEVE usar **normalized Levenshtein similarity** (`1 - distance/max(len)`) como métrica lexical primária.
- **ANAL-D-09:** Descriptors multi-token (snake_case com múltiplos segmentos) DEVEM ser comparados usando **dois sinais combinados**: whole-string lexical similarity (Levenshtein normalizado sobre a string completa) E token-level overlap similarity (e.g., Jaccard sobre o set de tokens após split em `_`).
- **ANAL-D-10:** Alias candidate generation DEVE priorizar **precision over recall**. Substring containment (e.g., `rose` contido em `rosewood`) NÃO pode ser sinal de similaridade standalone — pares estruturalmente diferentes que apenas compartilham substring devem ser rejeitados.
- **ANAL-D-11:** Thresholds de alias candidate DEVEM ter defaults high-precision (score >= 0.90) e o output DEVE produzir **apenas sugestões**, nunca merges automáticos no seed.
- **ANAL-D-16:** Alias candidate generation considera apenas descriptors com `frequency >= 2` por default. Threshold é configurável e aplicado APENAS na suggestion generation, NUNCA na contagem base de frequência/co-occurrence.

### Semantic Filtering
- **ANAL-D-12:** Semantic stopwords (e.g., `note`, `nuance`, `effect`, `type`, `quality`) NÃO são removidos na Phase 4. Corpus analytics preserva TODOS os descriptors normalizados válidos. Filtering/weighting semântico é responsabilidade da Phase 5 inference layer.

### Persistence & Output Format
- **ANAL-D-13:** Phase 4 APIs DEVEM retornar estruturas puras em memória (tipadas, `readonly`). Persistência em filesystem é OPCIONAL e desacoplada da computação analítica. Phase 5 nunca depende de leitura de arquivo da Phase 4.
- **ANAL-D-14:** Quando persistidos, artefatos analíticos vivem em `data/analysis/` com versionamento explícito no nome do arquivo. Três arquivos separados:
  - `data/analysis/descriptor_frequency.v1.json`
  - `data/analysis/descriptor_cooccurrence.v1.json`
  - `data/analysis/alias_candidates.v1.json`
- **ANAL-D-15:** Todos os exports analíticos DEVEM ser deterministicamente ordenados (descriptors lexicograficamente, alias candidates por score desc + lexicográfico como tiebreaker) para diffability via git e reproducibility entre runs.

### Performance & Complexity
- **ANAL-D-18:** Phase 4 analytics DEVEM operar em **complexidade linear sobre o corpus** para frequency e co-occurrence extraction (uma única passada). NÃO materializar matrizes densas em memória. Benchmarks via `performance.now()` em Vitest com thresholds CI-safe apenas para detectar regressions severas (não como hard performance contract).

### Claude's Discretion

Área 4 (estrutura do output de alias suggestions) foi deixada à discrição do planner/researcher, com as seguintes diretrizes derivadas das decisões travadas:
- Pool de comparison: `frequency >= 2` por default (ANAL-D-16)
- Output structure recomendado: array estruturado `{a, b, score, algo, frequencies: {a, b}, seed_annotation?}` ordenado por score desc
- Direção canonical do alias: hierarquia `seed > frequency > lexicographic` para determinismo e auditability
- Family annotation no output (sem constraint duro): annotar pares cross-family para revisão humana

Outras áreas à discrição:
- **Pair key encoding** (`Map<pair_key, count>`): formato exato do key (`"a|b"`, `"a::b"`, tuple-like) é detalhe implementacional — decisão pertence ao PLAN
- Organização interna de módulos em `src/analyzer/`
- Nomes exatos das funções públicas
- Quantidade exata de entradas no benchmark e thresholds CI específicos
- Decisão sobre quais helpers derivados expor (e.g., PMI, NPMI, Jaccard como funções puras sobre o sparse map + frequency map)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Domain Types (Phase 1 output)
- `src/types/corpus.ts` — Define `CorpusMaterial`, `OlfactoryProfile`, `MaterialIdentity`. Apenas `olfactory.descriptors` é input para Phase 4 (ver ANAL-D-01).
- `src/types/seed.ts` — Define `TaxonomySeed`, hierarquia families/subfamilies/descriptors. Referência para family annotation opcional no alias output.
- `src/types/alias.ts` — Define `DescriptorAliasSeed` (record string→string). Phase 4 NÃO escreve aqui, apenas referencia para evitar sugerir aliases já no seed.
- `src/types/registry.ts` — Define `DescriptorNode`, `DescriptorRegistry`. Estrutura node-based que pode hospedar `occurrence_count` derivado de Phase 4.
- `src/types/index.ts` — Barrel exports.

### Normalization (Phase 3 output — MUST consume)
- `src/normalizer/index.ts` — Barrel com atomic functions e `normalizeDescriptor` composer. Toda string de input DEVE passar por `normalizeDescriptor` antes da contagem.
- `src/normalizer/normalize_descriptor.ts` — Composer canônico com contract documentado (idempotency, canonical charset `^[a-z0-9_]+$`, empty output handling).

### Loaders (Phase 2 output — input source)
- `src/loader/corpus_loader.ts` — `loadCorpus(path): Promise<CorpusMaterial[]>` — fonte do corpus em memória.
- `src/loader/seed_loader.ts` — `loadTaxonomySeed(path)` — necessário para anotações opcionais de family/subfamily no alias output.
- `src/loader/alias_loader.ts` — `loadAliasSeed(path)` — necessário para excluir do alias candidate output pares já cobertos pelo seed manual.

### Data Files
- `data/enriched_materials.json` — Corpus bruto (~70MB, ~33.742 materiais; gitignored). Path tipicamente injetado via parâmetro (NÃO hardcoded — Phase 2 D-10).
- `data/taxonomy/taxonomy-seed.v1.json` — Seed manual de hierarquia (canonical descriptors).
- `data/taxonomy/descriptor_aliases.seed.json` — Seed manual de aliases. Phase 4 NÃO escreve aqui.
- `data/analysis/` (a criar) — Destino dos exports opcionais (ANAL-D-14).

### Prior Phase Context
- `.planning/phases/03-normalization-pipeline/03-CONTEXT.md` — Contratos de normalização: idempotency (D-23), canonical charset (D-09/D-20), empty output handling (D-21), pipeline order (D-22).
- `.planning/phases/02-data-loaders/02-CONTEXT.md` — Loader contracts: paths parametrizados (D-10), filtragem seletiva (D-07/D-08).

### Project References
- `.planning/ROADMAP.md` §Phase 4 — Goal, dependências (Phase 2 + Phase 3), success criteria, **Future Consideration** explícita sobre semantic stopwords (resolvido em ANAL-D-12).
- `.planning/REQUIREMENTS.md` §Analysis — ANAL-01 a ANAL-04 (frequency, co-occurrence, string similarity, alias detection).
- `.planning/PROJECT.md` §Constraints — Stack, convenções de código, sparse graph para similaridade (>0.25 é threshold de Phase 5, não Phase 4).

### Testing Patterns (Phase 3 reference)
- `src/tests/normalization/` — Padrão de organização por concern. Phase 4 deve seguir: `src/tests/analysis/frequency.test.ts`, `cooccurrence.test.ts`, `similarity.test.ts`, `alias_candidates.test.ts`.
- `src/tests/determinism.test.ts` — Padrão para testes de ordering determinístico (relevante para ANAL-D-15).
- `src/tests/stress.test.ts` — Padrão para benchmark com `performance.now()` (relevante para ANAL-D-18).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/normalizer/normalizeDescriptor`: pipeline canônico para qualquer descriptor input. Aplicar uma única vez por descriptor no entry do analyzer.
- `src/loader/corpus_loader.ts` → `loadCorpus`: já retorna `CorpusMaterial[]` deeply readonly; iteração linear single-pass é segura.
- `src/loader/alias_loader.ts` + `src/loader/alias_validator.ts`: úteis para carregar o seed atual de aliases e excluir pares já cobertos do output de candidatos.
- `src/types/registry.ts` → `DescriptorNode.occurrence_count`: campo já previsto para frequência derivada — Phase 5 ou Phase 6 pode preencher a partir do output da Phase 4.
- `src/tests/normalization/property.test.ts`: padrão para testes de propriedade (idempotency, determinism) — aplicar análogos em Phase 4 (e.g., commutativity de co-occurrence, monotonicity de frequência sobre subsets).

### Established Patterns
- ESM modules (`"type": "module"` em `src/package.json`)
- TypeScript strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Zero runtime dependencies — apenas built-ins do Node (fs/promises, path)
- Pure functions, arrow functions, **sem semicolons**
- `type` (não `interface`), snake_case files, camelCase functions, PascalCase types, UPPER_SNAKE_CASE constants
- `import type` para type-only imports, `readonly` arrays e objetos
- Vitest para testes em `src/tests/<concern>/`
- Performance contracts via `performance.now()` em Vitest (precedente: Phase 3 D-24)
- Validators retornam `ValidationResult<T>` com paths hierárquicos de erro (Phase 2 pattern)

### Integration Points
- `src/analyzer/` — diretório destino (atualmente vazio). Sugestão de organização:
  - `src/analyzer/frequency.ts` — `computeDescriptorFrequency(corpus): FrequencyMap`
  - `src/analyzer/cooccurrence.ts` — `computeCoOccurrence(corpus): CoOccurrenceMap`
  - `src/analyzer/similarity/levenshtein.ts` — `levenshteinDistance`, `levenshteinSimilarity`
  - `src/analyzer/similarity/token_overlap.ts` — `tokenOverlapSimilarity` (Jaccard ou similar)
  - `src/analyzer/alias_candidates.ts` — `findAliasCandidates(frequencyMap, options): AliasCandidate[]`
  - `src/analyzer/export.ts` — serializers determinísticos para `data/analysis/*.json`
  - `src/analyzer/index.ts` — barrel exports
- `src/tests/analysis/` — testes por concern, seguindo padrão de `src/tests/normalization/`
- `src/types/analysis.ts` (a criar) — definir `FrequencyMap`, `CoOccurrenceEdge`, `AliasCandidate` etc.

### Gotchas Identificados
- Corpus tem ~33.742 materiais; iteração linear é mandatory (ANAL-D-18). Construir frequency map e co-occurrence map em uma única passada se possível.
- Pair generation sobre descriptor-set de tamanho `k` gera `k*(k-1)/2` pares — corpus tail tem materiais com 5-15 descriptors típicos; o pior caso (50+ descriptors) deve ser raro mas precisa ser testado.
- O seed atual contém descriptors com underscores (`orange_blossom`, `lily_of_the_valley`) — token-level overlap (ANAL-D-09) precisa lidar corretamente com multi-token canonicals.
- `data/analysis/` ainda não existe — exports opcionais precisam criar o diretório se ausente (`mkdir -p` equivalent via `fs.promises.mkdir({ recursive: true })`).

</code_context>

<specifics>
## Specific Ideas

- O caso canônico de alias detection do ROADMAP é `"camomile" ↔ "chamomile"` — esse par DEVE estar em fixtures de teste e ser detectado pelo Levenshtein com score >= 0.90.
- Testes de propriedade recomendados para Phase 4:
  - **Commutativity:** `cooccurrence(a, b) === cooccurrence(b, a)` (decorre de D-05 mas teste explícito)
  - **Frequency monotonicity:** subset do corpus produz freq <= freq do corpus total para cada descriptor
  - **Sum invariant:** soma de frequências == número total de (material, descriptor) pairs após dedup
  - **Sparse map invariant:** nenhuma entrada com count == 0 no co-occurrence export
  - **Self-pair invariant:** nenhuma edge com `a === b` no export (ANAL-D-17)
- A função `normalizeDescriptor` é idempotente (Phase 3 D-23); a Phase 4 pode assumir que descriptors do corpus ainda não estão normalizados (TGSC/SF data) e DEVE normalizar no entry. NÃO confiar que o corpus já contém formas canônicas.
- Considerar expor uma função `analyzeCorpus(corpus, options): CorpusAnalysis` como API top-level que orquestra frequency + cooccurrence + alias candidates numa única passagem — facilita Phase 5 e simplifica o CLI da Phase 6.

</specifics>

<deferred>
## Deferred Ideas

### Semantic Stopwords (Phase 5)
ANAL-D-12 explicitamente defere remoção de stopwords semânticos (`note`, `nuance`, `effect`, `type`, `quality`, etc.) para Phase 5. Phase 4 preserva todos os descriptors normalizados válidos. A decisão de quais tokens são semanticamente ruidosos depende do clustering/inference layer, onde o impacto da filtragem é observável.

Retrospective note after Phase 6: Phase 4 correctly preserved all normalized descriptors by design. Later inspection showed some `olfactory.descriptors` inputs are semantically noisy, including technical/textual strings such as `substantivity:400`, `hour(s)`, `General comment At 0.10 % in dipropylene glycol. sulfurous`, `Odor strength none` and smelling recommendations. This is not a Phase 4 bug. Future hardening should sanitize descriptors before Phase 4 or add a pre-analysis sanitation step so frequency/co-occurrence do not treat comments, solvents, concentrations or substantivity metadata as descriptors.

### Alias-Aware Statistics (Future Hardening)

Phase 4 correctly treated alias candidates as suggestions and did not auto-merge them. Post-Phase 6 artifact review found a separate future need: curated aliases from `descriptor_aliases.seed.json` should be applicable as canonicalization input before frequency and co-occurrence, so aliases aggregate into canonical descriptors for statistics. This was not part of Phase 4 and is not active work.

### PMI / NPMI / Conditional Probabilities (Phase 5)
ANAL-D-04 escolheu binary +1 count over PMI-as-storage. Métricas derivadas (PMI, NPMI, Jaccard, conditional probability `P(B|A)`) podem ser computadas como funções puras a partir do `Map<pair_key, count>` + frequency map; provavelmente úteis na Phase 5 mas não fazem parte do output canônico da Phase 4.

### Auto-Merge de Alias Candidates (Out of Scope)
ANAL-D-11 fixou: apenas sugestões, nunca auto-merge. Workflow de merge revisado (human-in-the-loop) para `descriptor_aliases.seed.json` é trabalho operacional/CLI da Phase 6 ou fora do milestone v1.

### Cluster Detection (Phase 5)
Co-occurrence map é o **input** para clustering, mas a detecção de clusters em si pertence à Phase 5 (`INFR-02`). Phase 4 entrega o substrato; Phase 5 aplica algoritmos de clustering.

### Pair Key Encoding (PLAN-level)
Formato exato do `pair_key` em `Map<pair_key, count>` (`"a|b"`, `"a::b"`, tuple-like wrapper, etc.) é detalhe implementacional. Decisão fica para o PLAN da Phase 4.

### Reviewed Todos (not folded)
None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Corpus Analysis*
*Context gathered: 2026-05-17*
