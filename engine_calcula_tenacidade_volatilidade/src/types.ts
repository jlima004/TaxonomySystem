export type MaterialInput = {
  physchem?: {
    molecular_weight?: number
    vapor_pressure?: string | number
  }
  molecular?: {
    xlogp?: number
    rotatable_bonds?: number
    tpsa?: number
  }
}

export type EngineOutput = {
  volatility_score: number
  tenacity_score: number
}

export type VolatilityWeights = {
  vaporPressure: number
  molecularWeight: number
  xlogp: number
}

export type TenacityWeights = {
  xlogp: number
  molecularWeight: number
  rotatableBonds: number
  tpsaPenalty: number
}

export type EngineOptions = {
  volatilityWeights?: Partial<VolatilityWeights>
  tenacityWeights?: Partial<TenacityWeights>
}

export type NoteClassification = 'TOP NOTE' | 'HEART' | 'BASE'
