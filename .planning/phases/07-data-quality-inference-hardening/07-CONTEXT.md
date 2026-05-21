# Phase 7: Data Quality & Inference Hardening - Context

**Gathered:** 2026-05-21
**Status:** Ready for research and planning

<domain>
## Phase Boundary

Improve semantic data quality and inference confidence before treating `data/compiled/v1/` artifacts as a reliable olfactory taxonomy v1 for upper layers. Phase 7 hardens descriptor sanitation, semantic noise handling, curated alias canonicalization, candidate placement scoring, curated relation/accord bootstrap, review queue population, and artifact quality gates.

Phase 7 does not auto-promote corpus candidates into curated seed truth, does not turn alias candidates into authoritative aliases, does not add runtime dependencies, does not change `data/compiled/v1/` without migration-safe planning, and does not perform broad seed taxonomy expansion. Seed expansion is prepared as future manual curation only.

</domain>

<decisions>
## Implementation Decisions

Downstream plans and research must use only the decision IDs in this `07-CONTEXT.md` as canonical. Earlier discussion summaries used a different temporary numbering sequence and must not be mixed into Phase 7 plans.

### Descriptor Sanitation
- **DQ-D-01:** Apply strict pre-analysis descriptor sanitation after `normalizeDescriptor` and before frequency, co-occurrence, alias candidate pool, seed/corpus profiles, and placement scoring. Hard-excluded technical descriptors do not enter Phase 4 statistics.
- **DQ-D-02:** Do not remove generic but valid olfactive descriptors in the sanitizer. Generic descriptors are handled by semantic noise downweighting, not sanitation removal.
- **DQ-D-03:** The initial hard-exclude terms are `at`, `in`, `de`, `hour_s`, `dipropylene`, and `glycol`.
- **DQ-D-04:** The initial pattern-exclude rules are `^substantivity_\\d+$`, `^general_comment_`, `^odor_strength_`, `^recommend_smelling_`, and `.*_at_\\d+_\\d+.*`.
- **DQ-D-05:** Sanitizer output must include deterministic audit trail entries with `raw`, `normalized`, `reason`, `matched_rule`, and source/material id when available. The analysis wrapper must preserve the original raw descriptor and pass an input object such as `sanitizeDescriptor({ raw, normalized, material_id, source })`; a sanitizer that receives only `normalized` is insufficient for auditability.
- **DQ-D-06:** Sanitizer must be a pure function with no I/O and no runtime dependencies.

### Semantic Noise Schema v2
- **DQ-D-07:** Evolve `semantic_noise.v1.json` into a categorized v2 schema with `hard_exclude`, `pattern_exclude`, `downweight`, and a default downweight value.
- **DQ-D-08:** Preserve compatibility with the flat v1 noise list by interpreting legacy noise descriptors as downweight entries with the default weight.
- **DQ-D-09:** Seed descriptors are protected from automatic downweighting. If a seed descriptor matches a noise rule, preserve its semantic weight and emit an audit warning/review item.
- **DQ-D-10:** Corpus-derived noise suggestions are review-only by default and must not alter weights automatically.
- **DQ-D-11:** `hard_exclude` is reserved for obvious technical/noisy descriptors, not valid olfactive descriptors.
- **DQ-D-12:** `downweight` reduces influence in clustering, placement, and scoring but does not remove the descriptor.

### Alias-Aware Analysis
- **DQ-D-13:** Apply curated aliases before statistics using the pipeline `normalizeDescriptor(raw) -> sanitizeDescriptor(normalized) -> canonicalizeDescriptor(normalized, aliasSeed) -> frequency/co-occurrence/alias pool/seed profiles`.
- **DQ-D-14:** `canonicalizeDescriptor` uses only curated aliases from `data/taxonomy/descriptor_aliases.seed.json`. Alias seed keys and values must also be normalized with `normalizeDescriptor` before comparison so curated aliases such as `orange flower -> orange_blossom` match reliably.
- **DQ-D-15:** Alias candidates from Phase 4 remain weak evidence and never participate in automatic canonicalization or authoritative alias merging.
- **DQ-D-16:** Frequency, co-occurrence, alias candidate pool, seed profiles, and placement scoring operate on curated-alias-canonicalized descriptors.
- **DQ-D-17:** Alias application must preserve deterministic audit trail entries with `raw`, `normalized`, `canonical`, and `alias_source: curated_seed`.

