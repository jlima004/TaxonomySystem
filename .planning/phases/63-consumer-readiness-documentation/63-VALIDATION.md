---
phase: 63
slug: consumer-readiness-documentation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-17
---

# Phase 63 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + TypeScript |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | `TMPDIR=/tmp npm --prefix src run typecheck` |
| **Targeted suite command** | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts tests/graph_read_model/query_live_baseline.test.ts tests/cli/graph_read_model.test.ts tests/graph_read_model/write_graph.test.ts` |
| **Boundary suite command** | `TMPDIR=/tmp npm --prefix src test -- tests/cli/sanctioned_graph_workflow.test.ts` |
| **Estimated runtime** | ~30-60 seconds for targeted checks |

---

## Sampling Rate

- **After every task commit:** run `TMPDIR=/tmp npm --prefix src run typecheck` and the task-specific content checks.
- **After every plan wave:** run the targeted suite command and boundary suite command.
- **Before `/gsd-verify-work`:** typecheck, targeted suite, boundary suite, and content checks must be green.
- **Max feedback latency:** one task commit without automated verification.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 63-01-01 | 63-01 | 1 | GDOC-04 | T-63-01 | Guide order preserves build-validate-query trust transitions without adding runtime/API scope. | content + typecheck | `TMPDIR=/tmp npm --prefix src run typecheck` plus `rg` heading/fence checks | yes | pending |
| 63-01-02 | 63-01 | 1 | GQRY-07 | T-63-02 | Envelope table classifies `query_kind`, `params`, `result`, and `path` from existing types/tests only. | content + tests | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts` | yes | pending |
| 63-01-03 | 63-01 | 1 | GDOC-05 | T-63-03 | Consumer readiness remains static, read-only, and excludes runtime/API/database/Graphify/publication. | content + tests | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/cli/sanctioned_graph_workflow.test.ts` | yes | pending |

---

## Required Content Checks

Run these after the guide is edited:

```bash
rg -n "graph:build|asValidatedGraph|createValidatedQueryConsumer|graph_not_validated|query_kind|params|result|path|Canonico|Ilustrativo|Proibido" docs/olfactory_graph_read_model.md
rg -n "runtime|API|Neo4J|Graphify|database|banco|publicacao|persistencia" docs/olfactory_graph_read_model.md
rg -n "createValidatedQueryConsumerFromGraph|assertValidatedGraph|OrThrow|--out" docs/olfactory_graph_read_model.md
```

The second command must show only explicit no-scope fences or explanatory anti-patterns. The third command must not show a normative recommendation; appearances inside anti-patterns are acceptable only when the surrounding prose marks them as forbidden.

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new production code, packages, schema pushes, runtime services, or Graphify artifacts are required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Section order exactly follows the Phase 63 context. | GDOC-04 | Markdown order is easier to review by source inspection than by adding brittle doc tests. | Compare `docs/olfactory_graph_read_model.md` headings with D-01 in `63-CONTEXT.md`. |
| Examples are labeled `Canonico`, `Ilustrativo`, or `Proibido`. | GDOC-04, GQRY-07 | Label semantics require editorial review. | Search labels and confirm every example block or anti-pattern section is tagged. |
| No contract drift from documentation prose. | GQRY-07, GDOC-05 | Requires human review against types/tests. | Review `git diff -- docs/olfactory_graph_read_model.md` and confirm no code contracts changed to fit prose. |

---

## Validation Sign-Off

- [x] All tasks have automated or source-check verification.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target is documented.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-06-17
