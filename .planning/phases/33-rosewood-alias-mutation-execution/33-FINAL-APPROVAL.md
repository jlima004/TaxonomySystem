PERSISTED APPROVAL — Phase 33, Plan 01

Operação:           alias_mutation
Alias target:       rosewood
Arquivo mutado:     data/taxonomy/descriptor_aliases.seed.json
Family target:      woody
Subfamily target:   woody_dry
Artifact version:   2.5.0
generated_at:       2026-05-27T00:00:00.000Z

Aliases autorizados:
- boi_de_rose → rosewood
- bois_de_rose → rosewood

Aprovado por:       Jefferson Dcher
Data:               2026-05-27

Confirmação:
Estou ciente de que esta operação mapeará apenas boi_de_rose e bois_de_rose para rosewood como aliases curados, agora que rosewood existe como seed válido em woody / woody_dry.

Autorizo:
- adicionar "boi_de_rose": "rosewood" em data/taxonomy/descriptor_aliases.seed.json;
- adicionar "bois_de_rose": "rosewood" em data/taxonomy/descriptor_aliases.seed.json;
- executar compile temporário em /tmp usando somente comandos/flags oficiais;
- validar os invariantes definidos na Phase 33;
- publicar data/compiled/v2 como v2.5.0 somente se a validação em /tmp passar;
- gerar 33-01-SUMMARY.md, 33-VALIDATION.md e 33-CLOSURE.md.

Não autorizo:
- alterar data/taxonomy/taxonomy-seed.v2.json;
- mapear boi → rosewood;
- mapear pau_rosa → rosewood;
- alterar data/inference/*;
- alterar data/compiled/v1/*;
- alterar src/cli/parse_args.ts;
- alterar scripts/check-safety-guards.sh;
- alterar src/package.json;
- rodar Graphify;
- stagear ou commitar graphify-out/*;
- executar qualquer curadoria adicional além de boi_de_rose e bois_de_rose → rosewood.
