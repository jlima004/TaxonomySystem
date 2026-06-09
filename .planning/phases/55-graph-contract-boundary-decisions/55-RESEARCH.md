# Phase 55: Graph Contract & Boundary Decisions - Research

**Researched:** 2026-06-09  
**Domain:** Static TypeScript contract for v2.11 olfactory graph read-model boundaries  
**Confidence:** HIGH

## User Constraints

### Operator-Locked Decisions

- Phase 55 must lock the graph `schema_version`. [CITED: user objective/operator_context]
- Phase 55 must lock node kinds and edge kinds. [CITED: user objective/operator_context]
- Phase 55 must lock required properties. [CITED: user objective/operator_context]
- Phase 55 must lock type-prefixed graph ID rules. [CITED: user objective/operator_context]
- Phase 55 must lock the exact allowed inputs. [CITED: user objective/operator_context]
- Phase 55 must lock the graph read-model output path as `data/read-models/olfactory-graph/v2.11/`. [CITED: user objective/operator_context]
- Phase 55 must lock forbidden prefixes. [CITED: user objective/operator_context]
- Phase 55 must lock the invariants Phase 56 will implement and test. [CITED: user objective/operator_context]
- Phase 55 must not start builder implementation; it must produce the contract that protects later phases. [CITED: user objective/operator_context]

### Project-Locked Decisions

- v2.11 graph read-model outputs use `data/read-models/olfactory-graph/v2.11/`; `/tmp` is verification-only support. [CITED: .planning/STATE.md lines 49]
- v2.11 graph work remains zero-dependency, read-only, static, and detached from Neo4J, Graphify, and runtime systems. [CITED: .planning/STATE.md lines 50]
- Phase 55 depends on Phase 54 and covers only GCON-01 through GCON-04. [CITED: .planning/ROADMAP.md lines 98-107]
- The only allowed read-only inputs are `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json`, and `data/compiled/v2/similarity_matrix.json`. [CITED: .planning/REQUIREMENTS.md lines 13-16]
- Mutating taxonomy seeds, alias seed/exception policy, compiled v2 artifacts, or Graphify outputs is out of scope. [CITED: .planning/REQUIREMENTS.md lines 78-83]
- New graph/RDF/schema/CLI/scoring dependencies, Neo4J, Docker, database drivers, database tests, runtime APIs, UI, SaaS, RAG, and agent runtime are out of scope. [CITED: .planning/REQUIREMENTS.md lines 86-90]

### AGENTS.md Directives

- No `AGENTS.md` file exists at the repository root, so there are no AGENTS.md-specific directives to add. [VERIFIED: repository glob]

### CONTEXT.md

- No Phase 55 `*-CONTEXT.md` exists; this research is constrained by the user prompt, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, and repository evidence. [VERIFIED: gsd-sdk init.phase-op 55]

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GCON-01 | Maintainer can inspect a documented olfactory graph schema contract that defines graph schema version, node kinds, edge kinds, required properties, ID namespace rules and invariants. [CITED: .planning/REQUIREMENTS.md lines 11-16] | Plan a contract-only artifact under `src/graph_read_model/` plus documentation; include tests that assert exact schema version, kinds, properties, ID prefixes, forbidden graph prefixes, and Phase 56 invariant names. [VERIFIED: repo research] |
| GCON-02 | Maintainer can see the exact allowed read-only input artifacts for v2.11 graph generation: `data/compiled/v2/taxonomy.json`, `data/compiled/v2/descriptor_aliases.json`, and `data/compiled/v2/similarity_matrix.json`. [CITED: .planning/REQUIREMENTS.md lines 13-16] | Plan constants and tests that reject any fourth production input, especially `data/enriched_materials.json`, `data/taxonomy/**`, `data/inference/**`, and `graphify-out/**`. [CITED: .planning/REQUIREMENTS.md lines 72-90] |
| GCON-03 | Maintainer can verify raw taxonomy IDs are converted to type-prefixed graph IDs such as `family:*`, `subfamily:*`, `descriptor:*`, and `alias:*` to prevent cross-kind collisions. [CITED: .planning/REQUIREMENTS.md lines 15] | Plan fixture tests for known collisions: `family:floral` vs `descriptor:floral`, `subfamily:amber` vs `descriptor:amber`, and `family:fresh_spice` vs `subfamily:fresh_spice`. [CITED: .planning/research/PITFALLS.md lines 34-43] |
| GCON-04 | Maintainer can identify the sanctioned graph output location as `data/read-models/olfactory-graph/v2.11/`, with `/tmp` allowed for verification-only runs, and protected output prefixes explicitly forbidden. [CITED: .planning/REQUIREMENTS.md lines 16] | Plan output policy constants and tests for allowed default path, verification-only `/tmp`, and forbidden output prefixes `data/compiled/**`, `data/taxonomy/**`, `data/inference/**`, and `graphify-out/**`. [CITED: .planning/STATE.md lines 49-50; .planning/REQUIREMENTS.md lines 78-90] |

</phase_requirements>

## Summary

