# Phase 5: Inference Engine - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Processar o seed curado + estatísticas da Phase 4 em uma camada de inferência semântica. Esta phase entrega merge seed/corpus, clustering de descriptors e similaridade multi-dimensional entre subfamilies, preservando um grafo esparso com scores `> 0.25` para a futura compilação. A phase NÃO promove automaticamente descobertas do corpus para a taxonomia curada e NÃO substitui o seed manual.

**Separação fundamental:**
- `seed manual` = curated truth
- `corpus evidence` = sinais estatísticos para inferência e revisão
- `inferred descriptors/clusters/relations` = candidates reviewable, separados do seed
- `compiled artifacts` = Phase 6 decide a materialização final em JSONs estáveis

</domain>

<decisions>
## Implementation Decisions

### Seed Authority & Corpus Inference
- **INFR-D-01:** O seed manual é a fonte curada de verdade (`curated truth`) e NUNCA deve ser sobrescrito automaticamente por evidência do corpus.
- **INFR-D-02:** Phase 5 pode criar `inferred descriptors`, `inferred clusters` e `candidate relations` a partir do corpus quando houver frequência suficiente e evidência estatística relevante.
- **INFR-D-03:** Todo item inferido do corpus DEVE ser marcado explicitamente como `inferred`, `corpus_derived` ou `candidate` e mantido separado do seed.
- **INFR-D-04:** Descriptors inferidos NÃO são promovidos automaticamente para a taxonomia curada. Eles podem aparecer em outputs paralelos como `inferred_descriptors`, `suggested_nodes`, `candidate_relations` ou `review_queue`.
- **INFR-D-05:** Conflitos entre seed e corpus viram itens estruturados de `review_queue`, não mutações automáticas.
- **INFR-D-06:** Clustering deve seguir abordagem híbrida: seed-anchored quando houver âncora clara, mas permitindo buckets/grupos inferidos para corpus-native clusters fortes que ainda precisam de revisão.
- **INFR-D-07:** Alias candidates da Phase 4 são apenas weak evidence. Nunca fazer auto-merge de alias candidates em canonical descriptors.

### Semantic Noise
- **INFR-D-08:** Semantic noise (`note`, `nuance`, `effect`, `type`, `quality`, etc.) deve ser downweighted, não removido. A inferência preserva traceability e reduz influência no scoring/clustering.
- **INFR-D-09:** A lista inicial de ruído semântico deve ser híbrida: curated noise list explícita + sugestões corpus-derived para revisão. Sugestões do corpus não são auto-aplicadas sem review.
- **INFR-D-10:** Seed descriptors têm exceção contra downweight automático. Se um seed descriptor coincidir com heurística de ruído, preservar o peso semântico e emitir audit warning/review signal.
- **INFR-D-11:** Decisions de downweight/noise devem ser expostas em audit/review output com termo, peso aplicado e motivo.

### Similarity Dimensions
- **INFR-D-12:** `tradition_score` em v1 combina três sinais separados: curated relations, seed proximity e corpus support.
- **INFR-D-13:** Curated relations e seed proximity têm prioridade sobre corpus evidence quando houver conflito. Corpus support sozinho não redefine tradição curada.
- **INFR-D-14:** Sinais de tradition NÃO devem ser misturados de forma opaca. Cada edge deve preservar dimension scores separados para revisão.
- **INFR-D-15:** `accord compatibility` começa em v1 como curated accord map. Co-occurrence pode apoiar a decisão, mas não define accord compatibility sozinho.
- **INFR-D-16:** O final similarity score deve ser configurável por weights puros/opcionais. Default esperado: semantic-primary, com tradition/accord como modificadores significativos.
- **INFR-D-17:** Missing curated data para tradition/accord é `neutral`/`undefined`, não penalidade e não zero automático.

### Explainability & Review Outputs
- **INFR-D-18:** Similarity edges devem carregar evidence summary compacto: final score, dimension scores e evidências resumidas como shared descriptors, co-occurrence support e curated relation/accord reference quando existir.
- **INFR-D-19:** Descriptor clusters devem incluir cluster evidence: representative descriptors, seed anchor quando houver, corpus support e resumo do motivo de membership.
- **INFR-D-20:** `review_queue` deve guardar explicação rica, conflitos e sugestões de curadoria. Itens devem identificar tipo, descriptors/subfamilies afetados, evidência e suggested action.
- **INFR-D-21:** Phase 5 pode manter ambos: campos compactos e estáveis em edges/clusters para consumo futuro, e review data rica para auditoria/tuning. Phase 6 decide o limite final dos artifacts públicos.

### Agent's Discretion
- Escolha exata dos thresholds para "frequência suficiente" e "evidência estatística relevante", desde que defaults sejam determinísticos, testáveis e documentados.
- Shape exato de `review_queue`, `inferred_descriptors`, `candidate_relations` e cluster evidence, desde que preserve as informações exigidas acima.
- Fórmula exata de combinação ponderada, desde que default seja semantic-primary, weights sejam configuráveis e dimension scores permaneçam separados.
- Organização interna dos módulos em `src/inference/` ou equivalente.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Requirements
- `.planning/ROADMAP.md` §Phase 5 — Goal, dependencies, success criteria, and planned split: merge seed/corpus + clustering, then multi-dimensional similarity engine.
- `.planning/REQUIREMENTS.md` §Inference — INFR-01 through INFR-04: seed merge, descriptor clustering, semantic overlap, accord compatibility and tradition.
- `.planning/PROJECT.md` §Constraints — Node.js + TypeScript, zero runtime dependencies, pure functional architecture, sparse graph, multi-dimensional similarity.

