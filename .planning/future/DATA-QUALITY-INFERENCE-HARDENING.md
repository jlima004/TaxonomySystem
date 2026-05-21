---
status: proposed
phase: future
executable: false
created_from: post-phase-6-artifact-review
planning_state: not_planned
tasks: none
plan: none
implementation: none
---

# Data Quality & Inference Hardening Backlog

This document captures future work discovered after Phase 6 verification. It is not an execution plan, not a Phase 7 context file, and not authorization to implement code or data migrations.

Current v1 artifacts under `data/compiled/v1/` remain deterministic, schema-valid and CLI-compilable. The findings below are semantic quality limitations and future curation concerns, not Phase 6 failures.

## Problem Summary

The v1 builder successfully compiles a hybrid taxonomy, curated alias map and sparse similarity graph. However, post-generation review showed that noisy corpus descriptors, minimal semantic noise configuration, permissive candidate placement, missing alias-aware statistics and empty curated graph inputs reduce semantic quality.

The main risk is treating corpus candidates as curated descriptors before additional hardening. Future work should keep seed taxonomy as curated truth and route uncertain corpus evidence through explicit review signals.

## Evidence From Generated Artifacts

- `taxonomy.json` is structurally valid and deterministic, but currently has 366 descriptors: 21 seed descriptors and 345 corpus candidates.
- Corpus candidates include generic or technical tokens such as `fruity`, `green`, `floral`, `sweet`, `herbal`, `spicy`, `fresh`, `woody`, `balsamic`, `fatty`, `waxy`, `at`, `in`, `de`, `hour_s`, `substantivity_232`, `substantivity_400` and `general_comment_at_100_00_lime`.
- `descriptor_aliases.json` contains curated aliases such as `orange flower -> orange_blossom`, but `taxonomy.json` still shows `orange_blossom` with frequency 0, suggesting curated aliases are not yet applied before statistics.
- Observed seed descriptors with frequency 0 include `bitter_orange`, `sweet_orange`, `jasmine`, `orange_blossom` and `tree_moss`.
- `similarity_matrix.json` is structurally valid, but current output can contain `edges: []`, `review_queue: []` and `density: 0` because `curated_relations.v1.json` and `accord_map.v1.json` are empty.
- `review_queue` exists in the Phase 5/6 artifact contract, but current artifacts do not yet populate it with actionable curation issues.

## Future Work Items

### DQ-01 Descriptor sanitation

Add a future pre-analysis sanitation boundary that distinguishes valid olfactive descriptors from technical/textual strings in `olfactory.descriptors`.

Observed noisy examples include `substantivity:400`, `substantivity:232`, `hour(s)`, `at`, `in`, `de`, `dipropylene`, `glycol`, `General comment At 100.00 %. lime`, `General comment At 0.10 % in dipropylene glycol. sulfurous`, `Odor strength none` and `recommend smelling in a 10.00 % solution or less`.

### DQ-02 Semantic noise schema v2

Evolve semantic noise handling beyond the current flat list. Future configuration should distinguish invalid descriptors from generic olfactive descriptors using categories such as `hard_exclude`, `pattern_exclude` and `downweight` while preserving Phase 5 compatibility.

Current `semantic_noise.v1.json` covers terms like `note`, `nuance`, `effect`, `type` and `quality`, but not real normalized noise such as `at`, `in`, `de`, `hour_s`, `dipropylene`, `glycol`, `substantivity_*`, `general_comment_*`, `odor_strength_*` or `recommend_smelling_*`.

### DQ-03 Alias-aware analysis

Apply curated aliases before frequency/co-occurrence so canonical descriptors aggregate alias evidence. Future seed profile generation should also use alias-canonicalized statistics.

### DQ-04 Candidate placement scoring

Harden corpus candidate placement beyond raw co-occurrence support of 1. Future scoring may consider higher support thresholds, normalized support, placement score, semantic noise penalties and routing weak candidates to review rather than taxonomy membership.

### DQ-05 Curated relation/accord bootstrap

Bootstrap enough `curated_relations.v1.json` and `accord_map.v1.json` coverage to produce positive similarity graph edges when curated data exists. Empty graph behavior remains valid, but empty curated inputs should be visible as curation gaps.

### DQ-06 Review queue population

Populate `review_queue` with actionable curation items rather than leaving it empty in real artifact review scenarios.

Suggested item types include `seed_descriptor_zero_frequency`, `hard_excluded_descriptor_detected`, `corpus_candidate_low_support`, `corpus_candidate_high_frequency_generic`, `empty_curated_relations`, `empty_accord_map`, `alias_frequency_merge_opportunity`, `suspicious_descriptor_from_ingestion` and `technical_token_in_descriptor_field`.

### DQ-07 Artifact quality gates

Add future non-contract-breaking quality gates for semantic artifact review. Candidate gates include excessive corpus candidate volume, technical tokens in descriptor fields, empty curated graph inputs, zero-frequency seed descriptors and unusually broad candidate placement into a small seed taxonomy.

### DQ-08 Seed taxonomy expansion

Evaluate whether the seed taxonomy needs additional families/subfamilies before routing many corpus candidates into a small MVP hierarchy.

Potential expansion candidates include Gourmand, Spicy, Green, Fruity, Animalic, Amber/Resinous, Marine/Ozonic, Musky and Leather/Tobacco.

## Non-goals For Current Project State

- Do not start Phase 7.
- Do not create `07-CONTEXT.md`, `07-PLAN.md`, `07-RESEARCH.md`, `07-VALIDATION.md` or `07-PATTERNS.md`.
- Do not implement `src/sanitizer/` or `descriptor_sanitizer.ts`.
- Do not implement alias-aware analysis now.
- Do not implement PMI/NPMI placement now.
- Do not populate `curated_relations.v1.json` or `accord_map.v1.json` now.
- Do not create `semantic_noise.v2.json` now.
- Do not change CLI, validators, compilers, normalizer or final v1 artifact contract now.
- Do not change `data/compiled/v1/` or `data/enriched_materials.json` now.

## Suggested Future Planning Questions

- Where should descriptor sanitation live relative to loaders, normalizer and analyzer?
- Which noisy tokens should be hard-excluded versus only downweighted?
- How should curated alias canonicalization affect historical frequency and co-occurrence evidence?
- What placement score is strong enough to include a corpus candidate in `taxonomy.json` instead of routing it to review?
- What minimum curated relation and accord coverage is needed to make `similarity_matrix.json` useful?
- Which review queue item types should be contract-stable versus internal diagnostics?
- Should future artifact quality gates fail compilation, warn only, or emit review queue items?