Phase 55 should deliver a contract and boundary specification only: a small TypeScript contract module plus a human-readable contract document and focused tests. [CITED: user objective/operator_context; .planning/ROADMAP.md lines 98-107] It must not add a graph builder, writer, CLI, query implementation, data loader, generated graph artifact, Neo4J mapping implementation, Graphify integration, or runtime/database dependency. [CITED: .planning/REQUIREMENTS.md lines 72-90]

The contract should lock `schema_version = "olfactory_graph_read_model.v1"`, node kinds `family | subfamily | descriptor | alias`, edge kinds `contains_subfamily | contains_descriptor | resolves_to | similar_to`, exact required properties, type-prefixed node IDs, edge ID format, exact production input paths, sanctioned output path, forbidden output prefixes, and Phase 56 invariants. [CITED: .planning/research/ARCHITECTURE.md lines 80-119; .planning/REQUIREMENTS.md lines 13-16] The planner should treat these as executable contract tests, not as builder tasks. [CITED: user objective/operator_context]

Repository evidence supports a zero-new-dependency plan using existing Node.js, strict ESM TypeScript, and Vitest conventions. [VERIFIED: src/package.json; src/tsconfig.json; npm list] Existing compiler validators, deterministic writer patterns, alias integrity tests, safety guard script, and live compiled artifacts provide the examples Phase 55 should reference without copying builder behavior. [VERIFIED: src/compiler/validate_output.ts; src/compiler/write_outputs.ts; src/tests/cli/alias_integrity.test.ts; scripts/check-safety-guards.sh]

**Primary recommendation:** Create contract-only artifacts and tests; defer all read/build/validate/write/query logic to Phase 56+. [CITED: user objective/operator_context; .planning/ROADMAP.md lines 109-142]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Graph schema contract | API / Backend static TypeScript module | Documentation | The contract constrains backend artifact generation and validation before any CLI or writer exists. [VERIFIED: repo architecture] |
| ID namespace rules | API / Backend static TypeScript module | Tests | Type-prefixed IDs are graph-domain invariants, not browser or database behavior. [CITED: .planning/REQUIREMENTS.md lines 15] |
| Allowed input list | API / Backend static TypeScript module | Tests | The builder in Phase 56 will be constrained to compiled artifacts only; Phase 55 should define the allowed path constants. [CITED: .planning/REQUIREMENTS.md lines 14] |
| Output boundary policy | API / Backend static TypeScript module | Tests | The eventual writer in Phase 58 will enforce the path policy; Phase 55 locks the policy and forbidden prefixes. [CITED: .planning/ROADMAP.md lines 133-142] |
| Phase 56 invariant list | API / Backend static TypeScript module | Documentation | The next phase will implement and test these invariants; Phase 55 must name them without implementing validation. [CITED: user objective/operator_context] |
| Graphify separation | Repository boundary / static policy | Tests | `graphify-out/**` is navigation context only and must not become an input or output for v2.11. [CITED: .planning/REQUIREMENTS.md lines 31, 83] |

## Locked Graph Contract Decisions

### Schema Version

| Field | Locked Value | Notes |
|-------|--------------|-------|
| `schema_version` | `olfactory_graph_read_model.v1` | Use this exact value in the contract; Phase 56 validation must fail on missing or wrong value. [CITED: .planning/research/ARCHITECTURE.md lines 82-91, 262-265] |

### Node Kinds and Required Properties

| Kind | ID Format | Required Properties | Source Artifact |
|------|-----------|---------------------|-----------------|
| `family` | `family:<family_id>` | `family_id`, `name` | `taxonomy.json.families[]` [CITED: .planning/research/ARCHITECTURE.md lines 94-101] |
| `subfamily` | `subfamily:<subfamily_id>` | `subfamily_id`, `family_id`, `name` | `taxonomy.json.families[].subfamilies[]` [CITED: .planning/research/ARCHITECTURE.md lines 94-101] |
| `descriptor` | `descriptor:<descriptor_id>` | `descriptor_id`, `family_id`, `subfamily_id`, `source`, `frequency`, `status`, `review_required`, `corpus_derived` | `taxonomy.json...descriptors[]` [CITED: .planning/research/ARCHITECTURE.md lines 94-101] |
| `alias` | `alias:<alias_id>` | `alias`, `target_descriptor_id` | `descriptor_aliases.json.aliases` [CITED: .planning/research/ARCHITECTURE.md lines 94-101] |

### Edge Kinds and Required Properties

