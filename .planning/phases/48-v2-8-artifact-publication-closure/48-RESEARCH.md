# Phase 48: v2.8 Artifact Publication & Closure - Research

**Researched:** 2026-06-04  
**Domain:** Internal TypeScript compile-orchestration, published JSON artifact verification, release closure reporting  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Sandbox-vs-Publish Flow (D-48-FLOW)
- **D-48-F01:** Phase 48 follows the **two-step Phase 43 publication pattern**: (1) sandbox compile in `/tmp` with `--version 2.8.0` → (2) assert zero hard failures → (3) official compile in `data/compiled/v2/` with the same `--version 2.8.0` flag. **No single-step publication.** The /tmp artifacts are validation-only and must not be copied or referenced as source of truth.
- **D-48-F02:** The sandbox compile must produce **zero hard failures** (the v2.7 invariant). The official compile must also produce zero hard failures. Any hard failure is an immediate halt; Phase 48 must not commit publication until both passes are clean.
- **D-48-F03:** The sandbox compile output directory is **discarded** after validation. The /tmp artifacts are not the source of truth for the closure report — only the published `data/compiled/v2/` JSON is.

#### Version String & DEFAULT_PATHS Policy (D-48-VER)
- **D-48-V01:** Phase 48 publishes with **explicit `--version 2.8.0`** at the official compile step. The CLI flag overrides the default.
- **D-48-V02:** `src/cli/parse_args.ts` `DEFAULT_PATHS.version` stays at `'2.1.0'` and **must not change**. This matches the v2.6 and v2.7 publication precedent (Phase 39 / Phase 43): no default-switch, no DEFAULT_PATHS mutation, no parser/CLI behavior change. The v2.8 version is delivered only via explicit `--version 2.8.0` at compile time.
- **D-48-V03:** The version string `2.8.0` appears in the published JSON outputs (`taxonomy.json.version`, `similarity_matrix.json.version`, `descriptor_aliases.json.version`) and in the closure report header.

#### Closure Report Location & Metrics (D-48-CR)
- **D-48-CR01:** The **release-style closure report** lives at `.planning/releases/v2.8.0-CLOSURE.md` (matches the v1.0 / v2.1 / v2.2 / v2.3 / v2.4 / v2.5 release closure pattern; v2.6 used the phase dir and v2.7 was not preserved). The closure report is the **official milestone closure artifact**.
- **D-48-CR02:** Phase 48 may **also** write `48-VERIFICATION.md` and `48-01-SUMMARY.md` in the phase directory for GSD audit trail, but the release-style closure report at `.planning/releases/v2.8.0-CLOSURE.md` is the source of truth for milestone closure metrics.
- **D-48-CR03:** Closure report metrics are **measured from the published compiled JSON artifacts** in `data/compiled/v2/`, **not** from `/tmp`. The published JSON is re-parsed by the report writer; sandbox metrics are not cited.
- **D-48-CR04:** Mandatory metrics in the closure report:
  - `version` — must read `2.8.0` from all three published artifacts.
  - `family_count`, `subfamily_count`, `seed_descriptor_count` (from `taxonomy.json`).
  - `compiled_descriptor_count` (from `taxonomy.json.stats.descriptor_count`).
  - `alias_count` (from `descriptor_aliases.json` aliases map length).
  - `graph_edge_count` (from `similarity_matrix.json.stats.edge_count`).
  - `review_queue_total` and **breakdown by `type`** and by `severity` (from `similarity_matrix.json.review_queue`).
  - `validation_status` (must read `ok`).
  - `quality_gate_status` (must read `PASS`).
  - `generated_at` (timestamp from the published artifacts).
- **D-48-CR05:** The closure report must include a **pre/post delta table v2.7.0 → v2.8.0** for every mandatory metric. v2.7.0 baseline is read from git history (the `data/compiled/v2/` tree as it was before the v2.8 publication commit). Delta direction is documented (e.g., `+12 seed descriptors`, `±0 alias_count`, `±0 graph_edge_count`, `−N review_queue_total` because some low_support items were absorbed into the new seed set).
- **D-48-CR06:** The closure report must include an **explicit "Protected Boundaries Unchanged"** section that asserts:
  - `data/taxonomy/taxonomy-seed.v1.json` — byte-identical to its pre-publication state.
  - `data/taxonomy/descriptor_aliases.seed.json` — byte-identical (zero alias mutation in this phase).
  - `data/inference/*` — byte-identical (relation/accord inputs untouched).
  - `data/compiled/v1/*` — byte-identical.
  - `src/cli/parse_args.ts` — byte-identical (`DEFAULT_PATHS.version` still `2.1.0`).
  - `graphify-out/*` — no staged or committed changes.
  - `package.json` / `package-lock.json` — byte-identical.
  - No v2.7 explicit decision was reconsidered.
- **D-48-CR07:** The closure report must list the **12 promoted seed descriptors** (id ↔ `target_family/target_subfamily/target_descriptor`) and confirm each is present in the published `taxonomy.json` at the approved path.
- **D-48-CR08:** The closure report is the **last** step of Phase 48. It is written only after the published JSON passes the protected-boundary hash assertions, the safety guard, and the full vitest suite.

