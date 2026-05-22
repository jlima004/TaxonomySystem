# Phase 7: Data Quality & Inference Hardening - Pattern Map

**Mapped:** 2026-05-21  
**Files analyzed:** 26 new/modified files  
**Analogs found:** 26 / 26

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/analyzer/descriptor_sanitizer.ts` | utility | transform | `src/inference/noise.ts` | role-match |
| `src/analyzer/alias_canonicalization.ts` | utility | transform | `src/analyzer/alias_candidates.ts` | role-match |
| `src/analyzer/analyze_corpus.ts` | service | batch/transform | `src/analyzer/analyze_corpus.ts` | exact |
| `src/analyzer/cooccurrence.ts` | service | batch/transform | `src/analyzer/cooccurrence.ts` | exact |
| `src/analyzer/frequency.ts` | service | batch/transform | `src/analyzer/cooccurrence.ts` | role-match |
| `src/analyzer/alias_candidates.ts` | service | batch/transform | `src/analyzer/alias_candidates.ts` | exact |
| `src/inference/noise.ts` | service | transform | `src/inference/noise.ts` | exact |
| `src/inference/placement_scoring.ts` | service | transform | `src/compiler/compile_taxonomy.ts` | data-flow-match |
| `src/inference/seed_profile.ts` | service | batch/transform | `src/inference/seed_profile.ts` | exact |
| `src/inference/build_similarity_graph.ts` | service | batch/transform | `src/inference/build_similarity_graph.ts` | exact |
| `src/types/inference.ts` | model | transform | `src/types/inference.ts` | exact |
| `src/types/similarity.ts` | model | transform | `src/types/inference.ts` | role-match |
| `src/compiler/compile_taxonomy.ts` | service | batch/transform | `src/compiler/compile_taxonomy.ts` | exact |
| `src/compiler/quality_gates.ts` | service | validation/transform | `src/compiler/validate_output.ts` | role-match |
| `src/compiler/validate_output.ts` | service | validation/transform | `src/compiler/validate_output.ts` | exact |
| `src/compiler/compile_all.ts` | service | batch/request-response | `src/compiler/compile_all.ts` | exact |
| `src/cli/compile.ts` | controller | file-I/O/request-response | `src/cli/compile.ts` | exact |
| `src/package.json` | config | request-response | `src/package.json` | exact |
| `data/inference/semantic_noise.v1.json` | config | transform | `data/inference/semantic_noise.v1.json` | exact |
| `data/inference/curated_relations.v1.json` | config | transform | `data/inference/curated_relations.v1.json` | exact |
| `data/inference/accord_map.v1.json` | config | transform | `data/inference/accord_map.v1.json` | exact |
| `src/tests/analysis/descriptor_sanitizer.test.ts` | test | validation/transform | `src/tests/inference/noise.test.ts` | role-match |
| `src/tests/analysis/alias_canonicalization.test.ts` | test | validation/transform | `src/tests/analysis/cooccurrence.test.ts` | role-match |
| `src/tests/inference/placement_scoring.test.ts` | test | validation/transform | `src/tests/compiler/compile_taxonomy.test.ts` | role-match |
| `src/tests/compiler/quality_gates.test.ts` | test | validation/transform | `src/tests/compiler/compile_all.test.ts` | role-match |
| `src/tests/cli/compile.test.ts` | test | file-I/O/request-response | `src/tests/cli/compile.test.ts` | exact |

## Pattern Assignments

### `src/analyzer/descriptor_sanitizer.ts` (utility, transform)

**Analog:** `src/inference/noise.ts`

**Imports pattern** (lines 1-3):
```typescript
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { CorpusNoiseSuggestion, NoiseDecision } from '../types/inference.js'
```

**Pure config/defaults pattern** (lines 5-16):
```typescript
const DEFAULT_NOISE_WEIGHT = 0.35
const DEFAULT_MIN_NOISE_SUGGESTION_FREQUENCY = 3

