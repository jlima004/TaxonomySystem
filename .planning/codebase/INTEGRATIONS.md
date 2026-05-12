# Integrations

> Last mapped: 2026-05-12

## External APIs

None — the engine is fully offline/deterministic. No API calls.

## Databases

None — data is stored as flat JSON files.

## Data Sources

### PubChem Enriched Dataset

- **File:** `data/enriched_materials.json` (~70MB)
- **Source:** Offline PubChem enrichment pipeline (TGSC + Scents & Flavors datasets merged)
- **Format:** JSON array of material objects with physicochemical and molecular properties
- **Properties used by engine:**
  - `physchem.molecular_weight` — Molecular weight (Da)
  - `physchem.vapor_pressure` — Vapor pressure (mmHg)
  - `molecular.xlogp` — Octanol-water partition coefficient
  - `molecular.rotatable_bonds` — Rotatable bond count
  - `molecular.tpsa` — Topological polar surface area (Å²)

## Auth Providers

None.

## Webhooks / Events

None.

## Key Observations

- **Fully offline architecture** — no network dependencies at runtime
- **Data pipeline is external** — enrichment pipeline runs separately, produces `enriched_materials.json`
- **Engine consumes but does not produce data** — read-only relationship with dataset
