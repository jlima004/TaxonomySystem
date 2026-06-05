# Phase 51: Legacy Alias Remediation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 51-Legacy Alias Remediation
**Areas discussed:** Remediation path, Taxonomy placement, Safe-fit criteria, Publication and proof, No-safe-fit fallback, Relations/accords

---

## Remediation Path

| Option | Description | Selected |
|--------|-------------|----------|
| Add curated target `ylang_ylang` | Preserve alias map; make missing target exist in seed/compiled taxonomy | ✓ |
| Remap alias to `ylang` | Point alias at existing corpus candidate | |
| Approve permanent exception | Document unresolved target in exception policy | |
| Drop alias | Remove dangling alias with rationale | |

**User's choice:** Add curated target `ylang_ylang` as primary path.
**Notes:** User explicitly prefers `add_target` when safe fit exists. Avoid remap to `ylang`, exception approval, and alias removal unless curation concludes no safe target exists.

---

## Taxonomy Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Strong lock to `floral/floral_white` | Append `ylang_ylang` to existing white-floral descriptors after safe-fit confirmation | ✓ |
| Executor/planner picks placement | Research-driven family/subfamily choice | |
| Create new subfamily | New taxonomy branch for ylang | |

**User's choice:** Strong preferred lock to `floral/floral_white`.
**Notes:** Placement allowed only with confirmed semantic fit near peers like `jasmine`, `tuberose`, and `orange_blossom`. No stretch placement, no new family/subfamily, no placement via corpus `ylang`.

---

## Safe-Fit Criteria

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit checklist before mutation | Verify legitimacy, existing placement fit, no new taxonomy branch, no corpus promotion, no exception | ✓ |
| Mechanical alias repair only | Resolve dangling target without curation review | |

**User's choice:** Explicit checklist before mutation.
**Notes:** Executor must verify descriptor legitimacy, safe fit in existing subfamily, no new family/subfamily, no inference from corpus `ylang`, and no exception entry before seed mutation.

---

## No-Safe-Fit Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Halt before mutation + manual checkpoint | Stop phase; HYG-01 remains open until operator chooses fallback | ✓ |
| Drop alias automatically | Remove alias when fit is unsafe | |
| Agent discretion | Planner chooses fallback | |

**User's choice:** Halt before mutation and produce manual-review checkpoint.
**Notes:** Forbidden auto-actions in no-fit case: remap to `ylang`, add exception, drop alias, create new family/subfamily, or force weak placement.

---

## Publication and Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Seed mutation + sandbox compile + official v2.9.0 publish + gate PASS | Full proof chain with explicit version bump | ✓ |
| Seed mutation + gate only | Skip official artifact publication | |
| v2.8.1 patch version | Smaller version bump | |

**User's choice:** Sandbox compile and official publish `v2.9.0` to `data/compiled/v2`.
**Notes:** Required proof chain: failing gate before mutation, add target, sandbox compile `--version 2.9.0`, official publish `--version 2.9.0`, passing gate after publication, full tests green. Do not change `DEFAULT_PATHS` version policy.

---

## Relations and Accords

| Option | Description | Selected |
|--------|-------------|----------|
| No bootstrap in Phase 51 | Leave relation/accord gaps neutral/undefined | ✓ |
| Minimal bootstrap with approved records | Add only explicitly approved relation/accord entries | |
| Agent discretion | Planner decides | |

**User's choice:** No bootstrap in Phase 51.

---

## the agent's Discretion

- Approval-traceability artifact format
- Exact sandbox compile path and publication command sequencing within the locked proof chain
- Minor supplemental tests beyond alias-integrity proof

## Deferred Ideas

- Permanent wiring of `alias:integrity` into default test/compile flows after v2.9 closure
- Relations/accords bootstrap for `ylang_ylang`
- Corpus candidate `ylang` promotion or reconciliation with curated `ylang_ylang`
- Batch 3 low-support curation