export type SemanticNoiseOptions = {
  readonly curatedNoiseDescriptors?: readonly string[]
  readonly downweightValue?: number
  readonly seedDescriptors?: readonly string[]
}
```

**Core transform + audit pattern** (lines 29-59):
```typescript
export const scoreSemanticNoise = (
  descriptor: string,
  options: SemanticNoiseOptions = {},
): NoiseDecision => {
  const normalized = normalizeDescriptor(descriptor)
  const curatedNoise = toNormalizedSet(options.curatedNoiseDescriptors)
  const seedDescriptors = toNormalizedSet(options.seedDescriptors)
  const downweightValue = options.downweightValue ?? DEFAULT_NOISE_WEIGHT
  const isCuratedNoise = curatedNoise.has(normalized)
  const seedException = isCuratedNoise && seedDescriptors.has(normalized)
  const downweighted = isCuratedNoise && !seedException

  return {
    descriptor: normalized,
    normalized_descriptor: normalized,
    weight: downweighted ? downweightValue : 1,
    reason: seedException
      ? 'curated_noise_seed_exception'
      : downweighted
        ? 'curated_semantic_noise_downweight'
        : 'not_curated_semantic_noise',
    source: isCuratedNoise ? 'curated' : 'corpus',
    seed_exception: seedException,
    downweighted,
    evidence: {
      curated_noise: isCuratedNoise,
      seed_descriptor: seedDescriptors.has(normalized),
      downweight_value: downweightValue,
    },
  }
}
```

**Apply to:** implement `sanitizeDescriptor({ raw, normalized, material_id, source })` as a no-I/O pure function with readonly types, default hard/pattern rules, and result union carrying deterministic audit evidence.

---

### `src/analyzer/alias_canonicalization.ts` (utility, transform)

**Analog:** `src/analyzer/alias_candidates.ts`

**Imports pattern** (lines 1-5):
```typescript
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { AliasCandidate, FrequencyMap } from '../types/analysis.js'
import type { TaxonomySeed } from '../types/seed.js'
import { encodePairKey } from './pair_key.js'
```

**Curated seed normalization pattern** (lines 71-88):
```typescript
const buildSeedPairSet = (aliasSeed?: DescriptorAliasSeed): Set<string> => {
  if (aliasSeed === undefined) {
    return new Set<string>()
  }

  const pairs = new Set<string>()
  for (const [raw, canonical] of Object.entries(aliasSeed)) {
    const normalizedRaw = normalizeDescriptor(raw)
    const normalizedCanonical = normalizeDescriptor(canonical)
    if (normalizedRaw.length === 0 || normalizedCanonical.length === 0 || normalizedRaw === normalizedCanonical) {
      continue
    }

    pairs.add(encodePairKey(normalizedRaw, normalizedCanonical))
  }

  return pairs
}
```

**Deterministic sorting pattern** (lines 307-317):
```typescript
return results.sort((left, right) => {
  if (left.score !== right.score) {
    return right.score - left.score
  }

  if (left.a !== right.a) {
    return left.a.localeCompare(right.a)
  }

  return left.b.localeCompare(right.b)
})
```

**Apply to:** normalize both alias seed keys and values before lookup; emit audit entries with `raw`, `normalized`, `canonical`, `alias_source: 'curated_seed'`; never read `analysis.aliasCandidates` for canonicalization.

---

### `src/analyzer/analyze_corpus.ts` + `src/analyzer/cooccurrence.ts` + `src/analyzer/frequency.ts` (service, batch/transform)

**Analog:** `src/analyzer/cooccurrence.ts`

**Imports pattern** (lines 1-3):
```typescript
import { normalizeDescriptor } from '../normalizer/normalize_descriptor.js'
import type { CoOccurrenceMap, FrequencyMap } from '../types/analysis.js'
import { encodePairKey } from './pair_key.js'
```

**Normalize/dedupe/sort per material** (lines 16-25):
```typescript
const toSortedDescriptorSet = (material: AnalysisMaterial): readonly string[] => {
  const descriptorSet = new Set<string>()
  for (const rawDescriptor of material.olfactory.descriptors) {
    const canonical = normalizeDescriptor(rawDescriptor)
    if (canonical.length > 0) {
      descriptorSet.add(canonical)
    }
  }

  return Array.from(descriptorSet).sort((a, b) => a.localeCompare(b))
}
```

**Single-pass frequency/co-occurrence update** (lines 38-59):
```typescript
export const computeFrequencyAndCoOccurrence = (corpus: readonly AnalysisMaterial[]): FrequencyAndCoOccurrence => {
  const frequency = new Map<string, number>()
  const cooccurrence = new Map<string, number>()

  for (const material of corpus) {
    const sortedDescriptors = toSortedDescriptorSet(material)

    for (const descriptor of sortedDescriptors) {
      frequency.set(descriptor, (frequency.get(descriptor) ?? 0) + 1)
    }

    for (let i = 0; i < sortedDescriptors.length - 1; i++) {
      const descriptorA = sortedDescriptors[i] ?? ''
      for (let j = i + 1; j < sortedDescriptors.length; j++) {
        const descriptorB = sortedDescriptors[j] ?? ''
        const key = encodePairKey(descriptorA, descriptorB)
        cooccurrence.set(key, (cooccurrence.get(key) ?? 0) + 1)
      }
    }
  }

  return { frequency, cooccurrence }
}
```

**Analyze orchestration pattern** (`src/analyzer/analyze_corpus.ts` lines 20-33):
```typescript
export const analyzeCorpus = (
  corpus: readonly AnalysisMaterial[],
  options?: AnalyzeCorpusOptions,
): CorpusAnalysis => {
  const { frequency, cooccurrence } = computeFrequencyAndCoOccurrence(corpus)
  const aliasCandidates = options?.aliasCandidates !== undefined
    ? findAliasCandidates(frequency, options.aliasCandidates)
    : []

  return {
    frequency,
    cooccurrence,
    aliasCandidates,
  }
}
```

**Apply to:** keep preprocessing before map updates: `normalizeDescriptor(raw)` -> `sanitizeDescriptor(...)` -> `canonicalizeDescriptor(...)` -> set dedupe/sort. Extend options and return audit side-channel only if planner adds it to analysis types.

---

### `src/inference/noise.ts` (service, transform)

**Analog:** `src/inference/noise.ts`

**Compatibility helper pattern** (lines 18-27):
```typescript
const toNormalizedSet = (values: readonly string[] = []): Set<string> => {
  const normalized = new Set<string>()
  for (const value of values) {
    const descriptor = normalizeDescriptor(value)
    if (descriptor.length > 0) {
      normalized.add(descriptor)
    }
  }
  return normalized
}
```

**Review-only suggestion pattern** (lines 65-99):
```typescript
export const suggestCorpusSemanticNoise = (
  analysis: CorpusAnalysis,
  options: CorpusNoiseSuggestionOptions = {},
): readonly CorpusNoiseSuggestion[] => {
  const minFrequency = options.minNoiseSuggestionFrequency ?? DEFAULT_MIN_NOISE_SUGGESTION_FREQUENCY
  const curatedNoise = toNormalizedSet(options.curatedNoiseDescriptors)
  const suggestions: CorpusNoiseSuggestion[] = []

  for (const [rawDescriptor, frequency] of analysis.frequency) {
    const descriptor = normalizeDescriptor(rawDescriptor)
    if (descriptor.length === 0 || frequency < minFrequency || curatedNoise.has(descriptor)) {
      continue
    }

    if (!looksLikeCorpusNoiseSuggestion(descriptor)) {
      continue
    }

    suggestions.push({
      descriptor,
      normalized_descriptor: descriptor,
      source: 'corpus',
      review_only: true,
      auto_applied: false,
      corpus_frequency: frequency,
      reason: 'high_frequency_generic_corpus_descriptor',
      evidence: {
        frequency,
        min_noise_suggestion_frequency: minFrequency,
      },
    })
  }

  return suggestions.sort((left, right) => left.descriptor.localeCompare(right.descriptor))
}
```

**Apply to:** add v1/v2 semantic-noise normalization before scoring; legacy `noise_descriptors` become `downweight` entries with the default; hard/pattern exclusions inform sanitizer/placement but corpus suggestions remain review-only.

---

### `src/inference/placement_scoring.ts` + `src/compiler/compile_taxonomy.ts` (service, transform)

**Analog:** `src/compiler/compile_taxonomy.ts`

**Support lookup pattern** (lines 23-26):
```typescript
const getSupport = (descriptor: string, seedDescriptor: string, analysis: CorpusAnalysis): number => {
  if (descriptor === seedDescriptor) return analysis.frequency.get(descriptor) ?? 0
  return analysis.cooccurrence.get(encodePairKey(descriptor, seedDescriptor)) ?? 0
}
```

**Placement tie-break pattern** (lines 28-51):
```typescript
const choosePlacement = (
  descriptor: string,
  subfamilySeedDescriptors: ReadonlyMap<string, readonly string[]>,
  analysis: CorpusAnalysis,
  minSupport: number,
): Placement | undefined => {
  let selected: Placement | undefined

  for (const [key, seedDescriptors] of subfamilySeedDescriptors) {
    const [familyId, subfamilyId] = key.split('|') as [string, string]
    const support = seedDescriptors.reduce((total, seedDescriptor) => total + getSupport(descriptor, seedDescriptor, analysis), 0)
    if (support < minSupport) continue

    if (
      selected === undefined ||
      support > selected.support ||
      (support === selected.support && subfamilyId.localeCompare(selected.subfamilyId) < 0)
    ) {
      selected = { familyId, subfamilyId, support }
    }
  }

  return selected
}
```

**Descriptor emit pattern** (lines 81-96):
```typescript
const corpusBySubfamily = new Map<string, CanonicalDescriptor[]>()
for (const inferred of profileResult.inferred_descriptors) {
  const placement = choosePlacement(inferred.descriptor, seedDescriptorsBySubfamily, analysis, minSupport)
  if (placement === undefined) continue

  const key = `${placement.familyId}|${placement.subfamilyId}`
  const descriptor: CanonicalDescriptor = {
    id: inferred.descriptor,
    source: 'corpus',
    frequency: inferred.corpus_count,
    status: 'candidate',
    review_required: true,
    corpus_derived: true,
  }
  corpusBySubfamily.set(key, [...(corpusBySubfamily.get(key) ?? []), descriptor])
}
```

**Apply to:** move score formula into pure `scoreCandidatePlacement(candidate, subfamily, evidence, options)` with thresholds; `compileTaxonomy` should consume pass/fail and route failures as `corpus_candidate_low_support` review items instead of silently skipping.

---

### `src/inference/seed_profile.ts` + review queue producers (service, batch/transform)

**Analog:** `src/inference/seed_profile.ts`

**Review item factory pattern** (lines 55-67):
```typescript
const makeSeedExceptionReview = (profile: DescriptorProfile, noise: NoiseDecision): ReviewQueueItem => ({
  type: 'semantic_noise_seed_exception',
  severity: 'medium',
  affected: {
    descriptor: profile.descriptor,
    subfamily: profile.subfamily_id,
    family: profile.family_id,
  },
  evidence: noise.evidence,
  suggested_action: 'audit_seed_noise_overlap',
  source: 'seed',
  reason: 'seed descriptor appears in curated semantic noise list and was not downweighted',
})
```

**Corpus candidate creation pattern** (lines 131-156):
```typescript
const inferredDescriptors: InferredDescriptor[] = []
for (const [rawDescriptor, frequency] of analysis.frequency) {
  const descriptor = normalizeDescriptor(rawDescriptor)
  if (descriptor.length === 0 || seedDescriptorSet.has(descriptor) || frequency < minCorpusFrequency) {
    continue
  }

  const noise = scoreSemanticNoise(descriptor, makeNoiseOptions(options, seedDescriptors))
  const inferred: InferredDescriptor = {
    descriptor,
    source: 'corpus',
    status: 'candidate',
    corpus_derived: true,
    corpus_count: frequency,
    weight: noise.weight,
    evidence: {
      corpus_frequency: frequency,
      min_corpus_frequency: minCorpusFrequency,
    },
    ...(noise.downweighted ? { noise } : {}),
  }
  inferredDescriptors.push(inferred)
  if (noise.downweighted) {
    noiseDecisions.push(noise)
  }
}
```

**Review queue deterministic sort** (lines 178-187):
```typescript
return {
  profiles,
  inferred_descriptors: inferredDescriptors.sort((left, right) => left.descriptor.localeCompare(right.descriptor)),
  noise_decisions: noiseDecisions.sort((left, right) => left.descriptor.localeCompare(right.descriptor)),
  corpus_noise_suggestions: corpusNoiseSuggestions,
  review_queue: reviewQueue.sort((left, right) => {
    if (left.type !== right.type) return left.type.localeCompare(right.type)
    return (left.affected.descriptor ?? '').localeCompare(right.affected.descriptor ?? '')
  }),
}
```

---

### `src/inference/build_similarity_graph.ts` (service, batch/transform)

**Analog:** `src/inference/build_similarity_graph.ts`

**Graph input/options pattern** (lines 31-40):
```typescript
export type BuildSimilarityGraphInputs = {
  readonly curatedRelations: CuratedRelationsInput
  readonly accordMap: AccordMapInput
}

