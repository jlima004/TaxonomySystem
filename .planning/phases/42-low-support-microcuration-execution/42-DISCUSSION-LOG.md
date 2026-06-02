# Phase 42: Low-Support Microcuration Execution - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-02
**Phase:** 42-Low-Support Microcuration Execution
**Areas discussed:** Approved mutation set, hard exclusions, execution guardrails

---

## Approved Mutation Set

| Option | Description | Selected |
|--------|-------------|----------|
| Execute only six `mutation_allowed=true` rows | Apply only `peppermint`, `rosemary`, `cumin`, `spearmint`, `caraway`, and `opoponax` from `41-DECISION-MATRIX.md`. | yes |
| Reconsider additional rejected/deferred rows | Treat rationale or expected effect text as possible authorization. | |
| Create missing structural targets | Add new families/subfamilies for candidates whose natural placement is absent. | |

**User's choice:** Execute only the six approved `mutation_allowed=true` rows.
**Notes:** The user's instruction was mandatory and matched Phase 41's execution contract. No further gray area remained.

---

## Hard Exclusions

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve non-mutating rows exactly | Do not execute rejects, defers, or `needs_external_reference` rows. | yes |
| Apply reject/defer bookkeeping mutations | Create data changes for rejected/deferred rows. | |
| Use free-text rationale as permission | Treat `rationale` or `expected_effect` as mutation authority. | |

**User's choice:** Preserve non-mutating rows exactly; free text is not permission.
**Notes:** This is locked by the user instruction and Phase 41 decisions D-26 through D-30.

---

## Execution Guardrails

| Option | Description | Selected |
|--------|-------------|----------|
| Existing-target-only seed additions | Verify all target families/subfamilies already exist and add only approved descriptors. | yes |
| New structural nodes | Create families/subfamilies where semantically attractive. | |
| Artifact publication in this phase | Publish official v2.7 compiled artifacts and closure report. | |

**User's choice:** Existing-target-only seed additions.
**Notes:** Phase 43 owns official artifact publication and closure metrics.

---

## the agent's Discretion

No implementation discretion was delegated. Downstream agents may choose the safest technical plan, but not the mutation scope.

## Deferred Ideas

- The 24 non-mutating Phase 41 rows remain deferred/rejected/external-reference as recorded in `41-DECISION-MATRIX.md`.
- Any new family or subfamily suggested by `expected_effect` text remains future curation work, not Phase 42 scope.
