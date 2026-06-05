---
phase: 50
slug: alias-target-integrity-automation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-05
---

# Phase 50 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| CLI argv → alias integrity parser | Untrusted flags control output mode (`--json`, `--help`) | argv strings |
| Filesystem JSON → validator | Seed aliases, compiled taxonomy, exception policy may be malformed or drifted | JSON documents (read-only) |
| Exception policy data → PASS/FAIL decision | Incorrectly validated exception entries could create a false PASS | `alias_target_exceptions.v1.json` |
| Validator result → shell exit code | Output formatting or exit-code mapping could hide a failing live-data proof | structured result object |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-50-01 | Tampering | `data/taxonomy/alias_target_exceptions.v1.json` | mitigate | `validateExceptionPolicy` enforces envelope + D-50-09 fields; malformed input returns `status: FAIL`, `exception_status: malformed_policy`, exit code 1 | closed |
| T-50-02 | Tampering | `src/cli/alias_integrity.ts` path loading | mitigate | `resolveReadablePath` mirrors compile-CLI repo-root/`src` fallback for `data/...` defaults | closed |
| T-50-03 | Repudiation | human/JSON reporting | mitigate | Both modes emit counts plus unresolved `alias`, `target`, `source`, `exception_status`, `remediation_hint`; `--json` serializes full `AliasIntegrityResult` | closed |
| T-50-04 | Elevation of Privilege | legacy test-only allowlist behavior | mitigate | Exceptions only from data-file `status: "approved"` exact `alias`+`target` pairs; no production `ylang` bypass in `src/compiler` or `src/cli` | closed |
| T-50-SC | Tampering | npm/pip/cargo installs | accept | Zero-dependency implementation; no package-manager install surface in this phase | closed |

*Status: closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Focused Verification (User-Requested)

| Check | Result | Evidence |
|-------|--------|----------|
| Malformed exception policy fails closed | **PASS** | `validateExceptionPolicy` rejects bad envelope/entries; `validateAliasTargetIntegrity` returns `FAIL` + `exception_status: malformed_policy` before alias scan (`src/compiler/alias_target_integrity.ts:37-90`); Test 4 in `alias_target_integrity.test.ts` |
| No hard-coded ylang allowlist | **PASS** | Zero `ylang` references in `src/compiler/` and `src/cli/`; only data-driven `exceptionMap` with `status === 'approved'` |
| CLI exits non-zero only for real failures | **PASS** | `runAliasIntegrityCli` returns `0` on `--help` and `PASS`; returns `1` on `FAIL` (unresolved targets or malformed policy). Uncaught I/O/parse errors exit `1` via `main().catch` — not a false PASS |
| `--json` does not mask errors | **PASS** | `--json` emits `JSON.stringify(result)` with identical `status`, counts, and `unresolved[]` payload; live run shows `FAIL` + `ylang ylang` entry |
| Command does not write reports or alter artifacts | **PASS** | CLI uses only `readFile`/`access`; no `writeFile`, report path, or mutation hooks |
| Protected artifacts untouched | **PASS** | Phase 50 commits (`96ad8ea`, `48b1332`) touch only validator, CLI, tests, `alias_target_exceptions.v1.json`, `package.json`. `descriptor_aliases.seed.json`, `taxonomy-seed.v2.json`, `data/compiled/v2/*` last changed in phases ≤48 |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-50-01 | T-50-SC | No package-manager install surface in Phase 50 scope; zero-dependency TypeScript implementation | plan-time disposition | 2026-06-05 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-05 | 5 | 5 | 0 | gsd-secure-phase (orchestrator) |

### Security Audit 2026-06-05

| Metric | Count |
|--------|-------|
| Threats found | 5 |
| Closed | 5 |
| Open | 0 |

**Runtime proofs executed:**
- `npm --prefix src test -- --run tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` — 6/6 passed
- `npm --prefix src run alias:integrity -- --json` — exit 1, `unresolved_target_count: 1`, `ylang ylang -> ylang_ylang`

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-05