| Kind | Source → Target | Required Properties | Source Artifact | Phase 56 Validation Invariant |
|------|-----------------|---------------------|-----------------|-------------------------------|
| `contains_subfamily` | `family:*` → `subfamily:*` | `family_id`, `subfamily_id` | Taxonomy hierarchy | Every subfamily has exactly one incoming `contains_subfamily`. [CITED: .planning/research/ARCHITECTURE.md lines 103-110, 279-280] |
| `contains_descriptor` | `subfamily:*` → `descriptor:*` | `subfamily_id`, `descriptor_id` | Taxonomy hierarchy | Every descriptor has exactly one incoming `contains_descriptor`. [CITED: .planning/research/ARCHITECTURE.md lines 103-110, 279-281] |
| `resolves_to` | `alias:*` → `descriptor:*` | `alias`, `target_descriptor_id` | Compiled alias map | Every alias has exactly one outgoing `resolves_to`, and every target is a descriptor node. [CITED: .planning/research/ARCHITECTURE.md lines 103-110, 281-282] |
| `similar_to` | `subfamily:*` → `subfamily:*` | `source_subfamily_id`, `target_subfamily_id`, `score`, `dimensions`, `evidence`; include `final_score` when present in source | Similarity matrix edges | Every similarity endpoint is a subfamily node; self-loops are forbidden in v2.11. [CITED: .planning/research/ARCHITECTURE.md lines 103-110, 269-284] |

### ID Namespace Rules

- Node IDs must use exactly one of these prefixes: `family:`, `subfamily:`, `descriptor:`, `alias:`. [CITED: .planning/REQUIREMENTS.md lines 15]
- Raw taxonomy IDs must be preserved as properties and must not be used as graph-global node IDs. [CITED: .planning/research/PITFALLS.md lines 34-43]
- Edge IDs are contractually deterministic and namespaced exactly as `edge:<edge_kind>:<source_graph_id>-><target_graph_id>`. [RESOLVED: operator revision context locks this format for Phase 55]
- `similar_to` edge endpoints should be stored once using a canonical sorted endpoint pair, not duplicated symmetrically, unless a later phase explicitly reopens the query contract. [CITED: .planning/research/PITFALLS.md lines 45-56]
- Forbidden graph node prefixes for v2.11: `material:`, `molecule:`, `pubchem:`, `review_item:`, `score:`, `graphify:`, `neo4j:`. [CITED: .planning/REQUIREMENTS.md lines 52-70, 86-90]

### Allowed Inputs and Output Boundary

| Category | Locked Value |
|----------|--------------|
| Allowed production inputs | `data/compiled/v2/taxonomy.json`; `data/compiled/v2/descriptor_aliases.json`; `data/compiled/v2/similarity_matrix.json` [CITED: .planning/REQUIREMENTS.md lines 14] |
| Forbidden production inputs | Any path outside the three allowed inputs, including `data/enriched_materials.json`, `data/taxonomy/**`, `data/inference/**`, and `graphify-out/**`. [CITED: .planning/REQUIREMENTS.md lines 72-90] |
| Sanctioned source-of-truth output path | `data/read-models/olfactory-graph/v2.11/` [CITED: .planning/STATE.md lines 49; .planning/ROADMAP.md lines 103-106] |
| `/tmp` policy | `/tmp` is allowed for verification-only support and must not be the milestone source-of-truth output. [CITED: .planning/STATE.md lines 49] |
| Forbidden output prefixes | `data/compiled/**`, `data/taxonomy/**`, `data/inference/**`, `graphify-out/**`. [CITED: .planning/REQUIREMENTS.md lines 78-83; scripts/check-safety-guards.sh lines 43-56] |
| Graphify policy | `graphify-out/GRAPH_REPORT.md` may be used for architecture/navigation context only; v2.11 must not read from or write to `graphify-out/**`. [CITED: user files_to_read; .planning/REQUIREMENTS.md lines 31, 83] |

## Exact Source Files and Artifact Examples for Planner

