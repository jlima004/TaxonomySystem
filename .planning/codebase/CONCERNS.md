# Concerns

> Last mapped: 2026-05-12

## Technical Debt

### Low Severity

1. **Empty `src/` directory** — Root-level `src/` is empty, suggesting planned but unimplemented taxonomy system code
2. **No root `package.json`** — The root project has no package.json; only the engine sub-package has one. The taxonomy system will need its own project setup.
3. **Hardcoded normalization ranges** — `NORMALIZATION_RANGES` in `normalization.ts` are hardcoded constants. If the dataset evolves (new materials with extreme values), ranges may need updating.

## Known Issues

None identified — the engine is well-tested and stable.

## Security

- **No secrets in code** — no API keys, tokens, or credentials
- **No network access** — engine is fully offline
- **Large data file gitignored** — `data/enriched_materials.json` (70MB) is properly excluded from git

## Performance

### Data Loading Concern
- `data/enriched_materials.json` is 70MB — loading it into memory for batch processing will require attention
- No streaming/pagination infrastructure exists yet
- The engine processes one material at a time (no batch API)

### Computation Performance
- Engine operations are O(1) per material — just normalization + weighted average
- No performance concerns for the engine itself

## Fragile Areas

1. **Normalization ranges** (`engine/normalization.ts`) — tightly coupled to the chemical property ranges in the PubChem dataset. If data expands significantly, these constants need recalibration.
2. **Weight defaults** (`engine/weights.ts`) — currently based on domain knowledge; no empirical tuning infrastructure exists.

## Architectural Gaps for Taxonomy System

Based on `prompt.md`, the following are NOT yet implemented:
- **Taxonomy hierarchy** (family → subfamily → descriptors) — needs design and data structures
- **Descriptor alias normalization** — no NLP or string matching infrastructure
- **Similarity matrix** — no vector/matrix computation infrastructure
- **JSON schema validation** — no runtime schema validation for taxonomy data
- **CLI or API** — no entry point for running taxonomy operations
