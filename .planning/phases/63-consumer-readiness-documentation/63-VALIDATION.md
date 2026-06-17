---
phase: 63
slug: consumer-readiness-documentation
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-17
validated: 2026-06-17
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
| 63-01-01 | 63-01 | 1 | GDOC-04 | T-63-01 | Guide order preserves build-validate-query trust transitions without adding runtime/API scope. | content + typecheck | `TMPDIR=/tmp npm --prefix src run typecheck` plus `rg` heading/fence checks | yes | green |
| 63-01-02 | 63-01 | 1 | GQRY-07 | T-63-02 | Envelope table classifies `query_kind`, `params`, `result`, and `path` from existing types/tests only. | content + tests | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_graph.test.ts tests/graph_read_model/query_consumer.test.ts` | yes | green |
| 63-01-03 | 63-01 | 1 | GDOC-05 | T-63-03 | Consumer readiness remains static, read-only, and excludes runtime/API/database/Graphify/publication. | content + tests | `TMPDIR=/tmp npm --prefix src test -- tests/graph_read_model/query_live_baseline.test.ts tests/graph_read_model/write_graph.test.ts tests/cli/sanctioned_graph_workflow.test.ts` | yes | green |

---

## Required Content Checks

Run these after the guide is edited:

```bash
node -e "const fs=require('node:fs'); const text=fs.readFileSync('docs/olfactory_graph_read_model.md','utf8'); const headings=['## 1. Escopo, audiencia e fences','## 2. Mapa do fluxo completo','## 3. Workflow operacional graph:build','## 4. Validacao sancionada','## 5. ValidatedGraph','## 6. Consumer fail-closed','## 7. Envelope seguro para agent/RAG','## 8. Erros e missing targets','## 9. Exemplos canonicos e antipatrones','## 10. Referencias normativas e provas automatizadas']; let last=-1; for (const h of headings){ const count=text.split(h).length-1; if (count !== 1) throw new Error('heading count '+count+' for '+h); const i=text.indexOf(h); if (!(i > last)) throw new Error('heading order broken at '+h); last=i; }"
node -e "const fs=require('node:fs'); const text=fs.readFileSync('docs/olfactory_graph_read_model.md','utf8'); const start=text.indexOf('## 9. Exemplos canonicos e antipatrones'); const end=text.indexOf('## 10. Referencias normativas e provas automatizadas'); if (start===-1 || end===-1 || end <= start) throw new Error('section 9 bounds missing'); const section=text.slice(start,end); const ordered=['graph:build --dry-run','graph:build non-dry-run','graph.json','asValidatedGraph(graph)','erro detalhado de validacao','createValidatedQueryConsumer(validatedGraph)','query_kind','graph_not_validated','missing target']; let last=-1; for (const token of ordered){ const i=section.indexOf(token); if (i===-1) throw new Error('missing ordered token in section 9 '+token); if (!(i > last)) throw new Error('ordered token out of order in section 9 '+token); last=i; }"
rg -n "graph:build|asValidatedGraph|createValidatedQueryConsumer|graph_not_validated|query_kind|params|result|path|Canonico|Ilustrativo|Proibido" docs/olfactory_graph_read_model.md
rg -n "runtime|API|Neo4J|Graphify|database|banco|publicacao|persistencia" docs/olfactory_graph_read_model.md
rg -n "createValidatedQueryConsumerFromGraph|assertValidatedGraph|OrThrow|--out" docs/olfactory_graph_read_model.md
```

The examples-order Node check must slice from `## 9. Exemplos canonicos e antipatrones` to `## 10. Referencias normativas e provas automatizadas` before comparing token order, because `graph.json`, `asValidatedGraph`, and `createValidatedQueryConsumer` intentionally appear earlier in the guide. The second `rg` command must show only explicit no-scope fences or explanatory anti-patterns. The third `rg` command must not show a normative recommendation; appearances inside anti-patterns are acceptable only when the surrounding prose marks them as forbidden.

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new production code, packages, schema pushes, runtime services, or Graphify artifacts are required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Section order exactly follows the Phase 63 context. | GDOC-04 | Markdown order is easier to review by source inspection than by adding brittle doc tests. | Compare `docs/olfactory_graph_read_model.md` headings with D-01 in `63-CONTEXT.md`; each canonical H2 must appear exactly once. |
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

## Validation Audit 2026-06-17

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

### Requirement Coverage

| Requirement | Task | Status | Evidence |
|-------------|------|--------|----------|
| GDOC-04 | 63-01-01 | COVERED | Heading-order Node check green; typecheck green |
| GQRY-07 | 63-01-02 | COVERED | Section-9 token-order check green; query_graph (19) + query_consumer (7) tests green |
| GDOC-05 | 63-01-03 | COVERED | query_live_baseline (2) + write_graph (14) + graph_read_model (22) + sanctioned_graph_workflow (7) tests green |

All automated commands from Per-Task Verification Map executed successfully. No new tests required; existing Vitest suites and content checks satisfy Nyquist coverage.
