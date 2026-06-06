---
phase: 52
slug: retroactive-verification-closure
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-06
---

# Phase 52 - Validation Strategy

> Per-phase validation contract for retroactive verification and metadata traceability closure.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest v3.2.4 runtime; existing npm scripts under `src/package.json` |
| **Config file** | `src/vitest.config.ts` |
| **Quick run command** | Source/diff assertions: `test -f .../50-VERIFICATION.md`, `test -f .../50-METADATA-TRACE.md`, and `git diff --name-only` forbidden-path check |
| **Full suite command** | `npm --prefix src test -- tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` |
| **Estimated runtime** | <10 seconds for source/diff assertions, ~30 seconds for alias proof, ~60 seconds for focused tests |

---

## Sampling Rate

- **After every task commit:** Run the relevant source assertion first (`test -f`, required-string checks, or forbidden-path `git diff --name-only` check) before any slower proof command.
- **After Task 1 or any task that cites live alias proof:** Run `npm --prefix src run alias:integrity -- --json`.
- **After every plan wave:** Run `npm --prefix src test -- tests/compiler/alias_target_integrity.test.ts tests/cli/alias_integrity.test.ts` and `npm --prefix src run typecheck`.
- **Before `/gsd-verify-work`:** Confirm VER-01/VER-02 documents exist, cite evidence, and forbidden files are absent from git diff.
- **Max feedback latency:** <10 seconds for first-loop source/diff assertions; 90 seconds is acceptable for documentation-only wave validation because slower commands validate existing evidence, not new runtime behavior.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 52-01-01 | 01 | 1 | VER-01 | T-52-01 | Existing alias integrity evidence is cited without changing validator/CLI/data artifacts. | source assertion + CLI proof | `test -f .planning/phases/52-retroactive-verification-closure/50-VERIFICATION.md` first, then `npm --prefix src run alias:integrity -- --json` | No, retroactive verification artifact missing before execution | pending |
| 52-01-02 | 01 | 1 | VER-02 | T-52-02 | Phase 50 metadata trace records HYG-02/HYG-03 completion without relying on informal audit notes. | source assertion | read created metadata record and verify `requirements-completed: [HYG-02, HYG-03]` or equivalent explicit field | No, equivalent metadata record missing before execution | pending |
| 52-01-03 | 01 | 1 | VER-01, VER-02 | T-52-03 | Forbidden runtime/data/artifact paths remain unchanged. | diff assertion | `git diff --name-only` excludes forbidden paths | Existing git diff may contain unrelated files; executor must stage only intended docs | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [ ] Create a retroactive Phase 50 verification artifact for HYG-02/HYG-03.
- [ ] Create or update an equivalent Phase 50 metadata trace artifact for HYG-02/HYG-03 completion.
- [ ] Record the known full-suite caveat: `npm --prefix src test` currently fails because archived planning artifacts are missing, while focused alias integrity tests pass.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Auditability of HYG-02/HYG-03 evidence | VER-01 | Requires reading generated planning docs and confirming citations are sufficient. | Inspect the retroactive verification artifact and confirm HYG-02/HYG-03 each have verdict, evidence, proof command, and no-mutation statement. |
| Traceability of Phase 50 completion metadata | VER-02 | Depends on the chosen equivalent record path because `50-01-SUMMARY.md` is absent. | Inspect the metadata trace record and confirm it names Phase 50, HYG-02, HYG-03, evidence links, and completion metadata. |
| Scope boundary preservation | VER-01, VER-02 | Requires comparing final git diff against forbidden paths. | Confirm no diff entries under validator/CLI behavior files, taxonomy seed, compiled artifacts, exception policy, FUT queues, Graphify, scoring, UI, MVP, or Knowledge Engine. |

---

## Validation Sign-Off

- [ ] All tasks have automated or source-assertion verification.
- [ ] Sampling continuity: no 3 consecutive tasks without automated or source-assertion verify.
- [ ] Wave 0 covers all missing documentary references.
- [ ] No watch-mode flags.
- [ ] First-loop source/diff feedback latency < 10s; slower focused validation is explicitly justified for documentation-only evidence confirmation.
- [ ] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