| Reference | Why Planner Should Reference It | Do / Do Not |
|-----------|---------------------------------|-------------|
| `.planning/STATE.md` | Contains current v2.11 decisions: output path, `/tmp`, zero-dependency/static/Graphify/Neo4J separation. [CITED: .planning/STATE.md lines 44-50] | Do copy boundary decisions; do not alter state in Phase 55. |
| `.planning/ROADMAP.md` | Defines Phase 55 scope and Phase 56/58 separation. [CITED: .planning/ROADMAP.md lines 98-142] | Do keep Phase 55 contract-only; do not pull builder/writer success criteria forward. |
| `.planning/REQUIREMENTS.md` | Defines GCON-01..GCON-04 and v2.11 out-of-scope boundaries. [CITED: .planning/REQUIREMENTS.md lines 11-90] | Do map tests directly to GCON IDs. |
| `data/compiled/v2/taxonomy.json` | Live shape has keys `version`, `generated_at`, `stats`, `families`; observed stats are 10 families, 18 subfamilies, 341 descriptors. [VERIFIED: python JSON inspection] | Do use as shape evidence; do not mutate or regenerate. |
| `data/compiled/v2/descriptor_aliases.json` | Live shape has `version`, `schema_version`, `generated_at`, `aliases`; observed alias count is 18. [VERIFIED: python JSON inspection] | Do use as alias node contract input shape; do not edit alias data. |
| `data/compiled/v2/similarity_matrix.json` | Live shape has `version`, `generated_at`, `threshold`, `dimensions`, `edges`, `review_queue`, `stats`; observed edge count is 13 and endpoints are raw subfamily IDs. [VERIFIED: python JSON inspection] | Do preserve score/dimensions/evidence semantics; do not reinterpret as descriptor/material similarity. |
| `src/types/taxonomy.ts` | Defines compiled taxonomy TypeScript shapes, including descriptor metadata fields. [VERIFIED: src/types/taxonomy.ts] | Do mirror property names in graph contract. |
| `src/types/similarity.ts` | Defines similarity edge fields `source`, `target`, `score`, optional `final_score`, `dimensions`, optional `evidence`, and stats. [VERIFIED: src/types/similarity.ts] | Do preserve fields; do not create new scoring semantics. |
| `src/compiler/types.ts` | Shows validation-result shape and `findNullsDeep` helper style. [VERIFIED: src/compiler/types.ts] | Do reference validation style; do not implement graph validation in Phase 55 beyond contract tests. |
| `src/compiler/validate_output.ts` | Existing compiled artifact validators reject missing fields, duplicates, inconsistent stats, invalid ranges, and deep nulls. [VERIFIED: src/compiler/validate_output.ts] | Do cite as pattern for Phase 56; do not copy into Phase 55 builder logic. |
| `src/compiler/write_outputs.ts` | Existing writer uses deterministic JSON with trailing newline and temp-file rename. [VERIFIED: src/compiler/write_outputs.ts] | Do document writer convention for later; do not add writer in Phase 55. |
| `src/tests/cli/alias_integrity.test.ts` | Demonstrates temp fixture setup, JSON output tests, and script-wiring assertions. [VERIFIED: src/tests/cli/alias_integrity.test.ts] | Do mimic contract/script tests; do not add graph CLI yet. |
| `src/tests/inventory/alias_target_inventory.test.ts` | Live alias integrity baseline verifies 18 aliases, 341 descriptors, 18 valid, 0 unresolved. [VERIFIED: src/tests/inventory/alias_target_inventory.test.ts] | Do use as integrity baseline evidence. |
| `scripts/check-safety-guards.sh` | Existing non-mutating guard blocks staged Graphify/protected path violations and protected working-tree diffs. [VERIFIED: scripts/check-safety-guards.sh] | Do include in verification; do not broaden by mutation. |
| `graphify-out/GRAPH_REPORT.md` | Navigation-only graph report identifies core code hubs like `compileAll()`, `runCompileCli()`, `buildSimilarityGraph()`, and alias/compiled types. [CITED: graphify-out/GRAPH_REPORT.md lines 51-61] | Do use for architecture awareness only; do not read as graph input or write under graphify-out. |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js | 24.14.0 available | Execute TypeScript-compiled CLIs and use built-in `fs`, `path`, and optional `crypto` for later phases. [VERIFIED: command `node --version`] | Existing CI/project runtime uses Node and no runtime dependencies are needed. [CITED: .planning/PROJECT.md lines 199-204] |
| TypeScript | 5.9.3 installed; `^5.8.0` declared | Static graph contract types and constants. [VERIFIED: npm list; src/package.json] | Existing package is strict ESM TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. [VERIFIED: src/tsconfig.json] |
| Vitest | 3.2.4 installed; `^3.2.0` declared | Contract and boundary tests. [VERIFIED: npm list; src/package.json] | Existing test suite uses Vitest and currently passes 390/390 tests. [VERIFIED: npm --prefix src test] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| npm | 11.9.0 available | Existing package scripts and verification commands. [VERIFIED: command `npm --version`] | Use `npm --prefix src run ...` commands from repo root. [VERIFIED: src/package.json] |
| Git | 2.54.0 available | Protected-boundary backstop. [VERIFIED: command `git --version`] | Use `git diff --exit-code -- data/taxonomy data/inference data/compiled/v2 graphify-out` in later boundary phases. [CITED: .planning/research/ARCHITECTURE.md lines 396-408] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| First-party contract constants/types | Zod/AJV/schema packages | Not needed for contract-only Phase 55 and explicitly excluded as new schema dependencies. [CITED: .planning/REQUIREMENTS.md lines 88-90] |
| Static JSON read-model contract | Neo4J/Docker/driver contract | Out of scope until a later milestone; v2.11 starts static and database-free. [CITED: .planning/REQUIREMENTS.md lines 57-65, 88] |
| Manual CLI/parser style in later phases | Commander/Yargs | New CLI parser dependency is not justified and new CLI work is not Phase 55. [CITED: .planning/research/STACK.md lines 57-67] |

**Installation:**

```bash
# No new packages for Phase 55.
```

## Package Legitimacy Audit

No external package installation is recommended for Phase 55. [CITED: .planning/REQUIREMENTS.md lines 88-90] Existing installed dev packages were inspected with `npm --prefix src list typescript vitest @types/node --depth=0`. [VERIFIED: npm list]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| N/A | N/A | N/A | N/A | N/A | N/A | No new install |

**Packages removed due to slopcheck [SLOP] verdict:** none.  
**Packages flagged as suspicious [SUS]:** none.

## Architecture Patterns

### System Architecture Diagram

