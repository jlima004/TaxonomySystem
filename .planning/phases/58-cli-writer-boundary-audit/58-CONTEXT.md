# Phase 58: CLI, Writer & Boundary Audit - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 58 delivers the **first write-capable graph workflow**: a guarded one-shot CLI that loads allowed compiled v2 artifacts, builds and validates an in-memory `OlfactoryGraph`, writes the sanctioned read-model artifact, proves protected paths were not mutated, and runs existing integrity guardrails.

**In scope:**
- One-shot graph CLI (`graph:build`) — load → build → validate → write → boundary audit → GVAL-05 guardrails
- Writer to `data/read-models/olfactory-graph/v2.11/graph.json` only
- Output path enforcement via `GRAPH_OUTPUT_POLICY` (forbidden prefix rejection)
- SHA-256 pre/post boundary audit for protected taxonomy seeds and `data/compiled/v2/*`
- Graphify isolation proof (`graphify-out/**` not read or written)
- Boundary audit proof emitted to CLI stdout (`--json` supported)
- `/tmp` allowed only for explicit verification modes (`--dry-run` or `--verify-only`), not as official output
- Vitest coverage for writer, path policy, and boundary audit behavior

**Out of scope (operator-locked — do not pull forward):**
- Query proof serialization to disk (`query_proofs.json` or similar) — Phase 59 documentation
- Neo4J export, Graphify integration, runtime/API/SaaS
- Mutation of `data/taxonomy/**`, `data/compiled/v2/**`, `data/inference/**`, or `graphify-out/**`
- Free-form `--out` for official writes (reduces accidental mutation risk)
- Maintainer documentation with query examples (Phase 59 / GDOC-01)
- Changes to pure builder, validator, or query modules beyond wiring from CLI layer
- Material nodes, new scoring, or enriched_materials ingestion

**Focus:** Publish a guarded read-model artifact with cryptographic boundary proof, not a generic export tool.

</domain>

<decisions>
## Implementation Decisions

### CLI Workflow Shape
- **D-01:** **One-shot workflow** — single command runs: load allowed inputs → `buildOlfactoryGraph` → `validateOlfactoryGraph` (must pass) → write `graph.json` → boundary audit → GVAL-05 guardrails. No separate `build`/`validate`/`write`/`audit` subcommands in Phase 58.
- **D-02:** Primary npm entry: **`graph:build`** (mirrors `compile:quality` / `alias:integrity` as one operator-facing command).
- **D-03:** **Locked official output path** — always writes to `GRAPH_OUTPUT_POLICY.sanctioned_output_path` (`data/read-models/olfactory-graph/v2.11/`). Reject any write target matching `GRAPH_OUTPUT_POLICY.forbidden_output_prefixes`. **No free `--out`** for official artifact publication.
- **D-04:** **`/tmp` verification-only** — allow `/tmp` output only via explicit `--dry-run` or `--verify-only` mode; never substitute for sanctioned v2.11 artifact.
- **D-05:** **GVAL-05 in same command** — after successful write, run `typecheck`, `test`, `alias:integrity --json`, and `verify:integrity --json` as part of `graph:build` completion proof.
- **D-06:** CLI follows existing patterns: `src/cli/graph_read_model.ts` (or equivalent) with `--help`, `--json`, structured exit codes; reuse `resolveReadablePath` / parent-data path resolution from `alias_integrity.ts`.

### Output Artifact Layout
- **D-07:** **Monolithic output only** — `data/read-models/olfactory-graph/v2.11/graph.json` is the sole persisted read-model file. No decomposed `nodes.json` / `edges.json` / `stats.json` in Phase 58.
- **D-08:** **`graph.json` shape is pure `OlfactoryGraph`** — `{ schema_version, nodes, edges, stats }` only. No embedded provenance block.
- **D-09:** **No default timestamps** — do not add `generated_at`, `input_artifact_paths`, or `build_tool_version` to `graph.json`. Metadata/provenance belongs in CLI-printed audit proof, not the sanctioned artifact. `generated_at` only if explicitly injected via a controlled flag, and **not** on the default official path.
- **D-10:** **Boundary audit not persisted** — audit report prints to stdout (JSON with `--json`); do not write `boundary_audit.json` under v2.11/.
- **D-11:** **Atomic write** — `mkdir` recursive → write `.graph.json.tmp` → `rename` to `graph.json`. Reuse compiler tmp→rename pattern from `write_outputs.ts`. No direct write to final path; no timestamped backups in v2.11/.