### Candidate Placement Scoring
- **DQ-D-18:** Replace simple placement by co-occurrence support `>= 1` with conservative placement scoring.
- **DQ-D-19:** Hard-excluded descriptors are completely blocked from placement.
- **DQ-D-20:** Default v1 placement thresholds are `support >= 3`, `normalized_support >= 0.05`, and `placement_score >= 0.35`.
- **DQ-D-21:** `support` is the sum of co-occurrence between the candidate and seed descriptors in the target subfamily.
- **DQ-D-22:** `normalized_support = support / frequency(candidate)`.
- **DQ-D-23:** Initial score formula: `placement_score = 0.60 * min(1, support / 10) + 0.30 * min(1, normalized_support / 0.20) - 0.10 * noise_penalty`, where `noise_penalty = 0` for non-noisy descriptors and `1 - downweight_value` for downweighted descriptors.
- **DQ-D-24:** Semantic noise penalizes placement score but does not remove valid descriptors automatically.
- **DQ-D-25:** Candidates that fail conservative placement stay out of `taxonomy.json` and become `review_queue` items with evidence and suggested action.
- **DQ-D-26:** Placement should be implemented as a pure function such as `scoreCandidatePlacement(candidate, subfamily, evidence, options)`. The design is inference-owned, even if initial integration remains near `compile_taxonomy.ts` to reduce scope.

### Curated Relations And Accord Bootstrap
- **DQ-D-27:** Phase 7 should populate `curated_relations.v1.json` and `accord_map.v1.json` with a minimal manual bootstrap.
- **DQ-D-28:** Do not generate relations or accords automatically by heuristic in v1 hardening.
- **DQ-D-29:** Empty curated relation/accord inputs remain technically valid but generate review warnings: `empty_curated_relations` and `empty_accord_map`.
- **DQ-D-30:** When curated relation or accord inputs exist, tests must require `similarity_matrix.json.edges.length > 0`.
- **DQ-D-31:** Missing accord/tradition data remains neutral/undefined and never becomes automatic zero.
- **DQ-D-32:** Corpus/co-occurrence may support edge evidence summaries but must not define tradition or accord compatibility alone.
- **DQ-D-33:** Initial relation bootstrap candidates are `floral_rose <-> floral_white`, `citrus_fresh <-> citrus_bitter`, `woody_dry <-> woody_mossy`, `citrus_fresh <-> floral_white`, `woody_dry <-> floral_rose`, and `woody_mossy <-> floral_rose`.
- **DQ-D-34:** Initial accord bootstrap candidates are `citrus_fresh + floral_white`, `citrus_fresh + floral_rose`, `woody_dry + floral_rose`, `woody_dry + citrus_fresh`, and `woody_mossy + floral_rose`.

### Review Queue Population
- **DQ-D-35:** `similarity_matrix.json` remains the only final artifact with a `review_queue`.
- **DQ-D-36:** `taxonomy.json` does not duplicate the review queue; it only keeps compact descriptor flags such as `source`, `status`, `review_required`, and `corpus_derived`.
- **DQ-D-37:** The CLI prints a concise review summary with total review items, counts by severity, counts by type, validation status, and quality gate status.
- **DQ-D-38:** Review items are warnings/review data by default. Quality gates separately decide which issues fail compilation.
- **DQ-D-39:** Review queue ordering must be deterministic.
- **DQ-D-40:** Initial review item types are `seed_descriptor_zero_frequency`, `hard_excluded_descriptor_detected`, `corpus_candidate_low_support`, `corpus_candidate_high_frequency_generic`, `empty_curated_relations`, `empty_accord_map`, `alias_frequency_merge_opportunity`, `suspicious_descriptor_from_ingestion`, and `technical_token_in_descriptor_field`.

### Artifact Quality Gates
- **DQ-D-41:** `npm run compile` should run schema validation, deterministic payload ordering guarantees, and essential hard semantic gates by default. Byte-for-byte determinism between two runs belongs in tests/CI or `compile:quality`, not as a heavy default CLI check.
- **DQ-D-42:** Soft warnings and review queue items do not fail compilation by default.
- **DQ-D-43:** `npm run compile:quality` may emit a more detailed quality report with warning breakdown, candidates, rejected noise, and quality metrics, without creating extra artifacts by default. Detailed reports are console-only by default; any persisted report should require an explicit future flag.
- **DQ-D-44:** Hard gates fail the build for invalid schema, invalid null/undefined, hard-exclude terms in `taxonomy.json`, descriptor status/source inconsistency, alias candidates in `descriptor_aliases.json`, `final_score` outside `[0,1]`, divergent `generated_at` across artifacts, required descriptor id uniqueness violations, and nondeterministic output in tests/CI.
- **DQ-D-45:** Soft warnings/review items include seed descriptor zero frequency, empty curated inputs, low-support corpus candidates, high-frequency generic corpus candidates, alias frequency merge opportunities, sanitizer rejections, candidates excluded for low score, and `edges: []` when curated inputs are empty.
- **DQ-D-46:** If curated relations or accords are non-empty but `similarity_matrix.json` still has no edges, emit at least a high-severity warning. This may become a hard gate later.

