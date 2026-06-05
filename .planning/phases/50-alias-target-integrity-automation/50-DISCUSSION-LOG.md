# Phase 50: Alias Target Integrity Automation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-06-05T19:51:16Z
**Phase:** 50-Alias Target Integrity Automation
**Areas discussed:** Gate placement, Exception policy shape, Failure reporting, Phase 51 proof path, Phase 50 non-remediation boundary

---

## Gate Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Proof command only | Implement reusable validator plus focused command; tests cover fixtures, but default `npm test` and normal compile stay green until Phase 51 wires/enforces live data. | yes |
| Default enforcement now | Wire into compile/tests immediately; current live data fails because `ylang ylang -> ylang_ylang` is unresolved. | |
| Soft warning now | Run live-data gate in compile as warning until Phase 51. | |

**User's choice:** Proof command only.
**Notes:** Phase 50 implements reusable validator plus focused live-data command. The command is expected to fail on current v2.8 data with exactly one unresolved alias target. Default `npm test` and normal compile remain green. Phase 51 may wire the command into default hard gates after remediation.

---

## Exception Policy Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Data policy JSON | Add a versioned data file under `data/taxonomy` with an empty `exceptions` array initially. | yes |
| Planning doc only | Keep exceptions documented in `.planning/` only. | |
| Source fixture/config | Put exceptions under `src/` as validator config or fixture. | |

**User's choice:** Data policy JSON.
**Notes:** Create `data/taxonomy/alias_target_exceptions.v1.json` with `version`, `schema_version`, and empty `exceptions`. Future exceptions require alias, target, rationale, status, approval/source metadata, and review/expiry policy when applicable. `ylang ylang -> ylang_ylang` must not be added as an exception in Phase 50.

---

## Failure Reporting

| Option | Description | Selected |
|--------|-------------|----------|
| Human summary only | Print concise console output with counts and each unresolved `alias -> target`. | |
| Human plus JSON | Print human-readable summary by default and support JSON output for deterministic proof. | yes |
| Report file artifact | Write a markdown or JSON report file during validation. | |

**User's choice:** Human plus JSON.
**Notes:** The command exits non-zero on unresolved targets, prints summary counts, lists each unresolved alias/target, includes source file, exception status, and remediation hint. `--json` provides deterministic machine-readable output. No report file is written by default.

---

## Phase 51 Proof Path

| Option | Description | Selected |
|--------|-------------|----------|
| npm script | Add a named `src/package.json` script such as `alias:integrity`. | yes |
| Direct node command | Document `node dist/cli/...` only. | |
| Vitest-only proof | Use a focused Vitest test as the proof. | |

**User's choice:** npm script.
**Notes:** Preferred script name is `alias:integrity`. Before Phase 51 remediation it exits non-zero with exactly `ylang ylang -> ylang_ylang`; after remediation it exits zero unless an approved exception remains. JSON output should be available through `npm run alias:integrity -- --json`.

---

## Phase 50 Non-Remediation Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Automation surfaces only | Allow validator/CLI/tests, package script, empty exception policy, and Phase 50 docs only. | yes |
| Source only | Allow validator/CLI/tests and package script, but do not create policy file yet. | |
| Docs only policy | Write policy design only. | |

**User's choice:** Automation surfaces only.
**Notes:** Phase 50 may not change descriptor aliases, taxonomy seed, compiled artifacts, low_support, seed_corpus_conflict, scoring, Graphify, MVP/SaaS, Knowledge Engine, UI, or remediate `ylang ylang -> ylang_ylang`.

---

## the agent's Discretion

- Exact TypeScript names and helper boundaries for the reusable validator.
- Exact CLI file path within the existing `src/cli/` convention.
- Exact script name may vary only if an existing project convention strongly suggests another name; preferred name is `alias:integrity`.

## Deferred Ideas

- Wire the alias target proof command into default `npm test` or normal compile as a hard gate after Phase 51 remediation.
- Resolve `ylang ylang -> ylang_ylang` in Phase 51.