```text
Phase 55 input evidence
  ├─ .planning/STATE.md / ROADMAP.md / REQUIREMENTS.md
  ├─ existing source/types/tests/scripts
  └─ live compiled artifact shape inspection
        ↓
Contract-only decisions
  ├─ schema_version
  ├─ node/edge kinds
  ├─ required properties
  ├─ ID prefix rules
  ├─ allowed input paths
  ├─ output path + forbidden prefixes
  └─ Phase 56 invariant names
        ↓
Phase 55 deliverables
  ├─ src/graph_read_model/contract.ts        (constants/types only)
  ├─ docs/olfactory_graph_contract.md        (human-readable contract)
  └─ src/tests/graph_read_model/contract.test.ts
        ↓
Phase 56 consumes contract
  └─ implements builder + structural validation from locked invariants
```

### Recommended Project Structure

```text
src/
├── graph_read_model/
│   └── contract.ts              # Phase 55: constants/types only; no builder, loader, writer, query code
└── tests/
    └── graph_read_model/
        └── contract.test.ts     # Phase 55: contract assertions mapped to GCON-01..GCON-04

docs/
└── olfactory_graph_contract.md  # Phase 55: maintainer-readable schema and boundary contract
```

Do not create `src/graph_read_model/build_graph.ts`, `validate_graph.ts`, `queries.ts`, `boundary_audit.ts`, `write_graph_outputs.ts`, or `src/cli/graph_read_model.ts` in Phase 55. [CITED: user objective/operator_context; .planning/ROADMAP.md lines 109-142]

### Pattern 1: Contract Constants, Not Builder Functions

**What:** Export immutable contract constants for schema version, node kinds, edge kinds, required properties, allowed inputs, output policy, forbidden prefixes, and invariant names. [VERIFIED: repo TypeScript conventions]

**When to use:** Phase 55 only; use this to make downstream builder code impossible to plan without a locked contract. [CITED: user objective/operator_context]

**Example:**

```typescript
// Source: repository convention from src/cli/parse_args.ts and strict readonly types.
export const OLFACTORY_GRAPH_CONTRACT = {
  schema_version: 'olfactory_graph_read_model.v1',
  allowed_inputs: [
    'data/compiled/v2/taxonomy.json',
    'data/compiled/v2/descriptor_aliases.json',
    'data/compiled/v2/similarity_matrix.json',
  ],
  output_path: 'data/read-models/olfactory-graph/v2.11/',
  node_kinds: ['family', 'subfamily', 'descriptor', 'alias'],
  edge_kinds: ['contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to'],
} as const
```

### Pattern 2: Executable Contract Tests

**What:** Write Vitest tests that assert exact values and forbid accidentally broad contract scope. [VERIFIED: src/tests/cli/alias_integrity.test.ts]

**When to use:** Use for GCON-01 through GCON-04 acceptance before any graph builder exists. [CITED: .planning/REQUIREMENTS.md lines 11-16]

**Example:**

```typescript
// Source: existing Vitest style in src/tests/cli/alias_integrity.test.ts
import { describe, expect, it } from 'vitest'
import { OLFACTORY_GRAPH_CONTRACT } from '../../graph_read_model/contract.js'

describe('olfactory graph contract', () => {
  it('locks exact allowed production inputs', () => {
    expect(OLFACTORY_GRAPH_CONTRACT.allowed_inputs).toEqual([
      'data/compiled/v2/taxonomy.json',
      'data/compiled/v2/descriptor_aliases.json',
      'data/compiled/v2/similarity_matrix.json',
    ])
  })
})
```

### Anti-Patterns to Avoid

- **Building the graph in Phase 55:** This violates the operator constraint and collapses Phase 55 into Phase 56. [CITED: user objective/operator_context; .planning/ROADMAP.md lines 109-119]
- **Adding a graph CLI or writer in Phase 55:** Writer and boundary audit belong to Phase 58, not Phase 55. [CITED: .planning/ROADMAP.md lines 133-142]
- **Using Graphify output as an input artifact:** `graphify-out/**` is protected and separate from v2.11. [CITED: .planning/REQUIREMENTS.md lines 31, 83]
- **Using raw IDs globally:** Raw IDs collide across family/subfamily/descriptor scopes. [CITED: .planning/research/PITFALLS.md lines 34-43]
- **Adding material/molecule/review nodes now:** These are future/out-of-scope requirements. [CITED: .planning/REQUIREMENTS.md lines 52-70, 86-90]

## Don't Hand-Roll

| Problem | Don't Build in Phase 55 | Use Instead | Why |
|---------|--------------------------|-------------|-----|
| Graph construction | `build_graph.ts` or artifact traversal | Contract constants + contract tests | Builder implementation is Phase 56. [CITED: .planning/ROADMAP.md lines 109-119] |
| Graph validation | `validate_graph.ts` endpoint checks | Phase 56 invariant list in contract | Structural validation is Phase 56. [CITED: .planning/ROADMAP.md lines 109-119] |
| Graph writing | `write_graph_outputs.ts`, output files, CLI | Output policy constants only | Writer/boundary audit is Phase 58. [CITED: .planning/ROADMAP.md lines 133-142] |
| Graph database | Neo4J/Docker/drivers | Documentation-only future boundary | DB/runtime work is explicitly out of scope. [CITED: .planning/REQUIREMENTS.md lines 57-65, 88] |
| Schema packages | Zod/AJV/new schema deps | First-party TypeScript constants/tests | New schema dependencies are excluded and unnecessary for controlled internal contract. [CITED: .planning/REQUIREMENTS.md lines 88-90] |