export type BuildSimilarityGraphOptions = {
  readonly threshold?: number
  readonly generatedAt?: string
  readonly weights?: FinalScoreWeights
}
```

**Evidence object omission pattern** (lines 137-149):
```typescript
const makeEvidence = (
  sharedDescriptors: readonly string[],
  cooccurrenceSupport: number,
  curatedRelation?: string,
  accordReference?: string,
  aliasEvidence?: readonly string[],
): SimilarityEdgeEvidence => ({
  ...(sharedDescriptors.length > 0 ? { shared_descriptors: sharedDescriptors } : {}),
  ...(cooccurrenceSupport > 0 ? { cooccurrence_support: cooccurrenceSupport } : {}),
  ...(curatedRelation !== undefined ? { curated_relation: curatedRelation } : {}),
  ...(accordReference !== undefined ? { accord_reference: accordReference } : {}),
  ...(aliasEvidence !== undefined && aliasEvidence.length > 0 ? { alias_evidence: aliasEvidence } : {}),
})
```

**Edge/review deterministic output pattern** (lines 238-259):
```typescript
const sortedEdges = edges.sort((left, right) => {
  if (left.source !== right.source) return left.source.localeCompare(right.source)
  return left.target.localeCompare(right.target)
})

return {
  version: GRAPH_VERSION,
  generated_at: options.generatedAt ?? DEFAULT_GENERATED_AT,
  threshold,
  dimensions: graphDimensions(weights),
  edges: sortedEdges,
  review_queue: reviewQueue.sort((left, right) => {
    if (left.type !== right.type) return left.type.localeCompare(right.type)
    return JSON.stringify(left.affected).localeCompare(JSON.stringify(right.affected))
  }),
  stats: {
    subfamily_count: subfamilies.length,
    edge_count: sortedEdges.length,
    density: possiblePairs === 0 ? 0 : sortedEdges.length / possiblePairs,
  },
}
```

**Apply to:** add `empty_curated_relations` / `empty_accord_map` review warnings and accept upstream review items or ensure `compileAll` merges them into `similarity.review_queue` with one comparator.

---

### `src/compiler/quality_gates.ts` + `src/compiler/validate_output.ts` (service, validation/transform)

**Analog:** `src/compiler/validate_output.ts`

**Validator shape pattern** (lines 18-27):
```typescript
export const validateCompiledTaxonomy = (
  data: unknown
): CompilerValidationResult => {
  const errors: ReturnType<typeof makeCompilerError>[] = []
  const warnings: ReturnType<typeof makeCompilerError>[] = []
  const A = 'taxonomy' as const

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: [makeCompilerError(A, 'INVALID_TYPE', '$', 'root must be an object')], warnings: [] }
  }
