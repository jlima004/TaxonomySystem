# Phase 59: Live Artifact Regression, Documentation & Milestone Closure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 59-Live Artifact Regression, Documentation & Milestone Closure
**Areas discussed:** Documentation layout, Live regression evidence, Query proof examples, Milestone closure report

---

## Documentation layout

| Option | Description | Selected |
|--------|-------------|----------|
| Single maintainer guide | `docs/olfactory_graph_read_model.md` with all sections; keep contract doc separate | ✓ |
| Split docs | Separate usage, Neo4J, disclaimer files | |
| Expand contract doc | Merge contract + usage into one file | |
| You decide | Agent picks layout | |

**User's choice:** Single maintainer guide — `docs/olfactory_graph_read_model.md`
**Notes:** Keep `docs/olfactory_graph_contract.md` as static contract reference. Portuguese narrative. Disclaimer as prominent top banner in guide only. Neo4J section = mapping tables (no Cypher). Guide references contract for schema details; no duplicate contract tables.

### Follow-up decisions

| Decision | Choice |
|----------|--------|
| Language | Portuguese (technical identifiers in English) |
| Disclaimer placement | Guide banner only — no graph.json, compiled, or output-dir README changes |
| Neo4J section | Mapping tables only |
| Contract cross-ref | Guide links to contract; operational focus in guide |

---

## Live regression evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Document existing tests | Reference Vitest files as regression proof; no new tests | ✓ |
| Add graph:build E2E test | New integration test for full CLI workflow | |
| Add regression report artifact | Committed markdown/JSON summary | |
| You decide | Agent picks approach | |

**User's choice:** Document existing tests + `graph:build` as operator proof
**Notes:** No mandatory new CLI test in Phase 59. Canonical test refs: `live_artifact_baseline.test.ts`, `query_live_baseline.test.ts`, `write_graph.test.ts`, `boundary_audit.test.ts`, `graph_read_model.test.ts`. Baseline counts in dedicated table with contract field + test source + meaning.

### Follow-up decisions

| Decision | Choice |
|----------|--------|
| graph:build in regression story | Document CLI steps and expected audit JSON; no new test |
| Test file scope | Core five files listed above (not full graph_read_model suite) |
| Baseline counts format | Dedicated table mapping metrics to `GRAPH_EXPECTED_BASELINE_STATS` |

---

## Query proof examples

| Option | Description | Selected |
|--------|-------------|----------|
| All 8 query kinds | One example per stable query_kind | ✓ |
| Representative 5 | Skip related_descriptors and descriptor_to_family_path | |
| Minimal 3 | Hierarchy + alias + similarity only | |
| You decide | Agent picks coverage | |

**User's choice:** All 8 query kinds, JSON code blocks from inline snapshots
**Notes:** Primary source: `query_graph.test.ts`. `query_live_baseline.test.ts` for aggregate-scale notes only. Include function mapping table (GQRY | function | query_kind | params | source test). Phase 58 D-21: copy from tests, do not re-run on graph.json.

### Follow-up decisions

| Decision | Choice |
|----------|--------|
| Example format | Fenced JSON blocks with Portuguese captions |
| Example source | Inline snapshots primary |
| Function mapping | Include full mapping table in guide |

---

## Milestone closure report

| Option | Description | Selected |
|--------|-------------|----------|
| Both VERIFICATION + release closure | Phase 59 verification + v2.11 release closure | ✓ |
| Release closure only | `.planning/releases/v2.11-CLOSURE.md` | |
| Phase VERIFICATION only | `59-VERIFICATION.md` only | |
| You decide | Agent picks format | |

**User's choice:** Both `59-VERIFICATION.md` and `.planning/releases/v2.11-CLOSURE.md`
**Notes:** Primary milestone closure at `.planning/releases/v2.11-CLOSURE.md`. Boundary audit = summary + sample JSON shape (not full SHA-256 list). Full 22-requirement checklist with per-requirement proof references.

### Follow-up decisions

| Decision | Choice |
|----------|--------|
| Closure location | `.planning/releases/v2.11-CLOSURE.md` (canonical milestone closure) |
| Boundary audit evidence | Summary + sample audit JSON; reference `boundary_audit.test.ts` |
| Requirements checklist | Full table — all 22 requirements, one row each |

---

## Agent Discretion

- Section ordering inside maintainer guide
- Specific snapshot selection per query_kind when multiple exist
- Aggregate notes from `query_live_baseline.test.ts`
- Sample audit JSON excerpt formatting in closure doc

## Deferred Ideas

- `query_proofs.json` on disk
- Disclaimer in graph.json or output-dir README
- Full SHA-256 digest list in closure doc
- Neo4J Cypher/CSV examples (GDB-01 future milestone)
- Expanding contract doc into operational guide
