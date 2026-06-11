---
phase: 59
slug: live-artifact-regression-documentation-milestone-closure
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-11
---

# Phase 59 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.2.4 plus Markdown/source assertions |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | Fast Python/Markdown source assertions in each task's `<verify>` block |
| **Wave-level graph regression command** | `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts tests/cli/graph_read_model.test.ts` |
| **Full suite command** | `npm --prefix src test` |
| **Estimated runtime** | ~60-120 seconds for targeted graph tests; full suite varies |

---

## Sampling Rate

- **After every task commit:** Run the task-local Python/Markdown/source assertions only, plus protected-path `git diff` checks where relevant. These fast checks prove the edited documentation contains required evidence and forbidden scope is absent without waiting on Vitest latency.
- **After every plan wave:** Run `npm --prefix src run typecheck` and the targeted graph regression command. This is the appropriate point for heavier Vitest evidence because Phase 59 is documentation-only and the Vitest files are cited proof, not newly changed implementation.
- **Before `/gsd-verify-work`:** Full suite must be green if source/test files changed; docs-only execution may use targeted graph tests plus doc assertions.
- **Max feedback latency:** one task commit.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 59-01-01 | 01 | 1 | GDOC-01 | T-59-03 | Query/regression evidence is copied from tests, not regenerated from `graph.json`; D-08 table lists all five canonical regression files with proof statements | docs assertion | `python3 -c "from pathlib import Path; s=Path('docs/olfactory_graph_read_model.md').read_text(); files=['src/tests/graph_read_model/live_artifact_baseline.test.ts','src/tests/graph_read_model/query_live_baseline.test.ts','src/tests/graph_read_model/write_graph.test.ts','src/tests/graph_read_model/boundary_audit.test.ts','src/tests/cli/graph_read_model.test.ts']; assert all(f in s for f in files); assert all(x in s for x in ['build + validate','aggregate query','writer path','SHA-256','CLI integration'])"` | ❌ W0: `docs/olfactory_graph_read_model.md` | ⬜ pending |
| 59-01-02 | 01 | 1 | GDOC-02 | T-59-02 | Neo4J content remains conceptual and excludes Docker/Cypher/import jobs/drivers | docs assertion | `python3 - <<'PY'\nfrom pathlib import Path\ns=Path('docs/olfactory_graph_read_model.md').read_text()\nassert 'Neo4J' in s\nfor forbidden in ['Cypher', 'Docker', 'driver', 'import job']:\n    assert forbidden.lower() not in s.lower()\nPY` | ❌ W0: `docs/olfactory_graph_read_model.md` | ⬜ pending |
| 59-01-03 | 01 | 1 | GDOC-03 | T-59-01 | Disclaimer states the read model is derived and not official compiled taxonomy or curation truth | docs assertion | `python3 - <<'PY'\nfrom pathlib import Path\ns=Path('docs/olfactory_graph_read_model.md').read_text()[:1200].lower()\nassert 'read model' in s and 'data/compiled/v2' in s and ('não' in s or 'nao' in s)\nPY` | ❌ W0: `docs/olfactory_graph_read_model.md` | ⬜ pending |
| 59-02-01 | 02 | 2 | GDOC-01/GDOC-03 | T-59-04 | Closure records requirement evidence without mutating protected artifacts | docs + git status | `git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out` | ❌ W0: `.planning/releases/v2.11-CLOSURE.md` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave-Level Verification Commands

- **Wave 1 (Plan 59-01 after guide tasks):** `npm --prefix src run typecheck` and `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts tests/cli/graph_read_model.test.ts`
- **Wave 2 (Plan 59-02 after closure/verification tasks):** `npm --prefix src run typecheck`, the same targeted graph regression command above, and `test -z "$(git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out)"`

---

## Wave 0 Requirements

- [ ] `docs/olfactory_graph_read_model.md` - create for GDOC-01, GDOC-02, and GDOC-03.
- [ ] `.planning/releases/v2.11-CLOSURE.md` - create milestone closure evidence index.
- [ ] `59-VERIFICATION.md` - create or finalize phase verification artifact.
- [ ] No new test framework/config dependencies required; existing Vitest infrastructure covers regression evidence.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Portuguese guide reads as maintainer documentation and avoids duplicating contract tables | GDOC-01 | Language quality and duplication are editorial checks | Compare `docs/olfactory_graph_read_model.md` against `docs/olfactory_graph_contract.md`; ensure it links to the contract instead of recreating full schema/invariant tables. |
| Milestone closure proof references are accurate | GDOC-01/GDOC-03 | Closure evidence spans prior phase summaries, UAT, and verification docs | Open `.planning/releases/v2.11-CLOSURE.md` and verify each checklist proof path exists and corresponds to the cited requirement. |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency <= one task commit
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-11