#### Plan Structure (D-48-PLAN)
- **D-48-P01:** Phase 48 ships a **single** plan: `48-01-PLAN.md` covering the full publication + closure flow.
- **D-48-P02:** The single 48-01 plan must follow this locked 7-step flow (user-verbatim):
  1. **Pre-publication stability gate (WR-01):** Confirm `src/tests/fixtures/curation/46-DECISION-MATRIX.md` is present and that `vitest run` exits 0. The fixture was committed in Phase 47; this gate is a confirmation, not a fix. If the test fails, halt and repair (or escalate to a future phase).
  2. **Sandbox compile in `/tmp`:** Run the official compile with `--version 2.8.0` and an explicit `--out /tmp/compile-2.8-validate/`. Capture stderr, stdout, and the produced JSON artifacts. Assert `validation_status=ok` and `quality_gate_status=PASS` and zero hard failures.
  3. **Official compile to `data/compiled/v2/`:** Run the same compile with `--version 2.8.0` writing to `data/compiled/v2/` (the default `outputDir` resolved via the existing `resolveOutputDir` logic). Capture stdout.
  4. **Published-artifact verification:** Capture the v2.7.0 baseline metrics **before** the official compile overwrites the JSON, directly from the current `data/compiled/v2/*.json` files (one snapshot read, then the files are overwritten by step 3 — but step 3 runs **after** this capture). Re-parse the three published JSON files, assert `version=2.8.0`, capture the full metric set per D-48-CR04, compute the pre/post delta vs the v2.7.0 baseline captured earlier, and assert the 12 promoted seeds are present at the approved paths in `taxonomy.json`.
  5. **Protected-boundary hash/diff assertions:** For each path in D-48-CR06, run `git diff --name-only` and an inline `sha256sum` (or equivalent) compare to confirm byte-identical state. Run `scripts/check-safety-guards.sh` and confirm exit 0.
  6. **Full test suite:** Run `vitest run` from the `src/` package. Assert exit 0 (full suite, not narrowed).
  7. **Closure report + bookkeeping:** Write `.planning/releases/v2.8.0-CLOSURE.md` with all mandatory metrics and assertions from D-48-CR04 / D-48-CR05 / D-48-CR06 / D-48-CR07. Write `48-VERIFICATION.md` and `48-01-SUMMARY.md` in the phase directory. Update `.planning/ROADMAP.md` (Phase 48 → Complete), `.planning/STATE.md` (current focus → milestone closure / next-milestone handoff), and `.planning/REQUIREMENTS.md` (PUB-01/PUB-02/PUB-03 → Complete). Then commit.
- **D-48-P03:** Each of the 7 steps is a separate task in the plan. Tasks must produce a clear pass/fail signal. Any task failure halts publication; the executor must not auto-recover.
- **D-48-P04:** The plan may commit the published artifacts and the bookkeeping updates as a single plan-level commit OR as two commits (D-48-P04).
- **D-48-P05:** The closure report is committed in the same plan (last task), not deferred. The release closure is the publication's own signature — without it, the milestone is not closed.

#### Additional locked gates
- Use `--out`, not `--output`.
- Capture baseline v2.7 before overwrite.
- Sandbox compile in `/tmp`.
- Official compile to `data/compiled/v2` with `--version 2.8.0`.
- Closure report metrics measured from published JSON files.
- Full `vitest` passes.
- `DEFAULT_PATHS.version` remains `2.1.0`.
- Protected-boundary hash/diff assertions pass.

### the agent's Discretion
- The exact wording of the closure report's narrative sections (e.g., "What Shipped", "Issues Resolved", "Issues Deferred", "Technical Debt Incurred") — content must include the mandatory metrics in D-48-CR04 / D-48-CR05 / D-48-CR06 / D-48-CR07, but the prose around them is executor's choice.
- Whether to capture an additional `--quality-report` artifact in `48-VERIFICATION.md` (the CLI supports `--quality-report` which adds candidate_count, rejected_noise_count, etc. — useful evidence but not required by D-48-CR04).
- The exact Python or Node.js snippet shape used to re-parse the published JSON and compute the pre/post delta (must produce the metrics in D-48-CR04 and the hash assertions in D-48-PB03, otherwise free).
- Whether to commit the published artifacts and bookkeeping in one plan-level commit or two (D-48-P04).

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. The four user-selected areas (closure report metrics & structure, version string & DEFAULT_PATHS policy, sandbox-vs-publish flow shape, plan structure & protected-boundary assertion) plus the additional WR-01 pre-publication gate are all preserved as D-48-F01 through D-48-PB04 in this CONTEXT.md.

The 28 non-executable Phase 46 matrix rows remain on the review queue and are not part of Phase 48. They will be reconsidered only in future batches with explicit planning (FUT-01, FUT-02 in REQUIREMENTS.md).

The v2.8 archived fallback path (`.planning/milestones/v2.8-phases/...`) is a **milestone-archival concern** and is not a Phase 48 deliverable. Milestone archival is a separate GSD workflow (`/gsd-complete-milestone`).

