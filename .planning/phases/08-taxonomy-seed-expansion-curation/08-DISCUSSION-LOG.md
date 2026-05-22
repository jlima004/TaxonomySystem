# Phase 8: Taxonomy Seed Expansion & Curation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions will be captured in `08-CONTEXT.md` after discussion produces enough stable decisions.

**Date:** 2026-05-22
**Phase:** 08-taxonomy-seed-expansion-curation
**Status:** active_for_context_gathering
**Execution readiness:** not_ready_for_execution
**Areas proposed:** Taxonomy scope, Seed versioning, Curation rules, Candidate review workflow, Alias expansion, Relation/accord expansion, Validation and quality gates

---

## Phase Boundary

Phase 8 is separate from Phase 7. Phase 7 was pipeline hardening; Phase 8 is manual taxonomy curation and seed expansion.

Phase 8 may discuss expanding curated families, subfamilies and descriptors; creating `taxonomy-seed.v2.json`; reviewing corpus candidates as suggestions; using `similarity_matrix.json.review_queue` as evidence; expanding `descriptor_aliases.seed.json`; expanding `curated_relations.v1.json` and `accord_map.v1.json`; and defining acceptance criteria for a more useful olfactive taxonomy v1.

Phase 8 must not auto-promote corpus candidates, treat review queue evidence as curated truth, create families or subfamilies by heuristic, change compiled artifacts during discussion, add runtime dependencies, perform external scraping/enrichment, or mix review-only evidence into seed truth.

---

## Post-Phase 7 Starting Context

Phase 7 completed and passed verification.

Verified commands and checks:

- `npm run typecheck` passed.
- `npm test` passed with 48 files / 345 tests.
- `npm run build` passed.
- `npm run compile -- --generated-at 2026-01-01T00:00:00.000Z` passed.
- `npm run compile:quality -- --generated-at 2026-01-01T00:00:00.000Z` passed.

Current artifact observations:

- `taxonomy.json` has 3 families, 6 subfamilies and 177 descriptors.
- Seed descriptor count is 21.
- Corpus candidate count is 156.
- `taxonomy.json` has no hard/pattern-exclude descriptors.
- `descriptor_aliases.json` has 10 authoritative aliases.
- New curated aliases include `jasmin -> jasmine`, `orangeflower -> orange_blossom`, and `orange blossom -> orange_blossom`.
- `jasmine` and `orange_blossom` now receive canonicalized frequency.
- `similarity_matrix.json.edges.length = 6`.
- `similarity_matrix.json.review_queue.length = 427`.
- Review queue type distribution is `corpus_candidate_low_support: 410` and `seed_corpus_conflict: 17`.

Known limitations to discuss:

- Curated relation and accord inputs are still a minimal bootstrap.
- Sparse graph is non-empty but low coverage.
- Seed descriptors with frequency 0 remain: `bitter_orange`, `sweet_orange`, `tree_moss`.
- Corpus candidates remain review-required and are not curated truth.
- The current seed is small and forces many candidates into a few generic subfamilies.
- `floral_rose`, `citrus_fresh` and `woody_dry` still absorb substantial evidence.

---

## Initial Discussion Prompt

Which areas do you want to discuss for Phase 8: Taxonomy Seed Expansion & Curation? Select all that apply.

| Option | Area | Description | Recommended |
|--------|------|-------------|-------------|
| 1 | Taxonomy scope | Quais families/subfamilies entram no seed expandido. | yes |
| 2 | Seed versioning | Criar `taxonomy-seed.v2.json` ou atualizar `taxonomy-seed.v1.json` com migração controlada. | yes |
| 3 | Curation rules | Critérios para um descriptor, family ou subfamily virar curated seed truth. | yes |
| 4 | Candidate review workflow | Como usar review_queue/corpus candidates da Phase 7 como evidência review-only sem auto-promover. | yes |
| 5 | Alias expansion | Quais aliases curados entram junto com novos descriptors. | yes |
| 6 | Relation/accord expansion | Como atualizar curated_relations e accord_map para novas subfamilies. | yes |
| 7 | Validation and quality gates | Como medir que o novo seed melhorou taxonomy.json, descriptor_aliases.json e similarity_matrix.json. | yes |

**Initial recommendation:** discuss all areas: 1, 2, 3, 4, 5, 6 and 7.

**User selection:** All areas.

Next discussion order:

1. Taxonomy scope
2. Seed versioning
3. Curation rules
4. Candidate review workflow
5. Alias expansion
6. Relation/accord expansion
7. Validation and quality gates

---

## Decision Capture Rules

Use decision IDs `CUR-D-01`, `CUR-D-02`, `CUR-D-03`, and so on.

Until `08-CONTEXT.md` exists, this log records proposed areas, alternatives and discussion notes only. No decision in this file authorizes implementation.

---

## Candidate Scope For Discussion

Recommended first discussion target: minimal manual expansion rather than a complete taxonomy.

Candidate families/subfamilies to discuss:

- `gourmand`: `vanilla`, `caramel`, `chocolate`, `nutty`
- `spicy`: `warm_spice`, `fresh_spice`
- `green`: `leafy_green`, `herbal_green`
- `fruity`: `red_fruit`, `tropical_fruit`, `orchard_fruit`
- `amber_resinous`: `amber`, `balsamic_resin`
- `animalic`: `musky`, `leathery`

Possible later-phase families:

- `marine_ozonic`
- `tobacco`
- `powdery`
- `aldehydic`
- `medicinal_camphoraceous`
- `earthy_mineral`
- `smoky`

---

## Deferred Until After Context Gathering

- `08-CONTEXT.md`
- `08-01-PLAN.md`
- `08-VALIDATION.md`
- `08-PATTERNS.md`
- `08-RESEARCH.md`
- Code changes
- Compiled artifact changes
