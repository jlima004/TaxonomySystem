# Phase 18: Docs/Help Current-State Cleanup - Pattern Map

**Mapped:** 2026-05-26
**Files analyzed:** 1
**Analogs found:** 1 / 1

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) | documentation | n/a | [engine_calcula_tenacidade_volatilidade/README.md](file:///home/jlima/Projetos/TaxonomySystem/engine_calcula_tenacidade_volatilidade/README.md) | role-match |

## Pattern Assignments

### [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) (documentation)

**Analog:** [engine_calcula_tenacidade_volatilidade/README.md](file:///home/jlima/Projetos/TaxonomySystem/engine_calcula_tenacidade_volatilidade/README.md)

**Estrutura de documentação técnica clara de scripts locais:**
O README do subprojeto `engine_calcula_tenacidade_volatilidade` documenta como rodar scripts e interagir com as APIs de forma direta e estruturada. Seguiremos o mesmo padrão de listas de comandos executáveis e caixas de aviso (alertas) ou formatação de código clara para documentar o `scripts/check-safety-guards.sh` e o `npm run safety:guard`.

**Exemplo de Padrão do Analog:**
```markdown
## Como Executar
...
```

E também manteremos a compatibilidade visual e terminológica do `README.md` atual do projeto Taxonomy Builder.

## Shared Patterns

### Markdown Layout para Scripts Locais e Wrappers
- **Fonte:** Padrão clássico de documentação do repositório.
- **Aplicação:** [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md)
- **Estrutura:**
```markdown
### Safety Guards (Mecanismos de Segurança)

Para evitar mutações acidentais em arquivos protegidos de taxonomia/código central e impedir o staging de artefatos temporários do Graphify (`graphify-out/*`), o repositório conta com um script de segurança não-mutante.

- **Script Local:** `scripts/check-safety-guards.sh`
- **Wrapper NPM:** `npm run safety:guard` (executado de dentro da pasta `src/`)
```

## Anti-Patterns to Avoid

- **Placeholders ou TODOs de Documentação:** Não incluir marcas de "A fazer" ou "Escrever depois". Toda a documentação deve ser descrita de forma concreta.
- **Instruções Ambíguas de Diretório:** Não confundir a pasta onde o `npm run safety:guard` deve ser executado (`src/`) com a raiz do repositório (onde o script de segurança em bash é chamado). Indicar o diretório de execução explicitamente para cada comando.