The 10 remaining `seed_corpus_conflict` items are out of scope for v2.8 (they would require explicit conflict-reopening planning) and remain on the review queue.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PUB-01 | Curator can validate v2.8 compilation in a sandbox before official artifact publication. | Use `npm run precompile && npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at <UTC-Z>` from `src/`; parser accepts `--out`, and a research sandbox compile passed with `validation_status=ok`, `quality_gate_status=PASS`, 340 descriptors, 13 edges, 256 review items. [VERIFIED: codebase read + bash sandbox compile] |
| PUB-02 | Curator can publish v2.8 compiled artifacts with updated taxonomy, aliases, similarity graph, review_queue metrics, and artifact version alignment. | Official compile should run once after baseline capture, with `--version 2.8.0` and default output resolution to `../data/compiled/v2` when run from `src/`; `writeCompileResults` writes exactly `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`. [VERIFIED: src/cli/compile.ts + src/compiler/write_outputs.ts] |
| PUB-03 | Curator can produce a v2.8 closure report whose metrics are measured from the published compiled JSON artifacts. | Closure script/snippet must re-read `data/compiled/v2/*.json` after publication and compute version, counts, review_queue breakdowns, generated_at, delta versus pre-overwrite v2.7 baseline, and promoted seed presence. [CITED: 48-CONTEXT.md D-48-CR03/D-48-CR04/D-48-CR05/D-48-CR07] |
</phase_requirements>

## Summary

Phase 48 is not a library-selection or implementation phase; it is an internal publication orchestration phase over an already-existing TypeScript compiler CLI. [VERIFIED: 48-CONTEXT.md + src/cli/compile.ts] The planner should preserve the locked seven-task flow exactly: WR-01 preflight, `/tmp` sandbox compile, v2.7 baseline capture before overwrite, official compile to `data/compiled/v2`, published JSON verification, protected-boundary checks, full Vitest, then release closure/bookkeeping. [CITED: 48-CONTEXT.md D-48-P02]

The current v2.7 published baseline in `data/compiled/v2` is version-aligned at `2.7.0` across all three artifacts, with 10 families, 18 subfamilies, 324 compiled descriptors, 18 aliases, 13 graph edges, and 269 review_queue items. [VERIFIED: bash JSON metric script over data/compiled/v2] A research sandbox compile of the Phase 47-mutated seed using `--version 2.8.0 --out /tmp/compile-2.8-research-validate` produced 340 compiled descriptors, 18 aliases, 13 graph edges, and 256 review_queue items with `validation_status=ok` and `quality_gate_status=PASS`; these are planning evidence only and must not become closure-report source of truth. [VERIFIED: bash sandbox compile]

**Primary recommendation:** Plan a single `48-01-PLAN.md` with seven halt-on-failure tasks and no source/package/data-input mutation; use small Node.js metric/hash snippets for repeatable JSON re-parsing and boundary assertions. [VERIFIED: 48-CONTEXT.md + codebase read]

## Project Constraints (from AGENTS.md)

No `AGENTS.md` exists at the repository root, so there are no additional AGENTS.md directives to enforce. [VERIFIED: Read tool file-not-found]