**Key insight:** Phase 55 is a guardrail phase; success means downstream phases are constrained, not that any graph can be built yet. [CITED: user objective/operator_context]

## Common Pitfalls

### Pitfall 1: Accidentally Implementing the Builder

**What goes wrong:** Planning adds `build_graph.ts`, loads compiled JSON, or produces graph nodes/edges in Phase 55. [CITED: user objective/operator_context]
**Why it happens:** The contract naturally describes how the graph will be built, so tasks can drift into Phase 56. [ASSUMED]
**How to avoid:** Limit Phase 55 files to `contract.ts`, a human-readable contract doc, and `contract.test.ts`. [VERIFIED: repo planning recommendation]
**Warning signs:** Tasks mention reading compiled artifacts at runtime, traversing families/subfamilies, emitting `graph.json`, or validating edge endpoints. [CITED: .planning/ROADMAP.md lines 109-142]

### Pitfall 2: Mutating Protected Inputs or Graphify Artifacts

**What goes wrong:** Graph work touches `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`. [CITED: .planning/REQUIREMENTS.md lines 78-83]
**Why it happens:** Existing compiler/writer patterns write official artifacts under `data/compiled/v2`. [VERIFIED: src/cli/parse_args.ts; src/compiler/write_outputs.ts]
**How to avoid:** Phase 55 should define forbidden output prefixes and run existing safety guard after changes. [VERIFIED: scripts/check-safety-guards.sh]
**Warning signs:** Git diff under protected paths or staged Graphify files. [VERIFIED: scripts/check-safety-guards.sh]

### Pitfall 3: Misinterpreting Similarity Semantics

**What goes wrong:** `similarity_matrix.json` edges are treated as descriptor/material similarity or complete negative knowledge. [CITED: .planning/REQUIREMENTS.md lines 86-88; .planning/research/PITFALLS.md lines 45-56]
**Why it happens:** The file name says matrix, but current artifact shape is sparse subfamily-to-subfamily edges. [VERIFIED: python JSON inspection; src/types/similarity.ts]
**How to avoid:** Contract `similar_to` endpoints as `subfamily:*` only and require preservation of score/dimensions/evidence. [CITED: .planning/REQUIREMENTS.md lines 23]
**Warning signs:** Contract contains descriptor-similarity, material-similarity, molecule, PubChem, or scoring nodes. [CITED: .planning/REQUIREMENTS.md lines 86-90]

### Pitfall 4: Losing Candidate/Review Metadata

**What goes wrong:** Descriptor nodes omit `source`, `status`, `review_required`, or `corpus_derived`, making candidates look curated. [CITED: .planning/research/PITFALLS.md lines 58-68]
**Why it happens:** Graph schemas often simplify node labels and drop uncertainty metadata. [ASSUMED]
**How to avoid:** Make these descriptor properties required in the contract. [CITED: .planning/research/ARCHITECTURE.md lines 94-101]
**Warning signs:** Contract uses only `id` and `name` for descriptors. [ASSUMED]

## Code Examples

### Minimal Contract Test for GCON-03

```typescript
// Source: existing Vitest style in src/tests/compiler/alias_target_integrity.test.ts
import { describe, expect, it } from 'vitest'
import { OLFACTORY_GRAPH_CONTRACT } from '../../graph_read_model/contract.js'

describe('graph ID namespace contract', () => {
  it('requires distinct type prefixes for known collision-prone raw ids', () => {
    expect(OLFACTORY_GRAPH_CONTRACT.id_prefixes.family).toBe('family:')
    expect(OLFACTORY_GRAPH_CONTRACT.id_prefixes.subfamily).toBe('subfamily:')
    expect(OLFACTORY_GRAPH_CONTRACT.id_prefixes.descriptor).toBe('descriptor:')
    expect(OLFACTORY_GRAPH_CONTRACT.id_prefixes.alias).toBe('alias:')

    expect('family:floral').not.toBe('descriptor:floral')
    expect('subfamily:amber').not.toBe('descriptor:amber')
  })
})
```

### Minimal Contract Test for GCON-04

