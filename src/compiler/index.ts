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