### Seed Taxonomy Expansion
- **DQ-D-47:** Phase 7 prepares future `taxonomy-seed.v2.json` curation but does not perform broad seed expansion.
- **DQ-D-48:** Seed taxonomy expansion remains manual/curated; corpus evidence can suggest gaps but never creates seed truth automatically.
- **DQ-D-49:** Phase 7 may emit review-only gaps and suggestions for future families/subfamilies.
- **DQ-D-50:** Broad seed expansion should be planned as a separate phase or subphase after pipeline hardening.
- **DQ-D-51:** Minimal curated relations/accord bootstrap is allowed in Phase 7 and does not count as broad seed taxonomy expansion.

### Agent's Discretion
- Exact TypeScript module names and internal file organization, provided the pure-function, strict typing, deterministic ordering, and zero-runtime-dependency constraints are preserved.
- Exact review item evidence payload shape per item type, provided each item includes type, severity, affected entity, evidence, and suggested action.
- Exact `compile:quality` console/report formatting, provided no extra final artifacts are created by default.
- Exact plan wave boundaries, with the recommended split: `07-01 Descriptor sanitation + semantic noise v2`, `07-02 Alias-aware analysis`, `07-03 Conservative placement + review_queue`, and `07-04 Curated relations/accord bootstrap + quality gates`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope And Backlog
- `.planning/ROADMAP.md` - Phase 7 registration, dependency on Phase 6, and planning-only status.
- `.planning/REQUIREMENTS.md` - Future/backlog DQ-01 through DQ-08 and evidence behind hardening.
- `.planning/PROJECT.md` - Core value, constraints, key decisions, known v1 semantic limitations, and normalization vs sanitation architecture notes.
- `.planning/STATE.md` - Current phase state and carried-forward decisions.
- `.planning/future/DATA-QUALITY-INFERENCE-HARDENING.md` - Original post-Phase 6 semantic findings that motivated Phase 7.

### Prior Phase Decisions
- `.planning/phases/06-compilation-cli/06-CONTEXT.md` - compiled artifact boundary, review queue public artifact decision, all-or-nothing validation, deterministic output, and no sidecar diagnostics by default.
- `.planning/phases/05-inference-engine/05-CONTEXT.md` - seed authority, corpus candidate review boundary, semantic noise downweighting, review queue, sparse graph threshold, curated tradition/accord input rules.
- `.planning/phases/04-corpus-analysis/04-CONTEXT.md` - frequency/co-occurrence contracts, alias candidate contracts, Phase 4 non-filtering decision, and future alias-aware statistics note.
- `.planning/phases/03-normalization-pipeline/03-CONTEXT.md` - `normalizeDescriptor` contract, idempotency, canonical charset, empty output handling, and pipeline order.

### Existing Code Assets
- `src/normalizer/normalize_descriptor.ts` - canonical normalization that sanitation/canonicalization must follow.
- `src/analyzer/analyze_corpus.ts` - current top-level analysis orchestrator.
- `src/analyzer/frequency.ts` - current frequency computation directly normalizes `olfactory.descriptors`.
- `src/analyzer/cooccurrence.ts` - current co-occurrence computation directly normalizes `olfactory.descriptors`.
- `src/analyzer/alias_candidates.ts` - current weak alias candidate generation; must not become canonical merge.
- `src/inference/noise.ts` - current flat semantic noise scoring and corpus suggestion behavior.
- `src/inference/seed_profile.ts` - current seed/corpus profile construction, noise decisions, and review queue precedent.
- `src/inference/build_similarity_graph.ts` - sparse graph builder, dimension scoring, evidence, and review queue output.
- `src/compiler/compile_taxonomy.ts` - current permissive candidate placement with `minCooccurrenceSupport` default `1`.
- `src/compiler/validate_output.ts` - output schema validation precedent.
- `src/cli/compile.ts` and `src/cli/parse_args.ts` - compile CLI and default input paths.

### Data Files
- `data/taxonomy/taxonomy-seed.v1.json` - current curated seed truth.
- `data/taxonomy/descriptor_aliases.seed.json` - authoritative curated aliases for pre-analysis canonicalization.
- `data/inference/semantic_noise.v1.json` - current flat semantic noise input to migrate compatibly.
- `data/inference/curated_relations.v1.json` - curated relation input to bootstrap manually.
- `data/inference/accord_map.v1.json` - accord map input to bootstrap manually.
- `data/compiled/v1/taxonomy.json` - compiled taxonomy artifact to protect with quality gates.
- `data/compiled/v1/descriptor_aliases.json` - compiled authoritative alias artifact; must not include candidates.
- `data/compiled/v1/similarity_matrix.json` - sparse graph artifact and review queue location.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `normalizeDescriptor` already provides canonical string normalization and should remain before sanitation/canonicalization.
- `analyzeCorpus`, `computeFrequencyAndCoOccurrence`, and `findAliasCandidates` are the natural boundary for pre-analysis sanitation and curated alias canonicalization.
- `scoreSemanticNoise` and `suggestCorpusSemanticNoise` provide a starting point for v2 schema compatibility and review-only corpus suggestions.
- `buildSeedCorpusProfiles` already emits review queue items for seed/noise conflicts and corpus suggestions.
- `buildSimilarityGraph` already preserves deterministic `review_queue` ordering and edge evidence summaries.
- `compileTaxonomy` is the current placement integration point and should be hardened or delegated to a pure placement scorer.