Project skill discovery found GSD skills under `.agents/skills/`; relevant skill patterns are: planning should preserve research/verification gates, execution tasks should produce clear pass/fail signals, verify-work produces UAT evidence after execution, and milestone archival is a separate `/gsd-complete-milestone` workflow after Phase 48. [VERIFIED: .agents/skills/gsd-plan-phase/SKILL.md, gsd-execute-phase/SKILL.md, gsd-verify-work/SKILL.md, gsd-complete-milestone/SKILL.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Compile invocation | CLI / Build Tooling | Filesystem | `src/cli/compile.ts` loads inputs, compiles, validates, and writes outputs; Phase 48 invokes it, not rewrites it. [VERIFIED: src/cli/compile.ts] |
| Sandbox validation | CLI / Build Tooling | `/tmp` filesystem | `--out` directs output outside the repo; `/tmp` artifacts are validation evidence only. [VERIFIED: src/cli/parse_args.ts + bash sandbox compile] |
| Official artifact publication | Filesystem artifact tier | CLI / Build Tooling | `writeCompileResults` atomically writes the three JSON artifacts to the resolved output directory. [VERIFIED: src/compiler/write_outputs.ts] |
| Published metrics and closure report | Planning docs tier | Filesystem artifact tier | Closure metrics must be computed by re-reading published JSON files, then written to `.planning/releases/v2.8.0-CLOSURE.md`. [CITED: 48-CONTEXT.md D-48-CR03] |
| Boundary protection | Git / repository state | Shell guard | Safety guard and hash/diff assertions verify that protected source/input/archive surfaces remain unchanged. [VERIFIED: scripts/check-safety-guards.sh + 48-CONTEXT.md] |

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Node.js runtime | v24.14.0 available | Runs compiled CLI and Node.js verification snippets | Existing project is ESM TypeScript compiled to Node-executed JS. [VERIFIED: node --version + src/package.json] |
| npm | 11.9.0 available | Runs `precompile`, `compile`, and `test` scripts | Existing `src/package.json` scripts define all needed commands. [VERIFIED: npm --version + src/package.json] |
| TypeScript | 5.9.3 locked; 6.0.3 latest registry | Builds `dist/cli/compile.js` via `tsc` | Existing compiler source is TypeScript and `precompile` aliases `npm run build`. [VERIFIED: src/package-lock.json + npm registry] |
| Vitest | 3.2.4 locked; 4.1.8 latest registry | Full test suite gate via `vitest run` | Existing `npm run test` maps to `vitest run`; Vitest docs confirm CLI file filtering and config include patterns. [VERIFIED: package-lock + npm registry] [CITED: Context7 /vitest-dev/vitest] |
| GNU sha256sum | coreutils 9.4 available | Byte-identical protected-boundary hash assertions | Required by D-48-PB03 and available locally. [VERIFIED: sha256sum --version + 48-CONTEXT.md] |
| Git | 2.54.0 available | Baseline capture, diff allow-list, and commit boundary | Phase 48 uses git history/diff to prove v2.7 baseline and protected surfaces. [VERIFIED: git --version + 48-CONTEXT.md] |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `scripts/check-safety-guards.sh` | repository script | Non-mutating staged/dirty protected-path and Graphify guard | Run after sandbox, after official compile, and before commit. [VERIFIED: scripts/check-safety-guards.sh + 48-CONTEXT.md D-48-PB02] |
| Node.js one-off snippets | Node v24.14.0 | Parse JSON metrics, count review_queue by type/severity, assert promoted paths | Use instead of modifying source or adding dependencies. [VERIFIED: node availability + no package changes allowed] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Node.js metric snippets | Python snippets | Both can parse JSON, but Node is already required by the project and avoids introducing another runtime dependency into the plan. [VERIFIED: environment availability] |
| `git diff --name-only` plus `sha256sum` | Narrative-only protected-boundary statement | Narrative-only does not prove byte identity; hash/diff assertions are locked by D-48-PB03. [CITED: 48-CONTEXT.md] |
| Running official compile with `--out data/compiled/v2` from repo root | Running from `src` with default output resolution | Locked flow says official compile should use the existing default `resolveOutputDir` behavior from `src`; planner should not invent alternate publication paths. [VERIFIED: src/cli/compile.ts:80 + 48-CONTEXT.md] |

**Installation:** No package installation is required or allowed in Phase 48; `package.json` and `package-lock.json` must remain byte-identical. [CITED: 48-CONTEXT.md forbidden surfaces]

## Package Legitimacy Audit

No new external packages are recommended or installed for this phase. [VERIFIED: phase scope + 48-CONTEXT.md] Existing dev dependencies were scanned only to inform validation planning.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `vitest` | npm | Created 2021-12-03; modified 2026-06-01 | Not collected | github.com/vitest-dev/vitest | SUS (typosquat-risk warning vs `vite`) | Existing locked dev dependency only; do not install or change. [VERIFIED: npm registry + slopcheck scan package.json] |
| `typescript` | npm | Created 2012-10-01; modified 2026-04-16 | Not collected | github.com/microsoft/TypeScript | OK | Existing locked dev dependency only; do not install or change. [VERIFIED: npm registry + slopcheck scan package.json] |
| `@types/node` | npm | Created 2016-05-17; modified 2026-06-04 | Not collected | github.com/DefinitelyTyped/DefinitelyTyped | OK | Existing locked dev dependency only; do not install or change. [VERIFIED: npm registry + slopcheck scan package.json] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: slopcheck scan package.json]  
**Packages flagged as suspicious [SUS]:** `vitest`, but it is already locked in `package-lock.json` and no dependency mutation is allowed. [VERIFIED: slopcheck scan package.json + 48-CONTEXT.md]

## Architecture Patterns

### System Architecture Diagram

```text
Phase 47-mutated seed + existing aliases/relations/accords/noise/stopwords
        │
        ▼
Pre-publication gate: fixture exists + full vitest PASS
        │
        ▼
Sandbox compile in /tmp using --version 2.8.0 --out /tmp/compile-2.8-validate
        │              └─ if validation_status != ok or quality_gate_status != PASS → HALT
        ▼
Capture v2.7 baseline metrics + protected-boundary hashes before overwrite
        │
        ▼
Official compile from src via npm run compile -- --version 2.8.0
        │              └─ writes data/compiled/v2/{taxonomy,descriptor_aliases,similarity_matrix}.json
        ▼
Re-read published JSON metrics + assert version alignment + 12 promoted paths
        │
        ▼
Protected diff/hash guard + scripts/check-safety-guards.sh + full vitest
        │              └─ any mismatch/failure → HALT, restore v2.7 artifacts if needed
        ▼
.planning/releases/v2.8.0-CLOSURE.md + 48-VERIFICATION.md + 48-01-SUMMARY.md
```

All arrows above are required by the locked two-step publication and closure flow. [CITED: 48-CONTEXT.md D-48-P02]

### Recommended Project Structure

```text
data/compiled/v2/                         # official published v2.8.0 JSON outputs only
├── taxonomy.json
├── descriptor_aliases.json
└── similarity_matrix.json

.planning/releases/
└── v2.8.0-CLOSURE.md                     # release-style closure report, source of truth

.planning/phases/48-v2-8-artifact-publication-closure/
├── 48-01-PLAN.md                         # single locked 7-task plan
├── 48-VERIFICATION.md                    # exact commands/stdout/hash evidence
└── 48-01-SUMMARY.md                      # executive closure handoff
```

