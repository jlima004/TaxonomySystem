export type DescriptorSanitizerInput = {
  readonly raw: string
  readonly normalized: string
  readonly material_id?: string
  readonly source?: string
}

export type DescriptorSanitizerAuditEntry = {
  readonly raw: string
  readonly normalized: string
  readonly reason: 'hard_exclude' | 'pattern_exclude'
  readonly matched_rule: string
  readonly material_id?: string
  readonly source?: string
}

export type DescriptorSanitizerRules = {
  readonly hard_exclude: readonly string[]
  readonly pattern_exclude: readonly string[]
}

export type DescriptorSanitizerResult =
  | {
      readonly keep: true
      readonly descriptor: string
    }
  | {
      readonly keep: false
      readonly audit: DescriptorSanitizerAuditEntry
    }

export const DEFAULT_DESCRIPTOR_SANITIZER_RULES: DescriptorSanitizerRules = {
  hard_exclude: ['at', 'in', 'de', 'hour_s', 'dipropylene', 'glycol'],
  pattern_exclude: [
    '^substantivity_\\d+$',
    '^general_comment_',
    '^odor_strength_',
    '^recommend_smelling_',
    '.*_at_\\d+_\\d+.*',
  ],
}

export const sanitizeDescriptor = (
  input: DescriptorSanitizerInput,
  rules: DescriptorSanitizerRules = DEFAULT_DESCRIPTOR_SANITIZER_RULES,
): DescriptorSanitizerResult => {
  const { raw, normalized, material_id, source } = input

  for (const hardExclude of rules.hard_exclude) {
    if (normalized === hardExclude) {
      return {
        keep: false,
        audit: {
          raw,
          normalized,
          reason: 'hard_exclude',
          matched_rule: hardExclude,
          ...(material_id === undefined ? {} : { material_id }),
          ...(source === undefined ? {} : { source }),
        },
      }
    }
  }

  for (const patternExclude of rules.pattern_exclude) {
    if (new RegExp(patternExclude).test(normalized)) {
      return {
        keep: false,
        audit: {
          raw,
          normalized,
          reason: 'pattern_exclude',
          matched_rule: patternExclude,
          ...(material_id === undefined ? {} : { material_id }),
          ...(source === undefined ? {} : { source }),
        },
      }
    }
  }

  return {
    keep: true,
    descriptor: normalized,
  }
}
