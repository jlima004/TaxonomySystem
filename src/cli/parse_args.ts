export type CompileCliArgs = {
  readonly seedPath: string
  readonly aliasPath: string
  readonly corpusPath: string
  readonly relationsPath: string
  readonly accordsPath: string
  readonly noisePath: string
  readonly outputDir: string
  readonly version: string
  readonly generatedAt: string | undefined
  readonly help: boolean
  readonly qualityReport: boolean
}

export const DEFAULT_PATHS = {
  seedPath: 'data/taxonomy/taxonomy-seed.v1.json',
  aliasPath: 'data/taxonomy/descriptor_aliases.seed.json',
  corpusPath: 'data/enriched_materials.json',
  relationsPath: 'data/inference/curated_relations.v1.json',
  accordsPath: 'data/inference/accord_map.v1.json',
  noisePath: 'data/inference/semantic_noise.v1.json',
  outputDir: 'data/compiled/v1',
  version: '1.0.0',
} as const

export class CliArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CliArgumentError'
  }
}

const FLAG_TO_KEY = {
  '--seed': 'seedPath',
  '--aliases': 'aliasPath',
  '--corpus': 'corpusPath',
  '--relations': 'relationsPath',
  '--accords': 'accordsPath',
  '--noise': 'noisePath',
  '--out': 'outputDir',
  '--version': 'version',
  '--generated-at': 'generatedAt',
} as const

const isValueFlag = (flag: string): flag is keyof typeof FLAG_TO_KEY => flag in FLAG_TO_KEY

const validateGeneratedAt = (value: string): void => {
  if (!value.endsWith('Z') || Number.isNaN(Date.parse(value))) {
    throw new CliArgumentError('--generated-at must be a parseable UTC ISO timestamp ending in Z')
  }
}

export const parseCompileArgs = (argv: readonly string[]): CompileCliArgs => {
  const parsed: CompileCliArgs = {
    ...DEFAULT_PATHS,
    generatedAt: undefined,
    help: false,
    qualityReport: false,
  }
  const mutable: Record<string, string | boolean | undefined> = { ...parsed }

  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index]
    if (flag === '--help') {
      mutable.help = true
      continue
    }

    if (flag === '--quality-report') {
      mutable.qualityReport = true
      continue
    }

    if (flag === undefined || !isValueFlag(flag)) {
      throw new CliArgumentError(`Unknown option: ${String(flag)}`)
    }

    const value = argv[index + 1]
    if (value === undefined || value.startsWith('--')) {
      throw new CliArgumentError(`Missing value for ${flag}`)
    }

    if (flag === '--generated-at') {
      validateGeneratedAt(value)
    }

    mutable[FLAG_TO_KEY[flag]] = value
    index += 1
  }

  return mutable as CompileCliArgs
}
