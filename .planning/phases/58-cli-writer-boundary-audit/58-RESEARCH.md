# Phase 58: CLI, Writer & Boundary Audit — Research

**Researched:** 2026-06-10
**Status:** Research complete

## A. Existing CLI Patterns (Analog Analysis)

### A1. CLI Entrypoint Pattern — `alias_integrity.ts`
- **Location:** `src/cli/alias_integrity.ts`
- **Pattern:** Standalone module with `runAliasIntegrityCli(argv)` returning exit code; `main()` calls `process.exit()`
- **Entry guard:** `if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)`
- **Flags:** `--json` (structured stdout), `--help` (usage text)
- **Path resolution:** `resolveReadablePath()` — tries path as-is, then `../path` for `data/` prefixed paths (cwd is `src/`)
- **Output:** Human text by default, JSON with `--json`
- **Exit codes:** 0 = pass, 1 = fail

### A2. CLI Orchestration Pattern — `compile.ts`
- **Location:** `src/cli/compile.ts`
- **Pattern:** Load inputs → process → validate → write → report
- **Uses `parseCompileArgs()` from `parse_args.ts`**
- **Output dir resolution:** `resolveOutputDir()` — for default path, prefixes `../`
- **Error handling:** Catches `CliArgumentError` and `CompileWriteError` specifically

### A3. Argument Parser — `parse_args.ts`
- **Location:** `src/cli/parse_args.ts`
- **`DEFAULT_PATHS`** — canonical path constants for all data inputs
- **`CliArgumentError`** — custom error class for arg validation
- **Pattern:** Iterate `argv` array, match `--flag value` pairs via `FLAG_TO_KEY` map

### A4. npm Script Conventions — `package.json`
- **`compile`**: `node dist/cli/compile.js` (requires `precompile` = `tsc`)
- **`alias:integrity`**: `npm run precompile && node dist/cli/alias_integrity.js`
- **`verify:integrity`**: Same as `alias:integrity` (currently identical)
- **`compile:quality`**: Chain of compile + alias_integrity
- **New `graph:build` should follow:** `npm run precompile && node dist/cli/graph_read_model.js`

## B. Writer Pattern (Atomic Write)

### B1. `write_outputs.ts` Pattern
- **Location:** `src/compiler/write_outputs.ts`
- **`writeJsonDeterministic(path, payload)`**: `JSON.stringify(payload, null, 2)\n` with utf8
- **Atomic write pattern:**
  1. `mkdir(outputDir, { recursive: true })`
  2. Write to `.filename.tmp` (dot-prefixed temp)
  3. `rename(tmp, final)` for atomic swap
  4. On error: `cleanupTemps()` removes all `.tmp` files
- **Validation gate:** `writeCompileResults` throws `CompileWriteError` if `!result.ok`

### B2. Application to Phase 58
- Reuse `writeJsonDeterministic` directly from `write_outputs.ts`
- Create `write_graph_outputs.ts` (dedicated module, follows D-11 atomic write)
- Write flow: `mkdir -p data/read-models/olfactory-graph/v2.11/` → write `.graph.json.tmp` → `rename` to `graph.json`
- Output path enforcement: check against `GRAPH_OUTPUT_POLICY.forbidden_output_prefixes` before write

## C. Boundary Audit — SHA-256 Approach

### C1. Protected Files (GVAL-03 Exact Scope)
From CONTEXT.md D-13:
1. `data/taxonomy/taxonomy-seed.v2.json`
2. `data/taxonomy/descriptor_aliases.seed.json`
3. `data/taxonomy/alias_target_exceptions.v1.json`
4. All files under `data/compiled/v2/` (currently: `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`)

### C2. SHA-256 Implementation
- Use `node:crypto` (zero-dependency, per project conventions)
- `createHash('sha256').update(content).digest('hex')`
- **Pre-hash** all protected files before workflow starts
- **Post-hash** after `graph.json` write completes
- Compare digests; report `unchanged: true/false` per file
- Aggregate `ok` = all files unchanged

### C3. Graphify Isolation (GVAL-04)
- Static path guard: reject any path containing `graphify-out/` in loader and writer
- Audit report includes `graphify_out_accesses: 0`
- Do NOT hash `graphify-out/` contents (per D-14 — hash only proves content unchanged, not absence of reads)

### C4. Protected File Discovery
- For `data/compiled/v2/`: use `readdir` to enumerate files (currently 3 files: `taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`)
- For named files: hardcoded list matching D-13
- Path resolution: use same `resolveReadablePath` pattern as existing CLIs

## D. Output Path Policy Enforcement

### D1. Forbidden Prefix Rejection
- From `GRAPH_OUTPUT_POLICY.forbidden_output_prefixes`: `['data/compiled/', 'data/taxonomy/', 'data/inference/', 'graphify-out/']`
- Check output path against each prefix before write
- Return structured error if any match

### D2. `/tmp` Verification-Only Mode
- `--dry-run` flag: writes to `/tmp/graph-read-model-dry-run/` instead of sanctioned path
- No `--out` flag for official writes (per D-03)
- When dry-run: skip boundary audit post-hash (protected files are irrelevant in dry-run mode)
- Dry-run still runs build + validate to prove the pipeline works

## E. GVAL-05 Guardrails Integration

