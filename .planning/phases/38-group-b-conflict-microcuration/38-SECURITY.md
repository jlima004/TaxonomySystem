---
phase: 38
slug: group-b-conflict-microcuration
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-28
---

# Phase 38 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| `data/taxonomy/descriptor_aliases.seed.json` | Semantic mapping definitions | Alias changes affect inference system |
| `data/inference/conflict_stopwords.v1.json` | Inference suppression lists | Additions remove substring conflicts |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-38-01 | Tampering | `descriptor_aliases.seed.json` | mitigate | Explicit matrix review (`38-DECISION-MATRIX.md`) ensures only safe aliases are merged. | closed |
| T-38-02 | Denial of Service | `conflict_stopwords.v1.json` | mitigate | Strict incidental substring rule applied in matrix. Stops valid overlap suppression. | closed |
| T-38-03 | Repudiation | `38-SUMMARY.md` | mitigate | All mutations explicitly tracked in `38-SUMMARY.md` against the matrix. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-28 | 3 | 3 | 0 | gsd-security-auditor |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-28
