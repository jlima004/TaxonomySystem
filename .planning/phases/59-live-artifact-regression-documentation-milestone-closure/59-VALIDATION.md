---
phase: 59
slug: live-artifact-regression-documentation-milestone-closure
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-11
validated: 2026-06-12
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
| 59-01-01 | 01 | 1 | GDOC-01/GDOC-03 | T-59-01 | Guide foundation, disclaimer, contract link, workflow, and D-08 regression evidence | docs assertion | `python3 -c "from pathlib import Path; s=Path('docs/olfactory_graph_read_model.md').read_text(); low=s[:1600].lower(); files=['src/tests/graph_read_model/live_artifact_baseline.test.ts','src/tests/graph_read_model/query_live_baseline.test.ts','src/tests/graph_read_model/write_graph.test.ts','src/tests/graph_read_model/boundary_audit.test.ts','src/tests/cli/graph_read_model.test.ts']; proof_terms=['build + validate','baseline stats','aggregate query','writer path','atomic output','SHA-256','CLI integration','graph:build']; assert 'read model' in low and 'data/compiled/v2' in low and ('não' in low or 'nao' in low); assert 'olfactory_graph_contract.md' in s; assert all(f in s for f in files); assert all(t.lower() in s.lower() for t in proof_terms); assert all(x in s for x in ['GRAPH_EXPECTED_BASELINE_STATS','10','18','341','13','graph:build','ok','graph_output','boundary_audit','guardrails']); assert 'graph_stats' not in s"` | ✅ | ✅ green |
| 59-01-02 | 01 | 1 | GDOC-01 | T-59-03 | Eight `query_kind` JSON examples copied from tests only | docs assertion | `python3 -c "from pathlib import Path; s=Path('docs/olfactory_graph_read_model.md').read_text(); kinds=['descriptors_by_family','descriptors_by_subfamily','alias_resolution_path','descriptor_to_family_path','related_descriptors','similarity_neighborhood','cross_family_bridges','similarity_hub']; assert all(k in s for k in kinds); assert s.count(chr(96)*3+'json') >= 8; assert 'src/tests/graph_read_model/query_graph.test.ts' in s; assert 'query_live_baseline.test.ts' in s; assert 'query_proofs.json' not in s"` | ✅ | ✅ green |
| 59-01-03 | 01 | 1 | GDOC-02/GDOC-03 | T-59-02/T-59-04 | Neo4J mapping stays conceptual; protected paths unchanged | docs + git status | `python3 -c "from pathlib import Path; s=Path('docs/olfactory_graph_read_model.md').read_text(); low=s.lower(); assert 'neo4j' in low; assert all(x in s for x in ['family:', 'subfamily:', 'descriptor:', 'alias:', 'contains_subfamily', 'contains_descriptor', 'resolves_to', 'similar_to']); forbidden=['\`\`\`cypher','docker compose','npm install neo4j','neo4j-driver','import job','query_proofs.json']; assert not any(f in low for f in forbidden)"` && `test -z "$(git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out)"` | ✅ | ✅ green |
| 59-02-01 | 02 | 2 | GDOC-01/GDOC-03 | T-59-04 | Closure records 22-requirement evidence without mutating protected artifacts | docs + git status | `python3 -c "from pathlib import Path; s=Path('.planning/releases/v2.11-CLOSURE.md').read_text(); ids=['GCON-01','GCON-02','GCON-03','GCON-04','GBLD-01','GBLD-02','GBLD-03','GBLD-04','GBLD-05','GVAL-01','GVAL-02','GVAL-03','GVAL-04','GVAL-05','GQRY-01','GQRY-02','GQRY-03','GQRY-04','GQRY-05','GDOC-01','GDOC-02','GDOC-03']; assert all(i in s for i in ids); assert 'docs/olfactory_graph_read_model.md' in s; assert all(x in s for x in ['ok','graph_output','boundary_audit','guardrails','graphify_out_accesses','output_written','forbidden_prefix_rejections']); assert 'graph_stats' not in s"` && `test -z "$(git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out)"` | ✅ | ✅ green |
| 59-02-02 | 02 | 2 | GDOC-01/GDOC-02/GDOC-03 | T-59-01 | Phase verification artifact links guide, closure, and UAT slot | docs assertion | `python3 -c "from pathlib import Path; p=Path('.planning/phases/59-live-artifact-regression-documentation-milestone-closure/59-VERIFICATION.md'); s=p.read_text(); assert all(x in s for x in ['GDOC-01','GDOC-02','GDOC-03','docs/olfactory_graph_read_model.md','.planning/releases/v2.11-CLOSURE.md','npm --prefix src run typecheck','npm --prefix src test','git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out']); assert 'query_proofs.json' in s; assert 'UAT' in s and any(x in s for x in ['Conversational Verification','conversational verification','UAT status','59-UAT.md','/gsd-verify-work'])"` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave-Level Verification Commands

- **Wave 1 (Plan 59-01 after guide tasks):** `npm --prefix src run typecheck` and `npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/live_artifact_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/graph_read_model/boundary_audit.test.ts tests/cli/graph_read_model.test.ts`
- **Wave 2 (Plan 59-02 after closure/verification tasks):** `npm --prefix src run typecheck`, the same targeted graph regression command above, and `test -z "$(git diff --name-only -- data/taxonomy data/compiled/v2 data/inference graphify-out)"`

---

## Wave 0 Requirements

- [x] `docs/olfactory_graph_read_model.md` - create for GDOC-01, GDOC-02, and GDOC-03.
- [x] `.planning/releases/v2.11-CLOSURE.md` - create milestone closure evidence index.
- [x] `59-VERIFICATION.md` - create or finalize phase verification artifact.
- [x] No new test framework/config dependencies required; existing Vitest infrastructure covers regression evidence.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Portuguese guide reads as maintainer documentation and avoids duplicating contract tables | GDOC-01 | Language quality and duplication are editorial checks | Compare `docs/olfactory_graph_read_model.md` against `docs/olfactory_graph_contract.md`; ensure it links to the contract instead of recreating full schema/invariant tables. |
| Milestone closure proof references are accurate | GDOC-01/GDOC-03 | Closure evidence spans prior phase summaries, UAT, and verification docs | Open `.planning/releases/v2.11-CLOSURE.md` and verify each checklist proof path exists and corresponds to the cited requirement. |
| Graphify hook rebuild artifacts in working tree | GDOC-03 | Commit hooks may regenerate `graphify-out/*` after docs/planning commits; phase commits excluded these changes via stash | Before protected-path checks, restore `graphify-out/` to HEAD or stash hook output; verify phase commit boundaries stayed clean. |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency <= one task commit
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-06-11, re-validated 2026-06-12

---

## Validation Audit 2026-06-12

| Metric | Count |
|--------|-------|
| Gaps found | 3 |
| Resolved | 3 |
| Escalated | 0 |

**Resolved items:**
1. Aligned 59-01-03 Neo4J assertion with plan task 3 forbidden-pattern list (negation prose no longer false-fails).
2. Expanded per-task map to cover all five executed tasks (added 59-01-02 query proofs and 59-02-02 verification artifact).
3. Restored `graphify-out/` to committed HEAD so protected-path `git diff` checks pass at validation time.

**Wave-level evidence:** `npm --prefix src run typecheck` passed; targeted graph regression — 6 files, 67 tests passed.
