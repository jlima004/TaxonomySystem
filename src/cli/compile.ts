import { readFile } from 'node:fs/promises'
import { analyzeCorpus } from '../analyzer/analyze_corpus.js'
import { compileAll } from '../compiler/compile_all.js'
import { CompileWriteError, writeCompileResults } from '../compiler/write_outputs.js'
import { loadAliasSeed } from '../loader/alias_loader.js'
import { loadCorpus } from '../loader/corpus_loader.js'
import { loadTaxonomySeed } from '../loader/seed_loader.js'
import type { AccordMapInput, CuratedRelationsInput } from '../types/inference.js'
import { CliArgumentError, DEFAULT_PATHS, parseCompileArgs } from './parse_args.js'

type NoiseConfig = {
  readonly version?: string
  readonly noise_descriptors: readonly string[]
  readonly downweight_value: number
}

const printHelp = (): void => {
  console.log(`Taxonomy Compiler v1

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
  --help                 Show this help
`)
}

const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path, 'utf8')) as T

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

const main = async (): Promise<void> => {
  const args = parseCompileArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  const generatedAt = args.generatedAt ?? new Date().toISOString()

  console.log('Taxonomy Compiler v1\n')
  console.log('  Loading inputs...')
  const seed = await loadTaxonomySeed(args.seedPath)
  console.log(`  ✓ Seed: ${seed.families.length} families, ${countSubfamilies(seed)} subfamilies`)
  const aliasSeed = await loadAliasSeed(args.aliasPath)
  console.log(`  ✓ Aliases: ${Object.keys(aliasSeed).length} curated mappings`)
  const corpus = await loadCorpus(args.corpusPath)
  console.log(`  ✓ Corpus: ${corpus.length} materials`)
  const curatedRelations = await readJson<CuratedRelationsInput>(args.relationsPath)
  console.log(`  ✓ Relations: ${curatedRelations.relations.length} curated`)
  const accordMap = await readJson<AccordMapInput>(args.accordsPath)
  console.log(`  ✓ Accords: ${accordMap.accords.length} curated`)
  const noiseConfig = await readJson<NoiseConfig>(args.noisePath)
  console.log(`  ✓ Noise: ${noiseConfig.noise_descriptors.length} descriptors`)

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
    process.exit(1)
  }

  console.log(`  ✓ Taxonomy: ${result.taxonomy.stats.family_count} families, ${result.taxonomy.stats.descriptor_count} descriptors`)
  console.log(`  ✓ Aliases: ${Object.keys(result.aliases.aliases).length} mappings`)
  console.log(`  ✓ Similarity: ${result.similarity.stats.edge_count} edges`)

  console.log('  Writing outputs...')
  const files = await writeCompileResults(result, args.outputDir)
  for (const file of files) console.log(`  ✓ ${file}`)

  console.log('\nCompilation complete')
  process.exit(0)
}

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
