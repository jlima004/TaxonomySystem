---
phase: 04
slug: corpus-analysis
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-18
---

# Phase 04 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Analyzer input | Phase 4 consumes in-memory corpus and seed objects already loaded/validated by earlier phases. | Untrusted source data after Phase 2 loader validation and Phase 3 descriptor normalization. |
| Optional artifact output | Export helpers write JSON artifacts to caller-provided filesystem paths. | Derived non-secret analysis data crossing from memory to local filesystem. |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-04-01 | DoS | `computeFrequencyAndCoOccurrence` on very large per-material descriptor sets | accept (low) | Accepted risk AR-04-01. Evidence: sparse pair generation is limited to normalized per-material descriptor sets; stress benchmark covers 5k synthetic materials. | closed |
| T-04-02 | Tampering | `exportFrequencyJson` / `exportCoOccurrenceJson` with caller-controlled paths | accept (low) | Accepted risk AR-04-02. Evidence: exporters only create `dirname(path)` and write deterministic JSON; caller-side path validation is deferred to the Phase 6 CLI boundary. | closed |
| T-04-03 | DoS | `findAliasCandidates` on very large frequency pools | accept (low) | Accepted risk AR-04-03. Evidence: alias candidate pool is gated by `minFrequency` and length-bucket prefilter before pairwise similarity checks. | closed |
| T-04-04 | Tampering | `exportAliasCandidatesJson` with caller-controlled paths | accept (low) | Accepted risk AR-04-04. Evidence: alias exporter delegates to the same deterministic writer; default artifact writer uses fixed filenames under the configured base directory. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-04-01 | T-04-01 | Frequency/co-occurrence remains pure in-memory analysis with no external request boundary. Worst-case per-material pair generation is known `O(k²)`, but Phase 4 corpus shape keeps `k` small and `src/tests/analysis/stress.test.ts` detects severe regressions. No defensive cap is required until real-corpus profiling shows abuse. | GSD security audit | 2026-05-18 |
| AR-04-02 | T-04-02 | Export paths are trusted internal caller input in Phase 4. The future CLI boundary owns path validation; current helpers do not process secrets or remote input and write only deterministic derived analysis JSON. | GSD security audit | 2026-05-18 |
| AR-04-03 | T-04-03 | Alias candidate generation is opt-in, in-memory, and precision-gated. `minFrequency` and length bucketing reduce routine comparisons; worst-case large pools are documented as low risk and should be revisited only if real-corpus profiling shows unacceptable runtime. | GSD security audit | 2026-05-18 |
| AR-04-04 | T-04-04 | Alias candidate export shares the accepted caller-trusted path posture from AR-04-02. `writeAnalysisArtifacts` uses fixed artifact names, and direct custom paths remain an internal API responsibility until Phase 6 introduces a user-facing CLI. | GSD security audit | 2026-05-18 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-18 | 4 | 4 | 0 | OpenCode `/gsd-secure-phase 4` |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-18