### E1. Required Guardrails (D-05)
After successful write, run:
1. `npm --prefix src run typecheck` (TypeScript check)
2. `npm --prefix src test` (Vitest suite)
3. `npm --prefix src run alias:integrity -- --json` (alias target integrity)
4. `npm --prefix src run verify:integrity -- --json` (verify integrity)

### E2. Implementation Approach
- Spawn via `node:child_process.execSync` or `execFileSync`
- Capture exit code + stdout for each guardrail
- Parse JSON output for `alias:integrity` and `verify:integrity`
- Report pass/fail per guardrail in structured output
- Non-zero exit from any guardrail = overall fail (exit 1)

### E3. Alternative: `--skip-guardrails` Flag
- For development/debugging: skip GVAL-05 steps
- Not documented as official workflow — development convenience only

## F. Module Structure Recommendation

### F1. New Files
1. **`src/cli/graph_read_model.ts`** — CLI entrypoint (orchestrates workflow)
2. **`src/graph_read_model/write_graph.ts`** — Writer module (atomic write, path policy enforcement)
3. **`src/graph_read_model/boundary_audit.ts`** — SHA-256 boundary audit (pre/post hash, graphify isolation)

### F2. Modified Files
1. **`src/package.json`** — Add `graph:build` npm script
2. **`src/graph_read_model/contract.ts`** — Add `GRAPH_PROTECTED_FILES` constant (optional — could live in `boundary_audit.ts`)

### F3. Test Files
1. **`src/tests/cli/graph_read_model.test.ts`** — CLI integration tests
2. **`src/tests/graph_read_model/write_graph.test.ts`** — Writer unit tests (path policy, atomic write)
3. **`src/tests/graph_read_model/boundary_audit.test.ts`** — Boundary audit unit tests (SHA-256 verification, graphify isolation)

## G. Existing Graph Module State

### G1. Production Modules (fs-free)
- `build_graph.ts` — `buildOlfactoryGraph(input: BuildOlfactoryGraphInput): OlfactoryGraph` — pure, no I/O
- `validate_graph.ts` — `validateOlfactoryGraph(graph: OlfactoryGraph): GraphValidationResult` — pure, no I/O
- `query_graph.ts` — query proof functions — pure, no I/O
- `contract.ts` — constants and types
- `types.ts` — all graph types

### G2. Test Coverage
- `build_graph.test.ts` — inline fixture builder tests
- `validate_graph.test.ts` — validation rule tests
- `contract.test.ts` — contract constant tests
- `live_artifact_baseline.test.ts` — live compiled artifact regression (reads `data/compiled/v2/`)
- `query_graph.test.ts` — inline query proof snapshots
- `query_live_baseline.test.ts` — live baseline query exemplars

### G3. Key Input Types
- `BuildOlfactoryGraphInput`: `{ taxonomy: CompiledTaxonomy, aliases: CompiledAliases, similarity: SimilarityGraph }`
- `OlfactoryGraph`: `{ schema_version, nodes: GraphNode[], edges: GraphEdge[], stats: GraphStats }`

## H. Risk Analysis

### H1. Path Resolution Complexity
- CLI runs from `src/` (npm scripts use `--prefix src`)
- Data paths like `data/compiled/v2/` need `../` prefix when cwd is `src/`
- Existing `resolveReadablePath` handles this — reuse it

### H2. Atomic Write Safety
- `data/read-models/olfactory-graph/v2.11/` doesn't exist yet — needs `mkdir -p`
- Only one file (`graph.json`) — simpler than compiler which writes 3 files
- `.graph.json.tmp` → `rename` to `graph.json` is atomic on same filesystem

### H3. Guardrail Execution Time
- `typecheck` + `test` + `alias:integrity` + `verify:integrity` can take 15-30s
- Consider running in sequence (simpler error reporting) vs parallel (faster)
- Recommendation: sequence — each depends on previous TypeScript build being valid

## Validation Architecture

### Phase 58 Validation Dimensions

| Dimension | Coverage | Method |
|-----------|----------|--------|
| Output path policy | Write to sanctioned path succeeds; forbidden prefixes rejected | Unit test `write_graph.test.ts` |
| Atomic write | Temp file created, renamed, cleanup on failure | Unit test `write_graph.test.ts` |
| SHA-256 boundary audit | Pre/post hashes match for all protected files | Unit test `boundary_audit.test.ts` |
| Graphify isolation | Path guard rejects `graphify-out/**` access | Unit test `boundary_audit.test.ts` |
| CLI orchestration | Full workflow produces expected output | Integration test `graph_read_model.test.ts` |
| GVAL-05 guardrails | All 4 guardrails pass after graph write | Live regression (CLI execution) |
| Dry-run mode | Output goes to `/tmp`, no official artifact created | Unit test `graph_read_model.test.ts` |
| JSON output | `--json` produces structured audit proof | Unit test `graph_read_model.test.ts` |

---

## RESEARCH COMPLETE

Phase 58 has 3 requirements (GVAL-03, GVAL-04, GVAL-05) across 3 new source files + 1 modified file + 3 test files. The codebase provides strong analogs in `alias_integrity.ts` (CLI pattern), `write_outputs.ts` (atomic writer), and `compile.ts` (orchestration). Zero new dependencies needed — `node:crypto` and `node:child_process` are built-in.
