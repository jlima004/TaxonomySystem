# Phase 43 Discussion Log

## Artifact Versioning & Baseline
**Options:**
- Overwrite existing v2 artifacts
- Create new v2.7 directory
- Dry-run only

**Selection:** Overwrite existing v2 artifacts

**Notes:** This is a minor update (v2.7) following the v2.6 triage. The current baseline is already v2.

## Closure Report Format
**Options:**
- Markdown document
- PDF report
- Plain text summary

**Selection:** Markdown document

**Notes:** Standardized format (`v2.7-closure-report.md`) is preferred for version control and readability. Must include Starting State, Triage Batch Details, Decision Matrix Summary, and Final Metrics.

## Invariant Failures Policy
**Options:**
- Fail build immediately
- Log warnings and continue
- Ask user for confirmation

**Selection:** Fail build immediately

**Notes:** Strict schema validation is required. No "soft warnings" are allowed during artifact compilation.

## Deferred Ideas
- Tracking time spent per curation decision.
- Automating future low-support triage based on heuristics beyond simple frequency.
