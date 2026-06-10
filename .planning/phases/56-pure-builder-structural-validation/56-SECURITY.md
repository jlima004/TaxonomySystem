---
phase: 56
slug: pure-builder-structural-validation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-09
---

# Phase 56 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| compiled artifact objects → builder | Untrusted in-memory input crosses into graph construction and ID generation | CompiledTaxonomy, CompiledAliases, SimilarityGraph |
| contract constants → builder output | Contract drift or literal duplication could corrupt kinds, IDs, and output ordering | GRAPH_* constants from contract.ts |
| graph arrays → validator | Potentially malformed node/edge arrays cross into invariant enforcement | OlfactoryGraph nodes/edges/stats |
| live compiled artifacts → test-only regression | Repository baseline inputs are trusted for provenance but still need structural proof and scope-bound loading | data/compiled/v2/*.json (test layer only) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-56-01 | Spoofing | `src/graph_read_model/build_graph.ts` | mitigate | Type-prefixed ID helpers (`family:`, `subfamily:`, `descriptor:`, `alias:`) and contract edge ID format; builder tests assert prefix patterns per node kind | closed |
| T-56-02 | Tampering | `src/graph_read_model/build_graph.ts` | mitigate | Builder accepts only in-memory taxonomy/aliases/similarity; similarity properties copied verbatim; no fs/path/CLI imports in production module | closed |
| T-56-03 | Repudiation | `src/tests/graph_read_model/build_graph.test.ts` | mitigate | Build-twice deep equality and JSON.stringify parity; lexicographic sort order locked in dedicated test | closed |
| T-56-04 | Tampering | `src/graph_read_model/validate_graph.ts` | mitigate | Duplicate ID scans run before `buildNodeIndex`; endpoint kinds checked against `GRAPH_EDGE_ENDPOINT_KINDS` | closed |
| T-56-05 | Spoofing | `src/graph_read_model/validate_graph.ts` | mitigate | `validateInvalidAliasTargets` requires `descriptor:*` targets; `validateInvalidSubfamilySimilarityEndpoints` requires `subfamily:*` endpoints with stable coded errors | closed |
| T-56-06 | Information Disclosure | `src/tests/graph_read_model/live_artifact_baseline.test.ts` | accept | Test reads only three in-repo compiled v2 artifacts; no secrets or external systems | closed |
| T-56-07 | Tampering | `src/tests/graph_read_model/live_artifact_baseline.test.ts` | mitigate | Filesystem access confined to test file; reads restricted to `GRAPH_ALLOWED_PRODUCTION_INPUTS`; production modules guarded fs-free | closed |
| T-56-SC | Tampering | npm/pip/cargo installs | mitigate | Phase executed with existing TypeScript/Vitest toolchain only; `tech-stack.added: []` in both plan summaries | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-56-01 | T-56-06 | Live baseline regression reads only sanctioned compiled v2 JSON already committed in-repo (`taxonomy.json`, `descriptor_aliases.json`, `similarity_matrix.json`). No secrets, credentials, or external systems involved. | gsd-security-auditor | 2026-06-09 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-09 | 8 | 8 | 0 | gsd-security-auditor |

### Security Audit 2026-06-09

| Metric | Count |
|--------|-------|
| Threats found | 8 |
| Closed | 8 |
| Open | 0 |

#### Threat Verification Evidence

| Threat ID | Evidence |
|-----------|----------|
| T-56-01 | `build_graph.ts:13-22` ID prefix helpers; `build_graph.test.ts:96-125,172-177` contract ID assertions |
| T-56-02 | `build_graph.ts:150-183,185-207` in-memory-only build; no fs imports in `src/graph_read_model/` |
| T-56-03 | `build_graph.test.ts:136-154` determinism and ordering tests |
| T-56-04 | `validate_graph.ts:47-88` duplicate scans before index; `validate_graph.ts:136-184` contract endpoint kinds |
| T-56-05 | `validate_graph.ts:186-250` alias/similarity endpoint validation; `validate_graph.test.ts:210-246` failure path tests |
| T-56-06 | Accepted risk AR-56-01; `live_artifact_baseline.test.ts:33-38` aligns with `GRAPH_ALLOWED_PRODUCTION_INPUTS` |
| T-56-07 | `live_artifact_baseline.test.ts:92-104` fs-free production module guard |
| T-56-SC | `56-01-SUMMARY.md` and `56-02-SUMMARY.md` both report `tech-stack.added: []` |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-09
