# Phase 44: Remaining Low-Support Inventory - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-02
**Phase:** 44-remaining-low-support-inventory
**Areas discussed:** Inventory format, Eligibility grouping, Exclusion proof, Evidence ordering

---

## Inventory Format

| Option | Description | Selected |
|--------|-------------|----------|
| Inventory format | How detailed should `44-LOW-SUPPORT-INVENTORY.md` be: compact candidate list, evidence-heavy table, or grouped sections? | yes |

**User's choice:** Evidence-heavy Markdown artifact.
**Notes:** Include summary metrics, source of truth, exclusion policy, full 259 low_support list, evidence fields, and zero-mutation confirmation.

---

## Eligibility Grouping

| Option | Description | Selected |
|--------|-------------|----------|
| Eligibility grouping | Should the inventory include non-selecting grouping for Phase 45 readiness, or stay as a flat source-of-truth list only? | yes |

**User's choice:** Include non-selecting readiness groups only.
**Notes:** Phase 44 may group candidates by evidence readiness, but must not select Batch 2 or imply promotion decisions.

---

## Exclusion Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Exclusion proof | How should the artifact prove v2.7 decided candidates were excluded without reopening Batch 1 decisions? | yes |

**User's choice:** Explicitly check the six v2.7 promoted descriptors against the current low_support queue.
**Notes:** Record that none remain unresolved. Do not reopen v2.7 decisions.

---

## Evidence Ordering

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence ordering | What deterministic ordering should downstream agents use: current artifact order, candidate frequency, subfamily, or support weakness? | yes |

**User's choice:** Sort by `candidate_frequency` descending, then `placement_score` descending if available, then candidate ascending.
**Notes:** Frequency remains prioritization evidence only, not approval evidence.

---

## the agent's Discretion

None. User locked all four discussed implementation decisions.

## Deferred Ideas

None. Discussion stayed within Phase 44 scope.
