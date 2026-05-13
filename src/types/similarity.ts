// Similarity Graph types — sparse similarity matrix output
// Represents similarity_matrix.json with multi-dimensional scoring

export type SimilarityDimension = {
  readonly id: string
  readonly name: string
  readonly weight: number
}

export type SimilarityEdge = {
  readonly source: string
  readonly target: string
  readonly score: number
  readonly dimensions: Readonly<Record<string, number>>
}

export type SimilarityStats = {
  readonly subfamily_count: number
  readonly edge_count: number
  readonly density: number
}

export type SimilarityGraph = {
  readonly version: string
  readonly generated_at: string
  readonly threshold: number
  readonly dimensions: readonly SimilarityDimension[]
  readonly edges: readonly SimilarityEdge[]
  readonly stats: SimilarityStats
}
