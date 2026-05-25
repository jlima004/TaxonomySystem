# Phase 13 Graphify Generated Artifact Policy

This document consolidates the operational policy for `graphify-out/*` following the v2 promotion in Phase 12, established during Phase 13 stabilization (see also `13-03-GENERATED-ARTIFACT-POLICY.md`).

## Policy Directives

1. **Artifact Nature:** `graphify-out/*` is a generated artifact directory. It is not authoritative taxonomy source data.
2. **Dirty State:** `graphify-out/*` can and will often remain dirty in the working tree. This is expected behavior due to automated hooks.
3. **Hook Triggers:** The Git hooks `post-commit` and `post-checkout` are active and may trigger background rebuilds of Graphify artifacts when conditions match (e.g., when files change or branches are switched).
4. **Commit Hygiene:** `graphify-out/*` must **NOT** be included in taxonomy/GSD commits without an explicit, dedicated plan authorizing its inclusion. Do not stage these files during normal curation or stabilization work.
5. **Evidence Status:** `graphify-out/*` is **not** authoritative evidence of taxonomy correctness. Correctness is verified via the compiler artifacts and the test suite.
6. **Regeneration and Commit:** Any future regeneration or commit involving `graphify-out/*` requires its own explicit plan, which MUST declare:
   - Os arquivos esperados sob `graphify-out/*`.
   - O comando de geração exato.
   - O critério de diff aceitável.
   - A decisão clara se o artefato será versionado ou se deve permanecer apenas local (local-only).
   - Uma política de commit separado para isolar as mudanças de Graphify das mudanças de taxonomia.

## Enforcement

Do not clean, do not revert, and do not commit `graphify-out/*` during standard GSD hygiene or taxonomy curations.
