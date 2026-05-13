export type ValidationError = {
  readonly path: string
  readonly expected: string
  readonly received: string
}

export type ValidationResult<T = void> = {
  readonly ok: boolean
  readonly errors: readonly ValidationError[]
  readonly value?: T
}

export const makeError = (
  path: string,
  expected: string,
  received: string
): ValidationError => ({
  path,
  expected,
  received
})

export const makeResult = <T = void>(
  errors: readonly ValidationError[],
  value?: T
): ValidationResult<T> => {
  const result: any = {
    ok: errors.length === 0,
    errors
  }
  if (errors.length === 0 && value !== undefined) {
    result.value = value
  }
  return result as ValidationResult<T>
}