```

**Error accumulation/invariant pattern** (lines 187-223):
```typescript
const src = dObj['source']
const status = dObj['status']
const reviewReq = dObj['review_required']
const corpusDer = dObj['corpus_derived']

if (src === 'seed') {
  if (status !== 'curated') {
    errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `seed descriptor must have status 'curated', got '${String(status)}'`))
  }
  if (reviewReq !== false) {
    errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.review_required`, 'seed descriptor must have review_required: false'))
  }
  if (corpusDer !== false) {
    errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.corpus_derived`, 'seed descriptor must have corpus_derived: false'))
  }
} else if (src === 'corpus') {
  if (status !== 'candidate') {
    errors.push(makeCompilerError(A, 'INVALID_VALUE', `${dp}.status`, `corpus descriptor must have status 'candidate', got '${String(status)}'`))
  }
```

**Combined validation pattern** (lines 461-471):
```typescript
export const validateAllOutputs = (
  taxonomy: unknown,
  aliases: unknown,
  similarity: unknown
): CompilerValidationResult => {
  return combineResults(
    validateCompiledTaxonomy(taxonomy),
    validateCompiledAliases(aliases),
    validateSimilarityGraph(similarity),
  )
}
```

**Apply to:** keep schema validation plus semantic quality gates pure; add hard errors for hard-exclude terms, alias candidates in compiled aliases, score range, timestamp divergence, uniqueness, source/status inconsistencies; add warnings for soft/review items.

---

### `src/compiler/compile_all.ts` (service, batch/request-response)

**Analog:** `src/compiler/compile_all.ts`

**Imports/orchestration pattern** (lines 1-13):
```typescript
import type { DescriptorAliasSeed } from '../types/alias.js'
import type { CorpusAnalysis } from '../types/analysis.js'
import type { BuildSimilarityGraphInputs } from '../inference/build_similarity_graph.js'
import { buildSimilarityGraph } from '../inference/build_similarity_graph.js'
import { buildSeedCorpusProfiles } from '../inference/seed_profile.js'
import type { SeedCorpusProfileOptions } from '../inference/types.js'
import type { TaxonomySeed } from '../types/seed.js'
import type { SimilarityGraph } from '../types/similarity.js'
import type { CompiledTaxonomy } from '../types/taxonomy.js'
import { compileAliases } from './compile_aliases.js'
import { compileTaxonomy } from './compile_taxonomy.js'
import type { CompiledAliases, CompilerValidationResult } from './types.js'
import { validateAllOutputs } from './validate_output.js'
```

**Pure all-or-nothing assembly pattern** (lines 43-75):
```typescript
export const compileAll = (
  inputs: CompileAllInputs,
  options: CompileAllOptions,
): CompileAllResult => {
  const version = options.version ?? DEFAULT_VERSION
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const profileOptions: SeedCorpusProfileOptions = {
    curatedNoiseDescriptors: inputs.noiseConfig.noise_descriptors,
    downweightValue: inputs.noiseConfig.downweight_value,
  }
  const profileResult = buildSeedCorpusProfiles(inputs.seed, inputs.analysis, profileOptions)
  const taxonomy = compileTaxonomy(inputs.seed, profileResult, inputs.analysis, {
    version,
    generatedAt: options.generatedAt,
  })
  const aliases = compileAliases(inputs.aliasSeed, {
    version,
    generatedAt: options.generatedAt,
  })
  const similarity = buildSimilarityGraph(inputs.seed, inputs.analysis, inputs.graphInputs, {
    threshold,
    generatedAt: options.generatedAt,
  })
  const validation = validateAllOutputs(taxonomy, aliases, similarity)

  return {
    ok: validation.ok,
    taxonomy,
    aliases,
    similarity,
    validation,
  }
}
```

**Apply to:** normalize noise config here or at CLI boundary, merge profile/placement/sanitizer review items into similarity only, run quality gates before writes, and preserve filesystem purity.

---

### `src/cli/compile.ts` + `src/package.json` (controller/config, file-I/O/request-response)

**Analog:** `src/cli/compile.ts`

**Node built-in import + project imports pattern** (lines 1-11):
```typescript
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { analyzeCorpus } from '../analyzer/analyze_corpus.js'
import { compileAll } from '../compiler/compile_all.js'
import { CompileWriteError, writeCompileResults } from '../compiler/write_outputs.js'
import { loadAliasSeed } from '../loader/alias_loader.js'
import { loadCorpus } from '../loader/corpus_loader.js'
import { loadTaxonomySeed } from '../loader/seed_loader.js'
import type { AccordMapInput, CuratedRelationsInput } from '../types/inference.js'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from './parse_args.js'
```

**Read JSON / path fallback pattern** (lines 38-51):
```typescript
const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path, 'utf8')) as T

