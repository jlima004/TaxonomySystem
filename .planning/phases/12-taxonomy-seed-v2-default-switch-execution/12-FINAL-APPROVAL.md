approval_status: approved_for_default_switch
approved_by: human_curator
approved_at: 2026-05-25T01:34:01Z
scope: taxonomy_seed_v2_default_switch
accepts_soft_findings: true
legacy_alias_exception_policy_accepted: true
rollback_required: true
rollback_plan_required_before_switch: true
data_compiled_v2_publication: approved
default_paths_switch: approved
v1_baseline_preservation_required: true
human_approval_final: true
chat_approval_insufficient: true

# Phase 12 Final Approval

This persisted approval authorizes Gate 0 for the controlled taxonomy seed v2 default switch execution.

Approval scope:

- Publish official `data/compiled/v2` artifacts only after the required staged gates pass.
- Switch `DEFAULT_PATHS` to v2 only after validated official v2 publication.
- Preserve `data/compiled/v1` and protected v1 inputs as baseline/archive.
- Accept Phase 11 soft findings and the documented legacy alias exception policy for the switch.
- Require a documented and testable rollback path before phase closure.

This file is the required persisted human approval artifact. Chat approval alone remains insufficient for any mutable Phase 12 step.
