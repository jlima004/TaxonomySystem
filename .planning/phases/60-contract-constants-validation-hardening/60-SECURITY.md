---
phase: 60
slug: contract-constants-validation-hardening
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-18
---

# Phase 60 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| contract constants → validators | Validator behavior trusts exported vocabularies and profiles | Static contract arrays, mapping, validation profile |
| validation error payload → CLI/consumers | Error payloads may be serialized or inspected downstream | `GraphValidationError` with `JsonValue` fields |
| external/query parameter → graph ID helper | Future consumers may pass malformed graph IDs | Raw ID strings → typed graph ID or failure object |
| graph ID helper → builder/query/validator | Downstream modules trust maker/parse semantics | Prefixed graph IDs, stripped raw IDs |
| validator internals → error factories | Validator branches delegate observable error construction | Stable codes, invariant IDs, JSON-safe payloads |
| arbitrary graph → structural/profile validators | Graph data can contain malformed IDs, endpoints, kinds, stats | `OlfactoryGraph` → validation result |
| compiled artifacts → builder → query proofs | Builder turns compiled IDs into graph IDs trusted by validator/query | Central ID makers, proof envelopes |
| CLI graph build → output writer | CLI decides whether graph is sanctioned before write path proceeds | Sanctioned validation gate before filesystem write |
| source code → maintainers | Drift checks are the maintainer's proof that constants remain centralized | Static source scans in contract tests |
| live compiled artifacts → sanctioned validation | Protected v2 artifacts prove the current sanctioned baseline | Live v2.11 graph stats `10/18/341/18/13` |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-60-01 | Tampering | `contract.ts` validation vocabularies | mitigate | Lock exact arrays/mapping/profile in `contract.test.ts`; keep contract import-free and static | closed |
| T-60-02 | Information Disclosure | `GraphValidationError.expected/actual` | mitigate | Type as `JsonValue`; prohibit runtime objects, stack traces and variable metadata | closed |
| T-60-SC | Tampering | npm installs | mitigate | No package install tasks; preserve zero-dependency scope | closed |
| T-60-03 | Tampering | `parseGraphId` | mitigate | Return typed failure objects for unknown prefix, empty raw ID and ambiguous format | closed |
| T-60-04 | Spoofing | graph ID type guards | mitigate | Reject empty raw IDs and mismatched prefixes through shared parser semantics | closed |
| T-60-05 | Repudiation | validation error codes | mitigate | Emit stable contract codes and invariant IDs through named factories | closed |
| T-60-06 | Information Disclosure | `expected`/`actual` payloads | mitigate | Constrain payloads to `JsonValue`; test for forbidden runtime values | closed |
| T-60-07 | Tampering | `validateOlfactoryGraphStructure` | mitigate | Validate schema, duplicate IDs, endpoints, kinds, alias targets, similarity endpoints and internal stats via factories | closed |
| T-60-08 | Tampering | `validateOlfactoryGraphAgainstProfile` | mitigate | Short-circuit on structural failure and compare profile stats only after reliable structure | closed |
| T-60-09 | Repudiation | `validateSanctionedV211Graph` | mitigate | Bind sanctioned validation to named profile ID and baseline constants | closed |
| T-60-09A | Tampering | validator graph ID checks | mitigate | Use `parseGraphId`/type guards from `graph_id.ts` for node IDs and edge endpoint IDs | closed |
| T-60-10 | Tampering | `build_graph.ts` ID generation | mitigate | Replace local templates with central makers and retain exact output tests | closed |
| T-60-11 | Tampering | `query_graph.ts` prefix stripping | mitigate | Use `stripGraphIdPrefix`; preserve proof envelope | closed |
| T-60-12 | Tampering | CLI validation boundary | mitigate | Use `validateSanctionedV211Graph` before write path | closed |
| T-60-13 | Tampering | source drift tests | mitigate | Add static tests for local ID templates, regex prefix stripping and ad-hoc validation code drift | closed |
| T-60-14 | Tampering | live baseline validation | mitigate | Validate live v2.11 graph through `validateSanctionedV211Graph` and exact baseline assertions | closed |
| T-60-15 | Denial of Service | test suite/runtime | accept | Targeted commands remain under normal graph-read-model test scope; full suite is the phase gate | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-60-01 | T-60-15 | Full Vitest suite runtime is the intentional phase gate; graph-read-model tests remain scoped to normal module boundaries. No unbounded external I/O or install surface was introduced. Re-evaluate if CI suite duration exceeds agreed SLO or new live-artifact tests expand filesystem/network scope. | gsd-security-auditor | 2026-06-18 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-18 | 17 | 17 | 0 | gsd-security-auditor |

### Security Audit 2026-06-18

| Metric | Count |
|--------|-------|
| Threats found | 17 |
| Closed | 17 |
| Open | 0 |

**Verification notes:** All mitigations verified in `src/graph_read_model/`, `src/cli/`, and related tests. CLI validation boundary implemented in `sanctioned_graph_workflow.ts` (invoked by `graph_read_model.ts`). No `## Threat Flags` in phase SUMMARY files. No unregistered attack surface detected.

**Key evidence:**
- `contract.ts` import-free; `contract.test.ts:129-206` exact `toEqual` locks
- `types.ts:49-61` `JsonValue` on `expected`/`actual`; `validate_graph.test.ts:412-514` JSON-safe assertions
- `graph_id.ts:105-151` typed failure objects; guards reject empty/mismatched IDs
- `validate_graph.ts` structural/profile/sanctioned validation via factories and profile short-circuit
- `build_graph.ts` central makers; `query_graph.ts` `stripGraphIdPrefix`; drift tests `contract.test.ts:275-313`
- `sanctioned_graph_workflow.ts:232-259` validates before `writeGraphOutput`
- `live_artifact_baseline.test.ts:48-63` live baseline `10/18/341/18/13`

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-18