### Boundary Audit Proof
- **D-12:** **SHA-256 pre/post hashing** — hash protected files before workflow and re-hash after write; report unchanged digests. Use `node:crypto` (zero-dependency).
- **D-13:** **GVAL-03 exact scope only** — SHA-256 audit covers exactly:
  - `data/taxonomy/taxonomy-seed.v2.json`
  - `data/taxonomy/descriptor_aliases.seed.json`
  - `data/taxonomy/alias_target_exceptions.v1.json`
  - All files under `data/compiled/v2/` (recursive enumerate; hash each file)
  - **Do not** include `data/inference/**` or `graphify-out/**` in the hash set — beyond GVAL-03 and adds operational noise.
- **D-14:** **Graphify isolation via static path guard (GVAL-04)** — loader/writer reject any path under `graphify-out/**`. Do **not** use graphify-out content hashes (hash only proves content unchanged, not absence of reads). Audit report must include `graphify_out_accesses: 0`.
- **D-15:** **Structured audit proof on stdout** — JSON report shape (with `--json`):
  ```json
  {
    "ok": true,
    "protected_files": [{ "path", "sha256_before", "sha256_after", "unchanged" }],
    "graphify_out_accesses": 0,
    "output_written": "data/read-models/olfactory-graph/v2.11/graph.json",
    "forbidden_prefix_rejections": []
  }
  ```
  Not persisted under v2.11/. Aggregate `ok` is false if any protected file digest changed.

### Query Proof Serialization
- **D-16:** **Graph JSON only** — Phase 58 does not serialize query proofs to disk. No `query_proofs.json` or similar under v2.11/.
- **D-17:** Query proofs remain in **in-memory / test layer** (`query_graph.ts` + existing Vitest coverage).
- **D-18:** Representative query proof examples for maintainers and future agent/RAG consumption deferred to **Phase 59** (`GDOC-01`), not official v2.11 artifacts.
- **D-19:** **`graph:build` does not invoke query functions** — workflow is load → build → validate → write → boundary audit → guardrails only. No smoke queries in stdout audit.
- **D-20:** **GQRY-05 satisfied by Phase 57 tests** — Phase 58 adds no new GQRY work; `query_graph.test.ts` and `query_live_baseline.test.ts` remain the proof source.
- **D-21:** **Phase 59 docs source from Vitest proofs** — GDOC-01 examples copy representative inline snapshots from `query_graph.test.ts` and exemplars from `query_live_baseline.test.ts`. Do not load `graph.json` and re-run queries for documentation (avoids a second source of truth).

### Agent Discretion
- Whether `--dry-run` or `--verify-only` is the canonical flag name (or both with documented semantics).
- Internal module split: dedicated `write_graph_outputs.ts` vs writer helpers colocated with CLI — follow `write_outputs.ts` / `alias_integrity.ts` analogs.
- How `graph:build` invokes GVAL-05 guardrails (spawn npm scripts vs inline re-use) — must produce equivalent proof output.
- Exact static path guard implementation for `graphify-out/**` (centralized path normalizer vs per-call checks).
- CLI help text and non-zero exit codes for validation failure vs boundary audit failure vs guardrail failure.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Graph contract & pure modules (Phases 55–57)
- `src/graph_read_model/contract.ts` — `GRAPH_OUTPUT_POLICY`, `GRAPH_ALLOWED_PRODUCTION_INPUTS`, baseline stats
- `src/graph_read_model/build_graph.ts` — `buildOlfactoryGraph`
- `src/graph_read_model/validate_graph.ts` — `validateOlfactoryGraph`
- `src/graph_read_model/query_graph.ts` — query proofs (in-memory only; not written in Phase 58)
- `src/graph_read_model/types.ts` — `OlfactoryGraph` shape for writer
- `docs/olfactory_graph_contract.md` — maintainer-readable boundary mirror

### Requirements & roadmap
- `.planning/ROADMAP.md` — Phase 58 goal and success criteria (lines 159–169)
- `.planning/REQUIREMENTS.md` — GVAL-03, GVAL-04, GVAL-05; out-of-scope table

### CLI & writer analogs
- `src/cli/parse_args.ts` — flag parsing, `DEFAULT_PATHS`, `CliArgumentError`
- `src/cli/alias_integrity.ts` — `--json` proof CLI, `resolveReadablePath`
- `src/cli/compile.ts` — compile CLI orchestration pattern
- `src/compiler/write_outputs.ts` — `writeJsonDeterministic`, atomic tmp→rename
- `src/package.json` — npm script conventions (`compile:quality`, `alias:integrity`, `verify:integrity`)

