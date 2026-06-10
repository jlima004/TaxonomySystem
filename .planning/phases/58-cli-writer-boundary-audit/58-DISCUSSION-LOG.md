# Phase 58: CLI, Writer & Boundary Audit - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 58-CLI, Writer & Boundary Audit
**Areas discussed:** CLI Workflow Shape, Output Artifact Layout, Boundary Audit Proof, Query Proof Serialization

---

## CLI Workflow Shape

| Option | Description | Selected |
|--------|-------------|----------|
| One-shot | Single command: load → build → validate → write → audit → guardrails | ✓ |
| Subcommands | Separate build / validate / write / audit invocations | |
| Hybrid | Default one-shot + skip flags for debugging | |
| You decide | Agent picks shape | |

**User's choice:** One-shot workflow
**Notes:** Operator prioritized A first because it determines writer and test architecture. npm script: `graph:build`. Output path locked to `GRAPH_OUTPUT_POLICY.sanctioned_output_path`; no free `--out`. `/tmp` only via explicit `--dry-run` or `--verify-only`. GVAL-05 guardrails run after write in the same command.

---

## Output Artifact Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Monolithic graph.json | Single file mirrors OlfactoryGraph | ✓ |
| Decomposed files | nodes.json, edges.json, stats.json (+ manifest) | |
| Both | Monolithic plus decomposed copies | |
| You decide | Agent picks layout | |

**User's choice:** Monolithic `graph.json` only; minimal pure shape
**Notes:** `{ schema_version, nodes, edges, stats }` only — no `generated_at`, provenance, or build metadata in artifact. Provenance belongs in CLI audit output. Boundary audit report stdout-only (`--json`), not persisted in v2.11/. Atomic write: `.graph.json.tmp` → rename. No timestamped backups.

---

## Boundary Audit Proof

### Q1: Hash mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| SHA-256 pre/post | Hash each protected file before/after workflow | ✓ |
| Git status check | Assert no git diff on protected paths | |
| mtime + size | Lighter comparison | |
| You decide | Agent picks | |

**User's choice:** SHA-256 pre/post

### Q2: Protected path scope

| Option | Description | Selected |
|--------|-------------|----------|
| GVAL-03 exact set | 3 taxonomy seeds + all files under data/compiled/v2/ | ✓ |
| GVAL-03 + inference | Broader including data/inference/* | |
| GVAL-03 + graphify hash | Also hash graphify-out/** contents | |
| You decide | Agent picks | |

**User's choice:** GVAL-03 exact set only — do not include data/inference/** or graphify-out/** in hash scope

### Q3: Graphify isolation proof (GVAL-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Static path guard | Reject graphify-out/** paths; audit asserts zero accesses | ✓ |
| graphify-out directory hash | Pre/post hash of graphify-out tree | |
| Both guard and hash | Static guards plus directory hash | |
| You decide | Agent picks | |

**User's choice:** Static path guard — audit report must include `graphify_out_accesses: 0`. Hash does not prove absence of reads.

### Q4: Audit report JSON shape

| Option | Description | Selected |
|--------|-------------|----------|
| Structured proof | ok, protected_files[], graphify_out_accesses, output_written, forbidden_prefix_rejections | ✓ |
| Minimal ok | { ok, message } only | |
| alias_integrity style | Mirror existing integrity CLI JSON | |
| You decide | Agent picks | |

**User's choice:** Structured proof on stdout (`--json`); not persisted under v2.11/

---

## Query Proof Serialization

### Q1: Disk output

| Option | Description | Selected |
|--------|-------------|----------|
| graph.json only | No query proof artifacts on disk | ✓ |
| Sample query_proofs.json | 2-3 exemplar proofs alongside graph.json | |
| Full export | All 8 kinds for baseline catalog | |
| You decide | Agent picks | |

**User's choice:** graph.json only — query proofs stay in-memory/test; Phase 59 handles documentation examples

### Q2: Query invocation in graph:build

| Option | Description | Selected |
|--------|-------------|----------|
| No query invocation | graph:build does not call query functions | ✓ |
| Smoke query | 1-2 exemplar queries in stdout audit only | |
| Full in-memory run | All 8 kinds in stdout only | |
| You decide | Agent picks | |

**User's choice:** No query invocation — writer proves artifact generation and boundary preservation only

### Q3: GQRY-05 satisfaction without disk serialization

| Option | Description | Selected |
|--------|-------------|----------|
| Test layer only | GQRY-05 already satisfied by Phase 57 tests | ✓ |
| CLI stdout note | Audit includes query_proofs_available: true | |
| Phase 59 handoff | CONTEXT documents GDOC-01 will serialize examples | |
| You decide | Agent picks | |

**User's choice:** Test layer only — Phase 58 adds no new GQRY work

### Q4: Phase 59 documentation source

| Option | Description | Selected |
|--------|-------------|----------|
| From Vitest proofs | Copy from query_graph.test.ts and query_live_baseline.test.ts | ✓ |
| From written graph.json | Load persisted read-model and run queries | |
| Both sources | Test proofs plus load-from-graph example | |
| You decide | Agent picks | |

**User's choice:** From Vitest proofs — do not re-run queries on graph.json for docs (single source of truth)

---

## Agent Discretion

- `--dry-run` vs `--verify-only` naming
- Writer module placement (`write_graph_outputs.ts` vs CLI-colocated)
- GVAL-05 guardrail invocation mechanism (spawn vs inline)
- Static path guard implementation detail for graphify-out/**

## Deferred Ideas

- `query_proofs.json` on disk — Phase 59
- Decomposed graph artifacts — not needed for v2.11
- Persisted `boundary_audit.json` — stdout only
- Free `--out` for official writes — rejected
- CLI subcommands — one-shot sufficient
- Maintainer docs / Neo4J notes — Phase 59
