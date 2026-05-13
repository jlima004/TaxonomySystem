export type DescriptorNode = {
  readonly id: string;
  readonly canonical: string;
  readonly aliases: readonly string[];
  readonly family_refs: readonly string[];
  readonly occurrence_count: number;
};

export type DescriptorRegistry = Map<string, DescriptorNode>;