const exists = async (path: string): Promise<boolean> => access(path).then(() => true).catch(() => false)

const resolveReadablePath = async (path: string): Promise<string> => {
  if (await exists(path)) return path
  if (path.startsWith('data/')) {
    const parentDataPath = join('..', path)
    if (await exists(parentDataPath)) return parentDataPath
  }
  return path
}
```

**Status + validation failure pattern** (lines 102-129):
```typescript
console.log('  Analyzing corpus...')
const analysis = analyzeCorpus(corpus)
console.log(`  ✓ Analysis: ${analysis.frequency.size} unique descriptors, ${analysis.aliasCandidates.length} alias candidates`)

console.log('  Compiling...')
const result = compileAll(
  {
    seed,
    aliasSeed,
    analysis,
    graphInputs: { curatedRelations, accordMap },
    noiseConfig,
  },
  { version: args.version, generatedAt, threshold: 0.25 },
)

if (!result.ok) {
  printValidationErrors(new CompileWriteError(result.validation.errors))
  return 1
}

console.log(`  ✓ Taxonomy: ${result.taxonomy.stats.family_count} families, ${result.taxonomy.stats.descriptor_count} descriptors`)
console.log(`  ✓ Aliases: ${Object.keys(result.aliases.aliases).length} mappings`)
console.log(`  ✓ Similarity: ${result.similarity.stats.edge_count} edges`)

