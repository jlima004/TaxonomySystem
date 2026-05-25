import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { analyzeCorpus } from '../analyzer/analyze_corpus.js'
import { compileAll } from '../compiler/compile_all.js'
import { CompileWriteError, writeCompileResults } from '../compiler/write_outputs.js'
import { normalizeSemanticNoiseConfig } from '../inference/noise.js'
import { loadAliasSeed } from '../loader/alias_loader.js'
import { loadCorpus } from '../loader/corpus_loader.js'
import { loadTaxonomySeed } from '../loader/seed_loader.js'
import type { SemanticNoiseInput } from '../inference/noise.js'
import type { AccordMapInput, CuratedRelationsInput } from '../types/inference.js'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from './parse_args.js'

const printHelp = (): void => {
  console.log(`Taxonomy Compiler — v2 default

Usage: npm run compile -- [options]

Options:
  --seed <path>          Taxonomy seed JSON (default: ${DEFAULT_PATHS.seedPath})
  --aliases <path>       Curated descriptor aliases JSON (default: ${DEFAULT_PATHS.aliasPath})
  --corpus <path>        Enriched materials corpus JSON (default: ${DEFAULT_PATHS.corpusPath})
  --relations <path>     Curated relations JSON (default: ${DEFAULT_PATHS.relationsPath})
  --accords <path>       Accord map JSON (default: ${DEFAULT_PATHS.accordsPath})
  --noise <path>         Semantic noise JSON (default: ${DEFAULT_PATHS.noisePath})
  --out <dir>            Output directory (default: ${DEFAULT_PATHS.outputDir})
  --version <version>    Artifact version (default: ${DEFAULT_PATHS.version})
  --generated-at <iso>   Deterministic UTC timestamp ending in Z
  --quality-report       Print quality metrics summary (console only)
  --help                 Show this help
`)
}

const countBy = (items: readonly { type: string; severity: string }[], key: 'type' | 'severity'): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const item of items) counts[item[key]] = (counts[item[key]] ?? 0) + 1
  return counts
}

const printReviewSummary = (result: Awaited<ReturnType<typeof compileAll>>, qualityReport: boolean): void => {
  const reviewItems = result.similarity.review_queue
  const severityCounts = countBy(reviewItems, 'severity')
  const typeCounts = countBy(reviewItems, 'type')
  const qualityStatus = result.validation.errors.length === 0 ? 'PASS' : 'FAIL'

  console.log('  Review summary:')
  console.log(`    total=${reviewItems.length}`)
  console.log(`    review_items_by_severity=${JSON.stringify(severityCounts)}`)
  console.log(`    review_items_by_type=${JSON.stringify(typeCounts)}`)
  console.log(`    severity=${JSON.stringify(severityCounts)}`)
  console.log(`    type=${JSON.stringify(typeCounts)}`)
  console.log(`    validation_status=${result.validation.ok ? 'ok' : 'failed'}`)
  console.log(`    quality_gate_status=${qualityStatus}`)

  if (!qualityReport) return
  console.log('  Quality report:')
  console.log(`    quality_warnings=${result.validation.warnings.length}`)
  console.log(`    warnings=${result.validation.warnings.length}`)
  console.log(`    candidate_count=${reviewItems.filter(item => item.type.includes('candidate')).length}`)
  console.log(`    rejected_noise_count=${reviewItems.filter(item => item.type.includes('noise')).length}`)
  console.log(`    quality_metrics={edges:${result.similarity.stats.edge_count},density:${result.similarity.stats.density}}`)
  console.log(`    metrics={edges:${result.similarity.stats.edge_count},density:${result.similarity.stats.density}}`)
}

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

const resolveOutputDir = (path: string): string => path === DEFAULT_PATHS.outputDir ? join('..', path) : path

const countSubfamilies = (seed: Awaited<ReturnType<typeof loadTaxonomySeed>>): number =>
  seed.families.reduce((total, family) => total + family.subfamilies.length, 0)

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

export const runCompileCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  const args = parseCompileArgs(argv)
  if (args.help) {
    printHelp()
    return 0
  }

  const generatedAt = args.generatedAt ?? new Date().toISOString()

  console.log('Taxonomy Compiler — v2 default\n')
  console.log('  Loading inputs...')
  const seedPath = await resolveReadablePath(args.seedPath)
  const aliasPath = await resolveReadablePath(args.aliasPath)
  const corpusPath = await resolveReadablePath(args.corpusPath)
  const relationsPath = await resolveReadablePath(args.relationsPath)
  const accordsPath = await resolveReadablePath(args.accordsPath)
  const noisePath = await resolveReadablePath(args.noisePath)
  const outputDir = resolveOutputDir(args.outputDir)

  const seed = await loadTaxonomySeed(seedPath)
  console.log(`  ✓ Seed: ${seed.families.length} families, ${countSubfamilies(seed)} subfamilies`)
  const aliasSeed = await loadAliasSeed(aliasPath)
  console.log(`  ✓ Aliases: ${Object.keys(aliasSeed).length} curated mappings`)
  const corpus = await loadCorpus(corpusPath)
  console.log(`  ✓ Corpus: ${corpus.length} materials`)
  const curatedRelations = await readJson<CuratedRelationsInput>(relationsPath)
  console.log(`  ✓ Relations: ${curatedRelations.relations.length} curated`)
  const accordMap = await readJson<AccordMapInput>(accordsPath)
  console.log(`  ✓ Accords: ${accordMap.accords.length} curated`)
  const rawNoiseConfig = await readJson<SemanticNoiseInput>(noisePath)
  const noiseConfig = normalizeSemanticNoiseConfig(rawNoiseConfig)
  console.log(`  ✓ Noise: ${Object.keys(noiseConfig.downweight).length} downweighted descriptors`)

  console.log('  Analyzing corpus...')
  const analysis = analyzeCorpus(corpus, { curatedAliases: aliasSeed })
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
  printReviewSummary(result, args.qualityReport)

  console.log('  Writing outputs...')
  const files = await writeCompileResults(result, outputDir)
  for (const file of files) console.log(`  ✓ ${file}`)

  console.log('\nCompilation complete')
  return 0
}

const main = async (): Promise<void> => {
  process.exit(await runCompileCli())
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    if (error instanceof CliArgumentError) {
      console.error(`Argument error: ${error.message}`)
      process.exit(1)
    }
    if (error instanceof CompileWriteError) {
      printValidationErrors(error)
      process.exit(1)
    }
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
