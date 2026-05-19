# Phase 6: Compilation & CLI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 6-Compilation & CLI
**Areas discussed:** Artifact boundary, CLI contract, Validation behavior, Versioning metadata

---

## Artifact Boundary

### taxonomy.json descriptor boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid marked | Include seed + corpus/inferred descriptors, but every descriptor keeps `source`/status so nothing is silently promoted. Aligns with the hybrid taxonomy goal and existing `CanonicalDescriptor.source`. | yes |
| Curated only | Only seed descriptors appear in `taxonomy.json`; inferred/corpus candidates stay outside the public hierarchy. | |
| You decide | Planner can choose, as long as seed authority and no auto-overwrite are preserved. | |

**User's choice:** Hybrid marked.
**Notes:** `taxonomy.json` is hybrid but must preserve source/status boundaries.

### similarity_matrix.json evidence boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Compact evidence + review | Keep edge `final_score`, dimension scores, compact evidence, and `review_queue` in the artifact. Existing `SimilarityGraph` already supports this. | yes |
| Scores only | Only source/target/final score/dimensions ship; review details stay internal. | |
| Evidence only | Include compact edge evidence, but exclude `review_queue` from the public artifact. | |

**User's choice:** Compact evidence + review.
**Notes:** `review_queue` is part of the public similarity artifact contract.

### descriptor_aliases.json boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Authoritative only | Only curated/manual aliases are emitted as the map. Weak candidates remain review signals, preventing accidental canonical merges. | yes |
| Map plus candidates | Emit curated aliases plus a separate candidates section in the same file. | |
| Auto-include high confidence | Promote very high-confidence candidates automatically into the alias map. | |

**User's choice:** Authoritative only.
**Notes:** Weak candidates must not become canonical aliases automatically.

### artifact count

| Option | Description | Selected |
|--------|-------------|----------|
| Exactly three | Only `taxonomy.json`, `descriptor_aliases.json`, and `similarity_matrix.json`; review data must fit inside those contracts or stay internal. | yes |
| Allow sidecars | The CLI may also write review/diagnostic sidecar files when useful. | |
| You decide | Planner can choose the smallest useful artifact set. | |

**User's choice:** Exactly three.
**Notes:** No default review/diagnostic sidecars in v1.

---

## CLI Contract

### path handling

| Option | Description | Selected |
|--------|-------------|----------|
| Defaults + overrides | Use conventional project paths by default, with flags to override seed/corpus/curated inputs/output directory. | yes |
| All flags required | Every input and output path must be passed explicitly on each run. | |
| Defaults only | No path flags in v1; the CLI always uses fixed project paths. | |

**User's choice:** Defaults + overrides.
**Notes:** CLI should be easy for the project default case but testable/configurable.

### primary invocation

| Option | Description | Selected |
|--------|-------------|----------|
| npm script | A package script like `npm run compile` is the official entry point; it can call the TypeScript/compiled CLI internally. | yes |
| Bin command | Expose a package `bin` command like `taxonomy-build` as the primary interface. | |
| Direct node file | Run the CLI entry file directly with `node ...`; simplest but less discoverable. | |

**User's choice:** npm script.
**Notes:** Make the package script the documented path.

### overwrite behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Overwrite generated files | Deterministically overwrite the three known artifacts; stable ordering/versioning makes diffs reviewable. | yes |
| Require --force | Fail if artifacts exist unless the user passes an explicit overwrite flag. | |
| Timestamped output dir | Write each run to a new timestamped directory instead of overwriting. | |

**User's choice:** Overwrite generated files.
**Notes:** Only the known generated artifacts should be overwritten by default.

### run output

| Option | Description | Selected |
|--------|-------------|----------|
| Concise summary | Print generated paths, counts/stats, warnings count, and validation status; detailed data stays in JSON artifacts. | yes |
| Silent on success | No output unless there is an error. | |
| Verbose report | Print detailed decisions, warnings, and artifact content summaries every run. | |

