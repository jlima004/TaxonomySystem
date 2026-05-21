// Compiler barrel export
export type {
  CompiledAliases,
  CompilerValidationError,
  CompilerValidationResult,
} from './types.js'

export {
  makeCompilerError,
  combineResults,
  findNullsDeep,
} from './types.js'

export {
  validateCompiledTaxonomy,
  validateCompiledAliases,
  validateSimilarityGraph,
  validateAllOutputs,
} from './validate_output.js'

export { compileTaxonomy } from './compile_taxonomy.js'
export type { CompileTaxonomyOptions } from './compile_taxonomy.js'

export { compileAliases } from './compile_aliases.js'
export type { CompileAliasesOptions } from './compile_aliases.js'

export { compileAll } from './compile_all.js'
export type { CompileAllInputs, CompileAllOptions, CompileAllResult } from './compile_all.js'

export {
  ALIASES_FILENAME,
  CompileWriteError,
  SIMILARITY_FILENAME,
  TAXONOMY_FILENAME,
  writeCompileResults,
} from './write_outputs.js'