This structure is constrained by D-48-CA01 and allowed surfaces. [CITED: 48-CONTEXT.md]

### Pattern 1: Use `--out`, never `--output`

**What:** The parser maps `--out` to `outputDir` and throws `Unknown option` for unrecognized flags. [VERIFIED: src/cli/parse_args.ts]  
**When to use:** Every sandbox compile needing an explicit output directory. [CITED: 48-CONTEXT.md D-48-SB01]  
**Example:**

```bash
cd src
npm run precompile
npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z
```

### Pattern 2: Re-parse JSON for closure metrics

**What:** Treat CLI stdout as evidence, but compute closure metrics by reading `data/compiled/v2/*.json` after official publication. [CITED: 48-CONTEXT.md D-48-CR03]  
**When to use:** Closure report generation and pre/post delta table. [CITED: 48-CONTEXT.md]  
**Example:**

```bash
node -e "const fs=require('fs'); const tax=JSON.parse(fs.readFileSync('data/compiled/v2/taxonomy.json','utf8')); const al=JSON.parse(fs.readFileSync('data/compiled/v2/descriptor_aliases.json','utf8')); const sim=JSON.parse(fs.readFileSync('data/compiled/v2/similarity_matrix.json','utf8')); const count=(a,k)=>a.reduce((m,x)=>(m[x[k]]=(m[x[k]]||0)+1,m),{}); console.log(JSON.stringify({version:[tax.version,al.version,sim.version], family_count:tax.stats.family_count, subfamily_count:tax.stats.subfamily_count, compiled_descriptor_count:tax.stats.descriptor_count, alias_count:Object.keys(al.aliases).length, graph_edge_count:sim.stats.edge_count, review_queue_total:sim.review_queue.length, review_queue_by_type:count(sim.review_queue,'type'), review_queue_by_severity:count(sim.review_queue,'severity'), generated_at:[tax.generated_at,al.generated_at,sim.generated_at]}, null, 2));"
```

### Pattern 3: Hash before/after protected boundaries

**What:** Compute `sha256sum` for protected paths before publication, compute again after publication, and fail on mismatch. [CITED: 48-CONTEXT.md D-48-PB03]  
**When to use:** Before closure report writing and before commit. [CITED: 48-CONTEXT.md]  
**Example:**

```bash
sha256sum data/taxonomy/taxonomy-seed.v1.json data/taxonomy/descriptor_aliases.seed.json data/inference/*.json data/compiled/v1/*.json src/cli/parse_args.ts src/package.json src/package-lock.json
```

### Anti-Patterns to Avoid

- **Using `--output`:** The parser has no `--output` alias, so this fails with `Unknown option`. [VERIFIED: src/cli/parse_args.ts]
- **Measuring closure from `/tmp`:** Sandbox metrics are evidence only and are forbidden as closure source of truth. [CITED: 48-CONTEXT.md D-48-CR03]
- **Changing `DEFAULT_PATHS.version`:** `DEFAULT_PATHS.version` is still `'2.1.0'` and must remain unchanged; v2.8 alignment comes only from `--version 2.8.0`. [VERIFIED: src/cli/parse_args.ts] [CITED: 48-CONTEXT.md D-48-V02]
- **Writing closure before tests/guards:** The closure report is the last step after published JSON, protected-boundary assertions, safety guard, and full Vitest. [CITED: 48-CONTEXT.md D-48-CR08]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Compilation pipeline | Custom JSON writer or copied `/tmp` artifacts | Existing `npm run compile -- --version 2.8.0` | Existing CLI validates then writes deterministic outputs; copying `/tmp` violates source-of-truth decisions. [VERIFIED: src/cli/compile.ts + src/compiler/write_outputs.ts] |
| Output flag parsing | Alternate CLI flag or shell alias | `--out` | Only `--out` is supported. [VERIFIED: src/cli/parse_args.ts] |
| Artifact validation | Manual eyeballing | Re-read JSON + count + assert versions/statuses | Closure must be metrics-backed and measured from published JSON. [CITED: 48-CONTEXT.md] |
| Boundary proof | Narrative statement | `git diff --name-only`, `sha256sum`, `scripts/check-safety-guards.sh` | Required to prove success criterion 4. [CITED: 48-CONTEXT.md] |
| Test runner | New test framework | Existing Vitest suite | `src/package.json` already maps `test` to `vitest run`; research run passed 53 files / 376 tests. [VERIFIED: bash npm run test] |

**Key insight:** Phase 48 risk is procedural drift, not missing implementation capability; the planner should create guardrailed orchestration tasks, not code changes. [VERIFIED: 48-CONTEXT.md + codebase read]

## Common Pitfalls

