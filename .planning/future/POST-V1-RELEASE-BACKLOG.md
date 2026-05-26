# Post-v1.0 Release Backlog

Este documento registra os candidatos a backlog identificados e priorizados após o fechamento global da release **v1.0.0**. Estes itens guiarão as futuras melhorias de infraestrutura, automação, documentação e curadoria de dados nas próximas iterações do sistema (como a versão v2.1).

## Itens Candidatos do Backlog

### 1. Infraestrutura e Automação de Segurança
- **Package script wrapper para `scripts/check-safety-guards.sh`**
  - Implementar um atalho nos scripts do `package.json` para simplificar a invocação local do script de guarda de segurança (ex.: `npm run guard`).
- **Hook `pre-commit` opcional**
  - Disponibilizar um hook de pre-commit opcional que execute localmente as verificações do `check-safety-guards.sh` antes de efetuar commits.
- **Verificação em CI opcional**
  - Integrar a execução do guarda de segurança no pipeline de Integração Contínua (CI) de modo opcional e não-bloqueante para auditoria.

### 2. Manutenção e Documentação
- **docs/help cleanup**
  - Revisar, limpar e harmonizar a documentação do projeto e as ajudas do CLI (`--help`) que acumularam redundâncias durante as transições de versão.

### 3. Ciclo de Vida de Artefatos do Graphify
- **Decisão sobre o ciclo de vida dos artefatos gerados pelo Graphify**
  - Definir e estabelecer a política definitiva para o diretório `graphify-out/*` (se deve ser mantido fora do git, regenerado apenas em commits específicos ou sincronizado via ciclo de vida próprio).

### 4. Evolução da Categoria e Dados (v2.1 Curation Backlog)
- **v2.1 curation backlog**
  - Consolidar as propostas pendentes de expansão de sementes, resolução das exceções/avisos suaves de aliases, curadoria de novos descritores e links de relações e acordos adicionais sob aprovação formal.
