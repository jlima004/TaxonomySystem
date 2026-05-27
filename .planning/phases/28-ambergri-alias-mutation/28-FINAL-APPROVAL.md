PERSISTED APPROVAL — Phase 28, Plan 01

Candidato:          ambergri
Operação:           alias_mutation
Alias target:       ambergris
Arquivo mutado:     data/taxonomy/descriptor_aliases.seed.json
Família alvo:       amber_resinous
Subfamília alvo:    amber
Artifact version:   2.4.0
generated_at:       2026-05-27T00:00:00.000Z

Aprovado por:       Jefferson Dcher
Data:               2026-05-27

Confirmação:
Estou ciente de que esta operação mapeará ambergri para ambergris como alias curado, agora que ambergris existe como seed válido.

Autorizo:
- adicionar "ambergri": "ambergris" em data/taxonomy/descriptor_aliases.seed.json;
- executar compile temporário em /tmp usando somente comandos/flags oficiais;
- validar os invariantes INV-3 a INV-7;
- publicar data/compiled/v2 como v2.4.0 somente se a validação em /tmp passar;
- gerar 28-01-SUMMARY.md, 28-VALIDATION.md e 28-CLOSURE.md.

Não autorizo:
- alterar data/taxonomy/taxonomy-seed.v2.json;
- alterar data/inference/*;
- alterar data/compiled/v1/*;
- alterar src/cli/parse_args.ts;
- alterar scripts/check-safety-guards.sh;
- alterar src/package.json;
- rodar Graphify;
- stagear ou commitar graphify-out/*;
- executar qualquer curadoria adicional além de ambergri → ambergris.

Fluxo aprovado:

1. Criar 28-FINAL-APPROVAL.md com o bloco acima.
2. Adicionar "ambergri": "ambergris" em descriptor_aliases.seed.json.
3. Rodar testes locais.
4. Compilar em /tmp com version=2.4.0 e generated_at fixo.
5. Validar INV-3 a INV-7.
6. Se PASS, publicar data/compiled/v2 como v2.4.0.
7. Criar summary/validation/closure.
8. Commit sem graphify-out/*.
