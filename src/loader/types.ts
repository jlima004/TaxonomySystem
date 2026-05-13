export type ValidationError = {
  readonly path: string
  readonly expected: string
  readonly received: string
}

export type ValidationResult = {
  readonly ok: boolean
  readonly errors: readonly ValidationError[]
}

export const make_error = (
  path: string,
  expected: string,
  received: string
): ValidationError => ({
  path,
  expected,
  received
})

export const make_result = (errors: readonly ValidationError[]): ValidationResult => ({
  ok: errors.length === 0,
  errors
})
