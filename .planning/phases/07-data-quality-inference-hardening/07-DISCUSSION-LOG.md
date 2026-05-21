# Phase 7: Data Quality & Inference Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-21
**Phase:** 07-data-quality-inference-hardening
**Areas discussed:** Descriptor sanitation, Semantic noise schema v2, Alias-aware analysis, Candidate placement scoring, Curated relations / accord bootstrap, Review queue population, Artifact quality gates, Seed taxonomy expansion

---

## Descriptor Sanitation

| Option | Description | Selected |
|--------|-------------|----------|
| Strict pre-analysis | After `normalizeDescriptor` and before frequency/co-occurrence; technical hard-excludes do not enter statistics; audit trail preserves `raw`, `normalized`, and reason. | yes |
| Review-only | Nothing is removed from statistics; sanitizer only marks suspects for review. | |
| Compiler-only filter | Filter only before `taxonomy.json`; statistics remain contaminated. | |
| Hybrid soft-first | Hard-exclude only obvious patterns; generic descriptors receive downweight/review. | |

**User's choice:** Strict pre-analysis.
**Notes:** Technical noise is excluded from frequency, co-occurrence, alias candidate pool, seed/corpus profiles, and placement scoring. Generic valid descriptors are handled by semantic noise/downweight.

---

## Semantic Noise Schema v2

| Option | Description | Selected |
|--------|-------------|----------|
| Categorized v2 | Schema with `hard_exclude`, `pattern_exclude`, and `downweight`; v1 flat list remains compatible. | yes |
| Flat list expanded | Keep a simple list and add terms. | |
| Two-tier only | Only exclude and downweight, no patterns. | |
| Review-first v2 | Categorized schema exists, but corpus-derived suggestions never apply automatically. | |

**User's choice:** Categorized v2.
**Notes:** Legacy v1 list maps to downweight. Seed descriptors are protected from automatic downweighting. Corpus-derived noise suggestions are review-only.

---

## Alias-Aware Analysis

| Option | Description | Selected |
|--------|-------------|----------|
| Canonicalize pre-analysis | `normalizeDescriptor(raw)` -> `sanitizeDescriptor` -> `canonicalizeDescriptor` before statistics. | yes |
| Profiles only | Aliases correct only seed profiles and compiled taxonomy. | |
| Frequency only | Aggregate frequency but not co-occurrence. | |
| Post-analysis aggregation | Compute raw stats and aggregate aliases afterward. | |

**User's choice:** Canonicalize pre-analysis.
**Notes:** Only curated alias seed canonicalizes. Alias candidates remain weak evidence and do not auto-merge.

---

## Candidate Placement Scoring

| Option | Description | Selected |
|--------|-------------|----------|
| Conservative score | Hard-exclude blocks; support and normalized support thresholds; semantic noise penalty; failed candidates go to review. | yes |
| Raise support only | Only increase `minCooccurrenceSupport`. | |
| Normalized support only | Use `support / frequency(candidate)` as primary rule. | |
| Inference-owned placement | Move placement entirely to inference now. | |
| Review-all candidates | Keep all corpus candidates out of taxonomy. | |

**User's choice:** Conservative score.
**Notes:** Defaults selected: `support >= 3`, `normalized_support >= 0.05`, `placement_score >= 0.35`. Placement should be a pure function and conceptually inference-owned.

---

## Curated Relations / Accord Bootstrap

| Option | Description | Selected |
|--------|-------------|----------|
| Manual bootstrap | Populate minimal curated relations/accords manually; empty inputs warn; positive inputs produce edges. | yes |
| Seed proximity fallback | Generate edges from seed/co-occurrence when inputs are empty. | |
| Warnings only | Keep inputs empty and only emit warnings. | |
| Heuristic bootstrap | Generate relations/accords by rules or corpus. | |
| Relations only | Bootstrap relations but leave accord map empty. | |

**User's choice:** Manual bootstrap.
**Notes:** No heuristic generation. Empty inputs remain valid but visible. Corpus/co-occurrence supports evidence only.

---

## Review Queue Population

| Option | Description | Selected |
|--------|-------------|----------|
| Similarity queue + CLI summary | Keep review queue in `similarity_matrix.json`; CLI summarizes; taxonomy keeps compact descriptor flags. | yes |
| Both artifacts | Duplicate queue in taxonomy and similarity artifacts. | |
| Compile report only | Keep review queue out of final artifacts. | |
| Hard gates only | Convert major issues into failures instead of review items. | |

**User's choice:** Similarity queue + CLI summary.
**Notes:** Review items are warnings by default and ordered deterministically.

---

## Artifact Quality Gates

| Option | Description | Selected |
|--------|-------------|----------|
| Default gates | `npm run compile` runs schema plus hard semantic gates; soft warnings do not fail; `compile:quality` can provide detail. | yes |
| Quality script only | Compile validates schema only; quality script runs separately. | |
| Warnings only | No semantic gate fails build. | |
| Strict fail-fast | Any semantic warning fails compile. | |

**User's choice:** Default gates.
**Notes:** Hard-exclude in `taxonomy.json` is a hard failure. Empty curated inputs are warnings; graph empty despite curated inputs is high warning or future hard gate.

---

## Seed Taxonomy Expansion

| Option | Description | Selected |
|--------|-------------|----------|
| Prepare only | Phase 7 hardens pipeline and records seed gaps, but does not expand seed broadly. | yes |
| Minimal manual expansion | Add a few priority families/subfamilies manually. | |
| Full v1 useful seed | Expand to a broader v1 taxonomy. | |
| Corpus-assisted suggestions | Corpus suggests new subfamilies, review-only. | |
| Defer entirely | Do not touch seed expansion or preparation. | |

**User's choice:** Prepare only.
**Notes:** Future seed expansion remains manual/curated and belongs in a separate phase/subphase.

---

## Agent's Discretion

- Exact module organization and function names.
- Exact evidence payload shape per review item type.
- Exact `compile:quality` report formatting.

## Deferred Ideas

- Broad seed taxonomy expansion.
- Automatic corpus-derived family/subfamily creation.
- Making graph-empty-with-curated-inputs a hard gate immediately.