console.log('  Writing outputs...')
const files = await writeCompileResults(result, outputDir)
for (const file of files) console.log(`  ✓ ${file}`)
```

**Package script pattern** (`src/package.json` lines 6-13):
```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "precompile": "npm run build",
  "compile": "node dist/cli/compile.js",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Apply to:** print concise review/quality summary after successful compile; add `compile:quality` script only after internal quality flag/behavior exists; do not persist extra artifacts by default.

---

### `data/inference/*.json` (config, transform)

**Analogs:** existing data files.

**Legacy semantic noise shape** (`data/inference/semantic_noise.v1.json` lines 1-5):
```json
{
  "version": "1.0.0",
  "noise_descriptors": ["note", "nuance", "effect", "type", "quality"],
  "downweight_value": 0.35
}
```

**Empty curated input shape** (`data/inference/curated_relations.v1.json` lines 1-4):
```json
{
  "version": "1.0.0",
  "relations": []
}
```

**Empty accord input shape** (`data/inference/accord_map.v1.json` lines 1-4):
```json
{
  "version": "1.0.0",
  "accords": []
}
```

**Apply to:** preserve top-level `version`; migrate/accept v2 semantic noise categorization; populate relation/accord arrays with locked Phase 7 bootstrap candidates only.

---

### Test files (test, validation/transform or file-I/O)

