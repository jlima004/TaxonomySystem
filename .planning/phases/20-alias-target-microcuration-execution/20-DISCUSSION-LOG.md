# Phase 20 — Discussion Log: Alias Target Microcuration Execution

## 2026-05-26: Phase 20 Initialization

### User Request

The user requested the start of Phase 20 with the name `Alias Target Microcuration Execution` and objective of executing a controlled microcuration based on Phase 19 planning. The requested priority is the alias absent target `petit grain -> petitgrain`, while preserving `ylang ylang -> ylang_ylang` as an interim `accepted_exception` unless a new explicit approval is given.

### Initial Status

| Field | Value |
|---|---|
| Phase | 20 |
| Name | Alias Target Microcuration Execution |
| Status | `context_gathering` |
| Execution readiness | `not_ready_for_execution` |
| Mutation authorization | Not granted |

### Execution Options Presented

| Option | Description | Initial Position |
|---|---|---|
| 1 | Petitgrain add_target only | Recommended initial scope |
| 2 | Petitgrain add_target + ylang accepted_exception documentation | Acceptable if documentation expansion is explicitly approved |
| 3 | Petitgrain + ylang add_target | Not recommended without stronger `ylang_ylang` approval |
| 4 | Planning only | Safe fallback if execution is not approved |

### Recorded Recommendation

The context-gathering record treats Option 1 as the recommended execution posture for Phase 20:

```yaml
recommended_option: 1
recommended_action: add petitgrain as curated seed v2 descriptor
recommended_family: citrus
recommended_subfamily: citrus_fresh
ylang_ylang_action: accepted_exception_interim
authorization_status: pending_explicit_approval
```

### Restrictions Reaffirmed

The following restrictions remain active during `context_gathering`:

1. No mutation outside the requested Phase 20 context artifacts.
2. No changes to `data/compiled/v1`.
3. No publication or refresh of `data/compiled/v2` without explicit plan.
4. No changes to `data/inference`.
5. No changes to `src/cli/parse_args.ts`.
6. No changes to `scripts/check-safety-guards.sh`.
7. No changes to `src/package.json`.
8. No changes to `graphify-out/*`.
9. No compile, smoke, typecheck, tests or build during `context_gathering`.
10. No creation yet of `20-RESEARCH.md`, `20-PATTERNS.md`, `20-VALIDATION.md`, or `20-01-PLAN.md`.

### Artifacts Authorized Now

Only these artifacts were authorized for creation in this initialization step:

1. `20-PREFLIGHT.md`
2. `20-CONTEXT.md`
3. `20-DISCUSSION-LOG.md`

### Next Required Decision

Before Phase 20 can move toward execution, the user must explicitly approve one of the execution options and allow creation of the next planning artifacts. Until then, Phase 20 remains `not_ready_for_execution`.

## 2026-05-26: Planning Scope Approved

### Decision

The user approved advancing Phase 20 to planning with Option 1 only: `Petitgrain add_target only`.

### Approved Planning Scope

1. Plan the future addition of `petitgrain` as a curated descriptor in seed v2.
2. Target family: `citrus`.
3. Target subfamily: `citrus_fresh`.
4. Preserve `ylang ylang -> ylang_ylang` as `accepted_exception_interim`.
5. Define explicit future allowlist, persisted approval, rollback, alias target integrity validation, seed descriptor integrity validation, safety guard execution, targeted alias/normalization tests, and `/tmp` compile-only validation if needed.
6. Keep official `data/compiled/v2` publication blocked unless a separate plan is explicitly approved.

### Still Not Authorized

No execution or mutation is authorized by this planning approval. In particular, do not alter `taxonomy-seed.v2.json`, `descriptor_aliases.seed.json`, compiled artifacts, inference files, CLI parsing, safety guard script, package scripts, or Graphify output during planning.
