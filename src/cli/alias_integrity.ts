import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateAliasTargetIntegrity } from '../compiler/alias_target_integrity.js'
import { DEFAULT_PATHS } from './parse_args.js'

type CliArgs = {
  json: boolean
  help: boolean
}

const parseArgs = (argv: readonly string[]): CliArgs => {
  return {
    json: argv.includes('--json'),
    help: argv.includes('--help'),
  }
}

const printHelp = (): void => {
  console.log(`Alias Target Integrity Proof CLI

Usage: npm run alias:integrity -- [options]

Options:
  --json     Output results in JSON format
  --help     Show this help
`)
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

export const runAliasIntegrityCli = async (argv: readonly string[] = process.argv.slice(2)): Promise<number> => {
  const args = parseArgs(argv)
  
  if (args.help) {
    printHelp()
    return 0
  }

  const aliasPath = await resolveReadablePath(DEFAULT_PATHS.aliasPath)
  const compiledTaxonomyPath = await resolveReadablePath(join(DEFAULT_PATHS.outputDir, 'taxonomy.json'))
  const exceptionPolicyPath = await resolveReadablePath('data/taxonomy/alias_target_exceptions.v1.json')

  const aliasSeed = await readJson<Record<string, string>>(aliasPath)
  const compiledTaxonomy = await readJson<{ families: { subfamilies: { descriptors: { id: string }[] }[] }[] }>(compiledTaxonomyPath)
  const exceptionPolicy = await readJson<unknown>(exceptionPolicyPath)

  const descriptorIds = new Set<string>()
  for (const family of compiledTaxonomy.families) {
    for (const subfamily of family.subfamilies) {
      for (const descriptor of subfamily.descriptors) {
        descriptorIds.add(descriptor.id)
      }
    }
  }

  const result = validateAliasTargetIntegrity(aliasSeed, descriptorIds, exceptionPolicy, 'data/taxonomy/descriptor_aliases.seed.json')

  if (args.json) {
    console.log(JSON.stringify(result, null, 2))
    return result.status === 'PASS' ? 0 : 1
  }

  console.log(`Alias target integrity: ${result.status}`)
  console.log(`Seed aliases: ${result.seed_alias_count}`)
  console.log(`Compiled descriptors: ${result.compiled_descriptor_count}`)
  console.log(`Valid targets: ${result.valid_target_count}`)
  console.log(`Unresolved targets: ${result.unresolved_target_count}`)
  
  if (result.unresolved_target_count > 0) {
    console.log('\nUnresolved:')
    for (const entry of result.unresolved) {
      console.log(`- alias: ${entry.alias}`)
      console.log(`  target: ${entry.target}`)
      console.log(`  source: ${entry.source}`)
      console.log(`  exception: ${entry.exception_status}`)
      console.log(`  hint: ${entry.remediation_hint}`)
    }
  }

  return result.status === 'PASS' ? 0 : 1
}

const main = async (): Promise<void> => {
  process.exit(await runAliasIntegrityCli())
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
