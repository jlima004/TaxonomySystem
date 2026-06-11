# Phase 59: Live Artifact Regression, Documentation & Milestone Closure - Research

**Researched:** 2026-06-11  
**Domain:** Documentation-only graph read-model closure, Vitest regression evidence, milestone release closure  
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

Source: copied from `.planning/phases/59-live-artifact-regression-documentation-milestone-closure/59-CONTEXT.md` lines 32-72 and 160-168. [CITED: .planning/phases/59-live-artifact-regression-documentation-milestone-closure/59-CONTEXT.md]

### Locked Decisions

## Implementation Decisions

### Documentation Layout (GDOC-01, GDOC-02, GDOC-03)
- **D-01:** **Single maintainer guide** — create `docs/olfactory_graph_read_model.md` as the sole operational documentation file. Sections: read-model overview, protected inputs, `graph.json` output, `graph:build` workflow, validation/regression, query proof examples (copied from tests), GDOC-03 disclaimer banner, conceptual Neo4J mapping note.
- **D-02:** **Keep contract doc separate** — `docs/olfactory_graph_contract.md` remains the static Phase 55 contract reference. The maintainer guide links to it for full schema/invariant tables; do not duplicate contract tables in the guide (avoid dual sources of truth).
- **D-03:** **Portuguese narrative** — maintainer guide prose in Portuguese, matching `olfactory_graph_contract.md` and engine docs. Technical identifiers (paths, `query_kind`, CLI flags, function names) stay in English.
- **D-04:** **Disclaimer banner at guide top** — GDOC-03 prominent warning block at the top of `olfactory_graph_read_model.md`. States v2.11 outputs are derived read models for consultation, documentation, and future agent/RAG consumption; not official compiled taxonomy artifacts; not curation truth upgrades; do not replace protected `data/compiled/v2/*` files. No changes to `graph.json`, compiled artifacts, or output-dir README.
- **D-05:** **Neo4J section = mapping tables only** — conceptual section with tables: graph node kind → Neo4J label, edge kind → relationship type, ID prefix → property key. Brief prose on future export path. No Cypher snippets, no CSV samples, no Docker/drivers/import jobs.

### Live Regression Evidence
- **D-06:** **Document existing tests — no new regression test files** — maintainer guide cites current Vitest coverage as canonical regression proof. Phase 59 does not add mandatory new CLI tests; Phase 58 already covers `graph:build` integration, UAT, and guardrails.
- **D-07:** **`graph:build` as operator proof** — guide documents `npm run graph:build` as the maintainer command. Regression story = existing Vitest tests + documented baseline counts + expected CLI steps + expected stdout/`--json` audit proof shape.
- **D-08:** **Canonical regression test references** — guide lists each file with a one-line proof statement:
  - `src/tests/graph_read_model/live_artifact_baseline.test.ts` — build + validate from live v2 catalog; baseline stats
  - `src/tests/graph_read_model/query_live_baseline.test.ts` — aggregate query proofs over full catalog
  - `src/tests/graph_read_model/write_graph.test.ts` — writer path policy and atomic output
  - `src/tests/graph_read_model/boundary_audit.test.ts` — SHA-256 boundary audit behavior
  - `src/tests/cli/graph_read_model.test.ts` — CLI integration for `graph:build`
- **D-09:** **Baseline counts table** — dedicated table mapping each `10/18/341/18/13` metric to `GRAPH_EXPECTED_BASELINE_STATS` field, regression test source, and meaning. Suggested columns: `Métrica | Valor esperado | Fonte no contrato | Teste de regressão | O que prova`.

### Query Proof Examples (GDOC-01)
- **D-10:** **All 8 query kinds documented** — one example per stable `query_kind`: `descriptors_by_family`, `descriptors_by_subfamily`, `alias_resolution_path`, `descriptor_to_family_path`, `related_descriptors`, `similarity_neighborhood`, `cross_family_bridges`, `similarity_hub`.
- **D-11:** **Copy from test snapshots only** — examples copied from `query_graph.test.ts` (primary) and/or `query_live_baseline.test.ts` (aggregate-scale notes only). Do not load `graph.json` and re-run queries (Phase 58 D-21).
- **D-12:** **JSON code blocks** — each example as a fenced JSON block with brief Portuguese caption (params, result intent). Inline snapshots from `query_graph.test.ts` are the primary source for all 8 kinds.
- **D-13:** **Function mapping table** — guide includes: `GQRY requirement | Function name | query_kind | Example params | Source test`. Links public `query_graph.ts` API to documented examples for maintainers and future agent/RAG consumers.

### Milestone Closure
- **D-14:** **Dual closure artifacts** — (1) `59-VERIFICATION.md` in phase dir for Phase 59 success criteria, commands, tests, UAT, validation, security, final result; (2) `.planning/releases/v2.11-CLOSURE.md` for milestone archive following v2.8 release-closure pattern.
- **D-15:** **Primary milestone closure location** — canonical v2.11 closure lives at `.planning/releases/v2.11-CLOSURE.md` alongside prior release closures. Phase dir holds phase artifacts (`59-CONTEXT.md`, plans, summaries, `59-VERIFICATION.md`).
- **D-16:** **Boundary audit in closure = summary + sample JSON shape** — `v2.11-CLOSURE.md` documents expected `graph:build --json` audit structure: protected files unchanged, `graphify_out_accesses: 0`, `output_written: data/read-models/olfactory-graph/v2.11/graph.json`, `forbidden_prefix_rejections: []`, proof via `boundary_audit.test.ts`. No full SHA-256 digest list embedded; no persisted audit file.
- **D-17:** **Full 22-requirement checklist** — closure table with one row per v2.11 requirement. Columns: `Requirement ID | Grupo | Phase | Status | Proof reference`. Covers GCON, GBLD, GVAL, GQRY, GDOC groups. Each row points to test, doc, phase summary, verification, UAT, or artifact evidence.

