gate_2_result: pass
phase: 12-taxonomy-seed-v2-default-switch-execution
plan: 03
checked_at: 2026-05-25T02:06:37Z
source_temp_dir: /tmp/opencode/taxonomy-phase12-switch/v2-candidate
official_artifacts:
  - data/compiled/v2/taxonomy.json
  - data/compiled/v2/descriptor_aliases.json
  - data/compiled/v2/similarity_matrix.json
official_file_count: 3
temp_equivalence_cmp: pass
generated_at_policy: fixed 2026-01-01T00:00:00.000Z
default_paths_remain_v1: true
protected_paths_clean: true
src_cli_parse_args_unchanged: true
seed_inputs_unchanged: true
data_compiled_v1_unchanged: true

# Phase 12 Gate 2 V2 Publication

Gate 2 published the official v2 artifact set from the validated temporary output at `/tmp/opencode/taxonomy-phase12-switch/v2-candidate`.

Publication was limited to exactly three files under `data/compiled/v2`:

- `data/compiled/v2/taxonomy.json`
- `data/compiled/v2/descriptor_aliases.json`
- `data/compiled/v2/similarity_matrix.json`

## Equivalence

The official files were validated with `cmp -s` against the source temp files:

- `taxonomy.json`: pass
- `descriptor_aliases.json`: pass
- `similarity_matrix.json`: pass

## Scope

- `data/compiled/v2` contains exactly three files.
- `DEFAULT_PATHS` remain on v1.
- `src/cli/parse_args.ts` is unchanged.
- Seed/input files are unchanged.
- `data/compiled/v1` is unchanged.
- Existing unrelated `graphify-out/*` worktree changes were not included in publication scope.
