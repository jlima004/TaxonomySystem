# Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning - Discussion Log

> **Audit trail only.** Do not use as the sole input to planning, research or execution agents.
> Stable decisions will be captured later in `14-CONTEXT.md` if and when context gathering is completed.

**Date:** 2026-05-25
**Phase:** 14-taxonomy-v2-1-backlog-triage-curation-planning
**Status:** context_gathering
**Execution readiness:** not_ready_for_execution
**Decision IDs:** TBD
**Required baseline:** Phase 13 closed with v2 default stable, explicit v1 fallback validated and no active blockers.

---

## Phase Boundary

Phase 14 is context gathering for deciding which post-Phase 13 backlog areas should be prioritized for a future Taxonomy v2.1 evolution.

Phase 14 context gathering must not:

- Alter `data/taxonomy/taxonomy-seed.v2.json`.
- Alter `data/inference/curated_relations.v2.json`.
- Alter `data/inference/accord_map.v2.json`.
- Alter `data/taxonomy/descriptor_aliases.seed.json`.
- Alter `data/compiled/v1`.
- Alter `data/compiled/v2`.
- Alter `src/cli/parse_args.ts`.
- Alter `graphify-out/*`.
- Execute curation.
- Promote descriptors.
- Add or remove aliases.
- Add relations or accords.
- Regenerate artifacts.
- Create executable plans.

---

## Starting Context

Current upstream state:

- Phase 12 promoted v2 to default.
- Phase 13 stabilized post-promotion behavior and closed without blockers.
- v2 default is stable.
- Explicit v1 fallback was validated.
- `data/compiled/v2` is the official artifact set.
- `data/compiled/v1` remains baseline/archive.
- Phase 14 was previously registered only as backlog-only / not-started.

---

## Initial Discussion Queue

The expected first question is:

> Which areas do you want to discuss for Phase 14: Taxonomy v2.1 Backlog Triage & Curation Planning?

Recommended initial selection: **All areas**.

**User's initial choice:** All areas.

Areas available for discussion:

1. Review queue reduction
2. Soft findings disposition / cleanup
3. Alias cleanup, including `ylang ylang -> ylang_ylang`
4. Graph density / graph coverage improvements
5. Future curation candidates / descriptor promotions
6. Relations/accords quality improvements
7. Docs/help cleanup that is non-blocking
8. Graphify / generated artifact lifecycle policy
9. CI/release process automation improvements

---

## Areas Discussed

No areas have been discussed yet in Phase 14.

Selected for upcoming discussion:

- Review queue reduction.
- Soft findings disposition / cleanup.
- Alias cleanup, including `ylang ylang -> ylang_ylang`.
- Graph density / graph coverage improvements.
- Future curation candidates / descriptor promotions.
- Relations/accords quality improvements.
- Docs/help cleanup that is non-blocking.
- Graphify / generated artifact lifecycle policy.
- CI/release process automation improvements.

---

## Captured Decisions

No Phase 14 decisions are locked yet.

---

## Deferred Ideas

None yet.

## Agent Discretion

- No implementation discretion is delegated to the agent.
- The agent may maintain this discussion log and `14-PREFLIGHT.md` during context gathering.
- The agent must not create `14-CONTEXT.md`, `14-RESEARCH.md`, `14-PATTERNS.md`, `14-VALIDATION.md` or `14-01-PLAN.md` until explicitly authorized.