### Pitfall 1: Baseline captured after overwrite
**What goes wrong:** The v2.7 baseline becomes unrecoverable from the working tree for easy delta reporting. [CITED: 48-CONTEXT.md D-48-P02 step 4]  
**Why it happens:** Official compile overwrites `data/compiled/v2/*.json`. [CITED: 48-CONTEXT.md D-48-PUB02]  
**How to avoid:** First task before official compile should serialize current v2.7 metrics to `48-VERIFICATION.md` or a shell variable/temp file, then compile. [VERIFIED: current data/compiled/v2 metric script]  
**Warning signs:** Delta table values equal v2.8 on both sides, or closure report cites `/tmp`. [CITED: 48-CONTEXT.md]

### Pitfall 2: Safety guard conflicts with intentional compiled artifact changes
**What goes wrong:** `scripts/check-safety-guards.sh` reports `PROTECTED_DIFF` because `data/compiled/v2` is intentionally changed. [VERIFIED: scripts/check-safety-guards.sh checks data/compiled/v2]  
**Why it happens:** The guard was designed broadly for protected-path safety and will flag official publication diffs. [VERIFIED: scripts/check-safety-guards.sh]  
**How to avoid:** Planner must specify interpretation: guard should PASS before publication; after official compile, use explicit allow-list/hash assertions to distinguish the three authorized compiled v2 outputs from forbidden protected drift, and handle any non-zero guard according to D-48-PB04/user approval. [CITED: 48-CONTEXT.md D-48-PB01/D-48-PB04]  
**Warning signs:** Guard failure is ignored or committed without an allow-list rationale. [CITED: 48-CONTEXT.md]

### Pitfall 3: Version mismatch across artifacts
**What goes wrong:** One artifact remains `2.7.0` while others read `2.8.0`. [CITED: 48-CONTEXT.md D-48-V03]  
**Why it happens:** Manual edits, partial writes, or running compile without `--version 2.8.0`. [VERIFIED: src/cli/compile.ts passes args.version to compileAll]  
**How to avoid:** Assert all three JSON `version` fields equal `2.8.0` after publication. [CITED: 48-CONTEXT.md D-48-CR04]  
**Warning signs:** Closure report header says v2.8.0 but JSON versions differ. [CITED: 48-CONTEXT.md]

### Pitfall 4: Promoted seed path check uses seed JSON instead of published taxonomy
**What goes wrong:** Report proves Phase 47 mutation but not Phase 48 publication. [CITED: 48-CONTEXT.md D-48-CR07]  
**Why it happens:** `data/taxonomy/taxonomy-seed.v2.json` already has the 12 descriptors; publication proof must inspect compiled `taxonomy.json`. [VERIFIED: data/taxonomy/taxonomy-seed.v2.json metrics + 48-CONTEXT.md]  
**How to avoid:** Search compiled `taxonomy.json` family/subfamily descriptor arrays for the 12 approved paths. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts has the exact path list]

## Code Examples

### Sandbox compile command

```bash
cd src
npm run precompile
npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z --quality-report
```

Research execution of this pattern passed with `validation_status=ok`, `quality_gate_status=PASS`, 340 compiled descriptors, 13 edges, and 256 review items. [VERIFIED: bash sandbox compile]

### Published metrics parser

```javascript
const fs = require('fs')
const tax = JSON.parse(fs.readFileSync('data/compiled/v2/taxonomy.json', 'utf8'))
const aliases = JSON.parse(fs.readFileSync('data/compiled/v2/descriptor_aliases.json', 'utf8'))
const sim = JSON.parse(fs.readFileSync('data/compiled/v2/similarity_matrix.json', 'utf8'))
const countBy = (items, key) => items.reduce((acc, item) => ((acc[item[key]] = (acc[item[key]] ?? 0) + 1), acc), {})

console.log({
  versions: [tax.version, aliases.version, sim.version],
  family_count: tax.stats.family_count,
  subfamily_count: tax.stats.subfamily_count,
  compiled_descriptor_count: tax.stats.descriptor_count,
  alias_count: Object.keys(aliases.aliases).length,
  graph_edge_count: sim.stats.edge_count,
  review_queue_total: sim.review_queue.length,
  review_queue_by_type: countBy(sim.review_queue, 'type'),
  review_queue_by_severity: countBy(sim.review_queue, 'severity'),
  generated_at: [tax.generated_at, aliases.generated_at, sim.generated_at],
})
```

Source pattern is direct JSON re-parsing, which is mandated for closure metrics. [CITED: 48-CONTEXT.md D-48-CR03]

### 12 promoted seed paths for publication assertion

```text
spicy/warm_spice/carrot_seed
floral/floral_white/freesia
spicy/warm_spice/cardamom
citrus/citrus_fresh/tangerine
spicy/warm_spice/saffron
floral/floral_white/osmanthus
spicy/warm_spice/cubeb
floral/floral_white/elderflower
spicy/warm_spice/mace
floral/floral_white/linden_flower
woody/woody_dry/agarwood
amber_resinous/balsamic_resin/tolu
```

