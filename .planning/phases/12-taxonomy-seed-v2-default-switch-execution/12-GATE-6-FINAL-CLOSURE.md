gate_6_result: pass
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 05
checked_at: 2026-05-25T02:34:04Z
rollback_success: true
default_paths_final: v2
data_compiled_v2_present: true
data_compiled_v1_present: true
release_notes_written: true
phase_12_closed: true

# Phase 12 Gate 6 Final Closure

Gate 6 closes Phase 12 after persisted approval, pre-switch validation, official v2 publication, atomic default switch, post-switch validation, rollback dry-run success, release notes, and tracking updates.

## Gate Evidence

| Gate | Result | Evidence |
|------|--------|----------|
| Gate 0 - Final approval | pass | `12-GATE-0-PREFLIGHT.md`, `12-FINAL-APPROVAL.md` |
| Gate 1 - Pre-switch revalidation | pass | `12-GATE-1-PRE-SWITCH-REVALIDATION.md` |
| Gate 2 - Official v2 publication | pass | `12-GATE-2-V2-PUBLICATION.md`, `data/compiled/v2/*` |
| Gate 3 - DEFAULT_PATHS switch | pass | `12-GATE-3-DEFAULT-PATHS-SWITCH.md`, `src/cli/parse_args.ts` |
| Gate 4 - Post-switch validation | pass | `12-GATE-4-POST-SWITCH-VALIDATION.md` |
| Gate 5 - Rollback dry-run | pass | `12-GATE-5-ROLLBACK-DRY-RUN.md` |
| Gate 6 - Release documentation | pass | `12-RELEASE-MIGRATION-NOTES.md`, README/tracking updates |

## Final State

| Check | Final state |
|-------|-------------|
| `DEFAULT_PATHS` | v2 defaults |
| `data/compiled/v2` | present, official v2 artifact set |
| `data/compiled/v1` | present, preserved v1 baseline/archive |
| v1 inputs | present and preserved |
| rollback dry-run | `rollback_success: true` |
| Phase 11 soft findings | accepted with policy, not claimed resolved |
| legacy alias exception | accepted and documented |

## Final Protected Diff Check

Protected paths were checked after rollback dry-run and documentation updates:

```bash
git diff --exit-code -- data/compiled/v1 data/compiled/v2 data/taxonomy/taxonomy-seed.v1.json data/taxonomy/taxonomy-seed.v2.json data/taxonomy/descriptor_aliases.seed.json data/inference/curated_relations.v1.json data/inference/curated_relations.v2.json data/inference/accord_map.v1.json data/inference/accord_map.v2.json
```

Required artifact presence checks:

```bash
test -f data/compiled/v2/taxonomy.json
test -f data/compiled/v2/descriptor_aliases.json
test -f data/compiled/v2/similarity_matrix.json
test -f data/compiled/v1/taxonomy.json
test -f data/compiled/v1/descriptor_aliases.json
test -f data/compiled/v1/similarity_matrix.json
```

Main defaults assertion:

```bash
node -e "import('./src/dist/cli/parse_args.js').then(({DEFAULT_PATHS})=>{const expected={seedPath:'data/taxonomy/taxonomy-seed.v2.json',relationsPath:'data/inference/curated_relations.v2.json',accordsPath:'data/inference/accord_map.v2.json',outputDir:'data/compiled/v2',version:'2.0.0'}; for (const [key,value] of Object.entries(expected)) if (DEFAULT_PATHS[key]!==value) throw new Error(key + '=' + DEFAULT_PATHS[key]); console.log('main defaults remain v2')})"
```

Result: pass.

## Documentation Checks

Release/migration notes state:

- v2 is the default.
- `data/compiled/v2` is the official v2 artifact set.
- `data/compiled/v1` remains preserved as baseline/archive.
- v1 inputs remain preserved.
- rollback was validated with `rollback_success: true`.
- explicit v1 fallback remains available through explicit paths.
- Phase 11 accepted soft findings and the legacy alias exception remain accepted with policy.

Forbidden claims were avoided:

- no claim that v1 was removed.
- no claim that v2 physically replaced `data/compiled/v1`.
- no claim that accepted soft findings were resolved.

## Closure Outcome

Phase 12 is closed. The main branch remains on v2 defaults, `data/compiled/v2` remains present, `data/compiled/v1` remains present, rollback has been validated in a temporary context, and final tracking has been updated.

Decision trace: SWITCH-D-44, SWITCH-D-45, SWITCH-D-46, SWITCH-D-47, SWITCH-D-48, SWITCH-D-49, SWITCH-D-50, SWITCH-D-51, SWITCH-D-52, SWITCH-D-55, SWITCH-D-58, SWITCH-D-59, SWITCH-D-62, SWITCH-D-63, SWITCH-D-64.