### Prior Phase Decisions
- `.planning/phases/04-corpus-analysis/04-CONTEXT.md` — Phase 4 explicitly deferred semantic stopwords, PMI/NPMI-derived metrics and clustering to Phase 5; defines frequency/co-occurrence and alias candidate contracts.
- `.planning/phases/03-normalization-pipeline/03-CONTEXT.md` — Normalization contracts: idempotency, canonical charset, empty output handling and pipeline order.
- `.planning/phases/02-data-loaders/02-CONTEXT.md` — Loader contracts: parameterized paths, seed is curated/manual, corpus field extraction.

### Existing Types
- `src/types/similarity.ts` — Existing `SimilarityGraph`, `SimilarityEdge`, dimension score structure and sparse graph output shape.
- `src/types/taxonomy.ts` — Existing compiled taxonomy types; `CanonicalDescriptor.source` already supports `seed | corpus | inferred`.
- `src/types/seed.ts` — Manual taxonomy seed shape: families, subfamilies and descriptors.
- `src/types/analysis.ts` — Frequency, co-occurrence, alias candidate and corpus analysis types produced by Phase 4.
- `src/types/registry.ts` — Descriptor node/registry shape; potential integration point, but note current file still uses semicolons unlike newer style.

### Existing Analysis Code
- `src/analyzer/analyze_corpus.ts` — Top-level Phase 4 orchestrator returning frequency, cooccurrence and alias candidates.
- `src/analyzer/cooccurrence.ts` — Computes document frequency and sparse co-occurrence in one pass over normalized descriptor sets.
- `src/analyzer/frequency.ts` — Computes descriptor document frequency.
- `src/analyzer/alias_candidates.ts` — Provides alias candidates with seed/taxonomy annotations; Phase 5 treats these as weak evidence only.
- `src/analyzer/similarity/levenshtein.ts` — Lexical similarity primitive from Phase 4.
- `src/analyzer/similarity/token_overlap.ts` — Token overlap primitive from Phase 4.
- `src/analyzer/index.ts` — Barrel export pattern to follow for inference module exports.

### Data Files
- `data/taxonomy/taxonomy-seed.v1.json` — Current manual seed with 3 families and 6 subfamilies; curated truth for v1 inference.
- `data/taxonomy/descriptor_aliases.seed.json` — Manual aliases; candidate aliases cannot override this automatically.
- `data/enriched_materials.json` — Raw corpus input (~70MB, gitignored). Phase 5 should consume through loader/analysis APIs rather than hardcoded paths.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/analyzer/analyze_corpus.ts` — Provides Phase 4 frequency/co-occurrence/alias candidate substrate for inference.
- `src/analyzer/cooccurrence.ts` — Co-occurrence map can support semantic overlap, corpus support and cluster evidence.
- `src/analyzer/alias_candidates.ts` — Supplies weak alias evidence with `suggested_canonical`, seed family annotations and cross-family flags.
- `src/normalizer/normalize_descriptor.ts` — Canonical descriptor normalization before any inference input comparison.
- `src/loader/seed_loader.ts` and `src/loader/alias_loader.ts` — Existing parameterized loaders for curated inputs.
- `src/types/similarity.ts` — Starting point for edge/dimension output, likely needs extension for evidence summary or companion review structures.
- `src/types/taxonomy.ts` — `CanonicalDescriptor.source` already models `inferred` descriptors.

### Established Patterns
- ESM modules, TypeScript strict, zero runtime dependencies.
- Pure functions, deterministic outputs, no classes, no mutation of external state.
- `type` over `interface`, `import type` for type-only imports, `readonly` arrays/objects.
- Snake_case file names, camelCase functions, PascalCase types, UPPER_SNAKE_CASE constants.
- Tests under `src/tests/<concern>/`; Phase 5 should likely use `src/tests/inference/`.
- Deterministic ordering is mandatory for diffability and reproducibility.

### Integration Points
- New inference module likely lives under `src/inference/` with a barrel `src/inference/index.ts`.
- Existing `src/types/similarity.ts` should be extended or paired with inference-specific review/evidence types.
- Phase 5 should consume `CorpusAnalysis` from `src/analyzer/analyze_corpus.ts`, not reimplement Phase 4 analytics.
- Phase 6 compiler will consume Phase 5 outputs to generate `taxonomy.json`, `descriptor_aliases.json` and `similarity_matrix.json`.

### Gotchas
- Current seed is intentionally small (3 families, 6 subfamilies), so tests need fixtures that cover inferred descriptors/clusters beyond seed content.
- Semantic noise was preserved in Phase 4 by design; Phase 5 must not assume frequency/co-occurrence inputs are semantically clean.
- Alias candidates are suggestions only. Auto-merging would violate Phase 4 and Phase 5 decisions.
- Missing curated tradition/accord data must not depress scores by accidental `0` defaults.

</code_context>

<specifics>
## Specific Ideas

- Rule to preserve in implementation docs/tests: `seed descriptor = curated truth`; `inferred descriptor = corpus evidence needing review`.
- Rule for tradition: `tradition_score = curated_prior + seed_proximity + corpus_support`, but with separated dimension scores and curated/seed signals taking priority over corpus support.
- Suggested review outputs: `review_queue`, `inferred_descriptors`, `suggested_nodes`, `candidate_relations`.
- Edge evidence should be compact enough for stable artifacts but rich enough to review: shared descriptors, co-occurrence support, curated relation and accord reference.
- Review queue should carry richer explanations for conflicts, noise audit warnings and curation suggestions.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Inference Engine*
*Context gathered: 2026-05-18*
