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

| Option | Description | Selected |
|--------|-------------|----------|
| SHA-256 pre/post | Hash protected files before/after workflow | ✓ |
| Git status check | Assert no git diff on protected paths | |
| mtime + size | Lighter comparison | |
| Other | User describes in chat | |

**User's choice:** SHA-256 pre/post on protected paths + graphify-out isolation assertion
**Notes:** Covers GVAL-03 paths (taxonomy seeds + `data/compiled/v2/*`) and GVAL-04 (no read/write to `graphify-out/**`). Report printed to stdout as JSON.

---

## Query Proof Serialization

| Option | Description | Selected |
|--------|-------------|----------|
| Graph JSON only | Query proofs stay in-memory/test layer | ✓ |
| Sample query proofs | Small `query_proofs.json` with exemplars | |
| Full query proof export | All 8 kinds for all baseline entities | |
| Other | User describes in chat | |

**User's choice:** Graph JSON only — defer query proof serialization to Phase 59
**Notes:** Operator inclination confirmed: Phase 58 publishes guarded read-model artifact; Phase 59 documents representative query examples. Avoids extra diff/audit surface and responsibility mixing.

---

## Agent Discretion

- Boundary audit JSON schema field names
- `--dry-run` vs `--verify-only` naming
- Writer module placement (`write_graph_outputs.ts` vs CLI-colocated)
- GVAL-05 guardrail invocation mechanism (spawn vs inline)
- Graphify access prevention implementation detail

## Deferred Ideas

- `query_proofs.json` on disk — Phase 59
- Decomposed graph artifacts — not needed for v2.11
- Persisted `boundary_audit.json` — stdout only
- Free `--out` for official writes — rejected
- CLI subcommands — one-shot sufficient
- Maintainer docs / Neo4J notes — Phase 59