**Analogs:** `src/tests/inference/noise.test.ts`, `src/tests/analysis/cooccurrence.test.ts`, `src/tests/compiler/compile_taxonomy.test.ts`, `src/tests/compiler/compile_all.test.ts`, `src/tests/cli/compile.test.ts`.

**Vitest import pattern** (`src/tests/inference/noise.test.ts` lines 1-8):
```typescript
import { describe, expect, it } from 'vitest'
import {
  buildSeedCorpusProfiles,
  scoreSemanticNoise,
  suggestCorpusSemanticNoise,
} from '../../inference/index.js'
import type { CorpusAnalysis } from '../../types/analysis.js'
import type { TaxonomySeed } from '../../types/seed.js'
```

**Inline fixtures pattern** (`src/tests/compiler/compile_taxonomy.test.ts` lines 8-23):
```typescript
const seed: TaxonomySeed = {
  version: '1.0.0',
  metadata: { created_at: '2026-01-01', author: 'test', description: 'test' },
  families: [
    {
      id: 'woody',
      name: 'Woody',
      subfamilies: [
        { id: 'dry_woods', name: 'Dry Woods', descriptors: ['cedar', 'sandalwood'] },
        { id: 'mossy_woods', name: 'Mossy Woods', descriptors: ['oakmoss'] },
      ],
    },
  ],
}

const analysis: CorpusAnalysis = {
```

**Determinism assertions pattern** (`src/tests/compiler/compile_all.test.ts` lines 52-58):
```typescript
it('produces deterministic output for fixed generatedAt', () => {
  const left = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
  const right = compileAll(inputs(), { generatedAt: '2026-01-01T00:00:00.000Z' })
  expect(JSON.stringify(left.taxonomy)).toBe(JSON.stringify(right.taxonomy))
  expect(JSON.stringify(left.aliases)).toBe(JSON.stringify(right.aliases))
  expect(JSON.stringify(left.similarity)).toBe(JSON.stringify(right.similarity))
})
```