### Phase 56–57 context (boundaries carried forward)
- `.planning/phases/56-pure-builder-structural-validation/56-CONTEXT.md` — fs-free production modules
- `.planning/phases/57-query-proofs/57-CONTEXT.md` — query proofs deferred from CLI; JSON-serializable for future use
- `src/tests/graph_read_model/query_graph.test.ts` — inline query proof snapshots (Phase 59 doc source)
- `src/tests/graph_read_model/query_live_baseline.test.ts` — live baseline query exemplars (Phase 59 doc source)

### Protected inputs (read-only)
- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

### Protected paths (must not mutate — GVAL-03)
- `data/taxonomy/taxonomy-seed.v2.json`
- `data/taxonomy/descriptor_aliases.seed.json`
- `data/taxonomy/alias_target_exceptions.v1.json`
- `data/compiled/v2/*`

### Safety guard reference
- `scripts/check-safety-guards.sh` — prior protected-path git guard patterns (inform audit scope, not replace SHA-256 proof)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GRAPH_OUTPUT_POLICY` — sanctioned path, forbidden prefixes, `/tmp` verification policy already locked in contract
- `buildOlfactoryGraph` + `validateOlfactoryGraph` — ready for CLI orchestration after JSON load
- `writeJsonDeterministic` + atomic tmp→rename from `write_outputs.ts` — direct writer pattern
- `alias_integrity` CLI — `--json` stdout proof, path resolution for `data/` from `src/` cwd
- Live baseline tests — read-only load pattern for compiled v2 artifacts in test layer

### Established Patterns
- Production graph modules remain **fs-free**; filesystem I/O only in CLI/writer and tests
- Zero runtime dependencies; `node:crypto` acceptable for SHA-256 boundary audit
- Vitest tests mirror module paths under `src/tests/graph_read_model/` and `src/tests/cli/`
- Deterministic JSON: `JSON.stringify(payload, null, 2)\n` — no wall-clock metadata by default
- Guardrail scripts run via npm and emit JSON proofs (`alias:integrity`, `verify:integrity`)

### Integration Points
- New `graph:build` npm script in `src/package.json`
- New CLI module under `src/cli/` wired to graph_read_model builder/validator
- Writer targets only `data/read-models/olfactory-graph/v2.11/graph.json`
- Phase 59 documentation will reference written `graph.json` and test-layer query proofs — keep `query_kind` values stable

</code_context>

<specifics>
## Specific Ideas

Operator discussion order and priorities: A (CLI workflow) → B (output layout) → C (boundary audit) → D (query serialization).

Operator intent for Phase 58:
- Guarded workflow, not generic export tooling
- v2.11 directory contains **only** `graph.json` as official artifact
- Audit proof is operational evidence of a `graph:build` run, not part of the read model
- Query proof disk export would mix responsibilities (Phase 58 = publish artifact; Phase 59 = document examples)

Boundary audit discussion (area C) locked:
- Hash scope = GVAL-03 exact set only (not inference, not graphify-out content)
- Graphify proof = static path guard + `graphify_out_accesses: 0` in audit JSON
- Audit report = structured stdout proof with per-file digests

Query serialization discussion (area D) locked:
- No query invocation in `graph:build`
- GQRY-05 already covered by Phase 57 tests
- Phase 59 docs copy from Vitest proofs, not from re-running queries on `graph.json`

</specifics>

<deferred>
## Deferred Ideas

- **`query_proofs.json` or sample proof artifacts on disk** — Phase 59 (`GDOC-01`); operator explicitly rejected for Phase 58
- **Decomposed graph files** (`nodes.json`, `edges.json`, `manifest.json`) — not needed for v2.11 baseline
- **Persisted `boundary_audit.json` in v2.11/** — audit stays stdout-only
- **Free `--out` flag for official writes** — increases mutation risk; deferred indefinitely for graph read model
- **CLI subcommands** (`build`, `validate`, `audit` separately) — deferred; one-shot sufficient for milestone
- **Maintainer documentation with query proof examples** — Phase 59
- **Neo4J mapping notes** — Phase 59 (`GDOC-02`)

</deferred>

---

*Phase: 58-CLI, Writer & Boundary Audit*
*Context gathered: 2026-06-10*