### the agent's Discretion

### Agent Discretion
- Exact section ordering and heading names inside `olfactory_graph_read_model.md`.
- Which specific inline snapshot per `query_kind` to copy when multiple exist in `query_graph.test.ts`.
- Aggregate-scale notes to pull from `query_live_baseline.test.ts` (e.g., bridge count, hub degree).
- Sample audit JSON excerpt formatting in closure doc (representative fields vs full example block).
- Whether `59-VERIFICATION.md` is produced during planning or execution (workflow convention).

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- **`query_proofs.json` on disk** — rejected in Phase 58; documentation copies from tests instead
- **Disclaimer in `graph.json` or output-dir README** — operator rejected; guide banner only
- **Full SHA-256 digest list in closure doc** — operator rejected; summary + sample JSON shape only
- **Neo4J Cypher/CSV examples** — operator chose mapping tables only; implementation deferred to GDB-01 future milestone
- **Expanding contract doc into full guide** — operator rejected to preserve contract/operations separation

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GDOC-01 | Maintainer can read documentation explaining schema, input artifacts, output artifacts, validation workflow, protected boundaries, and query proof examples. [CITED: .planning/REQUIREMENTS.md lines 44-44] | Use `docs/olfactory_graph_contract.md` as linked contract source, `contract.ts` constants for exact paths/counts, existing Vitest tests as evidence, and query examples copied from `query_graph.test.ts` object expectations. [VERIFIED: docs/olfactory_graph_contract.md; src/graph_read_model/contract.ts; src/tests/graph_read_model/query_graph.test.ts] |
| GDOC-02 | Maintainer can read a future Neo4J mapping note without adding Neo4J, Docker, drivers, Cypher import jobs, or database tests. [CITED: .planning/REQUIREMENTS.md lines 45-45] | Produce conceptual mapping tables only: node kind → label, edge kind → relationship type, ID prefix → property key. [CITED: 59-CONTEXT.md lines 39-40] |
| GDOC-03 | Maintainer can see a disclaimer that v2.11 graph outputs are derived read models, not official compiled taxonomy publication artifacts or curation truth upgrades. [CITED: .planning/REQUIREMENTS.md lines 46-46] | Put the disclaimer banner at the top of `docs/olfactory_graph_read_model.md`; do not embed disclaimer metadata in `graph.json` or output README. [CITED: 59-CONTEXT.md lines 38-40, 160-166] |

</phase_requirements>

## Summary

Phase 59 should be planned as a documentation-and-closure phase, not an implementation phase: create a Portuguese maintainer guide at `docs/olfactory_graph_read_model.md`, create `.planning/releases/v2.11-CLOSURE.md`, and record phase verification in `59-VERIFICATION.md`. [CITED: 59-CONTEXT.md lines 11-17, 59-63] The existing codebase already contains the graph contract, pure builder, validator, query proof functions, writer, boundary audit, CLI, tests, generated `graph.json`, and Phase 58 verification evidence. [VERIFIED: src/graph_read_model/contract.ts; src/graph_read_model/query_graph.ts; src/cli/graph_read_model.ts; 58-VERIFICATION.md]

The most important planning constraint is evidence provenance: query examples must be copied from `src/tests/graph_read_model/query_graph.test.ts`, not regenerated from `graph.json`; live-regression claims must cite existing Vitest tests and Phase 58 verification instead of adding new mandatory regression files. [CITED: 59-CONTEXT.md lines 42-57] A small wording drift exists: the context calls these “inline snapshots,” but the current test file uses literal `expect(...).toEqual({...})` expected-object assertions, and no `toMatchInlineSnapshot`/snapshot matcher is present under `src/tests/graph_read_model`. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts lines 214-218, 260-270, 300-309, 351-406, 497-539, 549-560; grep `toMatchInlineSnapshot|toMatchSnapshot`]

