---
phase: 58-cli-writer-boundary-audit
plan: "02"
subsystem: cli
tags: [typescript, vitest, cli, graph-read-model, guardrails, npm-script]

requires:
  - phase: 58-cli-writer-boundary-audit
    provides: GraphWriter and BoundaryAudit modules from plan 01
provides:
  - graph:build CLI entrypoint in graph_read_model.ts
  - NPM script graph:build inside package.json
  - CLI integration tests covering --help, --json, --dry-run and path policies
  - GVAL-05 guardrails orchestration (sequential run of typecheck, test, integrity checks)
affects:
  - src/package.json
  - src/cli/graph_read_model.ts
  - src/tests/cli/graph_read_model.test.ts

tech-stack:
  added: []
  patterns:
    - "Sequential guardrail execution via execFileSync"
    - "CLI flag orchestration (--help, --json, --dry-run, --skip-guardrails)"
    - "Unified JSON output on stdout for machine readability"

key-files:
  created:
    - src/cli/graph_read_model.ts
    - src/tests/cli/graph_read_model.test.ts
  modified:
    - src/package.json

key-decisions:
  - "CLI does not expose --out flag to enforce output policy and prevent arbitrary writes"
  - "--dry-run mode bypasses boundary audit and guardrails, writing only to a /tmp location"
  - "Unified JSON output groups graph stats, boundary digests, and guardrail results"

requirements-completed: [GVAL-05]

duration: 15min
completed: 2026-06-10
---

# Phase 58 Plan 02: CLI Entrypoint, npm Script & GVAL-05 Guardrails Summary

**Command-line orchestrator exposing graph build, validation, serialization, boundary audit, and GVAL-05 guardrail processes in a single one-shot npm run command.**

## Accomplishments

- Implemented `graph_read_model.ts` parsing `--json`, `--help`, `--dry-run`, and `--skip-guardrails`.
- Wired the sequential runner for all four safety guardrails (`typecheck`, `test`, `alias:integrity`, `verify:integrity`).
- Added `"graph:build"` script to `package.json` that triggers precompile followed by Node execution.
- Added comprehensive integration tests verifying parameter combinations, dry-run output validity, and `--help` output status code.
