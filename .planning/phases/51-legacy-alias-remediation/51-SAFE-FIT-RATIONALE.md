# Phase 51 Safe-Fit Rationale: `ylang_ylang`

**Created before seed mutation:** 2026-06-06

## Before-State Proof

Before any data mutation, `npm run alias:integrity -- --json` was run from `src/` and confirmed the locked pre-remediation failure:

- Exit code: `1`
- `status`: `FAIL`
- `compiled_descriptor_count`: `340`
- `valid_target_count`: `17`
- `unresolved_target_count`: `1`
- Only unresolved alias: `ylang ylang -> ylang_ylang`

## Safe-Fit Affirmation

`ylang_ylang` is a legitimate olfactory descriptor for ylang-ylang (`Cananga odorata`), a canonical perfumery material with a rich floral odor profile commonly associated with white/yellow floral facets. This is not alias noise and not a mechanical repair invented solely to satisfy the gate; it names a real olfactory material already implied by the preserved legacy alias `ylang ylang -> ylang_ylang`.

## Placement Rationale

The selected placement is the existing `floral/floral_white` subfamily. This is a safe semantic fit because the current peer set is composed of canonical white-floral materials and facets:

- `jasmine`
- `tuberose`
- `gardenia`
- `orange_blossom`
- `lily_of_the_valley`
- `freesia`
- `osmanthus`
- `elderflower`
- `linden_flower`

`ylang_ylang` belongs naturally with these peers as a curated floral descriptor. No new family or subfamily is required.

## Boundary Confirmations

- The remediation path is `add_target`: add `ylang_ylang` as a curated seed descriptor.
- The existing alias map remains unchanged; `ylang ylang` continues to point to `ylang_ylang`.
- The remediation does **not** use, promote, or mutate the corpus candidate `ylang`; `ylang` remains separate review-required corpus evidence.
- The remediation does **not** add an exception entry to `data/taxonomy/alias_target_exceptions.v1.json`.
- Relations and accords remain untouched; missing coverage for `ylang_ylang` stays neutral/undefined for future curation.

## Decision

Safe fit is affirmed. Proceed with appending the single string `"ylang_ylang"` as the trailing descriptor under `floral/floral_white.descriptors`.