This list is present in the curation contract test and is also described in the Phase 48 context. [VERIFIED: src/tests/curation/taxonomy_seed_v2.test.ts] [CITED: 48-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Candidate-only v2 or temporary compiles | Official `data/compiled/v2` publication with explicit version flag | v2.1+ and v2.7 precedent | Phase 48 should publish v2.8 by explicit `--version`, not default mutation. [VERIFIED: STATE.md + 48-CONTEXT.md] |
| Closure metrics from CLI narrative | Closure metrics from re-parsed published JSON | Locked for Phase 48 | Prevents `/tmp` or stale stdout from becoming the closure source of truth. [CITED: 48-CONTEXT.md] |
| Narrative protected-boundary claims | Hash/diff assertions plus safety guard | Phase 48 locked gate | Success criterion 4 becomes mechanically auditable. [CITED: 48-CONTEXT.md] |

**Deprecated/outdated:**
- `--output`: not supported; use `--out`. [VERIFIED: src/cli/parse_args.ts]
- Any Phase 48 source-code or package change: forbidden by phase boundary. [CITED: 48-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Exact closure prose headings can be chosen by executor as long as mandatory metrics/assertions are present. [ASSUMED] | Architecture Patterns / Summary | Low; D-48 discretion explicitly allows prose choice, but user may prefer a prior release style. |

## Open Questions (RESOLVED)

1. **RESOLVED: How should `scripts/check-safety-guards.sh` be treated after intentional `data/compiled/v2` publication?**
   - What we know: D-48-PB02 says run it after official compile, but the script flags any working-tree diff under `data/compiled/v2`. [VERIFIED: scripts/check-safety-guards.sh] [CITED: 48-CONTEXT.md]
   - Resolution: D-48-PB04 remains authoritative. `scripts/check-safety-guards.sh` must exit 0 before publication. After official publication and before commit, any non-zero guard result is a halt condition unless the executor first proves the diff is exactly the three authorized `data/compiled/v2/*.json` artifacts, verifies all protected-boundary hashes, documents the guard output, and obtains explicit user approval before continuing. No automatic continuation is permitted. [CITED: 48-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Compile CLI and metrics snippets | ✓ | v24.14.0 | None needed. [VERIFIED: node --version] |
| npm | Project scripts | ✓ | 11.9.0 | None needed. [VERIFIED: npm --version] |
| TypeScript / `tsc` | `npm run precompile` | ✓ | 5.9.3 locked | None needed. [VERIFIED: package-lock + successful precompile] |
| Vitest | Full test suite | ✓ | 3.2.4 locked | None needed. [VERIFIED: package-lock + successful `npm run test`] |
| Git | diff/baseline/commit | ✓ | 2.54.0 | None needed. [VERIFIED: git --version] |
| sha256sum | protected-boundary hash assertions | ✓ | GNU coreutils 9.4 | `openssl dgst -sha256` if unavailable, but not needed here. [VERIFIED: sha256sum --version] |
| `/tmp` filesystem | Sandbox compile | ✓ | local filesystem | Use a unique `/tmp/compile-2.8-validate-*` if collision occurs. [VERIFIED: `ls /tmp` + sandbox compile] |

**Missing dependencies with no fallback:** none found. [VERIFIED: environment probes]  
**Missing dependencies with fallback:** none required. [VERIFIED: environment probes]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 locked in `src/package-lock.json`; npm registry latest observed as 4.1.8. [VERIFIED: package-lock + npm registry] |
| Config file | `src/vitest.config.ts` includes `tests/**/*.test.ts`. [VERIFIED: src/vitest.config.ts] |
| Quick run command | `cd src && npm run test -- tests/curation/taxonomy_seed_v2.test.ts` or `cd src && npx vitest run tests/curation/taxonomy_seed_v2.test.ts` for WR-01 isolation. [VERIFIED: Vitest Context7 docs + src/package.json] |
| Full suite command | `cd src && npm run test` (`vitest run`). [VERIFIED: src/package.json + successful bash run] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PUB-01 | Sandbox compile validates v2.8 before official publication. | smoke/integration | `cd src && npm run precompile && npm run compile -- --version 2.8.0 --out /tmp/compile-2.8-validate --generated-at 2026-06-04T00:00:00.000Z` | ✅ CLI exists; sandbox command passed in research. [VERIFIED] |
| PUB-02 | Published artifacts are version-aligned and contain updated taxonomy/aliases/graph/review_queue metrics. | integration/data assertion | Node metrics parser over `data/compiled/v2/*.json` after official compile | ✅ artifacts and parser pattern exist. [VERIFIED] |
| PUB-03 | Closure report metrics come from published JSON, not `/tmp`. | documentation/data assertion | Assert `.planning/releases/v2.8.0-CLOSURE.md` values equal Node parser output from `data/compiled/v2/*.json` | ❌ Wave 0 should add the exact verification snippet/task in plan, not source code. [CITED: 48-CONTEXT.md] |

### Sampling Rate
- **Per task commit:** run the task-specific pass/fail command; for publication tasks, parse JSON immediately after command completion. [CITED: 48-CONTEXT.md D-48-P03]
- **Per wave merge:** single plan only; run `bash scripts/check-safety-guards.sh` and relevant hash/diff allow-list before continuing. [CITED: 48-CONTEXT.md]
- **Phase gate:** full `cd src && npm run test` green and closure report matches published JSON before `/gsd-verify-work`. [VERIFIED: successful test run]

### Wave 0 Gaps
- [ ] Plan must include a reusable metrics parser/check command for baseline and post-publication values; no source file needs to be added. [VERIFIED: Node snippet pattern]
- [ ] Plan must include explicit handling for the safety guard versus intentional `data/compiled/v2` publication diff. [VERIFIED: scripts/check-safety-guards.sh]
- [ ] Plan must include hash manifests before and after publication for D-48-CR06 protected paths. [CITED: 48-CONTEXT.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth/session capability in phase. [VERIFIED: phase scope] |
| V3 Session Management | no | No session handling in phase. [VERIFIED: phase scope] |
| V4 Access Control | yes, repository boundary only | Git allow-list, hash assertions, and safety guard prevent unauthorized scope mutation. [CITED: 48-CONTEXT.md] |
| V5 Input Validation | yes | Existing compiler validators reject invalid compiled outputs before write. [VERIFIED: src/compiler/validate_output.ts + write_outputs.ts] |
| V6 Cryptography | yes, integrity hashes only | Use SHA-256 from `sha256sum`; do not implement custom hashing. [VERIFIED: sha256sum availability] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized protected-path mutation | Tampering | `git diff --name-only` allow-list + SHA-256 before/after + safety guard. [CITED: 48-CONTEXT.md] |
| Partial artifact publication | Tampering / Integrity | Treat three compiled JSON files as one atomic artifact set; commit together. [CITED: 48-CONTEXT.md D-48-P04] |
| Stale or misleading closure metrics | Repudiation / Integrity | Re-parse published JSON after official compile and compare closure report values. [CITED: 48-CONTEXT.md D-48-CR03] |
| Accidental Graphify staging | Tampering | `scripts/check-safety-guards.sh` blocks staged `graphify-out/*`; working-tree Graphify dirtiness remains accepted-with-policy but unstaged. [VERIFIED: scripts/check-safety-guards.sh + git status] |

## Current Metrics Snapshot for Planning

| Metric | v2.7 current published baseline | v2.8 sandbox planning evidence |
|--------|--------------------------------|--------------------------------|
| version | `2.7.0` across all three artifacts | `2.8.0` by CLI flag in sandbox outputs. [VERIFIED: bash compile] |
| family_count | 10 | 10. [VERIFIED: bash compile] |
| subfamily_count | 18 | 18. [VERIFIED: bash compile] |
| seed_descriptor_count | Current seed has 61 | 61 expected. [VERIFIED: seed metric script + Phase 47 verification] |
| compiled_descriptor_count | 324 | 340. [VERIFIED: metric script + sandbox compile] |
| alias_count | 18 | 18. [VERIFIED: metric script + sandbox compile] |
| graph_edge_count | 13 | 13. [VERIFIED: metric script + sandbox compile] |
| review_queue_total | 269 (`259 corpus_candidate_low_support`, `10 seed_corpus_conflict`) | 256 (`243 corpus_candidate_low_support`, `13 seed_corpus_conflict`). [VERIFIED: metric script + sandbox compile] |
| review_queue severity | 269 medium | 256 medium. [VERIFIED: metric script + sandbox compile] |

The v2.8 sandbox values are not closure values; final closure values must be recomputed from official `data/compiled/v2` after publication. [CITED: 48-CONTEXT.md D-48-CR03]

## Sources

### Primary (HIGH confidence)
- `48-CONTEXT.md` — locked phase decisions D-48-FLOW, D-48-VER, D-48-CR, D-48-PLAN, D-48-SB, D-48-PUB, D-48-PB, D-48-CA. [CITED]
- `src/cli/parse_args.ts` — supported flags and `DEFAULT_PATHS.version`. [VERIFIED]
- `src/cli/compile.ts` — compile flow, output resolution, validation/quality stdout. [VERIFIED]
- `src/compiler/write_outputs.ts` and `src/compiler/validate_output.ts` — deterministic writes and artifact validation. [VERIFIED]
- `src/tests/curation/taxonomy_seed_v2.test.ts` — Phase 46 fixture resolution and 12 Phase 47 promoted paths. [VERIFIED]
- Bash probes: environment versions, v2.7 metric parser, v2.8 sandbox compile, full Vitest run, safety guard. [VERIFIED]
- Context7 `/vitest-dev/vitest` — Vitest CLI filtering and include config documentation. [CITED: Context7]

### Secondary (MEDIUM confidence)
- npm registry metadata for `vitest`, `typescript`, `@types/node`. [VERIFIED: npm registry]
- slopcheck scan of `src/package.json`; `vitest` flagged SUS due name proximity to `vite`, but no install/change is planned. [VERIFIED: slopcheck]

### Tertiary (LOW confidence)
- None needed for implementation planning.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools are existing project dependencies or local CLIs and were probed. [VERIFIED]
- Architecture: HIGH — flow is locked in CONTEXT and matches existing CLI/code. [VERIFIED]
- Pitfalls: HIGH — pitfalls are derived from locked gates and code behavior; safety-guard post-publication handling is resolved as a halt/explicit-approval checkpoint under D-48-PB04. [VERIFIED]

**Research date:** 2026-06-04  
**Valid until:** 2026-07-04 for internal code/phase decisions; npm registry version observations should be refreshed if dependency work is unexpectedly introduced. [ASSUMED]