```typescript
// Source: protected path policy from scripts/check-safety-guards.sh and .planning/REQUIREMENTS.md
import { describe, expect, it } from 'vitest'
import { OLFACTORY_GRAPH_CONTRACT } from '../../graph_read_model/contract.js'

describe('graph boundary contract', () => {
  it('locks the sanctioned output and forbidden prefixes', () => {
    expect(OLFACTORY_GRAPH_CONTRACT.output_path).toBe('data/read-models/olfactory-graph/v2.11/')
    expect(OLFACTORY_GRAPH_CONTRACT.forbidden_output_prefixes).toEqual([
      'data/compiled/',
      'data/taxonomy/',
      'data/inference/',
      'graphify-out/',
    ])
  })
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Official compiled outputs under `data/compiled/v2/` only | Derived graph read-model must live under `data/read-models/olfactory-graph/v2.11/` | v2.11 roadmap start, 2026-06-09 [CITED: .planning/STATE.md lines 49] | Prevents confusing graph outputs with official compiled taxonomy artifacts. |
| Alias integrity as historical audit only | `alias:integrity` and `verify:integrity` are local/CI guardrails | v2.10 [CITED: .planning/PROJECT.md lines 41-45, 74-79] | Phase 55 should preserve these guardrails and not wire graph work into normal compile. |
| Graphify as repository analysis artifact | v2.11 graph read model is separate from Graphify | v2.11 roadmap start [CITED: .planning/STATE.md lines 49-50] | Graphify report may inform navigation but cannot be an input/output artifact. |

**Deprecated/outdated:**
- Writing graph artifacts under `data/compiled/v2/` is not allowed for v2.11 because compiled artifacts are protected baseline outputs. [CITED: .planning/REQUIREMENTS.md lines 81-82]
- Treating the similarity artifact as descriptor-level or material-level similarity is explicitly out of scope. [CITED: .planning/REQUIREMENTS.md lines 86-87]

## Assumptions and Resolved Decisions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Edge IDs are locked as `edge:<edge_kind>:<source_graph_id>-><target_graph_id>`. | Locked Graph Contract Decisions | Resolved by operator revision context; Phase 56 should consume this exact deterministic edge ID convention unless a later explicit contract revision changes it. |
| A2 | Some pitfall causes/warning signs are inferred from standard graph-export failure modes. | Common Pitfalls | Low: factual boundaries are still verified from project docs; only the explanatory cause is assumed. |

## Open Questions (RESOLVED)

1. **Should Phase 55 create `docs/olfactory_graph_contract.md`, `src/graph_read_model/contract.ts`, or both?**
    - What we know: Planner needs an inspectable contract and executable tests. [CITED: .planning/REQUIREMENTS.md lines 13]
   - RESOLVED: Create both `src/graph_read_model/contract.ts` and `docs/olfactory_graph_contract.md`; TS constants make tests executable, and docs make maintainer inspection easy. [RESOLVED: operator revision context; VERIFIED: repo pattern]

2. **Should edge ID format be locked exactly as proposed?**
    - What we know: Duplicate edge detection is required in Phase 56. [CITED: .planning/REQUIREMENTS.md lines 28]
   - RESOLVED: Lock the exact format `edge:<edge_kind>:<source_graph_id>-><target_graph_id>` in Phase 55 so Phase 56 duplicate-edge detection has a deterministic contract to consume. [RESOLVED: operator revision context]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | TypeScript build/test execution | ✓ | 24.14.0 | None needed. [VERIFIED: command] |
| npm | Existing package scripts | ✓ | 11.9.0 | None needed. [VERIFIED: command] |
| TypeScript | Contract typecheck | ✓ | 5.9.3 installed | None needed. [VERIFIED: npm list] |
| Vitest | Contract tests | ✓ | 3.2.4 installed | None needed. [VERIFIED: npm list] |
| Git | Safety guard / diff verification | ✓ | 2.54.0 | None needed. [VERIFIED: command] |
| Bash | Existing safety guard script | ✓ | 5.2.21 | None needed. [VERIFIED: command] |

**Missing dependencies with no fallback:** none. [VERIFIED: environment audit]  
**Missing dependencies with fallback:** none. [VERIFIED: environment audit]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 installed; package declares `^3.2.0`. [VERIFIED: npm list; src/package.json] |
| Config file | `src/vitest.config.ts`, includes `tests/**/*.test.ts`. [VERIFIED: src/vitest.config.ts] |
| Quick run command | `npm --prefix src run typecheck && npm --prefix src test -- tests/graph_read_model/contract.test.ts` [VERIFIED: package scripts; ASSUMED test path before creation] |
| Full suite command | `npm --prefix src run typecheck && npm --prefix src test && npm --prefix src run verify:integrity -- --json && npm --prefix src run safety:guard` [VERIFIED: commands executed] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| GCON-01 | Contract exposes exact schema version, node kinds, edge kinds, required property lists, ID rules, and Phase 56 invariant names. | unit/contract | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ❌ Wave 0 |
| GCON-02 | Contract allowed input list equals exactly the three compiled v2 artifacts and contains no Graphify/taxonomy/inference/material input. | unit/contract | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ❌ Wave 0 |
| GCON-03 | Contract requires `family:`, `subfamily:`, `descriptor:`, and `alias:` prefixes and documents collision examples. | unit/contract | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ❌ Wave 0 |
| GCON-04 | Contract exposes `data/read-models/olfactory-graph/v2.11/`, `/tmp` verification-only policy, and forbidden output prefixes. | unit/contract | `npm --prefix src test -- tests/graph_read_model/contract.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm --prefix src run typecheck && npm --prefix src test -- tests/graph_read_model/contract.test.ts` [ASSUMED until test file exists]
- **Per wave merge:** `npm --prefix src run typecheck && npm --prefix src test` [VERIFIED: command]
- **Phase gate:** `npm --prefix src run typecheck && npm --prefix src test && npm --prefix src run verify:integrity -- --json && npm --prefix src run safety:guard` [VERIFIED: commands]

### Wave 0 Gaps

- [ ] `src/graph_read_model/contract.ts` — contract constants/types only; covers GCON-01..GCON-04. [VERIFIED: path absent by glob]
- [ ] `src/tests/graph_read_model/contract.test.ts` — executable contract assertions; covers GCON-01..GCON-04. [VERIFIED: path absent by glob]
- [ ] `docs/olfactory_graph_contract.md` — maintainer-readable contract; covers GCON-01..GCON-04. [ASSUMED recommended location]
- [ ] Optional docs assertion in contract test verifying the docs mention no builder/writer/Graphify/Neo4J scope. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth surface in a static repository contract. [VERIFIED: phase scope] |
| V3 Session Management | no | No sessions or runtime service in Phase 55. [VERIFIED: phase scope] |
| V4 Access Control | yes, repository boundary only | Forbidden input/output prefixes and safety guard checks protect privileged source/artifact boundaries. [CITED: .planning/REQUIREMENTS.md lines 78-90] |
| V5 Input Validation | yes | Contract names allowed inputs and Phase 56 source validation invariants; existing validators provide the pattern. [VERIFIED: src/compiler/validate_output.ts] |
| V6 Cryptography | later phases only | Hashing may be used for Phase 58 boundary audit via built-in `node:crypto`; Phase 55 should not implement hashing. [CITED: .planning/research/ARCHITECTURE.md lines 199-244] |

### Known Threat Patterns for Static Contract Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Protected artifact mutation by accidental output path | Tampering | Lock forbidden output prefixes and run `npm --prefix src run safety:guard`. [VERIFIED: scripts/check-safety-guards.sh] |
| Graphify artifact confusion | Tampering / Information boundary confusion | Contract states `graphify-out/**` is neither input nor output. [CITED: .planning/REQUIREMENTS.md lines 31, 83] |
| Dependency/scope creep | Elevation of privilege / Supply chain | No new packages; keep static TypeScript contract only. [CITED: .planning/REQUIREMENTS.md lines 88-90] |
| Semantic spoofing by raw ID collision | Integrity | Type-prefixed graph IDs and collision tests. [CITED: .planning/REQUIREMENTS.md lines 15; .planning/research/PITFALLS.md lines 34-43] |

## Sources

### Primary (HIGH confidence)

- `.planning/STATE.md` — current v2.11 decisions and boundary history. [CITED]
- `.planning/ROADMAP.md` — Phase 55 scope and downstream phase boundaries. [CITED]
- `.planning/REQUIREMENTS.md` — GCON-01 through GCON-04 and v2.11 out-of-scope list. [CITED]
- `.planning/PROJECT.md` — current milestone goals, constraints, and key decisions. [CITED]
- `src/package.json`, `src/tsconfig.json`, `src/vitest.config.ts` — stack and test commands. [VERIFIED]
- `src/types/taxonomy.ts`, `src/types/similarity.ts`, `src/compiler/types.ts`, `src/compiler/validate_output.ts`, `src/compiler/write_outputs.ts`, `src/compiler/alias_target_integrity.ts` — artifact shapes and validation/writer/integrity patterns. [VERIFIED]
- `src/tests/cli/compile.test.ts`, `src/tests/cli/alias_integrity.test.ts`, `src/tests/inventory/alias_target_inventory.test.ts`, `src/tests/compiler/validate_output.test.ts` — test patterns and live baseline assertions. [VERIFIED]
- `scripts/check-safety-guards.sh` — protected boundary guard. [VERIFIED]
- Live JSON inspection of `data/compiled/v2/taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json` — current shape and counts. [VERIFIED]

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md`, `.planning/research/STACK.md` — prior milestone research synthesized from repo evidence. [CITED]
- `graphify-out/GRAPH_REPORT.md` — architecture/navigation context only; not an input artifact. [CITED]

### Tertiary (LOW confidence)

- Resolved edge ID format and a few assumed explanatory pitfall causes; listed in Assumptions and Resolved Decisions Log. [RESOLVED edge ID by operator revision context; ASSUMED pitfall explanations]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing package and commands were inspected and executed. [VERIFIED]
- Architecture: HIGH — Phase boundaries are explicit in roadmap/requirements and existing repo patterns are clear. [CITED: .planning/ROADMAP.md; VERIFIED: source/tests]
- Contract decisions: HIGH for schema/node/edge/input/output boundaries from planning docs; exact edge ID syntax is resolved by operator revision context. [CITED: .planning/REQUIREMENTS.md; RESOLVED edge ID syntax]
- Pitfalls: HIGH — protected boundaries and known ID collisions are documented and supported by live artifact shapes. [CITED: .planning/research/PITFALLS.md; VERIFIED: compiled JSON inspection]

**Research date:** 2026-06-09  
**Valid until:** 2026-07-09, unless v2 compiled artifacts or v2.11 roadmap boundaries change first.