**User's choice:** Concise summary.
**Notes:** Keep CLI output actionable but not verbose.

---

## Validation Behavior

### failure writes

| Option | Description | Selected |
|--------|-------------|----------|
| All-or-nothing | Validate all three payloads first; if any fail, write nothing and exit non-zero. | yes |
| Write valid files | Write valid artifacts and skip only the invalid ones. | |
| Write with errors | Write artifacts even with validation errors, and report problems separately. | |

**User's choice:** All-or-nothing.
**Notes:** No partial artifact set on validation failure.

### null and undefined strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Strict no nulls | No `undefined`; no `null` unless a schema explicitly allows it. Optional fields are omitted, not nulled. | yes |
| Allow null optionals | Optional fields may be present as `null` for clarity. | |
| Lenient JSON | Accept any JSON shape as long as core fields exist. | |

**User's choice:** Strict no nulls.
**Notes:** Optional means omitted, not serialized as `null`.

### error reporting

| Option | Description | Selected |
|--------|-------------|----------|
| Structured paths | Each error includes artifact name, JSON path, code, and message; CLI prints a concise grouped summary. | yes |
| Human text only | Simple readable error messages without machine-readable codes/paths. | |
| First error only | Stop validation on the first failure and report just that. | |

**User's choice:** Structured paths.
**Notes:** Validation reports should support debugging and tests.

### warnings

| Option | Description | Selected |
|--------|-------------|----------|
| Warnings pass | Review items, low confidence evidence, or curation suggestions are warnings/review data; they do not fail schema validation. | yes |
| Warnings fail | Any warning prevents artifacts from being written. | |
| No warnings | Only hard errors exist; all review signals must be encoded as normal artifact fields. | |

**User's choice:** Warnings pass.
**Notes:** Review signals are non-fatal when schemas are valid.

---

## Versioning Metadata

### version meaning

| Option | Description | Selected |
|--------|-------------|----------|
| Shared taxonomy version | All three artifacts use the same taxonomy release version, e.g. `1.0.0`, so they are consumed as one coherent compiled set. | yes |
| Per-file versions | Each artifact may have its own version depending on its schema/content evolution. | |
| Schema version only | `version` represents only the JSON schema shape, not the taxonomy release. | |

**User's choice:** Shared taxonomy version.
**Notes:** The artifact set is versioned together.

### generated_at behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit/injectable | Compiler accepts a generated-at value; tests and reproducible runs can fix it, CLI can pass current UTC when desired. | yes |
| Current time always | Every CLI run writes the current timestamp automatically. | |
| No timestamp | Remove `generated_at` from public artifacts if possible. | |

**User's choice:** Explicit/injectable.
**Notes:** Supports reproducible outputs and normal CLI usage.

### deterministic ordering

| Option | Description | Selected |
|--------|-------------|----------|
| Fully deterministic | Sort families/subfamilies/descriptors/aliases/edges/review items in stable order; JSON output is pretty-printed with trailing newline. | yes |
| Top-level only | Only top-level file order and major arrays are sorted; nested details can follow source order. | |
| Source order | Preserve input/source order wherever possible. | |

**User's choice:** Fully deterministic.
**Notes:** Generated artifacts should be diff-friendly.

### default output directory

| Option | Description | Selected |
|--------|-------------|----------|
| data/compiled/v1 | A dedicated versioned output directory keeps generated v1 artifacts separate from seed, analysis, and inference inputs. | yes |
| data/taxonomy | Write next to the seed and alias files. | |
| project root dist | Write to a top-level build/dist-style output folder. | |

**User's choice:** data/compiled/v1.
**Notes:** Generated artifacts live separately from input data.

---

## Agent's Discretion

- Exact CLI flag names and internal parser shape.
- Exact compiler module/file organization.
- Exact schema validator helper names and error code taxonomy.
- Exact implementation of atomic writes or temp-file strategy.

## Deferred Ideas

None.
