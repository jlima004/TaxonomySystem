---
phase: 51
slug: legacy-alias-remediation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-05
---

# Phase 51 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Curated seed -> compiled artifacts | Seed mutation must compile into consistent v2.9.0 artifacts; hand-editing compiled JSON would desynchronize proof | curated taxonomy JSON -> published compiled JSON |
| Compiled taxonomy -> `alias:integrity` gate | The gate resolves alias targets from compiled descriptor IDs, so unpublished seed-only edits do not satisfy the proof | compiled taxonomy JSON -> CLI validation result |
| Protected surfaces -> remediation scope | Alias map, exception policy, relations, accords, defaults, and corpus candidate `ylang` must remain outside the remediation blast radius | repository files outside the approved phase scope |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-51-01 | Tampering | `data/compiled/v2/*.json` | mitigate | Official artifacts were regenerated via compile flow, all three files report `version: "2.9.0"`, and compiled taxonomy contains `ylang_ylang` with `source: "seed"` | closed |
| T-51-02 | Tampering | `data/taxonomy/taxonomy-seed.v2.json` | mitigate | `git diff c202a6f^ c202a6f -- data/taxonomy/taxonomy-seed.v2.json` shows exactly one appended `"ylang_ylang"` entry after `"linden_flower"` | closed |
| T-51-03 | Tampering | `data/taxonomy/alias_target_exceptions.v1.json` | mitigate | Exception policy remains `exceptions: []`, preserving the fail-closed path and avoiding a remediation-by-exception bypass | closed |
| T-51-04 | Tampering | `data/taxonomy/descriptor_aliases.seed.json` | mitigate | Alias map remains unchanged, including `"ylang ylang": "ylang_ylang"`; resolution comes from adding the target, not remapping aliases | closed |
| T-51-05 | Elevation of Privilege / scope creep | relations, accords, `DEFAULT_PATHS`, corpus `ylang` | mitigate | Protected surfaces stayed out of scope: `src/cli/parse_args.ts` still has `version: '2.1.0'`, summary and task commits show only planned curation, compile, and test surfaces changed | closed |
| T-51-SC | Tampering | npm/pip/cargo installs | accept | Phase 51 used the existing toolchain only; no package-manager installs were introduced | closed |

*Status: closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Focused Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Seed mutation was minimal and approved | **PASS** | `git diff c202a6f^ c202a6f -- data/taxonomy/taxonomy-seed.v2.json` shows only the trailing `ylang_ylang` append under `floral_white` |
| Compiled artifacts were regenerated, not hand-edited | **PASS** | Runtime check reports `data/compiled/v2/{taxonomy,descriptor_aliases,similarity_matrix}.json` all at `2.9.0`; `ylang_ylang_present=true` |
| Alias integrity proof gate closes the prior dangling target | **PASS** | `npm --prefix src run alias:integrity -- --json` returns `status: PASS`, `compiled_descriptor_count: 341`, `valid_target_count: 18`, `unresolved_target_count: 0` |
| Exception and alias policy stayed unchanged | **PASS** | `data/taxonomy/alias_target_exceptions.v1.json` still contains `exceptions: []`; `descriptor_aliases.seed.json` still contains `"ylang ylang": "ylang_ylang"` |
| Protected defaults and blast radius stayed intact | **PASS** | `src/cli/parse_args.ts` still sets `version: '2.1.0'`; Phase 51 summary records no relation, accord, Graphify, or default-path drift |
| Summary introduced no additional threat flags | **PASS** | `51-01-SUMMARY.md` has `## Threat Flags` -> `None.` |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-51-01 | T-51-SC | No package-manager install surface existed in this phase; all verification used the pre-existing repository toolchain | plan-time disposition | 2026-06-05 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-05 | 6 | 6 | 0 | gsd-secure-phase (orchestrator) |

### Security Audit 2026-06-05

| Metric | Count |
|--------|-------|
| Threats found | 6 |
| Closed | 6 |
| Open | 0 |

**Runtime proofs executed:**
- `npm --prefix src run alias:integrity -- --json` — PASS, `341/18/0`
- `node -e "..."` artifact check — all `data/compiled/v2/*` files at `2.9.0`, `ylang_ylang_present=true`
- `git diff c202a6f^ c202a6f -- data/taxonomy/taxonomy-seed.v2.json` — single approved append only

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-05
