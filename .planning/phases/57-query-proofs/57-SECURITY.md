---
phase: 57
slug: query-proofs
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-10
---

# Phase 57 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| test→compiled artifacts | Inline tests use hardcoded fixtures; live tests read only `data/compiled/v2/*` per `GRAPH_ALLOWED_PRODUCTION_INPUTS` | Compiled taxonomy, aliases, similarity JSON (read-only, test layer) |
| query module→OlfactoryGraph | Query functions consume in-memory graph; read-only traversal; no mutation | `OlfactoryGraph` nodes/edges (in-memory, validated upstream) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-57-01 | Information Disclosure | `query_graph.ts` | mitigate | No `node:fs` imports; fs-free guard in `live_artifact_baseline.test.ts` asserts no `readFile` in production source (`build_graph`, `validate_graph`, `query_graph`) | closed |
| T-57-02 | Tampering | query functions / `OlfactoryGraph` | mitigate | Pure readonly functions; no graph mutation; `OlfactoryGraph` params and fields `readonly` | closed |
| T-57-03 | Denial of Service | proof payloads / live regression loops | mitigate + accept | Mitigate: `toDescriptorProof` projects GQRY fields only (no full `GraphNode` copies). Accept: bounded baseline scale (341 descriptors, 13 edges); projected proof fields only | closed |
| T-57-04 | Spoofing | live artifact paths | mitigate | Assert `compiledPaths` match `GRAPH_ALLOWED_PRODUCTION_INPUTS` before `readFile` in live tests | closed |
| T-57-SC | Tampering | npm/pip/cargo installs | accept | Zero new packages; no install tasks in this phase | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-57-01 | T-57-03 | Live aggregate regression loops over bounded v2 baseline (10 families, 18 aliases, 341 descriptors, 13 similarity edges). Proof payloads project GQRY/similarity fields only — no full catalog snapshots. Test-only execution; no production API surface. | gsd-security-auditor | 2026-06-10 |
| AR-57-02 | T-57-SC | Phase adds zero npm/pip/cargo packages (`tech-stack.added: []` in both plan summaries). Supply-chain tampering via new dependencies is out of scope for this phase. | gsd-security-auditor | 2026-06-10 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-10 | 5 | 5 | 0 | gsd-security-auditor |

---

## Threat Verification Evidence

| Threat ID | Evidence |
|-----------|----------|
| T-57-01 | `query_graph.ts`: zero `node:fs`/`readFile` imports (grep clean). `live_artifact_baseline.test.ts:26,93-106`: `queryGraph` in `productionModulePaths`; fs-free loop asserts no `readFile`/`node:fs` in `build_graph`, `validate_graph`, `query_graph` source |
| T-57-02 | `types.ts:32-37`: `OlfactoryGraph` with `readonly nodes`/`readonly edges`. `query_graph.ts`: all exports take `graph: OlfactoryGraph`; only ephemeral local `Map`/arrays mutated (`neighbors`, `bridges`); no writes to `graph.nodes`/`graph.edges` |
| T-57-03 (mitigate) | `query_graph.ts:37-44`: `toDescriptorProof` projects `id`, `graph_id`, `status`, `review_required`, `corpus_derived`, `source` only. Similarity entries via `toSimilarityNeighborhoodEntry`/`toCrossFamilyBridgeItem` read edge properties — no full node copies |
| T-57-03 (accept) | `contract.ts:71-77`: `GRAPH_EXPECTED_BASELINE_STATS` (341 descriptors, 13 edges). `query_live_baseline.test.ts:75-114`: bounded loops over 10 families, 18 aliases, subfamilies with similarity edges only |
| T-57-04 | `query_live_baseline.test.ts:52-57` and `live_artifact_baseline.test.ts:34-39`: `sanctionedRelativePaths` asserted equal to `[...GRAPH_ALLOWED_PRODUCTION_INPUTS]` before any `readJson` |
| T-57-SC | `57-01-SUMMARY.md` and `57-02-SUMMARY.md`: `tech-stack.added: []` |

---

## Unregistered Flags

None — no `## Threat Flags` sections in either plan SUMMARY.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-10
