# Olfactory Graph Contract (Phase 55)

## 1. Scope

Este documento fixa o contrato estático do read model olfativo v2.11. Phase 55 é estritamente contract-only: não implementa builder, loader, writer, CLI, generated graph JSON, query proof, structural validator, boundary audit hashing, Graphify integration, Neo4J/database integration ou runtime integration.

## 2. Schema Version

- `schema_version`: `olfactory_graph_read_model.v1`

## 3. Node Contract

### Node kinds

- `family`
- `subfamily`
- `descriptor`
- `alias`

### Required properties

- `family`: `family_id`, `name`
- `subfamily`: `subfamily_id`, `family_id`, `name`
- `descriptor`: `descriptor_id`, `family_id`, `subfamily_id`, `source`, `frequency`, `status`, `review_required`, `corpus_derived`
- `alias`: `alias`, `target_descriptor_id`

## 4. Edge Contract

### Edge kinds

- `contains_subfamily`
- `contains_descriptor`
- `resolves_to`
- `similar_to`

### Required edge properties

- `contains_subfamily`: `family_id`, `subfamily_id`
- `contains_descriptor`: `subfamily_id`, `descriptor_id`
- `resolves_to`: `alias`, `target_descriptor_id`
- `similar_to`: `source_subfamily_id`, `target_subfamily_id`, `score`, `dimensions`, `evidence`

### Optional edge properties

- `similar_to.final_score`

### Endpoint kinds

- `contains_subfamily`: `family` -> `subfamily`
- `contains_descriptor`: `subfamily` -> `descriptor`
- `resolves_to`: `alias` -> `descriptor`
- `similar_to`: `subfamily` -> `subfamily`

## 5. ID Namespace Rules

- Allowed node ID prefixes: `family:`, `subfamily:`, `descriptor:`, `alias:`
- Edge ID format: `edge:<edge_kind>:<source_graph_id>-><target_graph_id>`
- Raw IDs are not valid graph-global IDs.
- Collision examples that must remain distinct:
  - `family:floral` vs `descriptor:floral`
  - `subfamily:amber` vs `descriptor:amber`
  - `family:fresh_spice` vs `subfamily:fresh_spice`

## 6. Allowed Production Inputs

The only allowed production inputs are:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

No fourth production input is allowed. `data/enriched_materials.json`, `data/taxonomy/`, `data/inference/`, and `graphify-out/` are outside the production input contract.

## 7. Output Boundary

- Sanctioned source-of-truth output path: `data/read-models/olfactory-graph/v2.11/`
- `/tmp` policy: `/tmp` is verification-only support and must not become the source-of-truth graph output.
- Exact policy text: /tmp is verification-only support and must not become the source-of-truth graph output.
- Forbidden output prefixes:
  - `data/compiled/`
  - `data/taxonomy/`
  - `data/inference/`
  - `graphify-out/`

## 8. Forbidden Graph Node Prefixes

- `material:`
- `molecule:`
- `pubchem:`
- `review_item:`
- `score:`
- `graphify:`
- `neo4j:`

## 9. Graphify Separation

`graphify-out/**` is navigation-only context and is neither a production input nor an output for the v2.11 olfactory graph read model.

## 10. Zero-Dependency / Static Contract Rules

- Zero-dependency static TypeScript contract only
- No builder
- No loader
- No writer
- No CLI
- No generated graph
- No query proof
- No structural validator
- No boundary audit hashing
- No Neo4J or database
- No runtime

## 11. Phase 56 Invariant Handoff

Phase 56 consumes invariant names from this contract and implements the actual builder and structural validation later.

- `duplicate_node_id_detection`
- `duplicate_edge_id_detection`
- `missing_edge_endpoints`
- `wrong_endpoint_kinds`
- `invalid_alias_targets`
- `invalid_subfamily_similarity_endpoints`

## 12. Expected Baseline Stats

- `10 families`
- `18 subfamilies`
- `341 descriptors`
- `18 aliases`
- `13 subfamily-similarity edges`

## 13. Zero-Mutation Statement

Nenhum arquivo em `data/compiled/**`, `data/taxonomy/**`, `data/inference/**`, `graphify-out/**` ou `data/read-models/olfactory-graph/v2.11/` é criado ou mutado por este contrato. Phase 55 apenas declara paths, valores e regras.