**CLI temp file pattern** (`src/tests/cli/compile.test.ts` lines 20-49):
```typescript
const writeJson = (path: string, value: unknown): Promise<void> => writeFile(path, `${JSON.stringify(value)}\n`, 'utf8')

const writeFixtures = async (dir: string, aliases: Record<string, string> = { lemony: 'lemon' }) => {
  const paths = {
    seed: join(dir, 'seed.json'),
    aliases: join(dir, 'aliases.json'),
    corpus: join(dir, 'corpus.json'),
    relations: join(dir, 'relations.json'),
    accords: join(dir, 'accords.json'),
    noise: join(dir, 'noise.json'),
    out: join(dir, 'out'),
  }
  await writeJson(paths.seed, seed)
  await writeJson(paths.aliases, aliases)
  await writeJson(paths.corpus, corpus)
  await writeJson(paths.relations, { version: '1', relations: [] })
  await writeJson(paths.accords, { version: '1', accords: [] })
  await writeJson(paths.noise, { version: '1', noise_descriptors: ['note'], downweight_value: 0.35 })
  return paths
}
```

## Shared Patterns

### Pure function, no I/O in core
**Source:** `src/compiler/compile_all.ts` lines 43-75 and `src/tests/compiler/compile_all.test.ts` lines 42-46.  
**Apply to:** sanitizer, canonicalizer, placement scoring, quality gates, profile/review generation. Core functions return data; only CLI/write boundary touches filesystem.

### Deterministic ordering
**Source:** `src/analyzer/cooccurrence.ts` lines 16-25; `src/inference/build_similarity_graph.ts` lines 238-253; `src/inference/seed_profile.ts` lines 178-187.  
**Apply to:** descriptor sets, audit trails, alias audit, placement results, review queue, edges, tests.

### Review queue item shape
**Source:** `src/types/inference.ts` lines 3-18.
```typescript
export type InferenceReviewItem = {
  readonly type: string
  readonly severity: 'low' | 'medium' | 'high'
  readonly affected: {
    readonly descriptor?: string
    readonly subfamily?: string
    readonly family?: string
  }
  readonly evidence: Readonly<Record<string, unknown>>
  readonly suggested_action: string
  readonly confidence?: number
  readonly source?: InferenceDescriptorSource | 'curated' | 'alias'
  readonly reason?: string
}
```

### Schema/quality error handling
**Source:** `src/compiler/validate_output.ts` lines 21-33 and lines 461-471.  
**Apply to:** `quality_gates.ts` should return `CompilerValidationResult` and compose via `combineResults`; warnings do not set `ok: false` unless represented as errors.

### All-or-nothing writes
**Source:** `src/compiler/write_outputs.ts` lines 28-58.
```typescript
export const writeCompileResults = async (
  result: CompileAllResult,
  outputDir: string,
): Promise<string[]> => {
  if (!result.ok) {
    throw new CompileWriteError(result.validation.errors)
  }

  await mkdir(outputDir, { recursive: true })
  // write tmp files, then rename; cleanup temp files on error
}
```

### CLI error reporting
**Source:** `src/cli/compile.ts` lines 56-68.
```typescript
const printValidationErrors = (error: CompileWriteError): void => {
  const byArtifact = new Map<string, string[]>()
  for (const validationError of error.errors) {
    byArtifact.set(validationError.artifact, [
      ...(byArtifact.get(validationError.artifact) ?? []),
      `${validationError.code} ${validationError.path}: ${validationError.message}`,
    ])
  }
  for (const [artifact, errors] of byArtifact) {
    console.error(`  ${artifact}:`)
    for (const message of errors) console.error(`    - ${message}`)
  }
}
```

## No Analog Found

All planned files have close analogs in the existing TypeScript CLI/data pipeline. New modules (`descriptor_sanitizer.ts`, `alias_canonicalization.ts`, `placement_scoring.ts`, `quality_gates.ts`) should copy pure-transform, deterministic-sort, typed-review, and validator-composition patterns from the analogs above.

## Metadata

**Analog search scope:** `src/analyzer`, `src/inference`, `src/compiler`, `src/cli`, `src/types`, `src/tests`, `data/inference`, `src/package.json`  
**Files scanned:** 40+ via glob/read  
**Pattern extraction date:** 2026-05-21  
**Project instructions:** no root `AGENTS.md`; no project `.claude/skills/` or `.agents/skills/` found.