**Primary recommendation:** Plan two execution slices: (1) write the Portuguese maintainer guide from verified source/test excerpts; (2) write the v2.11 closure and phase verification by citing phase summaries, requirements, tests, and Phase 58 boundary evidence, with no new packages, no Neo4J implementation, no graph query reruns, and no mutations to protected taxonomy/compiled/inference/Graphify paths. [VERIFIED: 59-CONTEXT.md; .planning/REQUIREMENTS.md; 58-VERIFICATION.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Maintainer guide | Documentation | TypeScript source/tests | The guide explains existing artifacts and links to code/test evidence; it must not become a second schema source of truth. [CITED: 59-CONTEXT.md lines 35-38] |
| Live regression evidence | Test suite | Documentation | Existing Vitest tests are the proof source; documentation summarizes their meaning. [CITED: 59-CONTEXT.md lines 42-51] |
| Query proof examples | Test suite | Documentation | Examples come from `query_graph.test.ts` expected objects, not from a runtime query execution. [CITED: 59-CONTEXT.md lines 53-57] |
| Operator `graph:build` workflow | CLI | Documentation | CLI code owns load→build→validate→write→audit→guardrails behavior; docs explain command usage and expected proof shape. [VERIFIED: src/cli/graph_read_model.ts lines 54-84, 163-323] |
| v2.11 milestone closure | Planning docs | Phase summaries/tests | Closure artifact records shipped proof and requirements checklist; it should not run full milestone archival/tagging. [CITED: 59-CONTEXT.md lines 59-63; .agents/skills/gsd-complete-milestone/SKILL.md lines 84-109] |
| Future Neo4J mapping | Documentation | Future milestone | Phase 59 maps concepts only; database/export implementation is deferred to GDB-01. [CITED: .planning/REQUIREMENTS.md lines 57-60, 88-90; 59-CONTEXT.md lines 39-40] |

## Project Constraints (from AGENTS.md)

- No `AGENTS.md` file was found in `/home/jlima/Projetos/TaxonomySystem`. [VERIFIED: glob `AGENTS.md`]
- Relevant project skills exist under `.agents/skills/`; `gsd-docs-update` emphasizes codebase-verified documentation with no hallucinated paths, and `gsd-complete-milestone` separates full milestone archival/tagging from release closure artifacts. [VERIFIED: .agents/skills/gsd-docs-update/SKILL.md lines 6-15; .agents/skills/gsd-complete-milestone/SKILL.md lines 84-109]
- Phase 59 should not invoke the full `/gsd-complete-milestone` archive/tag flow unless explicitly requested; the locked deliverable is `.planning/releases/v2.11-CLOSURE.md`, not roadmap collapse, requirements deletion, or git tagging. [CITED: 59-CONTEXT.md lines 59-63; VERIFIED: .agents/skills/gsd-complete-milestone/SKILL.md lines 91-109]

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Markdown files | repository-local | Maintainer guide, phase verification, release closure | Existing project docs and release closures are Markdown files under `docs/`, `.planning/phases/**`, and `.planning/releases/**`. [VERIFIED: docs/olfactory_graph_contract.md; .planning/releases/v2.8.0-CLOSURE.md; 58-VERIFICATION.md] |
| TypeScript | installed `5.9.3`; locked range `^5.8.0`; npm latest `6.0.3` | Typecheck source references and CLI code | Project uses strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`; no TypeScript package changes are needed for docs-only work. [VERIFIED: src/tsconfig.json lines 2-16; bash `npx tsc --version`; npm registry] |
| Vitest | installed `3.2.4`; locked range `^3.2.0`; npm latest `4.1.8` | Existing regression evidence | Current graph tests use Vitest `describe/it/expect`; keep using existing tests as evidence instead of creating new required tests. [VERIFIED: src/package.json lines 19-23; src/package-lock.json lines 850-852; npm registry; Context7 /vitest-dev/vitest/v3_2_4] |
| Node.js/npm | Node `v24.14.0`, npm `11.9.0` | Run existing scripts if verification needs them | `src/package.json` defines `typecheck`, `test`, integrity commands, and `graph:build`. [VERIFIED: bash version probe; src/package.json lines 6-18] |

### Supporting

| Tool/File | Version/State | Purpose | When to Use |
|-----------|---------------|---------|-------------|
| `docs/olfactory_graph_contract.md` | Phase 55 contract doc | Link for schema/invariant/source-of-truth tables | Use as reference, not as content to duplicate. [VERIFIED: docs/olfactory_graph_contract.md lines 1-134] |
| `src/graph_read_model/contract.ts` | current repo | Exact constants for schema, allowed inputs, output policy, baseline stats | Cite for exact paths/counts and avoid hand-entered drift. [VERIFIED: src/graph_read_model/contract.ts lines 1-77] |
| Existing graph tests | current repo | Regression proof references | Cite in guide and closure; do not add mandatory new tests. [VERIFIED: src/tests/graph_read_model/*.test.ts; src/tests/cli/graph_read_model.test.ts] |
| `graphify-out/GRAPH_REPORT.md` | built from current commit `674302ae` | Navigation context only | Read-only context; do not modify or use as v2.11 read-model input. [VERIFIED: graphify-out/GRAPH_REPORT.md lines 12-15; git rev-parse HEAD] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-written maintainer guide | Generated docs workflow | Locked decision requires a single specific guide and exact copied proof examples; generated docs risk path/example drift. [CITED: 59-CONTEXT.md lines 35-57] |
| Existing Vitest evidence | New CLI/regression tests | New mandatory tests are explicitly out of scope unless real documentation drift is found. [CITED: 59-CONTEXT.md lines 18-23, 42-44] |
| Conceptual Neo4J mapping tables | Cypher/CSV/Docker docs | Implementation details are deferred and would violate GDOC-02 boundary. [CITED: .planning/REQUIREMENTS.md lines 45-45, 57-60] |

**Installation:**

```bash
# No installation for Phase 59.
# Use existing repository dev dependencies only.
```

**Version verification:** Versions above were checked from `src/package.json`, `src/package-lock.json`, local CLI versions, and npm registry metadata. [VERIFIED: src/package.json; src/package-lock.json; bash version probe; npm registry]

## Package Legitimacy Audit

No external package installation is recommended for Phase 59, so the Package Legitimacy Gate is not applicable. [VERIFIED: 59-CONTEXT.md lines 18-28; src/package.json lines 19-23]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| none | — | — | — | — | not run | No install planned. [VERIFIED: phase scope] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: no packages recommended]  
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: no packages recommended]

## Architecture Patterns

### System Architecture Diagram

```text
Existing v2.11 graph implementation/tests
  ├─ contract.ts + docs/olfactory_graph_contract.md
  ├─ build_graph.ts + validate_graph.ts + live_artifact_baseline.test.ts
  ├─ query_graph.ts + query_graph.test.ts + query_live_baseline.test.ts
  └─ graph_read_model CLI + writer/boundary/CLI tests + Phase 58 verification
        │
        ▼
Phase 59 documentation synthesis
  ├─ Portuguese maintainer guide (docs/olfactory_graph_read_model.md)
  │    ├─ top disclaimer banner (GDOC-03)
  │    ├─ linked schema/input/output/workflow explanation (GDOC-01)
  │    ├─ copied query examples from tests only (GDOC-01)
  │    └─ conceptual Neo4J mapping tables only (GDOC-02)
  └─ v2.11 closure + 59 verification
       ├─ 22-requirement checklist
       ├─ boundary-audit summary/sample JSON shape
       └─ proof references to tests, summaries, UAT, verification
```

This data flow is documentation-only; no production code path should consume the new guide or closure. [VERIFIED: 59-CONTEXT.md lines 9-28]

### Recommended Project Structure

```text
docs/
├── olfactory_graph_contract.md       # existing static contract reference; link, do not expand
└── olfactory_graph_read_model.md     # create: Portuguese maintainer guide

.planning/releases/
└── v2.11-CLOSURE.md                  # create: canonical milestone closure

.planning/phases/59-live-artifact-regression-documentation-milestone-closure/
├── 59-CONTEXT.md                     # existing locked decisions
├── 59-RESEARCH.md                    # this file
└── 59-VERIFICATION.md                # create during execution unless planner chooses another workflow moment
```

### Pattern 1: Portuguese Guide with Linked Contract, Not Duplicated Contract

**What:** The guide should summarize operational usage and link to `docs/olfactory_graph_contract.md` for full contract tables. [CITED: 59-CONTEXT.md lines 35-38]  
**When to use:** Use for `docs/olfactory_graph_read_model.md`. [CITED: 59-CONTEXT.md lines 35-38]

**Example:**

```markdown
> ⚠️ **Read model derivado (v2.11)**
>
> `data/read-models/olfactory-graph/v2.11/graph.json` é um artefato derivado para consulta,
> documentação e consumo futuro por agentes/RAG. Ele não é uma publicação oficial da taxonomia
> compilada, não altera a verdade curatorial e não substitui `data/compiled/v2/*`.

Para o contrato completo de schema, invariantes e limites, consulte
[`docs/olfactory_graph_contract.md`](./olfactory_graph_contract.md).
```

Source for required disclaimer semantics: 59-CONTEXT D-04. [CITED: 59-CONTEXT.md lines 38-40]

### Pattern 2: Baseline Counts Table Bound to Constants and Tests

**What:** Table maps each baseline metric to the exact `GRAPH_EXPECTED_BASELINE_STATS` field, test source, and proof meaning. [CITED: 59-CONTEXT.md lines 45-52]  
**When to use:** Required in maintainer guide for GDOC-01 regression evidence. [CITED: 59-CONTEXT.md lines 42-52]

```markdown
| Métrica | Valor esperado | Fonte no contrato | Teste de regressão | O que prova |
|---------|----------------|-------------------|--------------------|-------------|
| Famílias | `10` | `GRAPH_EXPECTED_BASELINE_STATS.families` | `live_artifact_baseline.test.ts` | O grafo preserva a linha de base de famílias v2. |
| Subfamílias | `18` | `GRAPH_EXPECTED_BASELINE_STATS.subfamilies` | `live_artifact_baseline.test.ts` | O grafo preserva a hierarquia compilada. |
| Descritores | `341` | `GRAPH_EXPECTED_BASELINE_STATS.descriptors` | `live_artifact_baseline.test.ts` | O grafo não perde descritores compilados. |
| Aliases | `18` | `GRAPH_EXPECTED_BASELINE_STATS.aliases` | `live_artifact_baseline.test.ts` | Os aliases compilados geram edges `resolves_to`. |
| Similaridades de subfamília | `13` | `GRAPH_EXPECTED_BASELINE_STATS.subfamily_similarity_edges` | `live_artifact_baseline.test.ts` | A similaridade permanece no nível subfamília→subfamília. |
```

Values verified in `contract.ts` and live regression assertions. [VERIFIED: src/graph_read_model/contract.ts lines 71-77; src/tests/graph_read_model/live_artifact_baseline.test.ts lines 56-63]

### Pattern 3: Query Example Source Map Before JSON Blocks

**What:** Include a table linking GQRY requirement, function, `query_kind`, params, and source test. [CITED: 59-CONTEXT.md lines 53-57]  
**When to use:** Before the eight JSON examples in the maintainer guide. [CITED: 59-CONTEXT.md lines 53-57]

| GQRY | Function | `query_kind` | Example params | Source test |
|------|----------|--------------|----------------|-------------|
| GQRY-01 | `getDescriptorsByFamily` | `descriptors_by_family` | `{ family_id: "woody" }` | `query_graph.test.ts` lines 209-220 [VERIFIED] |
| GQRY-01 | `getDescriptorsBySubfamily` | `descriptors_by_subfamily` | `{ subfamily_id: "woody_dry" }` | `query_graph.test.ts` lines 232-243 [VERIFIED] |
| GQRY-02 | `resolveAliasPath` | `alias_resolution_path` | `{ alias: "cedar" }` | `query_graph.test.ts` lines 255-271 [VERIFIED] |
| GQRY-03 | `getDescriptorToFamilyPath` | `descriptor_to_family_path` | `{ descriptor_id: "cedarwood" }` | `query_graph.test.ts` lines 295-310 [VERIFIED] |
| GQRY-03 | `getRelatedDescriptors` | `related_descriptors` | `{ descriptor_id: "cedarwood" }` | `query_graph.test.ts` lines 322-334 [VERIFIED] |
| GQRY-04 | `getSimilarityNeighborhood` | `similarity_neighborhood` | `{ subfamily_id: "floral_rose" }` | `query_graph.test.ts` lines 346-408 [VERIFIED] |
| GQRY-04 | `getCrossFamilyBridges` | `cross_family_bridges` | `{}` | `query_graph.test.ts` lines 492-541 [VERIFIED] |
| GQRY-04 | `getSimilarityHub` | `similarity_hub` | `{}` | `query_graph.test.ts` lines 544-562 [VERIFIED] |

### Pattern 4: Release Closure as Evidence Index

**What:** Closure should follow prior release-closure style but adapt to v2.11 read-model semantics: overview, what shipped, baseline metrics, quality gates/evidence, protected boundaries, deferred scope, handoff. [VERIFIED: .planning/releases/v2.8.0-CLOSURE.md lines 1-96]  
**When to use:** `.planning/releases/v2.11-CLOSURE.md`. [CITED: 59-CONTEXT.md lines 59-63]

### Anti-Patterns to Avoid

- **Duplicating schema/contract tables in the guide:** This creates two sources of truth; link `docs/olfactory_graph_contract.md` instead. [CITED: 59-CONTEXT.md lines 35-38]
- **Using `graph.json` to generate examples:** Locked boundary says copy from tests only and do not re-run queries. [CITED: 59-CONTEXT.md lines 53-57]
- **Adding Neo4J implementation artifacts:** Cypher, CSV, Docker, drivers, and database tests violate GDOC-02 scope. [CITED: .planning/REQUIREMENTS.md lines 45-45, 88-90]
- **Embedding disclaimers into `graph.json`:** Disclaimer belongs in guide only. [CITED: 59-CONTEXT.md lines 38-40, 160-166]
- **Inventing CLI JSON fields:** Current CLI JSON output is `{ ok, graph_output, boundary_audit, guardrails }`; it does not emit `graph_stats`. [VERIFIED: src/cli/graph_read_model.ts lines 297-309]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Query proof examples | New query runner, `query_proofs.json`, or docs generator | Copy expected objects from `query_graph.test.ts` | Prevents drift from regenerated `graph.json` and follows locked decisions. [CITED: 59-CONTEXT.md lines 53-57, 160-164] |
| Regression proof | New mandatory CLI/integration test files | Existing Vitest tests and Phase 58 verification | Phase 58 already covers `graph:build`; Phase 59 documents evidence. [CITED: 59-CONTEXT.md lines 42-51; VERIFIED: 58-VERIFICATION.md lines 117-139] |
| Schema reference | Duplicated schema tables | Link `docs/olfactory_graph_contract.md` and cite `contract.ts` constants | Avoids dual source of truth. [CITED: 59-CONTEXT.md lines 35-38] |
| Boundary audit sidecar | Persisted audit JSON or full digest list in closure | Representative sample JSON shape and test reference | Operator rejected persisted/full SHA lists. [CITED: 59-CONTEXT.md lines 60-63, 160-166] |
| Graph database export | Cypher/CSV/Docker/driver docs | Conceptual mapping tables only | Database implementation deferred to future GDB requirements. [CITED: .planning/REQUIREMENTS.md lines 57-60] |

**Key insight:** The trusted artifact for Phase 59 is not new runtime behavior; it is an accurate evidence index over already-implemented read-model behavior. [VERIFIED: 59-CONTEXT.md; phase 55-58 summaries]

## Common Pitfalls

### Pitfall 1: Treating “inline snapshots” literally
**What goes wrong:** Planner searches for `.snap` files or `toMatchInlineSnapshot` calls and fails to find query examples. [VERIFIED: grep `toMatchInlineSnapshot|toMatchSnapshot`]  
**Why it happens:** The context uses “snapshot” language, but current tests use literal object expectations. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts lines 214-218, 260-270, 300-309]  
**How to avoid:** Copy JSON-equivalent objects from `expect(proof).toEqual({...})` and `expect(proof.result.neighbors).toEqual([...])`. [VERIFIED: src/tests/graph_read_model/query_graph.test.ts]  
**Warning signs:** Any plan task says “run query against `graph.json`” or “update Vitest snapshots.” [CITED: 59-CONTEXT.md lines 53-57]

### Pitfall 2: Documenting stale or idealized `graph:build --json` output
**What goes wrong:** Closure claims fields that the CLI does not print, such as `graph_stats`. [VERIFIED: src/cli/graph_read_model.ts lines 297-309]  
**Why it happens:** Phase 58 summary mentions “graph stats,” but actual CLI JSON object only contains `ok`, `graph_output`, `boundary_audit`, and `guardrails`. [VERIFIED: 58-02-SUMMARY.md lines 34-38; src/cli/graph_read_model.ts lines 297-309]  
**How to avoid:** Use code as source of truth for sample JSON shape. [VERIFIED: src/cli/graph_read_model.ts lines 297-309]  
**Warning signs:** Sample JSON includes unverified fields or full SHA-256 lists. [CITED: 59-CONTEXT.md lines 60-63]

### Pitfall 3: Running official `graph:build` as a documentation task without intent
**What goes wrong:** Official `graph:build` writes `data/read-models/olfactory-graph/v2.11/graph.json` and then runs guardrails. [VERIFIED: src/cli/graph_read_model.ts lines 186-190, 226-267]  
**Why it happens:** The guide must document `graph:build`, but Phase 59 is not primarily an artifact-generation phase. [CITED: 59-CONTEXT.md lines 6-28]  
**How to avoid:** Cite existing Phase 58 verification and tests; if a smoke command is needed during planning/execution, use `--help` or existing test commands unless operator authorizes an official graph write. [VERIFIED: 58-VERIFICATION.md lines 83-139]  
**Warning signs:** Plan makes `npm --prefix src run graph:build` mandatory just to write docs. [CITED: 59-CONTEXT.md lines 18-23, 42-44]

### Pitfall 4: Blurring read model with official taxonomy publication
**What goes wrong:** Guide implies `graph.json` is official compiled taxonomy output or a curation truth upgrade. [CITED: .planning/REQUIREMENTS.md lines 44-46]  
**Why it happens:** The read model is generated from compiled v2 artifacts and lives under `data/read-models`, which may look publication-like. [VERIFIED: contract.ts lines 49-60]  
**How to avoid:** Put a GDOC-03 banner at the top and repeat boundary language in closure. [CITED: 59-CONTEXT.md lines 38-40]  
**Warning signs:** Wording such as “published taxonomy,” “source of curation truth,” or “replace compiled v2.” [CITED: 59-CONTEXT.md lines 38-40]

## Code Examples

Verified patterns from source files and tests:

### Query proof example: `alias_resolution_path`

Copy the expected-object structure from `query_graph.test.ts`; do not regenerate it from `graph.json`. [CITED: 59-CONTEXT.md lines 53-57; VERIFIED: src/tests/graph_read_model/query_graph.test.ts lines 260-270]

```json
{
  "query_kind": "alias_resolution_path",
  "params": { "alias": "cedar" },
  "result": { "target_descriptor_id": "cedarwood" },
  "path": [
    { "graph_id": "alias:cedar", "kind": "alias" },
    { "graph_id": "descriptor:cedarwood", "kind": "descriptor" },
    { "graph_id": "subfamily:woody_dry", "kind": "subfamily", "name": "Dry Woods" },
    { "graph_id": "family:woody", "kind": "family", "name": "Woody" }
  ]
}
```

### CLI audit sample shape for closure

Use representative fields; do not embed full digest lists. [CITED: 59-CONTEXT.md lines 60-63]

```json
{
  "ok": true,
  "graph_output": "data/read-models/olfactory-graph/v2.11/graph.json",
  "boundary_audit": {
    "ok": true,
    "protected_files": [
      { "path": "data/taxonomy/taxonomy-seed.v2.json", "unchanged": true }
    ],
    "graphify_out_accesses": 0,
    "output_written": "data/read-models/olfactory-graph/v2.11/graph.json",
    "forbidden_prefix_rejections": []
  },
  "guardrails": {
    "passed": true,
    "results": [
      { "name": "typecheck", "exitCode": 0 }
    ]
  }
}
```

The exact top-level fields come from CLI code; the compacted nested arrays are representative and should be labeled as excerpted. [VERIFIED: src/cli/graph_read_model.ts lines 297-309; src/graph_read_model/boundary_audit.ts lines 12-18]

### Conceptual Neo4J mapping table

```markdown
| Graph node kind | Neo4J label conceitual | ID/property guidance |
|-----------------|------------------------|----------------------|
| `family` | `Family` | `id` keeps `family:*`; `family_id` keeps raw taxonomy ID. |
| `subfamily` | `Subfamily` | `id` keeps `subfamily:*`; `subfamily_id` and `family_id` remain properties. |
| `descriptor` | `Descriptor` | `id` keeps `descriptor:*`; descriptor metadata remains properties. |
| `alias` | `Alias` | `id` keeps `alias:*`; `target_descriptor_id` remains a property. |
```

Source contract node kinds and ID prefixes are fixed in `contract.ts`. [VERIFIED: src/graph_read_model/contract.ts lines 3-8, 21-26]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contract-only graph scope | Implemented builder/validator/query/writer/CLI with docs closure now pending | Phases 55-58 completed 2026-06-09 to 2026-06-10 | Phase 59 can cite implemented modules and tests instead of designing graph behavior. [VERIFIED: phase 55-58 summaries] |
| Query value as future idea | Eight typed query proof functions with deterministic tests | Phase 57 | Guide must document all 8 `query_kind` values. [VERIFIED: src/graph_read_model/types.ts lines 88-97; 57-02-SUMMARY.md lines 63-68] |
| No write-capable graph workflow | `graph:build` CLI with writer, boundary audit, and guardrails | Phase 58 | Guide can document operator workflow and closure can cite boundary audit evidence. [VERIFIED: src/cli/graph_read_model.ts lines 54-84; 58-VERIFICATION.md lines 266-278] |
| Full database/export implementation | Conceptual future Neo4J mapping only | Locked for Phase 59 | Avoids Neo4J/Docker/Cypher/database scope creep. [CITED: 59-CONTEXT.md lines 39-40] |

**Deprecated/outdated:**
- Treating `graphify-out/**` as graph-read-model input/output is out of scope; Graphify remains navigation context only. [CITED: .planning/REQUIREMENTS.md lines 83-83; VERIFIED: graphify-out/GRAPH_REPORT.md lines 105-115]
- Persisted query proof artifacts are rejected; documentation examples come from tests. [CITED: 59-CONTEXT.md lines 160-164]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Whether maintainers want a fresh closure-time official `graph:build` proof is unclear. [ASSUMED] | Open Questions | If wrong, the plan may omit a desired fresh write/audit command or include one unnecessarily. |
| A2 | Research remains valid for about 30 days for this docs-only phase. [ASSUMED] | Metadata | If wrong, planner should re-check repo state and package/tool versions before execution. |

## Open Questions

1. **Should `59-VERIFICATION.md` be written during plan execution or by the verification workflow?**
   - What we know: The context locks it as an artifact but leaves timing to agent discretion. [CITED: 59-CONTEXT.md lines 59-70]
   - What's unclear: Whether planner convention should create it in a docs task or defer it to `/gsd-verify-work` output. [CITED: 59-CONTEXT.md lines 68-70]
   - Recommendation: Plan it as a lightweight final documentation task with placeholders for actual commands/UAT, then let verification fill or confirm final results. [VERIFIED: Phase 58 verification pattern]
2. **Should execution run official `graph:build` or only cite existing evidence?**
   - What we know: Official `graph:build` writes the sanctioned `graph.json` and runs guardrails; Phase 59 is docs/closure and says no new mandatory CLI tests. [VERIFIED: src/cli/graph_read_model.ts lines 186-190, 262-267; CITED: 59-CONTEXT.md lines 18-23]
   - What's unclear: Whether maintainers want a fresh closure-time official build proof. [ASSUMED]
   - Recommendation: Do not make official `graph:build` mandatory in the plan; use existing Phase 58 evidence and existing Vitest tests unless a human explicitly authorizes a fresh graph write. [CITED: 59-CONTEXT.md lines 42-44]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Existing npm scripts and CLI | ✓ | `v24.14.0` | none needed. [VERIFIED: bash version probe] |
| npm | Existing scripts | ✓ | `11.9.0` | none needed. [VERIFIED: bash version probe] |
| TypeScript compiler | Typecheck if verification runs | ✓ | `5.9.3` installed | Use existing `npm --prefix src run typecheck`. [VERIFIED: bash version probe; src/package.json lines 6-18] |
| Vitest | Existing regression evidence | ✓ | `3.2.4` installed | Use existing `npm --prefix src test`. [VERIFIED: bash version probe; src/package-lock.json lines 850-852] |
| Git | Release/closure provenance if needed | ✓ | `2.54.0` | none needed. [VERIFIED: bash version probe] |
| Neo4J/Docker/database | Not required | intentionally not probed | — | Not in scope. [CITED: .planning/REQUIREMENTS.md lines 88-90] |

**Missing dependencies with no fallback:** none. [VERIFIED: environment probe]  
**Missing dependencies with fallback:** none. [VERIFIED: environment probe]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `3.2.4` installed; official Vitest docs show `describe`, `it`, and `expect` patterns. [VERIFIED: bash version probe; Context7 /vitest-dev/vitest/v3_2_4] |
| Config file | `src/vitest.config.ts`, includes `tests/**/*.test.ts`. [VERIFIED: src/vitest.config.ts lines 1-7] |
| Quick run command | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/cli/graph_read_model.test.ts` [VERIFIED: src/package.json lines 13-18] |
| Full suite command | `npm --prefix src test` [VERIFIED: src/package.json lines 13-18] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GDOC-01 | Guide explains schema, inputs, output, validation, boundaries, query examples | docs content + existing regression tests | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts` | ❌ `docs/olfactory_graph_read_model.md` Wave 0/create [VERIFIED: glob phase files] |
| GDOC-02 | Guide includes conceptual Neo4J mapping only | docs content/manual boundary check | `python3 - <<'PY'\nfrom pathlib import Path\np=Path('docs/olfactory_graph_read_model.md')\ns=p.read_text()\nassert 'Neo4J' in s and 'Docker' not in s\nPY` | ❌ Wave 0/create [CITED: 59-CONTEXT.md lines 39-40] |
| GDOC-03 | Top disclaimer states derived read model, not official compiled taxonomy or curation truth | docs content/manual check | `python3 - <<'PY'\nfrom pathlib import Path\ns=Path('docs/olfactory_graph_read_model.md').read_text()[:1200].lower()\nassert 'read model' in s and 'não' in s and 'data/compiled/v2' in s\nPY` | ❌ Wave 0/create [CITED: 59-CONTEXT.md lines 38-40] |

### Sampling Rate

- **Per task commit:** Run targeted doc content checks plus the quick existing graph test command if docs cite query/regression evidence. [VERIFIED: existing test files]
- **Per wave merge:** `npm --prefix src run typecheck` and targeted Vitest graph tests. [VERIFIED: src/package.json lines 6-18]
- **Phase gate:** Full suite `npm --prefix src test` only if executor changed source/test files; for docs-only changes, targeted tests + manual review against source lines is sufficient unless workflow mandates full suite. [CITED: 59-CONTEXT.md lines 42-44]

### Wave 0 Gaps

- [ ] `docs/olfactory_graph_read_model.md` — create for GDOC-01/02/03. [CITED: 59-CONTEXT.md lines 83-86]
- [ ] `.planning/releases/v2.11-CLOSURE.md` — create for milestone closure. [CITED: 59-CONTEXT.md lines 59-63]
- [ ] `59-VERIFICATION.md` — create/fill as phase verification artifact. [CITED: 59-CONTEXT.md lines 14-17, 59-70]
- No new test framework/config gaps; Vitest config already exists. [VERIFIED: src/vitest.config.ts lines 1-7]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth/session behavior in docs-only phase. [VERIFIED: phase scope] |
| V3 Session Management | no | No session behavior. [VERIFIED: phase scope] |
| V4 Access Control | yes (repository boundary semantics) | Preserve locked protected-path boundaries and avoid instructions that mutate protected taxonomy/compiled/inference/Graphify files. [CITED: 59-CONTEXT.md lines 18-25] |
| V5 Input Validation | yes (documentation examples) | Source examples from tests and exact constants; do not accept/generated unverified query examples. [CITED: 59-CONTEXT.md lines 53-57] |
| V6 Cryptography | yes (audit evidence only) | Reference existing SHA-256 boundary audit; do not hand-roll new digest workflow or persist full digest lists. [VERIFIED: src/graph_read_model/boundary_audit.ts lines 1-25; CITED: 59-CONTEXT.md lines 60-63] |

### Known Threat Patterns for documentation closure

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| False authority: docs imply read model is official taxonomy/curation truth | Repudiation / Information Integrity | Top GDOC-03 disclaimer and repeated boundary language. [CITED: 59-CONTEXT.md lines 38-40] |
| Scope creep into database/runtime implementation | Elevation of Scope | Neo4J mapping tables only; no Cypher/CSV/Docker/drivers/tests. [CITED: 59-CONTEXT.md lines 39-40] |
| Evidence drift from regenerated query examples | Tampering / Information Integrity | Copy from existing tests only and cite line ranges. [CITED: 59-CONTEXT.md lines 53-57] |
| Protected artifact mutation during docs phase | Tampering | Do not mutate `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`; avoid official graph writes unless authorized. [CITED: 59-CONTEXT.md lines 18-25] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/59-live-artifact-regression-documentation-milestone-closure/59-CONTEXT.md` — locked scope, decisions, deferred items. [CITED]
- `.planning/REQUIREMENTS.md` — GDOC-01, GDOC-02, GDOC-03 and v2.11 scope. [CITED]
- `.planning/ROADMAP.md` — Phase 59 goal and success criteria. [CITED]
- `docs/olfactory_graph_contract.md` — static graph contract reference. [VERIFIED]
- `src/graph_read_model/contract.ts` — schema, allowed inputs, output policy, baseline stats. [VERIFIED]
- `src/graph_read_model/query_graph.ts` and `src/graph_read_model/types.ts` — eight query kinds and function contracts. [VERIFIED]
- `src/tests/graph_read_model/query_graph.test.ts` — primary query examples. [VERIFIED]
- `src/tests/graph_read_model/query_live_baseline.test.ts` and `live_artifact_baseline.test.ts` — live baseline evidence. [VERIFIED]
- `src/tests/graph_read_model/write_graph.test.ts`, `boundary_audit.test.ts`, `src/tests/cli/graph_read_model.test.ts` — writer/audit/CLI evidence. [VERIFIED]
- `src/cli/graph_read_model.ts` — actual `graph:build` workflow and JSON output shape. [VERIFIED]
- `.planning/phases/55-58/**/SUMMARY.md` and `58-VERIFICATION.md` — shipped evidence and phase provenance. [VERIFIED]
- `graphify-out/GRAPH_REPORT.md` — read-only graph navigation context, fresh against current commit. [VERIFIED]
- Context7 `/vitest-dev/vitest/v3_2_4` — Vitest `describe`/`it`/`expect` and snapshot API references. [VERIFIED]

### Secondary (MEDIUM confidence)

- npm registry metadata for `vitest`, `typescript`, and `@types/node` latest versions and repository URLs. [VERIFIED: npm registry]

### Tertiary (LOW confidence)

- None used for actionable recommendations. [VERIFIED: research log]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified from package files, local tooling, and npm registry; no package installation recommended. [VERIFIED]
- Architecture: HIGH — phase scope and responsibility boundaries are locked in CONTEXT and validated against code/test files. [CITED/VERIFIED]
- Pitfalls: HIGH — pitfalls come from concrete code/context mismatches and explicit deferred items. [VERIFIED]

**Research date:** 2026-06-11  
**Valid until:** 2026-07-11 for repository-specific docs; re-check package/tool versions if planning after that date. [ASSUMED]
