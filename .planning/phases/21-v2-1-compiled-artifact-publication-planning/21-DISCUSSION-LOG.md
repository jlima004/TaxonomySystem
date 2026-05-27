# Phase 21: v2.1 Compiled Artifact Publication Planning - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26
**Phase:** 21-v2-1-compiled-artifact-publication-planning
**Areas discussed:** Initial publication route, versioning and gates

---

## Initial Publication Route

| Option | Description | Selected |
|--------|-------------|----------|
| Plan v2.1 publication | Plan official compile of `data/compiled/v2` with versioning and gates. | |
| Tmp compile validation only | Run only a future compile to `/tmp` to validate outputs, without publishing official artifacts. | ✓ |
| Defer publication | Keep the seed changed and compiled v2 stale for now. | |

**User's choice:** Recommended route accepted: option 2 first, then option 1 only if the `/tmp` compile passes.
**Notes:** Context gathering must not execute an official refresh. Official publication requires a separate gated plan.

---

## Versioning And Gates

| Option | Description | Selected |
|--------|-------------|----------|
| Artifact v2.1.0 in `data/compiled/v2` | Keep the v2 major artifact directory and set compiled artifact version to `2.1.0` when publishing. | ✓ |
| New compiled directory | Create a new directory such as `data/compiled/v2.1`. | |
| No version bump | Refresh artifacts but keep version `2.0.0`. | |

**User's choice:** Inferred from Phase 21 objective: plan v2.1 publication with explicit versioning.
**Notes:** The future publication plan must document whether the CLI default version also moves to `2.1.0`; no such change occurs during tmp validation.

## the agent's Discretion

- Exact report structure for tmp compile validation and official publication approval.
- Exact fixed `generated_at` value, as long as it is recorded before official publication and not implicit.

## Deferred Ideas

- Additional curation beyond `petitgrain`.
- Graphify lifecycle updates.
- CI/hook publication automation.
