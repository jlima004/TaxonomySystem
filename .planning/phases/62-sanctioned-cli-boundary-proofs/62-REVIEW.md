---
phase: 62-sanctioned-cli-boundary-proofs
reviewed: 2026-06-17T17:00:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - src/cli/sanctioned_graph_workflow.ts
  - src/cli/graph_read_model.ts
  - src/tests/cli/sanctioned_graph_workflow.test.ts
  - src/tests/cli/graph_read_model.test.ts
  - src/tests/helpers/directory_snapshot.ts
findings:
  critical: 0
  warning: 3
  info: 2
  total: 5
status: issues_found
---

# Phase 62: Code Review Report

**Reviewed:** 2026-06-17T17:00:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Phase 62 extracts sanctioned graph build orchestration into `runSanctionedGraphWorkflow`, keeps `graph_read_model.ts` as a thin CLI adapter, and adds sandbox boundary proofs with directory snapshots. The fail-closed ordering (forbidden-path check → pre-digest → build/validate → guardrails → write → boundary audit) is implemented correctly, and guardrail/forbidden-path tests prove `writeGraphOutput` is not invoked on failure.

No critical or blocker issues were found. Three warnings highlight API inconsistencies and edge-case robustness gaps that could cause incorrect behavior outside the primary CLI path. Two info items note minor testability and helper completeness gaps.

## Warnings

### WR-01: `loadGraphInputs` ignores `baseDir` while the rest of the workflow uses it

**File:** `src/cli/sanctioned_graph_workflow.ts:142-154`
**Issue:** `loadGraphInputs` accepts `baseDir` but prefixes the parameter with `_` and resolves input paths relative to `process.cwd()` via `resolveReadablePath(relPath)`. Meanwhile `discoverProtectedFiles`, `capturePreDigests`, and `runBoundaryAudit` all resolve paths under `baseDir`. A programmatic caller passing a `baseDir` different from the effective cwd could build the graph from one project's compiled inputs while auditing another project's protected files.
**Fix:**
```typescript
export const loadGraphInputs = async (baseDir: string): Promise<BuildOlfactoryGraphInput> => {
  const [taxonomyPath, aliasesPath, similarityPath] = await Promise.all(
    GRAPH_ALLOWED_PRODUCTION_INPUTS.map(async (relPath) =>
      resolveReadablePath(join(baseDir, relPath)),
    ),
  )
  // ...
}
```
Update `resolveReadablePath` to handle absolute/baseDir-prefixed paths (drop the cwd-only `../data/` fallback or apply it relative to `baseDir`).

### WR-02: Shared fixed dry-run output path is unsafe under concurrency

**File:** `src/cli/graph_read_model.ts:220-221`
**Issue:** All `--dry-run` invocations write to the hardcoded `/tmp/graph-read-model-dry-run` directory. Concurrent dry-run runs (or a dry-run overlapping with tests that use the same path) can race on `graph.json` and `.graph.json.tmp`, producing corrupted artifacts or flaky test results.
**Fix:** Use a process-unique directory, e.g. `join(tmpdir(), 'graph-read-model-dry-run')` or append `process.pid`, and document cleanup expectations. Tests should align on the same resolution strategy.

### WR-03: `buildOlfactoryGraph` throws bypass the typed workflow result union

**File:** `src/cli/sanctioned_graph_workflow.ts:215-216`
**Issue:** Most failure modes return a typed `{ ok: false, reason, message }` result, but `buildOlfactoryGraph(input)` is called without a try/catch. Malformed compiled input that parses as JSON but violates runtime assumptions will throw, bypassing `SanctionedWorkflowResult` and relying on the CLI entrypoint's top-level catch instead.
**Fix:**
```typescript
let graph: OlfactoryGraph
try {
  graph = buildOlfactoryGraph(input)
} catch (error) {
  return {
    ok: false,
    reason: 'validation_failed', // or a dedicated 'build_failed' reason
    message: error instanceof Error ? error.message : String(error),
  }
}
```

## Info

### IN-01: `printHelp()` bypasses injectable stdout in `runGraphBuildCli`

**File:** `src/cli/graph_read_model.ts:214-216, 43-44`
**Issue:** `runGraphBuildCli` accepts injectable `stdout`/`stderr` for testing, but `--help` calls `printHelp()` which always writes to `console.log`. Callers using custom stream sinks cannot capture help output through the DI seam.
**Fix:** Pass `stdout` into `printHelp(stdout?: Pick<Console, 'log'>)` and use it from `runGraphBuildCli`.

### IN-02: `directory_snapshot` silently skips symlinks

**File:** `src/tests/helpers/directory_snapshot.ts:42-54`
**Issue:** The walker only records entries where `dirent.isFile()` or recurses into `dirent.isDirectory()`. Symlinks (including symlink-to-file replacements under `graphify-out/**`) are omitted from snapshots, so certain filesystem mutations would not fail the GVAL-09 isolation proof.
**Fix:** Add an explicit branch for `dirent.isSymbolicLink()` that records link target metadata or resolves and hashes the target, depending on desired proof strictness.

---

_Reviewed: 2026-06-17T17:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
