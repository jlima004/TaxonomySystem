# Phase 18: Docs/Help Current-State Cleanup - Research

**Researched:** 2026-05-26
**Domain:** Documentação do Estado Atual (README.md, v1.0.0, v2 default, safety guard e npm wrapper)
**Confidence:** HIGH — O escopo está estritamente delimitado por [18-CONTEXT.md](file:///.planning/phases/18-phase-18-docs-help-current-state-cleanup/18-CONTEXT.md) e as decisões de não mutabilidade de arquivos de código/dados protegidos estão mapeadas.

<user_constraints>
## Limitações do Usuário (de CONTEXT.md)

### Decisões Travadas

- **D-01:** A Phase 18 será estritamente limitada a docs/help current-state cleanup.
- **D-02:** Apenas documentação que descreve o estado atual pode ser corrigida (ex: [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) principal, documentação de uso, instructions de execução local, etc.).
- **D-03:** Documentação histórica correta (como closures de fases anteriores, ADRs antigas) deve ser totalmente preservada e não alterada.
- **D-04:** O escopo inclui a revisão do README, docs de uso e instruções de uso do safety guard e seu wrapper (`npm run safety:guard`).
- **D-05:** O escopo exclui explicitamente qualquer tipo de curadoria de dados, Graphify lifecycle, hooks, CI, artifacts oficiais de dados/taxonomia e mudanças em scripts do `package.json`.
- **D-06:** Qualquer modificação realizada nesta fase deve ser estritamente documental e não-mutante em relação a dados e códigos protegidos.

### Restrições Adicionais do Usuário

**Permitido:**
- revisar [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md);
- revisar docs/usage atuais, se existirem (nenhum arquivo externo de uso além do README principal foi encontrado para o TaxonomySystem);
- documentar v1.0.0 (baseline/archive);
- documentar v2 default;
- documentar [scripts/check-safety-guards.sh](file:///home/jlima/Projetos/TaxonomySystem/scripts/check-safety-guards.sh);
- documentar `npm run safety:guard` (definido em [src/package.json](file:///home/jlima/Projetos/TaxonomySystem/src/package.json)).

**Não permitido:**
- alterar `data/taxonomy/*`;
- alterar `data/inference/*`;
- alterar `data/compiled/v1/*`;
- alterar `data/compiled/v2/*`;
- alterar [src/cli/parse_args.ts](file:///home/jlima/Projetos/TaxonomySystem/src/cli/parse_args.ts);
- alterar [scripts/check-safety-guards.sh](file:///home/jlima/Projetos/TaxonomySystem/scripts/check-safety-guards.sh);
- alterar [src/package.json](file:///home/jlima/Projetos/TaxonomySystem/src/package.json);
- alterar hooks;
- alterar CI;
- tocar `graphify-out/*`;
- executar curadoria;
- regenerar artifacts.
</user_constraints>

<phase_requirements>
## Requisitos da Fase

| ID | Descrição | Suporte de Pesquisa |
|----|-----------|--------------------|
| **DOCS18-01** | Revisar o [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) principal para refletir a v2 default e v1 baseline. | O README principal já descreve parcialmente a v2, mas necessita de esclarecimentos sobre a promoção da v2 e o status de arquivamento da v1. |
| **DOCS18-02** | Documentar o safety guard [scripts/check-safety-guards.sh](file:///home/jlima/Projetos/TaxonomySystem/scripts/check-safety-guards.sh) e o script wrapper `npm run safety:guard`. | O README atual não menciona esses scripts de segurança implementados nas Phases 16 e 17. Precisamos documentar seu propósito (não-mutante) e como executá-los. |
| **DOCS18-03** | Garantir a preservação absoluta de arquivos protegidos de código e dados. | A verificação pré-commit e o script de segurança devem ser rodados localmente para validar que nenhuma modificação acidental ocorreu. |
</phase_requirements>

## Resumo da Pesquisa

Esta fase é puramente de documentação e auditoria do estado atual do projeto. Não há alteração de código ou de dados. O foco principal é atualizar o [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) na raiz do repositório para incluir as instruções e descrições do safety guard (`scripts/check-safety-guards.sh`) e do seu wrapper npm (`npm run safety:guard` definido no `package.json` de `src/`).

Além disso, o README deve consolidar a explicação de que a v2 da taxonomia olfativa agora é a versão padrão operacional e que a v1 é tratada como baseline histórica estável.

## Arquitetura de Documentação

### Estrutura do README.md Principal
A documentação atualizada incluirá:
1. Menção clara na introdução de que a versão padrão ativa é a v2.
2. Atualização das instruções de execução local e scripts disponíveis em `src/package.json`.
3. Inclusão de uma nova seção dedicada a **Safety Guards (Mecanismos de Segurança)**, explicando o script `scripts/check-safety-guards.sh`, o wrapper `npm run safety:guard`, os diretórios protegidos e a política de não-mutação aplicada.

## Evitando Armadilhas Comuns (Common Pitfalls)

### Pitfall 1: Alteração Acidental de Arquivos de Dados
- **O que dá errado:** Modificar arquivos sob `data/` ao rodar comandos de compilação ou curadoria.
- **Como evitar:** Não rodar `npm run compile` ou qualquer script de geração de dados nesta fase. O foco é estritamente de documentação.

### Pitfall 2: Links Relativos Incorretos no README.md
- **O que dá errado:** Referenciar scripts ou caminhos com caminhos relativos incorretos a partir da raiz.
- **Como evitar:** O script `scripts/check-safety-guards.sh` é relativo à raiz, enquanto o `npm run safety:guard` deve ser executado a partir do diretório `src/`. Essa distinção de contexto deve ficar explícita na documentação.

## Exemplos de Código para Documentar

### Como executar o Safety Guard local
```bash
# A partir da raiz do repositório
./scripts/check-safety-guards.sh

# Ou, se não estiver com permissão de execução
bash scripts/check-safety-guards.sh
```

### Como executar via wrapper npm
```bash
# A partir do diretório src/
npm run safety:guard
```

## Fontes

### Primárias (Alta Confiança)
- [18-CONTEXT.md](file:///.planning/phases/18-phase-18-docs-help-current-state-cleanup/18-CONTEXT.md)
- [scripts/check-safety-guards.sh](file:///home/jlima/Projetos/TaxonomySystem/scripts/check-safety-guards.sh)
- [src/package.json](file:///home/jlima/Projetos/TaxonomySystem/src/package.json)
- [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md)
