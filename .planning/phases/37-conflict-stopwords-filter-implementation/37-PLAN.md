---
phase: 37
plan_id: "37-01"
title: "Conflict Stopwords Filter Implementation"
wave: 1
depends_on: []
files_modified:
  - "data/inference/conflict_stopwords.v1.json"
  - "src/inference/types.ts"
  - "src/inference/seed_profile.ts"
  - "src/cli/parse_args.ts"
  - "src/cli/compile.ts"
  - "src/compiler/compile_all.ts"
  - "src/inference/seed_profile.test.ts"
requirements: []
autonomous: true
must_haves:
  goal: "Implement the substring conflict stopwords filter per 36-POLICY-DRAFT.md"
  truths:
    - "Core behavior remains opt-in (no conflictStopwords by default)"
    - "CLI has a default to data/inference/conflict_stopwords.v1.json"
    - "Only bypass conflict when inferred.descriptor matches an approved stopword"
    - "Bypass does not trigger just because seed reference matches a stopword"
    - "Implementation relies on exact schema defined in Phase 36"
---

# Plan 37-01: Conflict Stopwords Filter Implementation

## Objective

Implement the conflict stopwords filter defined in Phase 36, ensuring the core remains opt-in and the CLI provides a default configuration path. Filtering must only occur if `inferred.descriptor` matches an approved stopword.

## Tasks

<task id="1">
<title>Create data/inference/conflict_stopwords.v1.json</title>
<type>execute</type>
<action>
Create the new JSON file at `data/inference/conflict_stopwords.v1.json` with the exact schema and 13 evaluated tokens from `36-POLICY-DRAFT.md`.
</action>
<acceptance_criteria>
- File exists at correct path.
- Contains all tokens from the draft.
- Valid JSON.
</acceptance_criteria>
</task>

<task id="2">
<title>Update core interfaces and logic</title>
<type>execute</type>
<read_first>
- src/inference/types.ts
- src/inference/seed_profile.ts
</read_first>
<action>
1. In `src/inference/types.ts`, add `readonly conflictStopwords?: ReadonlySet<string>` to `SeedCorpusProfileOptions`.
2. In `src/inference/seed_profile.ts` (`buildSeedCorpusProfiles`), inside the `for (const inferred of inferredDescriptors)` loop, check if `options.conflictStopwords?.has(inferred.descriptor)` is true. If so, `continue` to bypass the conflict detection.
</action>
<acceptance_criteria>
- Core behavior remains identical when `conflictStopwords` is not provided.
- Bypass only checks `inferred.descriptor`, not the seed reference.
</acceptance_criteria>
</task>

<task id="3">
<title>Update CLI logic</title>
<type>execute</type>
<read_first>
- src/cli/parse_args.ts
- src/cli/compile.ts
- src/compiler/compile_all.ts
</read_first>
<action>
1. In `src/cli/parse_args.ts`, add `--conflict-stopwords` option and `DEFAULT_PATHS.conflictStopwordsPath` pointing to `data/inference/conflict_stopwords.v1.json`.
2. In `src/compiler/compile_all.ts`, update `CompileAllInputs` to include `readonly conflictStopwords?: ReadonlySet<string>` and pass it to `profileOptions`.
3. In `src/cli/compile.ts`, check if the stopwords file exists. If it is the default path and the file is missing, gracefully default to no stopwords (or log a warning). If the path was explicitly provided by the user via `--conflict-stopwords` and is missing, throw an explicit error. Load the JSON file (if present), filter tokens to only keep those where `approved === true`, convert to a `Set<string>`, and pass as `conflictStopwords` to `compileAll`. Add help documentation for the new flag.
</action>
<acceptance_criteria>
- CLI has `--conflict-stopwords` flag.
- Default path points to `data/inference/conflict_stopwords.v1.json`.
- Only approved tokens are added to the Set.
- Set is passed correctly down to the compiler.
- If the default file is missing, it gracefully handles it without crashing.
- If an explicitly provided `--conflict-stopwords` file is missing, the compile script fails with a clear error.
</acceptance_criteria>
</task>

<task id="4">
<title>Add unit tests</title>
<type>execute</type>
<read_first>
- src/inference/seed_profile.test.ts
</read_first>
<action>
Add tests in `src/inference/seed_profile.test.ts` to verify:
1. `seed_corpus_conflict` is NOT generated when `inferred.descriptor` is an approved stopword.
2. `seed_corpus_conflict` IS generated when `inferred.descriptor` is NOT an approved stopword (even if the seed is, though we only check inferred).
3. Without `conflictStopwords`, behavior is identical to existing (no suppression).
</action>
<acceptance_criteria>
- 3 new/updated tests covering the guardrails.
- `npm test` passes.
</acceptance_criteria>
</task>

## Verification
- [ ] `npm run compile` completes successfully and shows 14 fewer review items (if testing against v2 data).
- [ ] `npm test` passes.
- [ ] No other artifact metrics are unexpectedly changed.