### Established Patterns
- ESM modules, TypeScript strict, zero runtime dependencies.
- Pure functional core with explicit input data and deterministic return values.
- Filesystem I/O belongs at CLI/export boundaries.
- Deterministic sorting is mandatory for artifacts, review queues, and tests.
- Seed is curated truth; corpus/inferred data remains candidate/reviewable.
- Alias candidates are weak evidence and never authoritative merges.
- Missing curated tradition/accord data is neutral/undefined, not zero.

### Integration Points
- Add a sanitizer/canonicalization boundary before analysis statistics are computed.
- Ensure the analysis wrapper preserves raw descriptors alongside normalized descriptors so sanitation audit trail can include `raw` and material/source metadata.
- Extend semantic noise loading/validation to support v2 while accepting v1 flat lists.
- Normalize both keys and values from `descriptor_aliases.seed.json` before curated alias matching.
- Add conservative placement scoring as a pure function and connect it to taxonomy compilation or inference output.
- Populate review queue items from sanitizer, placement, alias opportunities, empty curated inputs, and quality gates.
- Extend CLI summary to include quality gate and review queue counts.

</code_context>

<specifics>
## Specific Ideas

- Recommended pre-research sequence: `07-RESEARCH.md`, `07-PATTERNS.md`, `07-VALIDATION.md`, then split execution plans into waves.
- Recommended plan split: `07-01 Descriptor sanitation + semantic noise v2`, `07-02 Alias-aware analysis`, `07-03 Conservative placement + review_queue`, and `07-04 Curated relations/accord bootstrap + quality gates`.
- Plans must cite only decision IDs from this `07-CONTEXT.md`.
- Suggested sanitizer input shape for auditability: `sanitizeDescriptor({ raw, normalized, material_id, source })`.
- `compile` should guarantee stable ordering and validate payloads; tests/CI should verify byte determinism across two runs; `compile:quality` can run additional checks.

- Suggested v2 semantic noise structure:
  ```json
  {
    "version": "2.0.0",
    "default_downweight": 0.35,
    "hard_exclude": ["at", "in", "de", "hour_s", "dipropylene", "glycol"],
    "pattern_exclude": ["^substantivity_\\\\d+$", "^general_comment_", "^odor_strength_", "^recommend_smelling_", ".*_at_\\\\d+_\\\\d+.*"],
    "downweight": {
      "note": 0.35,
      "nuance": 0.35,
      "effect": 0.35,
      "type": 0.35,
      "quality": 0.35,
      "sweet": 0.25,
      "fresh": 0.25,
      "green": 0.25,
      "floral": 0.25,
      "fruity": 0.25,
      "woody": 0.25,
      "spicy": 0.25,
      "herbal": 0.25,
      "natural": 0.25,
      "clean": 0.25
    }
  }
  ```
- Curated alias examples to verify pre-analysis canonicalization: `orange flower -> orange_blossom`, `oak moss -> oakmoss`, `patchouly -> patchouli`, `cedar wood -> cedarwood`, `sandal wood -> sandalwood`.
- Seed descriptors previously observed with zero frequency include `bitter_orange`, `sweet_orange`, `jasmine`, `orange_blossom`, and `tree_moss`; after alias-aware analysis, these should be reviewed again.
- The current `taxonomy.json` had 366 descriptors, with 21 seed descriptors and 345 corpus candidates; Phase 7 should reduce noisy/permissive candidate inclusion.

</specifics>

<deferred>
## Deferred Ideas

- Broad `taxonomy-seed.v2.json` expansion is deferred to a manual curation phase/subphase after pipeline hardening.
- Candidate future seed categories include Gourmand, Spicy, Green, Fruity, Animalic, Amber/Resinous, Marine/Ozonic, Musky, and Tobacco/Leather.
- Automatic corpus-derived family/subfamily creation remains out of scope.
- Turning graph-empty-with-curated-inputs into a hard failure is deferred; Phase 7 starts with high-severity warning unless planning decides otherwise.

</deferred>

---

*Phase: 07-Data Quality & Inference Hardening*
*Context gathered: 2026-05-21*
